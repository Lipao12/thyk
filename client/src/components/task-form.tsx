import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "../context/auth-context";
import { useToast } from "../hooks/use-toast";
import { apiRequest, queryClient } from "../lib/queryClient";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/text-area";

interface TaskFormProps {
  taskId: string | null;
  onClose: () => void;
}

const formSchema = z.object({
  title: z.string().min(1, "Title must be at least 1 character"),
  description: z.string().max(500, "Description too long").optional(),
  dueDate: z
    .date()
    .min(
      new Date(new Date().setDate(new Date().getDate() - 1)), // yesterday
      "Due date cannot be in the past"
    )
    .optional()
    .nullable(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  categoryId: z.number().optional().nullable(),
  userId: z.string(), // Hardcoded for demo
});

export default function TaskForm({ taskId, onClose }: TaskFormProps) {
  const { toast } = useToast();
  const isEditing = taskId !== null;
  const [isTaskLoading, setIsTaskLoading] = useState(false);
  const { user } = useAuth();

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
  });

  const { data: task, isLoading: isFetchingTask } = useQuery({
    queryKey: ["/api/tasks", taskId],
    queryFn: () => apiRequest("GET", `/api/tasks/${taskId}`),
    enabled: isEditing, // Only fetch if editing
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: null,
      priority: "medium",
      categoryId: null,
      userId: user?.uid,
    },
  });

  useEffect(() => {
    if (task && isEditing) {
      form.reset({
        title: task.title,
        description: task.description || "",
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
        priority: task.priority,
        categoryId: task.categoryId || null,
        userId: task.userId || user?.uid,
      });
    }
  }, [task, isEditing, form]);

  useEffect(() => {
    if (!isEditing) {
      form.reset({
        title: "",
        description: "",
        dueDate: null,
        priority: "medium",
        categoryId: null,
        userId: user?.uid,
      });
    }
  }, [isEditing, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsTaskLoading(true);
      // Create a clean data object with only the fields we need
      const cleanValues: Record<string, any> = {
        title: values.title,
        description: values.description,
        dueDate: values.dueDate ? values.dueDate : null,
        priority: values.priority,
        categoryId: values.categoryId,
        userId: values.userId,
      };

      if (isEditing && taskId) {
        await apiRequest("PATCH", `/api/tasks/${taskId}`, cleanValues);
        toast({
          title: "Task updated",
          description: "Task has been updated successfully",
        });
      } else {
        await apiRequest("POST", "/api/tasks", cleanValues);
        toast({
          title: "Task created",
          description: "New task has been created successfully",
        });
      }

      form.reset(); // Reset to defaultValues for NEW tasks
      // Alternative: form.reset({ ...defaultValues, userId: 1 }) if needed

      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      // Invalidate all timeframe queries
      queryClient.invalidateQueries({
        predicate: (query) =>
          typeof query.queryKey[0] === "string" &&
          query.queryKey[0].startsWith("/api/tasks/timeframe/"),
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsTaskLoading(false);
    }
  };

  if (isTaskLoading && isEditing) {
    return (
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Loading task...</DialogTitle>
        </DialogHeader>
      </DialogContent>
    );
  }

  return (
    <DialogContent className="max-w-[360px] md:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{isEditing ? "Edit Task" : "Add New Task"}</DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Task Title*</FormLabel>
                <FormControl>
                  <Input placeholder="What needs to be done?" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add details about this task"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value || undefined}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  /*//onValueChange={(value) =>
                  //  field.onChange(value ? parseInt(value) : null)
                  //}
                  onValueChange={(value) =>
                    field.onChange(value === "null" ? null : Number(value))
                  }
                  value={field.value?.toString() || ""}*/
                  onValueChange={(value) =>
                    field.onChange(value === "null" ? 0 : parseInt(value))
                  }
                  value={field.value?.toString() || "null"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={field.value?.toString() || "null"}>
                      None
                    </SelectItem>
                    {(categories as any[]).map((category: any) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: category.color }}
                          ></div>
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Priority</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => field.onChange(value)}
                    defaultValue={field.value}
                    className="flex space-x-3"
                  >
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="low" className="text-primary " />
                      </FormControl>
                      <FormLabel className="font-normal">Low</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem
                          value="medium"
                          className="text-warning"
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Medium</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="high" className="text-accent" />
                      </FormControl>
                      <FormLabel className="font-normal">High</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter className="mt-6 flex flex-row justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isTaskLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-opacity-90 flex items-center justify-center gap-2"
              disabled={isTaskLoading}
            >
              {isTaskLoading && (
                <svg
                  className="w-4 h-4 animate-spin text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              )}

              {isTaskLoading
                ? isEditing
                  ? "Atualizando..."
                  : "Salvando..."
                : isEditing
                ? "Atualizar Tarefa"
                : "Salvar Tarefa"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
