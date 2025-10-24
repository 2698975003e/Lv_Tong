"use client"

import React from "react"

interface VehicleTypeSelectProps {
  label?: string
  value?: string
  onChange?: (v: string) => void
  options?: { label: string; value: string }[]
  className?: string
}

export function VehicleTypeSelect({
  label = "车型",
  value,
  onChange,
  options = [
    { label: "全部", value: "" },
    { label: "普通货车", value: "normal" },
    { label: "厢式货车", value: "box" },
    { label: "冷链车", value: "cold" },
    { label: "危险品车", value: "danger" },
  ],
  className = "",
}: VehicleTypeSelectProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* 左侧 Label：使用 SelectMask.png 做背景 */}
      <div
        className="relative h-11 w-[240px] shrink-0 rounded-md"
        style={{
          backgroundImage: "url(/assets/SelectMask.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          // 可微调阴影与描边氛围
          boxShadow: "inset 0 0 8px rgba(59,130,246,0.35)",
          border: "1px solid rgba(43,117,247,0.8)",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[20px] font-extrabold tracking-widest text-[#6EC7FF] drop-shadow-[0_0_6px_rgba(59,130,246,0.6)]">
            {label}
          </span>
        </div>
      </div>

      {/* 右侧 Select：深色面板 + 蓝色描边 + 自定义三角箭头 */}
      <div className="relative h-11 w-[420px]">
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="h-11 w-full appearance-none rounded-md border border-[#2B75F7] bg-[#07142A]/95 px-4 pr-12 text-[14px] text-[#BFE1FF] outline-none transition-colors
                     hover:border-[#3C8CFF] focus:border-[#58A0FF]"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#07142A] text-[#BFE1FF]">
              {opt.label}
            </option>
          ))}
        </select>

        {/* 右侧描边高亮（与设计图边框呼应，可选） */}
        <div className="pointer-events-none absolute inset-0 rounded-md ring-1 ring-inset ring-[#0045B3]/40"></div>

        {/* 自定义下拉三角（与设计图的青蓝色三角尽量接近） */}
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderTop: "10px solid #5ED1FF",
              filter: "drop-shadow(0 0 4px rgba(94,209,255,0.6))",
            }}
          />
        </div>
      </div>
    </div>
  )
}
