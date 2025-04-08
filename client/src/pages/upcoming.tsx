import { useQuery } from "@tanstack/react-query";
import {
  addDays,
  endOfWeek,
  isToday,
  isTomorrow,
  isWithinInterval,
} from "date-fns";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import EmptyState from "../components/empty-state";
import TaskCard from "../components/task-card";
import { useToast } from "../hooks/use-toast";

interface UpcomingProps {
  openTaskModal?: (taskId?: number) => void;
}

export default function Upcoming({ openTaskModal }: UpcomingProps) {
  const { toast } = useToast();
  const { t } = useTranslation("upcoming");

  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["/api/tasks"],
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

  // Filter and group tasks by period
  const filterAndGroupTasks = () => {
    const today = new Date();
    const todayTasks: any[] = [];
    const tomorrowTasks: any[] = [];
    const thisWeekTasks: any[] = [];
    const laterTasks: any[] = [];

    console.log("This are all the tasks: ", tasks);

    tasks.forEach((task: any) => {
      if (!task.dueDate) {
        // Skip tasks without due date
        return;
      }

      const dueDate = new Date(task.dueDate);

      if (isToday(dueDate)) {
        todayTasks.push(task);
      } else if (isTomorrow(dueDate)) {
        tomorrowTasks.push(task);
      } else if (
        isWithinInterval(dueDate, {
          start: addDays(today, 2),
          end: endOfWeek(today),
        })
      ) {
        thisWeekTasks.push(task);
      } else if (dueDate > today) {
        laterTasks.push(task);
      }
    });

    return {
      today: todayTasks,
      tomorrow: tomorrowTasks,
      thisWeek: thisWeekTasks,
      later: laterTasks,
    };
  };

  const filteredTasks = filterAndGroupTasks();
  const hasTasks = Object.values(filteredTasks).some(
    (group) => group.length > 0
  );

  console.log(filteredTasks);

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">{t("upcoming")}</h2>
        <p className="text-gray-500 mt-1">{t("description")}</p>
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
      ) : !hasTasks ? (
        <EmptyState
          title="No upcoming tasks"
          description="You don't have any upcoming tasks. Create a new task to get started."
          actionLabel="Add Task"
          onAction={() => openTaskModal && openTaskModal()}
        />
      ) : (
        <>
          {filteredTasks.today.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center text-primary">
                  {t("today")}
                </h3>
                <span className="text-sm text-gray-500">
                  {filteredTasks.today.length} {t("tasks")}
                </span>
              </div>

              <div className="space-y-3">
                {filteredTasks.today.map((task: any) => (
                  <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
                ))}
              </div>
            </div>
          )}

          {filteredTasks.tomorrow.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  {t("tomorrow")}
                </h3>
                <span className="text-sm text-gray-500">
                  {filteredTasks.tomorrow.length} {t("tasks")}
                </span>
              </div>

              <div className="space-y-3">
                {filteredTasks.tomorrow.map((task: any) => (
                  <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
                ))}
              </div>
            </div>
          )}

          {filteredTasks.thisWeek.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  {t("this_week")}
                </h3>
                <span className="text-sm text-gray-500">
                  {filteredTasks.thisWeek.length} {t("tasks")}
                </span>
              </div>

              <div className="space-y-3">
                {filteredTasks.thisWeek.map((task: any) => (
                  <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
                ))}
              </div>
            </div>
          )}

          {filteredTasks.later.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  {t("later")}
                </h3>
                <span className="text-sm text-gray-500">
                  {filteredTasks.later.length} {t("tasks")}
                </span>
              </div>

              <div className="space-y-3">
                {filteredTasks.later.map((task: any) => (
                  <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
