"use client"

import { useEffect, useState } from "react"
import { StatisticsCategory } from "@/components/right_statistics_category"
import { SearchPanel } from "@/components/search-panel"
import { TechDataTable } from "@/components/tech-data-table"
import { apiFetch } from "@/lib/api"

// 接口类型定义
interface SingleFreightApiResponse {
  code: number
  message: string
  data: {
    queryConditions: {
      freightCategory: string
      startDate: string
      endDate: string
      timePeriodType: string
    }
    statistics: Array<{
      stationName: string
      freightCategory: string
      totalPassCount: number
      totalDiscountAmount: number
      freightRatio: number
      totalPassCountYoY: number
      totalPassCountMoM: number
      discountAmountYoY: number
      discountAmountMoM: number
      freightRatioYoY: number
      freightRatioMoM: number
      vehicleTypeDistribution: Array<{
        vehicleType: string
        passCount: number
        yoyGrowthRate: number
        momGrowthRate: number
      }>
    }>
  }
  timestamp: number
}

interface TableConfig {
  title?: string
  columns: Array<{ key: string; label: string; width: string; align: 'left' | 'center' | 'right' }>
  data: any[]
  showPagination: boolean
}

// 格式化百分比
const formatPercent = (value: number) => {
  if (value === -1) return '-'
  if (value < 0) return `${(value * 100).toFixed(2)}%`
  return `+${(value * 100).toFixed(2)}%`
}

// 转换数据为表格配置
function transformToTableConfigs(apiData: SingleFreightApiResponse['data']): Partial<TableConfig>[] {
  const { statistics, queryConditions } = apiData
  
  // 整体统计（汇总统计行）
  const summary = statistics.find(s => s.stationName === '汇总统计')
  
  // 各个站点统计
  const stationStats = statistics.filter(s => s.stationName !== '汇总统计')
  
  const configs: Partial<TableConfig>[] = []
  
  // 创建汇总统计表格
  if (summary) {
    const summaryData = [
      {
        id: 'summary',
        stationName: '汇总统计',
        greenPassCount: summary.totalPassCount,
        discountAmount: summary.totalDiscountAmount.toFixed(2),
        freightRatio: (summary.freightRatio * 100).toFixed(2) + '%',
        passCountYoY: formatPercent(summary.totalPassCountYoY),
        passCountMoM: formatPercent(summary.totalPassCountMoM),
        discountYoY: formatPercent(summary.discountAmountYoY),
        discountMoM: formatPercent(summary.discountAmountMoM),
        ratioYoY: formatPercent(summary.freightRatioYoY),
        ratioMoM: formatPercent(summary.freightRatioMoM),
        vehicleType1: summary.vehicleTypeDistribution[0]?.passCount || 0,
        vehicleType2: summary.vehicleTypeDistribution[1]?.passCount || 0,
        vehicleType3: summary.vehicleTypeDistribution[2]?.passCount || 0,
        vehicleType4: summary.vehicleTypeDistribution[3]?.passCount || 0,
        vehicleType5: summary.vehicleTypeDistribution[4]?.passCount || 0,
        vehicleType6: summary.vehicleTypeDistribution[5]?.passCount || 0,
      },
      {
        id: 'summary-yoy',
        stationName: '同比',
        greenPassCount: formatPercent(summary.totalPassCountYoY),
        discountAmount: formatPercent(summary.discountAmountYoY),
        freightRatio: formatPercent(summary.freightRatioYoY),
        passCountYoY: '',
        passCountMoM: '',
        discountYoY: '',
        discountMoM: '',
        ratioYoY: '',
        ratioMoM: '',
        vehicleType1: formatPercent(summary.vehicleTypeDistribution[0]?.yoyGrowthRate || 0),
        vehicleType2: formatPercent(summary.vehicleTypeDistribution[1]?.yoyGrowthRate || 0),
        vehicleType3: formatPercent(summary.vehicleTypeDistribution[2]?.yoyGrowthRate || 0),
        vehicleType4: formatPercent(summary.vehicleTypeDistribution[3]?.yoyGrowthRate || 0),
        vehicleType5: formatPercent(summary.vehicleTypeDistribution[4]?.yoyGrowthRate || 0),
        vehicleType6: formatPercent(summary.vehicleTypeDistribution[5]?.yoyGrowthRate || 0),
      },
      {
        id: 'summary-mom',
        stationName: '环比',
        greenPassCount: formatPercent(summary.totalPassCountMoM),
        discountAmount: formatPercent(summary.discountAmountMoM),
        freightRatio: formatPercent(summary.freightRatioMoM),
        passCountYoY: '',
        passCountMoM: '',
        discountYoY: '',
        discountMoM: '',
        ratioYoY: '',
        ratioMoM: '',
        vehicleType1: formatPercent(summary.vehicleTypeDistribution[0]?.momGrowthRate || 0),
        vehicleType2: formatPercent(summary.vehicleTypeDistribution[1]?.momGrowthRate || 0),
        vehicleType3: formatPercent(summary.vehicleTypeDistribution[2]?.momGrowthRate || 0),
        vehicleType4: formatPercent(summary.vehicleTypeDistribution[3]?.momGrowthRate || 0),
        vehicleType5: formatPercent(summary.vehicleTypeDistribution[4]?.momGrowthRate || 0),
        vehicleType6: formatPercent(summary.vehicleTypeDistribution[5]?.momGrowthRate || 0),
      }
    ]
    
    configs.push({
      title: '汇总统计',
      columns: [
        { key: "stationName", label: "车站名称", width: "150px", align: "left" as const },
        { key: "greenPassCount", label: "绿通车数 (辆次)", width: "120px", align: "center" as const },
        { key: "discountAmount", label: "减免金额", width: "120px", align: "center" as const },
        { key: "freightRatio", label: "货物占比", width: "100px", align: "center" as const },
        { key: "vehicleType1", label: "货一", width: "80px", align: "center" as const },
        { key: "vehicleType2", label: "货二", width: "80px", align: "center" as const },
        { key: "vehicleType3", label: "货三", width: "80px", align: "center" as const },
        { key: "vehicleType4", label: "货四", width: "80px", align: "center" as const },
        { key: "vehicleType5", label: "货五", width: "80px", align: "center" as const },
        { key: "vehicleType6", label: "货六", width: "80px", align: "center" as const },
      ],
      data: summaryData,
      showPagination: false
    })
  }
  
  // 为每个站点创建独立的表格
  stationStats.forEach((station) => {
    const stationData = [
      {
        id: `${station.stationName}-data`,
        stationName: station.stationName,
        greenPassCount: station.totalPassCount,
        discountAmount: station.totalDiscountAmount.toFixed(2),
        freightRatio: (station.freightRatio * 100).toFixed(2) + '%',
        passCountYoY: '',
        passCountMoM: '',
        discountYoY: '',
        discountMoM: '',
        ratioYoY: '',
        ratioMoM: '',
        vehicleType1: station.vehicleTypeDistribution[0]?.passCount || 0,
        vehicleType2: station.vehicleTypeDistribution[1]?.passCount || 0,
        vehicleType3: station.vehicleTypeDistribution[2]?.passCount || 0,
        vehicleType4: station.vehicleTypeDistribution[3]?.passCount || 0,
        vehicleType5: station.vehicleTypeDistribution[4]?.passCount || 0,
        vehicleType6: station.vehicleTypeDistribution[5]?.passCount || 0,
      },
      {
        id: `${station.stationName}-yoy`,
        stationName: '同比',
        greenPassCount: formatPercent(station.totalPassCountYoY),
        discountAmount: formatPercent(station.discountAmountYoY),
        freightRatio: formatPercent(station.freightRatioYoY),
        passCountYoY: '',
        passCountMoM: '',
        discountYoY: '',
        discountMoM: '',
        ratioYoY: '',
        ratioMoM: '',
        vehicleType1: formatPercent(station.vehicleTypeDistribution[0]?.yoyGrowthRate || 0),
        vehicleType2: formatPercent(station.vehicleTypeDistribution[1]?.yoyGrowthRate || 0),
        vehicleType3: formatPercent(station.vehicleTypeDistribution[2]?.yoyGrowthRate || 0),
        vehicleType4: formatPercent(station.vehicleTypeDistribution[3]?.yoyGrowthRate || 0),
        vehicleType5: formatPercent(station.vehicleTypeDistribution[4]?.yoyGrowthRate || 0),
        vehicleType6: formatPercent(station.vehicleTypeDistribution[5]?.yoyGrowthRate || 0),
      },
      {
        id: `${station.stationName}-mom`,
        stationName: '环比',
        greenPassCount: formatPercent(station.totalPassCountMoM),
        discountAmount: formatPercent(station.discountAmountMoM),
        freightRatio: formatPercent(station.freightRatioMoM),
        passCountYoY: '',
        passCountMoM: '',
        discountYoY: '',
        discountMoM: '',
        ratioYoY: '',
        ratioMoM: '',
        vehicleType1: formatPercent(station.vehicleTypeDistribution[0]?.momGrowthRate || 0),
        vehicleType2: formatPercent(station.vehicleTypeDistribution[1]?.momGrowthRate || 0),
        vehicleType3: formatPercent(station.vehicleTypeDistribution[2]?.momGrowthRate || 0),
        vehicleType4: formatPercent(station.vehicleTypeDistribution[3]?.momGrowthRate || 0),
        vehicleType5: formatPercent(station.vehicleTypeDistribution[4]?.momGrowthRate || 0),
        vehicleType6: formatPercent(station.vehicleTypeDistribution[5]?.momGrowthRate || 0),
      }
    ]
    
    configs.push({
      title: station.stationName,
      columns: [
        { key: "stationName", label: "车站名称", width: "150px", align: "left" as const },
        { key: "greenPassCount", label: "绿通车数 (辆次)", width: "120px", align: "center" as const },
        { key: "discountAmount", label: "减免金额", width: "120px", align: "center" as const },
        { key: "freightRatio", label: "货物占比", width: "100px", align: "center" as const },
        { key: "vehicleType1", label: "货一", width: "80px", align: "center" as const },
        { key: "vehicleType2", label: "货二", width: "80px", align: "center" as const },
        { key: "vehicleType3", label: "货三", width: "80px", align: "center" as const },
        { key: "vehicleType4", label: "货四", width: "80px", align: "center" as const },
        { key: "vehicleType5", label: "货五", width: "80px", align: "center" as const },
        { key: "vehicleType6", label: "货六", width: "80px", align: "center" as const },
      ],
      data: stationData,
      showPagination: false
    })
  })
  
  return configs
}

export default function DanPinTongJiPage() {
  const [tableConfigs, setTableConfigs] = useState<Partial<TableConfig>[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("")

  // 查询参数状态
  const [queryParams, setQueryParams] = useState({
    freightCategory: "新鲜蔬菜",  // 必填，默认值
    startDate: "2025-10-01",
    endDate: "2025-10-30",
    minDiscountAmount: "",
    maxDiscountAmount: "",
    enStationName: "",
    exStationName: "",
    vehicleType: "",
    vehicleId: "",
    passType: "",
    passMode: "",
    isModified: ""
  })

  // 数据加载函数
  const loadData = async () => {
    const controller = new AbortController()
    
    try {
      setLoading(true)
      setError(null)
      
      // 构建查询参数
      const params = new URLSearchParams({
        freightCategory: queryParams.freightCategory,
        startDate: queryParams.startDate,
        endDate: queryParams.endDate,
      })
      
      // 添加可选参数
      if (queryParams.minDiscountAmount) {
        params.append("minDiscountAmount", queryParams.minDiscountAmount)
      }
      if (queryParams.maxDiscountAmount) {
        params.append("maxDiscountAmount", queryParams.maxDiscountAmount)
      }
      if (queryParams.enStationName) {
        params.append("enStationName", queryParams.enStationName)
      }
      if (queryParams.exStationName) {
        params.append("exStationName", queryParams.exStationName)
      }
      if (queryParams.vehicleType) {
        params.append("vehicleType", queryParams.vehicleType)
      }
      if (queryParams.vehicleId) {
        params.append("vehicleId", queryParams.vehicleId)
      }
      if (queryParams.passType) {
        params.append("passType", queryParams.passType)
      }
      if (queryParams.passMode) {
        params.append("passMode", queryParams.passMode)
      }
      if (queryParams.isModified) {
        params.append("isModified", queryParams.isModified)
      }
      
      const res = await apiFetch(
        `/api/api/statistics/single-freight?${params.toString()}`,
        { signal: controller.signal }
      )
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      
      const json: SingleFreightApiResponse = await res.json()
      if (json.code !== 200) throw new Error(json.message || 'API返回错误')
      
      const configs = transformToTableConfigs(json.data)
      setTableConfigs(configs)
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        setError(e.message || '数据加载失败')
      }
    } finally {
      setLoading(false)
    }
    
    return () => {
      controller.abort()
    }
  }

  // 初始化数据
  useEffect(() => {
    loadData()
  }, [])

  // 自动刷新（2分钟）
  useEffect(() => {
    const interval = setInterval(() => {
      loadData()
    }, 120000)
    
    return () => clearInterval(interval)
  }, [])

  // 处理查询
  const handleSearch = (params: any) => {
    console.log("=== 查询参数 ===", params)
    
    setQueryParams({
      freightCategory: params.freightCategory || queryParams.freightCategory,
      startDate: params.startDate || queryParams.startDate,
      endDate: params.endDate || queryParams.endDate,
      minDiscountAmount: params.minDiscountAmount || "",
      maxDiscountAmount: params.maxDiscountAmount || "",
      enStationName: params.enStationName || "",
      exStationName: params.exStationName || "",
      vehicleType: params.vehicleType || "",
      vehicleId: params.vehicleId || "",
      passType: params.passType || "",
      passMode: params.passMode || "",
      isModified: params.isModified || ""
    })
    
    // 延迟调用，确保状态更新后再查询
    setTimeout(() => {
      loadData()
    }, 100)
  }

  // 处理重置
  const handleReset = () => {
    const defaultParams = {
      freightCategory: "新鲜蔬菜",
      startDate: "2025-10-01",
      endDate: "2025-10-30",
      minDiscountAmount: "",
      maxDiscountAmount: "",
      enStationName: "",
      exStationName: "",
      vehicleType: "",
      vehicleId: "",
      passType: "",
      passMode: "",
      isModified: ""
    }
    setQueryParams(defaultParams)
    
    setTimeout(() => {
      loadData()
    }, 100)
  }

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
    console.log('选择分类:', categoryId)
    
    // 根据选择的分类更新 freightCategory
    const categoryMap: Record<string, string> = {
      "1": "新鲜蔬菜",
      "2": "新鲜水果",
      "3": "水产品",
      "4": "新鲜肉蛋奶",
      "5": "其他鲜活农产品"
    }
    
    if (categoryMap[categoryId]) {
      setQueryParams(prev => ({
        ...prev,
        freightCategory: categoryMap[categoryId]
      }))
      
      // 更新后触发查询
      setTimeout(() => {
        loadData()
      }, 100)
    }
  }

  return (
    <div className="h-[calc(100vh-100px)] bg-slate-900 p-4 flex flex-col">
      {/* 两列布局，比例 1416:460 */}
      <div className="flex-1 grid grid-cols-[1416fr_460fr] gap-4 min-h-0">
        {/* 左侧列 - 多个数据表格 */}
        <div className="flex flex-col gap-6 min-h-0 overflow-y-auto custom-scrollbar"
          style={{
            maxHeight: 'calc(100vh - 200px)',
          }}
        >
          <style dangerouslySetInnerHTML={{__html: `
            .custom-scrollbar::-webkit-scrollbar {
              width: 8px;
              height: 8px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: rgba(9, 18, 38, 0.8);
              border-radius: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(59, 130, 246, 0.5);
              border-radius: 4px;
              border: 1px solid rgba(59, 130, 246, 0.3);
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(59, 130, 246, 0.7);
            }
            .custom-scrollbar::-webkit-scrollbar-corner {
              background: rgba(9, 18, 38, 0.8);
            }
            .custom-scrollbar {
              scrollbar-width: thin;
              scrollbar-color: rgba(59, 130, 246, 0.5) rgba(9, 18, 38, 0.8);
            }
          `}} />
          {loading ? (
            <div className="h-full flex items-center justify-center text-slate-300">
              数据加载中...
            </div>
          ) : error ? (
            <div className="h-full flex items-center justify-center text-red-400">
              加载失败: {error}
            </div>
          ) : (
            tableConfigs.map((config, index) => (
              <div key={index} className="bg-slate-800/50 border border-blue-500/30 rounded-lg p-4">
                {/* 表格标题 */}
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-white">{config.title}</h3>
                </div>
                {/* 表格内容 */}
                <TechDataTable config={config} className="h-auto" />
              </div>
            ))
          )}
        </div>

        {/* 右侧列 */}
        <div className="bg-slate-800/50 border border-blue-500/30 rounded-lg p-0 overflow-hidden">
          <StatisticsCategory onCategorySelect={handleCategorySelect} />
          <SearchPanel onSearch={handleSearch} onReset={handleReset} />
        </div>
      </div>
    </div>
  )
}
