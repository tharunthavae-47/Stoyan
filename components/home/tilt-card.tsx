"use client"

import { useRef, useState, type ReactNode } from "react"

type TiltCardProps = {
  children: ReactNode
  className?: string
  /** Maximum rotation in degrees applied at the card edges. */
  max?: number
  /** Show a moving light glare that follows the pointer. */
  glare?: boolean
}

export function TiltCard({ children, className = "", max = 10, glare = true }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useState<React.CSSProperties>({})
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 })

  function handleMove(event: React.PointerEvent<HTMLDivElement>) {
    const node = ref.current
    if (!node) return
    if (event.pointerType !== "mouse") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const rect = node.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height
    const rotateY = (px - 0.5) * 2 * max
    const rotateX = (0.5 - py) * 2 * max
    setStyle({
      transform: `perspective(1100px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(1.02)`,
    })
    setGlarePos({ x: px * 100, y: py * 100, opacity: 1 })
  }

  function handleLeave() {
    setStyle({ transform: "perspective(1100px) rotateX(0deg) rotateY(0deg) scale(1)" })
    setGlarePos((prev) => ({ ...prev, opacity: 0 }))
  }

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={style}
      className={`tilt-card relative ${className}`}
    >
      {children}
      {glare && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-[inherit]"
          style={{ opacity: glarePos.opacity, transition: "opacity 0.4s ease" }}
        >
          <div
            className="absolute h-[130%] w-[130%] -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${glarePos.x}%`,
              top: `${glarePos.y}%`,
              background:
                "radial-gradient(circle at center, rgba(255,255,255,0.55), rgba(255,255,255,0) 55%)",
            }}
          />
        </div>
      )}
    </div>
  )
}
