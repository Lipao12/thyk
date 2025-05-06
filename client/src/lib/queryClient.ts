import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where
} from "firebase/firestore";
import { db } from "./firebase";

function safeStringify(obj: any) {
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

  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  // Parse URL to determine operation
  const urlParts = url.split('/');
  const resourceType = urlParts[2]; // e.g., 'tasks' or 'categories'
  const id = urlParts[3] ?? undefined;
  //const id = urlParts[3] ? parseInt(urlParts[3]) : undefined;
  const timeframe = urlParts[2] === 'tasks' && urlParts[3] === 'timeframe' ? urlParts[4] : undefined;


  // Handle operations based on method and URL pattern
  try {
    // Task operations
    
    if (resourceType === 'tasks') {
      // GET /api/tasks
      if (method === 'GET' && !id && !timeframe ) {
        //return localStorageService.getTasks();
        const q = query(
          collection(db, "tasks"),
          where("userId", "==", userId)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
      // GET /api/tasks/:id
      else if (method === 'GET' && id && !timeframe) {
        const docRef = doc(db, "tasks", id.toString());
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) throw new Error(`Task with ID ${id} not found`);
        const task = { id: docSnap.id, ...docSnap.data() };

        if (task.userId !== userId) {
          throw new Error("Unauthorized access to task");
        }
        return { id: docSnap.id, ...docSnap.data() };

        /*const task = localStorageService.getTaskById(id);
        if (!task) throw new Error(`Task with ID ${id} not found`);
        return task;*/
      }
      // GET /api/tasks/timeframe/:timeframe
      else if (method === 'GET' && timeframe) {
        const now = new Date();
        let q;
        let start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        let end = new Date(start);

        if (timeframe === "daily") {
          end.setDate(start.getDate() + 1);
        } else if (timeframe === "weekly") {
          end.setDate(start.getDate() + 7); 
        } else if (timeframe === "monthly") {
          end.setMonth(start.getMonth() + 1); 
        } else {
          throw new Error("Unsupported timeframe");
        }
        
        q = query(
          collection(db, "tasks"),
          where("userId", "==", userId),
          where("dueDate", ">=", Timestamp.fromDate(start)),
          where("dueDate", "<", Timestamp.fromDate(end))
        );
        
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        //return localStorageService.getTasksByTimeframe(timeframe, new Date());
      }
      // POST /api/tasks (create)
      else if (method === 'POST') {
        if (cleanData.dueDate) {
          cleanData.dueDate = Timestamp.fromDate(new Date(cleanData.dueDate));
        }
      
        const defaultTask = {
          ...cleanData,
          completed: false,
        };
      
        const docRef = await addDoc(collection(db, "tasks"), defaultTask);
        const created = await getDoc(docRef);
        return { id: created.id, ...created.data() };
        //return localStorageService.createTask(cleanData as any);
      }
      // PATCH /api/tasks/:id (update)
      else if (method === 'PATCH' && id) {
        /*const updatedTask = localStorageService.updateTask(id, cleanData as any);
        if (!updatedTask) throw new Error(`Task with ID ${id} not found`);
        return updatedTask;*/
        if (cleanData.dueDate) {
          cleanData.dueDate = Timestamp.fromDate(new Date(cleanData.dueDate));
        }
      
        const taskRef = doc(db, "tasks", id.toString());
        await updateDoc(taskRef, cleanData as any);
        const updated = await getDoc(taskRef);
        return { id: updated.id, ...updated.data() };
      }
      // DELETE /api/tasks/:id
      else if (method === 'DELETE' && id) {
        await deleteDoc(doc(db, "tasks", id.toString()));
        return { success: true };
        /*const success = localStorageService.deleteTask(id);
        if (!success) throw new Error(`Task with ID ${id} not found`);
        return { success: true };*/
      }
    }
    // Category operations
    else if (resourceType === 'categories') {
      // GET /api/categories
      if (method === 'GET' && !id) {
        const q = query(
          collection(db, "categories"),
          where("userId", "==", userId)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        //return localStorageService.getCategories();
      }
      // GET /api/categories/:id
      else if (method === "GET" && id) {
        const docRef = doc(db, "categories", id.toString());
        const docSnap = await getDoc(docRef);
      
        if (!docSnap.exists()) {
          throw new Error(`Categoria com ID '${id}' não encontrada.`);
        }
      
        const categoryData = docSnap.data();
        const category = { id: docSnap.id, ...categoryData };
      
        if (category.userId !== userId) {
          throw new Error("Acesso não autorizado a esta categoria.");
        }
      
        return category;

        //const category = localStorageService.getCategoryById(id);
        //if (!category) throw new Error(`Category with ID ${id} not found`);
        //return category;
      }
      // POST /api/categories (create)
      else if (method === 'POST') {
        const docRef = await addDoc(collection(db, "categories"), cleanData);
        const created = await getDoc(docRef);
        return { id: created.id, ...created.data() };
        //return localStorageService.createCategory(cleanData as any);
      }
      // PATCH /api/categories/:id (update)
      else if (method === 'PATCH' && id) {   
        const taskRef = doc(db, "categories", id.toString());
        await updateDoc(taskRef, cleanData as any);
        const updated = await getDoc(taskRef);
        return { id: updated.id, ...updated.data() };
        //const updatedCategory = localStorageService.updateCategory(id, cleanData as any);
        //if (!updatedCategory) throw new Error(`Category with ID ${id} not found`);
        //return updatedCategory;
      }
      // DELETE /api/categories/:id
      else if (method === 'DELETE' && id) {
        await deleteDoc(doc(db, "categories", id.toString()));
        return { success: true };
       // const success = localStorageService.deleteCategory(id);
        //if (!success) throw new Error(`Category with ID ${id} not found`);
        //return { success: true };
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
