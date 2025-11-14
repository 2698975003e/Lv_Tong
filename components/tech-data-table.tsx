"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { ImageBgButton } from "@/components/image-bg-button"

interface TableColumn {
  key: string
  label: string
  width?: string
  align?: 'left' | 'center' | 'right'
  onClick?: (row: TableRow, rowIndex: number) => void // 添加点击回调
}

interface TableConfig {
  width?: string
  height?: string
  rowHeight?: string
  columns: TableColumn[]
  data: TableRow[]
  showPagination?: boolean
  pagination?: {
    currentPage?: number
    totalPages?: number
    pageSize?: number
    total?: number
    onPageChange?: (page: number) => void
  }
  headerBgSrc?: string  // 新增：表头背景图
}

interface TableRow {
  id: string
  exStationName?: string
  checkTime?: string
  vehicleId?: string
  vehicleTypeName?: string
  freightName?: string
  discountAmount?: string
  enStationName?: string
  checkResult?: string
  inspectionModifyCount?: string
  details?: string
  originalId?: number
  // 保留原有字段以兼容
  licensePlate?: string
  vehicleType?: string
  trafficCount?: number
  totalDiscount?: string
  mainRoute?: string
  mainRouteDetail?: string
  jumpDetails?: string
  discountDetails?: string
  cargoDetails?: string
  cargoDetail?: string
  mainCategory?: string
}

interface TechDataTableProps {
  config?: Partial<TableConfig>
  className?: string
}

export function TechDataTable({ config, className = "" }: TechDataTableProps) {
  // 默认配置
  const defaultConfig: TableConfig = {
    width: "100%",
    height: "auto",
    rowHeight: "48px",
    showPagination: true,  // 默认显示分页器
    columns: [
      { key: "id", label: "序号", width: "80px", align: "center" },
      { key: "licensePlate", label: "车牌", width: "120px", align: "center" },
      { key: "vehicleType", label: "车型", width: "100px", align: "center" },
      { key: "trafficCount", label: "通行数", width: "100px", align: "center" },
      { key: "totalDiscount", label: "总减免金额", width: "150px", align: "center" },
      { key: "mainRoute", label: "主要入口-出口站(次数)", width: "200px", align: "left" },
      { key: "jumpDetails", label: "跳转详情", width: "100px", align: "center" },
      { key: "discountDetails", label: "主要减免次数详情", width: "180px", align: "center" },
      { key: "cargoDetails", label: "货物详情", width: "100px", align: "center" },
    ],
    data: [],
    headerBgSrc: "/assets/Table_Header.png", // 新增默认值
  }

  // 合并配置
  const finalConfig = { ...defaultConfig, ...config }
  
  const [data, setData] = useState<TableRow[]>(finalConfig.data)
  const [currentPage, setCurrentPage] = useState(
    finalConfig.pagination?.currentPage || 3
  )
  const [searchValue, setSearchValue] = useState("")
  const totalPages = finalConfig.pagination?.totalPages || 10
  
  // 处理分页变化
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // 调用外部传入的回调
    if (finalConfig.pagination?.onPageChange) {
      finalConfig.pagination.onPageChange(page)
    }
  }

  useEffect(() => {
    // 如果配置中没有数据，则生成默认数据
    if (finalConfig.data.length === 0) {
      const generated: TableRow[] = Array.from({ length: 16 }, (_, i) => ({
        id: String(i + 1).padStart(2, "0"),
        licensePlate: "鲁B12345",
        vehicleType: i % 3 === 0 ? "货六" : i % 3 === 1 ? "货二" : "货一",
        trafficCount: Math.floor(Math.random() * 10) + 18,
        totalDiscount: "1325.67元",
        mainRoute: "西海岸新区站-西海岸黄海山庄站(2)",
        jumpDetails: "查看",
        discountDetails: i % 4 === 0 ? "蔬菜(21)" : i % 4 === 1 ? "水果(21)" : i % 4 === 2 ? "鲜活(21)" : "蔬菜(21)",
        cargoDetails: "查看",
      }))
      setData(generated)
    } else {
      setData(finalConfig.data)
    }
  }, [finalConfig.data])

  // 计算表格样式
  const tableStyle = {
    width: finalConfig.width,
    height: finalConfig.height,
  }

  const rowStyle = {
    height: finalConfig.rowHeight,
  }

  return (
    <div 
      className={`rounded-lg border border-slate-700/50 overflow-hidden ${className}`}
      style={tableStyle}
    >
      {/* Title Header */}
      <div className="h-9"     
      style={{
      backgroundImage: 'url(/assets/TitleHeader.png)',
      backgroundSize: 'contain',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}></div>
      
      {/* Table Header */}
      <div
        className="w-full h-12 flex items-center px-4 rounded-t-md"
        style={{
          backgroundImage: `url(${finalConfig.headerBgSrc || "/assets/Table_Header.png"})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div 
          className="flex px-4 py-3 text-sm font-medium text-slate-300"
          style={rowStyle}
        >
          {finalConfig.columns.map((column, index) => (
            <div
              key={column.key}
              className="flex-1"
              style={{
                width: column.width,
                textAlign: column.align || 'left',
                minWidth: column.width,
                maxWidth: column.width,
              }}
            >
              {column.label}
            </div>
          ))}
        </div>
      </div>

      {/* Table Body - 根据showPagination决定是否使用滚动 */}
      <div 
        className={`divide-y divide-slate-700/30 ${
          !finalConfig.showPagination ? 'max-h-[500px] overflow-y-auto custom-scrollbar' : ''
        }`}
      >
        {data.map((row, index) => (
          <div
            key={row.id}
            className={`flex px-4 py-3 text-sm transition-colors hover:bg-slate-700/30 ${
              index % 2 === 0 ? "bg-slate-800/10" : "bg-slate-800/70"
            }`}
            style={rowStyle}
          >
            {finalConfig.columns.map((column) => (
              <div
                key={column.key}
                className="flex-1 text-slate-300"
                style={{
                  width: column.width,
                  textAlign: column.align || 'left',
                  minWidth: column.width,
                  maxWidth: column.width,
                }}
              >
                {column.key === 'jumpDetails' || column.key === 'cargoDetails' || column.key === 'cargoDetail' || column.key === 'details' || column.key === 'mainRouteDetail' ? (
                  <button 
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                    onClick={() => {
                      if (column.onClick) {
                        column.onClick(row, index)
                      }
                    }}
                  >
                    {row[column.key as keyof TableRow] as string}
                  </button>
                ) : column.key === 'checkResult' ? (
                  <div className="flex justify-center">
                    {row[column.key as keyof TableRow] === "✓" ? (
                      <div className="inline-flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    ) : (
                      <span className="text-slate-300">{row[column.key as keyof TableRow] as string}</span>
                    )}
                  </div>
                ) : column.key === 'mainRoute' ? (
                  <div className="truncate">{row[column.key as keyof TableRow] as string}</div>
                ) : (
                  <div>{row[column.key as keyof TableRow] as string}</div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Pagination - 条件渲染 */}
      {finalConfig.showPagination && (
        <div className="bg-slate-800/80 border-t border-slate-700/50 px-4 py-3">
          <div className="flex items-center justify-center space-x-3">
            <ImageBgButton
              bgSrc="/assets/shortBtn.png"
              text="首页"
              width="88px"
              height="44px"
              stretch="cover"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(1)}
            />
            <ImageBgButton
              bgSrc="/assets/longBtn.png"
              text="上一页"
              width="107px"
              height="44px"
              stretch="cover"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            />

            <ImageBgButton
              bgSrc="/assets/longBtn.png"
              text={`${currentPage}/${totalPages}`}
              width="107px"
              height="44px"
              stretch="cover"
              disabled
            />

            <ImageBgButton
              bgSrc="/assets/longBtn.png"
              text="下一页"
              width="107px"
              height="44px"
              stretch="cover"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            />
            <ImageBgButton
              bgSrc="/assets/shortBtn.png"
              text="尾页"
              width="88px"
              height="44px"
              stretch="cover"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(totalPages)}
            />

            {/* Jump to page input */}
            <div className="flex items-center ml-4">
              <div className="flex border-2 border-cyan-400/80 rounded-full shadow-lg shadow-cyan-400/20 overflow-hidden">
                <Input
                  placeholder="请输入页码"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-32 h-11 bg-slate-900/80 border-0 text-cyan-300 placeholder:text-cyan-500/60 focus:ring-0 focus:outline-none rounded-none text-sm px-4"
                />
                <ImageBgButton
                  bgSrc="/assets/shortBtn.png"
                  text="跳转"
                  width="88px"
                  height="44px"
                  stretch="cover"
                  onClick={() => {
                    const page = Number.parseInt(searchValue)
                    if (page >= 1 && page <= totalPages) {
                      handlePageChange(page)
                      setSearchValue("")
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
