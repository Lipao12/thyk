import { useQuery } from "@tanstack/react-query";
import { getAuth } from "firebase/auth";
import {
  CheckCircle,
  Clock,
  Home,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "wouter";
import { useToast } from "../hooks/use-toast";
import { apiRequest, queryClient } from "../lib/queryClient";
import { Category } from "../types/schema";
import { ThykMascot } from "./thyk-logo";
import { Button } from "./ui/button";
import { ColorBadge } from "./ui/color-badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ScrollArea } from "./ui/scroll-area";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  openTaskModal: (task?: string) => void;
}

export default function Sidebar({
  isOpen,
  setIsOpen,
  openTaskModal,
}: SidebarProps) {
  const { t } = useTranslation("sidebar");
  const [location] = useLocation();
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newCategory, setNewCategory] = useState<{
    name: string;
    color: string;
  }>({
    name: "",
    color: "#7B57FF",
  }); // Updated default color
  const { toast } = useToast();
  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/categories");
      return response as Category[];
    },
  });

  const handleTaskDelete = async (category: Category) => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);
      await apiRequest("DELETE", `/api/categories/${category.id}`);

      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      queryClient.invalidateQueries({
        queryKey: ["/api/categories/timeframe"],
      });

      toast({
        title: t("category_deleted.title"),
        description: t("category_deleted.description"),
      });
    } catch (error) {
      toast({
        title: t("category_deleted_faild.title"),
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategory.name.trim()) {
      toast({
        title: "Category name required",
        description: "Please provide a name for the category",
        variant: "destructive",
      });
      return;
    }

    try {
      await apiRequest("POST", "/api/categories", {
        name: newCategory.name,
        color: newCategory.color,
        userId: userId,
      });

      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setNewCategory({ name: "", color: "#7B57FF" });
      setIsAddCategoryOpen(false);

      toast({
        title: "Category created",
        description: `Category "${newCategory.name}" has been created successfully`,
      });
    } catch (error) {
      toast({
        title: "Failed to create category",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const sidebarClass = isOpen
    ? "fixed inset-0 z-40 block w-full sm:w-64 bg-white dark:bg-gray-900 shadow-md h-screen sm:h-[calc(100vh-4rem)] sm:top-16 sm:sticky overflow-y-auto border-r border-slate-200 dark:border-slate-800"
    : "hidden md:block w-64 bg-white dark:bg-gray-900 shadow-md h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto border-r border-slate-200 dark:border-slate-800";

  return (
    <aside id="sidebar" className={sidebarClass}>
      <ScrollArea className="h-full custom-scrollbar">
        <div className="p-4 flex flex-col h-full">
          {/* Close button for mobile */}
          {isOpen && (
            <div className="flex justify-end md:hidden mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
          )}

          <div className="mb-6">
            <Button
              id="createTaskBtn"
              className="w-full flex items-center justify-center py-6 bg-thyk-gradient hover:opacity-90 text-white rounded-lg font-medium transition shadow-md"
              onClick={() => {
                openTaskModal(undefined);
              }}
            >
              <Plus className="h-5 w-5 mr-2" />
              {t("new_task")}
            </Button>
          </div>

          <nav>
            <div className="mb-2 px-4">
              <h3 className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                {t("overview")}
              </h3>
            </div>
            <ul className="space-y-1 mb-6">
              <li>
                <Link
                  href="/"
                  className={`flex items-center py-2.5 px-4 rounded-lg ${
                    location === "/"
                      ? "bg-slate-100 dark:bg-slate-800 font-medium"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  }`}
                >
                  <Home
                    className={`h-5 w-5 mr-3 ${
                      location === "/" ? "text-primary" : "text-slate-500"
                    }`}
                  />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/upcoming"
                  className={`flex items-center py-2.5 px-4 rounded-lg ${
                    location === "/upcoming"
                      ? "bg-slate-100 dark:bg-slate-800 font-medium"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  }`}
                >
                  <Clock
                    className={`h-5 w-5 mr-3 ${
                      location === "/upcoming"
                        ? "text-primary"
                        : "text-slate-500"
                    }`}
                  />
                  {t("upcoming")}
                </Link>
              </li>
              <li>
                <Link
                  href="/completed"
                  className={`flex items-center py-2.5 px-4 rounded-lg ${
                    location === "/completed"
                      ? "bg-slate-100 dark:bg-slate-800 font-medium"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  }`}
                >
                  <CheckCircle
                    className={`h-5 w-5 mr-3 ${
                      location === "/completed"
                        ? "text-primary"
                        : "text-slate-500"
                    }`}
                  />
                  {t("complete")}
                </Link>
              </li>
            </ul>

            <div className="mb-2 px-4">
              <h3 className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                {t("categories")}
              </h3>
            </div>
            <ul className="space-y-1">
              {isLoading ? (
                <li className="text-sm text-slate-500 px-4 py-2">
                  {t("loading_cat")}
                </li>
              ) : categories.length === 0 ? (
                <li className="text-sm text-slate-500 px-4 py-2">
                  {t("no_categories")}
                </li>
              ) : (
                categories.map((category: Category) => (
                  <li
                    key={category.id}
                    className="flex items-center py-2 px-4 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-auto"
                  >
                    <ColorBadge color={category.color} className="mr-3" />
                    <span className="text-sm">{category.name}</span>
                    <span className="ml-auto text-xs text-slate-500">
                      <div className="task-actions flex space-x-1 opacity-100">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary"
                          onClick={() => {}}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-slate-500 hover:text-accent dark:text-slate-400 dark:hover:text-accent"
                          onClick={() => {
                            handleTaskDelete(category);
                          }}
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {/* Count could be implemented with a separate query */}
                    </span>
                  </li>
                ))
              )}
              <li>
                <Dialog
                  open={isAddCategoryOpen}
                  onOpenChange={setIsAddCategoryOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center py-2 px-4 w-full text-left rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-secondary justify-start"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      <span className="text-sm">{t("add_category")}</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t("create_category")}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="category-name">
                          {t("name_category")}
                        </Label>
                        <Input
                          id="category-name"
                          placeholder="Work, Personal, Study..."
                          value={newCategory.name}
                          onChange={(e) =>
                            setNewCategory({
                              ...newCategory,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category-color">{t("color")}</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            id="category-color"
                            type="color"
                            className="w-12 h-10 p-1"
                            value={newCategory.color}
                            onChange={(e) =>
                              setNewCategory({
                                ...newCategory,
                                color: e.target.value,
                              })
                            }
                          />
                          <div className="flex-1">
                            <div
                              className="h-10 w-full rounded-md border"
                              style={{ backgroundColor: newCategory.color }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button
                          variant="outline"
                          onClick={() => setIsAddCategoryOpen(false)}
                        >
                          {t("cancel")}
                        </Button>
                        <Button
                          onClick={handleCreateCategory}
                          className="bg-primary hover:bg-primary/90"
                        >
                          {t("create_category")}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </li>
            </ul>
          </nav>

          <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-col items-center text-center gap-2">
              <ThykMascot className="scale-50 -mt-10 -mb-10" />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Thyk v1.0
              </p>
            </div>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}
