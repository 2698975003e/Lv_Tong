"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { ImageBgButton } from "@/components/image-bg-button"

// 表格数据类型
export interface TableRowData {
    id: string
    exStationName: string
    checkTime: string
    vehicleId: string
    vehicleType: string
    freightName: string
    discountAmount: string
    enStationName: string
    inspectionModifyCount: string
    auditStatus: boolean
    originalId?: number // 添加后端返回的真实ID
}

interface InspectionDataTableProps {
    data?: TableRowData[]
    onRowClick?: (rowData: TableRowData) => void
    className?: string
    showPagination?: boolean
    pagination?: {
        currentPage: number
        totalPages: number
        pageSize: number
        total: number
    }
    onPageChange?: (page: number) => void
}

export function InspectionDataTable({ 
    data = [], 
    onRowClick, 
    className = "",
    showPagination = true,
    pagination,
    onPageChange
}: InspectionDataTableProps) {
    // 默认分页配置
    const defaultPagination = {
        currentPage: 1,
        totalPages: 1,
        pageSize: 10,
        total: 0
    }

    const finalPagination = pagination || defaultPagination
    
    const [currentPage, setCurrentPage] = useState(finalPagination.currentPage)
    const [pageInput, setPageInput] = useState("")

    // 默认数据
    const defaultData: TableRowData[] = [
        {
            id: "01",
            exStationName: "隐珠",
            checkTime: "25.06.18 00:00:05",
            vehicleId: "鲁B12345",
            vehicleType: "货一",
            freightName: "双孢蘑菇",
            discountAmount: "60.56元",
            enStationName: "海珠",
            inspectionModifyCount: "0",
            auditStatus: true
        },
        {
            id: "02",
            exStationName: "隐珠",
            checkTime: "25.06.18 00:00:05",
            vehicleId: "鲁B12345",
            vehicleType: "货一",
            freightName: "双孢蘑菇",
            discountAmount: "60.56元",
            enStationName: "海珠",
            inspectionModifyCount: "1",
            auditStatus: true
        },
        {
            id: "03",
            exStationName: "隐珠",
            checkTime: "25.06.18 00:00:05",
            vehicleId: "鲁B12345",
            vehicleType: "货一",
            freightName: "双孢蘑菇",
            discountAmount: "60.56元",
            enStationName: "海珠",
            inspectionModifyCount: "0",
            auditStatus: true
        },
        {
            id: "04",
            exStationName: "隐珠",
            checkTime: "25.06.18 00:00:05",
            vehicleId: "鲁B12345",
            vehicleType: "货一",
            freightName: "双孢蘑菇",
            discountAmount: "60.56元",
            enStationName: "海珠",
            inspectionModifyCount: "0",
            auditStatus: true
        },
        {
            id: "05",
            exStationName: "隐珠",
            checkTime: "25.06.18 00:00:05",
            vehicleId: "鲁B12345",
            vehicleType: "货一",
            freightName: "双孢蘑菇",
            discountAmount: "60.56元",
            enStationName: "海珠",
            inspectionModifyCount: "0",
            auditStatus: true
        },
        {
            id: "06",
            exStationName: "隐珠",
            checkTime: "25.06.18 00:00:05",
            vehicleId: "鲁B12345",
            vehicleType: "货一",
            freightName: "双孢蘑菇",
            discountAmount: "60.56元",
            enStationName: "海珠",
            inspectionModifyCount: "0",
            auditStatus: true
        },
        {
            id: "07",
            exStationName: "隐珠",
            checkTime: "25.06.18 00:00:05",
            vehicleId: "鲁B12345",
            vehicleType: "货一",
            freightName: "双孢蘑菇",
            discountAmount: "60.56元",
            enStationName: "海珠",
            inspectionModifyCount: "0",
            auditStatus: true
        },
        {
            id: "08",
            exStationName: "隐珠",
            checkTime: "25.06.18 00:00:05",
            vehicleId: "鲁B12345",
            vehicleType: "货一",
            freightName: "双孢蘑菇",
            discountAmount: "60.56元",
            enStationName: "海珠",
            inspectionModifyCount: "0",
            auditStatus: true
        },
        {
            id: "09",
            exStationName: "隐珠",
            checkTime: "25.06.18 00:00:05",
            vehicleId: "鲁B12345",
            vehicleType: "货一",
            freightName: "双孢蘑菇",
            discountAmount: "60.56元",
            enStationName: "海珠",
            inspectionModifyCount: "0",
            auditStatus: true
        },
        {
            id: "10",
            exStationName: "隐珠",
            checkTime: "25.06.18 00:00:05",
            vehicleId: "鲁B12345",
            vehicleType: "货一",
            freightName: "双孢蘑菇",
            discountAmount: "60.56元",
            enStationName: "海珠",
            inspectionModifyCount: "0",
            auditStatus: true
        }
    ]

    const tableData = data.length > 0 ? data : defaultData
    const totalPages = finalPagination.totalPages || Math.ceil(tableData.length / finalPagination.pageSize)

    // 处理行点击事件
    const handleRowClick = (rowData: TableRowData) => {
        console.log("点击的行数据:", rowData)
        onRowClick?.(rowData)
    }

    // 处理分页变化
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            setCurrentPage(page)
            onPageChange?.(page)
        }
    }

    // 处理页码跳转
    const handlePageJump = () => {
        const page = parseInt(pageInput)
        if (page && page >= 1 && page <= totalPages) {
            handlePageChange(page)
            setPageInput("")
        }
    }

    return (
        <div className={`h-full flex flex-col ${className}`}>

            
            {/* 表格内容 */}
            <div className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto">
                    {/* 表头 - 使用自定义列宽 */}
                    <div className="grid grid-cols-[60px_100px_180px_120px_80px_120px_100px_100px_80px_60px] gap-2 bg-slate-700/50 p-2 rounded-t-md text-sm font-medium text-slate-200 mb-1">
                        <div className="text-center">序号</div>
                        <div className="text-center">出口收费站</div>
                        <div className="text-center">查验时间</div>
                        <div className="text-center">车牌号</div>
                        <div className="text-center">车型</div>
                        <div className="text-center">货物名称</div>
                        <div className="text-center">减免金额</div>
                        <div className="text-center">入口收费站</div>
                        <div className="text-center">查验修改</div>
                        <div className="text-center">稽查</div>
                    </div>
                    
                    {/* 表格数据行 - 使用相同的列宽 */}
                    <div className="space-y-1">
                        {tableData.map((row, index) => (
                            <div
                                key={row.id}
                                className={`grid grid-cols-[60px_100px_180px_120px_80px_120px_100px_100px_80px_60px] gap-2 p-2 text-sm rounded-md cursor-pointer transition-colors hover:bg-slate-600/50 ${
                                    index % 2 === 0 ? "bg-slate-800/30" : "bg-slate-800/60"
                                }`}
                                onClick={() => handleRowClick(row)}
                            >
                                <div className="text-center text-slate-300">{row.id}</div>
                                <div className="text-center text-slate-300">{row.exStationName}</div>
                                <div className="text-center text-slate-300">{row.checkTime}</div>
                                <div className="text-center text-slate-300">{row.vehicleId}</div>
                                <div className="text-center text-slate-300">{row.vehicleType}</div>
                                <div className="text-center text-slate-300">{row.freightName}</div>
                                <div className="text-center text-slate-300">{row.discountAmount}</div>
                                <div className="text-center text-slate-300">{row.enStationName}</div>
                                <div className="text-center text-slate-300">{row.inspectionModifyCount}</div>
                                <div className="text-center">
                                    {row.auditStatus ? (
                                        <div className="inline-flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full">
                                            <span className="text-white text-xs">✓</span>
                                        </div>
                                    ) : (
                                        <span className="text-slate-400">-</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 分页器 */}
            {showPagination && (
                <div className="bg-slate-800/80 border-t border-slate-700/50 px-4 py-3">
                    <div className="flex items-center justify-center space-x-3">
                        <ImageBgButton
                            bgSrc="/assets/shortBtn.png"
                            text="首页"
                            width="88px"
                            height="44px"
                            stretch="cover"
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(1)}
                        />
                        <ImageBgButton
                            bgSrc="/assets/longBtn.png"
                            text="上一页"
                            width="107px"
                            height="44px"
                            stretch="cover"
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                        />

                        <ImageBgButton
                            bgSrc="/assets/longBtn.png"
                            text={`${currentPage}/${totalPages}`}
                            width="107px"
                            height="44px"
                            stretch="cover"
                            disabled
                        />

                        <ImageBgButton
                            bgSrc="/assets/longBtn.png"
                            text="下一页"
                            width="107px"
                            height="44px"
                            stretch="cover"
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                        />
                        <ImageBgButton
                            bgSrc="/assets/shortBtn.png"
                            text="尾页"
                            width="88px"
                            height="44px"
                            stretch="cover"
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(totalPages)}
                        />

                        {/* Jump to page input */}
                        <div className="flex items-center ml-4">
                            <div className="flex border-2 border-cyan-400/80 rounded-full shadow-lg shadow-cyan-400/20 overflow-hidden">
                                <Input
                                    placeholder="请输入页码"
                                    value={pageInput}
                                    onChange={(e) => setPageInput(e.target.value)}
                                    className="w-32 h-11 bg-slate-900/80 border-0 text-cyan-300 placeholder:text-cyan-500/60 focus:ring-0 focus:outline-none rounded-none text-sm px-4"
                                />
                                <ImageBgButton
                                    bgSrc="/assets/shortBtn.png"
                                    text="跳转"
                                    width="88px"
                                    height="44px"
                                    stretch="cover"
                                    onClick={handlePageJump}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}