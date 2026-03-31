import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { getLevelInfo, getLevelProgress, type LevelInfo } from "@/lib/xp";

interface XPDisplayProps {
  xp: number;
  compact?: boolean;
}

export function XPDisplay({ xp, compact }: XPDisplayProps) {
  const levelInfo = getLevelInfo(xp);
  const progress = getLevelProgress(xp);
  const prevLevel = useRef(levelInfo.level);
  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
    if (levelInfo.level > prevLevel.current) {
      setShowLevelUp(true);
      const t = setTimeout(() => setShowLevelUp(false), 2500);
      prevLevel.current = levelInfo.level;
      return () => clearTimeout(t);
    }
    prevLevel.current = levelInfo.level;
  }, [levelInfo.level]);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-border-bright bg-accent text-xs font-black text-primary">
          {levelInfo.level}
        </div>
        <div>
          <div className="text-[11px] font-bold text-foreground">{xp} XP</div>
          <div className="text-[9px] text-muted-foreground">{levelInfo.title}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            className="absolute -top-12 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-xl border border-primary bg-accent px-4 py-2 text-sm font-black text-primary shadow-lg"
            style={{ boxShadow: "0 0 30px var(--green-glow-strong)" }}
          >
            ⬡ Level Up → Level {levelInfo.level}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3">
        <motion.div
          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border-bright text-lg font-black text-primary"
          style={{
            background: "linear-gradient(135deg, hsl(150 30% 8%), hsl(150 40% 14%))",
            boxShadow: "0 0 20px var(--green-glow)",
          }}
          animate={showLevelUp ? { scale: [1, 1.15, 1] } : {}}
          transition={{ duration: 0.4 }}
        >
          {levelInfo.level}
        </motion.div>
        <div className="flex-1">
          <div className="mb-1 flex items-baseline justify-between">
            <span className="text-sm font-bold text-foreground">{levelInfo.title}</span>
            <span className="tabular text-xs font-bold text-primary">{xp} XP</span>
          </div>
          <div className="h-[5px] overflow-hidden rounded-full bg-secondary">
            <motion.div
              className="h-full rounded-full bg-primary"
              style={{ boxShadow: "0 0 8px hsl(var(--primary) / 0.5)" }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-muted-foreground/50">
            <span>Level {levelInfo.level}</span>
            <span>{levelInfo.maxXP + 1} XP to next</span>
          </div>
        </div>
      </div>
    </div>
  );
}
