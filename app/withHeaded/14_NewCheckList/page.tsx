"use client"

import { useState, useEffect, Fragment } from "react"
import { cn } from "@/lib/utils"
import { apiFetch } from "@/lib/api"

type FixItem = {
  name: string
  oldContent: string
  newContent: string
}

type CheckRecord = {
  id: string
  plate: string
  inspectTime: string
  modifyTime: string
  modifier: string
  detail: string
  reviewer: string
  fixItems: FixItem[]
  approvalNo?: string // 审批编号，用于获取详情
  firstApproverName?: string
  secondApproverName?: string
  status?: number
  statusDesc?: string
}

// 后端 API 返回的数据类型
interface ApiApprovalItem {
  approvalNo: string
  inspectionId: number
  targetCheckId: string
  modifyType: string
  modifyTypeDesc: string
  oldValue: string
  newValue: string
  changeReason: string
  applicantId: number
  applicantName: string
  applicationTime: string
  approvalLevel: string
  currentApprovalLevel: number
  status: number
  statusDesc: string
  plateNumber: string
  checkTime: string
  modifyTime: string
  modifierName: string
  firstApproverName?: string | null
  secondApproverName?: string | null
}

interface ApiResponse {
  code: number
  message: string
  data: {
    pageNum: number
    pageSize: number
    total: number
    pages: number
    hasPreviousPage: boolean
    hasNextPage: boolean
    list: ApiApprovalItem[]
  }
  timestamp: number
}

// 审批详情接口返回类型
interface ApprovalDetailResponse {
  code: number
  message: string
  data: {
    approvalNo: string
    targetTable: string
    targetRecordId: number
    targetCheckId: string
    inspectionId: number
    modifyType: string
    modifyTypeName: string
    oldValue: string
    newValue: string
    changeReason: string
    needApproval: number
    approvalLevel: string
    currentApprovalLevel: number
    applicantId: number
    applicantName: string
    applicationTime: string
    firstApproverId: number | null
    firstApproverName: string | null
    firstApprovalTime: string | null
    firstApprovalResult: number | null
    firstApprovalComment: string | null
    secondApproverId: number | null
    secondApproverName: string | null
    secondApprovalTime: string | null
    secondApprovalResult: number | null
    secondApprovalComment: string | null
    status: number
    statusName: string
    inspectionModifyCount: string
    createdAt: string
    updatedAt: string
  }
  timestamp: number
}

// 字段映射表
const FIELD_MAPPING: Record<string, string> = {
  // 基础信息
  plate: "车牌号",
  vehicleId: "车辆唯一标识",
  driverName: "司机姓名",
  driverPhone: "司机手机号",
  driverTelephone: "司机手机号",
  carrierName: "承运单位",
  goodsName: "货物名称",
  destination: "目的地",
  weight: "载重/货重",
  memo: "备注",
  remark: "备注",
  // 通行信息
  entryStation: "入口收费站",
  entry: "入口收费站",
  exitStation: "出口收费站",
  exit: "出口收费站",
  entryTime: "入口时间",
  exitTime: "出口时间",
  enStationId: "入站编号",
  route: "通行路线",
  routeCode: "通行路线",
  tollSectionId: "路段编号",
  // 查验结果
  checkResult: "查验结果",
  checkTime: "查验时间",
  checkerName: "查验员",
  reason: "不通过原因说明",
  failReason: "不通过原因说明",
  auditResult: "稽核结论",
  // 删除类
  deleted: "删除状态",
  deleteReason: "删除原因说明",
  deleteOperator: "删除操作人",
}

type ModifyCountMap = Record<string, number | string>

const MODIFY_COUNT_LABELS: Record<string, string> = {
  basic_info: "基础信息修改次数",
  transit_info: "通行信息修改次数",
  check_result: "查验结果修改次数",
  delete_record: "删除记录修改次数",
  total: "累计修改次数",
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

// 解析 JSON 字符串并转换为修正项数组
function parseModifyValues(oldValue: string, newValue: string): FixItem[] {
  try {
    const oldObj = oldValue ? JSON.parse(oldValue) : {}
    const newObj = newValue ? JSON.parse(newValue) : {}
    
    const fixItems: FixItem[] = []
    
    // 获取所有字段（合并 oldValue 和 newValue 的所有键）
    const allFields = new Set([...Object.keys(oldObj), ...Object.keys(newObj)])
    
    allFields.forEach((field) => {
      const oldVal = oldObj[field] ?? ""
      const newVal = newObj[field] ?? ""
      
      // 添加所有字段（即使值相同也显示，因为可能是新增或修改）
      const fieldName = FIELD_MAPPING[field] || field
      fixItems.push({
        name: fieldName,
        oldContent: String(oldVal || ""),
        newContent: String(newVal || ""),
      })
    })
    
    return fixItems
  } catch (error) {
    console.error("解析 JSON 失败:", error)
    return []
  }
}

function parseInspectionModifyCount(countStr?: string | null): ModifyCountMap | null {
  if (!countStr) return null
  try {
    const parsed = JSON.parse(countStr)
    return typeof parsed === "object" && parsed !== null ? (parsed as ModifyCountMap) : null
  } catch {
    return null
  }
}

// 将后端数据转换为表格数据格式
function convertApiDataToTableData(apiData: ApiApprovalItem[]): CheckRecord[] {
  return apiData.map((item, index) => {
    const fixItems = parseModifyValues(item.oldValue, item.newValue)
    
    return {
      id: String(index + 1),
      plate: item.plateNumber || "",
      inspectTime: formatDateTime(item.checkTime),
      modifyTime: formatDateTime(item.modifyTime),
      modifier: item.modifierName || item.applicantName || "",
      detail: item.changeReason || "",
      reviewer: "", // 审核人字段在后端数据中可能不存在，需要根据实际字段调整
      fixItems: fixItems.length > 0 ? fixItems : [{ name: item.modifyTypeDesc || "未知", oldContent: "", newContent: "" }],
      approvalNo: item.approvalNo, // 保存审批编号
      firstApproverName: item.firstApproverName || undefined,
      secondApproverName: item.secondApproverName || undefined,
      status: item.status,
      statusDesc: item.statusDesc,
    }
  })
}

export default function NewCheckListPage() {
  const [records, setRecords] = useState<CheckRecord[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedRecord, setSelectedRecord] = useState<CheckRecord | null>(null)
  const [approvalDetail, setApprovalDetail] = useState<ApprovalDetailResponse['data'] | null>(null)
  const [detailLoading, setDetailLoading] = useState<boolean>(false)
  const [detailError, setDetailError] = useState<string | null>(null)
  const [approvalComment, setApprovalComment] = useState<string>("")
  const [actionLoading, setActionLoading] = useState<boolean>(false)
  const [actionMessage, setActionMessage] = useState<string | null>(null)

  // 从后端获取数据
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await apiFetch('/api/api/approval/pending')
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result: ApiResponse = await response.json()

        if (result.code !== 200) {
          throw new Error(result.message || '查询失败')
        }

        // 转换数据
        const convertedData = convertApiDataToTableData(result.data.list)
        setRecords(convertedData)
      } catch (err) {
        console.error('API调用失败:', err)
        setError(err instanceof Error ? err.message : '查询失败，请稍后重试')
        setRecords([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // 获取审批详情
  const fetchApprovalDetail = async (approvalNo: string) => {
    if (!approvalNo) return

    setDetailLoading(true)
    setDetailError(null)

    try {
      const response = await apiFetch(`/api/api/approval/detail/${approvalNo}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ApprovalDetailResponse = await response.json()

      if (result.code !== 200) {
        throw new Error(result.message || '查询失败')
      }

      setApprovalDetail(result.data)
      setApprovalComment("")
      setActionMessage(null)
    } catch (err) {
      console.error('获取审批详情失败:', err)
      setDetailError(err instanceof Error ? err.message : '查询失败，请稍后重试')
      setApprovalDetail(null)
    } finally {
      setDetailLoading(false)
    }
  }

  // 处理表格行点击
  const handleRowClick = (record: CheckRecord) => {
    setSelectedRecord(record)
    setActionMessage(null)
    if (record.approvalNo) {
      fetchApprovalDetail(record.approvalNo)
    } else {
      setDetailError('该记录没有审批编号')
      setApprovalDetail(null)
    }
  }

  // 处理审批操作
  const handleApprovalAction = async (result: 1 | 2) => {
    if (!approvalDetail?.approvalNo) {
      setDetailError('请先选择需要审批的记录')
      return
    }
    if (approvalDetail.status !== 1) {
      setDetailError('当前状态不允许审批操作')
      return
    }

    setActionLoading(true)
    setActionMessage(null)
    setDetailError(null)

    try {
      const response = await apiFetch('/api/api/approval/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          approvalNo: approvalDetail.approvalNo,
          result,
          comment: approvalComment?.trim() || (result === 1 ? '审核通过' : '审核拒绝'),
        }),
      })

      const resultData = await response.json()

      if (!response.ok || resultData.code !== 200) {
        throw new Error(resultData.message || '审批失败')
      }

      setActionMessage(resultData.message || (result === 1 ? '审批通过' : '审批拒绝'))
      await fetchApprovalDetail(approvalDetail.approvalNo)
    } catch (err) {
      console.error('审批操作失败:', err)
      setDetailError(err instanceof Error ? err.message : '审批失败，请稍后重试')
    } finally {
      setActionLoading(false)
    }
  }

  const formatJsonDisplay = (value?: string | null) => {
    if (!value) return "-"
    try {
      return JSON.stringify(JSON.parse(value), null, 2)
    } catch {
      return value
    }
  }

  const detailFixItems = approvalDetail
    ? parseModifyValues(approvalDetail.oldValue || "{}", approvalDetail.newValue || "{}")
    : []

  const inspectionModifyCount = approvalDetail
    ? parseInspectionModifyCount(approvalDetail.inspectionModifyCount)
    : null

  const canApprove = approvalDetail?.status === 1
  const approvalStatusText = approvalDetail?.statusName || selectedRecord?.statusDesc || "状态未知"

  return (
    <div className="h-[calc(100vh-100px)] bg-slate-900 p-4 flex flex-col">
      <div className="flex-1 grid grid-cols-[1416fr_460fr] gap-4 min-h-0">
        {/* 左侧：自定义表格（多修正项，其他字段垂直居中） */}
        <div className="min-h-0 bg-slate-800/30 border border-blue-500/30 rounded-lg overflow-hidden flex flex-col">
          {/* 表格容器 - 设置固定高度和滚动 */}
          <div 
            className="overflow-auto custom-scrollbar flex-1"
            style={{
              maxHeight: 'calc(100vh - 200px)',
              height: '500px',
            }}
          >
            <style dangerouslySetInnerHTML={{__html: `
              .custom-scrollbar::-webkit-scrollbar {
                width: 8px;
                height: 8px;
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                background: rgba(9, 18, 38, 0.8);
                border-radius: 4px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background: rgba(59, 130, 246, 0.5);
                border-radius: 4px;
                border: 1px solid rgba(59, 130, 246, 0.3);
              }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: rgba(59, 130, 246, 0.7);
              }
              .custom-scrollbar::-webkit-scrollbar-corner {
                background: rgba(9, 18, 38, 0.8);
              }
              /* Firefox */
              .custom-scrollbar {
                scrollbar-width: thin;
                scrollbar-color: rgba(59, 130, 246, 0.5) rgba(9, 18, 38, 0.8);
              }
            `}} />
            <div className="rounded-lg border border-blue-800 shadow-lg overflow-hidden">
              <table className="w-full border-collapse text-[12px] leading-normal">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-[#091226]">
                    <th className="border border-[#003A7A] bg-[#091226] px-2 py-1.5 text-center text-[12px] font-medium text-white w-[80px]">序号</th>
                    <th className="border border-[#003A7A] bg-[#091226] px-2 py-1.5 text-center text-[12px] font-medium text-white w-[140px]">车牌</th>
                    <th className="border border-[#003A7A] bg-[#091226] px-2 py-1.5 text-center text-[12px] font-medium text-white w-[180px]">查验时间</th>
                    <th className="border border-[#003A7A] bg-[#091226] px-2 py-1.5 text-center text-[12px] font-medium text-white w-[140px]">修正项</th>
                    <th className="border border-[#003A7A] bg-[#091226] px-2 py-1.5 text-center text-[12px] font-medium text-white w-[180px]">原内容</th>
                    <th className="border border-[#003A7A] bg-[#091226] px-2 py-1.5 text-center text-[12px] font-medium text-white w-[180px]">新内容</th>
                    <th className="border border-[#003A7A] bg-[#091226] px-2 py-1.5 text-center text-[12px] font-medium text-white w-[180px]">修改时间</th>
                    <th className="border border-[#003A7A] bg-[#091226] px-2 py-1.5 text-center text-[12px] font-medium text-white w-[120px]">修改人</th>
                    <th className="border border-[#003A7A] bg-[#091226] px-2 py-1.5 text-center text-[12px] font-medium text-white w-[220px]">详情</th>
                    <th className="border border-[#003A7A] bg-[#091226] px-2 py-1.5 text-center text-[12px] font-medium text-white w-[120px]">一级审核员</th>
                    <th className="border border-[#003A7A] bg-[#091226] px-2 py-1.5 text-center text-[12px] font-medium text-white w-[120px]">二级审核员</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={10} className="border border-[#003A7A] px-4 py-8 text-center text-white">
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                          <span>加载中...</span>
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={10} className="border border-[#003A7A] px-4 py-8 text-center text-red-400">
                        {error}
                      </td>
                    </tr>
                  ) : records.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="border border-[#003A7A] px-4 py-8 text-center text-white">
                        暂无数据
                      </td>
                    </tr>
                  ) : (
                    records.map((rec, recIdx) => {
                      const span = Math.max(1, rec.fixItems.length)
                      return (
                        <Fragment key={rec.id}>
                          {rec.fixItems.map((fix, idx) => {
                            return (
                              <tr
                                key={`${rec.id}-${idx}`}
                                className={cn(
                                  "hover:bg-blue-700 cursor-pointer",
                                  selectedRecord?.id === rec.id && "bg-blue-600"
                                )}
                                onClick={() => handleRowClick(rec)}
                              >
                                {idx === 0 && (
                                  <>
                                    <td 
                                      className="border border-[#003A7A] px-2 py-1.5 text-center text-[12px] text-white align-middle" 
                                      rowSpan={span}
                                      style={{ backgroundColor: recIdx % 2 === 1 ? "#08152C" : "#101F48" }}
                                    >
                                      {rec.id}
                                    </td>
                                    <td 
                                      className="border border-[#003A7A] px-2 py-1.5 text-center text-[12px] font-medium text-white align-middle" 
                                      rowSpan={span}
                                      style={{ backgroundColor: recIdx % 2 === 1 ? "#08152C" : "#101F48" }}
                                    >
                                      {rec.plate}
                                    </td>
                                    <td 
                                      className="border border-[#003A7A] px-2 py-1.5 text-center text-[12px] text-white align-middle" 
                                      rowSpan={span}
                                      style={{ backgroundColor: recIdx % 2 === 1 ? "#08152C" : "#101F48" }}
                                    >
                                      {rec.inspectTime}
                                    </td>
                                  </>
                                )}
                                <td 
                                  className="border border-[#003A7A] px-2 py-1.5 text-center text-[12px] text-white"
                                  style={{ backgroundColor: recIdx % 2 === 1 ? "#08152C" : "#101F48" }}
                                >
                                  {fix.name}
                                </td>
                                <td 
                                  className="border border-[#003A7A] px-2 py-1.5 text-center text-[12px] text-white"
                                  style={{ backgroundColor: recIdx % 2 === 1 ? "#08152C" : "#101F48" }}
                                >
                                  {fix.oldContent}
                                </td>
                                <td 
                                  className="border border-[#003A7A] px-2 py-1.5 text-center text-[12px] text-white"
                                  style={{ backgroundColor: recIdx % 2 === 1 ? "#08152C" : "#101F48" }}
                                >
                                  {fix.newContent}
                                </td>
                                {idx === 0 && (
                                  <>
                                    <td 
                                      className="border border-[#003A7A] px-2 py-1.5 text-center text-[12px] text-white align-middle" 
                                      rowSpan={span}
                                      style={{ backgroundColor: recIdx % 2 === 1 ? "#08152C" : "#101F48" }}
                                    >
                                      {rec.modifyTime}
                                    </td>
                                    <td 
                                      className="border border-[#003A7A] px-2 py-1.5 text-center text-[12px] text-white align-middle" 
                                      rowSpan={span}
                                      style={{ backgroundColor: recIdx % 2 === 1 ? "#08152C" : "#101F48" }}
                                    >
                                      {rec.modifier}
                                    </td>
                                    <td 
                                      className="border border-[#003A7A] px-2 py-1.5 text-center text-[12px] text-white align-middle" 
                                      rowSpan={span}
                                      style={{ backgroundColor: recIdx % 2 === 1 ? "#08152C" : "#101F48" }}
                                    >
                                      {rec.detail}
                                    </td>
                                    <td 
                                      className="border border-[#003A7A] px-2 py-1.5 text-center text-[12px] text-white align-middle" 
                                      rowSpan={span}
                                      style={{ backgroundColor: recIdx % 2 === 1 ? "#08152C" : "#101F48" }}
                                    >
                                      {rec.firstApproverName || "暂无"}
                                    </td>
                                    <td 
                                      className="border border-[#003A7A] px-2 py-1.5 text-center text-[12px] text-white align-middle" 
                                      rowSpan={span}
                                      style={{ backgroundColor: recIdx % 2 === 1 ? "#08152C" : "#101F48" }}
                                    >
                                      {rec.secondApproverName || "暂无"}
                                    </td>
                                  </>
                                )}
                              </tr>
                            )
                          })}
                        </Fragment>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 右侧：审批详情显示区 */}
        <div className="bg-slate-800/50 border border-blue-500/30 rounded-lg p-4 flex flex-col gap-4 overflow-auto">
          <div className="text-lg font-semibold text-white mb-2">审批详情</div>
          
          {detailLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2 text-slate-300">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>加载中...</span>
              </div>
            </div>
          ) : detailError ? (
            <div className="text-red-400 text-sm py-4">{detailError}</div>
          ) : !approvalDetail ? (
            <div className="text-slate-400 text-sm py-4">请点击表格行查看详情</div>
          ) : (
            <div className="space-y-4 text-sm">
              <div className="space-y-2">
                <div className="text-cyan-400 font-semibold border-b border-cyan-500/30 pb-1">基础信息</div>
                <div className="grid grid-cols-2 gap-2 text-slate-200">
                  <div><span className="text-slate-400">审批编号：</span>{approvalDetail.approvalNo}</div>
                  <div><span className="text-slate-400">审批级别：</span>{approvalDetail.approvalLevel}</div>
                  <div><span className="text-slate-400">状态：</span>{approvalDetail.statusName}</div>
                  <div><span className="text-slate-400">当前级别：</span>{approvalDetail.currentApprovalLevel ?? "-"}</div>
                  <div><span className="text-slate-400">目标表：</span>{approvalDetail.targetTable}</div>
                  <div><span className="text-slate-400">目标记录ID：</span>{approvalDetail.targetRecordId || "-"}</div>
                  <div><span className="text-slate-400">查验ID：</span>{approvalDetail.inspectionId}</div>
                  <div><span className="text-slate-400">目标查验编号：</span>{approvalDetail.targetCheckId || "-"}</div>
                  <div><span className="text-slate-400">修改类型：</span>{approvalDetail.modifyTypeName}</div>
                  <div><span className="text-slate-400">创建时间：</span>{formatDateTime(approvalDetail.createdAt)}</div>
                  <div><span className="text-slate-400">更新时间：</span>{formatDateTime(approvalDetail.updatedAt)}</div>
                  <div><span className="text-slate-400">是否需要审批：</span>{approvalDetail.needApproval === 1 ? "是" : "否"}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-cyan-400 font-semibold border-b border-cyan-500/30 pb-1">申请信息</div>
                <div className="grid grid-cols-2 gap-2 text-slate-200">
                  <div><span className="text-slate-400">申请人：</span>{approvalDetail.applicantName}</div>
                  <div><span className="text-slate-400">申请时间：</span>{formatDateTime(approvalDetail.applicationTime)}</div>
                  <div className="col-span-2"><span className="text-slate-400">变更原因：</span>{approvalDetail.changeReason || "-"}</div>
                </div>
              </div>

              {inspectionModifyCount && (
                <div className="space-y-2">
                  <div className="text-cyan-400 font-semibold border-b border-cyan-500/30 pb-1">修改统计</div>
                  <div className="grid grid-cols-2 gap-2 text-slate-200">
                    {Object.entries(inspectionModifyCount).map(([key, value]) => (
                      <div key={key}>
                        <span className="text-slate-400">{MODIFY_COUNT_LABELS[key] || key}：</span>
                        {value}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="text-cyan-400 font-semibold border-b border-cyan-500/30 pb-1">修改详情</div>
                {detailFixItems.length > 0 ? (
                  <div className="rounded border border-slate-600 overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="bg-slate-900/60 text-slate-300">
                        <tr>
                          <th className="px-3 py-2 text-center font-medium">字段</th>
                          <th className="px-3 py-2 text-center font-medium">原值</th>
                          <th className="px-3 py-2 text-center font-medium">新值</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detailFixItems.map((item, idx) => (
                          <tr key={item.name + idx} className={idx % 2 === 0 ? "bg-slate-900/30" : "bg-slate-900/10"}>
                            <td className="px-3 py-2 text-center text-slate-200">{item.name}</td>
                            <td className="px-3 py-2 text-center text-slate-300 break-all">{item.oldContent || "-"}</td>
                            <td className="px-3 py-2 text-center text-slate-300 break-all">{item.newContent || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-slate-900/40 rounded p-3 text-slate-300">
                    暂无可展示的字段差异，原始数据如下：
                    <div className="grid grid-cols-2 gap-3 mt-2 text-xs">
                      <div>
                        <div className="text-slate-400 mb-1">原值：</div>
                        <div className="bg-slate-900/60 rounded p-2 whitespace-pre-wrap break-all">{formatJsonDisplay(approvalDetail.oldValue)}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 mb-1">新值：</div>
                        <div className="bg-slate-900/60 rounded p-2 whitespace-pre-wrap break-all">{formatJsonDisplay(approvalDetail.newValue)}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="text-cyan-400 font-semibold border-b border-cyan-500/30 pb-1">审批进度</div>
                <div className="space-y-3 text-slate-200">
                  {approvalDetail.firstApproverName ? (
                    <div className="bg-slate-900/40 rounded p-3 space-y-1">
                      <div><span className="text-slate-400">一级审批人：</span>{approvalDetail.firstApproverName}</div>
                      <div><span className="text-slate-400">审批时间：</span>{approvalDetail.firstApprovalTime ? formatDateTime(approvalDetail.firstApprovalTime) : "-"}</div>
                      <div><span className="text-slate-400">审批结果：</span>{approvalDetail.firstApprovalResult === 1 ? "通过" : approvalDetail.firstApprovalResult === 0 ? "不通过" : "-"}</div>
                      <div><span className="text-slate-400">审批意见：</span>{approvalDetail.firstApprovalComment || "-"}</div>
                    </div>
                  ) : (
                    <div className="bg-slate-900/30 rounded p-3 text-slate-400">一级审批信息暂未提供</div>
                  )}

                  {approvalDetail.secondApproverName ? (
                    <div className="bg-slate-900/40 rounded p-3 space-y-1">
                      <div><span className="text-slate-400">二级审批人：</span>{approvalDetail.secondApproverName}</div>
                      <div><span className="text-slate-400">审批时间：</span>{approvalDetail.secondApprovalTime ? formatDateTime(approvalDetail.secondApprovalTime) : "-"}</div>
                      <div><span className="text-slate-400">审批结果：</span>{approvalDetail.secondApprovalResult === 1 ? "通过" : approvalDetail.secondApprovalResult === 0 ? "不通过" : "-"}</div>
                      <div><span className="text-slate-400">审批意见：</span>{approvalDetail.secondApprovalComment || "-"}</div>
                    </div>
                  ) : (
                    <div className="bg-slate-900/30 rounded p-3 text-slate-400">二级审批待处理</div>
                  )}
                </div>
              </div>

              {canApprove ? (
                <>
                  <div className="space-y-2">
                    <div className="text-slate-400">审批意见</div>
                    <textarea
                      value={approvalComment}
                      onChange={(e) => setApprovalComment(e.target.value)}
                      className="w-full bg-slate-900/60 border border-slate-600 rounded p-2 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/60 resize-none"
                      rows={3}
                      placeholder="请输入审批意见（可选）"
                    />
                  </div>

                  {actionMessage && (
                    <div className="text-green-400 text-sm bg-green-900/30 border border-green-500/40 rounded p-2">
                      {actionMessage}
                    </div>
                  )}

                  <div className="flex justify-end gap-4 pt-2 border-t border-slate-600">
                    <button 
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-900/60 text-white rounded text-sm font-medium transition-colors"
                      onClick={() => handleApprovalAction(1)}
                      disabled={actionLoading}
                    >
                      {actionLoading ? '处理中...' : '通过'}
                    </button>
                    <button 
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-900/60 text-white rounded text-sm font-medium transition-colors"
                      onClick={() => handleApprovalAction(2)}
                      disabled={actionLoading}
                    >
                      {actionLoading ? '处理中...' : '不通过'}
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="bg-slate-900/40 border border-slate-600 rounded p-3 text-slate-300">
                    当前状态：<span className="text-cyan-300">{approvalStatusText}</span>，不可进行审批操作。
                  </div>
                  {actionMessage && (
                    <div className="text-green-400 text-sm bg-green-900/30 border border-green-500/40 rounded p-2">
                      {actionMessage}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}



