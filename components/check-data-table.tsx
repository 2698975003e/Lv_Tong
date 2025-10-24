import { cn } from "@/lib/utils"

interface TableData {
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

const tableData: TableData[] = [
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

export function CheckDataTable() {
    return (
        <div className="w-full overflow-x-auto bg-slate-900 p-1">
            {/* Header with metadata */}
            <div className="mb-1 flex flex-wrap items-center gap-8 rounded-lg bg-gradient-to-r from-[#0B1C3B] to-[#0A2A5A] p-1 text-white">
                {/* 管理机构 */}
                <div className="flex items-center gap-0.5">
                    <img src="/assets/Text1.png" width={90}  alt="" />
                    <span  className="inline-flex h-[38px] w-[148px] min-w-[148px] items-center justify-center rounded-sm border border-[#2B75F7] bg-[rgba(6,26,66,0.8)] px-1.5 py-0.5 text-[10px] text-[#BFE1FF] shadow-[inset_0_0_8px_rgba(59,130,246,0.35)]">
                        西海岸分公司
                    </span>
                </div>

                {/* 查询起始时间 */}
                <div className="flex items-center gap-0.5">
                    <img src="/assets/Text2.png" width={125} alt="" />
                    <span  className="inline-flex h-[38px] w-[148px] min-w-[148px] items-center justify-center rounded-sm border border-[#2B75F7] bg-[rgba(6,26,66,0.8)] px-1.5 py-0.5 text-[10px] text-[#BFE1FF] shadow-[inset_0_0_8px_rgba(59,130,246,0.35)]">
                        西海岸分公司
                    </span>
                </div>

                {/* 申请修正时间 */}
                <div className="flex items-center gap-0.5">
                    <img src="/assets/Text3.png" width={125} height={28} alt="" />
                    <span  className="inline-flex h-[38px] w-[148px] min-w-[148px] items-center justify-center rounded-sm border border-[#2B75F7] bg-[rgba(6,26,66,0.8)] px-1.5 py-0.5 text-[10px] text-[#BFE1FF] shadow-[inset_0_0_8px_rgba(59,130,246,0.35)]">
                        西海岸分公司
                    </span>
                </div>

                {/* 右侧时间标签 */}
                <div className="flex items-center gap-1.5">
                    <span className="inline-flex h-[38px] min-w-[160px] items-center justify-center rounded-sm border border-[#2B75F7] bg-[rgba(6,26,66,0.8)] px-1.5 py-0.5 text-[10px] text-[#BFE1FF] shadow-[inset_0_0_8px_rgba(59,130,246,0.35)]">
                        2025-07-29 10:07:34
                    </span>
                </div>
            </div>

            {/* Main table */}
            <div className="overflow-hidden rounded-lg border border-blue-800 shadow-lg">
                <table className="w-full border-collapse text-[10px] leading-tight">
                    {/* Complex header with merged cells */}
                    <thead>
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
                                总查询车
                                <br />
                                次数（不含
                                <br />
                                删除）
                            </th>
                            <th
                                rowSpan={3}
                                className="border border-[#003A7A] bg-[#091226] px-1 py-0.5 text-center text-[10px] font-medium text-white"
                            >
                                总上传查
                                <br />
                                询车次
                            </th>
                            <th
                                colSpan={3}
                                className="border border-[#003A7A] bg-[#091226] px-1 py-0.5 text-center text-[10px] font-medium text-white"
                            >
                                总修正量
                            </th>
                            <th
                                colSpan={2}
                                className="border border-[#003A7A] bg-[#091226] px-1 py-0.5 text-center text-[10px] font-medium text-white"
                            >
                                基础信息修正
                            </th>
                            <th
                                colSpan={2}
                                className="border border-[#003A7A] bg-[#091226] px-1 py-0.5 text-center text-[10px] font-medium text-white"
                            >
                                通行信息统计
                            </th>
                            <th
                                colSpan={2}
                                className="border border-[#003A7A] bg-[#091226] px-1 py-0.5 text-center text-[10px] font-medium text-white"
                            >
                                查验结果修正
                            </th>
                            <th
                                colSpan={4}
                                className="border border-[#003A7A] bg-[#091226] px-1 py-0.5 text-center text-[10px] font-medium text-white"
                            >
                                占总查验量比
                            </th>
                        </tr>
                        {/* Second header row */}
                        <tr className="bg-blue-800">
                            <th
                                rowSpan={2}
                                className="border border-[#003A7A] bg-[#091226] px-1 py-0.5 text-center text-[10px] font-medium text-white"
                            >
                                运营修正
                            </th>
                            <th
                                colSpan={2}
                                className="border border-[#003A7A] bg-[#091226] px-1 py-0.5 text-center text-[10px] font-medium text-white"
                            >
                                查验信息修正，删除单
                            </th>
                            <th
                                rowSpan={2}
                                className="border border-[#003A7A] bg-[#091226] px-1 py-0.5 text-center text-[10px] font-medium text-white"
                            >
                                修正次数
                            </th>
                            <th
                                rowSpan={2}
                                className="border border-[#003A7A] bg-[#091226] px-2 py-1 text-center text-[11px] font-medium text-white"
                            >
                                修正项统计
                            </th>
                            <th
                                rowSpan={2}
                                className="border border-[#003A7A] bg-[#091226] px-2 py-1 text-center text-[11px] font-medium text-white"
                            >
                                修正次数
                            </th>
                            <th
                                rowSpan={2}
                                className="border border-[#003A7A] bg-[#091226] px-2 py-1 text-center text-[11px] font-medium text-white"
                            >
                                修正项统计
                            </th>
                            <th
                                rowSpan={2}
                                className="border border-[#003A7A] bg-[#091226] px-3 py-2 text-center text-sm font-medium text-white"
                            >
                                修正次数
                            </th>
                            <th
                                rowSpan={2}
                                className="border border-[#003A7A] bg-[#091226] px-3 py-2 text-center text-sm font-medium text-white"
                            >
                                修正项统计
                            </th>
                            <th
                                rowSpan={2}
                                className="border border-[#003A7A] bg-[#091226] px-3 py-2 text-center text-sm font-medium text-white"
                            >
                                删除次数
                            </th>
                            <th
                                rowSpan={2}
                                className="border border-[#003A7A] bg-[#091226] px-3 py-2 text-center text-sm font-medium text-white"
                            >
                                修正占比
                            </th>
                            <th
                                rowSpan={2}
                                className="border border-[#003A7A] bg-[#091226] px-3 py-2 text-center text-sm font-medium text-white"
                            >
                                删除占比
                            </th>
                            <th
                                rowSpan={2}
                                className="border border-[#003A7A] bg-[#091226] px-3 py-2 text-center text-sm font-medium text-white"
                            >
                                修正和删
                                <br />
                                除占比
                            </th>
                        </tr>
                        {/* Third header row */}
                        <tr className="bg-blue-700">
                            <th
                                className="border border-[#003A7A] bg-[#091226] px-1 py-0.5 text-center text-[10px] font-medium text-white"
                            >
                                修正次数
                            </th>
                            <th
                                className="border border-[#003A7A] bg-[#091226] px-1 py-0.5 text-center text-[10px] font-medium text-white"
                            >
                                修正项统计
                            </th>
                        </tr>
                    </thead>

                    {/* Table body */}
                    <tbody>
                        {tableData.map((row, index) => (
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
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
