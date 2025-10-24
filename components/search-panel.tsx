"use client"

import * as React from "react"
import Image from "next/image"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ImageBgButton } from "@/components/image-bg-button"

type Option = { label: string; value: string }

function FieldRow({
  label,
  children,
}: {
  label: string
  children?: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-3">
      <div
        className="h-10 flex items-center justify-center text-cyan-200 text-sm tracking-wider"
        style={{
          border: "1px solid rgba(0,164,255,0.5)",
          boxShadow: "inset 0 0 0 1px rgba(0,220,255,0.15)",
          background:
            "linear-gradient(180deg, rgba(0,42,85,0.8) 0%, rgba(0,25,60,0.6) 100%)",
          borderRadius: 6,
        }}
      >
        {label}
      </div>
      <div
        className="h-10 px-3 flex items-center text-slate-200"
        style={{
          border: "1px solid rgba(0,164,255,0.45)",
          background:
            "linear-gradient(180deg, rgba(0,22,46,0.65) 0%, rgba(0,15,35,0.6) 100%)",
          borderRadius: 6,
        }}
      >
        {children ?? <span className="opacity-60">请输入/选择</span>}
      </div>
    </div>
  )
}

function DatePicker({
  value,
  onChange,
  placeholder = "选择日期",
}: {
  value?: Date
  onChange: (d?: Date) => void
  placeholder?: string
}) {
  const [open, setOpen] = React.useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className=" w-40 h-[40px] justify-between bg-transparent border-0 text-slate-200 hover:bg-sky-500/10"
          style={{
            boxShadow: "inset 0 0 0 1px rgba(0,164,255,0.35)",
            borderRadius: 8,
          }}
        >
          {value ? value.toLocaleDateString() : placeholder}
          <ChevronDownIcon className="opacity-80" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 z-50" align="start" sideOffset={6}>
        <Calendar
          className="[--cell-size:2.4rem] min-w-[320px]"
          mode="single"
          selected={value}
          captionLayout="dropdown"
          onSelect={(d) => {
            onChange(d)
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

export function SearchPanel() {
  const [start, setStart] = React.useState<Date | undefined>(new Date())
  const [end, setEnd] = React.useState<Date | undefined>(new Date())

  const pill = (text: string) => (
    <div className="h-8 px-3 inline-flex items-center justify-between gap-2 w-40"
      style={{
        boxShadow: "inset 0 0 0 1px rgba(0,164,255,0.35)",
        borderRadius: 8,
      }}
    >
      <span className="text-slate-200/90">{text}</span>
      <ChevronDownIcon className="opacity-80" />
    </div>
  )

  return (
    <div
      className="w-[460px] p-0 mt-5"
      style={{
        background:
          "linear-gradient(180deg, rgba(0,20,40,0.9) 0%, rgba(0,10,25,0.9) 100%)",
        border: "1px solid rgba(0,164,255,0.35)",
        borderRadius: 8,
      }}
    >
      {/* 顶部标题条（可替换为你项目中的头图） */}
      <Image
          src="/assets/Mask_Header2.png"
          alt="Statistics Category"
          width={460}
          height={33}
          className="object-contain mb-5"
        />

      <div className="space-y-3 ml-1">
        {/* 查询时段：开始/结束 两个控件放入一行 */}
        <div className="grid grid-cols-[90px_1fr_1fr] items-center gap-3">
          <Image
            src="/assets/Search1.png"
            alt="Statistics Category"
            width={100}
            height={40}
            className="object-contain"
          />
          <DatePicker value={start} onChange={setStart} />
          <DatePicker value={end} onChange={setEnd} />
        </div>

        {/* 减免金额 */}
        <div className="grid grid-cols-[90px_1fr_1fr] items-center gap-3">
          <Image src="/assets/Search2.png" alt="减免金额" width={100} height={40} className="object-contain" />
          <div
            className="h-10 px-3 flex items-center text-slate-200"
            style={{
              border: "1px solid rgba(0,164,255,0.45)",
              background: "linear-gradient(180deg, rgba(0,22,46,0.65) 0%, rgba(0,15,35,0.6) 100%)",
              borderRadius: 6,
            }}
          >
            <span className="opacity-60">请输入/选择</span>
          </div>

          <div
            className="h-10 px-3 flex items-center text-slate-200"
            style={{
              border: "1px solid rgba(0,164,255,0.45)",
              background: "linear-gradient(180deg, rgba(0,22,46,0.65) 0%, rgba(0,15,35,0.6) 100%)",
              borderRadius: 6,
            }}
          >
            <span className="opacity-60">请输入/选择</span>
          </div>
        </div>

        {/* 入口站 */}
        <div className="grid grid-cols-[90px_1fr] items-center gap-3">
          <Image src="/assets/Search3.png" alt="入口站" width={100} height={40} className="object-contain" />
          <div
            className="h-10 px-3 flex items-center text-slate-200"
            style={{
              border: "1px solid rgba(0,164,255,0.45)",
              background: "linear-gradient(180deg, rgba(0,22,46,0.65) 0%, rgba(0,15,35,0.6) 100%)",
              borderRadius: 6,
            }}
          >
            <span className="opacity-60">请输入/选择</span>
          </div>
        </div>

        {/* 出口站 */}
        <div className="grid grid-cols-[90px_1fr] items-center gap-3">
          <Image src="/assets/Search4.png" alt="出口站" width={100} height={40} className="object-contain" />
          <div
            className="h-10 px-3 flex items-center text-slate-200"
            style={{
              border: "1px solid rgba(0,164,255,0.45)",
              background: "linear-gradient(180deg, rgba(0,22,46,0.65) 0%, rgba(0,15,35,0.6) 100%)",
              borderRadius: 6,
            }}
          >
            <span className="opacity-60">请输入/选择</span>
          </div>
        </div>

        {/* 物品类别 */}
        <div className="grid grid-cols-[90px_1fr] items-center gap-3">
          <Image src="/assets/Search5.png" alt="物品类别" width={100} height={40} className="object-contain" />
          <div
            className="h-10 px-3 flex items-center text-slate-200"
            style={{
              border: "1px solid rgba(0,164,255,0.45)",
              background: "linear-gradient(180deg, rgba(0,22,46,0.65) 0%, rgba(0,15,35,0.6) 100%)",
              borderRadius: 6,
            }}
          >
            <span className="opacity-60">请输入/选择</span>
          </div>
        </div>

        {/* 车型 */}
        <div className="grid grid-cols-[90px_1fr] items-center gap-3">
          <Image src="/assets/Search6.png" alt="车型" width={100} height={40} className="object-contain" />
          <div
            className="h-10 px-3 flex items-center text-slate-200"
            style={{
              border: "1px solid rgba(0,164,255,0.45)",
              background: "linear-gradient(180deg, rgba(0,22,46,0.65) 0%, rgba(0,15,35,0.6) 100%)",
              borderRadius: 6,
            }}
          >
            <span className="opacity-60">请输入/选择</span>
          </div>
        </div>

        {/* 车牌 */}
        <div className="grid grid-cols-[90px_1fr] items-center gap-3">
          <Image src="/assets/Search7.png" alt="车牌" width={100} height={40} className="object-contain" />
          <div
            className="h-10 px-3 flex items-center text-slate-200"
            style={{
              border: "1px solid rgba(0,164,255,0.45)",
              background: "linear-gradient(180deg, rgba(0,22,46,0.65) 0%, rgba(0,15,35,0.6) 100%)",
              borderRadius: 6,
            }}
          >
            <span className="opacity-60">请输入/选择</span>
          </div>
        </div>

        {/* 通行类型 */}
        <div className="grid grid-cols-[90px_1fr] items-center gap-3">
          <Image src="/assets/Search8.png" alt="通行类型" width={100} height={40} className="object-contain" />
          <div
            className="h-10 px-3 flex items-center text-slate-200"
            style={{
              border: "1px solid rgba(0,164,255,0.45)",
              background: "linear-gradient(180deg, rgba(0,22,46,0.65) 0%, rgba(0,15,35,0.6) 100%)",
              borderRadius: 6,
            }}
          >
            <span className="opacity-60">请输入/选择</span>
          </div>
        </div>

        {/* 通行方式 */}
        <div className="grid grid-cols-[90px_1fr] items-center gap-3">
          <Image src="/assets/Search9.png" alt="通行方式" width={100} height={40} className="object-contain" />
          <div
            className="h-10 px-3 flex items-center text-slate-200"
            style={{
              border: "1px solid rgba(0,164,255,0.45)",
              background: "linear-gradient(180deg, rgba(0,22,46,0.65) 0%, rgba(0,15,35,0.6) 100%)",
              borderRadius: 6,
            }}
          >
            <span className="opacity-60">请输入/选择</span>
          </div>
        </div>

        {/* 复验情况 */}
        <div className="grid grid-cols-[90px_1fr] items-center gap-3">
          <Image src="/assets/Search10.png" alt="复验情况" width={100} height={40} className="object-contain" />
          <div
            className="h-10 px-3 flex items-center text-slate-200"
            style={{
              border: "1px solid rgba(0,164,255,0.45)",
              background: "linear-gradient(180deg, rgba(0,22,46,0.65) 0%, rgba(0,15,35,0.6) 100%)",
              borderRadius: 6,
            }}
          >
            <span className="opacity-60">请输入/选择</span>
          </div>
        </div>
      </div>

      {/* 底部操作按钮：4个横排，ImageButton 88x44 */}
      <div className="mt-4 grid grid-cols-4 gap-3">
        <ImageBgButton
          bgSrc="/assets/SearchButton1.png"
          text="查询"
          width={88}
          height={44}
          fontSize={16}
          stretch="cover"
        />
        <ImageBgButton
          bgSrc="/assets/SearchButton2.png"
          text="重置"
          width={88}
          height={44}
          fontSize={16}
          stretch="cover"
        />
        <ImageBgButton
          bgSrc="/assets/SearchButton3.png"
          text="导出"
          width={88}
          height={44}
          fontSize={16}
          stretch="cover"
        />
        <ImageBgButton
          bgSrc="/assets/SearchButton4.png"
          text="返回"
          width={88}
          height={44}
          fontSize={16}
          stretch="cover"
        />
      </div>
    </div>
  )
}
