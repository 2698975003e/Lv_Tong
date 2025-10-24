'use client'

import { CheckDataTable } from "@/components/check-data-table";
import { ImageBgButton } from "@/components/image-bg-button"


// 定义按钮数据类型
interface ButtonData {
  text: string;
  onClick: () => void;
}

// 定义按钮行组件的props
interface ButtonRowProps {
  buttons: ButtonData[];
  bgSrc?: string;
  width?: string;
  height?: string;
  fontSize?: number;
  textClassName?: string;
  stretch?: "cover" | "contain" | "fill";
  className?: string;
}

// 按钮行组件
function ButtonRow({ 
  buttons, 
  bgSrc = "/assets/headerButton_Unchecked.png",
  width = "80px",
  height = "40px",
  fontSize = 18,
  textClassName = "text-[#00A3FF]",
  stretch = "cover",
  className = ""
}: ButtonRowProps) {
  return (
    <div className={`rounded p-2  flex gap-2 justify-end ${className}`}>
      {buttons.map((button, index) => (
        <ImageBgButton
          key={index}
          bgSrc={bgSrc}
          text={button.text}
          width={width}
          height={height}
          fontSize={fontSize}
          textClassName={textClassName}
          stretch={stretch}
          onClick={button.onClick}
        />
      ))}
    </div>
  );
}

export default function CheckPage() {
    // 定义四行按钮的数据
    const firstRowButtons: ButtonData[] = [
        { text: "平度", onClick: () => console.log('平度') },
        { text: "青岛", onClick: () => console.log('青岛') },
        { text: "济南", onClick: () => console.log('济南') },
        { text: "烟台", onClick: () => console.log('烟台') },
        { text: "威海", onClick: () => console.log('威海') },
        { text: "潍坊", onClick: () => console.log('潍坊') },
    ];

    const secondRowButtons: ButtonData[] = [
        { text: "淄博", onClick: () => console.log('淄博') },
        { text: "德州", onClick: () => console.log('德州') },
        { text: "聊城", onClick: () => console.log('聊城') },
        { text: "滨州", onClick: () => console.log('滨州') },
        { text: "东营", onClick: () => console.log('东营') },
        { text: "济宁", onClick: () => console.log('济宁') },
        { text: "泰安", onClick: () => console.log('泰安') },
    ];

    const thirdRowButtons: ButtonData[] = [
        { text: "临沂", onClick: () => console.log('临沂') },
        { text: "枣庄", onClick: () => console.log('枣庄') },
        { text: "日照", onClick: () => console.log('日照') },
        { text: "菏泽", onClick: () => console.log('菏泽') },
        { text: "莱芜", onClick: () => console.log('莱芜') },
    ];

    const fourthRowButtons: ButtonData[] = [
        { text: "济南", onClick: () => console.log('济南') },
        { text: "青岛", onClick: () => console.log('青岛') },
        { text: "烟台", onClick: () => console.log('烟台') },
        { text: "威海", onClick: () => console.log('威海') },

    ];

    return (
        <div className="h-[calc(100vh-100px)] bg-slate-900 p-0 flex flex-col">
            {/* 上下两行，高度比例 31:68 */}
            <div className="flex-1 grid grid-rows-[27fr_68fr] gap-4 min-h-0">
                {/* 第一行：两列，宽度比例 1400:460 */}
                <div className="row-start-1 grid grid-cols-[1400fr_460fr] gap-0 min-h-0">
                    <div className="relative bg-slate-800/50 border border-blue-500/30 rounded-lg p-1 overflow-hidden">
                        <div
                            className=" w-full h-[33px]"
                            style={{
                                backgroundImage: "url(/assets/Check_Header1.png)",
                                backgroundSize: "contain",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                            }}
                        />
                        <div className="h-[calc(100%-36px)] relative flex items-center justify-center  p-2 ">
                            <div className="w-full h-full   border border-gray-600/30 rounded grid grid-cols-[2fr_340px_2fr] gap-0 p-0.25">
                                {/* 左列 */}
                                <div className=" rounded p-0.25 grid grid-rows-2 gap-3">
                                    {/* 第一行 */}
                                    <ButtonRow buttons={firstRowButtons} className="pt-2" />
                                    {/* 第二行 */}
                                    <ButtonRow 
                                        buttons={secondRowButtons} 
                                        className="pt-0" 
                                    />
                                </div>
                                {/* 中列 */}
                                <div className="w-full h-[calc(100%-40px)] rounded p-0.25"
                                    style={{
                                        backgroundImage: "url(/assets/Check_1_2.png)",
                                        backgroundSize: "contain",
                                        backgroundPosition: "center",
                                        backgroundRepeat: "no-repeat",
                                    }}
                                >

                                </div>
                                {/* 右列 */}
                                <div className=" rounded p-0.25 grid grid-rows-2 gap-3">
                                    {/* 第一行 */}
                                    <ButtonRow 
                                        buttons={thirdRowButtons} 
                                        className="justify-start pt-2" 
                                    />
                                    {/* 第二行 */}
                                    <ButtonRow 
                                        buttons={fourthRowButtons} 
                                        className="pt-0 justify-start" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative bg-slate-800/50 border border-blue-500/30 rounded-lg p-1 overflow-hidden">
                        {/* 顶部标题条 */}
                        <div className="w-full h-[36px] flex items-center px-3 text-[#BFE1FF] tracking-widest text-sm"
                            style={{
                                backgroundImage: "linear-gradient(to right, rgba(5,20,52,0.9), rgba(5,20,52,0.25))",
                                boxShadow: "inset 0 0 0 1px rgba(59,130,246,0.3), 0 2px 8px rgba(0,0,0,0.25)"
                            }}
                        >
                            <span className="mr-2 text-cyan-400">›</span>
                            查验选择
                        </div>

                        {/* 面板主体 */}
                        <div className="h-[calc(100%-38px)] p-4 grid grid-rows-[auto_auto_auto_1fr_auto] gap-6">
                            {/* 行 1：时段 */}
                            <div className="flex items-center gap-4">
                                <span className="inline-flex h-[40px] min-w-[96px] items-center justify-center px-4 text-[14px] font-semibold text-cyan-200 rounded-sm border border-[#2B75F7] bg-[rgba(12,34,80,0.7)] shadow-[inset_0_0_10px_rgba(59,130,246,0.35)]">
                                    时 段
                                </span>
                                <div className="flex-1 h-[40px] rounded-sm border border-[#2B75F7] bg-[rgba(6,26,66,0.6)] px-3 text-[#BFE1FF] flex items-center justify-between shadow-[inset_0_0_10px_rgba(59,130,246,0.25)]">
                                    <span className="opacity-70 text-sm">请选择起始时间</span>
                                    <span className="ml-2 text-cyan-300">▾</span>
                                </div>
                                <div className="flex-1 h-[40px] rounded-sm border border-[#2B75F7] bg-[rgba(6,26,66,0.6)] px-3 text-[#BFE1FF] flex items-center justify-between shadow-[inset_0_0_10px_rgba(59,130,246,0.25)]">
                                    <span className="opacity-70 text-sm">请选择终点时间</span>
                                    <span className="ml-2 text-cyan-300">▾</span>
                                </div>
                            </div>

                            {/* 行 2：收费站 */}
                            <div className="flex items-center gap-4">
                                <span className="inline-flex h-[40px] min-w-[96px] items-center justify-center px-4 text-[14px] font-semibold text-cyan-200 rounded-sm border border-[#2B75F7] bg-[rgba(12,34,80,0.7)] shadow-[inset_0_0_10px_rgba(59,130,246,0.35)]">
                                    收费站
                                </span>
                                <div className="flex-1 h-[40px] rounded-sm border border-[#2B75F7] bg-[rgba(6,26,66,0.6)] px-3 text-[#BFE1FF] flex items-center justify-between shadow-[inset_0_0_10px_rgba(59,130,246,0.25)]">
                                    <span className="opacity-70 text-sm">请选择收费站</span>
                                    <span className="ml-2 text-cyan-300">▾</span>
                                </div>
                            </div>

                            {/* 底部操作按钮 */}
                            <div className="mt-auto flex items-center justify-center gap-10">
                                <ImageBgButton bgSrc="/assets/longBtn.png" text="统计" width="120px" height="48px" fontSize={18} stretch="cover" textClassName="text-white" />
                                <ImageBgButton bgSrc="/assets/longBtn.png" text="导出" width="120px" height="48px" fontSize={18} stretch="cover" textClassName="text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 第二行：占剩余高度 */}
                <div className="row-start-2 bg-slate-800/50 border border-blue-500/30 rounded-lg p-4">
                   <CheckDataTable></CheckDataTable>
                </div>
            </div>
        </div>
    )
}
