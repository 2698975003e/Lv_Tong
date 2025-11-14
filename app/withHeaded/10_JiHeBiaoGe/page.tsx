"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { VehicleTypeSelect } from "@/components/vehicle-type-select"
import { InspectionDataTable, TableRowData } from "@/components/inspection-data-table"
import { SearchPanel2 } from "@/components/inspection-table-panel"
import { useState, useEffect } from "react"
import { apiFetch } from "@/lib/api"

// API接口类型定义
interface AuditInspectionApiResponse {
  code: number
  message: string
  data: {
    total: number
    pageNum: number
    pageSize: number
    pages: number
    list: Array<{
      id: number
      checkId: string
      checkTime?: string
      vehicleId: string
      discountAmount: number
      inspectionModifyCount: number
      checkResult: number
      checkResultName: string
      exStationName?: string
      vehicleType?: string
      vehicleTypeName?: string
      freightName?: string
      freightCategory?: string
      enStationName?: string
    }>
  }
  timestamp: number
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
    originalId?: number // 添加 originalId 字段
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

// 转换API数据为表格格式
function transformApiData(apiData: AuditInspectionApiResponse['data']): TableRowData[] {
  return apiData.list.map((item, index) => ({
    id: String((apiData.pageNum - 1) * apiData.pageSize + index + 1).padStart(2, "0"),
    exStationName: item.exStationName || "出口收费站",
    checkTime: item.checkTime ? item.checkTime.replace(/-/g, ".").replace(" ", " ") : "25.06.18 00:00:05",
    vehicleId: item.vehicleId,
    vehicleType: item.vehicleTypeName || "普通货车",
    freightName: item.freightName || "未知货物",
    discountAmount: item.discountAmount > 0 ? `${item.discountAmount.toFixed(2)}元` : "0元",
    enStationName: item.enStationName || "入口收费站",
    inspectionModifyCount: item.inspectionModifyCount.toString(),
    auditStatus: item.checkResult === 1, // 1表示合格
    originalId: item.id // 保存后端返回的真实ID
  }))
}

export default function JiHeBiaoGePage() {
    const [vehicleType, setVehicleType] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    
    // API数据状态
    const [apiData, setApiData] = useState<AuditInspectionApiResponse['data'] | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    
    // 查询参数状态
    const [queryParams, setQueryParams] = useState({
        startDate: "2025-09-02",
        endDate: "2025-09-03",
        discountAmountOperator: "",
        discountAmountValue: "",
        stationName: "",
        pageNum: 1,
        pageSize: 10
    })

    // 查验详情数据状态
    const [inspectionDetail, setInspectionDetail] = useState<InspectionDetailApiResponse['data'] | null>(null)
    const [detailLoading, setDetailLoading] = useState(false)
    const [detailError, setDetailError] = useState<string | null>(null)

    // 获取列表数据函数
    const fetchInspectionData = async (page?: number) => {
        try {
            setLoading(true)
            setError(null)
            
            const params = new URLSearchParams({
                startDate: queryParams.startDate,
                endDate: queryParams.endDate,
                pageNum: String(page || queryParams.pageNum),
                pageSize: String(queryParams.pageSize)
            })
            
            // 添加可选参数
            if (queryParams.discountAmountOperator) {
                params.append("discountAmountOperator", queryParams.discountAmountOperator)
            }
            if (queryParams.discountAmountValue) {
                params.append("discountAmountValue", queryParams.discountAmountValue)
            }
            if (queryParams.stationName) {
                params.append("stationName", queryParams.stationName)
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
            
            const result: AuditInspectionApiResponse = await response.json()
            
            if (result.code === 200) {
                setApiData(result.data)
                if (page) {
                    setCurrentPage(page)
                    setQueryParams(prev => ({ ...prev, pageNum: page }))
                }
            } else {
                throw new Error(result.message || 'API返回错误')
            }
        } catch (err: any) {
            setError(err.message || '数据加载失败')
        } finally {
            setLoading(false)
        }
    }

    // 获取详情数据函数
    const fetchInspectionDetail = async (inspectionId: number) => {
        try {
            setDetailLoading(true)
            setDetailError(null)
            
            const response = await apiFetch(
                `/api/api/inspection/detail/${inspectionId}`,
                {
                    method: 'GET',
                }
            )
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            
            const result: InspectionDetailApiResponse = await response.json()
            
            if (result.code === 200) {
                setInspectionDetail({
                    ...result.data,
                    originalId: result.data.inspectionId
                } as InspectionDetailApiResponse['data'] & { originalId: number })
            } else {
                throw new Error(result.message || '详情API返回错误')
            }
        } catch (err: any) {
            setDetailError(err.message || '详情数据加载失败')
        } finally {
            setDetailLoading(false)
        }
    }

    // 初始化数据
    useEffect(() => {
        fetchInspectionData()
        
    }, [])

    // 处理表格行点击事件
    const handleTableRowClick = (rowData: TableRowData) => {
        console.log("点击的行原始ID:", rowData.originalId)
        console.log("点击的行完整数据:", rowData)
        
        // 如果有originalId，获取详情数据
        if (rowData.originalId) {
            fetchInspectionDetail(rowData.originalId)
        }
    }

    // 处理分页变化
    const handlePageChange = (page: number) => {
        fetchInspectionData(page)
    }

    // 处理查询参数变化
    const handleQueryChange = (field: string, value: string) => {
        setQueryParams(prev => ({ ...prev, [field]: value }))
        // 重置到第一页
        setCurrentPage(1)
    }

    // 处理查询
    const handleSearch = () => {
        fetchInspectionData(1)
    }

    // 处理重置
    const handleReset = () => {
        setQueryParams({
            startDate: "2025-09-02",
            endDate: "2025-09-03",
            discountAmountOperator: "",
            discountAmountValue: "",
            stationName: "",
            pageNum: 1,
            pageSize: 10
        })
        setCurrentPage(1)
        fetchInspectionData(1)
    }

    return (
        <div className="h-[calc(100vh-100px)] bg-slate-900 p-4 flex flex-col">
            {/* 主标题 */}
            <div className="mb-4">
                <h1 className="text-2xl font-bold text-white">收费站翻查核:灵珠山东</h1>
            </div>

            {/* 主要内容区域 - 三列布局 */}
            <div className="flex-1 grid grid-cols-[3.5fr_1fr_1.2fr] gap-4 min-h-0">

                {/* 第一列 - 表格和图片容器 */}
                <div className="flex flex-col gap-4 min-h-0">

                    {/* 上方：表格容器 */}
                    <div className="h-[80%] bg-slate-800/50 border border-blue-500/30 rounded-lg p-4 min-h-0">
                        {loading ? (
                            <div className="h-full flex items-center justify-center text-slate-300">
                                数据加载中...
                            </div>
                        ) : error ? (
                            <div className="h-full flex items-center justify-center text-red-400">
                                加载失败: {error}
                            </div>
                        ) : apiData ? (
                            <InspectionDataTable 
                                data={transformApiData(apiData)}
                                onRowClick={handleTableRowClick}
                                showPagination={true}
                                pagination={{
                                    currentPage: apiData.pageNum,
                                    totalPages: apiData.pages,
                                    pageSize: apiData.pageSize,
                                    total: apiData.total
                                }}
                                onPageChange={handlePageChange}
                            />
                        ) : null}
                    </div>

                    {/* 下方：两列图片容器 */}
                    <div className="h-[20%] grid grid-cols-2 gap-4 min-h-0">
                        {/* 左侧：车身侧面图像 */}
                        <div className="bg-slate-800/50 border border-blue-500/30 rounded-lg p-4 min-h-0">
                            <div className="h-full flex items-center justify-center">
                                <span className="text-slate-300">车身侧面图像</span>
                            </div>
                        </div>

                        {/* 右侧：X射线图像 */}
                        <div className="bg-slate-800/50 border border-blue-500/30 rounded-lg p-4 min-h-0">
                            <div className="h-full flex items-center justify-center">
                                <span className="text-slate-300">X射线图像</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 第二列 - 6个竖向排列的图片容器 */}
                <div className="flex flex-col gap-2 min-h-0">
                    {Array.from({ length: 6 }, (_, i) => (
                        <div key={i} className="flex-1 bg-slate-800/50 border border-blue-500/30 rounded-lg p-4 min-h-0">
                            <div className="h-full flex items-center justify-center">
                                <span className="text-slate-300">图片容器 {i + 1}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 第三列 - 稽查信息容器 */}
                <div className="bg-slate-800/50 border border-blue-500/30 rounded-lg p-4 min-h-0">
                    <SearchPanel2 
                        detailData={inspectionDetail}
                        detailLoading={detailLoading}
                        detailError={detailError}
                        queryParams={queryParams}
                        onQueryChange={handleQueryChange}
                        onSearch={handleSearch}
                        onReset={handleReset}
                    />
                </div>
            </div>
        </div>
    )
}
