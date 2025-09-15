interface ChartData {
  leftValue: number
  leftLocation: string
  rightLocation: string
  rightValue: number
  leftPercentage: number
  rightPercentage: number
}

const chartData: ChartData[] = [
  { leftValue: 12000, leftLocation: "鲁",  rightLocation: "鲁C", rightValue: 1200, leftPercentage: 100, rightPercentage: 80 },
  { leftValue: 11500, leftLocation: "辽",  rightLocation: "辽A", rightValue: 1200, leftPercentage: 96,  rightPercentage: 70 },
  { leftValue: 11000, leftLocation: "浙",  rightLocation: "浙E", rightValue: 1200, leftPercentage: 92,  rightPercentage: 65 },
  { leftValue: 9500,  leftLocation: "湘",  rightLocation: "湘Q", rightValue: 1200, leftPercentage: 79,  rightPercentage: 60 },
  { leftValue: 8300,  leftLocation: "粤",  rightLocation: "粤Y", rightValue: 1200, leftPercentage: 69,  rightPercentage: 55 },
  { leftValue: 8000,  leftLocation: "甘",  rightLocation: "甘J", rightValue: 1200, leftPercentage: 67,  rightPercentage: 52 },
  { leftValue: 7100,  leftLocation: "豫",  rightLocation: "豫D", rightValue: 1200, leftPercentage: 59,  rightPercentage: 48 },
  { leftValue: 6500,  leftLocation: "京",  rightLocation: "京S", rightValue: 1200, leftPercentage: 54,  rightPercentage: 45 },
  { leftValue: 5000,  leftLocation: "津",  rightLocation: "津B", rightValue: 1200, leftPercentage: 42,  rightPercentage: 35 },
  { leftValue: 4000,  leftLocation: "皖",  rightLocation: "皖K", rightValue: 1200, leftPercentage: 33,  rightPercentage: 28 },
]


export function VehicleStatsTable() {
  return (
    <div className="bg-slate-800/50 border border-blue-500/30 rounded-lg  h-full">
      <div
        className="relative w-full h-[33px]"
        style={{
          backgroundImage: "url(/assets/Chart1_Header.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* 表格数据展示部分 */}
      {/* Chart Data */}
      <div className="p-4 md:p-6 bg-gray-900">
        <div className="space-y-2 md:space-y-3">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center gap-2 md:gap-3 text-sm md:text-base">
              {/* 左值 */}
              <div className="w-12 md:w-16 text-right text-gray-300 font-medium text-xs md:text-sm">
                {item.leftValue}
              </div>

              {/* 左侧柱（按 leftPercentage） */}
              <div className="flex-1 relative h-4 md:h-5 bg-gray-800/50 rounded-sm overflow-hidden">
                <div
                  className="absolute right-0 top-0 h-full bg-gradient-to-l from-cyan-400 via-cyan-500 to-teal-600 transition-all duration-500 ease-out rounded-sm"
                  style={{ width: `${item.leftPercentage}%` }}
                />
              </div>

              {/* 中间文本：贴近左右分别显示 */}
              <div className="min-w-8 md:min-w-12 text-cyan-400 text-center font-medium">
                {item.leftLocation}
              </div>
              <div className="min-w-12 md:min-w-16 text-blue-400 text-center font-medium">
                {item.rightLocation}
              </div>

              {/* 右侧柱（按 rightPercentage） */}
              <div className="flex-1 relative h-4 md:h-5 bg-gray-800/50 rounded-sm overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 rounded-sm"
                  style={{ width: `${item.rightPercentage}%` }}
                />
              </div>

              {/* 右值 */}
              <div className="w-12 md:w-16 text-left text-gray-300 font-medium text-xs md:text-sm">
                {item.rightValue}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
