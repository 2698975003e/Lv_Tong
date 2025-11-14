"use client"

import { useEffect, useState } from "react"
import { TechDataTable } from "@/components/tech-data-table"
import { StatisticsCategory } from "@/components/right_statistics_category"
import { SearchPanel } from "@/components/search-panel"
import { apiFetch } from "@/lib/api"

interface FreightStatisticsApiResponse {
  code: number
  message: string
  data: {
    majorCategories: Array<{
      categoryCode: string
      categoryName: string
      vehicleCount: number
    }>
    minorCategories: Array<{
      categoryCode: string
      categoryName: string
      vehicleCount: number
    }>
  }
  timestamp: number
}

export default function HuoWuLeiBiePage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [majorConfig, setMajorConfig] = useState<any | null>(null)
  const [minorConfig, setMinorConfig] = useState<any | null>(null)

  // 右侧查询参数（如需扩展可继续补充）
  const [queryParams, setQueryParams] = useState({
    startDate: "",
    endDate: "",
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

  const buildTableConfig = (title: string, rows: Array<{ id: string; name: string; count: number }>) => {
    return {
      showPagination: false,
      columns: [
        { key: "id", label: "序号", width: "80px", align: "center" },
        { key: "name", label: title, width: "200px", align: "center" },
        { key: "count", label: "车辆运次", width: "140px", align: "center" },
      ],
      data: rows.map((r) => ({
        id: r.id,
        // TechDataTable 行结构兼容，映射字段名到 data 中
        licensePlate: "",
        vehicleType: "",
        trafficCount: 0,
        totalDiscount: "",
        mainRoute: "",
        jumpDetails: "",
        discountDetails: "",
        cargoDetails: "",
        // 自定义显示列
        name: r.name,
        count: String(r.count),
      })),
    }
  }

  const transform = (api: FreightStatisticsApiResponse["data"]) => {
    // 右侧为“货物分类统计”，左侧两张表：细项榜单、分类榜单
    const minor = (api.minorCategories || []).map((x, i) => ({
      id: String(i + 1),
      name: x.categoryName,
      count: x.vehicleCount,
    }))
    const major = (api.majorCategories || []).map((x, i) => ({
      id: String(i + 1),
      name: x.categoryName,
      count: x.vehicleCount,
    }))

    setMinorConfig(buildTableConfig("货物名称", minor))
    setMajorConfig(buildTableConfig("货物名称", major))
  }

  const fetchData = async (override?: Partial<typeof queryParams>) => {
    try {
      setLoading(true)
      setError(null)

      const p = { ...queryParams, ...(override || {}) }
      const qs = new URLSearchParams()
      // 可选挂参（后端若暂不支持可注释）
      if (p.startDate) qs.append("startDate", p.startDate)
      if (p.endDate) qs.append("endDate", p.endDate)
      if (p.freightCategory) qs.append("freightCategory", p.freightCategory)

      const res = await apiFetch(
        `/api/api/freight/statistics?${qs.toString()}`,
        { method: "GET" }
      )
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json: FreightStatisticsApiResponse = await res.json()
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
    // 如需要自动刷新，可打开
    // const timer = setInterval(() => fetchData(), 10000)
    // return () => clearInterval(timer)
  }, [])

  const handleSearch = (params: any) => {
    setQueryParams((prev) => ({ ...prev, ...params }))
    fetchData(params)
  }

  const handleReset = () => {
    const defaults = {
      startDate: "",
      endDate: "",
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
      {/* 两列布局，比例 1416:460（与 3_JianMianJinE 保持一致） */}
      <div className="flex-1 grid grid-cols-[1416fr_460fr] gap-4 min-h-0">
        {/* 左侧列：两张表，按设计图左右两列布局 */}
        <div className="flex flex-row gap-8 min-h-0">
          {/* 左列-细项榜单 */}

          <div className="flex-1 bg-slate-800/50 border border-blue-500/30 rounded-lg p-4 min-h-0">
            {loading ? (
              <div className="h-full flex items-center justify-center text-slate-300">数据加载中...</div>
            ) : error ? (
              <div className="h-full flex items-center justify-center text-red-400">加载失败：{error}</div>
            ) : minorConfig ? (

              <TechDataTable config={minorConfig} className="h-full" />
            ) : null}
          </div>

          {/* 右列-分类榜单 */}
          <div className="flex-1 bg-slate-800/50 border border-blue-500/30 rounded-lg p-4 min-h-0">
            {loading ? (
              <div className="h-full flex items-center justify-center text-slate-300">数据加载中...</div>
            ) : error ? (
              <div className="h-full flex items-center justify-center text-red-400">加载失败：{error}</div>
            ) : majorConfig ? (
              <TechDataTable config={majorConfig} className="h-full" />
            ) : null}
          </div>
        </div>

        {/* 右侧列：与 3_JianMianJinE 保持一致，使用已有组件 */}
        <div className="bg-slate-800/50 border border-blue-500/30 rounded-lg p-0 overflow-hidden">
          <StatisticsCategory />
          <SearchPanel onSearch={handleSearch} onReset={handleReset} />
        </div>
      </div>
    </div>
  )
}
