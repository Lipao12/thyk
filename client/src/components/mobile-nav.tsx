import { CheckCircle, Clock, Home, Plus, Tag } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "wouter";
import { Button } from "./ui/button";

interface MobileNavProps {
  openTaskModal: (taskId?: number) => void;
}

export default function MobileNav({ openTaskModal }: MobileNavProps) {
  const { t } = useTranslation("mobile");
  const [location] = useLocation();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-lg border-t border-slate-200 dark:border-slate-800 z-50">
      <div className="flex justify-around items-center h-16">
        <Link
          href="/"
          className={`flex flex-col items-center justify-center ${
            location === "/" ? "text-primary" : "text-slate-500"
          } flex-1 h-full`}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1 font-medium">{t("home")}</span>
        </Link>

        <Link
          href="/upcoming"
          className={`flex flex-col items-center justify-center ${
            location === "/upcoming" ? "text-primary" : "text-slate-500"
          } flex-1 h-full`}
        >
          <Clock className="h-5 w-5" />
          <span className="text-xs mt-1 font-medium">{t("upcoming")}</span>
        </Link>

        <div className=" flex items-center justify-center">
          <Button
            id="mobileCreateBtn"
            className="w-14 h-14 rounded-full bg-thyk-gradient text-white flex items-center justify-center shadow-lg transform -translate-y-5"
            onClick={() => {
              openTaskModal(undefined);
            }}
          >
            <Plus className="h-8 w-8" />
          </Button>
        </div>

        <Link
          href="/completed"
          className={`flex flex-col items-center justify-center ${
            location === "/completed" ? "text-primary" : "text-slate-500"
          } flex-1 h-full`}
        >
          <CheckCircle className="h-5 w-5" />
          <span className="text-xs mt-1 font-medium">{t("done")}</span>
        </Link>

        <Link
          href="/tags"
          className="flex flex-col items-center justify-center text-slate-500 flex-1 h-full"
        >
          <Tag className="h-5 w-5" />
          <span className="text-xs mt-1 font-medium">Tags</span>
        </Link>
      </div>
    </div>
  );
}
