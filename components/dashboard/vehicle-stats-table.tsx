interface ChartData {
  leftValue: number
  leftLocation: string
  rightLocation: string
  rightValue: number
  leftPercentage: number
  rightPercentage: number
}

// const chartData: ChartData[] = [
//   { leftValue: 12000, leftLocation: "鲁",  rightLocation: "鲁C", rightValue: 1200, leftPercentage: 100, rightPercentage: 80 },
//   { leftValue: 11500, leftLocation: "辽",  rightLocation: "辽A", rightValue: 1200, leftPercentage: 96,  rightPercentage: 70 },
//   { leftValue: 11000, leftLocation: "浙",  rightLocation: "浙E", rightValue: 1200, leftPercentage: 92,  rightPercentage: 65 },
//   { leftValue: 9500,  leftLocation: "湘",  rightLocation: "湘Q", rightValue: 1200, leftPercentage: 79,  rightPercentage: 60 },
//   { leftValue: 8300,  leftLocation: "粤",  rightLocation: "粤Y", rightValue: 1200, leftPercentage: 69,  rightPercentage: 55 },
//   { leftValue: 8000,  leftLocation: "甘",  rightLocation: "甘J", rightValue: 1200, leftPercentage: 67,  rightPercentage: 52 },
//   { leftValue: 7100,  leftLocation: "豫",  rightLocation: "豫D", rightValue: 1200, leftPercentage: 59,  rightPercentage: 48 },
//   { leftValue: 6500,  leftLocation: "京",  rightLocation: "京S", rightValue: 1200, leftPercentage: 54,  rightPercentage: 45 },
//   { leftValue: 5000,  leftLocation: "津",  rightLocation: "津B", rightValue: 1200, leftPercentage: 42,  rightPercentage: 35 },
//   { leftValue: 4000,  leftLocation: "皖",  rightLocation: "皖K", rightValue: 1200, leftPercentage: 33,  rightPercentage: 28 },
// ]


// 转换函数：将API数据转换为ChartData格式
function transformApiDataToChartData(apiData: {
  provinceTop10: Array<{
    provinceName: string
    ranking: number
    vehicleCount: number
    percentage: number
  }>
  shandongCitiesTop10: Array<{
    ranking: number
    platePrefix: string
    vehicleCount: number
    percentage: number
  }>
}): ChartData[] {
  const provinces = apiData.provinceTop10 || []
  const cities = apiData.shandongCitiesTop10 || []

  // 取两个数组中较短的长度，确保数据一一对应
  const minLength = Math.min(provinces.length, cities.length)

  return Array.from({ length: minLength }, (_, index) => {
    const province = provinces[index]
    const city = cities[index]

    return {
      leftValue: province.vehicleCount,
      leftLocation: province.provinceName,  // 直接使用省份名称
      rightLocation: city.platePrefix,
      rightValue: city.vehicleCount,
      leftPercentage: Math.round(province.percentage),
      rightPercentage: Math.round(city.percentage)
    }
  })
}

const testTransformData = {
  "code": 200,
  "message": "查询成功",
  "data": {
    "statisticsMonth": "2024-11",
    "totalVehicleCount": 5195,
    "provinceTop10": [
      {
        "provinceName": "山东省",
        "ranking": 1,
        "vehicleCount": 1899,
        "percentage": 100
      },
      {
        "provinceName": "新疆维吾尔自治区",
        "ranking": 2,
        "vehicleCount": 131,
        "percentage": 6.9
      },
      {
        "provinceName": "西藏自治区",
        "ranking": 3,
        "vehicleCount": 129,
        "percentage": 6.79
      },
      {
        "provinceName": "内蒙古自治区",
        "ranking": 4,
        "vehicleCount": 129,
        "percentage": 6.79
      },
      {
        "provinceName": "重庆市",
        "ranking": 5,
        "vehicleCount": 122,
        "percentage": 6.42
      },
      {
        "provinceName": "河南省",
        "ranking": 6,
        "vehicleCount": 122,
        "percentage": 6.42
      },
      {
        "provinceName": "广东省",
        "ranking": 7,
        "vehicleCount": 121,
        "percentage": 6.37
      },
      {
        "provinceName": "吉林省",
        "ranking": 8,
        "vehicleCount": 121,
        "percentage": 6.37
      },
      {
        "provinceName": "辽宁省",
        "ranking": 9,
        "vehicleCount": 120,
        "percentage": 6.32
      },
      {
        "provinceName": "湖南省",
        "ranking": 10,
        "vehicleCount": 120,
        "percentage": 6.32
      }
    ],
    "shandongCitiesTop10": [
      {
        "ranking": 1,
        "platePrefix": "鲁B",
        "vehicleCount": 190,
        "percentage": 100
      },
      {
        "ranking": 2,
        "platePrefix": "鲁G",
        "vehicleCount": 169,
        "percentage": 88.95
      },
      {
        "ranking": 3,
        "platePrefix": "鲁Q",
        "vehicleCount": 93,
        "percentage": 48.95
      },
      {
        "ranking": 4,
        "platePrefix": "鲁C",
        "vehicleCount": 93,
        "percentage": 48.95
      },
      {
        "ranking": 5,
        "platePrefix": "鲁P",
        "vehicleCount": 91,
        "percentage": 47.89
      },
      {
        "ranking": 6,
        "platePrefix": "鲁F",
        "vehicleCount": 90,
        "percentage": 47.37
      },
      {
        "ranking": 7,
        "platePrefix": "鲁J",
        "vehicleCount": 90,
        "percentage": 47.37
      },
      {
        "ranking": 8,
        "platePrefix": "鲁K",
        "vehicleCount": 89,
        "percentage": 46.84
      },
      {
        "ranking": 9,
        "platePrefix": "鲁S",
        "vehicleCount": 84,
        "percentage": 44.21
      },
      {
        "ranking": 10,
        "platePrefix": "鲁M",
        "vehicleCount": 81,
        "percentage": 42.63
      }
    ]
  },
  "timestamp": 1760663897847
}

interface VehicleStatsTableProps {
  apiData: {
    provinceTop10: Array<{
      provinceName: string
      ranking: number
      vehicleCount: number
      percentage: number
    }>
    shandongCitiesTop10: Array<{
      ranking: number
      platePrefix: string
      vehicleCount: number
      percentage: number
    }>
  }
}

export function VehicleStatsTable({ apiData }: VehicleStatsTableProps) {
  // 使用转换函数处理传入的API数据
  const chartData = transformApiDataToChartData(apiData)

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
