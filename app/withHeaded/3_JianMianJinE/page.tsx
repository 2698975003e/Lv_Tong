"use client"

import { useEffect, useState } from "react"
import { StatisticsCategory } from "@/components/right_statistics_category"
import { SearchPanel } from "@/components/search-panel"
import { TechDataTable } from "@/components/tech-data-table"
import { apiFetch } from "@/lib/api"

// ===== 类型与转换函数 =====
type ApiResp = {
  code: number
  data: {
    companyStatistics: Array<{
      companyId: string
      companyName: string
      stationCount: number
      greenPassCount: number
      totalDiscountAmount: number
      avgDiscountAmount: number
      amountIntervals: Array<{
        intervalRange: string
        minAmount: number
        maxAmount?: number
        vehicleCount: number
        totalAmount: number
      }>
    }>
    stationStatistics: Array<{
      stationId: string
      stationName: string
      companyId: string
      companyName: string
      greenPassCount: number
      totalDiscountAmount: number
      avgDiscountAmount: number
      amountIntervals: Array<{
        intervalRange: string
        minAmount: number
        maxAmount?: number
        vehicleCount: number
        totalAmount: number
      }>
    }>
  }
}

const RANGES = ["0-500","500-1000","1000-2000","2000-3000","3000-4000","4000-5000",">5000"]
const norm = (s: string) => s.replace("\\u003E", ">").replace("\u003E", ">").trim()
const findItem = (arr: {intervalRange:string,totalAmount:number,vehicleCount:number}[] = [], tag: string) =>
  arr.find(x => norm(x.intervalRange) === tag)

function transformToConfigs(api: ApiResp) {
  const company = api.data.companyStatistics?.[0]
  const cname = company?.companyName ?? ""

  // 金额行
  const amountRow = {
    id: "1",
    category: "减免金额 (元)",
    totalAmount: (company?.totalDiscountAmount ?? 0).toFixed(2),
    avgAmount: (company?.avgDiscountAmount ?? 0).toFixed(2),
    range1: (findItem(company?.amountIntervals, RANGES[0])?.totalAmount ?? 0).toFixed(2),
    range2: (findItem(company?.amountIntervals, RANGES[1])?.totalAmount ?? 0).toFixed(2),
    range3: (findItem(company?.amountIntervals, RANGES[2])?.totalAmount ?? 0).toFixed(2),
    range4: (findItem(company?.amountIntervals, RANGES[3])?.totalAmount ?? 0).toFixed(2),
    range5: (findItem(company?.amountIntervals, RANGES[4])?.totalAmount ?? 0).toFixed(2),
    range6: (findItem(company?.amountIntervals, RANGES[5])?.totalAmount ?? 0).toFixed(2),
    range7: (findItem(company?.amountIntervals, RANGES[6])?.totalAmount ?? 0).toFixed(2),
  }

  // 辆次行
  const countRow = {
    id: "2",
    category: "车辆运次",
    totalAmount: String(company?.greenPassCount ?? 0),
    avgAmount: "",
    range1: String(findItem(company?.amountIntervals, RANGES[0])?.vehicleCount ?? 0),
    range2: String(findItem(company?.amountIntervals, RANGES[1])?.vehicleCount ?? 0),
    range3: String(findItem(company?.amountIntervals, RANGES[2])?.vehicleCount ?? 0),
    range4: String(findItem(company?.amountIntervals, RANGES[3])?.vehicleCount ?? 0),
    range5: String(findItem(company?.amountIntervals, RANGES[4])?.vehicleCount ?? 0),
    range6: String(findItem(company?.amountIntervals, RANGES[5])?.vehicleCount ?? 0),
    range7: String(findItem(company?.amountIntervals, RANGES[6])?.vehicleCount ?? 0),
  }

  const branchConfig = {
    showPagination: false,
    columns: [
      { key: "category", label: `分公司姓名（${cname}）`, width: "150px", align: "center" },
      { key: "totalAmount", label: "减免总金额", width: "150px", align: "center" },
      { key: "avgAmount", label: "单车平均减免金额", width: "150px", align: "center" },
      { key: "range1", label: "<500元/辆次", width: "150x", align: "center" },
      { key: "range2", label: "500-1000元/辆次", width: "150px", align: "center" },
      { key: "range3", label: "1000-2000元/辆次", width: "150px", align: "center" },
      { key: "range4", label: "2000-3000元/辆次", width: "150px", align: "center" },
      { key: "range5", label: "3000-4000元/辆次", width: "150px", align: "center" },
      { key: "range6", label: "4000-5000元/辆次", width: "150px", align: "center" },
      { key: "range7", label: ">5000元/辆次", width: "150px", align: "center" },
    ],
    data: [amountRow, countRow],
  }

  const fmt = (amt?: number, cnt?: number) => `${(amt ?? 0).toFixed(2)}/${String(cnt ?? 0)}`
  const stationConfig = {
    showPagination: false,
    columns: [
      { key: "stationName", label: "收费站名称", width: "130px", align: "center" },
      { key: "greenVehicles", label: "绿通车数 (辆次)", width: "130px", align: "center" },
      { key: "totalAmount", label: "减免总金额 (元)", width: "130px", align: "center" },
      { key: "avgAmount", label: "单车平均减免金额 (元)", width: "160px", align: "center" },
      { key: "range1", label: "<500元/辆次", width: "130px", align: "center" },
      { key: "range2", label: "500-1000元/辆次", width: "130px", align: "center" },
      { key: "range3", label: "1000-2000元/辆次", width: "150px", align: "center" },
      { key: "range4", label: "2000-3000元/辆次", width: "150px", align: "center" },
      { key: "range5", label: "3000-4000元/辆次", width: "150px", align: "center" },
      { key: "range6", label: "4000-5000元/辆次", width: "150px", align: "center" },
      { key: "range7", label: ">5000元/辆次", width: "130px", align: "center" },
    ],
    data: (api.data.stationStatistics || []).map((s, i) => {
      const r1 = findItem(s.amountIntervals, RANGES[0])
      const r2 = findItem(s.amountIntervals, RANGES[1])
      const r3 = findItem(s.amountIntervals, RANGES[2])
      const r4 = findItem(s.amountIntervals, RANGES[3])
      const r5 = findItem(s.amountIntervals, RANGES[4])
      const r6 = findItem(s.amountIntervals, RANGES[5])
      const r7 = findItem(s.amountIntervals, RANGES[6])
      return {
        id: String(i + 1),
        stationName: s.stationName,
        greenVehicles: String(s.greenPassCount ?? 0),
        totalAmount: (s.totalDiscountAmount ?? 0).toFixed(2),
        avgAmount: (s.avgDiscountAmount ?? 0).toFixed(2),
        range1: fmt(r1?.totalAmount, r1?.vehicleCount),
        range2: fmt(r2?.totalAmount, r2?.vehicleCount),
        range3: fmt(r3?.totalAmount, r3?.vehicleCount),
        range4: fmt(r4?.totalAmount, r4?.vehicleCount),
        range5: fmt(r5?.totalAmount, r5?.vehicleCount),
        range6: fmt(r6?.totalAmount, r6?.vehicleCount),
        range7: fmt(r7?.totalAmount, r7?.vehicleCount),
        licensePlate: "",
        vehicleType: "",
        trafficCount: 0,
        totalDiscount: "",
        mainRoute: "",
        jumpDetails: "",
        discountDetails: "",
        cargoDetails: "",
      }
    }),
  }

  return { branchConfig, stationConfig }
}

// ===== 页面：拉取接口并渲染两个表格 =====
export default function JianMianJinEPage() {
  const [branchConfigState, setBranchConfigState] = useState<any | null>(null)
  const [stationConfigState, setStationConfigState] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // 添加查询参数状态
  const [queryParams, setQueryParams] = useState<any>({
    startDate: "2025-04-01",
    endDate: "2025-04-01",
    intervalSize: 1000
  })

  // 加载数据的函数
  const loadData = async (params?: any) => {
    const controller = new AbortController()
    try {
      setLoading(true)
      setError(null)
      
      // 构建查询参数
      const searchParams = new URLSearchParams()
      
      // 如果有传入的查询参数，添加到 URL
      const finalParams = params || queryParams
      if (finalParams.startDate) searchParams.append("startDate", finalParams.startDate)
      if (finalParams.endDate) searchParams.append("endDate", finalParams.endDate)
      if (finalParams.minDiscountAmount) searchParams.append("minDiscountAmount", finalParams.minDiscountAmount)
      if (finalParams.maxDiscountAmount) searchParams.append("maxDiscountAmount", finalParams.maxDiscountAmount)
      if (finalParams.enStationName) searchParams.append("enStationName", finalParams.enStationName)
      if (finalParams.exStationName) searchParams.append("exStationName", finalParams.exStationName)
      if (finalParams.freightCategory) searchParams.append("freightCategory", finalParams.freightCategory)
      if (finalParams.vehicleType) searchParams.append("vehicleType", finalParams.vehicleType)
      if (finalParams.vehicleId) searchParams.append("vehicleId", finalParams.vehicleId)
      if (finalParams.passType) searchParams.append("passType", finalParams.passType)
      if (finalParams.passMode) searchParams.append("passMode", finalParams.passMode)
      if (finalParams.isModified) searchParams.append("isModified", finalParams.isModified)
      if (finalParams.intervalSize) searchParams.append("intervalSize", finalParams.intervalSize)
      
      const res = await apiFetch(
        `/api/discount/statistics?${searchParams.toString()}`,
        { signal: controller.signal }
      )
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json: ApiResp = await res.json()
      if (json?.code !== 200) throw new Error((json as any)?.message || "接口返回错误")

      const { branchConfig, stationConfig } = transformToConfigs(json)
      setBranchConfigState(branchConfig)
      setStationConfigState(stationConfig)
    } catch (e: any) {
      if (e.name !== "AbortError") setError(e.message || "加载失败")
    } finally {
      setLoading(false)
    }
    
    return () => controller.abort()
  }

  useEffect(() => {
    loadData()
  }, [])

  // 处理查询
  const handleSearch = (params: any) => {
    setQueryParams(params)
    loadData(params)
  }

  // 处理重置
  const handleReset = () => {
    const defaultParams = {
      startDate: "2025-04-01",
      endDate: "2025-04-01",
      intervalSize: 1000
    }
    setQueryParams(defaultParams)
    loadData(defaultParams)
  }

  return (
    <div className="h-[calc(100vh-100px)] bg-slate-900 p-4 flex flex-col">
      {/* 两列布局，比例 1416:460 */}
      <div className="flex-1 grid grid-cols-[1416fr_460fr] gap-4 min-h-0">
        {/* 左侧列 - 上下两个表格 */}
        <div className="flex flex-col gap-12 min-h-0 ">
          {/* 上表格：分公司减免金额 - 1份 */}
          <div className="h-[20%] min-h-0">
            {loading ? (
              <div className="h-full flex items-center justify-center text-slate-300">数据加载中...</div>
            ) : error ? (
              <div className="h-full flex items-center justify-center text-red-400">加载失败：{error}</div>
            ) : branchConfigState ? (
              <TechDataTable config={branchConfigState} className="h-full" />
            ) : null}
          </div>

          {/* 下表格：收费站减免金额 - 3份 */}
          <div className="h-[80%] min-h-0">
            {loading ? (
              <div className="h-full flex items-center justify-center text-slate-300">数据加载中...</div>
            ) : error ? (
              <div className="h-full flex items-center justify-center text-red-400">加载失败：{error}</div>
            ) : stationConfigState ? (
              <TechDataTable config={stationConfigState} className="h-full" />
            ) : null}
          </div>
        </div>

        {/* 右侧列 */}
        <div className="bg-slate-800/50 border border-blue-500/30 rounded-lg p-0">
          <StatisticsCategory />
          <SearchPanel onSearch={handleSearch} onReset={handleReset} />
        </div>
      </div>
    </div>
  )
}
