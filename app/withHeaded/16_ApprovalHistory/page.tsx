"use client"

import { useEffect, useMemo, useState, useCallback, Suspense } from "react"
import { TechDataTable } from "@/components/tech-data-table"
import { apiFetch } from "@/lib/api"
import { useSearchParams } from "next/navigation"

// API 响应类型定义
interface ApprovalHistoryApiResponse {
  code: number
  message: string
  data: {
    inspectionId: number
    checkId: string
    totalModifyCount: number
    modifyCountByType: {
      basicInfo: number
      transitInfo: number
      checkResult: number
      deleteRecord: number
      total: number
    }
    history: Array<{
      approvalNo: string
      modifyType: string
      modifyTypeDesc: string
      changeReason: string
      applicantName: string
      applicationTime: string
      status: number
      statusDesc: string
      needApproval: number
      needApprovalDesc: string
      firstApproverName?: string | null
      firstApprovalTime?: string | null
      firstApprovalResultDesc?: string | null
      secondApproverName?: string | null
      secondApprovalTime?: string | null
      secondApprovalResultDesc?: string | null
    }>
  }
  timestamp?: number
}

// 格式化时间字符串
function formatDateTime(dateTimeStr: string): string {
  if (!dateTimeStr) return ""
  try {
    const date = new Date(dateTimeStr)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  } catch {
    return dateTimeStr
  }
}

// 获取状态标签样式
function getStatusBadge(status: number) {
  const statusMap: Record<number, { bg: string; text: string; label: string }> = {
    1: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: '待审批' },
    2: { bg: 'bg-green-500/20', text: 'text-green-400', label: '已通过' },
    3: { bg: 'bg-red-500/20', text: 'text-red-400', label: '已拒绝' },
  }
  const statusInfo = statusMap[status] || statusMap[1]
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${statusInfo.bg} ${statusInfo.text} border ${statusInfo.text.replace('text-', 'border-')}/50`}>
      {statusInfo.label}
    </span>
  )
}

// 获取修改类型标签样式
function getModifyTypeBadge(modifyType: string) {
  const typeMap: Record<string, { bg: string; text: string }> = {
    'BASIC_INFO': { bg: 'bg-blue-500/20', text: 'text-blue-400' },
    'TRANSIT_INFO': { bg: 'bg-green-500/20', text: 'text-green-400' },
    'CHECK_RESULT': { bg: 'bg-orange-500/20', text: 'text-orange-400' },
    'DELETE_RECORD': { bg: 'bg-red-500/20', text: 'text-red-400' },
  }
  const typeInfo = typeMap[modifyType] || { bg: 'bg-gray-500/20', text: 'text-gray-400' }
  return typeInfo
}

function ApprovalHistoryContent() {
  const searchParams = useSearchParams()
  const inspectionId = searchParams.get('inspectionId') || searchParams.get('checkId')
  
  // 数据状态
  const [historyData, setHistoryData] = useState<ApprovalHistoryApiResponse['data'] | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  
  // 选中的历史记录详情
  const [selectedHistory, setSelectedHistory] = useState<ApprovalHistoryApiResponse['data']['history'][0] | null>(null)

  // 获取审批历史数据
  const fetchApprovalHistory = useCallback(async (id: string) => {
    try {
      setLoading(true)
      setError(null)

      // 调用 API: GET /api/approval/history/{inspectionId}
      const apiUrl = `/api/api/approval/history/${id}`
      const response = await apiFetch(apiUrl, {
        method: 'GET',
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ApprovalHistoryApiResponse = await response.json()

      if (result.code !== 200) {
        throw new Error(result.message || '查询失败')
      }

      // 直接使用 API 返回的数据
      setHistoryData(result.data)
    } catch (err: any) {
      setError(err.message || '数据加载失败')
      console.error('获取审批历史失败:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // 处理表格行点击
  const handleRowClick = useCallback((record: ApprovalHistoryApiResponse['data']['history'][0]) => {
    setSelectedHistory(record)
  }, [])

  // 初始加载 - 如果没有传入 inspectionId，使用默认值 100001
  useEffect(() => {
    const inspectionIdToUse = inspectionId || '100001'
    fetchApprovalHistory(inspectionIdToUse)
  }, [inspectionId, fetchApprovalHistory])

  // 将历史数据转换为表格数据
  const tableRows = useMemo(() => {
    if (!historyData || !historyData.history || !Array.isArray(historyData.history)) return []
    return historyData.history.map((record, index) => ({
      id: String(index + 1).padStart(2, '0'),
      approvalNo: record.approvalNo || '',
      modifyTypeDesc: record.modifyTypeDesc || '',
      modifyType: record.modifyType || '',
      changeReason: record.changeReason || '',
      applicantName: record.applicantName || '',
      applicationTime: formatDateTime(record.applicationTime || ''),
      status: record.status || 1,
      statusDesc: record.statusDesc || '',
      firstApproverName: record.firstApproverName || '-',
      firstApprovalTime: record.firstApprovalTime ? formatDateTime(record.firstApprovalTime) : '-',
    }))
  }, [historyData])

  // 表格配置
  const tableConfig = useMemo(() => {
    return {
      columns: [
        { key: "id", label: "序号", width: "80px", align: "center" as const },
        { key: "approvalNo", label: "审批编号", width: "200px", align: "center" as const },
        { key: "modifyTypeDesc", label: "修改类型", width: "150px", align: "center" as const },
        { key: "changeReason", label: "修改原因", width: "200px", align: "center" as const },
        { key: "applicantName", label: "申请人", width: "120px", align: "center" as const },
        { key: "applicationTime", label: "申请时间", width: "180px", align: "center" as const },
        { key: "status", label: "状态", width: "100px", align: "center" as const },
        { key: "firstApproverName", label: "审批人", width: "120px", align: "center" as const },
        { key: "firstApprovalTime", label: "审批时间", width: "180px", align: "center" as const },
        { 
          key: "viewDetails", 
          label: "操作", 
          width: "120px", 
          align: "center" as const,
          onClick: (row: any) => {
            const originalRecord = historyData?.history.find(r => r.approvalNo === row.approvalNo)
            if (originalRecord) {
              handleRowClick(originalRecord)
            }
          },
        },
      ],
      data: tableRows.map(row => {
        const typeInfo = getModifyTypeBadge(row.modifyType || '')
        return {
          ...row,
          statusDisplay: getStatusBadge(row.status),
          // 将 modifyTypeDesc 设置为 React 元素，组件应该能够渲染它
          modifyTypeDesc: (
            <span className={`px-2 py-1 rounded text-xs font-medium ${typeInfo.bg} ${typeInfo.text} border ${typeInfo.text.replace('text-', 'border-')}/50 inline-block`}>
              {row.modifyTypeDesc || ''}
            </span>
          ) as any, // 使用 as any 来绕过类型检查，让组件能够渲染 React 元素
          viewDetails: "查看详情",
        }
      }),
      showPagination: false,
    }
  }, [tableRows, historyData])

  return (
    <div className="h-[calc(100vh-100px)] bg-slate-900 p-4 flex flex-col">
      {/* 顶部标题图片 - 与下方列表宽度一致 */}
      <div className="mb-4">
        <div
          className="w-full h-[33px]"
          style={{
            backgroundImage: "url(/assets/Check_Header1.png)",
            backgroundSize: "100% 100%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
      </div>
      
      {/* 内容区域 */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* 两列布局，比例 1416:460 */}
        <div className="flex-1 grid grid-cols-[1416fr_460fr] gap-4 min-h-0">
        {/* 左侧列 - 统计面板 + 历史列表 */}
        <div className="flex flex-col gap-4 min-h-0">
          {/* 统计面板 */}
          <div className="bg-slate-800/50 border border-blue-500/30 rounded-lg p-4 flex-shrink-0">
            {loading ? (
              <div className="text-slate-300 text-sm">数据加载中...</div>
            ) : error && !historyData ? (
              <div className="text-red-400 text-sm">加载失败: {error}</div>
            ) : historyData ? (
              <div className="space-y-4">
                {/* 主统计信息 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/30 rounded-lg p-4">
                    <div className="text-sm text-slate-400 mb-1">查验记录ID</div>
                    <div className="text-2xl font-bold text-white">{historyData.inspectionId || '-'}</div>
                  </div>
                  <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/30 rounded-lg p-4">
                    <div className="text-sm text-slate-400 mb-1">总修改次数</div>
                    <div className="text-2xl font-bold text-cyan-400">{historyData.totalModifyCount || 0}</div>
                  </div>
                </div>

                {/* 修改类型分布 */}
                {historyData.modifyCountByType && (
                  <div className="bg-slate-800/50 border border-blue-500/30 rounded-lg p-4">
                    <div className="text-sm font-semibold text-white mb-3">修改类型分布</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <span className="text-sm text-slate-200">基础信息</span>
                        </div>
                        <span className="px-2 py-1 rounded text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/50">
                          {historyData.modifyCountByType.basicInfo || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <span className="text-sm text-slate-200">通行信息</span>
                        </div>
                        <span className="px-2 py-1 rounded text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/50">
                          {historyData.modifyCountByType.transitInfo || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                          <span className="text-sm text-slate-200">检查结果</span>
                        </div>
                        <span className="px-2 py-1 rounded text-xs font-medium bg-orange-500/20 text-orange-400 border border-orange-500/50">
                          {historyData.modifyCountByType.checkResult || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <span className="text-sm text-slate-200">记录删除</span>
                        </div>
                        <span className="px-2 py-1 rounded text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/50">
                          {historyData.modifyCountByType.deleteRecord || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* 历史列表表格 */}
          <div className="flex-1 min-h-0">
            {loading ? (
              <div className="h-full flex items-center justify-center text-slate-300">数据加载中...</div>
            ) : error && !historyData ? (
              <div className="h-full flex items-center justify-center text-red-400">加载失败: {error}</div>
            ) : tableRows.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-300">暂无数据</div>
            ) : (
              <div className="h-full [&>div>div:nth-child(2)>div]:!pl-0">
                <TechDataTable 
                  config={tableConfig} 
                  className="h-full" 
                />
              </div>
            )}
          </div>
        </div>

        {/* 右侧列 - 详情面板 */}
        <div className="bg-slate-800/50 border border-blue-500/30 rounded-lg p-4 flex flex-col gap-4 min-h-0 overflow-hidden">
          <div className="flex-1 min-h-0 overflow-auto">
            <div className="text-lg font-semibold text-white mb-2">审批详情</div>
            
            {!selectedHistory ? (
              <div className="text-slate-400 text-sm py-4">请点击表格行查看详情</div>
            ) : (
              <div className="space-y-3 text-sm">
                {/* 基本信息 */}
                <div className="space-y-2">
                  <div className="text-cyan-400 font-semibold border-b border-cyan-500/30 pb-1">基本信息</div>
                  <div className="grid grid-cols-2 gap-2 text-slate-200">
                    <div><span className="text-slate-400">审批编号：</span>{selectedHistory.approvalNo}</div>
                    <div><span className="text-slate-400">修改类型：</span>{selectedHistory.modifyTypeDesc}</div>
                    <div><span className="text-slate-400">状态：</span>{selectedHistory.statusDesc}</div>
                    <div><span className="text-slate-400">是否需要审批：</span>{selectedHistory.needApprovalDesc}</div>
                  </div>
                </div>

                {/* 申请信息 */}
                <div className="space-y-2">
                  <div className="text-cyan-400 font-semibold border-b border-cyan-500/30 pb-1">申请信息</div>
                  <div className="grid grid-cols-2 gap-2 text-slate-200">
                    <div><span className="text-slate-400">申请人：</span>{selectedHistory.applicantName}</div>
                    <div><span className="text-slate-400">申请时间：</span>{formatDateTime(selectedHistory.applicationTime)}</div>
                    <div className="col-span-2"><span className="text-slate-400">变更原因：</span>{selectedHistory.changeReason || "暂无"}</div>
                  </div>
                </div>

                {/* 一级审批信息 */}
                <div className="space-y-2">
                  <div className="text-cyan-400 font-semibold border-b border-cyan-500/30 pb-1">一级审批</div>
                  <div className="grid grid-cols-2 gap-2 text-slate-200">
                    <div><span className="text-slate-400">审批人：</span>{selectedHistory.firstApproverName || "暂无"}</div>
                    <div><span className="text-slate-400">审批时间：</span>{selectedHistory.firstApprovalTime ? formatDateTime(selectedHistory.firstApprovalTime) : "暂无"}</div>
                    <div><span className="text-slate-400">审批结果：</span>{selectedHistory.firstApprovalResultDesc || "暂无"}</div>
                  </div>
                </div>

                {/* 二级审批信息 */}
                <div className="space-y-2">
                  <div className="text-cyan-400 font-semibold border-b border-cyan-500/30 pb-1">二级审批</div>
                  <div className="grid grid-cols-2 gap-2 text-slate-200">
                    <div><span className="text-slate-400">审批人：</span>{selectedHistory.secondApproverName || "暂无"}</div>
                    <div><span className="text-slate-400">审批时间：</span>{selectedHistory.secondApprovalTime ? formatDateTime(selectedHistory.secondApprovalTime) : "暂无"}</div>
                    <div><span className="text-slate-400">审批结果：</span>{selectedHistory.secondApprovalResultDesc || "暂无"}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

export default function ApprovalHistoryPage() {
  return (
    <Suspense fallback={<div className="text-slate-300 p-4">页面加载中...</div>}>
      <ApprovalHistoryContent />
    </Suspense>
  )
}

