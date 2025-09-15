interface ChartData {
  plate: string
  value: number
  percentage: number
}

const chartData: ChartData[] = [
  { plate: "冀L.UFK9O", value: 50, percentage: 100 },
  { plate: "贵A.PG342", value: 43, percentage: 86 },
  { plate: "贵D.W1953", value: 40, percentage: 80 },
  { plate: "鲁F.AEB97", value: 33, percentage: 66 },
  { plate: "浙B.2223E", value: 28, percentage: 56 },
  { plate: "辽E.2133E", value: 24, percentage: 48 },
  { plate: "甘B.2223E", value: 20, percentage: 40 },
  { plate: "鲁M.77632", value: 19, percentage: 38 },
  { plate: "辽E.UFK9O", value: 18, percentage: 36 },
  { plate: "贵D.AEB97", value: 16, percentage: 32 },
]


export function WarningVehiclesTable() {
  return (
    <div className="bg-slate-800/50 border border-blue-500/30 rounded-lg  h-full">
      <div
        className="relative w-full h-[33px]"
        style={{
          backgroundImage: "url(/assets/Chart2_Header.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* 表格数据展示部分 */}
      {/* Chart Data */}
      <div className="p-4 md:p-6 bg-gray-900">
        <div className="space-y-2">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center gap-1 text-sm md:text-base">
              {/* 左侧：车牌名 */}
              <div className="w-10 md:w-24 truncate text-slate-200">{item.plate}</div>

              {/* 中间：单一柱形图 */}
              <div className="flex-1 relative h-4 md:h-5 bg-gray-800/50 rounded-sm overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full rounded-sm bg-gradient-to-r from-amber-400 via-amber-500 to-orange-600 transition-all duration-500"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>

              {/* 右侧：数字 */}
              <div className="w-10 md:w-12 text-right text-slate-200 font-medium">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
