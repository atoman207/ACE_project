"use client";

import { useEffect, useRef, useState } from "react";

type AnimatedNumberProps = {
  end: number;
  suffix?: string;
  durationMs?: number;
  delayMs?: number;
};

export default function AnimatedNumber({
  end,
  suffix = "",
  durationMs = 1800,
  delayMs = 0,
}: AnimatedNumberProps) {
  const [value, setValue] = useState(1);
  const [hasStarted, setHasStarted] = useState(false);
  const targetRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!targetRef.current) return;

    if (!("IntersectionObserver" in window)) {
      setHasStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(targetRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    if (end <= 1) {
      setValue(end);
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(end);
      return;
    }

    let frameId = 0;
    let timeoutId = 0;
    const run = () => {
      const start = performance.now();

      const tick = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / durationMs, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const next = Math.round(1 + (end - 1) * eased);
        setValue(next);

        if (progress < 1) {
          frameId = requestAnimationFrame(tick);
        }
      };

      frameId = requestAnimationFrame(tick);
    };

    if (delayMs > 0) {
      timeoutId = window.setTimeout(run, delayMs);
    } else {
      run();
    }

    return () => {
      cancelAnimationFrame(frameId);
      window.clearTimeout(timeoutId);
    };
  }, [delayMs, durationMs, end, hasStarted]);

  return (
    <span ref={targetRef}>
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}
