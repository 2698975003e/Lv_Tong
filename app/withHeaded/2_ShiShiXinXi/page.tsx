"use client"

import { useEffect, useState } from "react"
import { TechDataTable } from "@/components/tech-data-table"
import { StatisticsCategory } from "@/components/right_statistics_category"
import { SearchPanel } from "@/components/search-panel"
import { RealTimeCheckModal } from "@/components/real-time-check-modal"
import { apiFetch } from "@/lib/api"

// API数据类型定义
interface InspectionData {
  id: number
  checkId: string
  exStationName?: string
  checkTime: string
  vehicleId: string
  vehicleType?: string
  vehicleTypeName?: string
  freightName?: string
  freightCategory?: string
  discountAmount: number
  enStationName?: string
  inspectionModifyCount: number
  checkResult: number
  checkResultName: string
}

interface ApiResponse {
  code: number
  message: string
  data: {
    total: number
    pageNum: number
    pageSize: number
    pages: number
    list: InspectionData[]
  }
  timestamp: number
}

export default function ShiShiXinXiPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [apiData, setApiData] = useState<ApiResponse['data'] | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  
  // 弹窗状态
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedInspectionId, setSelectedInspectionId] = useState<number | null>(null)
  
  // 查询参数状态
  const [queryParams, setQueryParams] = useState({
    startDate: "2025-09-02",
    endDate: "2025-09-03",
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

  // 获取列表数据函数
  const fetchInspectionData = async (page: number = currentPage) => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams({
        //关闭测试url
        //test: "scutgreenpass",
        startDate: queryParams.startDate,
        endDate: queryParams.endDate,
        intervalSize: queryParams.intervalSize,
        pageNum: String(page),
        pageSize: "10"
      })
      
      // 添加可选参数
      if (queryParams.minDiscountAmount) {
        params.append("minDiscountAmount", queryParams.minDiscountAmount)
      }
      if (queryParams.maxDiscountAmount) {
        params.append("maxDiscountAmount", queryParams.maxDiscountAmount)
      }
      if (queryParams.enStationName) {
        params.append("enStationName", queryParams.enStationName)
      }
      if (queryParams.exStationName) {
        params.append("exStationName", queryParams.exStationName)
      }
      if (queryParams.freightCategory) {
        params.append("freightCategory", queryParams.freightCategory)
      }
      if (queryParams.vehicleType) {
        params.append("vehicleType", queryParams.vehicleType)
      }
      if (queryParams.vehicleId) {
        params.append("vehicleId", queryParams.vehicleId)
      }
      if (queryParams.passType) {
        params.append("passType", queryParams.passType)
      }
      if (queryParams.passMode) {
        params.append("passMode", queryParams.passMode)
      }
      if (queryParams.isModified) {
        params.append("isModified", queryParams.isModified)
      }
      
      const response = await apiFetch(
        `/api/api/audit/inspection/list?${params.toString()}`,
        {
          method: 'GET',
        }
      )
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result: ApiResponse = await response.json()
      
      if (result.code === 200) {
        setApiData(result.data)
        setCurrentPage(page)
      } else {
        throw new Error(result.message || 'API返回错误')
      }
    } catch (err: any) {
      setError(err.message || '数据加载失败')
    } finally {
      setLoading(false)
    }
  }

  // 初始化数据
  useEffect(() => {
    fetchInspectionData(1) // 第一次加载使用第1页
  }, [])

  // 处理分页变化
  const handlePageChange = (page: number) => {
    fetchInspectionData(page)
  }

  // 处理查询
  const handleSearch = (params: any) => {
    setQueryParams({
      startDate: params.startDate || queryParams.startDate,
      endDate: params.endDate || queryParams.endDate,
      minDiscountAmount: params.minDiscountAmount || "",
      maxDiscountAmount: params.maxDiscountAmount || "",
      enStationName: params.enStationName || "",
      exStationName: params.exStationName || "",
      freightCategory: params.freightCategory || "",
      vehicleType: params.vehicleType || "",
      vehicleId: params.vehicleId || "",
      passType: params.passType || "",
      passMode: params.passMode || "",
      isModified: params.isModified || "",
      intervalSize: params.intervalSize || "1000"
    })
    
    // 重置到第一页并查询
    setCurrentPage(1)
    setTimeout(() => {
      fetchInspectionData(1)
    }, 100)
  }

  // 处理重置
  const handleReset = () => {
    const defaultParams = {
      startDate: "2025-09-02",
      endDate: "2025-09-03",
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
    setQueryParams(defaultParams)
    setCurrentPage(1)
    fetchInspectionData(1)
  }

  // 处理详情点击
  const handleDetailsClick = (row: any, rowIndex: number) => {
    // 使用后端返回的 id 字段（originalId）
    if (row.originalId) {
      setSelectedInspectionId(row.originalId)
      setIsModalOpen(true)
    }
  }

  // 关闭弹窗
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedInspectionId(null)
  }

  // 转换API数据为表格组件需要的格式
  const transformData = (apiData: ApiResponse['data']) => {
    return apiData.list.map((item, index) => ({
      id: String((apiData.pageNum - 1) * apiData.pageSize + index + 1).padStart(2, "0"),
      exStationName: item.exStationName || "出口收费站",
      checkTime: item.checkTime ? item.checkTime.replace(/-/g, ".").replace(" ", " ") : "",
      vehicleId: item.vehicleId,
      vehicleTypeName: item.vehicleTypeName || "普通货车",
      freightName: item.freightName || "未知货物",
      discountAmount: item.discountAmount > 0 ? `${item.discountAmount.toFixed(2)}元` : "0元",
      enStationName: item.enStationName || "入口收费站",
      checkResult: item.checkResultName === "合格" ? "✓" : item.checkResultName,
      inspectionModifyCount: item.inspectionModifyCount.toString(),
      details: "查看",
      originalId: item.id
    }))
  }

  // 表格配置 - 添加 pagination 配置
  const tableConfig = {
    headerBgSrc: "/assets/Headers/header3_1.png", // 自定义标题背景图（可选，不设置则使用默认的 TitleHeader.png）
    columns: [
      { key: "id", label: "序号", width: "100px", align: "center" as const },
      { key: "exStationName", label: "出口收费站", width: "150px", align: "center" as const },
      { key: "checkTime", label: "查验时间", width: "180px", align: "center" as const },
      { key: "vehicleId", label: "车牌号", width: "200px", align: "center" as const },
      { key: "vehicleTypeName", label: "车型", width: "120px", align: "center" as const },
      { key: "freightName", label: "货物名称", width: "180px", align: "center" as const },
      { key: "discountAmount", label: "减免金额", width: "160px", align: "center" as const },
      { key: "enStationName", label: "入口收费站", width: "150px", align: "center" as const },
      { key: "checkResult", label: "稽查", width: "80px", align: "center" as const },
      { key: "inspectionModifyCount", label: "查验修改", width: "100px", align: "center" as const },
      { 
        key: "details", 
        label: "详情", 
        width: "80px", 
        align: "center" as const,
        onClick: handleDetailsClick
      },
    ],
    data: apiData ? transformData(apiData) : [],
    showPagination: true,
    pagination: apiData ? {
      currentPage: apiData.pageNum,
      totalPages: apiData.pages,
      pageSize: apiData.pageSize,
      total: apiData.total,
      onPageChange: handlePageChange
    } : undefined
  }

  return (
    <div className="h-[calc(100vh-100px)] bg-slate-900 p-4 flex flex-col">
      {/* 两列布局，比例 1416:460 */}
      <div className="flex-1 grid grid-cols-[1416fr_460fr] gap-4 min-h-0">
        {/* 左侧列 - 实时查验数据表格 */}
        {loading ? (
          <div className="flex items-center justify-center text-slate-300">
            数据加载中...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center text-red-400">
            加载失败: {error}
          </div>
        ) : (
          <TechDataTable config={tableConfig} />
        )}

        {/* 右侧列 */}
        <div className="bg-slate-800/50 border border-blue-500/30 rounded-lg p-0">
          <StatisticsCategory />
          <SearchPanel onSearch={handleSearch} onReset={handleReset} />
        </div>
      </div>

      {/* 详情弹窗 */}
      {selectedInspectionId && (
        <RealTimeCheckModal
          inspectionId={selectedInspectionId}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}