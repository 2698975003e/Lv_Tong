'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

// 定义传入数据的类型
interface StationDiscountData {
  statisticsDate: string;
  totalStations: number;
  stationDiscountStats: Array<{
    stationName: string;
    discountAmount: number;
    vehicleCount: number;
  }>;
}

interface RegionalDataApiResponse {
  code: number;
  message: string;
  data: StationDiscountData;
  timestamp: number;
}

// 转换函数：将API数据转换为图表所需的格式
function transformStationData(data: StationDiscountData) {
  return data.stationDiscountStats.map(station => ({
    city: station.stationName,
    liquidAmount: station.discountAmount / 10000, // 转换为万元
    transitCount: station.vehicleCount
  }));
}

export function RegionalDataChart({ apiData }: { apiData?: RegionalDataApiResponse['data'] }) {
  // 如果传入了数据，使用转换后的数据；否则使用默认数据
  const chartData = apiData ? transformStationData(apiData) : [
    { city: "灵宝", liquidAmount: 70, transitCount: 45 },
    { city: "灵武", liquidAmount: 85, transitCount: 60 },
    { city: "寻甸", liquidAmount: 90, transitCount: 75 },
    { city: "甲庄", liquidAmount: 75, transitCount: 50 },
    { city: "隆林", liquidAmount: 65, transitCount: 40 },
    { city: "珠山", liquidAmount: 20, transitCount: 15 },
    { city: "商丘", liquidAmount: 55, transitCount: 35 },
  ];

  // 计算Y轴的最大值，基于数据动态调整
  const maxValue = Math.max(...chartData.map(item => Math.max(item.liquidAmount, item.transitCount)));
  const yAxisMax = Math.ceil(maxValue / 20) * 20; // 向上取整到20的倍数

  return (
    <div className="bg-slate-800/50 border border-blue-500/30 rounded-lg p-4 h-full"
    style={{
      backgroundImage: "url(/assets/Chart4.png)",
      backgroundSize: "cover",
      backgroundPosition: "top center",
      backgroundRepeat: "no-repeat",
    }}>
      {/*表格数据展示部分*/}
      <div className="w-full mt-10 h-[calc(100%-50px)] bg-slate-900 rounded-lg p-4 relative">
          {/* 顶部右侧图例 */}
          <div className="absolute right-4 top-3 flex items-center gap-8 text-gray-300 text-sm">
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: '#06B6D4' }} />
              <span>减免金额(万元)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: '#F97316' }} />
              <span>通行车次</span>
            </div>
          </div>
          <ResponsiveContainer className="pt-7" width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 6,
              }}
              barCategoryGap="10%"
              barSize={28}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="city"
                axisLine={true}
                tickLine={true}
                tick={{ fontSize: 18, fill: "#9CA3AF" }}
                angle={-45}
                textAnchor="end"
                height={35}
              />
              <YAxis
                axisLine={true}
                tickLine={true}
                tick={{ fontSize: 18, fill: "#9CA3AF" }}
                domain={[0, yAxisMax]}
                tickCount={6}
                label={{
                  value: "(万元)",
                  angle: 0,
                  position: "top",
                  offset: 10,
                  style: { textAnchor: "start", fill: "#9CA3AF" },
                }}
              />
              <Bar dataKey="liquidAmount" fill="#06B6D4" radius={[2, 2, 0, 0]} />
              <Bar dataKey="transitCount" fill="#F97316" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
    </div>
  )
}
