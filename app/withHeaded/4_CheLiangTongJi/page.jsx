import { TechDataTable } from "@/components/tech-data-table"

export default function CheLiangTongJiPage() {
    // 分公司运输车型统计表格配置
    const branchVehicleConfig = {
        showPagination:false,
        columns: [
            { key: "companyName", label: "公司名称", width: "150px", align: "center" },
            { key: "totalVehicles", label: "绿通车总辆次", width: "200px", align: "center" },
            { key: "cargo1", label: "货一", width: "180px", align: "center" },
            { key: "cargo2", label: "货二", width: "180px", align: "center" },
            { key: "cargo3", label: "货三", width: "180px", align: "center" },
            { key: "cargo4", label: "货四", width: "180px", align: "center" },
            { key: "cargo5", label: "货五", width: "180px", align: "center" },
            { key: "cargo6", label: "货六", width: "180px", align: "center" },
        ],
        data: [
            {
                id: "1",
                companyName: "辖区",
                totalVehicles: "2890",
                cargo1: "362",
                cargo2: "347", 
                cargo3: "499",
                cargo4: "98",
                cargo5: "120",
                cargo6: "850",
                licensePlate: "",
                vehicleType: "",
                trafficCount: 0,
                totalDiscount: "",
                mainRoute: "",
                jumpDetails: "",
                discountDetails: "",
                cargoDetails: ""
            },
            {
                id: "2",
                companyName: "车辆占比",
                totalVehicles: "100%",
                cargo1: "12%",
                cargo2: "30%",
                cargo3: "25%",
                cargo4: "18%",
                cargo5: "11%",
                cargo6: "7%",
                licensePlate: "",
                vehicleType: "",
                trafficCount: 0,
                totalDiscount: "",
                mainRoute: "",
                jumpDetails: "",
                discountDetails: "",
                cargoDetails: ""
            }
        ]
    }

    // 收费站运输车型统计表格配置
    const stationVehicleConfig = {
        showPagination:false,
        columns: [
            { key: "stationName", label: "收费站名称", width: "150px", align: "center" },
            { key: "totalVehicles", label: "绿通车总辆次", width: "200px", align: "center" },
            { key: "cargo1", label: "货一", width: "180px", align: "center" },
            { key: "cargo2", label: "货二", width: "180px", align: "center" },
            { key: "cargo3", label: "货三", width: "180px", align: "center" },
            { key: "cargo4", label: "货四", width: "180px", align: "center" },
            { key: "cargo5", label: "货五", width: "180px", align: "center" },
            { key: "cargo6", label: "货六", width: "180px", align: "center" },
        ],
        data: [
            {
                id: "1",
                stationName: "隐珠",
                totalVehicles: "890",
                cargo1: "62 (12%)",
                cargo2: "47 (10%)",
                cargo3: "99 (8%)",
                cargo4: "98 (6%)",
                cargo5: "20 (18%)",
                cargo6: "50 (22%)",
                licensePlate: "",
                vehicleType: "",
                trafficCount: 0,
                totalDiscount: "",
                mainRoute: "",
                jumpDetails: "",
                discountDetails: "",
                cargoDetails: ""
            },
            {
                id: "2",
                stationName: "灵珠山东",
                totalVehicles: "289",
                cargo1: "62 (12%)",
                cargo2: "47 (10%)",
                cargo3: "99 (8%)",
                cargo4: "98 (6%)",
                cargo5: "20 (18%)",
                cargo6: "50 (22%)",
                licensePlate: "",
                vehicleType: "",
                trafficCount: 0,
                totalDiscount: "",
                mainRoute: "",
                jumpDetails: "",
                discountDetails: "",
                cargoDetails: ""
            },
            {
                id: "3",
                stationName: "河套",
                totalVehicles: "290",
                cargo1: "62 (12%)",
                cargo2: "47 (10%)",
                cargo3: "99 (8%)",
                cargo4: "98 (6%)",
                cargo5: "20 (18%)",
                cargo6: "50 (22%)",
                licensePlate: "",
                vehicleType: "",
                trafficCount: 0,
                totalDiscount: "",
                mainRoute: "",
                jumpDetails: "",
                discountDetails: "",
                cargoDetails: ""
            },
            {
                id: "4",
                stationName: "胶州上合",
                totalVehicles: "890",
                cargo1: "62 (12%)",
                cargo2: "47 (10%)",
                cargo3: "99 (8%)",
                cargo4: "98 (6%)",
                cargo5: "20 (18%)",
                cargo6: "50 (22%)",
                licensePlate: "",
                vehicleType: "",
                trafficCount: 0,
                totalDiscount: "",
                mainRoute: "",
                jumpDetails: "",
                discountDetails: "",
                cargoDetails: ""
            },
            {
                id: "5",
                stationName: "青岛高新",
                totalVehicles: "890",
                cargo1: "62 (12%)",
                cargo2: "47 (10%)",
                cargo3: "99 (8%)",
                cargo4: "98 (6%)",
                cargo5: "20 (18%)",
                cargo6: "50 (22%)",
                licensePlate: "",
                vehicleType: "",
                trafficCount: 0,
                totalDiscount: "",
                mainRoute: "",
                jumpDetails: "",
                discountDetails: "",
                cargoDetails: ""
            },
            {
                id: "6",
                stationName: "西海岸新区",
                totalVehicles: "567",
                cargo1: "78 (14%)",
                cargo2: "89 (16%)",
                cargo3: "123 (22%)",
                cargo4: "156 (27%)",
                cargo5: "89 (16%)",
                cargo6: "32 (6%)",
                licensePlate: "",
                vehicleType: "",
                trafficCount: 0,
                totalDiscount: "",
                mainRoute: "",
                jumpDetails: "",
                discountDetails: "",
                cargoDetails: ""
            },
            {
                id: "7",
                stationName: "黄海山庄",
                totalVehicles: "456",
                cargo1: "67 (15%)",
                cargo2: "89 (20%)",
                cargo3: "91 (20%)",
                cargo4: "89 (19%)",
                cargo5: "78 (17%)",
                cargo6: "42 (9%)",
                licensePlate: "",
                vehicleType: "",
                trafficCount: 0,
                totalDiscount: "",
                mainRoute: "",
                jumpDetails: "",
                discountDetails: "",
                cargoDetails: ""
            },
            {
                id: "8",
                stationName: "胶州湾",
                totalVehicles: "678",
                cargo1: "89 (13%)",
                cargo2: "123 (18%)",
                cargo3: "145 (21%)",
                cargo4: "167 (25%)",
                cargo5: "98 (14%)",
                cargo6: "56 (8%)",
                licensePlate: "",
                vehicleType: "",
                trafficCount: 0,
                totalDiscount: "",
                mainRoute: "",
                jumpDetails: "",
                discountDetails: "",
                cargoDetails: ""
            },
            {
                id: "9",
                stationName: "青岛港",
                totalVehicles: "789",
                cargo1: "98 (12%)",
                cargo2: "145 (18%)",
                cargo3: "167 (21%)",
                cargo4: "189 (24%)",
                cargo5: "123 (16%)",
                cargo6: "67 (8%)",
                licensePlate: "",
                vehicleType: "",
                trafficCount: 0,
                totalDiscount: "",
                mainRoute: "",
                jumpDetails: "",
                discountDetails: "",
                cargoDetails: ""
            },
            {
                id: "10",
                stationName: "即墨北",
                totalVehicles: "345",
                cargo1: "45 (13%)",
                cargo2: "67 (19%)",
                cargo3: "78 (23%)",
                cargo4: "89 (26%)",
                cargo5: "56 (16%)",
                cargo6: "10 (3%)",
                licensePlate: "",
                vehicleType: "",
                trafficCount: 0,
                totalDiscount: "",
                mainRoute: "",
                jumpDetails: "",
                discountDetails: "",
                cargoDetails: ""
            },
            {
                id: "11",
                stationName: "莱西",
                totalVehicles: "234",
                cargo1: "32 (14%)",
                cargo2: "45 (19%)",
                cargo3: "56 (24%)",
                cargo4: "67 (29%)",
                cargo5: "23 (10%)",
                cargo6: "11 (5%)",
                licensePlate: "",
                vehicleType: "",
                trafficCount: 0,
                totalDiscount: "",
                mainRoute: "",
                jumpDetails: "",
                discountDetails: "",
                cargoDetails: ""
            },
            {
                id: "12",
                stationName: "平度",
                totalVehicles: "456",
                cargo1: "67 (15%)",
                cargo2: "89 (20%)",
                cargo3: "91 (20%)",
                cargo4: "89 (19%)",
                cargo5: "78 (17%)",
                cargo6: "42 (9%)",
                licensePlate: "",
                vehicleType: "",
                trafficCount: 0,
                totalDiscount: "",
                mainRoute: "",
                jumpDetails: "",
                discountDetails: "",
                cargoDetails: ""
            },
            {
                id: "13",
                stationName: "胶州",
                totalVehicles: "567",
                cargo1: "78 (14%)",
                cargo2: "89 (16%)",
                cargo3: "123 (22%)",
                cargo4: "156 (27%)",
                cargo5: "89 (16%)",
                cargo6: "32 (6%)",
                licensePlate: "",
                vehicleType: "",
                trafficCount: 0,
                totalDiscount: "",
                mainRoute: "",
                jumpDetails: "",
                discountDetails: "",
                cargoDetails: ""
            },
            {
                id: "14",
                stationName: "城阳",
                totalVehicles: "678",
                cargo1: "89 (13%)",
                cargo2: "123 (18%)",
                cargo3: "145 (21%)",
                cargo4: "167 (25%)",
                cargo5: "98 (14%)",
                cargo6: "56 (8%)",
                licensePlate: "",
                vehicleType: "",
                trafficCount: 0,
                totalDiscount: "",
                mainRoute: "",
                jumpDetails: "",
                discountDetails: "",
                cargoDetails: ""
            },
            {
                id: "15",
                stationName: "崂山",
                totalVehicles: "789",
                cargo1: "98 (12%)",
                cargo2: "145 (18%)",
                cargo3: "167 (21%)",
                cargo4: "189 (24%)",
                cargo5: "123 (16%)",
                cargo6: "67 (8%)",
                licensePlate: "",
                vehicleType: "",
                trafficCount: 0,
                totalDiscount: "",
                mainRoute: "",
                jumpDetails: "",
                discountDetails: "",
                cargoDetails: ""
            }
        ]
    }

    return (
        <div className="h-[calc(100vh-100px)] bg-slate-900 p-4 flex flex-col">
            {/* 两列布局，比例 1416:460 */}
            <div className="flex-1 grid grid-cols-[1416fr_460fr] gap-4 min-h-0">
                {/* 左侧列 - 上下两个表格 */}
                <div className="flex flex-col gap-12 min-h-0">
                    {/* 上表格：分公司运输车型统计 - 1份 */}
                    <div className="h-[20%] min-h-0">
                        <TechDataTable 
                            config={branchVehicleConfig}
                            className="h-full"
                        />
                    </div>
                    
                    {/* 下表格：收费站运输车型统计 - 4份 */}
                    <div className="h-[80%] min-h-0">
                        <TechDataTable 
                            config={stationVehicleConfig}
                            className="h-full"
                        />
                    </div>
                </div>

                {/* 右侧列 */}
                <div className="bg-slate-800/50 border border-blue-500/30 rounded-lg p-4">
                    <h2 className="text-blue-400 font-medium mb-4">右侧内容区域</h2>
                    <p className="text-gray-300 text-sm">这里放置右侧的主要内容</p>
                </div>
            </div>
        </div>
    )
}
