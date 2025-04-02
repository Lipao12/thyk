import { QueryClient, QueryFunction } from "@tanstack/react-query";
import * as localStorageService from "./local-storage";

function safeStringify(obj) {
  const seen = new WeakSet();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) return;
      seen.add(value);
    }
    return value;
  });
}

// Mock API response handler for local storage operations
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<any> {
  // Create a clean copy of the data to avoid circular references
  let cleanData = undefined;
  if (data) {
    try {
      // Convert to string and back to remove functions, circular refs, etc.
      cleanData = JSON.parse(safeStringify(data));
    } catch (err) {
      console.error("Error serializing data for local storage operation:", err);
      throw new Error("Could not serialize data. Please check for circular references.");
    }
  }

  // Parse URL to determine operation
  const urlParts = url.split('/');
  const resourceType = urlParts[2]; // e.g., 'tasks' or 'categories'
  const id = urlParts[3] ? parseInt(urlParts[3]) : undefined;
  const timeframe = urlParts[2] === 'tasks' && urlParts[3] === 'timeframe' ? urlParts[4] : undefined;


  // Handle operations based on method and URL pattern
  try {
    // Task operations
    if (resourceType === 'tasks') {
      // GET /api/tasks
      if (method === 'GET' && !id && !timeframe) {
        return localStorageService.getTasks();
      }
      // GET /api/tasks/:id
      else if (method === 'GET' && id && !timeframe) {
        const task = localStorageService.getTaskById(id);
        if (!task) throw new Error(`Task with ID ${id} not found`);
        return task;
      }
      // GET /api/tasks/timeframe/:timeframe
      else if (method === 'GET' && timeframe) {
        return localStorageService.getTasksByTimeframe(timeframe, new Date());
      }
      // POST /api/tasks (create)
      else if (method === 'POST') {
        return localStorageService.createTask(cleanData as any);
      }
      // PATCH /api/tasks/:id (update)
      else if (method === 'PATCH' && id) {
        const updatedTask = localStorageService.updateTask(id, cleanData as any);
        if (!updatedTask) throw new Error(`Task with ID ${id} not found`);
        return updatedTask;
      }
      // DELETE /api/tasks/:id
      else if (method === 'DELETE' && id) {
        const success = localStorageService.deleteTask(id);
        if (!success) throw new Error(`Task with ID ${id} not found`);
        return { success: true };
      }
    }
    // Category operations
    else if (resourceType === 'categories') {
      // GET /api/categories
      if (method === 'GET' && !id) {
        return localStorageService.getCategories();
      }
      // GET /api/categories/:id
      else if (method === 'GET' && id) {
        const category = localStorageService.getCategoryById(id);
        if (!category) throw new Error(`Category with ID ${id} not found`);
        return category;
      }
      // POST /api/categories (create)
      else if (method === 'POST') {
        return localStorageService.createCategory(cleanData as any);
      }
      // PATCH /api/categories/:id (update)
      else if (method === 'PATCH' && id) {
        const updatedCategory = localStorageService.updateCategory(id, cleanData as any);
        if (!updatedCategory) throw new Error(`Category with ID ${id} not found`);
        return updatedCategory;
      }
      // DELETE /api/categories/:id
      else if (method === 'DELETE' && id) {
        const success = localStorageService.deleteCategory(id);
        if (!success) throw new Error(`Category with ID ${id} not found`);
        return { success: true };
      }
    }

    throw new Error(`Unsupported operation: ${method} ${url}`);
  } catch (error) {
    console.error(`Error in local storage operation (${method} ${url}):`, error);
    throw error;
  }
}

// Local storage query function for React Query
export const getQueryFn: <T>(options: {
  on401: "returnNull" | "throw";
}) => QueryFunction<T> =
  () =>
  async ({ queryKey }) => {
    const url = queryKey[0] as string;
    
    try {
      return await apiRequest('GET', url);
    } catch (error) {
      console.error(`Error in query function for ${url}:`, error);
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
