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
import { VehicleTypeSelect } from "@/components/vehicle-type-select"

type Option = { label: string; value: string }

// 可复用的标签组件
function LabelWithMask({ label }: { label: string }) {
  return (
    <div className="relative w-[90px] h-10">
      <Image
        src="/assets/TextLabelMask.png"
        alt={label}
        width={90}
        height={40}
        className="object-contain"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="-translate-y-1 text-[#6EC7FF] text-sm font-bold drop-shadow-[0_0_4px_rgba(110,199,255,0.6)]">
          {label}
        </span>
      </div>
    </div>
  )
}

// 文本显示组件
function TextDisplay({ value }: { value: string }) {
  return (
    <div className="-translate-y-0.5   h-9  bg-slate-700/50 border border-blue-500/50 rounded px-3 flex items-center">
      <span className="text-slate-200 text-sm">{value}</span>
    </div>
  )
}

// 下拉选择组件（使用VehicleTypeSelect的样式）
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
    <div className="relative h-8 -translate-y-1">
      <select
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full h-9 bg-slate-700/50 border border-blue-500/50 rounded px-3 pr-8 text-slate-200 text-sm appearance-none focus:outline-none focus:border-blue-400"
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-slate-800 text-slate-200">
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <div className="w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-blue-400"></div>
      </div>
    </div>
  )
}

// 查验详情接口类型定义
interface InspectionDetailApiResponse {
  code: number
  message: string
  data: {
    inspectionId: number
    checkId: string
    checkTime: string
    checkResult: number
    checkResultText: string
    driverTelephone: string
    vehicleId: string
    exTime: string
    fullLoadRate: string
    fullLoadRateNum: number
    enWeight: number
    exWeight: number
    weightDiff: number
    vehicleSize: string
    groupId: number
    transactionId: string
    passId: string
    transPayType: number
    transPayTypeName: string
    mediaType: number
    mediaTypeName: string
    vehicleClass: number
    vehicleClassName: string
    vehicleType: number
    vehicleTypeName: string
    vehicleSign: string
    freightTypesText: string
    freightCategory: string
    freightTypes: string
    enStationId: string
    enStationName: string
    exStationId: string
    exStationName: string
    fee: number
    payFee: number
    discountAmount: number
    regionCode: string
    regionName: string
    provinceCount: number
    operation: number
    crateType: string
    checkBasis: string
    photos: Array<{
      photoId: string
      typeId: string
      content: string
      position: string
      time: string
    }>
  }
  timestamp: number
}

interface SearchPanel2Props {
  detailData?: InspectionDetailApiResponse['data'] | null
  detailLoading?: boolean
  detailError?: string | null
  queryParams: {
    startDate: string
    endDate: string
    discountAmountOperator: string
    discountAmountValue: string
    stationName: string
    pageNum: number
    pageSize: number
  }
  onQueryChange: (field: string, value: string) => void
  onSearch: () => void
  onReset: () => void
  className?: string
}

export function SearchPanel2({ 
  detailData,
  detailLoading,
  detailError,
  queryParams, 
  onQueryChange, 
  onSearch, 
  onReset,
  className = "" 
}: SearchPanel2Props) {
  const [formData, setFormData] = React.useState({
    inspectionTime: "2025-03-01 08:00",
    inspectionResult: "17638138667",
    entryStationId: "XXXXX XXXXX",
    loadRate: "90%",
    exitStationId: "XXXXX XXXXX",
    cargoName: "水果",
    exitTransactionTime: "2025-03-01 08:00",
    entryWeight: "300 KM",
    totalTransactionAmount: "XXXXX 元",
    exitWeight: "300 KM",
    vehicleDimensions: "| |",
    receivableAmount: "XXXXX 元",
    provincesPassedCount: "2",
    teamNumber: "2",
    driverPhone: "17638138667",
    unqualifiedType: "",
    plateNumber: "沪A·AS196",
    paymentMethod: "",
    vehicleStatus: "",
    inspectionBasis: "",
    boxType: "",
    vehicleType2: "",
    vehicleCategory: "",
    attribute: "",
    inspection: "",
    passMedium: "",
    exitTransactionId: "XXXXXX",
    passTokenId: "XXXXXX",
    remark: "",
  })

  const [auditLoading, setAuditLoading] = React.useState(false)
  const [auditError, setAuditError] = React.useState<string | null>(null)

  // 当外部数据传入时，更新formData
  React.useEffect(() => {
    if (detailData) {
      setFormData(prev => ({
        ...prev,
        inspectionTime: detailData.checkTime?.replace(/-/g, ".").replace(" ", " ") || "2025-03-01 08:00",
        inspectionResult: detailData.checkResultText || "待审查",
        entryStationId: detailData.enStationName || "XXXXX XXXXX",
        loadRate: (detailData.fullLoadRate || "0") + "%",
        exitStationId: detailData.exStationName || "XXXXX XXXXX",
        cargoName: detailData.freightTypesText || "未知货物",
        exitTransactionTime: detailData.exTime?.replace(/-/g, ".").replace(" ", " ") || "2025-03-01 08:00",
        entryWeight: detailData.enWeight ? `${detailData.enWeight} KG` : "0 KG",
        totalTransactionAmount: detailData.fee ? `${detailData.fee.toFixed(2)}元` : "0元",
        exitWeight: detailData.exWeight ? `${detailData.exWeight} KG` : "0 KG",
        vehicleDimensions: detailData.vehicleSize || "| |",
        receivableAmount: detailData.payFee ? `${detailData.payFee.toFixed(2)}元` : "0元",
        provincesPassedCount: detailData.provinceCount ? detailData.provinceCount.toString() : "0",
        teamNumber: detailData.groupId ? detailData.groupId.toString() : "0",
        driverPhone: detailData.driverTelephone || "17638138667",
        unqualifiedType: "",
        plateNumber: detailData.vehicleId || "沪A·AS196",
        paymentMethod: detailData.transPayTypeName || "",
        vehicleStatus: "",
        inspectionBasis: detailData.checkBasis || "",
        boxType: detailData.crateType || "",
        vehicleType2: detailData.vehicleTypeName || "",
        vehicleCategory: detailData.vehicleClassName || "",
        attribute: "",
        inspection: detailData.checkResultText || "",
        passMedium: detailData.mediaTypeName || "",
        exitTransactionId: detailData.transactionId || "XXXXXX",
        passTokenId: detailData.passId || "XXXXXX",
        remark: "", // 重置备注为空
      }))
    }
  }, [detailData])

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // 提交稽查结果
  const submitAudit = async (auditResult: number, remark?: string) => {
    if (!detailData?.inspectionId) {
      setAuditError("没有有效的查验ID")
      return
    }

    try {
      setAuditLoading(true)
      setAuditError(null)

      const requestBody = {
        inspectionId: detailData.inspectionId,
        auditResult: auditResult,
        remark: remark || formData.remark || ""
      }

      console.log("提交稽查数据:", requestBody)

      const response = await fetch(
        'http://116.57.120.171:8081/api/api/inspection/audit',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (result.code === 200) {
        console.log("稽查提交成功:", result)
        // 可以在这里添加成功提示
      } else {
        throw new Error(result.message || '稽查提交失败')
      }
    } catch (err: any) {
      setAuditError(err.message || '稽查提交失败')
      console.error("稽查提交失败:", err)
    } finally {
      setAuditLoading(false)
    }
  }

  const unqualifiedTypeOptions: Option[] = [
    { label: "超载", value: "overload" },
    { label: "车型不符", value: "vehicle_mismatch" },
    { label: "货物不符", value: "cargo_mismatch" },
    { label: "其他", value: "other" },
  ]

  const paymentOptions: Option[] = [
    { label: "现金", value: "cash" }, { label: "刷卡", value: "card" }, { label: "ETC", value: "etc" }
  ]
  const statusOptions: Option[] = [
    { label: "正常", value: "ok" }, { label: "异常", value: "bad" }
  ]
  const basisOptions: Option[] = [
    { label: "视频查验", value: "video" }, { label: "人工查验", value: "manual" }
  ]
  const boxTypeOptions: Option[] = [
    { label: "厢式", value: "box" }, { label: "篷布", value: "tarpaulin" }
  ]
  const vehicleTypeOptions: Option[] = [
    { label: "车型一", value: "t1" }, { label: "车型二", value: "t2" }
  ]
  const categoryOptions: Option[] = [
    { label: "货运", value: "freight" }, { label: "客运", value: "passenger" }
  ]
  const attributeOptions: Option[] = [
    { label: "危化品", value: "danger" }, { label: "普货", value: "normal" }
  ]
  const inspectionOptions: Option[] = [
    { label: "合格", value: "pass" }, { label: "不合格", value: "fail" }
  ]
  const mediumOptions: Option[] = [
    { label: "通行卡", value: "card" }, { label: "ETC", value: "etc" }, { label: "人工", value: "manual" }
  ]

  return (
    <div
      className="w-[500px] p-2 mt-5"
      style={{
        background: "linear-gradient(180deg, rgba(0,20,40,0.9) 0%, rgba(0,10,25,0.9) 100%)",
        border: "1px solid rgba(0,164,255,0.35)",
        borderRadius: 8,
      }}
    >
      {/* 根据是否有详情数据显示不同内容 */}
      {detailLoading ? (
        <div className="h-full flex items-center justify-center text-slate-300">
          详情加载中...
        </div>
      ) : detailError ? (
        <div className="h-full flex items-center justify-center text-red-400">
          详情加载失败: {detailError}
        </div>
      ) : detailData ? (
        // 详情数据显示
        <div className="space-y-1.5">
          {/* 第一行 checkTime */}
          <div className="grid grid-cols-[90px_1fr_90px_1fr] items-center gap-2">
            <LabelWithMask label="查验时间" />
            <TextDisplay value={formData.inspectionTime} />
            {/* checkResultText */}
            <LabelWithMask label="查验结果" />
            <TextDisplay value={formData.inspectionResult} />
          </div>

          {/* 第二行   */}
          <div className="grid grid-cols-[90px_1fr_90px_1fr] items-center gap-2">
              {/* enStationId */}
            <LabelWithMask label="入口站编号" />
            <TextDisplay value={formData.entryStationId} />
            {/* 接口字段为fullLoadRate  */}
            <LabelWithMask label="满载率" />
            <TextDisplay value={formData.loadRate} />
          </div>

          {/* 第三行 */}
          <div className="grid grid-cols-[90px_1fr_90px_1fr] items-center gap-2">
            <LabelWithMask label="出口站编号" />
            {/* exStationId */}
            <TextDisplay value={formData.exitStationId} />
            <LabelWithMask label="货物名称" />
            {/* freightTypesText */}
            <TextDisplay value={formData.cargoName} />
          </div>

          {/* 第四行 */}
          <div className="grid grid-cols-[90px_1fr_90px_1fr] items-center gap-2">
            <LabelWithMask label="出口交易时间" />
            {/* exTime */}
            <TextDisplay value={formData.exitTransactionTime} />
            <LabelWithMask label="入口重量" />
            {/* enWeight */}
            <TextDisplay value={formData.entryWeight} />
          </div>

          {/* 第五行 */}
          <div className="grid grid-cols-[90px_1fr_90px_1fr] items-center gap-2">
            <LabelWithMask label="总交易金额" />
            {/* 19299 */}
            <TextDisplay value={formData.totalTransactionAmount} />
            <LabelWithMask label="出口重量" />
            {/* exWeight */}
            <TextDisplay value={formData.exitWeight} />
          </div>

          {/* 第六行 */}
          <div className="grid grid-cols-[90px_1fr_90px_1fr] items-center gap-2">
            <LabelWithMask label="车货长宽高" />
            {/* vehicleSize 25|2|12 */}
            <TextDisplay value={formData.vehicleDimensions} />
            <LabelWithMask label="应收金额" />
            <TextDisplay value={formData.receivableAmount} />
          </div>

          {/* 第七行 */}
          <div className="grid grid-cols-[90px_40px_90px_30px_90px_1fr] items-center gap-0">
            <LabelWithMask label="通行省份个数" />
            {/* provinceCount */}
            <TextDisplay value={formData.provincesPassedCount} />
            <LabelWithMask label="班组编号" />
            {/* groupId */}
            <TextDisplay value={formData.teamNumber} />
            <LabelWithMask label="司机电话" />
            {/* driverTelephone */}
            <TextDisplay value={formData.driverPhone} />
          </div>

          {/* 第八行 */}
          <div className="grid grid-cols-[90px_1fr_90px_1fr] items-center gap-2">
            <LabelWithMask label="不合格类型" />
            <CustomSelect
              value={formData.unqualifiedType}
              onChange={(value) => handleChange('unqualifiedType', value)}
              options={unqualifiedTypeOptions}
              placeholder="请选择"
            />
            <LabelWithMask label="修改" />
            <CustomSelect
              value={formData.unqualifiedType}
              onChange={(value) => handleChange('unqualifiedType', value)}
              options={unqualifiedTypeOptions}
              placeholder="请选择"
            />
          </div>

          {/* 新增部分 - 车牌、交易支付方式/车型、车辆状态/车种、查验依据/属性、货箱类型/查验、通行介质、编号与备注 */}

          {/* 车牌号码（左） + 右侧显示开关方块 */}
          <div className="grid grid-cols-[90px_1fr_90px_1fr] items-center gap-2">
            <LabelWithMask label="车牌号码" />
            {/* vehicleId */}
            <TextDisplay value={formData.plateNumber} />

            <LabelWithMask label="车型" />
            {/* 普通货车 */}
            <CustomSelect
              value={formData.vehicleType2}
              onChange={(v) => handleChange("vehicleType2", v)}
              options={vehicleTypeOptions}
              placeholder="请选择"
            />
          </div>

          {/* 交易支付方式 | 车型 */}
          <div className="grid grid-cols-[90px_1fr_90px_1fr] items-center gap-2">
            <LabelWithMask label="交易支付方式" />
            {/* transPayTypeName */}
            <CustomSelect
              value={formData.paymentMethod}
              onChange={(v) => handleChange("paymentMethod", v)}
              options={paymentOptions}
              placeholder="请选择"
            />
            <LabelWithMask label="车种" />
            {/* vehicleClassName */}
            <CustomSelect
              value={formData.vehicleCategory}
              onChange={(v) => handleChange("vehicleCategory", v)}
              options={categoryOptions}
              placeholder="请选择"
            />

          </div>

          {/* 车辆状态标识 | 车种 */}
          <div className="grid grid-cols-[90px_1fr_90px_1fr] items-center gap-2">
            <LabelWithMask label="车辆状态标识" />
            <CustomSelect
              value={formData.vehicleStatus}
              onChange={(v) => handleChange("vehicleStatus", v)}
              options={statusOptions}
              placeholder="请选择"
            />
            <LabelWithMask label="复核" />
            <CustomSelect
              value={formData.attribute}
              onChange={(v) => handleChange("attribute", v)}
              options={attributeOptions}
              placeholder="请选择"
            />
          </div>

          {/* 查验依据 | 属性 */}
          <div className="grid grid-cols-[90px_1fr_90px_1fr] items-center gap-2">
            <LabelWithMask label="查验依据" />
            <CustomSelect
              value={formData.inspectionBasis}
              onChange={(v) => handleChange("inspectionBasis", v)}
              options={basisOptions}
              placeholder="请选择"
            />
            <LabelWithMask label="查验" />
            <CustomSelect
              value={formData.inspection}
              onChange={(v) => handleChange("inspection", v)}
              options={inspectionOptions}
              placeholder="请选择"
            />
          </div>

          {/* 货箱类型 | 查验 */}
          <div className="grid grid-cols-[90px_1fr_90px_1fr] items-center gap-2">
            <LabelWithMask label="货箱类型" />
            <CustomSelect
              value={formData.boxType}
              onChange={(v) => handleChange("boxType", v)}
              options={boxTypeOptions}
              placeholder="请选择"
            />
            <LabelWithMask label="通行介质" />
            <CustomSelect
              value={formData.passMedium}
              onChange={(v) => handleChange("passMedium", v)}
              options={mediumOptions}
              placeholder="请选择"
            />
          </div>


          {/* 出口交易编号（整行） */}
          <div className="grid grid-cols-[90px_1fr] items-center gap-2">
            <LabelWithMask label="出口交易编号" />
            {/* transactionId */}
            <TextDisplay value={formData.exitTransactionId} />
          </div>

          {/* 通行标识ID（整行） */}
          <div className="grid grid-cols-[90px_1fr] items-center gap-2">
            <LabelWithMask label="通行标识ID" />
            {/* passId */}
            <TextDisplay value={formData.passTokenId} />
          </div>

          {/* 备注内容（整行输入框） */}
          <div className="grid grid-cols-[90px_1fr] items-center gap-2">
            <LabelWithMask label="备注内容" />
            <div className="h-8 bg-slate-700/50 border border-blue-500/50 rounded px-3 flex items-center">
              <input
                value={formData.remark}
                onChange={(e) => handleChange("remark", e.target.value)}
                placeholder="请输入备注"
                className="w-full bg-transparent text-slate-200 text-sm outline-none"
              />
            </div>
          </div>
        </div>
      ) : (
        // 查询表单显示
        <div className="space-y-1.5">
          {/* 第一行 checkTime */}
          <div className="grid grid-cols-[90px_1fr_90px_1fr] items-center gap-2">
            <LabelWithMask label="查验时间" />
            <TextDisplay value={queryParams.startDate} />
            {/* checkResultText */}
            <LabelWithMask label="查验结果" />
            <TextDisplay value={queryParams.discountAmountOperator} />
          </div>

          {/* 第二行   */}
          <div className="grid grid-cols-[90px_1fr_90px_1fr] items-center gap-2">
              {/* enStationId */}
            <LabelWithMask label="入口站编号" />
            <TextDisplay value={queryParams.stationName} />
            {/* 接口字段为fullLoadRate  */}
            <LabelWithMask label="满载率" />
            <TextDisplay value={queryParams.discountAmountValue} />
          </div>

          {/* 第三行 */}
          <div className="grid grid-cols-[90px_1fr_90px_1fr] items-center gap-2">
            <LabelWithMask label="出口站编号" />
            {/* exStationId */}
            <TextDisplay value={queryParams.stationName} />
            <LabelWithMask label="货物名称" />
            {/* freightTypesText */}
            <TextDisplay value={queryParams.stationName} />
          </div>

          {/* 第四行 */}
          <div className="grid grid-cols-[90px_1fr_90px_1fr] items-center gap-2">
            <LabelWithMask label="出口交易时间" />
            {/* exTime */}
            <TextDisplay value={queryParams.startDate} />
            <LabelWithMask label="入口重量" />
            {/* enWeight */}
            <TextDisplay value={queryParams.discountAmountValue} />
          </div>

          {/* 第五行 */}
          <div className="grid grid-cols-[90px_1fr_90px_1fr] items-center gap-2">
            <LabelWithMask label="总交易金额" />
            {/* 19299 */}
            <TextDisplay value={queryParams.discountAmountValue} />
            <LabelWithMask label="出口重量" />
            {/* exWeight */}
            <TextDisplay value={queryParams.discountAmountValue} />
          </div>

          {/* 第六行 */}
          <div className="grid grid-cols-[90px_1fr_90px_1fr] items-center gap-2">
            <LabelWithMask label="车货长宽高" />
            {/* vehicleSize 25|2|12 */}
            <TextDisplay value={queryParams.stationName} />
            <LabelWithMask label="应收金额" />
            <TextDisplay value={queryParams.discountAmountValue} />
          </div>

          {/* 第七行 */}
          <div className="grid grid-cols-[90px_40px_90px_30px_90px_1fr] items-center gap-0">
            <LabelWithMask label="通行省份个数" />
            {/* provinceCount */}
            <TextDisplay value={queryParams.discountAmountValue} />
            <LabelWithMask label="班组编号" />
            {/* groupId */}
            <TextDisplay value={queryParams.discountAmountValue} />
            <LabelWithMask label="司机电话" />
            {/* driverTelephone */}
            <TextDisplay value={queryParams.discountAmountValue} />
          </div>

          {/* 第八行 */}
          <div className="grid grid-cols-[90px_1fr_90px_1fr] items-center gap-2">
            <LabelWithMask label="不合格类型" />
            <CustomSelect
              value={queryParams.discountAmountOperator}
              onChange={(value) => onQueryChange('discountAmountOperator', value)}
              options={unqualifiedTypeOptions}
              placeholder="请选择"
            />
            <LabelWithMask label="修改" />
            <CustomSelect
              value={queryParams.discountAmountOperator}
              onChange={(value) => onQueryChange('discountAmountOperator', value)}
              options={unqualifiedTypeOptions}
              placeholder="请选择"
            />
          </div>

          {/* 新增部分 - 车牌、交易支付方式/车型、车辆状态/车种、查验依据/属性、货箱类型/查验、通行介质、编号与备注 */}

          {/* 车牌号码（左） + 右侧显示开关方块 */}
          <div className="grid grid-cols-[90px_1fr_90px_1fr] items-center gap-2">
            <LabelWithMask label="车牌号码" />
            {/* vehicleId */}
            <TextDisplay value={queryParams.stationName} />

            <LabelWithMask label="车型" />
            {/* 普通货车 */}
            <CustomSelect
              value={queryParams.discountAmountOperator}
              onChange={(v) => onQueryChange('discountAmountOperator', v)}
              options={vehicleTypeOptions}
              placeholder="请选择"
            />
          </div>

          {/* 交易支付方式 | 车型 */}
          <div className="grid grid-cols-[90px_1fr_90px_1fr] items-center gap-2">
            <LabelWithMask label="交易支付方式" />
            {/* transPayTypeName */}
            <CustomSelect
              value={queryParams.discountAmountOperator}
              onChange={(v) => onQueryChange('discountAmountOperator', v)}
              options={paymentOptions}
              placeholder="请选择"
            />
            <LabelWithMask label="车种" />
            {/* vehicleClassName */}
            <CustomSelect
              value={queryParams.discountAmountOperator}
              onChange={(v) => onQueryChange('discountAmountOperator', v)}
              options={categoryOptions}
              placeholder="请选择"
            />

          </div>

          {/* 车辆状态标识 | 车种 */}
          <div className="grid grid-cols-[90px_1fr_90px_1fr] items-center gap-2">
            <LabelWithMask label="车辆状态标识" />
            <CustomSelect
              value={queryParams.discountAmountOperator}
              onChange={(v) => onQueryChange('discountAmountOperator', v)}
              options={statusOptions}
              placeholder="请选择"
            />
            <LabelWithMask label="复核" />
            <CustomSelect
              value={queryParams.discountAmountOperator}
              onChange={(v) => onQueryChange('discountAmountOperator', v)}
              options={attributeOptions}
              placeholder="请选择"
            />
          </div>

          {/* 查验依据 | 属性 */}
          <div className="grid grid-cols-[90px_1fr_90px_1fr] items-center gap-2">
            <LabelWithMask label="查验依据" />
            <CustomSelect
              value={queryParams.discountAmountOperator}
              onChange={(v) => onQueryChange('discountAmountOperator', v)}
              options={basisOptions}
              placeholder="请选择"
            />
            <LabelWithMask label="查验" />
            <CustomSelect
              value={queryParams.discountAmountOperator}
              onChange={(v) => onQueryChange('discountAmountOperator', v)}
              options={inspectionOptions}
              placeholder="请选择"
            />
          </div>

          {/* 货箱类型 | 查验 */}
          <div className="grid grid-cols-[90px_1fr_90px_1fr] items-center gap-2">
            <LabelWithMask label="货箱类型" />
            <CustomSelect
              value={queryParams.discountAmountOperator}
              onChange={(v) => onQueryChange('discountAmountOperator', v)}
              options={boxTypeOptions}
              placeholder="请选择"
            />
            <LabelWithMask label="通行介质" />
            <CustomSelect
              value={queryParams.discountAmountOperator}
              onChange={(v) => onQueryChange('discountAmountOperator', v)}
              options={mediumOptions}
              placeholder="请选择"
            />
          </div>


          {/* 出口交易编号（整行） */}
          <div className="grid grid-cols-[90px_1fr] items-center gap-2">
            <LabelWithMask label="出口交易编号" />
            {/* transactionId */}
            <TextDisplay value={queryParams.discountAmountValue} />
          </div>

          {/* 通行标识ID（整行） */}
          <div className="grid grid-cols-[90px_1fr] items-center gap-2">
            <LabelWithMask label="通行标识ID" />
            {/* passId */}
            <TextDisplay value={queryParams.discountAmountValue} />
          </div>

          {/* 备注内容（整行输入框） */}
          <div className="grid grid-cols-[90px_1fr] items-center gap-2">
            <LabelWithMask label="备注内容" />
            <div className="h-8 bg-slate-700/50 border border-blue-500/50 rounded px-3 flex items-center">
              <input
                value={queryParams.discountAmountValue}
                onChange={(e) => onQueryChange('discountAmountValue', e.target.value)}
                placeholder="请输入备注"
                className="w-full bg-transparent text-slate-200 text-sm outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* 错误提示 */}
      {auditError && (
        <div className="text-red-400 text-sm mt-2 text-center">
          {auditError}
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex justify-center gap-4 mt-6">
        <ImageBgButton
          bgSrc="/assets/Check1.png"
          text={auditLoading ? "提交中..." : "稽查合格"}
          onClick={() => submitAudit(1)}
          className="w-[127px] h-[44px]"
          stretch="cover"
        />
        <ImageBgButton
          bgSrc="/assets/Check2.png"
          text="撤消稽查"
          onClick={() => {
            // 撤消稽查可能不需要调用API，或者调用不同的接口
            console.log("撤消稽查操作")
            setFormData(prev => ({ ...prev, remark: "" }))
          }}
          className="w-[127px] h-[44px]"
          stretch="cover"
        />
        <ImageBgButton
          bgSrc="/assets/Check3.png"
          text={auditLoading ? "提交中..." : "稽查不合格"}
          onClick={() => submitAudit(2)}
          className="w-[127px] h-[44px]"
          stretch="cover"
        />
      </div>
    </div>
  )
}
