import { STATUS_LABELS, type SkillStatus } from "@/lib/registry";

const STYLES: Record<SkillStatus, string> = {
  stable: "border-ok text-ok",
  beta: "border-accent text-accent",
  draft: "border-line text-muted",
};

export function StatusBadge({ status }: { status: SkillStatus }) {
  return (
    <span className={`inline-block rounded-full border px-2 py-0.5 text-xs ${STYLES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}
