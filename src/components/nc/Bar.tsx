interface BarProps {
  pct: number;
}

export function Bar({ pct }: BarProps) {
  return (
    <div className="h-[5px] overflow-hidden rounded-full bg-secondary">
      <div
        className="h-full rounded-full bg-primary transition-all duration-500"
        style={{
          width: `${Math.min(pct, 100)}%`,
          boxShadow: "0 0 8px hsl(var(--primary) / 0.5)",
        }}
      />
    </div>
  );
}
