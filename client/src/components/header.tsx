import { Bell, Menu, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "../context/theme-provider";
import { ThykLogo } from "./thyk-logo";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

interface HeaderProps {
  toggleSidebar: () => void;
  openTaskModal: () => void;
}

export default function Header({ toggleSidebar, openTaskModal }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by mounting after first render
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm px-4 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            id="menuToggle"
            className="md:hidden p-1"
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
          >
            <Menu className="h-6 w-6" />
          </Button>

          <ThykLogo size="medium" />
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <Button
            onClick={openTaskModal}
            className="bg-thyk-gradient text-white hover:opacity-90 hidden sm:flex"
            size="sm"
          >
            <Plus className="mr-1 h-4 w-4" /> New Task
          </Button>

          <div className="relative">
            <Button
              className="bg-slate-100 dark:bg-navy/70 hover:bg-slate-200 dark:hover:bg-navy p-2 rounded-full transition"
              variant="ghost"
              size="icon"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>

          <div className="relative">
            <Button
              className="bg-slate-100 dark:bg-navy/70 hover:bg-slate-200 dark:hover:bg-navy p-2 rounded-full transition"
              variant="ghost"
              size="icon"
            >
              <Bell className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex items-center ml-1">
            <div className="flex items-center space-x-2">
              <Switch
                id="darkModeToggle"
                checked={theme === "dark"}
                onCheckedChange={() =>
                  setTheme(theme === "dark" ? "light" : "dark")
                }
              />
              <Label
                htmlFor="darkModeToggle"
                className="hidden sm:inline text-sm"
              >
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </Label>
            </div>
          </div>

          <div className="hidden sm:block">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-medium">
              TD
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
