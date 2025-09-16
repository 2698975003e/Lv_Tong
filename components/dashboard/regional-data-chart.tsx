'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

const cityData = [
  { city: "灵宝", liquidAmount: 70, transitCount: 45 },
  { city: "灵武", liquidAmount: 85, transitCount: 60 },
  { city: "寻甸", liquidAmount: 90, transitCount: 75 },
  { city: "甲庄", liquidAmount: 75, transitCount: 50 },
  { city: "隆林", liquidAmount: 65, transitCount: 40 },
  { city: "珠山", liquidAmount: 20, transitCount: 15 },
  { city: "商丘", liquidAmount: 55, transitCount: 35 },
  { city: "明溪", liquidAmount: 80, transitCount: 55 },
  { city: "郸城", liquidAmount: 70, transitCount: 45 },
  { city: "新河", liquidAmount: 75, transitCount: 50 },
  { city: "京山", liquidAmount: 80, transitCount: 60 },
  { city: "明光", liquidAmount: 85, transitCount: 65 },
  { city: "京山", liquidAmount: 90, transitCount: 70 },
  { city: "甲庄", liquidAmount: 85, transitCount: 55 },
  { city: "腾冲", liquidAmount: 70, transitCount: 45 },
  { city: "珠山", liquidAmount: 90, transitCount: 75 },
  { city: "南明", liquidAmount: 85, transitCount: 60 },


]

export function RegionalDataChart() {
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
              <span>减免金额</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: '#F97316' }} />
              <span>通行车次</span>
            </div>
          </div>
          <ResponsiveContainer className="pt-7" width="100%" height="100%">
            <BarChart
              data={cityData}
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
                domain={[0,100]}
                ticks={[0,20,40,60,80,100]}
                label={{
                  value: "(万)",
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
