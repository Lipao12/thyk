import { Clock, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "../hooks/use-toast";
import { apiRequest, queryClient } from "../lib/queryClient";
import { formatDate, formatTime } from "../lib/utils";
import { TaskWithCategory } from "../types/schema";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";

interface TaskCardProps {
  task: TaskWithCategory;
  onEdit: (taskId: number) => void;
}

export default function TaskCard({ task, onEdit }: TaskCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const { toast } = useToast();

  const handleTaskDelete = async () => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);
      await apiRequest("DELETE", `/api/tasks/${task.id}`);

      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/tasks/timeframe"] });

      toast({
        title: "Task deleted",
        description: "Task has been deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Failed to delete task",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTaskComplete = async () => {
    if (isCompleting) return;

    try {
      setIsCompleting(true);
      await apiRequest("PATCH", `/api/tasks/${task.id}`, {
        completed: !task.completed,
      });

      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/tasks/timeframe"] });

      toast({
        title: task.completed ? "Task marked incomplete" : "Task completed",
        description: `Task "${task.title}" has been ${
          task.completed ? "marked as incomplete" : "completed"
        } successfully`,
      });
    } catch (error) {
      toast({
        title: "Failed to update task",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsCompleting(false);
    }
  };

  const getBorderColor = () => {
    if (!task.category) return "border-slate-300 dark:border-slate-600";

    // Border color comes from category color
    if (task.category.color) {
      return `border-[${task.category.color}]`;
    }

    // Default category colors if no color is specified
    switch (task.category.name.toLowerCase()) {
      case "work":
        return "border-thyk-coral";
      case "personal":
        return "border-thyk-cyan";
      case "learning":
        return "border-thyk-purple";
      case "health":
        return "border-thyk-navy";
      default:
        return "border-slate-300 dark:border-slate-600";
    }
  };

  const getCategoryBadgeStyle = () => {
    if (!task.category)
      return {
        bg: "bg-slate-100 dark:bg-slate-800",
        text: "text-slate-500 dark:text-slate-300",
      };

    // If the category has a custom color, use it
    if (task.category.color) {
      // Create a lighter background for the badge with opacity
      const bgColor = task.category.color.startsWith("#")
        ? `bg-[${task.category.color}]/10 dark:bg-[${task.category.color}]/20`
        : "bg-slate-100 dark:bg-slate-800";

      return {
        bg: bgColor,
        text: `text-[${task.category.color}] dark:text-[${task.category.color}]`,
      };
    }

    // Default category styles if no color is specified
    switch (task.category.name.toLowerCase()) {
      case "work":
        return {
          bg: "bg-accent/10 dark:bg-accent/20",
          text: "text-accent dark:text-accent",
        };
      case "personal":
        return {
          bg: "bg-secondary/10 dark:bg-secondary/20",
          text: "text-secondary dark:text-secondary",
        };
      case "learning":
        return {
          bg: "bg-primary/10 dark:bg-primary/20",
          text: "text-primary dark:text-primary",
        };
      case "health":
        return {
          bg: "bg-navy/10 dark:bg-navy/20",
          text: "text-navy dark:text-navy",
        };
      default:
        return {
          bg: "bg-slate-100 dark:bg-slate-800",
          text: "text-slate-500 dark:text-slate-300",
        };
    }
  };

  const getPriorityBadge = () => {
    if (!task.priority) return null;

    switch (task.priority.toLowerCase()) {
      case "high":
        return (
          <div className="px-2 py-1 bg-accent/10 dark:bg-accent/20 text-accent dark:text-accent text-xs rounded-md font-medium">
            High
          </div>
        );
      case "medium":
        return (
          <div className="px-2 py-1 bg-warning/10 dark:bg-warning/20 text-warning dark:text-warning text-xs rounded-md font-medium">
            Medium
          </div>
        );
      case "low":
        return (
          <div className="px-2 py-1 bg-secondary/10 dark:bg-secondary/20 text-secondary dark:text-secondary text-xs rounded-md font-medium">
            Low
          </div>
        );
      default:
        return null;
    }
  };

  const categoryStyle = getCategoryBadgeStyle();

  return (
    <div
      className={`group task-card bg-white dark:bg-slate-900 rounded-lg shadow-sm hover:shadow-md transition-all p-4 border-l-4 ${getBorderColor()} ${
        task.completed ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="pt-0.5">
          <Checkbox
            checked={task.completed}
            onCheckedChange={handleTaskComplete}
            disabled={isCompleting}
            id={`task-checkbox-${task.id}`}
            className="rounded-full border-2 border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4
              className={`font-medium ${
                task.completed
                  ? "line-through text-slate-500 dark:text-slate-400"
                  : ""
              }`}
            >
              {task.title}
            </h4>
            <div className="task-actions flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary"
                onClick={() => onEdit(task.id)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-slate-500 hover:text-accent dark:text-slate-400 dark:hover:text-accent"
                onClick={handleTaskDelete}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {task.description && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {task.category && (
              <div
                className={`px-2 py-1 ${categoryStyle.bg} ${categoryStyle.text} text-xs rounded-md font-medium`}
              >
                {task.category.name}
              </div>
            )}

            {getPriorityBadge()}

            {task.dueDate && (
              <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                <Clock className="h-3.5 w-3.5 mr-1" />
                {formatTime(task.dueDate)
                  ? `${formatDate(task.dueDate)} at ${formatTime(task.dueDate)}`
                  : formatDate(task.dueDate)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
