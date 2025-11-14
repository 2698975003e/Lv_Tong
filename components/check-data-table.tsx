import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

export interface TableData {
    id: number
    station: string
    totalStations: number
    totalTransmissions: number
    operationalCorrection: {
        operationCorrection: number
        correctionCount: number
        correctionStatistics: number
    }
    basicInfoCorrection: {
        correctionCount: number
        correctionStatistics: number
    }
    communicationInfoStatistics: {
        correctionCount: number
        correctionStatistics: number
    }
    experimentResultCorrection: {
        correctionCount: number
        correctionStatistics: number
    }
    occupancyRate: {
        deletionCount: number
        correctionRatio: number
        deletionRatio: number
        correctionAndDeletionRatio: number
    }
}

interface CheckDataTableProps {
    data?: TableData[]
    loading?: boolean
    queryInfo?: {
        managementOrg?: string
        startTime?: string
        endTime?: string
        currentTime?: string
    }
}

const defaultTableData: TableData[] = [
    {
        id: 0,
        station: "总计",
        totalStations: 5,
        totalTransmissions: 5,
        operationalCorrection: { operationCorrection: 0, correctionCount: 0, correctionStatistics: 0 },
        basicInfoCorrection: { correctionCount: 0, correctionStatistics: 0 },
        communicationInfoStatistics: { correctionCount: 0, correctionStatistics: 0 },
        experimentResultCorrection: { correctionCount: 0, correctionStatistics: 0 },
        occupancyRate: { deletionCount: 0, correctionRatio: 0.0, deletionRatio: 0.0, correctionAndDeletionRatio: 0.0 },
    },
    {
        id: 1,
        station: "胶州",
        totalStations: 5,
        totalTransmissions: 5,
        operationalCorrection: { operationCorrection: 0, correctionCount: 0, correctionStatistics: 0 },
        basicInfoCorrection: { correctionCount: 0, correctionStatistics: 0 },
        communicationInfoStatistics: { correctionCount: 0, correctionStatistics: 0 },
        experimentResultCorrection: { correctionCount: 0, correctionStatistics: 0 },
        occupancyRate: { deletionCount: 0, correctionRatio: 0.0, deletionRatio: 0.0, correctionAndDeletionRatio: 0.0 },
    },
    {
        id: 2,
        station: "胶西",
        totalStations: 0,
        totalTransmissions: 0,
        operationalCorrection: { operationCorrection: 0, correctionCount: 0, correctionStatistics: 0 },
        basicInfoCorrection: { correctionCount: 0, correctionStatistics: 0 },
        communicationInfoStatistics: { correctionCount: 0, correctionStatistics: 0 },
        experimentResultCorrection: { correctionCount: 0, correctionStatistics: 0 },
        occupancyRate: { deletionCount: 0, correctionRatio: 0.0, deletionRatio: 0.0, correctionAndDeletionRatio: 0.0 },
    },
    {
        id: 3,
        station: "九龙",
        totalStations: 0,
        totalTransmissions: 0,
        operationalCorrection: { operationCorrection: 0, correctionCount: 0, correctionStatistics: 0 },
        basicInfoCorrection: { correctionCount: 0, correctionStatistics: 0 },
        communicationInfoStatistics: { correctionCount: 0, correctionStatistics: 0 },
        experimentResultCorrection: { correctionCount: 0, correctionStatistics: 0 },
        occupancyRate: { deletionCount: 0, correctionRatio: 0.0, deletionRatio: 0.0, correctionAndDeletionRatio: 0.0 },
    },
    {
        id: 4,
        station: "王台",
        totalStations: 0,
        totalTransmissions: 0,
        operationalCorrection: { operationCorrection: 0, correctionCount: 0, correctionStatistics: 0 },
        basicInfoCorrection: { correctionCount: 0, correctionStatistics: 0 },
        communicationInfoStatistics: { correctionCount: 0, correctionStatistics: 0 },
        experimentResultCorrection: { correctionCount: 0, correctionStatistics: 0 },
        occupancyRate: { deletionCount: 0, correctionRatio: 0.0, deletionRatio: 0.0, correctionAndDeletionRatio: 0.0 },
    },
    {
        id: 5,
        station: "灵珠山东",
        totalStations: 0,
        totalTransmissions: 0,
        operationalCorrection: { operationCorrection: 0, correctionCount: 0, correctionStatistics: 0 },
        basicInfoCorrection: { correctionCount: 0, correctionStatistics: 0 },
        communicationInfoStatistics: { correctionCount: 0, correctionStatistics: 0 },
        experimentResultCorrection: { correctionCount: 0, correctionStatistics: 0 },
        occupancyRate: { deletionCount: 0, correctionRatio: 0.0, deletionRatio: 0.0, correctionAndDeletionRatio: 0.0 },
    },
    {
        id: 6,
        station: "灵珠山",
        totalStations: 0,
        totalTransmissions: 0,
        operationalCorrection: { operationCorrection: 0, correctionCount: 0, correctionStatistics: 0 },
        basicInfoCorrection: { correctionCount: 0, correctionStatistics: 0 },
        communicationInfoStatistics: { correctionCount: 0, correctionStatistics: 0 },
        experimentResultCorrection: { correctionCount: 0, correctionStatistics: 0 },
        occupancyRate: { deletionCount: 0, correctionRatio: 0.0, deletionRatio: 0.0, correctionAndDeletionRatio: 0.0 },
    },
    {
        id: 7,
        station: "灵山湾",
        totalStations: 0,
        totalTransmissions: 0,
        operationalCorrection: { operationCorrection: 0, correctionCount: 0, correctionStatistics: 0 },
        basicInfoCorrection: { correctionCount: 0, correctionStatistics: 0 },
        communicationInfoStatistics: { correctionCount: 0, correctionStatistics: 0 },
        experimentResultCorrection: { correctionCount: 0, correctionStatistics: 0 },
        occupancyRate: { deletionCount: 0, correctionRatio: 0.0, deletionRatio: 0.0, correctionAndDeletionRatio: 0.0 },
    },
    {
        id: 8,
        station: "隐珠",
        totalStations: 0,
        totalTransmissions: 0,
        operationalCorrection: { operationCorrection: 0, correctionCount: 0, correctionStatistics: 0 },
        basicInfoCorrection: { correctionCount: 0, correctionStatistics: 0 },
        communicationInfoStatistics: { correctionCount: 0, correctionStatistics: 0 },
        experimentResultCorrection: { correctionCount: 0, correctionStatistics: 0 },
        occupancyRate: { deletionCount: 0, correctionRatio: 0.0, deletionRatio: 0.0, correctionAndDeletionRatio: 0.0 },
    },
    {
        id: 9,
        station: "铁山",
        totalStations: 0,
        totalTransmissions: 0,
        operationalCorrection: { operationCorrection: 0, correctionCount: 0, correctionStatistics: 0 },
        basicInfoCorrection: { correctionCount: 0, correctionStatistics: 0 },
        communicationInfoStatistics: { correctionCount: 0, correctionStatistics: 0 },
        experimentResultCorrection: { correctionCount: 0, correctionStatistics: 0 },
        occupancyRate: { deletionCount: 0, correctionRatio: 0.0, deletionRatio: 0.0, correctionAndDeletionRatio: 0.0 },
    },
    {
        id: 10,
        station: "藏马山",
        totalStations: 0,
        totalTransmissions: 0,
        operationalCorrection: { operationCorrection: 0, correctionCount: 0, correctionStatistics: 0 },
        basicInfoCorrection: { correctionCount: 0, correctionStatistics: 0 },
        communicationInfoStatistics: { correctionCount: 0, correctionStatistics: 0 },
        experimentResultCorrection: { correctionCount: 0, correctionStatistics: 0 },
        occupancyRate: { deletionCount: 0, correctionRatio: 0.0, deletionRatio: 0.0, correctionAndDeletionRatio: 0.0 },
    },
]

export function CheckDataTable({ data = defaultTableData, loading = false, queryInfo }: CheckDataTableProps) {
    const displayData = data.length > 0 ? data : defaultTableData
    
    // 添加客户端时间状态，避免 hydration 错误
    const [currentTime, setCurrentTime] = useState<string>("")
    
    // 在客户端设置时间，避免 hydration 错误
    useEffect(() => {
        const time = new Date().toLocaleString('zh-CN', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            hour12: false
        }).replace(/\//g, '-')
        setCurrentTime(time)
    }, [])
    
    return (
        <div className="w-full overflow-x-auto bg-slate-900 p-1">
            {/* Header with metadata */}
            <div className="mb-1 flex flex-wrap items-center gap-8 rounded-lg bg-gradient-to-r from-[#0B1C3B] to-[#0A2A5A] p-1 text-white">
                {/* 管理机构 */}
                <div className="flex items-center gap-0.5">
                    <img src="/assets/Text1.png" width={90}  alt="" />
                    <span  className="inline-flex h-[38px] w-[148px] min-w-[148px] items-center justify-center rounded-sm border border-[#2B75F7] bg-[rgba(6,26,66,0.8)] px-1.5 py-0.5 text-[10px] text-[#BFE1FF] shadow-[inset_0_0_8px_rgba(59,130,246,0.35)]">
                        {queryInfo?.managementOrg || "西海岸分公司"}
                    </span>
                </div>


                {/* 申请修正时间 */}
                <div className="flex items-center gap-0.5 ">
                    <img src="/assets/Text3.png" width={125} height={28} alt="" />
                    <span  className="inline-flex h-[38px] w-[148px] min-w-[148px] items-center justify-center rounded-sm border border-[#2B75F7] bg-[rgba(6,26,66,0.8)] px-1.5 py-0.5 text-[10px] text-[#BFE1FF] shadow-[inset_0_0_8px_rgba(59,130,246,0.35)]">
                        {queryInfo?.startTime && queryInfo?.endTime 
                            ? `${queryInfo.startTime} ~ ${queryInfo.endTime}`
                            : "西海岸分公司"}
                    </span>
                </div>

                {/* 右侧时间标签 */}
                <div className="flex items-center gap-0.5 -ml-3">
                    <span className="inline-flex h-[38px] min-w-[160px] items-center justify-center rounded-sm border border-[#2B75F7] bg-[rgba(6,26,66,0.8)] px-1.5 py-0.5 text-[10px] text-[#BFE1FF] shadow-[inset_0_0_8px_rgba(59,130,246,0.35)]">
                        {queryInfo?.currentTime || currentTime || ""}
                    </span>
                </div>
            </div>

            {/* Main table */}
            <div className="rounded-lg border border-blue-800 shadow-lg overflow-hidden">
                {/* 表格容器 - 设置固定高度和滚动 */}
                <div 
                    className="overflow-auto custom-scrollbar"
                    style={{
                        maxHeight: 'calc(100vh - 280px)', // 根据页面布局调整高度
                        height: '500px', // 固定高度
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
                    <table className="w-full border-collapse text-[10px] leading-tight">
                        {/* Complex header with merged cells */}
                        <thead className="sticky top-0 z-10">
                        {/* First header row */}
                        <tr className="bg-[#091226]">
                            <th
                                rowSpan={3}
                                className="border border-[#003A7A] bg-[#091226] px-1 py-0.5 text-center text-[10px] font-medium text-white"
                            >
                                序号
                            </th>
                            <th
                                rowSpan={3}
                                className="border border-[#003A7A] bg-[#091226] px-1 py-0.5 text-center text-[10px] font-medium text-white"
                            >
                                收费站名
                            </th>
                            <th
                                rowSpan={3}
                                className="border border-[#003A7A] bg-[#091226] px-1 py-0.5 text-center text-[10px] font-medium text-white"
                            >
                                总查验次数
                                <br />
                                （不含
                                <br />
                                删除）
                            </th>
                            <th
                                rowSpan={3}
                                className="border border-[#003A7A] bg-[#091226] px-1 py-0.5 text-center text-[10px] font-medium text-white"
                            >
                                总上传查
                                <br />
                                验车次
                            </th>
                            <th
                                colSpan={10}
                                className="border border-[#003A7A] bg-[#091226] px-2 py-2 text-center text-[12px] font-medium text-white"
                            >
                                查验信息修正、删除量
                            </th>
                            <th
                                colSpan={6}
                                className="border border-[#003A7A] bg-[#091226] px-2 py-2 text-center text-[12px] font-medium text-white"
                            >
                                占总查验量比
                            </th>
                        </tr>
                        {/* Second header row */}
                        <tr className="bg-blue-800">
                            <th
                                colSpan={3}
                                className="border border-[#003A7A] bg-[#091226] px-2 py-1.5 text-center text-[11px] font-semibold text-white"
                            >
                                运营修正
                            </th>
                            <th
                                colSpan={2}
                                className="border border-[#003A7A] bg-[#091226] px-2 py-1.5 text-center text-[11px] font-semibold text-white"
                            >
                                基础信息修正
                            </th>
                            <th
                                colSpan={2}
                                className="border border-[#003A7A] bg-[#091226] px-2 py-1.5 text-center text-[11px] font-semibold text-white"
                            >
                                通行信息统计
                            </th>
                            <th
                                colSpan={2}
                                className="border border-[#003A7A] bg-[#091226] px-2 py-1.5 text-center text-[11px] font-semibold text-white"
                            >
                                查验结果修正
                            </th>
                            <th
                                rowSpan={2}
                                className="border border-[#003A7A] bg-[#091226] px-3 py-3 text-center text-[12px] font-semibold text-white"
                            >
                                删除次数
                            </th>
                            <th
                                rowSpan={2}
                                className="border border-[#003A7A] bg-[#091226] px-3 py-3 text-center text-[12px] font-semibold text-white"
                            >
                                修正占比
                            </th>
                            <th
                                rowSpan={2}
                                className="border border-[#003A7A] bg-[#091226] px-3 py-3 text-center text-[12px] font-semibold text-white"
                            >
                                删除占比
                            </th>
                            <th
                                rowSpan={2}
                                className="border border-[#003A7A] bg-[#091226] px-3 py-3 text-center text-[12px] font-semibold text-white"
                            >
                                修正和删
                                <br />
                                除占比
                            </th>
                        </tr>
                        {/* Third header row */}
                        <tr className="bg-blue-700">
                            <th
                                className="border border-[#003A7A] bg-[#091226] px-2 py-1.5 text-center text-[11px] font-medium text-white"
                            >
                                运单修正
                            </th>
                            <th
                                className="border border-[#003A7A] bg-[#091226] px-2 py-1.5 text-center text-[11px] font-medium text-white"
                            >
                                修正次数
                            </th>
                            <th
                                className="border border-[#003A7A] bg-[#091226] px-2 py-1.5 text-center text-[11px] font-medium text-white"
                            >
                                修正项统计
                            </th>
                            <th
                                className="border border-[#003A7A] bg-[#091226] px-2 py-1.5 text-center text-[11px] font-medium text-white"
                            >
                                修正次数
                            </th>
                            <th
                                className="border border-[#003A7A] bg-[#091226] px-2 py-1.5 text-center text-[11px] font-medium text-white"
                            >
                                修正项统计
                            </th>
                            <th
                                className="border border-[#003A7A] bg-[#091226] px-2 py-1.5 text-center text-[11px] font-medium text-white"
                            >
                                修正次数
                            </th>
                            <th
                                className="border border-[#003A7A] bg-[#091226] px-2 py-1.5 text-center text-[11px] font-medium text-white"
                            >
                                修正项统计
                            </th>
                            <th
                                className="border border-[#003A7A] bg-[#091226] px-2 py-1.5 text-center text-[11px] font-medium text-white"
                            >
                                修正次数
                            </th>
                            <th
                                className="border border-[#003A7A] bg-[#091226] px-2 py-1.5 text-center text-[11px] font-medium text-white"
                            >
                                修正项统计
                            </th>
                        </tr>
                    </thead>

                    {/* Table body */}
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={20} className="border border-[#003A7A] px-4 py-8 text-center text-white">
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                        <span>加载中...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : displayData.length === 0 ? (
                            <tr>
                                <td colSpan={20} className="border border-[#003A7A] px-4 py-8 text-center text-white">
                                    暂无数据
                                </td>
                            </tr>
                        ) : (
                            displayData.map((row, index) => (
                            <tr
                                key={row.id}
                                className={cn(
                                    "hover:bg-blue-700",
                                    index === 0 ? "bg-blue-800 font-semibold" : "",
                                    index % 2 === 1 && index !== 0 ? "bg-blue-900" : "bg-blue-800",
                                )}
                            >
                                <td
                                    className="border border-[#003A7A] px-1 py-0.5 text-center text-[10px] text-white"
                                    style={{ backgroundColor: index === 0 ? "#101F48" : index % 2 === 1 ? "#08152C" : "#101F48" }}
                                >
                                    {row.id === 0 ? "" : row.id}
                                </td>
                                <td
                                    className="border border-[#003A7A] px-1 py-0.5 text-center text-[10px] font-medium text-white"
                                    style={{ backgroundColor: index === 0 ? "#101F48" : index % 2 === 1 ? "#08152C" : "#101F48" }}
                                >
                                    {row.station}
                                </td>
                                <td
                                    className="border border-[#003A7A] px-1 py-0.5 text-center text-[10px] text-white"
                                    style={{ backgroundColor: index === 0 ? "#101F48" : index % 2 === 1 ? "#08152C" : "#101F48" }}
                                >
                                    {row.totalStations}
                                </td>
                                <td
                                    className="border border-[#003A7A] px-1 py-0.5 text-center text-[10px] text-white"
                                    style={{ backgroundColor: index === 0 ? "#101F48" : index % 2 === 1 ? "#08152C" : "#101F48" }}
                                >
                                    {row.totalTransmissions}
                                </td>
                                <td
                                    className="border border-[#003A7A] px-1 py-0.5 text-center text-[10px] text-white"
                                    style={{ backgroundColor: index === 0 ? "#101F48" : index % 2 === 1 ? "#08152C" : "#101F48" }}
                                >
                                    {row.operationalCorrection.operationCorrection}
                                </td>
                                <td
                                    className="border border-[#003A7A] px-1 py-0.5 text-center text-[10px] text-white"
                                    style={{ backgroundColor: index === 0 ? "#101F48" : index % 2 === 1 ? "#08152C" : "#101F48" }}
                                >
                                    {row.operationalCorrection.correctionCount}
                                </td>
                                <td
                                    className="border border-[#003A7A] px-1 py-0.5 text-center text-[10px] text-white"
                                    style={{ backgroundColor: index === 0 ? "#101F48" : index % 2 === 1 ? "#08152C" : "#101F48" }}
                                >
                                    {row.operationalCorrection.correctionStatistics}
                                </td>
                                <td
                                    className="border border-[#003A7A] px-1 py-0.5 text-center text-[10px] text-white"
                                    style={{ backgroundColor: index === 0 ? "#101F48" : index % 2 === 1 ? "#08152C" : "#101F48" }}
                                >
                                    {row.basicInfoCorrection.correctionCount}
                                </td>
                                <td
                                    className="border border-[#003A7A] px-1 py-0.5 text-center text-[10px] text-white"
                                    style={{ backgroundColor: index === 0 ? "#101F48" : index % 2 === 1 ? "#08152C" : "#101F48" }}
                                >
                                    {row.basicInfoCorrection.correctionStatistics}
                                </td>
                                <td
                                    className="border border-[#003A7A] px-1 py-0.5 text-center text-[10px] text-white"
                                    style={{ backgroundColor: index === 0 ? "#101F48" : index % 2 === 1 ? "#08152C" : "#101F48" }}
                                >
                                    {row.communicationInfoStatistics.correctionCount}
                                </td>
                                <td
                                    className="border border-[#003A7A] px-1 py-0.5 text-center text-[10px] text-white"
                                    style={{ backgroundColor: index === 0 ? "#101F48" : index % 2 === 1 ? "#08152C" : "#101F48" }}
                                >
                                    {row.communicationInfoStatistics.correctionStatistics}
                                </td>
                                <td
                                    className="border border-[#003A7A] px-1 py-0.5 text-center text-[10px] text-white"
                                    style={{ backgroundColor: index === 0 ? "#101F48" : index % 2 === 1 ? "#08152C" : "#101F48" }}
                                >
                                    {row.experimentResultCorrection.correctionCount}
                                </td>
                                <td
                                    className="border border-[#003A7A] px-2 py-1 text-center text-xs text-white"
                                    style={{ backgroundColor: index === 0 ? "#101F48" : index % 2 === 1 ? "#08152C" : "#101F48" }}
                                >
                                    {row.experimentResultCorrection.correctionStatistics}
                                </td>
                                <td
                                    className="border border-[#003A7A] px-3 py-2 text-center text-sm text-white"
                                    style={{ backgroundColor: index === 0 ? "#101F48" : index % 2 === 1 ? "#08152C" : "#101F48" }}
                                >
                                    {row.occupancyRate.deletionCount}
                                </td>
                                <td
                                    className="border border-[#003A7A] px-3 py-2 text-center text-sm text-white"
                                    style={{ backgroundColor: index === 0 ? "#101F48" : index % 2 === 1 ? "#08152C" : "#101F48" }}
                                >
                                    {row.occupancyRate.correctionRatio.toFixed(2)}%
                                </td>
                                <td
                                    className="border border-[#003A7A] px-3 py-2 text-center text-sm text-white"
                                    style={{ backgroundColor: index === 0 ? "#101F48" : index % 2 === 1 ? "#08152C" : "#101F48" }}
                                >
                                    {row.occupancyRate.deletionRatio.toFixed(2)}%
                                </td>
                                <td
                                    className="border border-[#003A7A] px-3 py-2 text-center text-sm text-white"
                                    style={{ backgroundColor: index === 0 ? "#101F48" : index % 2 === 1 ? "#08152C" : "#101F48" }}
                                >
                                    {row.occupancyRate.correctionAndDeletionRatio.toFixed(2)}%
                                </td>
                            </tr>
                            ))
                        )}
                    </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
