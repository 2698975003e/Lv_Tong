"use client"
import { ImageBgButton } from "./image-bg-button"

export function SiteHeader() {
  return (
    <div
      className="relative w-full h-[100px] flex items-center justify-between px-4"
      style={{
        backgroundImage: "url(/assets/Header.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Left side - Account Information */}
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-600/80 rounded-full border-2 border-white/50 shadow-lg">
        
        </div>
        <div className="flex flex-col">
          <span className="text-base font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] bg-transparent px-2 py-1 rounded">
            王运野
          </span>
          <span className="text-sm text-white/95 leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] bg-transparent px-2 py-0.5 rounded mt-1">
            青海省道路运输管理局稽查/分公司1分中心
          </span>
        </div>
      </div>

      {/* Center - Title (handled by background image) */}
      <div className="flex-1" />

      {/* Right side - Navigation Buttons */}
      <div className="flex items-center gap-4">
        <ImageBgButton
          bgSrc="/assets/headerButton_Checked.png"
          text="统计报表"
          width="112px"
          height="56px"
          fontSize={18}
          stretch="cover"
          onClick={() => {
            console.log('点击了统计报表')
          }}
        />

        <ImageBgButton
          bgSrc="/assets/headerButton_Unchecked.png"
          text="稽查稽核"
          width="112px"
          height="56px"
          fontSize={18}
          textClassName="text-[#00A3FF]"
          stretch="cover"
          onClick={() => {
            console.log('点击了稽查稽核')
          }}
        />

        <ImageBgButton
          bgSrc="/assets/headerButton_Unchecked.png"
          text="查验信息"
          width="112px"
          height="56px"
          textClassName="text-[#00A3FF]"
          fontSize={18}
          stretch="cover"
          onClick={() => {
            console.log('点击了查验信息')
          }}
        />
      </div>
    </div>
  )
}
