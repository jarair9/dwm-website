"use client";

import { useState, useEffect } from "react";
import { differenceInSeconds } from "date-fns";

interface CountdownTimerProps {
  endTime: string;
  onEnd?: () => void;
  variant?: "compact" | "detailed";
}

export function CountdownTimer({ endTime, onEnd, variant = "compact" }: CountdownTimerProps) {
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
    return <span className="text-sm font-medium text-destructive">Ended</span>;
  }

  const days = Math.floor(timeLeft / 86400);
  const hours = Math.floor((timeLeft % 86400) / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const isUrgent = timeLeft < 300;

  if (variant === "detailed") {
    return (
      <div className="flex items-center gap-4">
        {[
          { value: String(days).padStart(2, "0"), label: "Days" },
          { value: String(hours).padStart(2, "0"), label: "Hours" },
          { value: String(minutes).padStart(2, "0"), label: "Minutes" },
          { value: String(seconds).padStart(2, "0"), label: "Seconds" },
        ].map((item, i) => (
          <div key={i} className="text-center">
            <div className={`font-serif text-3xl font-bold ${isUrgent ? "text-destructive animate-pulse" : "text-foreground"}`}>
              {item.value}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">{item.label}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1.5 font-mono text-sm ${isUrgent ? "text-destructive" : "text-muted-foreground"}`}>
      <span className={isUrgent ? "animate-pulse" : ""}>
        {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:
        {String(seconds).padStart(2, "0")}
      </span>
    </div>
  );
}
