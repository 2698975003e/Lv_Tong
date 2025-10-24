"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { VehicleTypeSelect } from "@/components/vehicle-type-select"
import { useState } from "react"


export default function JiHeBiaoGePage() {

    const [vehicleType, setVehicleType] = useState("")

    return (
        <div className="h-[calc(100vh-100px)] bg-slate-900 p-4 flex flex-col">
            {/* 主标题 */}
            <div className="mb-4">
                <h1 className="text-2xl font-bold text-white">收费站翻查核:灵珠山东</h1>
            </div>

            {/* 主要内容区域 - 三列布局 */}
            <div className="flex-1 grid grid-cols-[2fr_1fr_2fr] gap-4 min-h-0">

                {/* 第一列 - 表格和图片容器 */}
                <div className="flex flex-col gap-4 min-h-0">

                    {/* 上方：表格容器 */}
                    <div className="h-[60%] bg-slate-800/50 border border-blue-500/30 rounded-lg p-4 min-h-0">
                        <div className="h-full flex items-center justify-center">
                            <span className="text-slate-300">表格容器</span>
                        </div>
                    </div>

                    {/* 下方：两列图片容器 */}
                    <div className="h-[40%] grid grid-cols-2 gap-4 min-h-0">
                        {/* 左侧：车身侧面图像 */}
                        <div className="bg-slate-800/50 border border-blue-500/30 rounded-lg p-4 min-h-0">
                            <div className="h-full flex items-center justify-center">
                                <span className="text-slate-300">车身侧面图像</span>
                            </div>
                        </div>

                        {/* 右侧：X射线图像 */}
                        <div className="bg-slate-800/50 border border-blue-500/30 rounded-lg p-4 min-h-0">
                            <div className="h-full flex items-center justify-center">
                                <span className="text-slate-300">X射线图像</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 第二列 - 6个竖向排列的图片容器 */}
                <div className="flex flex-col gap-2 min-h-0">
                    {Array.from({ length: 6 }, (_, i) => (
                        <div key={i} className="flex-1 bg-slate-800/50 border border-blue-500/30 rounded-lg p-4 min-h-0">
                            <div className="h-full flex items-center justify-center">
                                <span className="text-slate-300">图片容器 {i + 1}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 第三列 - 稽查信息容器 */}
                <div className="bg-slate-800/50 border border-blue-500/30 rounded-lg p-4 min-h-0">
                    <div className="h-full flex items-center justify-center">
                        <span className="text-slate-300">稽查信息容器</span>
                        <VehicleTypeSelect
                            value={vehicleType}
                            onChange={setVehicleType}
                            className="mb-4"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
