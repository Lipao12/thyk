import { LogOut, Menu, Moon, SunDim, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/theme-provider";
import { getInitials } from "../lib/utils";
import { ThykLogo } from "./thyk-logo";
import { Button } from "./ui/button";
import { ButtonLocale } from "./ui/button-locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

interface HeaderProps {
  toggleSidebar: () => void;
  openTaskModal: () => void;
  onLogout?: () => void;
  user?: {
    name?: string;
    email?: string;
    provider?: string;
  } | null;
}

export default function Header({ toggleSidebar, onLogout, user }: HeaderProps) {
  const { i18n } = useTranslation("header");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "pt" : "en";
    i18n.changeLanguage(newLang);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <header className="bg-white dark:bg-gray-800 drop-shadow-[0_10px_5px_rgba(100,100,100,0.1)] px-4 py-3 sticky top-0 z-50 ">
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
          {/*<Button
            onClick={openTaskModal}
            className="bg-thyk-gradient text-white hover:opacity-90 hidden sm:flex"
            size="sm"
          >
            <Plus className="mr-1 h-4 w-4" /> {t("new_task")}
          </Button>

          <div className="relative">
            <Button
              className="bg-slate-100 dark:bg-navy/70 hover:bg-slate-200 dark:hover:bg-navy p-2 rounded-full transition"
              variant="ghost"
              size="icon"
            >
              <Bell className="h-5 w-5" />
            </Button>
          </div>*/}

          <div className="relative">
            <ButtonLocale toggleLanguage={toggleLanguage} />
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
                {theme === "dark" ? <SunDim /> : <Moon />}
              </Label>
            </div>
          </div>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0 rounded-full bg-primary text-white"
                >
                  {user.name ? getInitials(user.name) : "U"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>{user.name || "User"}</span>
                </DropdownMenuItem>
                {user.email && (
                  <DropdownMenuItem disabled>
                    <span className="text-muted-foreground text-sm">
                      {user.email}
                    </span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive cursor-pointer"
                  onClick={onLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:block">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-medium">
                TY
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
