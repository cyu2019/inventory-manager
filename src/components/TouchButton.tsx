import clsx from "clsx";
import { useRef, useState, type ReactNode, type PointerEvent } from "react";

export type TouchButtonProps = {
  onClick?: () => void;
  className?: string;
  children?: ReactNode;
  size?: "large" | "small"
}

export function TouchButton({ onClick, className = "", children, size = "small" }: TouchButtonProps) {
  const [touched, setTouched] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);
  const bgClass = className.split(" ").find(e => e.startsWith("bg-")) ?? "bg-neutral-300";
  const buttonRef = useRef<HTMLButtonElement>(null)

  const touch = () => {
    setTouched(true);
    setMouseDown(true);
  }
  const untouch = () => {
    if (touched) onClick?.()
    setTouched(false);
    setMouseDown(false);
  }
  const checkMove = (e: PointerEvent<HTMLButtonElement>) => {
    const b = buttonRef.current;
    if (!b) return;
    if (!mouseDown) return;
    const inBounds =
      e.clientX >= b.offsetLeft &&
      e.clientX <= (b.offsetLeft + b.offsetWidth) &&
      e.clientY >= b.offsetTop &&
      e.clientY <= (b.offsetTop + b.offsetHeight)

    if (touched && !inBounds)
      setTouched(false);
    if (!touched && inBounds)
      setTouched(true);
  }

  return <button
    ref={buttonRef}
    onPointerDown={touch}
    onPointerUp={untouch}
    // onPointerMove={checkMove}
    className={clsx(
      `p-3 flex items-center relative justify-center overflow-visible rounded-md touch-none transition-all`,
      size === "large" ? "text-8xl" : "text-3xl",
      className
    )}
  >
    {children}
    <div
      className={`w-full h-full absolute ${bgClass} opacity-60 rounded-md`}
      style={{
        transition: "all 0.4s cubic-bezier( 0.02, 0.75, 0.11, 1.00 )",
        ...(touched ? {
          transform: "scale(1.5, 1.5)",
          opacity: 60
        } : {
          opacity: 0
        })
      }}
    />
    <div
      className={`w-full h-full absolute -z-10 ${bgClass}rounded-md`}
      style={{
        transition: "all 0.5s cubic-bezier(0.16, 0.62, 0.17, 0.85)",
        ...(touched ? {
          transform: "scale(1.3, 1.3)",
          opacity: 50
        } : {
          opacity: 0
        })
      }}
    />


  </button>
}