"use client"

import { TechDataTable } from "@/components/tech-data-table"
import { ImageBgButton } from "@/components/image-bg-button"

export default function Home() {
  // 示例配置
  const tableConfig = {
    width: "1440px",
    height: "600px",
    rowHeight: "40px",
    columns: [
      { key: "id", label: "序号", width: "60px", align: "center" as const },
      { key: "licensePlate", label: "车牌", width: "180px", align: "center" as const },
      { key: "vehicleType", label: "车型", width: "140px", align: "center" as const },
      { key: "trafficCount", label: "通行数", width: "140px", align: "center" as const },
      { key: "totalDiscount", label: "总减免金额", width: "200px", align: "center" as const },
      { key: "mainRoute", label: "主要入口-出口站（次数）", width: "300px", align: "center" as const },
      { key: "jumpDetails", label: "路线详情", width: "140px", align: "center" as const },
      { key: "discountDetails", label: "主运类别（次数）", width: "140px", align: "center" as const },
      { key: "cargoDetails", label: "货物信息", width: "100px", align: "center" as const },
    ],
    data: [
      {
        id: "01",
        licensePlate: "京A12345",
        vehicleType: "货六",
        trafficCount: 25,
        totalDiscount: "2500.00元",
        mainRoute: "西海岸新区站-西海岸黄海山庄站(2)",
        jumpDetails: "查看",
        discountDetails: "蔬菜(15)",
        cargoDetails: "查看",
      },
      {
        id: "02",
        licensePlate: "沪B67890",
        vehicleType: "货二",
        trafficCount: 18,
        totalDiscount: "1800.50元",
        mainRoute: "西海岸新区站-西海岸黄海山庄站(2)",
        jumpDetails: "查看",
        discountDetails: "水果(12)",
        cargoDetails: "查看",
      },
    ]
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-8xl mx-auto">
        
        {/* 使用默认配置的表格 */}
        {/* <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-300 mb-4">默认配置表格</h2>
          <TechDataTable />
        </div> */}

        {/* 使用自定义配置的表格 */}
        <div>
          <h2 className="text-lg font-semibold text-slate-300 mb-4">自定义配置表格</h2>
          <div className="mb-4 flex gap-4">
          <ImageBgButton
            bgSrc="/assets/shortBtn.png"
            text="计算"
           width="88px"
            height="44px"
            stretch="cover"
            onClick={() => console.log("计算 clicked")}
          />
          <ImageBgButton
            bgSrc="/assets/longBtn.png"
            text="提交"
            width="107px"
            height="44px"
            stretch="cover"
          />
        </div>
          <TechDataTable config={tableConfig} />
        </div>
      </div>
    </div>
  )
}
