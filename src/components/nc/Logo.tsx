export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <path d="M8 20 L8 80 L52 50 Z" stroke="hsl(var(--primary))" strokeWidth="7" strokeLinejoin="round" fill="none" strokeLinecap="round" />
      <path d="M92 20 L92 80 L48 50 Z" stroke="hsl(var(--primary))" strokeWidth="7" strokeLinejoin="round" fill="none" strokeLinecap="round" />
      <path d="M38 50 L50 40 L62 50 L50 60 Z" stroke="hsl(var(--primary) / 0.8)" strokeWidth="5.5" strokeLinejoin="round" fill="none" />
      <circle cx="50" cy="50" r="3" fill="hsl(var(--primary) / 0.8)" />
    </svg>
  );
}

export function LogoFull({ size = 28 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <LogoMark size={size} />
      <span
        className="font-extrabold text-foreground"
        style={{ fontSize: size * 0.72, letterSpacing: "-0.03em" }}
      >
        Next<span className="text-primary">Chain</span>
      </span>
    </div>
  );
}
