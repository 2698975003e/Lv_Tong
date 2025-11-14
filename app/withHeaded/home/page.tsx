"use client"

import { useEffect, useState } from "react"
import { VehicleStatsTable } from "@/components/dashboard/vehicle-stats-table"
import { WarningVehiclesTable } from "@/components/dashboard/warning-vehicles-table"
import { ChinaMap } from "@/components/dashboard/china-map"
import { ThreeDDonutChart } from "@/components/dashboard/vehicle-distribution-chart"
import { VehicleStatsDetailChart } from "@/components/dashboard/vehicle-stats-detail-chart"
import { WarningTrendChart } from "@/components/dashboard/warning-trend-chart"
import { RegionalDataChart } from "@/components/dashboard/regional-data-chart"

interface VehicleStatsApiResponse {
  code: number
  message: string
  data: {
    statisticsMonth: string
    totalVehicleCount: number
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
  timestamp: number
}

interface WarningVehiclesApiResponse {
  code: number
  message: string
  data: {
    statisticsMonth: string
    frequentVehicles: Array<{
      vehicleId: string
      passCount: number
    }>
  }
  timestamp: number
}

interface WarningTrendApiResponse {
  statisticsDate: string
  generatedAt: string
  currentHour: number
  totalInspectionCount: number
  hourlyStats: Array<{
    hour: string
    inspectionCount: number
  }>
}

// 车型分布数据的接口类型定义
interface VehicleDistributionApiResponse {
  code: number
  message: string
  data: {
    statisticsDate: string
    generatedAt: string
    totalVehicleCount: number
    types: Array<{
      rank: number
      vehicleType: number
      vehicleTypeName: string
      count: number
      percentage: number
    }>
  }
  timestamp: number
}

// 区域数据（站点减免统计）的接口类型定义
interface RegionalDataApiResponse {
  code: number
  message: string
  data: {
    statisticsDate: string
    totalStations: number
    stationDiscountStats: Array<{
      stationName: string
      discountAmount: number
      vehicleCount: number
    }>
  }
  timestamp: number
}

export default function HomePage() {
  const [vehicleStatsData, setVehicleStatsData] = useState<VehicleStatsApiResponse['data'] | null>(null)
  const [warningVehiclesData, setWarningVehiclesData] = useState<WarningVehiclesApiResponse['data'] | null>(null)
  const [warningTrendData, setWarningTrendData] = useState<WarningTrendApiResponse | null>(null)
  const [vehicleDistributionData, setVehicleDistributionData] = useState<VehicleDistributionApiResponse['data'] | null>(null)
  const [regionalData, setRegionalData] = useState<RegionalDataApiResponse['data'] | null>(null)
  
  const [vehicleStatsLoading, setVehicleStatsLoading] = useState(true)
  const [warningVehiclesLoading, setWarningVehiclesLoading] = useState(true)
  const [warningTrendLoading, setWarningTrendLoading] = useState(true)
  const [vehicleDistributionLoading, setVehicleDistributionLoading] = useState(true)
  const [regionalDataLoading, setRegionalDataLoading] = useState(true)
  
  const [vehicleStatsError, setVehicleStatsError] = useState<string | null>(null)
  const [warningVehiclesError, setWarningVehiclesError] = useState<string | null>(null)
  const [warningTrendError, setWarningTrendError] = useState<string | null>(null)
  const [vehicleDistributionError, setVehicleDistributionError] = useState<string | null>(null)
  const [regionalDataError, setRegionalDataError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    
    async function fetchVehicleStats() {
      try { 
        setVehicleStatsLoading(true)
        setVehicleStatsError(null)
        
        const response = await fetch(
          'http://116.57.120.171:8081/api/vehicle-stats/province-and-shandong-cities-top10?test=scutgreenpass&month=2024-11',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            signal: controller.signal,
          }
        )

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const apiResponse: VehicleStatsApiResponse = await response.json()
        
        if (apiResponse.code === 200) {
          setVehicleStatsData(apiResponse.data)
        } else {
          throw new Error(apiResponse.message || 'API返回错误')
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setVehicleStatsError(err.message || '数据加载失败')
        }
      } finally {
        setVehicleStatsLoading(false)
      }
    }

    // 立即执行一次
    fetchVehicleStats()
    
    // 设置10秒定时器
    const interval = setInterval(() => {
      fetchVehicleStats()
    }, 10000)

    return () => {
      clearInterval(interval)
      controller.abort()
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    
    async function fetchWarningVehicles() {
      try {
        setWarningVehiclesLoading(true)
        setWarningVehiclesError(null)
        
        const response = await fetch(
          'http://116.57.120.171:8081/api/vehicle-stats/frequent-vehicles-top10?month=2024-11&test=scutgreenpass',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            signal: controller.signal,
          }
        )

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const apiResponse: WarningVehiclesApiResponse = await response.json()
        
        if (apiResponse.code === 200) {
          setWarningVehiclesData(apiResponse.data)
        } else {
          throw new Error(apiResponse.message || 'API返回错误')
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setWarningVehiclesError(err.message || '数据加载失败')
        }
      } finally {
        setWarningVehiclesLoading(false)
      }
    }

    fetchWarningVehicles()
    
    const interval = setInterval(() => {
      fetchWarningVehicles()
    }, 10000)

    return () => {
      clearInterval(interval)
      controller.abort()
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    
    async function fetchWarningTrend() {
      try {
        setWarningTrendLoading(true)
        setWarningTrendError(null)
        
        const response = await fetch(
          'http://116.57.120.171:8081/api/api/station-stats/hourly-inspection-count?test=scutgreenpass&date=2024-11-01',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            signal: controller.signal,
          }
        )

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const apiResponse: WarningTrendApiResponse = await response.json()
        setWarningTrendData(apiResponse)
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setWarningTrendError(err.message || '数据加载失败')
        }
      } finally {
        setWarningTrendLoading(false)
      }
    }

    fetchWarningTrend()
    
    const interval = setInterval(() => {
      fetchWarningTrend()
    }, 10000)

    return () => {
      clearInterval(interval)
      controller.abort()
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    
    async function fetchVehicleDistribution() {
      try {
        setVehicleDistributionLoading(true)
        setVehicleDistributionError(null)
        
        const response = await fetch(
          'http://116.57.120.171:8081/api/vehicle-stats/daily-vehicle-type-percentage?date=2024-11-01&test=scutgreenpass',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            signal: controller.signal,
          }
        )

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const apiResponse: VehicleDistributionApiResponse = await response.json()
        
        if (apiResponse.code === 200) {
          setVehicleDistributionData(apiResponse.data)
        } else {
          throw new Error(apiResponse.message || 'API返回错误')
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setVehicleDistributionError(err.message || '数据加载失败')
        }
      } finally {
        setVehicleDistributionLoading(false)
      }
    }

    fetchVehicleDistribution()
    
    const interval = setInterval(() => {
      fetchVehicleDistribution()
    }, 10000)

    return () => {
      clearInterval(interval)
      controller.abort()
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    
    async function fetchRegionalData() {
      try {
        setRegionalDataLoading(true)
        setRegionalDataError(null)
        
        const response = await fetch(
          'http://116.57.120.171:8081/api/region-stats/daily-discount-summary?test=scutgreenpass',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            signal: controller.signal,
          }
        )

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const apiResponse: RegionalDataApiResponse = await response.json()
        
        if (apiResponse.code === 200) {
          setRegionalData(apiResponse.data)
        } else {
          throw new Error(apiResponse.message || 'API返回错误')
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setRegionalDataError(err.message || '数据加载失败')
        }
      } finally {
        setRegionalDataLoading(false)
      }
    }

    fetchRegionalData()
    
    const interval = setInterval(() => {
      fetchRegionalData()
    }, 10000)

    return () => {
      clearInterval(interval)
      controller.abort()
    }
  }, [])

  return (
    <div className="h-[calc(100vh-100px)] bg-slate-900 p-4 flex flex-col">
      {/* 主网格：两行，比例 2:1 */}
      <div className="flex-1 grid grid-cols-12 grid-rows-[2fr_1fr] gap-4 min-h-0">
        {/* 第一行：上中右三列 */}
        <div className="col-span-12 row-start-1 grid grid-cols-12 gap-4 min-h-0">
          {/* Left column - Tables */}
          <div className="col-span-3 flex flex-col gap-4 min-h-0">
            <div className="flex-1 min-h-0">
              {vehicleStatsLoading ? (
                <div className="h-full flex items-center justify-center text-slate-300">
                  数据加载中...
                </div>
              ) : vehicleStatsError ? (
                <div className="h-full flex items-center justify-center text-red-400">
                  加载失败: {vehicleStatsError}
                </div>
              ) : vehicleStatsData ? (
                <VehicleStatsTable apiData={vehicleStatsData} />
              ) : null}
            </div>
            <div className="flex-1 min-h-0">
              {warningVehiclesLoading ? (
                <div className="h-full flex items-center justify-center text-slate-300">
                  数据加载中...
                </div>
              ) : warningVehiclesError ? (
                <div className="h-full flex items-center justify-center text-red-400">
                  加载失败: {warningVehiclesError}
                </div>
              ) : warningVehiclesData ? (
                <WarningVehiclesTable apiData={warningVehiclesData} />
              ) : null}
            </div>
          </div>

          {/* Center column - Map */}
          <div className="col-span-6 min-h-0">
            <ChinaMap />
          </div>

          {/* Right column - Charts */}
          <div className="col-span-3 flex flex-col gap-4 min-h-0">
            <div className="flex-1 min-h-0">
              {vehicleDistributionLoading ? (
                <div className="h-full flex items-center justify-center text-slate-300">
                  数据加载中...
                </div>
              ) : vehicleDistributionError ? (
                <div className="h-full flex items-center justify-center text-red-400">
                  加载失败: {vehicleDistributionError}
                </div>
              ) : vehicleDistributionData ? (
                <ThreeDDonutChart data={vehicleDistributionData} />
              ) : (
                <ThreeDDonutChart />
              )}
            </div>
            <div className="flex-1 min-h-0">
              <VehicleStatsDetailChart />
            </div>
          </div>
        </div>

        {/* 第二行：底部两块 */}
        <div className="col-span-12 row-start-2 grid grid-cols-[788fr_1100fr] gap-4 min-h-0">
          <div className="h-full min-h-0">
            {warningTrendLoading ? (
              <div className="h-full flex items-center justify-center text-slate-300">
                数据加载中...
              </div>
            ) : warningTrendError ? (
              <div className="h-full flex items-center justify-center text-red-400">
                加载失败: {warningTrendError}
              </div>
            ) : warningTrendData ? (
              <WarningTrendChart apiData={warningTrendData} />
            ) : null}
          </div>
          <div className="h-full min-h-0">
            {regionalDataLoading ? (
              <div className="h-full flex items-center justify-center text-slate-300">
                数据加载中...
              </div>
            ) : regionalDataError ? (
              <div className="h-full flex items-center justify-center text-red-400">
                加载失败: {regionalDataError}
              </div>
            ) : regionalData ? (
              <RegionalDataChart apiData={regionalData} />
            ) : (
              <RegionalDataChart />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
