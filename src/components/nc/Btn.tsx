import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";

type BtnVariant = "primary" | "outline" | "ghost" | "success" | "danger";

interface BtnProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: React.ReactNode;
  variant?: BtnVariant;
  disabled?: boolean;
}

const btnVariants: Record<BtnVariant, string> = {
  primary: "bg-primary text-primary-foreground border-primary nc-glow hover:brightness-110",
  outline: "bg-transparent text-foreground border-border hover:border-primary/50 hover:text-primary",
  ghost: "bg-secondary text-muted-foreground border-border hover:text-foreground",
  success: "bg-accent text-primary border-primary/40",
  danger: "bg-red-950/40 text-red-400 border-red-900/40",
};

export function Btn({ children, variant = "primary", disabled, className, ...props }: BtnProps) {
  return (
    <motion.button
      whileTap={disabled ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-[13px] font-bold transition-all duration-200",
        "min-h-[44px] outline-none",
        btnVariants[variant],
        disabled && "cursor-not-allowed opacity-40",
        className
      )}
      onClick={disabled ? undefined : props.onClick}
      {...props}
    >
      {children}
    </motion.button>
  );
}
