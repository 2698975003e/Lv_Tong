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

export interface SimpleSearchParams {
  startDate?: string
  endDate?: string
  minDiscountAmount?: number
  maxDiscountAmount?: number
}

interface SimpleSearchPanelProps {
  onSearch?: (params: SimpleSearchParams) => void
}

function formatDate(date?: Date) {
  if (!date) return undefined
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function SimpleSearchPanel({ onSearch }: SimpleSearchPanelProps) {
  const [start, setStart] = React.useState<Date | undefined>(new Date())
  const [end, setEnd] = React.useState<Date | undefined>(new Date())
  const [minAmount, setMinAmount] = React.useState<string>("")
  const [maxAmount, setMaxAmount] = React.useState<string>("")

  function DatePicker({
    value,
    onChange,
    placeholder = "选择日期",
  }: {
    value?: Date
    onChange: (d?: Date) => void
    placeholder?: string
  }) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-10 px-3 flex items-center justify-between text-slate-200 w-full"
            style={{
              border: "1px solid rgba(0,164,255,0.45)",
              background: "linear-gradient(180deg, rgba(0,22,46,0.65) 0%, rgba(0,15,35,0.6) 100%)",
              borderRadius: 6,
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
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <div
      className="w-[460px] p-0 mt-5"
      style={{
        background: "linear-gradient(180deg, rgba(0,20,40,0.9) 0%, rgba(0,10,25,0.9) 100%)",
        border: "1px solid rgba(0,164,255,0.35)",
        borderRadius: 8,
      }}
    >
      {/* 顶部标题条 */}
      <Image
        src="/assets/Mask_Header2.png"
        alt="Search Panel"
        width={460}
        height={33}
        className="object-contain mb-5"
      />

      <div className="space-y-3 ml-1">
        {/* 查询时段：开始/结束 两个控件放入一行 */}
        <div className="grid grid-cols-[90px_1fr_1fr] items-center gap-3">
          <Image
            src="/assets/Search1.png"
            alt="查询时段"
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
            <input
              type="number"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              placeholder="请输入/选择"
              className="w-full bg-transparent text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-0"
              step="1"
              min="0"
            />
          </div>

          <div
            className="h-10 px-3 flex items-center text-slate-200"
            style={{
              border: "1px solid rgba(0,164,255,0.45)",
              background: "linear-gradient(180deg, rgba(0,22,46,0.65) 0%, rgba(0,15,35,0.6) 100%)",
              borderRadius: 6,
            }}
          >
            <input
              type="number"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              placeholder="请输入/选择"
              className="w-full bg-transparent text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-0"
              step="1"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* 底部操作按钮 */}
      <div className="mt-4 grid grid-cols-4 gap-3">
        <ImageBgButton
          bgSrc="/assets/SearchButton1.png"
          text="查询"
          width={88}
          height={44}
          fontSize={16}
          stretch="cover"
          onClick={() => {
            const startDate = formatDate(start)
            const endDate = formatDate(end)
            const min = minAmount.trim() === "" ? undefined : Number(minAmount)
            const max = maxAmount.trim() === "" ? undefined : Number(maxAmount)

            onSearch?.({
              startDate,
              endDate,
              minDiscountAmount: Number.isFinite(min ?? NaN) ? min : undefined,
              maxDiscountAmount: Number.isFinite(max ?? NaN) ? max : undefined,
            })
          }}
        />
        <ImageBgButton
          bgSrc="/assets/SearchButton2.png"
          text="重置"
          width={88}
          height={44}
          fontSize={16}
          stretch="cover"
          onClick={() => {
            setStart(new Date())
            setEnd(new Date())
            setMinAmount("")
            setMaxAmount("")
          }}
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
          text="打印"
          width={88}
          height={44}
          fontSize={16}
          stretch="cover"
        />
      </div>
    </div>
  )
}
