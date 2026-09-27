export interface StatsProps {
  skills: number;
  packs: number;
  /** Data já formatada (ex.: via formatUpdated) ou null. */
  lastUpdated: string | null;
}

export function Stats({ skills, packs, lastUpdated }: StatsProps) {
  const items = [
    { label: "Skills", value: String(skills) },
    { label: "Packs", value: String(packs) },
    { label: "Atualizado em", value: lastUpdated ?? "—" },
  ];

  return (
    <dl className="grid grid-cols-3 gap-2 sm:gap-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="min-w-0 rounded-lg border border-border bg-card px-3 py-3 text-card-foreground"
        >
          <dt className="text-xs text-muted-foreground">{item.label}</dt>
          <dd className="mt-1 text-lg font-semibold tabular-nums sm:text-2xl">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
