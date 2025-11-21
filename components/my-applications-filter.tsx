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

export interface MyApplicationsFilterParams {
  status?: number // 1-待审批，2-已通过，3-已拒绝
  startDate?: string
  endDate?: string
  pageNum?: number
  pageSize?: number
}

interface MyApplicationsFilterProps {
  onFilter?: (params: MyApplicationsFilterParams) => void
  initialParams?: MyApplicationsFilterParams
}

function formatDate(date?: Date) {
  if (!date) return undefined
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function MyApplicationsFilter({ onFilter, initialParams }: MyApplicationsFilterProps) {
  const [status, setStatus] = React.useState<number | undefined>(initialParams?.status)
  const [startDate, setStartDate] = React.useState<Date | undefined>(
    initialParams?.startDate ? new Date(initialParams.startDate) : undefined
  )
  const [endDate, setEndDate] = React.useState<Date | undefined>(
    initialParams?.endDate ? new Date(initialParams.endDate) : undefined
  )

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

  const handleSearch = () => {
    onFilter?.({
      status,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      pageNum: 1, // 搜索时重置到第一页
      pageSize: initialParams?.pageSize || 20, // 使用初始值或默认值
    })
  }

  const handleReset = () => {
    setStatus(undefined)
    setStartDate(undefined)
    setEndDate(undefined)
    onFilter?.({
      status: undefined,
      startDate: undefined,
      endDate: undefined,
      pageNum: 1,
      pageSize: initialParams?.pageSize || 20, // 使用初始值或默认值
    })
  }

  return (
    <div
      className="w-full p-0"
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
        className="object-contain mb-3"
      />

      <div className="space-y-3 ml-1 px-2">
        {/* 状态筛选 */}
        <div className="grid grid-cols-[90px_1fr] items-center gap-3">
          <Image
            src="/assets/Search3.png"
            alt="审批状态"
            width={100}
            height={40}
            className="object-contain"
          />
          <select
            value={status || ''}
            onChange={(e) => setStatus(e.target.value ? Number(e.target.value) : undefined)}
            className="h-10 px-3 text-slate-200 bg-transparent border border-blue-500/45 rounded-md focus:outline-none focus:ring-0"
            style={{
              background: "linear-gradient(180deg, rgba(0,22,46,0.65) 0%, rgba(0,15,35,0.6) 100%)",
            }}
          >
            <option value="" style={{ color: '#000000', backgroundColor: '#e5e7eb' }}>全部状态</option>
            <option value="1" style={{ color: '#000000', backgroundColor: '#e5e7eb' }}>待审批</option>
            <option value="2" style={{ color: '#000000', backgroundColor: '#e5e7eb' }}>已通过</option>
            <option value="3" style={{ color: '#000000', backgroundColor: '#e5e7eb' }}>已拒绝</option>
          </select>
        </div>

        {/* 申请时间 */}
        <div className="grid grid-cols-[90px_1fr_1fr] items-center gap-3">
          <Image
            src="/assets/Search1.png"
            alt="申请时间"
            width={100}
            height={40}
            className="object-contain"
          />
          <DatePicker value={startDate} onChange={setStartDate} placeholder="开始日期" />
          <DatePicker value={endDate} onChange={setEndDate} placeholder="结束日期" />
        </div>
      </div>

      {/* 底部操作按钮 */}
      <div className="mt-4 grid grid-cols-4 gap-3 px-2 pb-2">
        <ImageBgButton
          bgSrc="/assets/SearchButton1.png"
          text="查询"
          width={88}
          height={44}
          fontSize={16}
          stretch="cover"
          onClick={handleSearch}
        />
        <ImageBgButton
          bgSrc="/assets/SearchButton2.png"
          text="重置"
          width={88}
          height={44}
          fontSize={16}
          stretch="cover"
          onClick={handleReset}
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

