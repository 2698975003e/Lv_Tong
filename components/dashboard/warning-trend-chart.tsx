"use client"

// const data = [
//   5, 12, 18, 25, 35, 45, 48, 42, 38, 46, 40, 49, 41, 32, 43, 50,
//   8, 15, 22, 28, 35, 42, 38, 45
// ]

// 转换函数：将API数据转换为ChartData格式
function transformApiDataToChartData(apiData: {
  statisticsDate: string
  generatedAt: string
  currentHour: number
  totalInspectionCount: number
  hourlyStats: Array<{
    hour: string
    inspectionCount: number
  }>
}): number[] {
  // 直接从hourlyStats中提取inspectionCount数组
  return apiData.hourlyStats.map(item => item.inspectionCount)
}

// 定义 WarningTrendChartProps 类型
type WarningTrendChartProps = {
  apiData: {
    statisticsDate: string
    generatedAt: string
    currentHour: number
    totalInspectionCount: number
    hourlyStats: Array<{
      hour: string
      inspectionCount: number
    }>
  }
}

export function WarningTrendChart({ apiData }: WarningTrendChartProps) {
  
  const data = transformApiDataToChartData(apiData)
  console.log(data)
  // 画布与内边距
  const W = 900, H = 260
  const pad = { l: 42, r: 12, t: 12, b: 36 }
  const iw = W - pad.l - pad.r
  const ih = H - pad.t - pad.b

  // Y 轴范围（0~600 比较接近截图）
  const yMax = 50
  const yTicks = [0, 10, 20, 30, 40, 50]
  const xTicks = Array.from({ length: 25 }, (_, i) => i)

  const xScale = (i: number) => pad.l + (i / (data.length - 1)) * iw
  const yScale = (v: number) => pad.t + ih - (v / yMax) * ih

  // 折线路径
  const linePath = data
    .map((v, i) => `${i === 0 ? "M" : "L"} ${xScale(i)} ${yScale(v)}`)
    .join(" ")

  // 面积路径
  const areaPath =
    `M ${xScale(0)} ${yScale(data[0])} ` +
    data.map((v, i) => `L ${xScale(i)} ${yScale(v)}`).join(" ") +
    ` L ${xScale(data.length - 1)} ${pad.t + ih} L ${xScale(0)} ${pad.t + ih} Z`

  return (
    <div className="bg-slate-800/50 border border-blue-500/30 rounded-lg h-full">
      <div
        className="relative w-full h-[33px]"
        style={{
          backgroundImage: "url(/assets/Chart3_Header.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div className="p-5">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
          <defs>
            <linearGradient id="lineArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2EC7FF" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#2EC7FF" stopOpacity="0.06" />
            </linearGradient>
            <filter id="dotGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 背景网格线 */}
          {yTicks.map((t, i) => (
            <line
              key={t}
              x1={pad.l}
              x2={pad.l + iw}
              y1={yScale(t)}
              y2={yScale(t)}
              stroke="#1f2a3a"
              strokeWidth="1"
              opacity={i === 0 ? 0.8 : 0.45}
            />
          ))}

          {/* 面积 */}
          <path d={areaPath} fill="url(#lineArea)" />

          {/* 折线 */}
          <path
            d={linePath}
            fill="none"
            stroke="#58C7FF"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* 数据点 */}
          {data.map((v, i) => (
            <g key={i} filter="url(#dotGlow)">
              <circle cx={xScale(i)} cy={yScale(v)} r="4.5" fill="#E6F7FF" />
              <circle cx={xScale(i)} cy={yScale(v)} r="2.5" fill="#2EC7FF" />
            </g>
          ))}

          {/* Y 轴刻度文字（单位：辆） */}
          {yTicks.map((t) => (
            <text
              key={t}
              x={pad.l - 8}
              y={yScale(t) + 4}
              fontSize="12"
              textAnchor="end"
              fill="#9FB6CC"
            >
              {t}
            </text>
          ))}
          <text
            x={pad.l - 24}
            y={pad.t + 10}
            fontSize="12"
            fill="#9FB6CC"
            textAnchor="middle"
          >
            (辆)
          </text>

          {/* X 轴刻度文字 0~24 */}
          {xTicks.map((t) => (
            <text
              key={t}
              x={xScale(t)}
              y={pad.t + ih + 22}
              fontSize="12"
              textAnchor="middle"
              fill="#9FB6CC"
            >
              {t}
            </text>
          ))}
        </svg>
      </div>
    </div>
  )
}