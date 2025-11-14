'use client'

import * as React from "react"
import { CheckDataTable, TableData } from "@/components/check-data-table";
import { ImageBgButton } from "@/components/image-bg-button"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { apiFetch } from "@/lib/api"

// 后端API返回的数据类型
interface ApiStationStat {
    stationId: string
    stationName: string
    totalInspectionCount: number
    totalUploadCount: number
    totalModifyCount: number
    totalModifyItems: number
    basicInfo: {
        modifyCount: number
        modifyItems: number
    }
    transitInfo: {
        modifyCount: number
        modifyItems: number
    }
    checkResult: {
        modifyCount: number
        modifyItems: number
    }
    deleteCount: number
    modifyRatio: number
    deleteRatio: number
    modifyDeleteRatio: number
}

interface ApiResponse {
    code: number
    message: string
    data: {
        queryCondition: {
            stationIds: string[]
            startTime: string
            endTime: string
            timeType: string
        }
        stationStats: ApiStationStat[]
    }
    timestamp: number
}


// 定义按钮数据类型
interface ButtonData {
  text: string;
  onClick: () => void;
}

// 定义按钮行组件的props
interface ButtonRowProps {
  buttons: ButtonData[];
  bgSrc?: string;
  width?: string;
  height?: string;
  fontSize?: number;
  textClassName?: string;
  stretch?: "cover" | "contain" | "fill";
  className?: string;
}

// 按钮行组件
function ButtonRow({ 
  buttons, 
  bgSrc = "/assets/headerButton_Unchecked.png",
  width = "80px",
  height = "40px",
  fontSize = 18,
  textClassName = "text-[#00A3FF]",
  stretch = "cover",
  className = ""
}: ButtonRowProps) {
  return (
    <div className={`rounded p-2  flex gap-2 justify-end ${className}`}>
      {buttons.map((button, index) => (
        <ImageBgButton
          key={index}
          bgSrc={bgSrc}
          text={button.text}
          width={width}
          height={height}
          fontSize={fontSize}
          textClassName={textClassName}
          stretch={stretch}
          onClick={button.onClick}
        />
      ))}
    </div>
  );
}

// 日期选择器组件
function DatePicker({
    value,
    onChange,
    placeholder = "选择日期",
}: {
    value?: Date
    onChange: (d?: Date) => void
    placeholder?: string
}) {
    const [open, setOpen] = React.useState(false)
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="flex-1 h-[40px] justify-between bg-transparent border-0 text-[#BFE1FF] hover:bg-sky-500/10"
                    style={{
                        border: "1px solid #2B75F7",
                        background: "rgba(6,26,66,0.6)",
                        boxShadow: "inset 0 0 10px rgba(59,130,246,0.25)",
                        borderRadius: 6,
                    }}
                >
                    <span className={value ? "text-[#BFE1FF]" : "opacity-70 text-sm"}>
                        {value ? value.toLocaleDateString() : placeholder}
                    </span>
                    <ChevronDownIcon className="ml-2 text-cyan-300 opacity-80" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-50" align="start" sideOffset={6}>
                <Calendar
                    className="[--cell-size:2.4rem] min-w-[320px]"
                    mode="single"
                    selected={value}
                    captionLayout="dropdown"
                    onSelect={(d) => {
                        onChange(d)
                        setOpen(false)
                    }}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}

// 数据转换函数：将后端数据转换为表格数据格式
function convertApiDataToTableData(apiData: ApiStationStat[]): TableData[] {
    if (!apiData || apiData.length === 0) {
        return []
    }

    // 计算总计行
    const total = apiData.reduce((acc, stat) => ({
        totalInspectionCount: acc.totalInspectionCount + stat.totalInspectionCount,
        totalUploadCount: acc.totalUploadCount + stat.totalUploadCount,
        totalModifyCount: acc.totalModifyCount + stat.totalModifyCount,
        totalModifyItems: acc.totalModifyItems + stat.totalModifyItems,
        basicInfoModifyCount: acc.basicInfoModifyCount + stat.basicInfo.modifyCount,
        basicInfoModifyItems: acc.basicInfoModifyItems + stat.basicInfo.modifyItems,
        transitInfoModifyCount: acc.transitInfoModifyCount + stat.transitInfo.modifyCount,
        transitInfoModifyItems: acc.transitInfoModifyItems + stat.transitInfo.modifyItems,
        checkResultModifyCount: acc.checkResultModifyCount + stat.checkResult.modifyCount,
        checkResultModifyItems: acc.checkResultModifyItems + stat.checkResult.modifyItems,
        deleteCount: acc.deleteCount + stat.deleteCount,
    }), {
        totalInspectionCount: 0,
        totalUploadCount: 0,
        totalModifyCount: 0,
        totalModifyItems: 0,
        basicInfoModifyCount: 0,
        basicInfoModifyItems: 0,
        transitInfoModifyCount: 0,
        transitInfoModifyItems: 0,
        checkResultModifyCount: 0,
        checkResultModifyItems: 0,
        deleteCount: 0,
    })

    // 计算总计的占比
    const totalModifyRatio = total.totalInspectionCount > 0 
        ? (total.totalModifyCount / total.totalInspectionCount) * 100 
        : 0
    const totalDeleteRatio = total.totalInspectionCount > 0 
        ? (total.deleteCount / total.totalInspectionCount) * 100 
        : 0
    const totalModifyDeleteRatio = total.totalInspectionCount > 0 
        ? ((total.totalModifyCount + total.deleteCount) / total.totalInspectionCount) * 100 
        : 0

    // 创建总计行
    const totalRow: TableData = {
        id: 0,
        station: "总计",
        totalStations: total.totalInspectionCount,
        totalTransmissions: total.totalUploadCount,
        operationalCorrection: {
            operationCorrection: total.totalModifyCount, // 运单修正 = 总修正量
            correctionCount: total.totalModifyCount,
            correctionStatistics: total.totalModifyItems,
        },
        basicInfoCorrection: {
            correctionCount: total.basicInfoModifyCount,
            correctionStatistics: total.basicInfoModifyItems,
        },
        communicationInfoStatistics: {
            correctionCount: total.transitInfoModifyCount,
            correctionStatistics: total.transitInfoModifyItems,
        },
        experimentResultCorrection: {
            correctionCount: total.checkResultModifyCount,
            correctionStatistics: total.checkResultModifyItems,
        },
        occupancyRate: {
            deletionCount: total.deleteCount,
            correctionRatio: totalModifyRatio,
            deletionRatio: totalDeleteRatio,
            correctionAndDeletionRatio: totalModifyDeleteRatio,
        },
    }

    // 转换各个站点数据
    const stationRows: TableData[] = apiData.map((stat, index) => ({
        id: index + 1,
        station: stat.stationName,
        totalStations: stat.totalInspectionCount,
        totalTransmissions: stat.totalUploadCount,
        operationalCorrection: {
            operationCorrection: stat.totalModifyCount, // 运单修正 = 总修正量
            correctionCount: stat.totalModifyCount,
            correctionStatistics: stat.totalModifyItems,
        },
        basicInfoCorrection: {
            correctionCount: stat.basicInfo.modifyCount,
            correctionStatistics: stat.basicInfo.modifyItems,
        },
        communicationInfoStatistics: {
            correctionCount: stat.transitInfo.modifyCount,
            correctionStatistics: stat.transitInfo.modifyItems,
        },
        experimentResultCorrection: {
            correctionCount: stat.checkResult.modifyCount,
            correctionStatistics: stat.checkResult.modifyItems,
        },
        occupancyRate: {
            deletionCount: stat.deleteCount,
            correctionRatio: stat.modifyRatio,
            deletionRatio: stat.deleteRatio,
            correctionAndDeletionRatio: stat.modifyDeleteRatio,
        },
    }))

    return [totalRow, ...stationRows]
}

export default function CheckPage() {
    // 时间选择状态 - 设置默认值
    const [startDate, setStartDate] = React.useState<Date | undefined>(() => {
        // 默认起始时间：2025-10-01
        return new Date('2025-10-01')
    })
    const [endDate, setEndDate] = React.useState<Date | undefined>(() => {
        // 默认结束时间：2025-11-10
        return new Date('2025-11-10')
    })
    
    // 收费站文本输入状态 - 设置默认值
    const [stationName, setStationName] = React.useState<string>("京津冀分公司")

    // 表格数据状态
    const [tableData, setTableData] = React.useState<TableData[]>([])
    const [loading, setLoading] = React.useState<boolean>(false)
    const [error, setError] = React.useState<string | null>(null)
    const [queryInfo, setQueryInfo] = React.useState<{
        managementOrg?: string
        startTime?: string
        endTime?: string
        currentTime?: string
    }>({})

    // API 调用函数
    const fetchData = async (customStationName?: string, customStartDate?: Date, customEndDate?: Date) => {
        const station = customStationName !== undefined ? customStationName : stationName
        const start = customStartDate || startDate || new Date('2025-10-01')
        const end = customEndDate || endDate || new Date('2025-11-10')

        if (!start || !end) {
            alert("请选择起始时间和结束时间")
            return
        }

        setLoading(true)
        setError(null)

        try {
            // 格式化时间 - 根据API示例，起始和结束时间都使用 23:59:59
            const formatDateTime = (date: Date) => {
                const year = date.getFullYear()
                const month = String(date.getMonth() + 1).padStart(2, '0')
                const day = String(date.getDate()).padStart(2, '0')
                return `${year}-${month}-${day} 23:59:59`
            }

            const startTime = formatDateTime(start)
            const endTime = formatDateTime(end)

            // 构建查询参数
            // 注意：根据示例URL，stationIds 参数传递的是收费站名称（URL编码）
            const params = new URLSearchParams()
            if (station) {
                params.append('stationIds', station)
            }
            params.append('startTime', startTime)
            params.append('endTime', endTime)
            params.append('test', 'scutgreenpass')

            // 调用API
            const response = await apiFetch(`/api/api/approval/audit-stats?${params.toString()}`)
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const result: ApiResponse = await response.json()

            if (result.code !== 200) {
                throw new Error(result.message || '查询失败')
            }

            // 转换数据
            const convertedData = convertApiDataToTableData(result.data.stationStats)
            setTableData(convertedData)

            // 更新查询信息
            const formatDisplayTime = (dateTime: string) => {
                // 将 "2025-10-01 00:00:00" 格式转换为 "2025-10-01" 用于显示
                return dateTime.split(' ')[0]
            }

            setQueryInfo({
                managementOrg: "西海岸分公司", // 可以根据实际需求从API获取
                startTime: formatDisplayTime(startTime),
                endTime: formatDisplayTime(endTime),
                currentTime: new Date().toLocaleString('zh-CN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                }).replace(/\//g, '-')
            })
        } catch (err) {
            console.error('API调用失败:', err)
            setError(err instanceof Error ? err.message : '查询失败，请稍后重试')
            setTableData([])
        } finally {
            setLoading(false)
        }
    }

    // 添加 useEffect 在组件挂载时自动加载数据
    React.useEffect(() => {
        // 使用默认参数加载初始数据
        fetchData("京津冀分公司", new Date('2025-10-01'), new Date('2025-11-10'))
    }, []) // 空依赖数组，只在组件挂载时执行一次

    // 统计按钮点击事件
    const handleStatistics = () => {
        fetchData()
    }

    // 定义四行按钮的数据
    const firstRowButtons: ButtonData[] = [
        { text: "平度", onClick: () => console.log('平度') },
        { text: "青岛", onClick: () => console.log('青岛') },
        { text: "济南", onClick: () => console.log('济南') },
        { text: "烟台", onClick: () => console.log('烟台') },
        { text: "威海", onClick: () => console.log('威海') },
        { text: "潍坊", onClick: () => console.log('潍坊') },
    ];

    const secondRowButtons: ButtonData[] = [
        { text: "淄博", onClick: () => console.log('淄博') },
        { text: "德州", onClick: () => console.log('德州') },
        { text: "聊城", onClick: () => console.log('聊城') },
        { text: "滨州", onClick: () => console.log('滨州') },
        { text: "东营", onClick: () => console.log('东营') },
        { text: "济宁", onClick: () => console.log('济宁') },
        { text: "泰安", onClick: () => console.log('泰安') },
    ];

    const thirdRowButtons: ButtonData[] = [
        { text: "临沂", onClick: () => console.log('临沂') },
        { text: "枣庄", onClick: () => console.log('枣庄') },
        { text: "日照", onClick: () => console.log('日照') },
        { text: "菏泽", onClick: () => console.log('菏泽') },
        { text: "莱芜", onClick: () => console.log('莱芜') },
    ];

    const fourthRowButtons: ButtonData[] = [
        { text: "济南", onClick: () => console.log('济南') },
        { text: "青岛", onClick: () => console.log('青岛') },
        { text: "烟台", onClick: () => console.log('烟台') },
        { text: "威海", onClick: () => console.log('威海') },

    ];

    return (
        <div className="h-[calc(100vh-100px)] bg-slate-900 p-0 flex flex-col">
            {/* 上下两行，高度比例 31:68 */}
            <div className="flex-1 grid grid-rows-[27fr_68fr] gap-4 min-h-0">
                {/* 第一行：两列，宽度比例 1400:460 */}
                <div className="row-start-1 grid grid-cols-[1400fr_460fr] gap-0 min-h-0">
                    <div className="relative bg-slate-800/50 border border-blue-500/30 rounded-lg p-1 overflow-hidden">
                        <div
                            className=" w-full h-[33px]"
                            style={{
                                backgroundImage: "url(/assets/Check_Header1.png)",
                                backgroundSize: "contain",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                            }}
                        />
                        <div className="h-[calc(100%-36px)] relative flex items-center justify-center  p-2 ">
                            <div className="w-full h-full   border border-gray-600/30 rounded grid grid-cols-[2fr_340px_2fr] gap-0 p-0.25">
                                {/* 左列 */}
                                <div className=" rounded p-0.25 grid grid-rows-2 gap-3">
                                    {/* 第一行 */}
                                    <ButtonRow buttons={firstRowButtons} className="pt-2" />
                                    {/* 第二行 */}
                                    <ButtonRow 
                                        buttons={secondRowButtons} 
                                        className="pt-0" 
                                    />
                                </div>
                                {/* 中列 */}
                                <div className="w-full h-[calc(100%-40px)] rounded p-0.25"
                                    style={{
                                        backgroundImage: "url(/assets/Check_1_2.png)",
                                        backgroundSize: "contain",
                                        backgroundPosition: "center",
                                        backgroundRepeat: "no-repeat",
                                    }}
                                >

                                </div>
                                {/* 右列 */}
                                <div className=" rounded p-0.25 grid grid-rows-2 gap-3">
                                    {/* 第一行 */}
                                    <ButtonRow 
                                        buttons={thirdRowButtons} 
                                        className="justify-start pt-2" 
                                    />
                                    {/* 第二行 */}
                                    <ButtonRow 
                                        buttons={fourthRowButtons} 
                                        className="pt-0 justify-start" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative bg-slate-800/50 border border-blue-500/30 rounded-lg p-1 overflow-hidden">
                        {/* 顶部标题条 */}
                        <div className="w-full h-[36px] flex items-center px-3 text-[#BFE1FF] tracking-widest text-sm"
                            style={{
                                backgroundImage: "linear-gradient(to right, rgba(5,20,52,0.9), rgba(5,20,52,0.25))",
                                boxShadow: "inset 0 0 0 1px rgba(59,130,246,0.3), 0 2px 8px rgba(0,0,0,0.25)"
                            }}
                        >
                            <span className="mr-2 text-cyan-400">›</span>
                            查验选择
                        </div>

                        {/* 面板主体 */}
                        <div className="h-[calc(100%-38px)] p-4 grid grid-rows-[auto_auto_auto_1fr_auto] gap-6">
                            {/* 行 1：时段 */}
                            <div className="flex items-center gap-4">
                                <span className="inline-flex h-[40px] min-w-[96px] items-center justify-center px-4 text-[14px] font-semibold text-cyan-200 rounded-sm border border-[#2B75F7] bg-[rgba(12,34,80,0.7)] shadow-[inset_0_0_10px_rgba(59,130,246,0.35)]">
                                    时 段
                                </span>
                                <DatePicker 
                                    value={startDate} 
                                    onChange={setStartDate}
                                    placeholder="请选择起始时间"
                                />
                                <DatePicker 
                                    value={endDate} 
                                    onChange={setEndDate}
                                    placeholder="请选择终点时间"
                                />
                            </div>

                            {/* 行 2：收费站 */}
                            <div className="flex items-center gap-4">
                                <span className="inline-flex h-[40px] min-w-[96px] items-center justify-center px-4 text-[14px] font-semibold text-cyan-200 rounded-sm border border-[#2B75F7] bg-[rgba(12,34,80,0.7)] shadow-[inset_0_0_10px_rgba(59,130,246,0.35)]">
                                    收费站
                                </span>
                                <input
                                    type="text"
                                    value={stationName}
                                    onChange={(e) => setStationName(e.target.value)}
                                    placeholder="请输入收费站名称"
                                    className="flex-1 h-[40px] rounded-sm border border-[#2B75F7] bg-[rgba(6,26,66,0.6)] px-3 text-[#BFE1FF] text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 shadow-[inset_0_0_10px_rgba(59,130,246,0.25)] placeholder:opacity-70"
                                />
                            </div>

                            {/* 底部操作按钮 */}
                            <div className="mt-auto flex items-center justify-center gap-10">
                                <ImageBgButton 
                                    bgSrc="/assets/longBtn.png" 
                                    text="统计" 
                                    width="120px" 
                                    height="48px" 
                                    fontSize={18} 
                                    stretch="cover" 
                                    textClassName="text-white"
                                    onClick={handleStatistics}
                                />
                                <ImageBgButton bgSrc="/assets/longBtn.png" text="导出" width="120px" height="48px" fontSize={18} stretch="cover" textClassName="text-white" />
                            </div>
                            
                            {/* 错误提示 */}
                            {error && (
                                <div className="mt-2 text-center text-red-400 text-sm">
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 第二行：占剩余高度 */}
                <div className="row-start-2 bg-slate-800/50 border border-blue-500/30 rounded-lg p-4">
                   <CheckDataTable data={tableData} loading={loading} queryInfo={queryInfo}></CheckDataTable>
                </div>
            </div>
        </div>
    )
}
