"use client"

import Image from "next/image"

// 定义传入数据的类型
interface VehicleData {
  statisticsDate: string;
  generatedAt: string;
  totalVehicleCount: number;
  types: {
    rank: number;
    vehicleType: number;
    vehicleTypeName: string;
    count: number;
    percentage: number;
  }[];
}

// 定义vehicleTypes的类型
interface VehicleType {
  id: number;
  name: string;
  value: number;
  percentage: string;
  color: string;
  startPoint: { x: number; y: number };
  endPoint: { x: number; y: number };
  textTransform: { x: number; y: number };
}

// 预定义的颜色数组
const colors = ["#10B981", "#8B5CF6", "#F59E0B", "#EF4444", "#F97316", "#06B6D4"];

// 预定义的布局配置
const layoutConfig = [
  { startPoint: { x: 32, y: 40 }, endPoint: { x: 15, y: 40 }, textTransform: { x: -5, y: 0 } },      // 饼图顶部边缘
  { startPoint: { x: 65, y: 25 }, endPoint: { x: 80, y: 10 }, textTransform: { x: 5, y: -5 } },      // 饼图右上边缘
  { startPoint: { x: 70, y: 40 }, endPoint: { x: 85, y: 40 }, textTransform: { x: 5, y: 0 } },       // 饼图右侧边缘
  { startPoint: { x: 65, y: 60 }, endPoint: { x: 85, y: 80 }, textTransform: { x: 5, y: 5 } },       // 饼图底部边缘
  { startPoint: { x: 50, y: 70 }, endPoint: { x: 30, y: 80 }, textTransform: { x: 0, y: 5 } },       // 饼图左下边缘
  { startPoint: { x: 40, y: 20 }, endPoint: { x: 30, y: 10 }, textTransform: { x: -5, y: -5 } },     // 饼图左侧边缘
];

// 转换函数
function transformVehicleData(data: VehicleData): VehicleType[] {
  return data.types.map((type, index) => {
    const config = layoutConfig[index] || layoutConfig[0]; // 如果超出配置数量，使用第一个配置
    const color = colors[index] || colors[0]; // 如果超出颜色数量，使用第一个颜色
    
    return {
      id: type.vehicleType,
      name: type.vehicleTypeName,
      value: type.count,
      percentage: `${type.percentage.toFixed(1)}%`,
      color: color,
      startPoint: config.startPoint,
      endPoint: config.endPoint,
      textTransform: config.textTransform
    };
  });
}

export function ThreeDDonutChart({ data }: { data?: VehicleData }) {
  
  // 如果传入了data，使用转换函数；否则使用默认数据
  const vehicleTypes = data ? transformVehicleData(data) : [
    {
      id: 1,
      name: "一型车",
      value: 111,
      percentage: "10.5%",
      color: "#10B981",
      startPoint: { x: 32, y: 40 },
      endPoint: { x: 15, y: 40 },
      textTransform: { x: -5, y: 0 }
    },
    {
      id: 2,
      name: "二型车",
      value: 222,
      percentage: "10.5%",
      color: "#8B5CF6",
      startPoint: { x: 65, y: 25 },
      endPoint: { x: 80, y: 10 },
      textTransform: { x: 5, y: -5 }
    },
    {
      id: 3,
      name: "三型车",
      value: 333,
      percentage: "10.5%",
      color: "#F59E0B",
      startPoint: { x: 70, y: 40 },
      endPoint: { x: 85, y: 40 },
      textTransform: { x: 5, y: 0 }
    },
    {
      id: 4,
      name: "四型车",
      value: 444,
      color: "#EF4444",
      startPoint: { x: 65, y: 60 },
      endPoint: { x: 85, y: 80 },
      textTransform: { x: 5, y: 5 }
    },
    {
      id: 5,
      name: "五型车",
      value: 555,
      color: "#F97316",
      startPoint: { x: 50, y: 70 },
      endPoint: { x: 30, y: 80 },
      textTransform: { x: 0, y: 5 }
    },
    {
      id: 6,
      name: "六型车",
      value: 666,
      color: "#10B981",
      startPoint: { x: 40, y: 20 },
      endPoint: { x: 30, y: 10 },
      textTransform: { x: -5, y: -5 }
    },
  ];

  return (
    <div className="relative w-full h-full bg-slate-800 rounded-lg p-0 flex flex-col">
      {/* 头部图片 */}
      <div 
        className="relative w-full h-[36px] flex items-center justify-center"
        style={{
          backgroundImage: "url(/assets/Home_Right_1.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      {/* 图表容器 */}
      <div className="relative mt-10 h-[70%] flex items-start justify-center pt-4">
        {/* 静态饼图图片 */}
        <div className="relative mt-5 w-100 h-[70%]">
          <Image
            src="/assets/TuPian.png"
            alt="3D Donut Chart"
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

            {/* 点 */}
            <div
              className="absolute flex items-center gap-2"
              style={{
                left: `${vehicle.endPoint.x}%`,
                top: `${vehicle.endPoint.y}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: 2
              }}
            >
              {/* 颜色指示器 - 点在前 */}
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: vehicle.color }}
              />
            </div>

            {/* 数值文本 */}
            <div
              className="absolute text-sm font-medium text-center"
              style={{
                left: `${vehicle.endPoint.x + (vehicle.textTransform?.x || 0)}%`,
                top: `${vehicle.endPoint.y + (vehicle.textTransform?.y || 0)}%`,
                transform: 'translate(-50%, -50%)',
                color: vehicle.color,
                zIndex: 2
              }}
            >
              {/* 第一行：型号 */}
              <div className="text-[20px] leading-tight">
                {vehicle.name}
              </div>
              {/* 第二行：数值 */}
              <div className="text-[30px] font-bold leading-tight">
                {vehicle.value}
              </div>
              {/* 第三行：百分比 */}
              <div className="text-[18px] font-medium leading-tight">
                {vehicle.percentage}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 图例 */}
      <div className="flex flex-wrap gap-4 mt-1 justify-center">
        {vehicleTypes.map((vehicle) => (
          <div key={vehicle.id} className="flex items-center gap-2">
            <div
              className="w-3 h-1 rounded"
              style={{ backgroundColor: vehicle.color }}
            />
            <span className="text-xl text-gray-300">
              {vehicle.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}


