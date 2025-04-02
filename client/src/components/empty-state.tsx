import { Plus } from "lucide-react";
import Thinky from "../assets/thinky-error.png";
import { Button } from "./ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="bg-gray-50 border-2 border-dashed rounded-lg p-8 mt-4 flex flex-col items-center justify-center text-center space-y-3">
      <img src={Thinky} alt="Thinky error" />
      <h3 className="text-lg text-black font-medium">{title}</h3>
      <p className="text-sm text-gray-500 max-w-md">{description}</p>

      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="mt-2 bg-primary hover:bg-opacity-90"
        >
          <Plus className="mr-1 h-4 w-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
