"use client"

import React from "react"
import clsx from "clsx"

interface SectionHeaderProps {
  title: string
  bgSrc?: string            // 可选：自定义背景，不传用 NullHeader.png
  height?: number | string  // 可选：高度，默认 40
  className?: string        // 外层容器 class
  textClassName?: string    // 标题文字 class（自定义颜色尺寸等）
  leftPadding?: number      // 左内边距，默认 16
}

export function SectionHeader({
  title,
  bgSrc = "/assets/NullHeader.png",
  height = 40,
  className,
  textClassName,
  leftPadding = 16,
}: SectionHeaderProps) {
  return (
    <div
      className={clsx("relative w-full select-none", className)}
      style={{
        height: typeof height === "number" ? `${height}px` : height,
        backgroundImage: `url(${bgSrc})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left center",
      }}
    >
      <div
        className={clsx(
          "h-full flex items-center font-youshe tracking-wider",
          textClassName || "text-white text-sm"
        )}
        style={{
          paddingLeft: leftPadding,
          textShadow: "0 0 6px rgba(0, 160, 255, 0.6), 0 0 2px rgba(0, 0, 0, 0.8)",
          letterSpacing: "0.5px",
        }}
      >
        {title}
      </div>
    </div>
  )
}
