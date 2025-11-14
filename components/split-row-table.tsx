"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { ImageBgButton } from "@/components/image-bg-button"

interface TableColumn {
  key: string
  label: string
  width?: string
  align?: 'left' | 'center' | 'right'
}

interface SplitRowData {
  id: string
  [key: string]: string | { top: string; bottom: string }
}

interface SplitRowTableConfig {
  width?: string
  height?: string
  rowHeight?: string
  columns: TableColumn[]
  data: SplitRowData[]
  showPagination?: boolean
  splitFromColumn?: number
}

interface SplitRowTableProps {
  config?: Partial<SplitRowTableConfig>
  className?: string
}

export function SplitRowTable({ config, className = "" }: SplitRowTableProps) {
  const defaultConfig: SplitRowTableConfig = {
    width: "100%",
    height: "auto",
    rowHeight: "48px",
    showPagination: true,
    splitFromColumn: 3,
    columns: [],
    data: []
  }

  const finalConfig = { ...defaultConfig, ...config }
  
  const [data, setData] = useState<SplitRowData[]>(finalConfig.data)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchValue, setSearchValue] = useState("")
  const totalPages = 10

  useEffect(() => {
    if (finalConfig.data.length === 0) {
      const generated: SplitRowData[] = Array.from({ length: 16 }, (_, i) => ({
        id: String(i + 1).padStart(2, "0"),
        vehicleType: i % 3 === 0 ? "货六" : i % 3 === 1 ? "货二" : "货一",
        totalCount: "800",
        passCount: { top: "750", bottom: "850" },
        rejectCount: { top: "50", bottom: "50" },
        passRate: { top: "93.8%", bottom: "94.4%" },
      }))
      setData(generated)
    } else {
      setData(finalConfig.data)
    }
  }, [finalConfig.data])

  return (
    <div 
      className={`rounded-lg border border-slate-700/50 overflow-hidden ${className}`}
    >
      <div className="h-9"     
        style={{
          backgroundImage: 'url(/assets/TitleHeader.png)',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr 
              className="bg-transparent"
              style={{
                backgroundImage: 'url(/assets/Table_Header.png)',
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              {finalConfig.columns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-sm font-medium text-slate-300 border border-slate-700/50"
                  style={{
                    width: column.width,
                    textAlign: column.align || 'left',
                  }}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody className="divide-y divide-slate-700/30">
            {data.map((row, index) => (
              <>
                {/* 第一行：显示普通列和分裂列的上部分 */}
                <tr
                  key={`${row.id}-top`}
                  className={`transition-colors hover:bg-slate-700/50 ${
                    index % 2 === 0 ? "bg-slate-800/20" : "bg-slate-800/40"
                  }`}
                >
                                     {finalConfig.columns.map((column, columnIndex) => {
                    const value = row[column.key]
                    const isSplitValue = typeof value === 'object' && value !== null && 'top' in value && 'bottom' in value
                    const isBeforeSplitColumn = columnIndex < (finalConfig.splitFromColumn || 2)
                    
                    // 如果有分裂值，无论在哪列都按分裂处理
                    if (isSplitValue) {
                      // 分裂列的第一行
                      return (
                        <td
                          key={column.key}
                          className="border border-slate-700/50 px-4 py-2 text-sm text-slate-300 text-center border-b-slate-500/60"
                          style={{
                            width: column.width,
                          }}
                        >
                          {value.top}
                        </td>
                      )
                    } else if (isBeforeSplitColumn) {
                      // 普通列：需要 rowSpan 占据两行
                      return (
                        <td
                          key={column.key}
                          rowSpan={2}
                          className="border border-slate-700/50 px-4 py-3 text-sm text-slate-300 text-center"
                          style={{
                            width: column.width,
                            verticalAlign: 'middle',
                          }}
                        >
                          {String(value)}
                        </td>
                      )
                    } else {
                      return (
                        <td
                          key={column.key}
                          rowSpan={2}
                          className="border border-slate-700/50 px-4 py-3 text-sm text-slate-300 text-center"
                          style={{
                            width: column.width,
                            verticalAlign: 'middle',
                          }}
                        >
                          {String(value)}
                        </td>
                      )
                    }
                  })}
                </tr>
                
                {/* 第二行：只显示分裂列的下部分 */}
                <tr
                  key={`${row.id}-bottom`}
                  className={`transition-colors hover:bg-slate-700/50 ${
                    index % 2 === 0 ? "bg-slate-800/20" : "bg-slate-800/40"
                  }`}
                >
                  {finalConfig.columns.map((column, columnIndex) => {
                    const value = row[column.key]
                    const isSplitValue = typeof value === 'object' && value !== null && 'top' in value && 'bottom' in value
                    
                    // 只渲染分裂列的下半部分（无论在哪列位置）
                    if (isSplitValue) {
                      return (
                        <td
                          key={column.key}
                          className="border border-slate-700/50 px-4 py-2 text-sm text-slate-300 text-center bg-slate-600/20"
                          style={{
                            width: column.width,
                          }}
                        >
                          {value.bottom}
                        </td>
                      )
                    }
                    return null
                  })}
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </div>

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
              onClick={() => setCurrentPage(1)}
            />
            <ImageBgButton
              bgSrc="/assets/longBtn.png"
              text="上一页"
              width="107px"
              height="44px"
              stretch="cover"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
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
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            />
            <ImageBgButton
              bgSrc="/assets/shortBtn.png"
              text="尾页"
              width="88px"
              height="44px"
              stretch="cover"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(totalPages)}
            />

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
                      setCurrentPage(page)
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
