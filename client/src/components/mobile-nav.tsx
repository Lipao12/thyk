import { Button } from "./ui/button";
import { CheckCircle, Clock, Home, Plus, Tag } from "lucide-react";
import { Link, useLocation } from "wouter";

interface MobileNavProps {
  openTaskModal: () => void;
}

export default function MobileNav({ openTaskModal }: MobileNavProps) {
  const [location] = useLocation();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-lg border-t border-slate-200 dark:border-slate-800 z-50">
      <div className="flex justify-around items-center h-16">
        <Link href="/">
          <a
            className={`flex flex-col items-center justify-center ${
              location === "/" ? "text-primary" : "text-slate-500"
            } flex-1 h-full`}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1 font-medium">Home</span>
          </a>
        </Link>

        <Link href="/upcoming">
          <a
            className={`flex flex-col items-center justify-center ${
              location === "/upcoming" ? "text-primary" : "text-slate-500"
            } flex-1 h-full`}
          >
            <Clock className="h-5 w-5" />
            <span className="text-xs mt-1 font-medium">Upcoming</span>
          </a>
        </Link>

        <div className="flex-1 flex items-center justify-center">
          <Button
            id="mobileCreateBtn"
            className="w-14 h-14 rounded-full bg-thyk-gradient text-white flex items-center justify-center shadow-lg transform -translate-y-5"
            onClick={openTaskModal}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>

        <Link href="/completed">
          <a
            className={`flex flex-col items-center justify-center ${
              location === "/completed" ? "text-primary" : "text-slate-500"
            } flex-1 h-full`}
          >
            <CheckCircle className="h-5 w-5" />
            <span className="text-xs mt-1 font-medium">Done</span>
          </a>
        </Link>

        <a className="flex flex-col items-center justify-center text-slate-500 flex-1 h-full">
          <Tag className="h-5 w-5" />
          <span className="text-xs mt-1 font-medium">Tags</span>
        </a>
      </div>
    </div>
  );
}
