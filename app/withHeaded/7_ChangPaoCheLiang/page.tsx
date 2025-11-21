"use client"

import { useEffect, useState } from "react"
import { TechDataTable } from "@/components/tech-data-table"
import { StatisticsCategory } from "@/components/right_statistics_category"
import { SearchPanel } from "@/components/search-panel"
import { apiFetch } from "@/lib/api"

interface VehicleInfoApiResponse {
  code: number
  message: string
  data: {
    queryConditions: {
      size: number
      endDate: string
      sortOrder: string
      sortBy: string
      page: number
      startDate: string
    }
    pagination: {
      currentPage: number
      pageSize: number
      totalElements: number
      totalPages: number
      hasNext: boolean
      hasPrevious: boolean
    }
    vehicles: Array<{
      vehicleId: string
      vehicleType: string
      passCount: number
      totalDiscountAmount: number
      firstPassTime: string
      lastPassTime: string
      majorRoutes: Array<{
        routeDescription: string
        enStationName: string
        exStationName: string
        passCount: number
        discountAmount: number
      }>
      majorFreightCategories: Array<{
        freightCategory: string
        freightTypesText: string
        passCount: number
        discountAmount: number
      }>
    }>
  }
  timestamp: number
}

export default function ChangPaoCheLiangPage() {
  // 列表状态
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tableData, setTableData] = useState<any[]>([])
  const [pageInfo, setPageInfo] = useState({ currentPage: 1, totalPages: 1, pageSize: 10, total: 0 })
  const [vehiclesData, setVehiclesData] = useState<VehicleInfoApiResponse['data']['vehicles']>([]) // 保存完整数据
  const [selectedRouteDetails, setSelectedRouteDetails] = useState<Array<{
    routeDescription: string
    enStationName: string
    exStationName: string
    passCount: number
    discountAmount: number
  }> | null>(null) // 路线弹窗数据
  const [showRouteModal, setShowRouteModal] = useState(false) // 路线弹窗显示状态
  
  const [selectedCargoDetails, setSelectedCargoDetails] = useState<Array<{
    freightCategory: string
    freightTypesText: string
    passCount: number
    discountAmount: number
  }> | null>(null) // 货物弹窗数据
  const [showCargoModal, setShowCargoModal] = useState(false) // 货物弹窗显示状态

  // 查询参数（右侧面板）
  const [queryParams, setQueryParams] = useState({
    startDate: "2024-10-01",
    endDate: "2025-11-01",
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

  // 拉取数据
  const fetchList = async (page = 1, size = 10) => {
    try {
      setLoading(true)
      setError(null)

      const qs = new URLSearchParams({
        startDate: queryParams.startDate,
        endDate: queryParams.endDate,
        page: String(page),
        size: String(size), // 用10
      })
      // 按需追加其他查询项（若后端支持）
      if (queryParams.vehicleId) qs.append("vehicleId", queryParams.vehicleId)
      if (queryParams.vehicleType) qs.append("vehicleType", queryParams.vehicleType)
      if (queryParams.enStationName) qs.append("enStationName", queryParams.enStationName)
      if (queryParams.exStationName) qs.append("exStationName", queryParams.exStationName)
      if (queryParams.freightCategory) qs.append("freightCategory", queryParams.freightCategory)

      const res = await apiFetch(`/api/api/vehicle/info?${qs.toString()}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json: VehicleInfoApiResponse = await res.json()
      if (json.code !== 200) throw new Error(json.message || "接口返回错误")

      const { vehicles, pagination } = json.data
      setVehiclesData(vehicles || []) // 保存完整数据

      // 转为表格行
      const rows = (vehicles || []).map((v, idx) => {
        const firstRoute = v.majorRoutes?.[0]
        const firstCat = v.majorFreightCategories?.[0]
        return {
          id: String((pagination.currentPage - 1) * pagination.pageSize + idx + 1).padStart(2, "0"),
          licensePlate: v.vehicleId,                                 // 车牌
          vehicleType: v.vehicleType || "",                          // 车种/车型
          trafficCount: v.passCount,                                  // 通行数
          totalDiscount: (v.totalDiscountAmount || 0).toFixed(2) + "元", // 总减免金额
          mainRoute: firstRoute
            ? `${firstRoute.enStationName}-${firstRoute.exStationName}(${firstRoute.passCount})`
            : "-",
          mainRouteDetail: "查看",                                     // 路线详情
          mainRouteDetailIndex: idx, // 保存索引用于查找原始数据
          mainCategory: firstCat
            ? `${firstCat.freightTypesText?.split("、")[0] || firstCat.freightTypesText || "类别"}(${firstCat.passCount})`
            : "-",
          cargoDetail: "查看",                                         // 货物详情
        }
      })

      setTableData(rows)
      setPageInfo({
        currentPage: pagination.currentPage,
        totalPages: pagination.totalPages,
        pageSize: size,                 // 使用本次请求的 size=10
        total: pagination.totalElements,
      })
    } catch (e: any) {
      setError(e.message || "数据加载失败")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchList(1, 10)
  }, [])

  // 处理路线详情点击
  const handleRouteDetailClick = (rowIndex: number) => {
    const vehicle = vehiclesData[rowIndex]
    if (vehicle && vehicle.majorRoutes) {
      setSelectedRouteDetails(vehicle.majorRoutes)
      setShowRouteModal(true)
    }
  }

  // 处理货物详情点击
  const handleCargoDetailClick = (rowIndex: number) => {
    const vehicle = vehiclesData[rowIndex]
    if (vehicle && vehicle.majorFreightCategories) {
      setSelectedCargoDetails(vehicle.majorFreightCategories)
      setShowCargoModal(true)
    }
  }

  // 表格配置
  const tableConfig = {
    headerBgSrc: "/assets/Headers/header7.png",
    showPagination: true,
    columns: [
      { key: "id", label: "序号", width: "120px", align: "center" as const },
      { key: "licensePlate", label: "车牌", width: "160px", align: "center" as const },
      { key: "vehicleType", label: "车种", width: "120px", align: "center" as const },
      { key: "trafficCount", label: "通行数", width: "120px", align: "center" as const },
      { key: "totalDiscount", label: "总减免金额", width: "120px", align: "center" as const },
      { key: "mainRoute", label: "主要入口-出口站(次数)", width: "300px", align: "center" as const },
      { 
        key: "mainRouteDetail", 
        label: "路线详情", 
        width: "100px", 
        align: "center" as const,
        onClick: (row: any, rowIndex: number) => handleRouteDetailClick(rowIndex) // 添加点击回调
      },
      { key: "mainCategory", label: "主要类别(次数)", width: "180px", align: "center" as const },
      { 
        key: "cargoDetail", 
        label: "货物详情", 
        width: "120px", 
        align: "center" as const,
        onClick: (row: any, rowIndex: number) => handleCargoDetailClick(rowIndex) // 添加货物详情点击回调
      },
    ],
    data: tableData,
    pagination: {
      currentPage: pageInfo.currentPage,
      totalPages: pageInfo.totalPages,
      pageSize: pageInfo.pageSize,
      total: pageInfo.total,
      onPageChange: (p: number) => fetchList(p, pageInfo.pageSize),
    },
  }

  // 右侧查询回调
  const handleSearch = (params: any) => {
    setQueryParams((prev) => ({ ...prev, ...params }))
    // 重置到第1页
    fetchList(1, 10)
  }
  const handleReset = () => {
    const defaults = {
      startDate: "2024-10-01",
      endDate: "2025-11-01",
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
    fetchList(1, 10)
  }

  return (
    <div className="h-[calc(100vh-100px)] bg-slate-900 p-4 flex flex-col">
      {/* 两列布局，比例 1416:460 */}
      <div className="flex-1 grid grid-cols-[1416fr_460fr] gap-4 min-h-0">
        {/* 左侧表格 */}
        <div className="flex flex-col min-h-0 bg-slate-800/50 border border-blue-500/30 rounded-lg p-4">
          {loading ? (
            <div className="flex-1 flex items-center justify-center text-slate-300">数据加载中...</div>
          ) : error ? (
            <div className="flex-1 flex items-center justify-center text-red-400">加载失败：{error}</div>
          ) : (
            <TechDataTable config={tableConfig} className="h-full" />
          )}
        </div>

        {/* 右侧 */}
        <div className="bg-slate-800/50 border border-blue-500/30 rounded-lg p-0 overflow-hidden">
          <StatisticsCategory />
          <SearchPanel onSearch={handleSearch} onReset={handleReset} />
        </div>
      </div>

      {/* 路线详情弹窗 */}
      {showRouteModal && selectedRouteDetails && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowRouteModal(false)}
        >
          <div 
            className="bg-slate-800 rounded-lg border border-slate-600 p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-slate-200">路线详情</h2>
              <button
                onClick={() => setShowRouteModal(false)}
                className="text-slate-400 hover:text-slate-200 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-3">
              {selectedRouteDetails.map((route, idx) => (
                <div 
                  key={idx}
                  className="bg-slate-700/50 rounded-lg p-4 border border-slate-600"
                >
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">入口站：</span>
                      <span className="text-slate-200 ml-2">{route.enStationName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">出口站：</span>
                      <span className="text-slate-200 ml-2">{route.exStationName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">通行次数：</span>
                      <span className="text-slate-200 ml-2">{route.passCount}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">减免金额：</span>
                      <span className="text-slate-200 ml-2">{route.discountAmount.toFixed(2)}元</span>
                    </div>
                  </div>
                  {route.routeDescription && (
                    <div className="mt-2 text-xs text-slate-400">
                      {route.routeDescription}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 货物详情弹窗 */}
      {showCargoModal && selectedCargoDetails && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowCargoModal(false)}
        >
          <div 
            className="bg-slate-800 rounded-lg border border-slate-600 p-6 max-w-3xl w-full mx-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-slate-200">货物详情</h2>
              <button
                onClick={() => setShowCargoModal(false)}
                className="text-slate-400 hover:text-slate-200 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-3">
              {selectedCargoDetails.map((cargo, idx) => (
                <div 
                  key={idx}
                  className="bg-slate-700/50 rounded-lg p-4 border border-slate-600"
                >
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div className="flex items-start">
                      <span className="text-slate-400 min-w-[80px]">货物类别：</span>
                      <span className="text-slate-200 ml-2 font-medium">{cargo.freightCategory}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-slate-400 min-w-[80px]">货物类型：</span>
                      <span className="text-slate-200 ml-2 flex-1">{cargo.freightTypesText}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <span className="text-slate-400">通行次数：</span>
                        <span className="text-slate-200 ml-2 font-medium">{cargo.passCount}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">减免金额：</span>
                        <span className="text-slate-200 ml-2 font-medium">{cargo.discountAmount.toFixed(2)}元</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
