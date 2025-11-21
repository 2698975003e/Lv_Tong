"use client"

import { useEffect, useState } from "react"
import { TechDataTable } from "@/components/tech-data-table"
import { StatisticsCategory } from "@/components/right_statistics_category"
import { SearchPanel } from "@/components/search-panel"
import { apiFetch } from "@/lib/api"

// API数据类型定义
interface VehicleStatisticsApiResponse {
  code: number
  message: string
  data: {
    totalStatistics: {
      totalCount: number
      vehicleTypeStatistics: Array<{
        vehicleType: string
        vehicleTypeName: string
        count: number
        percentage: number
      }>
    }
    stationStatistics: Array<{
      stationId: string
      stationName: string
      stationType: string
      totalCount: number
      vehicleTypeStatistics: Array<{
        vehicleType: string
        vehicleTypeName: string
        count: number
        percentage: number
      }>
    }>
  }
  timestamp: number
}

export default function CheLiangTongJiPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [branchConfig, setBranchConfig] = useState<any>(null)
  const [stationConfig, setStationConfig] = useState<any>(null)

  // 新增查询参数状态与查询/重置处理函数
  const [queryParams, setQueryParams] = useState({
    startDate: new Date().toLocaleDateString('en-CA'),
    endDate: new Date().toLocaleDateString('en-CA'),
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
  const fetchVehicleData = async (
    pOverride?: Partial<typeof queryParams>
  ) => {
    try {
      setLoading(true)
      setError(null)

      const p = { ...queryParams, ...(pOverride || {}) }
      const qs = new URLSearchParams()

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
      if (p.intervalSize) qs.append("intervalSize", String(p.intervalSize))

      const res = await apiFetch(
        `/api/api/vehicle/statistics?${qs.toString()}`,
        { method: "GET" }
      )
      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const json: VehicleStatisticsApiResponse = await res.json()
      if (json?.code !== 200) throw new Error(json?.message || "接口返回错误")

      transformApiData(json.data)
    } catch (e: any) {
      setError(e.message || "数据加载失败")
    } finally {
      setLoading(false)
    }
  }
  // 获取车辆统计数据
  useEffect(() => {
    fetchVehicleData()
  }, [])

  // 转换API数据为表格配置
  const transformApiData = (apiData: VehicleStatisticsApiResponse['data']) => {
    // 1. 整体统计表格（分公司统计）
    const totalStats = apiData.totalStatistics
    
    const branchData = [
      {
        id: "1",
        companyName: "辖区",
        totalVehicles: totalStats.totalCount.toString(),
        cargo1: totalStats.vehicleTypeStatistics.find(v => v.vehicleType === "11")?.count.toString() || "0",
        cargo2: totalStats.vehicleTypeStatistics.find(v => v.vehicleType === "12")?.count.toString() || "0",
        cargo3: totalStats.vehicleTypeStatistics.find(v => v.vehicleType === "13")?.count.toString() || "0",
        cargo4: totalStats.vehicleTypeStatistics.find(v => v.vehicleType === "14")?.count.toString() || "0",
        cargo5: totalStats.vehicleTypeStatistics.find(v => v.vehicleType === "15")?.count.toString() || "0",
        cargo6: totalStats.vehicleTypeStatistics.find(v => v.vehicleType === "16")?.count.toString() || "0",
      },
      {
        id: "2",
        companyName: "车辆占比",
        totalVehicles: "100%",
        cargo1: `${totalStats.vehicleTypeStatistics.find(v => v.vehicleType === "11")?.percentage.toFixed(2) || "0"}%`,
        cargo2: `${totalStats.vehicleTypeStatistics.find(v => v.vehicleType === "12")?.percentage.toFixed(2) || "0"}%`,
        cargo3: `${totalStats.vehicleTypeStatistics.find(v => v.vehicleType === "13")?.percentage.toFixed(2) || "0"}%`,
        cargo4: `${totalStats.vehicleTypeStatistics.find(v => v.vehicleType === "14")?.percentage.toFixed(2) || "0"}%`,
        cargo5: `${totalStats.vehicleTypeStatistics.find(v => v.vehicleType === "15")?.percentage.toFixed(2) || "0"}%`,
        cargo6: `${totalStats.vehicleTypeStatistics.find(v => v.vehicleType === "16")?.percentage.toFixed(2) || "0"}%`,
      }
    ]
    
    const branchConfig = {
      headerBgSrc: "/assets/Headers/header4_1.png", // 自定义标题背景图
      showPagination: false,
      columns: [
        { key: "companyName", label: "公司名称", width: "150px", align: "center" },
        { key: "totalVehicles", label: "绿通车总辆次", width: "200px", align: "center" },
        { key: "cargo1", label: "货一", width: "180px", align: "center" },
        { key: "cargo2", label: "货二", width: "180px", align: "center" },
        { key: "cargo3", label: "货三", width: "180px", align: "center" },
        { key: "cargo4", label: "货四", width: "180px", align: "center" },
        { key: "cargo5", label: "货五", width: "180px", align: "center" },
        { key: "cargo6", label: "货六", width: "180px", align: "center" },
      ],
      data: branchData
    }
    
    // 2. 各站点统计表格
    const stationData = apiData.stationStatistics.map((station, index) => ({
      id: String(index + 1),
      stationName: station.stationName,
      totalVehicles: station.totalCount.toString(),
      cargo1: `${station.vehicleTypeStatistics.find(v => v.vehicleType === "11")?.count || 0} (${station.vehicleTypeStatistics.find(v => v.vehicleType === "11")?.percentage.toFixed(2) || "0.00"}%)`,
      cargo2: `${station.vehicleTypeStatistics.find(v => v.vehicleType === "12")?.count || 0} (${station.vehicleTypeStatistics.find(v => v.vehicleType === "12")?.percentage.toFixed(2) || "0.00"}%)`,
      cargo3: `${station.vehicleTypeStatistics.find(v => v.vehicleType === "13")?.count || 0} (${station.vehicleTypeStatistics.find(v => v.vehicleType === "13")?.percentage.toFixed(2) || "0.00"}%)`,
      cargo4: `${station.vehicleTypeStatistics.find(v => v.vehicleType === "14")?.count || 0} (${station.vehicleTypeStatistics.find(v => v.vehicleType === "14")?.percentage.toFixed(2) || "0.00"}%)`,
      cargo5: `${station.vehicleTypeStatistics.find(v => v.vehicleType === "15")?.count || 0} (${station.vehicleTypeStatistics.find(v => v.vehicleType === "15")?.percentage.toFixed(2) || "0.00"}%)`,
      cargo6: `${station.vehicleTypeStatistics.find(v => v.vehicleType === "16")?.count || 0} (${station.vehicleTypeStatistics.find(v => v.vehicleType === "16")?.percentage.toFixed(2) || "0.00"}%)`,
    }))
    
    const stationConfig = {
      headerBgSrc: "/assets/Headers/header4_2.png", // 自定义标题背景图
      showPagination: false,
      columns: [
        { key: "stationName", label: "收费站名称", width: "150px", align: "center" },
        { key: "totalVehicles", label: "绿通车总辆次", width: "200px", align: "center" },
        { key: "cargo1", label: "货一", width: "180px", align: "center" },
        { key: "cargo2", label: "货二", width: "180px", align: "center" },
        { key: "cargo3", label: "货三", width: "180px", align: "center" },
        { key: "cargo4", label: "货四", width: "180px", align: "center" },
        { key: "cargo5", label: "货五", width: "180px", align: "center" },
        { key: "cargo6", label: "货六", width: "180px", align: "center" },
      ],
      data: stationData
    }
    
    setBranchConfig(branchConfig)
    setStationConfig(stationConfig)
  }

  // 对接 SearchPanel 的查询/重置回调，并挂到右侧容器
  const handleSearch = (params: any) => {
    // 记录查询参数（用于右侧显示和下次刷新）
    setQueryParams(prev => ({ ...prev, ...params, intervalSize: String(params.intervalSize || prev.intervalSize || 1000) }))
    // 立即按查询参数请求
    fetchVehicleData(params)
  }

  const handleReset = () => {
    const defaults = {
      startDate: new Date().toLocaleDateString('en-CA'),
      endDate: new Date().toLocaleDateString('en-CA'),
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
    }
    setQueryParams(defaults)
    fetchVehicleData(defaults)
  }

  return (
    <div className="h-[calc(100vh-100px)] bg-slate-900 p-4 flex flex-col">
      {/* 两列布局，比例 1416:460 */}
      <div className="flex-1 grid grid-cols-[1416fr_460fr] gap-4 min-h-0">
        {/* 左侧列 - 上下两个表格 */}
        <div className="flex flex-col gap-12 min-h-0">
          {/* 上表格：分公司运输车型统计 - 1份 */}
          <div className="h-[20%] min-h-0">
            {loading ? (
              <div className="h-full flex items-center justify-center text-slate-300">
                数据加载中...
              </div>
            ) : error ? (
              <div className="h-full flex items-center justify-center text-red-400">
                加载失败: {error}
              </div>
            ) : branchConfig ? (
              <TechDataTable 
                config={branchConfig}
                className="h-full"
              />
            ) : null}
          </div>
          
          {/* 下表格：收费站运输车型统计 - 4份 */}
          <div className="h-[80%] min-h-0">
            {loading ? (
              <div className="h-full flex items-center justify-center text-slate-300">
                数据加载中...
              </div>
            ) : error ? (
              <div className="h-full flex items-center justify-center text-red-400">
                加载失败: {error}
              </div>
            ) : stationConfig ? (
              <TechDataTable 
                config={stationConfig}
                className="h-full"
              />
            ) : null}
          </div>
        </div>

        {/* 右侧列 */}
        <div className="bg-slate-800/50 border border-blue-500/30 rounded-lg p-0 overflow-hidden">
          <StatisticsCategory />
          <SearchPanel onSearch={handleSearch} onReset={handleReset} />
        </div>
      </div>
    </div>
  )
}
