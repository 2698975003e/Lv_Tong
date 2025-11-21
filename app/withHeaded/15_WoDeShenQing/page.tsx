"use client"

import { useEffect, useMemo, useState } from "react"
import { TechDataTable } from "@/components/tech-data-table"
import { MyApplicationsFilter, MyApplicationsFilterParams } from "@/components/my-applications-filter"
import { apiFetch } from "@/lib/api"

// API 响应类型定义
interface MyApplicationsApiResponse {
  code: number
  message: string
  data: {
    total: number
    pageNum: number
    pageSize: number
    pages: number
    hasPreviousPage?: boolean
    hasNextPage?: boolean
    list: Array<{
      approvalNo: string
      modifyType: string
      modifyTypeDesc: string
      changeReason: string
      applicantName: string
      applicationTime: string
      firstApproverName?: string | null
      firstApprovalTime?: string | null
      firstApprovalResultDesc?: string
      secondApproverName?: string | null
      secondApprovalTime?: string | null
      secondApprovalResultDesc?: string
      statusDesc: string
      status: number
      needApproval: number
      needApprovalDesc: string
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

export default function WoDeShenQingPage() {
  // 数据状态
  const [records, setRecords] = useState<MyApplicationsApiResponse['data']['list']>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // 筛选条件
  const [filters, setFilters] = useState<MyApplicationsFilterParams>({
    status: undefined,
    startDate: undefined,
    endDate: undefined,
    pageNum: 1,
    pageSize: 20,
  })

  // 详情相关（直接使用列表数据）
  const [approvalDetail, setApprovalDetail] = useState<MyApplicationsApiResponse['data']['list'][0] | null>(null)

  // 处理筛选
  const handleFilter = (params: MyApplicationsFilterParams) => {
    const newFilters = {
      ...params,
      pageNum: 1, // 筛选时重置到第一页
    }
    setFilters(newFilters)
    // 使用新的筛选条件获取数据
    fetchMyApplicationsWithFilters(newFilters, 1)
  }

  // 使用筛选条件获取数据（使用真实 API）
  const fetchMyApplicationsWithFilters = async (filterParams: MyApplicationsFilterParams, page?: number) => {
    try {
      setLoading(true)
      setError(null)

      // 构建查询参数
      const params = new URLSearchParams()
      
      // 添加分页参数
      const pageNum = page || filterParams.pageNum || 1
      const pageSize = filterParams.pageSize || 20
      params.append('pageNum', String(pageNum))
      params.append('pageSize', String(pageSize))
      
      // 添加筛选条件（可选参数）
      if (filterParams.status !== undefined && filterParams.status !== null) {
        params.append('status', String(filterParams.status))
      }
      
      if (filterParams.startDate) {
        params.append('startDate', filterParams.startDate)
      }
      
      if (filterParams.endDate) {
        params.append('endDate', filterParams.endDate)
      }

      // 调用 API
      const response = await apiFetch(`/api/api/approval/my-applications?${params.toString()}`, {
        method: 'GET',
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: MyApplicationsApiResponse = await response.json()

      if (result.code !== 200) {
        throw new Error(result.message || '查询失败')
      }

      // 直接使用 API 返回的数据
      setRecords(result.data.list)
    } catch (err: any) {
      setError(err.message || '数据加载失败')
    } finally {
      setLoading(false)
    }
  }

  // 处理表格行点击（直接使用列表数据）
  const handleRowClick = (record: MyApplicationsApiResponse['data']['list'][0]) => {
    setApprovalDetail(record)
  }

  // 初始加载
  useEffect(() => {
    fetchMyApplicationsWithFilters({
      status: undefined,
      startDate: undefined,
      endDate: undefined,
      pageNum: 1,
      pageSize: 20,
    })
  }, [])

  // 将API数据转换为表格数据
  const tableRows = useMemo(() => {
    return records.map((record, index) => ({
      id: String(index + 1).padStart(2, '0'), // 序号从1开始，不依赖分页
      approvalNo: record.approvalNo,
      modifyTypeDesc: record.modifyTypeDesc,
      applicantName: record.applicantName,
      applicationTime: formatDateTime(record.applicationTime),
      status: record.status,
      statusDesc: record.statusDesc,
      firstApproverName: record.firstApproverName || '-',
      firstApprovalTime: record.firstApprovalTime ? formatDateTime(record.firstApprovalTime) : '-',
    }))
  }, [records])

  // 表格配置
  const tableConfig = useMemo(() => {
    return {
      columns: [
        { key: "id", label: "序号", width: "80px", align: "center" as const },
        { key: "approvalNo", label: "审批编号", width: "200px", align: "center" as const },
        { key: "modifyTypeDesc", label: "修改类型", width: "150px", align: "center" as const },
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
            const originalRecord = records.find(r => r.approvalNo === row.approvalNo)
            if (originalRecord) {
              handleRowClick(originalRecord)
            }
          },
        },
      ],
      data: tableRows.map(row => ({
        ...row,
        statusDisplay: getStatusBadge(row.status), // 状态显示组件
        viewDetails: "查看详情",
      })),
      showPagination: false, // 使用滚动条而不是分页
    }
  }, [tableRows, records])

  return (
    <div className="h-[calc(100vh-100px)] bg-slate-900 p-4 flex flex-col">
      {/* 两列布局，比例 1416:460 */}
      <div className="flex-1 grid grid-cols-[1416fr_460fr] gap-4 min-h-0">
        {/* 左侧列 - 表格 */}
        <div className="flex flex-col gap-4 min-h-0">
          {/* 表格区域 */}
          <div className="h-full min-h-0">
            {loading ? (
              <div className="h-full flex items-center justify-center text-slate-300">数据加载中...</div>
            ) : error ? (
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

        {/* 右侧列 - 筛选面板 + 详情面板 */}
        <div className="bg-slate-800/50 border border-blue-500/30 rounded-lg p-4 flex flex-col gap-4 min-h-0 overflow-hidden">
          {/* 筛选面板 */}
          <div className="flex-shrink-0">
            <MyApplicationsFilter 
              onFilter={handleFilter}
              initialParams={filters}
            />
          </div>

          {/* 详情面板 */}
          <div className="flex-1 min-h-0 overflow-auto">
            <div className="text-lg font-semibold text-white mb-2">申请详情</div>
            
            {!approvalDetail ? (
              <div className="text-slate-400 text-sm py-4">请点击表格行查看详情</div>
            ) : (
              <div className="space-y-3 text-sm">
                {/* 基本信息 */}
                <div className="space-y-2">
                  <div className="text-cyan-400 font-semibold border-b border-cyan-500/30 pb-1">基本信息</div>
                  <div className="grid grid-cols-2 gap-2 text-slate-200">
                    <div><span className="text-slate-400">审批编号：</span>{approvalDetail.approvalNo}</div>
                    <div><span className="text-slate-400">修改类型：</span>{approvalDetail.modifyTypeDesc}</div>
                    <div><span className="text-slate-400">状态：</span>{approvalDetail.statusDesc}</div>
                    <div><span className="text-slate-400">是否需要审批：</span>{approvalDetail.needApprovalDesc}</div>
                  </div>
                </div>

                {/* 申请信息 */}
                <div className="space-y-2">
                  <div className="text-cyan-400 font-semibold border-b border-cyan-500/30 pb-1">申请信息</div>
                  <div className="grid grid-cols-2 gap-2 text-slate-200">
                    <div><span className="text-slate-400">申请人：</span>{approvalDetail.applicantName}</div>
                    <div><span className="text-slate-400">申请时间：</span>{formatDateTime(approvalDetail.applicationTime)}</div>
                    <div className="col-span-2"><span className="text-slate-400">变更原因：</span>{approvalDetail.changeReason || "暂无"}</div>
                  </div>
                </div>

                {/* 一级审批信息 */}
                <div className="space-y-2">
                  <div className="text-cyan-400 font-semibold border-b border-cyan-500/30 pb-1">一级审批</div>
                  <div className="grid grid-cols-2 gap-2 text-slate-200">
                    <div><span className="text-slate-400">审批人：</span>{approvalDetail.firstApproverName || "暂无"}</div>
                    <div><span className="text-slate-400">审批时间：</span>{approvalDetail.firstApprovalTime ? formatDateTime(approvalDetail.firstApprovalTime) : "暂无"}</div>
                    <div><span className="text-slate-400">审批结果：</span>{approvalDetail.firstApprovalResultDesc || "暂无"}</div>
                  </div>
                </div>

                {/* 二级审批信息 */}
                <div className="space-y-2">
                  <div className="text-cyan-400 font-semibold border-b border-cyan-500/30 pb-1">二级审批</div>
                  <div className="grid grid-cols-2 gap-2 text-slate-200">
                    <div><span className="text-slate-400">审批人：</span>{approvalDetail.secondApproverName || "暂无"}</div>
                    <div><span className="text-slate-400">审批时间：</span>{approvalDetail.secondApprovalTime ? formatDateTime(approvalDetail.secondApprovalTime) : "暂无"}</div>
                    <div><span className="text-slate-400">审批结果：</span>{approvalDetail.secondApprovalResultDesc || "暂无"}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
