import { cva } from "class-variance-authority";
import { STATUS_LABEL, type DesignStatus } from "@/lib/app";
import { cn } from "@/lib/utils";

const status = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      s: {
        pending: "bg-pending-soft text-pending",
        approved: "bg-approved-soft text-approved",
        changes_requested: "bg-changes-soft text-changes",
      },
    },
  },
);

export function StatusBadge({ value, className }: { value: DesignStatus; className?: string }) {
  return (
    <span className={cn(status({ s: value }), className)}>
      <span className="size-1.5 rounded-full bg-current" />
      {STATUS_LABEL[value]}
    </span>
  );
}
