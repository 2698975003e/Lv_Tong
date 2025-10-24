"use client"

import { TechDataTable } from "@/components/tech-data-table"
import { StatisticsCategory } from "@/components/right_statistics_category"
import { SearchPanel } from "@/components/search-panel"

// API数据类型定义
interface InspectionData {
  id: number
  checkId: string
  exStationName: string
  checkTime: string
  vehicleId: string
  vehicleType: string
  vehicleTypeName: string
  freightName: string
  freightCategory: string
  discountAmount: number
  enStationName: string
  inspectionModifyCount: number
  checkResult: number
  checkResultName: string
}

// 模拟API数据
const mockApiData = {
  "code": 200,
  "message": "查询成功",
  "data": {
    "total": 119,
    "pageNum": 1,
    "pageSize": 20,
    "pages": 6,
    "list": [
      {
        "id": 2165,
        "checkId": "791953762220241101225755_18391582362",
        "exStationName": "出口收费站",
        "checkTime": "2024-11-01 22:57:55",
        "vehicleId": "鲁N4W1XG_5",
        "vehicleType": "12",
        "vehicleTypeName": "普通货车",
        "freightName": "未知货物",
        "freightCategory": "其他",
        "discountAmount": 0,
        "enStationName": "入口收费站",
        "inspectionModifyCount": 0,
        "checkResult": 0,
        "checkResultName": "未知"
      },
      {
        "id": 2163,
        "checkId": "342663156020241101224339_19610100549",
        "exStationName": "出口收费站",
        "checkTime": "2024-11-01 22:43:39",
        "vehicleId": "浙JW3606_8",
        "vehicleType": "18",
        "vehicleTypeName": "普通货车",
        "freightName": "未知货物",
        "freightCategory": "其他",
        "discountAmount": 0,
        "enStationName": "入口收费站",
        "inspectionModifyCount": 0,
        "checkResult": 0,
        "checkResultName": "未知"
      },
      {
        "id": 15,
        "checkId": "562578010320241101224136_19332608808",
        "exStationName": "出口收费站",
        "checkTime": "2024-11-01 22:41:36",
        "vehicleId": "粤D32BES_7",
        "vehicleType": "14",
        "vehicleTypeName": "普通货车",
        "freightName": "未知货物",
        "freightCategory": "其他",
        "discountAmount": 0,
        "enStationName": "入口收费站",
        "inspectionModifyCount": 0,
        "checkResult": 2,
        "checkResultName": "不合格"
      },
      {
        "id": 46,
        "checkId": "307981888220241101223442_17319347517",
        "exStationName": "出口收费站",
        "checkTime": "2024-11-01 22:34:42",
        "vehicleId": "豫F849R1_4",
        "vehicleType": "13",
        "vehicleTypeName": "普通货车",
        "freightName": "未知货物",
        "freightCategory": "其他",
        "discountAmount": 225.45,
        "enStationName": "入口收费站",
        "inspectionModifyCount": 0,
        "checkResult": 1,
        "checkResultName": "合格"
      },
      {
        "id": 10,
        "checkId": "358768801920241101223438_18644873014",
        "exStationName": "出口收费站",
        "checkTime": "2024-11-01 22:34:38",
        "vehicleId": "川J482TG_4",
        "vehicleType": "12",
        "vehicleTypeName": "普通货车",
        "freightName": "未知货物",
        "freightCategory": "其他",
        "discountAmount": 141.85,
        "enStationName": "入口收费站",
        "inspectionModifyCount": 0,
        "checkResult": 1,
        "checkResultName": "合格"
      },
      {
        "id": 37,
        "checkId": "843187257820241101223407_19824249004",
        "exStationName": "出口收费站",
        "checkTime": "2024-11-01 22:34:07",
        "vehicleId": "陕L04270_6",
        "vehicleType": "18",
        "vehicleTypeName": "普通货车",
        "freightName": "未知货物",
        "freightCategory": "其他",
        "discountAmount": 194.58,
        "enStationName": "入口收费站",
        "inspectionModifyCount": 0,
        "checkResult": 1,
        "checkResultName": "合格"
      },
      {
        "id": 19,
        "checkId": "911600205120241101222343_16250972018",
        "exStationName": "出口收费站",
        "checkTime": "2024-11-01 22:23:43",
        "vehicleId": "闽BF5WQ9_5",
        "vehicleType": "11",
        "vehicleTypeName": "普通货车",
        "freightName": "未知货物",
        "freightCategory": "其他",
        "discountAmount": 0,
        "enStationName": "入口收费站",
        "inspectionModifyCount": 0,
        "checkResult": 0,
        "checkResultName": "未知"
      },
      {
        "id": 2158,
        "checkId": "935676216520241101221539_19775093896",
        "exStationName": "出口收费站",
        "checkTime": "2024-11-01 22:15:39",
        "vehicleId": "鲁YQG1PB_6",
        "vehicleType": "12",
        "vehicleTypeName": "普通货车",
        "freightName": "未知货物",
        "freightCategory": "其他",
        "discountAmount": 127.55,
        "enStationName": "入口收费站",
        "inspectionModifyCount": 0,
        "checkResult": 1,
        "checkResultName": "合格"
      },
      {
        "id": 56,
        "checkId": "853555164520241101221339_18560120720",
        "exStationName": "出口收费站",
        "checkTime": "2024-11-01 22:13:39",
        "vehicleId": "鄂SU2811_3",
        "vehicleType": "17",
        "vehicleTypeName": "普通货车",
        "freightName": "未知货物",
        "freightCategory": "其他",
        "discountAmount": 138.37,
        "enStationName": "入口收费站",
        "inspectionModifyCount": 0,
        "checkResult": 1,
        "checkResultName": "合格"
      },
      {
        "id": 14,
        "checkId": "876622168620241101221007_19670687495",
        "exStationName": "出口收费站",
        "checkTime": "2024-11-01 22:10:07",
        "vehicleId": "贵B19TUV_2",
        "vehicleType": "10",
        "vehicleTypeName": "普通货车",
        "freightName": "未知货物",
        "freightCategory": "其他",
        "discountAmount": 96.58,
        "enStationName": "入口收费站",
        "inspectionModifyCount": 0,
        "checkResult": 1,
        "checkResultName": "合格"
      },
      {
        "id": 65,
        "checkId": "938806347720241101214443_17169024183",
        "exStationName": "出口收费站",
        "checkTime": "2024-11-01 21:44:43",
        "vehicleId": "桂M34654_6",
        "vehicleType": "17",
        "vehicleTypeName": "普通货车",
        "freightName": "未知货物",
        "freightCategory": "其他",
        "discountAmount": 114.65,
        "enStationName": "入口收费站",
        "inspectionModifyCount": 0,
        "checkResult": 1,
        "checkResultName": "合格"
      },
      {
        "id": 5,
        "checkId": "668782691920241101214433_15682716245",
        "exStationName": "出口收费站",
        "checkTime": "2024-11-01 21:44:33",
        "vehicleId": "新W11A6A_5",
        "vehicleType": "18",
        "vehicleTypeName": "普通货车",
        "freightName": "未知货物",
        "freightCategory": "其他",
        "discountAmount": 0,
        "enStationName": "入口收费站",
        "inspectionModifyCount": 0,
        "checkResult": 0,
        "checkResultName": "未知"
      }
    ]
  },
  "timestamp": 1761017210493
}

export default function ShiShiXinXiPage() {
  // 转换API数据为表格组件需要的格式
  const transformData = (apiData: typeof mockApiData) => {
    return apiData.data.list.map((item, index) => ({
      id: String((apiData.data.pageNum - 1) * apiData.data.pageSize + index + 1).padStart(2, "0"),
      exStationName: item.exStationName,
      checkTime: item.checkTime.replace(/-/g, ".").replace(" ", " "),
      vehicleId: item.vehicleId,
      vehicleTypeName: item.vehicleTypeName,
      freightName: item.freightName,
      discountAmount: item.discountAmount > 0 ? `${item.discountAmount.toFixed(2)}元` : "0元",
      enStationName: item.enStationName,
      checkResult: item.checkResultName === "合格" ? "✓" : item.checkResultName,
      inspectionModifyCount: item.inspectionModifyCount.toString(),
      details: "查看",
      originalId: item.id // 保存原始ID用于跳转
    }))
  }

  // 表格配置
  const tableConfig = {
    columns: [
      { key: "id", label: "序号", width: "100px", align: "center" },
      { key: "exStationName", label: "出口收费站", width: "150px", align: "center" },
      { key: "checkTime", label: "查验时间", width: "180px", align: "center" },
      { key: "vehicleId", label: "车牌号", width: "200px", align: "center" },
      { key: "vehicleTypeName", label: "车型", width: "120px", align: "center" },
      { key: "freightName", label: "货物名称", width: "180px", align: "center" },
      { key: "discountAmount", label: "减免金额", width: "160px", align: "center" },
      { key: "enStationName", label: "入口收费站", width: "150px", align: "center" },
      { key: "checkResult", label: "稽查", width: "80px", align: "center" },
      { key: "inspectionModifyCount", label: "查验修改", width: "100px", align: "center" },
      { key: "details", label: "详情", width: "80px", align: "center" },
    ],
    data: transformData(mockApiData),
    showPagination: true
  }

  return (
    <div className="h-[calc(100vh-100px)] bg-slate-900 p-4 flex flex-col">
      {/* 两列布局，比例 1416:460 */}
      <div className="flex-1 grid grid-cols-[1416fr_460fr] gap-4 min-h-0">
        {/* 左侧列 - 实时查验数据表格 */}
        <TechDataTable config={tableConfig} />

        {/* 右侧列 */}
        <div className="bg-slate-800/50 border border-blue-500/30 rounded-lg p-0">
          <StatisticsCategory />
          <SearchPanel />
        </div>
      </div>
    </div>
  )
}