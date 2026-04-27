"use client"

import type React from "react"
import { useRef, useState } from "react"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react"

interface LocationMapProps {
  location?: string
  coordinates?: string
  className?: string
  href?: string
  openOnClick?: boolean
  hintText?: string
  variant?: "default" | "calm" | "glass3d"
}

export function LocationMap({
  location = "San Francisco, CA",
  coordinates = "37.7749° N, 122.4194° W",
  className,
  href,
  openOnClick = false,
  hintText,
  variant = "default",
}: LocationMapProps) {
  const isCalm = variant === "calm"
  const isGlass3d = variant === "glass3d"
  const [isHovered, setIsHovered] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useTransform(mouseY, [-50, 50], [4, -4])
  const rotateY = useTransform(mouseX, [-50, 50], [-4, 4])

  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 })
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isCalm) return
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    mouseX.set(e.clientX - centerX)
    mouseY.set(e.clientY - centerY)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }

  const handleClick = () => {
    if (openOnClick && href) {
      window.open(href, "_blank", "noopener,noreferrer")
      return
    }
    setIsExpanded(!isExpanded)
  }

  return (
    <motion.div
      ref={containerRef}
      className={`relative cursor-pointer select-none ${className}`}
      style={{
        perspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <motion.div
        className={
          isCalm
            ? "relative overflow-hidden rounded-2xl border border-black/10 bg-white"
            : isGlass3d
              ? "map-glass-3d relative overflow-hidden rounded-2xl"
              : "bg-neutral-950 border-neutral-800 relative overflow-hidden rounded-2xl border"
        }
        style={{
          rotateX: isCalm ? 0 : springRotateX,
          rotateY: isCalm ? 0 : springRotateY,
          transformStyle: "preserve-3d",
        }}
        animate={{
          width: "100%",
          height: isExpanded ? 320 : 160,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 35,
        }}
      >
        {/* Subtle gradient overlay */}
        <div
          className={
            isCalm
              ? "absolute inset-0 bg-gradient-to-br from-black/[0.03] via-transparent to-black/[0.05]"
              : isGlass3d
                ? "absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/40"
                : "from-white/5 to-white/10 absolute inset-0 bg-gradient-to-br via-transparent"
          }
        />

        <AnimatePresence>
          {!isCalm && isExpanded && (
            <motion.div
              className="pointer-events-none absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="bg-neutral-900 absolute inset-0 rounded-2xl" />

              <svg
                className="absolute inset-0 h-full w-full"
                preserveAspectRatio="none"
              >
                {/* Main roads */}
                <motion.line
                  x1="0%" y1="35%" x2="100%" y2="35%"
                  className="stroke-white/20" strokeWidth="4"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
                />
                <motion.line
                  x1="0%" y1="65%" x2="100%" y2="65%"
                  className="stroke-white/20" strokeWidth="4"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.3 }}
                />

                {/* Vertical main roads */}
                <motion.line
                  x1="30%" y1="0%" x2="30%" y2="100%"
                  className="stroke-white/15" strokeWidth="3"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.4 }}
                />
                <motion.line
                  x1="70%" y1="0%" x2="70%" y2="100%"
                  className="stroke-white/15" strokeWidth="3"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.5 }}
                />

                {/* Secondary streets */}
                {[20, 50, 80].map((y, i) => (
                  <motion.line
                    key={`h-${i}`} x1="0%" y1={`${y}%`} x2="100%" y2={`${y}%`}
                    className="stroke-white/5" strokeWidth="1.5"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                  />
                ))}
                {[15, 45, 55, 85].map((x, i) => (
                  <motion.line
                    key={`v-${i}`} x1={`${x}%`} y1="0%" x2={`${x}%`} y2="100%"
                    className="stroke-white/5" strokeWidth="1.5"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
                  />
                ))}
              </svg>

              {/* Buildings */}
              <motion.div className="bg-white/10 border-white/5 absolute top-[40%] left-[10%] h-[20%] w-[15%] rounded-sm border" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.5 }} />
              <motion.div className="bg-white/10 border-white/5 absolute top-[15%] left-[35%] h-[15%] w-[12%] rounded-sm border" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.6 }} />
              <motion.div className="bg-white/10 border-white/5 absolute top-[70%] left-[75%] h-[18%] w-[18%] rounded-sm border" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.7 }} />
              <motion.div className="bg-white/10 border-white/5 absolute top-[20%] right-[10%] h-[25%] w-[10%] rounded-sm border" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.55 }} />
              <motion.div className="bg-white/10 border-white/5 absolute top-[55%] left-[5%] h-[12%] w-[8%] rounded-sm border" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.65 }} />
              <motion.div className="bg-white/10 border-white/5 absolute top-[8%] left-[75%] h-[10%] w-[14%] rounded-sm border" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.75 }} />

              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                initial={{ scale: 0, y: -20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.3 }}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="drop-shadow-lg"
                  style={{ filter: "drop-shadow(0 0 10px rgba(92, 138, 94, 0.55))" }}
                >
                  <path
                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                    fill="#7cb87d"
                  />
                  <circle cx="12" cy="9" r="2.5" className="fill-neutral-900" />
                </svg>
              </motion.div>

              <div className="from-neutral-950 absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-60" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid pattern */}
        <motion.div
          className="absolute inset-0 opacity-[0.03]"
          animate={{ opacity: isExpanded ? 0 : 0.05 }}
          transition={{ duration: 0.3 }}
        >
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path
                  d="M 20 0 L 0 0 0 20"
                  fill="none"
                  className={isCalm ? "stroke-black" : "stroke-white"}
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </motion.div>

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col justify-between p-5">
          <div className="flex items-start justify-between">
            <div className="relative">
              <motion.div
                className="relative"
                animate={{ opacity: isExpanded ? 0 : 1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.svg
                  width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className={isCalm ? "text-[#333231]" : isGlass3d ? "text-[#7cb87d]" : "text-[#7cb87d]"}
                  animate={{
                    filter: isCalm || isGlass3d
                      ? "none"
                      : isHovered
                        ? "drop-shadow(0 0 8px rgba(92, 138, 94, 0.65))"
                        : "drop-shadow(0 0 4px rgba(92, 138, 94, 0.4))",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                  <line x1="9" x2="9" y1="3" y2="18" />
                  <line x1="15" x2="15" y1="6" y2="21" />
                </motion.svg>
              </motion.div>
            </div>

            {!isCalm && !isGlass3d ? (
              <motion.div
                className={
                  isGlass3d
                    ? "flex items-center gap-1.5 rounded-full bg-white/10 px-2 py-1 text-white ring-1 ring-white/15 backdrop-blur-sm"
                    : "bg-white/10 flex items-center gap-1.5 rounded-full px-2 py-1 backdrop-blur-sm"
                }
                animate={{
                  scale: isHovered ? 1.05 : 1,
                  backgroundColor: isGlass3d
                    ? isHovered
                      ? "rgba(255,255,255,0.14)"
                      : "rgba(255,255,255,0.10)"
                    : isHovered
                      ? "rgba(255,255,255,0.15)"
                      : "rgba(255,255,255,0.1)",
                }}
                transition={{ duration: 0.2 }}
              >
                <div className="h-1.5 w-1.5 rounded-full bg-[#7cb87d]" />
                <span className={isGlass3d ? "text-[10px] font-medium tracking-wide uppercase text-white/75" : "text-neutral-300 text-[10px] font-medium tracking-wide uppercase"}>
                  Live
                </span>
              </motion.div>
            ) : null}
          </div>

          <div className="space-y-1">
            <motion.h3
              className={
                isCalm || isGlass3d
                  ? isGlass3d
                    ? "text-white text-sm font-semibold tracking-tight"
                    : "text-[#1f1f1f] text-sm font-semibold tracking-tight"
                  : "text-white text-sm font-medium tracking-tight"
              }
              animate={{ x: isCalm ? 0 : isHovered ? 4 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              {location}
            </motion.h3>

            <AnimatePresence>
              {!isCalm && isExpanded && (
                <motion.p
                  className="text-neutral-400 font-mono text-xs"
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {coordinates}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.div
              className={
                isCalm
                  ? "h-px bg-gradient-to-r from-black/15 via-black/8 to-transparent"
                  : isGlass3d
                    ? "h-px bg-gradient-to-r from-white/30 via-white/10 to-transparent"
                    : "h-px bg-gradient-to-r from-[#5c8a5e]/55 via-[#7cb87d]/35 to-transparent"
              }
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: isHovered || isExpanded ? 1 : 0.3 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>
      </motion.div>

      {!isCalm ? (
        <motion.p
          className="text-neutral-500 absolute -bottom-6 left-1/2 text-[10px] whitespace-nowrap"
          style={{ x: "-50%" }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: isHovered && !isExpanded ? 1 : 0,
            y: isHovered ? 0 : 4,
          }}
          transition={{ duration: 0.2 }}
        >
          {openOnClick && href ? hintText ?? "Открыть в картах" : "Нажмите, чтобы развернуть"}
        </motion.p>
      ) : null}
    </motion.div>
  )
}
