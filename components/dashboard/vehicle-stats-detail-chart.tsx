"use client"

import Image from "next/image"

export function VehicleStatsDetailChart() {
  // 车型数据 - 使用具体的起点和终点坐标
  const vehicleTypes = [
    {
      id: 1,
      name: "1新鲜水果",
      value: "25%",
      color: "#3B82F6", // 浅蓝色
      startPoint: { x: 41, y: 20 },      // 饼图左上边缘
      endPoint: { x: 20, y: 15 },        // 左上角标签位置
      textTransform: { x: -5, y: -5 }
    },
    {
      id: 2,
      name: "2新鲜蔬菜",
      value: "30%",
      color: "#8B5CF6", // 紫色
      startPoint: { x: 62, y: 20 },      // 饼图右上边缘
      endPoint: { x: 80, y: 15 },        // 右上角标签位置
      textTransform: { x: 5, y: -5 }
    },
    {
      id: 3,
      name: "3收割机",
      value: "5%",
      color: "#EF4444", // 红色
      startPoint: { x: 63, y: 40 },      // 饼图右侧边缘
      endPoint: { x: 80, y: 40},        // 右侧标签位置
      textTransform: { x: 5, y: 0 }
    },
    {
      id: 4,
      name: "4蛋奶",
      value: "7%",
      color: "#F59E0B", // 黄色
      startPoint: { x: 61, y: 60 },      // 饼图右下边缘
      endPoint: { x: 80, y: 65 },        // 右下角标签位置
      textTransform: { x: 5, y: 5 }
    },
    {
      id: 5,
      name: "5鲜肉",
      value: "8%",
      color: "#F97316", // 橙色
      startPoint: { x: 50, y: 60 },      // 饼图底部边缘
      endPoint: { x: 50, y: 80 },        // 底部标签位置
      textTransform: { x: 0, y: 10 }
    },
    {
      id: 6,
      name: "6活的畜禽",
      value: "10%",
      color: "#EAB308", // 黄色
      startPoint: { x: 40, y: 60 },      // 饼图左下边缘
      endPoint: { x: 20, y: 65 },        // 左下角标签位置
      textTransform: { x: -5, y: 5 }
    },
    {
      id: 7,
      name: "7新鲜水产",
      value: "15%",
      color: "#10B981", // 绿色
      startPoint: { x: 36, y: 40 },      // 饼图左侧边缘
      endPoint: { x: 20, y: 40 },        // 左侧标签位置
      textTransform: { x: -5, y: 0 }
    },
  ]

  return (
    <div className="relative w-full h-full bg-slate-800 rounded-lg p-0 flex flex-col">

      {/* 头部header */}
      <div 
        className="relative w-full h-[36px] bg-slate-800 rounded-lg p-4 flex flex-col"
        style={{
          backgroundImage: "url(/assets/Home_Right_2.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      {/* 图表容器 */}
      <div className="relative  h-[90%] mt-4 flex items-start justify-center pt-4">
        {/* 静态饼图图片 */}
        <div className="relative w-[80%] h-[60%] mt-6">
          <Image
            src="/assets/TuPian2.png"
            alt="Vehicle Stats Detail Chart"
            fill
            className="object-contain"
          />
        </div>

        {/* 连接线和标签 */}
        {vehicleTypes.map((vehicle) => (
          <div key={vehicle.id}>
            {/* 连接线 */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ zIndex: 1 }}
            >
              <line
                x1={`${vehicle.startPoint.x}%`}
                y1={`${vehicle.startPoint.y}%`}
                x2={`${vehicle.endPoint.x}%`}
                y2={`${vehicle.endPoint.y}%`}
                stroke={vehicle.color}
                strokeWidth="2"
                strokeDasharray="4,4"
              />
            </svg>

            {/* 标签文本 */}
            <div
              className="absolute text-center"
              style={{
                left: `${vehicle.endPoint.x + (vehicle.textTransform?.x || 0)}%`,
                top: `${vehicle.endPoint.y + (vehicle.textTransform?.y || 0)}%`,
                transform: 'translate(-50%, -50%)',
                color: vehicle.color,
                zIndex: 2
              }}
            >
              {/* 第一行：百分比 */}
              <div className="text-[24px] font-bold leading-tight">
                {vehicle.value}
              </div>
              {/* 第二行：名称 */}
              <div className="text-[14px] leading-tight">
                {vehicle.name}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
