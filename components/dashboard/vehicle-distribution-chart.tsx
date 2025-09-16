"use client"

interface ChartData {
  label: string
  value: number
  color: string
  lightColor: string
}

const data: ChartData[] = [
  { label: "一型车", value: 325, color: "#3B82F6", lightColor: "#60A5FA" },
  { label: "二型车", value: 325, color: "#8B5CF6", lightColor: "#A78BFA" },
  { label: "三型车", value: 325, color: "#10B981", lightColor: "#34D399" },
  { label: "四型车", value: 325, color: "#F59E0B", lightColor: "#FBBF24" },
  { label: "五型车", value: 325, color: "#EF4444", lightColor: "#F87171" },
  { label: "六型车", value: 325, color: "#EC4899", lightColor: "#F472B6" },
]

export function ThreeDDonutChart() {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  let currentAngle = 0

  const createPath = (startAngle: number, endAngle: number, innerRadius: number, outerRadius: number) => {
    const start = polarToCartesian(0, 0, outerRadius, endAngle)
    const end = polarToCartesian(0, 0, outerRadius, startAngle)
    const innerStart = polarToCartesian(0, 0, innerRadius, endAngle)
    const innerEnd = polarToCartesian(0, 0, innerRadius, startAngle)

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"

    return [
      "M",
      start.x,
      start.y,
      "A",
      outerRadius,
      outerRadius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
      "L",
      innerEnd.x,
      innerEnd.y,
      "A",
      innerRadius,
      innerRadius,
      0,
      largeArcFlag,
      1,
      innerStart.x,
      innerStart.y,
      "Z",
    ].join(" ")
  }

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    }
  }

  const getTextPosition = (angle: number, radius: number) => {
    const radian = ((angle - 90) * Math.PI) / 180
    return {
      x: radius * Math.cos(radian),
      y: radius * Math.sin(radian),
    }
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800/50 border border-blue-500/30 rounded-lg p-4">
      <style jsx>{`
        .chart-text {
          fill: #ffffff !important;
          color: #ffffff !important;
        }
        svg text {
          fill: #ffffff !important;
          color: #ffffff !important;
        }
      `}</style>
      <div className="relative w-full h-full">
        {/* Main 3D Donut Chart */}
        <svg width="100%" height="100%" viewBox="-250 -200 500 400" className="drop-shadow-2xl">
          <defs>
            {data.map((item, index) => (
              <linearGradient key={index} id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={item.lightColor} />
                <stop offset="100%" stopColor={item.color} />
              </linearGradient>
            ))}
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="10" stdDeviation="8" floodColor="#000000" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Bottom shadow ellipse */}
          <ellipse cx="0" cy="120" rx="140" ry="30" fill="rgba(0,0,0,0.2)" />

          {/* 3D base segments */}
          {data.map((item, index) => {
            const percentage = item.value / total
            const angle = percentage * 360
            const startAngle = currentAngle
            const endAngle = currentAngle + angle
            const midAngle = startAngle + angle / 2

            const path = createPath(startAngle, endAngle, 80, 140)
            const bottomPath = createPath(startAngle, endAngle, 80, 140)

            currentAngle += angle

            return (
              <g key={index}>
                {/* Bottom 3D segment */}
                <path d={bottomPath} fill={item.color} transform="translate(0, 20) scale(1, 0.3)" opacity="0.6" />
                {/* Main segment */}
                <path
                  d={path}
                  fill={`url(#gradient-${index})`}
                  filter="url(#shadow)"
                  className="hover:brightness-110 transition-all duration-300"
                />
              </g>
            )
          })}

          {/* Value labels with dotted lines */}
          {(() => {
            let angle = 0
            return data.map((item, index) => {
              const percentage = item.value / total
              const segmentAngle = percentage * 360
              const midAngle = angle + segmentAngle / 2
              angle += segmentAngle

              const innerPos = getTextPosition(midAngle, 110)
              const outerPos = getTextPosition(midAngle, 180)

              return (
                <g key={`label-${index}`}>
                  {/* Dotted line */}
                  <line
                    x1={innerPos.x}
                    y1={innerPos.y}
                    x2={outerPos.x}
                    y2={outerPos.y}
                    stroke={item.color}
                    strokeWidth="2"
                    strokeDasharray="4,4"
                    opacity="0.8"
                  />
                  {/* Value circle */}
                  <circle cx={outerPos.x} cy={outerPos.y} r="4" fill={item.color} />
                  {/* Value text */}
                  <text
                    x={outerPos.x + (outerPos.x > 0 ? 15 : -15)}
                    y={outerPos.y + 5}
                    fill="#FFFFFF"
                    stroke="#FFFFFF"
                    fontSize="18"
                    fontWeight="bold"
                    textAnchor={outerPos.x > 0 ? "start" : "end"}
                    className="font-mono chart-text"
                    style={{ fill: "#FFFFFF", color: "#FFFFFF" }}
                  >
                    {item.value}
                  </text>
                </g>
              )
            })
          })()}
        </svg>

        {/* Bottom labels - keep inside container */}
        <div className="absolute inset-x-0 bottom-2 flex justify-center gap-6">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: item.color }} />
              <span className="text-white text-xs md:text-sm font-medium whitespace-nowrap">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
