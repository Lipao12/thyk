import { Button } from "./ui/button";
import { AlertCircle, Plus } from "lucide-react";

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
    <div className="border border-dashed rounded-lg p-8 mt-4 flex flex-col items-center justify-center text-center space-y-3">
      <AlertCircle className="h-10 w-10 text-gray-400" />
      <h3 className="text-lg font-medium">{title}</h3>
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
