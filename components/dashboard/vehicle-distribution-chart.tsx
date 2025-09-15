export function VehicleDistributionChart() {
  return (
    <div className="bg-slate-800/50 border border-blue-500/30 rounded-lg p-4 h-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-4 h-4 bg-blue-400 rounded"></div>
        <h3 className="text-blue-400 font-medium">当日车辆分比</h3>
      </div>
      <div className="flex items-center justify-center h-48">
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-gradient-conic from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500"></div>
          <div className="absolute inset-4 bg-slate-800 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">325</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs text-gray-300 mt-4">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-red-500 rounded"></div>
          <span>一型车</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-yellow-500 rounded"></div>
          <span>二型车</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded"></div>
          <span>三型车</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-blue-500 rounded"></div>
          <span>四型车</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-purple-500 rounded"></div>
          <span>五型车</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-cyan-500 rounded"></div>
          <span>六型车</span>
        </div>
      </div>
    </div>
  )
}
