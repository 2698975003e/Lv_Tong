"use client"

import React from "react"
import { ImageBgButton } from "@/components/image-bg-button"
import Image from "next/image"
interface StatisticsCategoryProps {
  onCategorySelect?: (category: string) => void
  className?: string
}

export function StatisticsCategory({ onCategorySelect, className }: StatisticsCategoryProps) {
  const categories = [
    {
      id: "discount-amount",
      text: "减免金额统计",
      bgSrc: "/assets/Mask_Group.png"
    },
    {
      id: "transport-vehicle",
      text: "运输车辆统计", 
      bgSrc: "/assets/Mask_Group.png"
    },
    {
      id: "cargo-item",
      text: "货物单品统计",
      bgSrc: "/assets/Mask_Group.png"
    },
    {
      id: "cargo-category",
      text: "货物分类统计",
      bgSrc: "/assets/Mask_Group.png"
    },
    {
      id: "vehicle-route",
      text: "车辆路线统计",
      bgSrc: "/assets/Mask_Group.png"
    },
    {
      id: "vehicle-location",
      text: "车辆属地统计",
      bgSrc: "/assets/Mask_Group.png"
    }
  ]

  const handleCategoryClick = (categoryId: string) => {
    if (onCategorySelect) {
      onCategorySelect(categoryId)
    }
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

      {/* 按钮网格 - 2行3列 */}
      <div className="grid grid-cols-2 gap-3">
        {categories.map((category, index) => (
          <div key={category.id} className="flex justify-center">
            <ImageBgButton
              bgSrc={category.bgSrc}
              text={category.text}
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
    </div>
  )
}