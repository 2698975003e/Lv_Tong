"use client"

import React, { useEffect, useState } from "react"
import { ImageBgButton } from "@/components/image-bg-button"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface StatisticsCategoryProps {
  onCategorySelect?: (category: string) => void
  className?: string
}

// API数据类型定义
interface FreightStatisticsApiResponse {
  code: number
  message: string
  data: {
    majorCategories: Array<{
      categoryCode: string
      categoryName: string
      vehicleCount: number
    }>
    minorCategories: Array<{
      categoryCode: string
      categoryName: string
      vehicleCount: number
    }>
  }
  timestamp: number
}

export function StatisticsCategory({ onCategorySelect, className }: StatisticsCategoryProps) {
  const router = useRouter()
  const [categories, setCategories] = useState([
    {
      id: "discount-amount",
      text: "减免金额统计",
      bgSrc: "/assets/Mask_Group.png",
      value: 0
    },
    {
      id: "transport-vehicle",
      text: "运输车辆统计", 
      bgSrc: "/assets/Mask_Group.png",
      value: 0
    },
    {
      id: "cargo-item",
      text: "货物单品统计",
      bgSrc: "/assets/Mask_Group.png",
      value: 0
    },
    {
      id: "cargo-category",
      text: "货物分类统计",
      bgSrc: "/assets/Mask_Group.png",
      value: 0
    },
    {
      id: "vehicle-route",
      text: "车辆路线统计",
      bgSrc: "/assets/Mask_Group.png",
      value: 0
    },
    {
      id: "vehicle-location",
      text: "车辆属地统计",
      bgSrc: "/assets/Mask_Group.png",
      value: 0
    }
  ])
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 获取货物统计数据
  useEffect(() => {
    const fetchFreightData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(
          'http://116.57.120.171:8081/api/api/freight/statistics?test=scutgreenpass',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result: FreightStatisticsApiResponse = await response.json()
        
        if (result.code === 200 && result.data.majorCategories) {
          // 计算总数
          const totalCount = result.data.majorCategories.reduce(
            (sum, category) => sum + category.vehicleCount, 
            0
          )
          
          // 更新 categories，将车辆数量转换为百分比
          const updatedCategories = categories.map((cat, index) => {
            // 根据index映射到对应的majorCategories
            if (result.data.majorCategories[index]) {
              const category = result.data.majorCategories[index]
              const percentage = totalCount > 0 
                ? ((category.vehicleCount / totalCount) * 100).toFixed(2)
                : '0.00'
              
              return {
                ...cat,
                text: `${cat.text.split('统计')[0]}统计`,
                value: parseFloat(percentage)
              }
            }
            return cat
          })
          
          setCategories(updatedCategories)
        } else {
          throw new Error(result.message || 'API返回错误')
        }
      } catch (err: any) {
        setError(err.message || '数据加载失败')
        console.error('获取货物统计失败:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchFreightData()
  }, [])

  const handleCategoryClick = (categoryId: string) => {
    onCategorySelect?.(categoryId)

    const map: Record<string, string> = {
      "discount-amount": "/withHeaded/3_JianMianJinE",
      "transport-vehicle": "/withHeaded/4_CheLiangTongJi",
      "cargo-item": "/withHeaded/6_DanPinTongJi",
      "vehicle-location": "/withHeaded/8_Car_Position",
    }

    const to = map[categoryId]
    if (to) router.push(to)
  }

  return (
    <div 
      className={`bg-slate-800/50 border border-blue-500/30 rounded-lg p-0 ${className || ''}`}
      style={{
        width: '460px',
        height: '234px'
      }}
    >
      {/* 标题 */}
      <Image
        src="/assets/Mask_Header.png"
        alt="Statistics Category"
        width={460}
        height={33}
        className="object-contain mb-5"
      />

      {loading ? (
        <div className="flex items-center justify-center h-full">
          <span className="text-slate-300">加载中...</span>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-full">
          <span className="text-red-400">加载失败: {error}</span>
        </div>
      ) : (
        /* 按钮网格 - 2行3列 */
        <div className="grid grid-cols-2 gap-3">
          {categories.map((category, index) => (
            <div key={category.id} className="flex justify-center">
              <ImageBgButton
                bgSrc={category.bgSrc}
                text={`${category.text}`}
                width={208}
                height={40}
                fontSize={14}
                stretch="cover"
                className="hover:shadow-cyan-400/30"
                onClick={() => handleCategoryClick(category.id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}