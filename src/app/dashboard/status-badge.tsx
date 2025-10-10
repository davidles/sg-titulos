const statusStyles: Record<string, string> = {
  "En revisión": "bg-amber-100 text-amber-700",
  Aprobado: "bg-emerald-100 text-emerald-700",
  Observado: "bg-red-100 text-red-700",
};

export function StatusBadge({ status }: { status: string }) {
  const badgeClass = statusStyles[status] ?? "bg-slate-200 text-slate-700";
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${badgeClass}`}>
      {status}
    </span>
  );
}
