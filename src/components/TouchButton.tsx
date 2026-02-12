import clsx from "clsx";
import { useRef, useState, type ReactNode } from "react";

export type TouchButtonProps = {
  onClick?: () => void;
  className?: string;
  children?: ReactNode;
  size?: "large" | "small"
}

export function TouchButton({ onClick, className = "", children, size = "small" }: TouchButtonProps) {
  const touchedRef = useRef(false);
  const [touched, setTouched] = useState(false);
  const bgClass = className.split(" ").find(e => e.startsWith("bg-")) ?? "bg-neutral-300";
  const touch = () => {
    touchedRef.current = true
    setTouched(true);
  }
  const untouch = () => {
    if (touchedRef.current) onClick?.();
    setTouched(false);
    touchedRef.current = false
  }
  const untouchSafe = () => {
    console.log("Hi");
    setTouched(false);
    touchedRef.current = false
  }

  const buttonRef = useRef<HTMLButtonElement>(null)



  return <button
    ref={buttonRef}
    onTouchStart={touch}
    onMouseDown={touch}
    onMouseUp={untouch}
    onMouseLeave={untouchSafe}
    onTouchEnd={untouch}
    className={clsx(
      `p-3 flex items-center relative justify-center overflow-visible rounded-md touch-none transition-all`,
      size === "large" ? "text-8xl" : "text-3xl",
      className
    )}
  >
    {children}
    <div
      className={`w-full h-full absolute -z-10 ${bgClass} opacity-60 rounded-md`}
      style={{
        transition: "all 0.4s cubic-bezier( 0.02, 0.75, 0.11, 1.00 )",
        ...(touched ? {
          transform: "scale(1.5, 1.5)",
        } : {})
      }}
    />
    <div
      className={`w-full h-full absolute -z-10 ${bgClass} opacity-50 rounded-md`}
      style={{
        transition: "all 0.5s cubic-bezier(0.16, 0.62, 0.17, 0.85)",
        ...(touched ? {
          transform: "scale(1.3, 1.3)",
        } : {})
      }}
    />


  </button>
}