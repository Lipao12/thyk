import {
  Category,
  Priority,
  Task,
  TaskWithCategory,
  TimeFrame,
} from "../types/schema";
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { initialData } from "./mock-data";

// localStorage keys
const STORAGE_KEY = "thyk_data";

// Helper function to initialize data
const initializeData = () => {
  const existingData = localStorage.getItem(STORAGE_KEY);
  if (!existingData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  }
  return JSON.parse(existingData);
};

// Get data from localStorage
const getData = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : initializeData();
};

// Save data to localStorage
const saveData = (data: any) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// Task CRUD Operations
export const getTasks = (): TaskWithCategory[] => {
  const data = getData();
  return data.tasks;
};

export const getTasksByTimeframe = (
  timeframe: string,
  date: Date
): TaskWithCategory[] => {
  const data = getData();
  const tasks = data.tasks;

  let start: Date;
  let end: Date;

  switch (timeframe.toLowerCase()) {
    case TimeFrame.DAILY:
      start = startOfDay(date);
      end = endOfDay(date);
      break;
    case TimeFrame.WEEKLY:
      start = startOfWeek(date);
      end = endOfWeek(date);
      break;
    case TimeFrame.MONTHLY:
      start = startOfMonth(date);
      end = endOfMonth(date);
      break;
    default:
      start = startOfDay(date);
      end = endOfDay(date);
  }

  return tasks.filter((task: TaskWithCategory) => {
    if (!task.dueDate) return false;
    const taskDate = new Date(task.dueDate);
    return taskDate >= start && taskDate <= end;
  });
};

export const getTaskById = (id: number): TaskWithCategory | undefined => {
  const data = getData();
  return data.tasks.find((task: TaskWithCategory) => task.id === id);
};

export const createTask = (task: Partial<Task>): TaskWithCategory => {
  const data = getData();

  // Find the associated category
  const category = task.categoryId
    ? data.categories.find((c: Category) => c.id === task.categoryId)
    : undefined;

  const newTask: TaskWithCategory = {
    id: data.nextTaskId,
    title: task.title || "New Task",
    description: task.description || null,
    dueDate: task.dueDate || null,
    completed: task.completed || false,
    priority: task.priority || Priority.MEDIUM,
    userId: 1, // Default user ID
    categoryId: task.categoryId || null,
    createdAt: new Date(),
    category,
  };

  data.tasks.push(newTask);
  data.nextTaskId += 1;
  saveData(data);

  return newTask;
};

export const updateTask = (
  id: number,
  taskUpdate: Partial<Task>
): TaskWithCategory | undefined => {
  const data = getData();
  const taskIndex = data.tasks.findIndex(
    (task: TaskWithCategory) => task.id === id
  );

  if (taskIndex === -1) return undefined;

  // If category ID is being updated, find the category
  let category = data.tasks[taskIndex].category;
  if (
    taskUpdate.categoryId !== undefined &&
    taskUpdate.categoryId !== data.tasks[taskIndex].categoryId
  ) {
    category =
      data.categories.find((c: Category) => c.id === taskUpdate.categoryId) ||
      null;
  }

  // Update the task
  const updatedTask = {
    ...data.tasks[taskIndex],
    ...taskUpdate,
    category,
  };

  data.tasks[taskIndex] = updatedTask;
  saveData(data);

  return updatedTask;
};

export const deleteTask = (id: number): boolean => {
  const data = getData();
  const taskIndex = data.tasks.findIndex(
    (task: TaskWithCategory) => task.id === id
  );

  if (taskIndex === -1) return false;

  data.tasks.splice(taskIndex, 1);
  saveData(data);

  return true;
};

// Category CRUD Operations
export const getCategories = (): Category[] => {
  const data = getData();
  return data.categories;
};

export const getCategoryById = (id: number): Category | undefined => {
  const data = getData();
  return data.categories.find((category: Category) => category.id === id);
};

export const createCategory = (category: Partial<Category>): Category => {
  const data = getData();

  const newCategory: Category = {
    id: data.nextCategoryId,
    name: category.name || "New Category",
    color: category.color || "#000000",
    userId: 1, // Default user ID
  };

  data.categories.push(newCategory);
  data.nextCategoryId += 1;
  saveData(data);

  return newCategory;
};

export const updateCategory = (
  id: number,
  categoryUpdate: Partial<Category>
): Category | undefined => {
  const data = getData();
  const categoryIndex = data.categories.findIndex(
    (category: Category) => category.id === id
  );

  if (categoryIndex === -1) return undefined;

  // Update the category
  const updatedCategory = {
    ...data.categories[categoryIndex],
    ...categoryUpdate,
  };

  data.categories[categoryIndex] = updatedCategory;

  // Also update category reference in all tasks
  data.tasks.forEach((task: TaskWithCategory, index: number) => {
    if (task.categoryId === id) {
      data.tasks[index].category = updatedCategory;
    }
  });

  saveData(data);

  return updatedCategory;
};

export const deleteCategory = (id: number): boolean => {
  const data = getData();
  const categoryIndex = data.categories.findIndex(
    (category: Category) => category.id === id
  );

  if (categoryIndex === -1) return false;

  data.categories.splice(categoryIndex, 1);

  // Remove category from tasks or set to null
  data.tasks.forEach((task: TaskWithCategory, index: number) => {
    if (task.categoryId === id) {
      data.tasks[index].categoryId = null;
      data.tasks[index].category = undefined;
    }
  });

  saveData(data);

  return true;
};

// Initialize data on import
initializeData();
