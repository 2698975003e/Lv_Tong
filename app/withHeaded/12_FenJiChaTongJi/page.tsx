"use client"

import { useEffect, useMemo, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { TechDataTable } from "@/components/tech-data-table"
import { SimpleSearchPanel } from "@/components/simple-search-panel"

interface AuditStatisticsApiResponse {
  code: number
  message: string
  data: {
    queryCondition: {
      targetStation?: string
      targetLevel?: string
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
      avgAuditDuration?: number
      auditRatio: number | string
      discountAbove500AuditedCount?: number
      discountBelow500AuditedCount?: number
      discountAbove500UnauditedCount?: number
      discountBelow500UnauditedCount?: number
      discountAbove500QualifiedCount?: number
      discountBelow500QualifiedCount?: number
      discountAbove500UnqualifiedCount?: number
      discountBelow500UnqualifiedCount?: number
      discountAbove500AuditRatio?: number
      discountBelow500AuditRatio?: number
    }>
    tollOfficeStatistics: Array<any>
    branchCompanyStatistics: Array<any>
  }
  timestamp?: number
}

function FenJiChaTongJiContent() {
  const searchParams = useSearchParams()
  const [data, setData] = useState<AuditStatisticsApiResponse['data'] | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)
        const url = new URL('http://116.57.120.171:8081/api/api/audit/statistics')
        url.searchParams.set('test', 'scutgreenpass')
        const rawTarget = searchParams.get('targetStation') || ''
        const cleanedTarget = rawTarget.replace(/^"+|"+$/g, '').trim()
        if (cleanedTarget) {
          url.searchParams.set('targetStation', cleanedTarget)
        }
        const token = typeof window !== 'undefined' ? (sessionStorage.getItem('token') || localStorage.getItem('token')) : null
        const res = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          signal: controller.signal,
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json: AuditStatisticsApiResponse = await res.json()
        if (json.code !== 200) throw new Error(json.message || '接口返回错误')
        setData(json.data)
      } catch (e: any) {
        if (e.name !== 'AbortError') setError(e.message || '加载失败')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
    return () => controller.abort()
  }, [searchParams])

  const table1Rows = useMemo(() => {
    const rows = data?.stationStatistics || []
    return rows.map((row, idx) => {
      const ratio = typeof row.auditRatio === 'number' ? `${row.auditRatio.toFixed(2)}%` : row.auditRatio
      return {
        id: String(idx + 1).padStart(2, '0'),
        stationName: row.stationName,
        totalInspectionCount: String(row.totalInspectionCount),
        auditedCount: String(row.auditedCount),
        unauditedCount: String(row.unauditedCount),
        qualifiedCount: String(row.qualifiedCount),
        unqualifiedCount: String(row.unqualifiedCount),
        avgAuditDuration: String(row.avgAuditDuration ?? '-'),
        auditRatio: ratio,
      }
    })
  }, [data])

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
    bodyMaxHeight: "400px",
  }

  // 第二个表格配置
  const tableConfig2 = {
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
    data: [
        {
            id: "01",
            stationName: "济南东收费站",
            totalInspectionCount: "579",
            auditedCount: "520",
            unauditedCount: "59",
            qualifiedCount: "490",
            unqualifiedCount: "30",
            avgAuditDuration: "125.5",
            auditRatio: "89.81%",
        },
    ],
    showPagination: false,
    bodyMaxHeight: "400px",
  }

  return (
    <div className="h-[calc(100vh-100px)] bg-slate-900 p-4 flex flex-col">
      {/* 两列布局，比例 1416:460 */}
      <div className="flex-1 grid grid-cols-[1416fr_460fr] gap-4 min-h-0">
        {/* 左侧列 - 上下两个表格 */}
        <div className="flex flex-col gap-4 min-h-0">
          {/* 上表格：分级统计 */}
          <div className="h-[50%] min-h-0">
            <TechDataTable config={tableConfig1} className="h-full" />
          </div>

          {/* 下表格：收费站分级统计 */}
          <div className="h-[50%] min-h-0">
            <TechDataTable config={tableConfig2} className="h-full" />
          </div>
        </div>

        {/* 右侧列 - 简化搜索面板 */}
        <div className="bg-slate-800/50 border border-blue-500/30 rounded-lg p-0">
          <SimpleSearchPanel />
        </div>
      </div>
    </div>
  )
}

export default function FenJiChaTongJiPage() {
  return (
    <Suspense fallback={<div className="text-slate-300 p-4">页面加载中...</div>}>
      <FenJiChaTongJiContent />
    </Suspense>
  )
}
