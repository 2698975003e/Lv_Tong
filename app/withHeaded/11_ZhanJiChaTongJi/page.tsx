"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { TechDataTable } from "@/components/tech-data-table"
import { SplitRowTable } from "@/components/split-row-table"
import { SimpleSearchPanel } from "@/components/simple-search-panel"
import { apiFetch } from "@/lib/api"

// 1) 类型定义：与后端成功响应结构对齐（按你提供的示例）
interface AuditStatisticsApiResponse {
  code: number
  message: string
  data: {
    queryCondition: {
      startDate?: string
      endDate?: string
      minDiscountAmount?: number
      maxDiscountAmount?: number
      targetStation?: string
      targetLevel?: string // 如：收费站
    }
    stationStatistics: Array<{
      stationId: string
      stationName: string
      discountAbove500Count: number
      discountBelow500Count: number
      totalInspectionCount: number
      auditedCount: number
      unauditedCount: number
      qualifiedCount: number
      unqualifiedCount: number
      avgAuditDuration: number
      auditRatio: string | number // 你说明为"百分比字符串"，亦兼容数值
      // 以下为金额分段的细分统计（按示例返回，设为可选以兼容不同环境）
      discountAbove500AuditedCount?: number
      discountBelow500AuditedCount?: number
      discountAbove500UnauditedCount?: number
      discountBelow500UnauditedCount?: number
      discountAbove500QualifiedCount?: number
      discountBelow500QualifiedCount?: number
      discountAbove500UnqualifiedCount?: number
      discountBelow500UnqualifiedCount?: number
      discountBelow500AvgAuditDuration?: number
      discountAbove500AuditRatio?: number
      discountBelow500AuditRatio?: number
    }>
    tollOfficeStatistics: Array<any>
    branchCompanyStatistics: Array<any>
  }
  timestamp?: number
}

type AuditQueryFilters = {
  startDate?: string
  endDate?: string
  minDiscountAmount?: number
  maxDiscountAmount?: number
}

export default function ZhanJiChaTongJiPage() {
  // 2) 接口数据状态：仅先接入"表一（收费站查验统计）"，保持布局不变
  const [auditStatsData, setAuditStatsData] = useState<AuditStatisticsApiResponse['data'] | null>(null)
  const [auditStatsLoading, setAuditStatsLoading] = useState<boolean>(true)
  const [auditStatsError, setAuditStatsError] = useState<string | null>(null)
  const [filters, setFilters] = useState<AuditQueryFilters>({})
  const searchParams = useSearchParams()

  // 3) 发起请求：不改变布局，默认首次加载调用一次（筛选面板后续可扩展为传参触发）
  useEffect(() => {
    const controller = new AbortController()
    
    async function fetchAuditStats() {
      try {
        // 3.1 进入请求：置为加载中并清空错误
        setAuditStatsLoading(true)
        setAuditStatsError(null)

        // 3.2 说明：若后端需要 Authorization，可从本地获取；没有则省略
        const token = typeof window !== 'undefined' ? (sessionStorage.getItem('token') || localStorage.getItem('token')) : null

        // 3.3 通过 fetch 调用后端接口；URL 携带查询参数（test）
        //     controller.signal 用于组件卸载时中断请求，避免内存泄露
        const url = new URL('/api/api/audit/statistics', window.location.origin)
        // 统计查询条件参数（可选）：按需追加
        // 例如：url.searchParams.set('startDate', startDate)
        //      url.searchParams.set('endDate', endDate)
        //      url.searchParams.set('minDiscountAmount', String(min))
        //      url.searchParams.set('maxDiscountAmount', String(max))
        //      url.searchParams.set('targetStation', stationName)

        // 从 URL 读取 targetStation，并去除可能的引号
        const rawTargetStation = searchParams.get('targetStation') || ''
        const cleanedTargetStation = rawTargetStation.replace(/^"+|"+$/g, '').trim()
        if (cleanedTargetStation) {
          url.searchParams.set('targetStation', cleanedTargetStation)
        }

        if (filters.startDate) {
          url.searchParams.set('startDate', filters.startDate)
        }
        if (filters.endDate) {
          url.searchParams.set('endDate', filters.endDate)
        }
        if (typeof filters.minDiscountAmount === 'number') {
          url.searchParams.set('minDiscountAmount', filters.minDiscountAmount.toString())
        }
        if (typeof filters.maxDiscountAmount === 'number') {
          url.searchParams.set('maxDiscountAmount', filters.maxDiscountAmount.toString())
        }

        const response = await apiFetch(url.pathname + url.search, {
          method: 'GET',
          signal: controller.signal,
        })

        // 3.4 基于 HTTP 层面的状态码做一次基础校验
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        // 3.5 解析 JSON，并按业务 code===200 进行成功与否判断
        const apiResponse: AuditStatisticsApiResponse = await response.json()
        
        if (apiResponse.code === 200) {
          // 3.6 成功：将 data 写入状态，供下游组件渲染
          setAuditStatsData(apiResponse.data)
        } else {
          throw new Error(apiResponse.message || 'API返回错误')
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          // 3.7 失败：记录错误信息并在界面展示
          setAuditStatsError(err.message || '数据加载失败')
        }
      } finally {
        // 3.8 无论成功或失败，都结束加载态
        setAuditStatsLoading(false)
      }
    }

    fetchAuditStats()

    return () => {
      controller.abort()
    }
  }, [filters, searchParams])

  const handleSearch = (params: AuditQueryFilters) => {
    setFilters(() => {
      const sanitized: AuditQueryFilters = {}
      if (params.startDate) sanitized.startDate = params.startDate
      if (params.endDate) sanitized.endDate = params.endDate
      if (typeof params.minDiscountAmount === 'number') sanitized.minDiscountAmount = params.minDiscountAmount
      if (typeof params.maxDiscountAmount === 'number') sanitized.maxDiscountAmount = params.maxDiscountAmount
      return sanitized
    })
  }


  // 4) 将接口数据映射为表一 `TechDataTable` 所需结构
  const table1Rows = useMemo(() => {
    const stationStats = auditStatsData?.stationStatistics || []
    return stationStats.map((row, idx) => {
      const ratio = typeof row.auditRatio === 'number' ? `${row.auditRatio.toFixed(2)}%` : row.auditRatio
      return {
        id: String(idx + 1).padStart(2, '0'),
        stationName: row.stationName,
        totalInspectionCount: String(row.totalInspectionCount),
        auditedCount: String(row.auditedCount),
        unauditedCount: String(row.unauditedCount),
        qualifiedCount: String(row.qualifiedCount),
        unqualifiedCount: String(row.unqualifiedCount),
        avgAuditDuration: String(row.avgAuditDuration),
        auditRatio: ratio,
      }
    })
  }, [auditStatsData])

  // 5) 将接口数据映射为表二 `SplitRowTable` 所需结构（<500 / >500）
  const table2Rows = useMemo(() => {
    const stationStats = auditStatsData?.stationStatistics || []
    if (stationStats.length === 0) return []
    return stationStats.map((row, idx) => {
      const below500Ratio =
        typeof row.discountBelow500AuditRatio === 'number'
          ? `${row.discountBelow500AuditRatio.toFixed(2)}%`
          : row.discountBelow500AuditRatio ?? '-'
      const above500Ratio =
        typeof row.discountAbove500AuditRatio === 'number'
          ? `${row.discountAbove500AuditRatio.toFixed(2)}%`
          : row.discountAbove500AuditRatio ?? '-'

      const below500Avg =
        typeof row.discountBelow500AvgAuditDuration === 'number'
          ? String(row.discountBelow500AvgAuditDuration)
          : row.discountBelow500AvgAuditDuration !== undefined
          ? String(row.discountBelow500AvgAuditDuration)
          : '-'

      return {
        id: String(idx + 1).padStart(2, '0'),
        stationName: row.stationName,
        discountamount: { top: "<500元", bottom: ">500元" },
        totalInspectionCount: {
          top: String(row.discountBelow500Count ?? '-'),
          bottom: String(row.discountAbove500Count ?? '-'),
        },
        auditedCount: {
          top: String(row.discountBelow500AuditedCount ?? '-'),
          bottom: String(row.discountAbove500AuditedCount ?? '-'),
        },
        unauditedCount: {
          top: String(row.discountBelow500UnauditedCount ?? '-'),
          bottom: String(row.discountAbove500UnauditedCount ?? '-'),
        },
        qualifiedCount: {
          top: String(row.discountBelow500QualifiedCount ?? '-'),
          bottom: String(row.discountAbove500QualifiedCount ?? '-'),
        },
        unqualifiedCount: {
          top: String(row.discountBelow500UnqualifiedCount ?? '-'),
          bottom: String(row.discountAbove500UnqualifiedCount ?? '-'),
        },
        avgAuditDuration: {
          top: below500Avg,
          bottom: "-", // 示例未提供 >500 的平均用时字段，先占位
        },
        auditRatio: {
          top: below500Ratio,
          bottom: above500Ratio,
        },
      }
    })
  }, [auditStatsData])
  // 第一个表格配置
  const tableConfig1 = {
    columns: [
      { key: "id", label: "序号", width: "100px", align: "center" as const },
      { key: "stationName", label: "收费站", width: "200px", align: "center" as const },
      { key: "totalInspectionCount", label: "查验车次", width: "150px", align: "center" as const },
      { key: "auditedCount", label: "稽查车次", width: "150px", align: "center" as const },
      { key: "unauditedCount", label: "未稽查车次", width: "150px", align: "center" as const },
      { key: "qualifiedCount", label: "稽查合格", width: "150px", align: "center" as const },
      { key: "unqualifiedCount", label: "稽查不合格", width: "150px", align: "center" as const },
      { key: "avgAuditDuration", label: "稽查平均用时(s)", width: "150px", align: "center" as const },
      { key: "auditRatio", label: "稽查占比", width: "150px", align: "center" as const },
    ],
    data: table1Rows,
    showPagination: false,
    bodyMaxHeight: "300px",
  }

  // 第二个表格配置
  const tableConfig2 = {
    columns: [
      { key: "id", label: "序号", width: "100px", align: "center" as const },
      { key: "stationName", label: "收费站", width: "150px", align: "center" as const },
      { key: "discountamount", label: "减免金额", width: "150px", align: "center" as const },
      { key: "totalInspectionCount", label: "查验车次", width: "150px", align: "center" as const },
      { key: "auditedCount", label: "稽查车次", width: "150px", align: "center" as const },
      { key: "unauditedCount", label: "未稽查车次", width: "120px", align: "center" as const },
      { key: "qualifiedCount", label: "稽查合格", width: "120px", align: "center" as const },
      { key: "unqualifiedCount", label: "稽查不合格", width: "130px", align: "center" as const },
      { key: "avgAuditDuration", label: "稽查平均用时(s)", width: "130px", align: "center" as const },
      { key: "auditRatio", label: "稽查占比", width: "130px", align: "center" as const },
    ],
    data: table2Rows.length > 0 ? table2Rows : [
      {
        id: "01",
        stationName: "—",
        discountamount: { top: "<500元", bottom: ">500元" },
        totalInspectionCount: { top: "-", bottom: "-" },
        auditedCount: { top: "-", bottom: "-" },
        unauditedCount: { top: "-", bottom: "-" },
        qualifiedCount: { top: "-", bottom: "-" },
        unqualifiedCount: { top: "-", bottom: "-" },
        avgAuditDuration: { top: "-", bottom: "-" },
        auditRatio: { top: "-", bottom: "-" },
      },
    ],
    showPagination: false,
    bodyMaxHeight: "350px",
    splitFromColumn: 3  // 从第3列开始分裂
  }

  return (
    <div className="h-[calc(100vh-100px)] bg-slate-900 p-4 flex flex-col">
      {/* 两列布局，比例 1416:460 */}
      <div className="flex-1 grid grid-cols-[1416fr_460fr] gap-4 min-h-0">
        {/* 左侧列 - 上下两个表格 */}
        <div className="flex flex-col gap-4 min-h-0">
          {/* 上表格：收费站查验统计 */}
          <div className="h-[50%] min-h-0">
            {auditStatsLoading ? (
              <div className="h-full flex items-center justify-center text-slate-300">数据加载中...</div>
            ) : auditStatsError ? (
              <div className="h-full flex items-center justify-center text-red-400">加载失败: {auditStatsError}</div>
            ) : table1Rows.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-300">暂无数据</div>
            ) : (
              <TechDataTable config={tableConfig1} className="h-full" />
            )}
          </div>

          {/* 下表格：车型查验统计 - 使用分裂行表格 */}
          <div className="h-[50%] min-h-0 mt-4">
            {auditStatsLoading ? (
              <div className="h-full flex items-center justify-center text-slate-300">数据加载中...</div>
            ) : auditStatsError ? (
              <div className="h-full flex items-center justify-center text-red-400">加载失败: {auditStatsError}</div>
            ) : (
              <SplitRowTable config={tableConfig2} className="h-full" />
            )}
          </div>
        </div>

        {/* 右侧列 - 简化搜索面板 */}
        <div className="bg-slate-800/50 border border-blue-500/30 rounded-lg p-0">
          <SimpleSearchPanel onSearch={handleSearch} />
        </div>
      </div>
    </div>
  )
}
