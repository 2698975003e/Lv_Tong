"use client"

import React from "react"
import { cn } from "@/lib/utils"

type ImageBgButtonProps = {
  bgSrc: string
  text: string
  width?: number | string
  height?: number | string
  stretch?: "cover" | "contain" | "fill"
  fontSize?: number | string
  className?: string
  textClassName?: string
  disabled?: boolean
  onClick?: () => void
}

export function ImageBgButton({
  bgSrc,
  text,
  width = 120,
  height = 40,
  stretch = "fill",
  fontSize = 14,
  className,
  textClassName,
  disabled,
  onClick,
}: ImageBgButtonProps) {
  const style: React.CSSProperties = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
    backgroundImage: `url(${bgSrc})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: stretch,
  }

  const textStyle: React.CSSProperties = {
    fontSize: typeof fontSize === "number" ? `${fontSize}px` : fontSize,
  }

  return (
    <button
      type="button"
      style={style}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center select-none border-0 rounded-md",
        "text-white cursor-pointer",
        "transition duration-200 ease-out transform",
        "hover:scale-[1.03] hover:brightness-110 hover:shadow-lg hover:shadow-cyan-400/20",
        "active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
    >
      <span className={cn("px-2", textClassName)} style={textStyle}>{text}</span>
    </button>
  )
}
