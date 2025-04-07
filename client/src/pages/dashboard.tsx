import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import EmptyState from "../components/empty-state";
import TaskCard from "../components/task-card";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useToast } from "../hooks/use-toast";
import { formatDate } from "../lib/utils";
import { TimeFrame } from "../types/schema";

interface DashboardProps {
  openTaskModal?: (taskId?: number) => void;
}

export default function Dashboard({ openTaskModal }: DashboardProps) {
  const { t, i18n } = useTranslation("dashboard");
  const [timeframe, setTimeframe] = useState<TimeFrame>(TimeFrame.DAILY);
  const { toast } = useToast();

  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: [`/api/tasks/timeframe/${timeframe}`],
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading tasks",
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

  const groupTasksByDate = () => {
    const groups: Record<string, any[]> = {};

    (tasks as any[]).forEach((task: any) => {
      if (!task.dueDate) {
        const key = "No Date";
        if (!groups[key]) groups[key] = [];
        groups[key].push(task);
        return;
      }

      const date = new Date(task.dueDate);
      const key = formatDate(date, i18n.language);

      if (!groups[key]) groups[key] = [];
      groups[key].push(task);
    });

    return groups;
  };

  const taskGroups = groupTasksByDate();
  const today = new Date();

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{t("my_tasks")}</h2>
          {/*<div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center space-x-1"
            >
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center space-x-1"
            >
              <SortDesc className="h-4 w-4" />
              <span>Sort</span>
            </Button>
          </div>*/}
        </div>

        <div className="mt-5">
          <Tabs
            defaultValue={timeframe}
            onValueChange={(value) => setTimeframe(value as TimeFrame)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value={TimeFrame.DAILY}>{t("daily")}</TabsTrigger>
              <TabsTrigger value={TimeFrame.WEEKLY}>{t("weekly")}</TabsTrigger>
              <TabsTrigger value={TimeFrame.MONTHLY}>
                {t("monthly")}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
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
      ) : Object.keys(taskGroups).length === 0 ? (
        <EmptyState
          title={t("empty_state.title")}
          description={t("empty_state.description", { timeframe: timeframe })}
          actionLabel={t("empty_state.action_label")}
          onAction={() => openTaskModal && openTaskModal()}
        />
      ) : (
        Object.entries(taskGroups).map(([dateKey, dateTasks], index) => (
          <div key={dateKey} className={index > 0 ? "mt-8" : ""}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-primary"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                {dateKey}
              </h3>
              <span className="text-sm text-gray-500">
                {dateTasks.length} {t("tasks")}
              </span>
            </div>

            <div className="space-y-3">
              {dateTasks.map((task: any) => (
                <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
              ))}
            </div>
          </div>
        ))
      )}
    </>
  );
}
