import { VehicleStatsTable } from "@/components/dashboard/vehicle-stats-table"
import { WarningVehiclesTable } from "@/components/dashboard/warning-vehicles-table"
import { ChinaMap } from "@/components/dashboard/china-map"
import { ThreeDDonutChart } from "@/components/dashboard/vehicle-distribution-chart"
import { VehicleStatsDetailChart } from "@/components/dashboard/vehicle-stats-detail-chart"
import { WarningTrendChart } from "@/components/dashboard/warning-trend-chart"
import { RegionalDataChart } from "@/components/dashboard/regional-data-chart"

export default function HomePage() {
  return (
    <div className="h-[calc(100vh-100px)] bg-slate-900 p-4 flex flex-col">
      {/* 主网格：两行，比例 2:1 */}
      <div className="flex-1 grid grid-cols-12 grid-rows-[2fr_1fr] gap-4 min-h-0">
        {/* 第一行：上中右三列 */}
        <div className="col-span-12 row-start-1 grid grid-cols-12 gap-4 min-h-0">
          {/* Left column - Tables */}
          <div className="col-span-3 flex flex-col gap-4 min-h-0">
            <div className="flex-1 min-h-0">
              <VehicleStatsTable />
            </div>
            <div className="flex-1 min-h-0">
              <WarningVehiclesTable />
            </div>
          </div>

          {/* Center column - Map */}
          <div className="col-span-6 min-h-0">
            <ChinaMap />
          </div>

          {/* Right column - Charts */}
          <div className="col-span-3 flex flex-col gap-4 min-h-0">
            <div className="flex-1 min-h-0">
              <ThreeDDonutChart />
            </div>
            <div className="flex-1 min-h-0">
              <VehicleStatsDetailChart />
            </div>
          </div>
        </div>

        {/* 第二行：底部两块 */}
        <div className="col-span-12 row-start-2 grid grid-cols-[788fr_1100fr] gap-4 min-h-0">
          <div className="h-full min-h-0">
            <WarningTrendChart />
          </div>
          <div className="h-full min-h-0">
            <RegionalDataChart />
          </div>
        </div>
      </div>
    </div>
  )
}
