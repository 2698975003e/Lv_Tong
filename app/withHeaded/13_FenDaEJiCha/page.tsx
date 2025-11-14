"use client"

import { TechDataTable } from "@/components/tech-data-table"
import { SplitRowTable } from "@/components/split-row-table"
import { SimpleSearchPanel } from "@/components/simple-search-panel"

export default function ZhanJiChaTongJiPage() {
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
    showPagination: false
  }
  const tableConfig = {
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
    data: [
      {
        id: "01",
        stationName: "济南东收费站",
        discountamount: {top: "<500元", bottom: ">500元"},
        totalInspectionCount: { top: "503", bottom: "109" },  // >500 和 <500 的数据
        auditedCount: { top: "503", bottom: "109" },
        unauditedCount: { top: "0", bottom: "0" },
        qualifiedCount: { top: "503", bottom: "109" },
        unqualifiedCount: { top: "0", bottom: "0" },
        avgAuditDuration: { top: "42.23", bottom: "48.56" },
        auditRatio: { top: "100%", bottom: "100%" },
      },
    ],
    showPagination: false,
    splitFromColumn: 3  // 从第3列开始分裂
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
    data: [
      {
        id: "01",
        stationName: "济南东收费站",
        discountamount: {top: "<500元", bottom: ">500元"},
        totalInspectionCount: { top: "503", bottom: "109" },  // >500 和 <500 的数据
        auditedCount: { top: "503", bottom: "109" },
        unauditedCount: { top: "0", bottom: "0" },
        qualifiedCount: { top: "503", bottom: "109" },
        unqualifiedCount: { top: "0", bottom: "0" },
        avgAuditDuration: { top: "42.23", bottom: "48.56" },
        auditRatio: { top: "100%", bottom: "100%" },
      },
      {
        id: "02",
        stationName: "济南西收费站",
        discountamount: {top: "<500元", bottom: ">500元"},
        totalInspectionCount: { top: "456", bottom: "87" },
        auditedCount: { top: "456", bottom: "87" },
        unauditedCount: { top: "0", bottom: "0" },
        qualifiedCount: { top: "445", bottom: "82" },
        unqualifiedCount: { top: "11", bottom: "5" },
        avgAuditDuration: { top: "38.75", bottom: "45.32" },
        auditRatio: { top: "100%", bottom: "100%" },
      },
      {
        id: "03",
        stationName: "济南南收费站",
        discountamount: {top: "<500元", bottom: ">500元"},
        totalInspectionCount: { top: "389", bottom: "124" },
        auditedCount: { top: "389", bottom: "124" },
        unauditedCount: { top: "0", bottom: "0" },
        qualifiedCount: { top: "375", bottom: "118" },
        unqualifiedCount: { top: "14", bottom: "6" },
        avgAuditDuration: { top: "41.28", bottom: "52.14" },
        auditRatio: { top: "100%", bottom: "100%" },
      },
    ],
    showPagination: false,
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
            <TechDataTable config={tableConfig1} className="h-full" />
          </div>

          {/* 下表格：车型查验统计 - 使用分裂行表格 */}
          <div className="h-[50%] min-h-0">
            <SplitRowTable config={tableConfig2} className="h-full" />
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
