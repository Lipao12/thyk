import { addDays, subDays } from "date-fns";
import { Category, Priority, TaskWithCategory } from "../types/schema";

// Generate today's date and some relative dates
const today = new Date();
const yesterday = subDays(today, 1);
const tomorrow = addDays(today, 1);
const nextWeek = addDays(today, 7);

// Mock categories
export const mockCategories: Category[] = [
  {
    id: 1,
    name: "Work",
    color: "#FF625A", // Coral from Thyk palette
    userId: 1,
  },
  {
    id: 2,
    name: "Personal",
    color: "#28B7D8", // Cyan from Thyk palette
    userId: 1,
  },
  {
    id: 3,
    name: "Health",
    color: "#7B57FF", // Purple from Thyk palette
    userId: 1,
  },
  {
    id: 4,
    name: "Learning",
    color: "#323B4E", // Navy from Thyk palette
    userId: 1,
  }
];

// Mock tasks
export const mockTasks: TaskWithCategory[] = [
  {
    id: 1,
    title: "Complete Thyk interface design",
    description: "Update all components with new color scheme and typography",
    dueDate: today,
    completed: false,
    priority: Priority.HIGH,
    userId: 1,
    categoryId: 1,
    createdAt: yesterday,
    category: mockCategories[0]
  },
  {
    id: 6,
    title: "Connect to Firebase",
    description: "Update all components with new color scheme and typography",
    dueDate: today,
    completed: false,
    priority: Priority.HIGH,
    userId: 1,
    categoryId: 1,
    createdAt: yesterday,
    category: mockCategories[0]
  },
  {
    id: 2,
    title: "Workout session",
    description: "30 minute cardio and strength training",
    dueDate: tomorrow,
    completed: false,
    priority: Priority.MEDIUM,
    userId: 1,
    categoryId: 3,
    createdAt: yesterday,
    category: mockCategories[2]
  },
  {
    id: 3,
    title: "Learn React hooks",
    description: "Complete tutorial on useContext and useMemo hooks",
    dueDate: nextWeek,
    completed: false,
    priority: Priority.LOW,
    userId: 1,
    categoryId: 4,
    createdAt: yesterday,
    category: mockCategories[3]
  },
  {
    id: 4,
    title: "Grocery shopping",
    description: "Buy fruits, vegetables, and meal ingredients",
    dueDate: today,
    completed: true,
    priority: Priority.MEDIUM,
    userId: 1,
    categoryId: 2,
    createdAt: yesterday,
    category: mockCategories[1]
  },
  {
    id: 5,
    title: "Project planning",
    description: "Create roadmap for Q2 projects",
    dueDate: tomorrow,
    completed: false,
    priority: Priority.HIGH,
    userId: 1,
    categoryId: 1,
    createdAt: today,
    category: mockCategories[0]
  }
];

// Initial data for local storage
export const initialData = {
  tasks: mockTasks,
  categories: mockCategories,
  nextTaskId: mockTasks.length + 1,
  nextCategoryId: mockCategories.length + 1
};