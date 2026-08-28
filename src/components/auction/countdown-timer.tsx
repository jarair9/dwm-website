"use client";

import { useState, useEffect } from "react";
import { differenceInSeconds } from "date-fns";

interface CountdownTimerProps {
  endTime: string;
  onEnd?: () => void;
  variant?: "compact" | "detailed" | "inline";
  size?: "sm" | "md" | "lg";
}

export function CountdownTimer({ endTime, onEnd, variant = "compact", size = "sm" }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(() => {
    const diff = differenceInSeconds(new Date(endTime), new Date());
    return Math.max(0, diff);
  });

  useEffect(() => {
    if (timeLeft <= 0) {
      onEnd?.();
      return;
    }

    const timer = setInterval(() => {
      const diff = differenceInSeconds(new Date(endTime), new Date());
      if (diff <= 0) {
        setTimeLeft(0);
        onEnd?.();
        clearInterval(timer);
      } else {
        setTimeLeft(diff);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime, timeLeft, onEnd]);

  if (timeLeft <= 0) {
    return <span className="text-xs font-bold text-red-600">ENDED</span>;
  }

  const days = Math.floor(timeLeft / 86400);
  const hours = Math.floor((timeLeft % 86400) / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const isUrgent = timeLeft < 300;
  const isCritical = timeLeft < 60;

  if (variant === "detailed") {
    return (
      <div className="flex items-center gap-3">
        {[
          { value: String(days).padStart(2, "0"), label: "Days" },
          { value: String(hours).padStart(2, "0"), label: "Hours" },
          { value: String(minutes).padStart(2, "0"), label: "Min" },
          { value: String(seconds).padStart(2, "0"), label: "Sec" },
        ].map((item, i) => (
          <div key={i} className="text-center">
            <div className="rounded-lg px-3 py-2 font-mono text-2xl font-bold tabular-nums bg-secondary text-foreground">
              {item.value}
            </div>
            <div className="mt-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{item.label}</div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <span className="font-mono text-sm font-bold tabular-nums text-foreground">
        {days > 0 && `${days}d `}
        {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:
        {String(seconds).padStart(2, "0")}
      </span>
    );
  }

  // Compact variant (default for cards)
  return (
    <div className={`font-mono tabular-nums font-bold ${
      size === "lg" ? "text-lg" : size === "md" ? "text-sm" : "text-xs"
    } text-muted-foreground`}>
      {days > 0 && <span>{days}d </span>}
      {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:
      {String(seconds).padStart(2, "0")}
    </div>
  );
}
