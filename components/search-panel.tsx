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

// 添加 CustomSelect 组件
function CustomSelect({ 
  value, 
  onChange, 
  options, 
  placeholder = "请选择" 
}: { 
  value?: string
  onChange?: (value: string) => void
  options: Option[]
  placeholder?: string
}) {
  return (
    <div className="relative h-10">
      <select
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full h-10 bg-slate-700/50 border border-blue-500/50 rounded px-3 pr-8 text-slate-200 text-sm appearance-none focus:outline-none focus:border-blue-400"
        style={{
          border: "1px solid rgba(0,164,255,0.45)",
          background: "linear-gradient(180deg, rgba(0,22,46,0.65) 0%, rgba(0,15,35,0.6) 100%)",
        }}
      >
        <option value="" disabled className="bg-slate-800 text-slate-200">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-slate-800 text-slate-200">
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <ChevronDownIcon className="opacity-80" />
      </div>
    </div>
  )
}

// 添加一个统一的输入框组件
function SearchInput({ 
  value, 
  onChange, 
  placeholder = "请输入" 
}: { 
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
}) {
  return (
    <input
      type="text"
      value={value || ""}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      className="h-10 px-3 bg-transparent text-slate-200 placeholder:text-slate-500/60 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
      style={{
        border: "1px solid rgba(0,164,255,0.45)",
        background: "linear-gradient(180deg, rgba(0,22,46,0.65) 0%, rgba(0,15,35,0.6) 100%)",
        borderRadius: 6,
      }}
    />
  )
}

interface SearchPanelProps {
  onSearch?: (params: {
    startDate: string
    endDate: string
    minDiscountAmount?: number
    maxDiscountAmount?: number
    enStationName?: string
    exStationName?: string
    freightCategory?: string
    vehicleType?: string
    vehicleId?: string
    passType?: number
    passMode?: number
    isModified?: number
    intervalSize: number
  }) => void
  onReset?: () => void
}

export function SearchPanel({ onSearch, onReset }: SearchPanelProps) {
  const [start, setStart] = React.useState<Date | undefined>(new Date())
  const [end, setEnd] = React.useState<Date | undefined>(new Date())
  
  // 修改 formData 字段名以匹配 API
  const [formData, setFormData] = React.useState({
    minDiscountAmount: "",      // 减免金额最小值
    maxDiscountAmount: "",       // 减免金额最大值
    enStationName: "",           // 入口收费站名称
    exStationName: "",           // 出口收费站名称
    freightCategory: "",         // 物品类别
    vehicleType: "",             // 车型
    vehicleId: "",               // 车牌号码
    passType: "",                 // 通行类型
    passMode: "",                 // 通行方式
    isModified: "",              // 是否查验修改
    intervalSize: "1000"         // 金额区间大小，默认1000
  })

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // 修改查询功能
  const handleSearch = () => {
    // 构建查询参数对象
    const searchParams: any = {
      startDate: start?.toLocaleDateString('en-CA') || new Date().toLocaleDateString('en-CA'),
      endDate: end?.toLocaleDateString('en-CA') || new Date().toLocaleDateString('en-CA'),
      intervalSize: parseInt(formData.intervalSize) || 1000
    }
    
    // 添加可选参数
    if (formData.minDiscountAmount) {
      searchParams.minDiscountAmount = parseFloat(formData.minDiscountAmount)
    }
    if (formData.maxDiscountAmount) {
      searchParams.maxDiscountAmount = parseFloat(formData.maxDiscountAmount)
    }
    if (formData.enStationName) {
      searchParams.enStationName = formData.enStationName
    }
    if (formData.exStationName) {
      searchParams.exStationName = formData.exStationName
    }
    if (formData.freightCategory) {
      searchParams.freightCategory = formData.freightCategory
    }
    if (formData.vehicleType) {
      searchParams.vehicleType = formData.vehicleType
    }
    if (formData.vehicleId) {
      searchParams.vehicleId = formData.vehicleId
    }
    if (formData.passType) {
      searchParams.passType = parseInt(formData.passType)
    }
    if (formData.passMode) {
      searchParams.passMode = parseInt(formData.passMode)
    }
    if (formData.isModified) {
      searchParams.isModified = parseInt(formData.isModified)
    }
    
    console.log("=== 查询参数 JSON ===")
    console.log(JSON.stringify(searchParams, null, 2))
    console.log("====================")
    
    // 调用父组件传入的查询回调
    if (onSearch) {
      onSearch(searchParams)
    }
  }

  // 修改重置功能
  const handleReset = () => {
    setStart(new Date())
    setEnd(new Date())
    setFormData({
      minDiscountAmount: "",
      maxDiscountAmount: "",
      enStationName: "",
      exStationName: "",
      freightCategory: "",
      vehicleType: "",
      vehicleId: "",
      passType: "",
      passMode: "",
      isModified: "",
      intervalSize: "1000"
    })
    console.log("已重置所有查询条件")
    
    // 调用父组件传入的重置回调
    if (onReset) {
      onReset()
    }
  }

  // 更新下拉选项配置
  const cargoCategoryOptions: Option[] = [
    { label: "新鲜蔬菜", value: "新鲜蔬菜" },
    { label: "新鲜水果", value: "新鲜水果" },
    { label: "新鲜肉蛋奶", value: "新鲜肉蛋奶" },
    { label: "水产品", value: "水产品" },
    { label: "其他鲜活农产品", value: "其他鲜活农产品" },
  ]

  const vehicleTypeOptions: Option[] = [
    { label: "货一", value: "货一" },
    { label: "货二", value: "货二" },
    { label: "货三", value: "货三" },
    { label: "货四", value: "货四" },
    { label: "货五", value: "货五" },
    { label: "货六", value: "货六" },
  ]

  const passTypeOptions: Option[] = [
    { label: "正常通行", value: "1" },
    { label: "绿通通行", value: "2" },
    { label: "其他", value: "3" },
  ]

  const passModeOptions: Option[] = [
    { label: "ETC", value: "1" },
    { label: "人工", value: "2" },
    { label: "混合", value: "3" },
  ]

  const isModifiedOptions: Option[] = [
    { label: "是", value: "1" },
    { label: "否", value: "0" },
  ]

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
      {/* 顶部标题条 */}
      <Image
        src="/assets/Mask_Header2.png"
        alt="Statistics Category"
        width={460}
        height={33}
        className="object-contain mb-5"
      />

      <div className="space-y-3 ml-1">
        {/* 查询时段 */}
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
          <SearchInput
            value={formData.minDiscountAmount}
            onChange={(value) => handleChange("minDiscountAmount", value)}
            placeholder="请输入最小值"
          />
          <SearchInput
            value={formData.maxDiscountAmount}
            onChange={(value) => handleChange("maxDiscountAmount", value)}
            placeholder="请输入最大值"
          />
        </div>

        {/* 入口收费站名称 */}
        <div className="grid grid-cols-[90px_1fr] items-center gap-3">
          <Image src="/assets/Search3.png" alt="入口站" width={100} height={40} className="object-contain" />
          <SearchInput
            value={formData.enStationName}
            onChange={(value) => handleChange("enStationName", value)}
            placeholder="请输入入口收费站名称"
          />
        </div>

        {/* 出口收费站名称 */}
        <div className="grid grid-cols-[90px_1fr] items-center gap-3">
          <Image src="/assets/Search4.png" alt="出口站" width={100} height={40} className="object-contain" />
          <SearchInput
            value={formData.exStationName}
            onChange={(value) => handleChange("exStationName", value)}
            placeholder="请输入出口收费站名称"
          />
        </div>

        {/* 物品类别 */}
        <div className="grid grid-cols-[90px_1fr] items-center gap-3">
          <Image src="/assets/Search5.png" alt="物品类别" width={100} height={40} className="object-contain" />
          <CustomSelect
            value={formData.freightCategory}
            onChange={(value) => handleChange("freightCategory", value)}
            options={cargoCategoryOptions}
            placeholder="请选择物品类别"
          />
        </div>

        {/* 车型 */}
        <div className="grid grid-cols-[90px_1fr] items-center gap-3">
          <Image src="/assets/Search6.png" alt="车型" width={100} height={40} className="object-contain" />
          <CustomSelect
            value={formData.vehicleType}
            onChange={(value) => handleChange("vehicleType", value)}
            options={vehicleTypeOptions}
            placeholder="请选择车型"
          />
        </div>

        {/* 车牌号码 */}
        <div className="grid grid-cols-[90px_1fr] items-center gap-3">
          <Image src="/assets/Search7.png" alt="车牌" width={100} height={40} className="object-contain" />
          <SearchInput
            value={formData.vehicleId}
            onChange={(value) => handleChange("vehicleId", value)}
            placeholder="请输入车牌号码"
          />
        </div>

        {/* 通行类型 */}
        <div className="grid grid-cols-[90px_1fr] items-center gap-3">
          <Image src="/assets/Search8.png" alt="通行类型" width={100} height={40} className="object-contain" />
          <CustomSelect
            value={formData.passType}
            onChange={(value) => handleChange("passType", value)}
            options={passTypeOptions}
            placeholder="请选择通行类型"
          />
        </div>

        {/* 通行方式 */}
        <div className="grid grid-cols-[90px_1fr] items-center gap-3">
          <Image src="/assets/Search9.png" alt="通行方式" width={100} height={40} className="object-contain" />
          <CustomSelect
            value={formData.passMode}
            onChange={(value) => handleChange("passMode", value)}
            options={passModeOptions}
            placeholder="请选择通行方式"
          />
        </div>

        {/* 是否查验修改 */}
        <div className="grid grid-cols-[90px_1fr] items-center gap-3">
          <Image src="/assets/Search10.png" alt="查验修改" width={100} height={40} className="object-contain" />
          <CustomSelect
            value={formData.isModified}
            onChange={(value) => handleChange("isModified", value)}
            options={isModifiedOptions}
            placeholder="请选择"
          />
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
