export function VehicleStatsDetailChart() {
  return (
    <div className="bg-slate-800/50 border border-blue-500/30 rounded-lg p-4 h-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-4 h-4 bg-blue-400 rounded"></div>
        <h3 className="text-blue-400 font-medium">当日车辆分比统计</h3>
      </div>
      <div className="flex items-center justify-center h-48">
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-gradient-conic from-cyan-500 via-green-500 via-yellow-500 via-orange-500 to-red-500"></div>
          <div className="absolute inset-6 bg-slate-800 rounded-full"></div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs text-gray-300 mt-4">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-cyan-500 rounded"></div>
          <span>检测合格</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-orange-500 rounded"></div>
          <span>通行次数</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded"></div>
          <span>检测不合格</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-red-500 rounded"></div>
          <span>违规</span>
        </div>
      </div>
    </div>
  )
}
