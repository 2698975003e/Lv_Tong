"use client"

import { useEffect, useState } from "react"
import { TechDataTable } from "@/components/tech-data-table"
import { StatisticsCategory } from "@/components/right_statistics_category"
import { SearchPanel } from "@/components/search-panel"

interface VehicleLocationApiResponse {
  code: number
  message: string
  data: {
    nationalStatistics: Array<{ provinceCode: string; provinceName: string; vehicleCount: number }>
    shandongStatistics: Array<{ cityCode: string; cityName: string; vehicleCount: number }>
  }
  timestamp: number
}

export default function CarPositionPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [nationalConfig, setNationalConfig] = useState<any | null>(null)
  const [sdConfig, setSdConfig] = useState<any | null>(null)

  // 查询参数
  const [queryParams, setQueryParams] = useState({
    startDate: "2025-03-01",
    endDate: "2025-04-01",
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
    intervalSize: "1000",
  })

  const buildConfig = (titleCol: string, rows: Array<{ id: string; name: string; count: number }>) => {
    return {
      showPagination: false,
      columns: [
        { key: "id", label: "序号", width: "200px", align: "center" },
        { key: "name", label: titleCol, width: "200px", align: "center" },
        { key: "count", label: "运次", width: "200px", align: "center" },
      ],
      data: rows.map((r) => ({
        id: r.id,
        name: r.name,
        count: String(r.count),
        // 兼容旧字段
        licensePlate: "",
        vehicleType: "",
        trafficCount: 0,
        totalDiscount: "",
        mainRoute: "",
        jumpDetails: "",
        discountDetails: "",
        cargoDetails: "",
      })),
    }
  }

  const transform = (data: VehicleLocationApiResponse["data"]) => {
    const nationalRows =
      (data.nationalStatistics || []).map((x, i) => ({
        id: String(i + 1),
        name: x.provinceName,
        count: x.vehicleCount,
      })) || []

    const sdRows =
      (data.shandongStatistics || []).map((x, i) => ({
        id: String(i + 1),
        name: x.cityName,
        count: x.vehicleCount,
      })) || []

    setNationalConfig(buildConfig("车籍地", nationalRows))
    setSdConfig(buildConfig("车籍地", sdRows))
  }

  const fetchData = async (override?: Partial<typeof queryParams>) => {
    try {
      setLoading(true)
      setError(null)

      const p = { ...queryParams, ...(override || {}) }
      const qs = new URLSearchParams({ test: "scutgreenpass" })

      // 可选参数（后端如支持则会生效）
      if (p.startDate) qs.append("startDate", p.startDate)
      if (p.endDate) qs.append("endDate", p.endDate)
      if (p.minDiscountAmount) qs.append("minDiscountAmount", p.minDiscountAmount)
      if (p.maxDiscountAmount) qs.append("maxDiscountAmount", p.maxDiscountAmount)
      if (p.enStationName) qs.append("enStationName", p.enStationName)
      if (p.exStationName) qs.append("exStationName", p.exStationName)
      if (p.freightCategory) qs.append("freightCategory", p.freightCategory)
      if (p.vehicleType) qs.append("vehicleType", p.vehicleType)
      if (p.vehicleId) qs.append("vehicleId", p.vehicleId)
      if (p.passType) qs.append("passType", p.passType)
      if (p.passMode) qs.append("passMode", p.passMode)
      if (p.isModified) qs.append("isModified", p.isModified)
      if (p.intervalSize) qs.append("intervalSize", p.intervalSize)

      const res = await fetch(
        `http://116.57.120.171:8081/api/api/vehicle/location/statistics?${qs.toString()}`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      )
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json: VehicleLocationApiResponse = await res.json()
      if (json.code !== 200) throw new Error(json.message || "接口返回错误")
      transform(json.data)
    } catch (e: any) {
      setError(e.message || "数据加载失败")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // 右侧查询
  const handleSearch = (params: any) => {
    setQueryParams((prev) => ({ ...prev, ...params }))
    fetchData(params)
  }
  const handleReset = () => {
    const defaults = {
      startDate: "2025-03-01",
      endDate: "2025-04-01",
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
      intervalSize: "1000",
    }
    setQueryParams(defaults)
    fetchData(defaults)
  }

  return (
    <div className="h-[calc(100vh-100px)] bg-slate-900 p-4 flex flex-col">
      {/* 两列布局，比例 1416:460（与减免金额页面一致） */}
      <div className="flex-1 grid grid-cols-[1416fr_460fr] gap-4 min-h-0">
        {/* 左侧：两张表并排 */}
        <div className="flex flex-row gap-8 min-h-0">
          {/* 全国车籍地统计 */}
          <div className="flex-1 bg-slate-800/50 border border-blue-500/30 rounded-lg p-4 min-h-0">
            {loading ? (
              <div className="h-full flex items-center justify-center text-slate-300">数据加载中...</div>
            ) : error ? (
              <div className="h-full flex items-center justify-center text-red-400">加载失败：{error}</div>
            ) : nationalConfig ? (
              <TechDataTable config={nationalConfig} className="h-full" />
            ) : null}
          </div>

          {/* 山东省车籍地统计 */}
          <div className="flex-1 bg-slate-800/50 border border-blue-500/30 rounded-lg p-4 min-h-0">
            {loading ? (
              <div className="h-full flex items-center justify-center text-slate-300">数据加载中...</div>
            ) : error ? (
              <div className="h-full flex items-center justify-center text-red-400">加载失败：{error}</div>
            ) : sdConfig ? (
              <TechDataTable config={sdConfig} className="h-full" />
            ) : null}
          </div>
        </div>

        {/* 右侧：已有组件 */}
        <div className="bg-slate-800/50 border border-blue-500/30 rounded-lg p-0 overflow-hidden">
          <StatisticsCategory />
          <SearchPanel onSearch={handleSearch} onReset={handleReset} />
        </div>
      </div>
    </div>
  )
}