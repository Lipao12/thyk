import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import EmptyState from "../components/empty-state";
import TaskCard from "../components/task-card";
import { useToast } from "../hooks/use-toast";

interface CompletedProps {
  openTaskModal?: (taskId?: number) => void;
}

export default function Completed({ openTaskModal }: CompletedProps) {
  const { t } = useTranslation("completed");
  const { toast } = useToast();

  const {
    data: allTasks = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["/api/tasks"],
  });

  useEffect(() => {
    if (error) {
      toast({
        title: t("task_loading_error.title"),
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleEditTask = (taskId: number) => {
    if (openTaskModal) {
      openTaskModal(taskId);
    }
  };

  // Filter completed tasks
  const completedTasks = allTasks.filter((task: any) => task.completed);

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">{t("completed_tasks")}</h2>
        <p className="text-gray-500 mt-1">
          {completedTasks.length}{" "}
          {completedTasks.length === 1
            ? t("completed_singular")
            : t("completed_plural")}
        </p>
      </div>

      {isLoading ? (
        <div className="py-8 flex justify-center">
          <div className="animate-pulse space-y-4 w-full">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"
              ></div>
            ))}
          </div>
        </div>
      ) : completedTasks.length === 0 ? (
        <EmptyState
          title={t("empty_state.title")}
          description={t("empty_state.description")}
          actionLabel={t("empty_state.action_label")}
          onAction={() => openTaskModal && openTaskModal()}
        />
      ) : (
        <div className="space-y-3">
          {completedTasks.map((task: any) => (
            <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
          ))}
        </div>
      )}
    </>
  );
}
