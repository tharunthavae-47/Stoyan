"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

type ScrollRevealProps = {
  children: ReactNode
  className?: string
  /** Delay in ms before the reveal transition starts. Great for staggering. */
  delay?: number
  /** Direction the element travels in from. */
  from?: "up" | "down" | "left" | "right"
}

const OFFSETS: Record<NonNullable<ScrollRevealProps["from"]>, string> = {
  up: "translateY(28px)",
  down: "translateY(-28px)",
  left: "translateX(-32px)",
  right: "translateX(32px)",
}

export function ScrollReveal({ children, className = "", delay = 0, from = "up" }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(node)
        }
      },
      { threshold: 0.14 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal-on-scroll ${visible ? "is-visible" : ""} ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        transform: visible ? undefined : `${OFFSETS[from]} scale(0.985)`,
      }}
    >
      {children}
    </div>
  )
}
