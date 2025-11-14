"use client"

import { useState } from 'react'
import { RealTimeCheckModal } from '@/components/real-time-check-modal'

export default function ExampleModalUsagePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedInspectionId, setSelectedInspectionId] = useState<string>('')

  const handleOpenModal = (inspectionId: string) => {
    setSelectedInspectionId(inspectionId)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">实时查验弹窗 - 使用示例</h1>
        
        <div className="bg-slate-800 rounded-lg p-6 space-y-4">
          <p className="text-slate-300 mb-4">点击下面的按钮打开实时查验详情弹窗：</p>
          
          <div className="grid grid-cols-2 gap-4">
            {/* 示例按钮 */}
            <button
              onClick={() => handleOpenModal('6145')}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              查看查验详情 #6145
            </button>
            
            <button
              onClick={() => handleOpenModal('6146')}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              查看查验详情 #6146
            </button>
            
            <button
              onClick={() => handleOpenModal('6147')}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              查看查验详情 #6147
            </button>
            
            <button
              onClick={() => handleOpenModal('6148')}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              查看查验详情 #6148
            </button>
          </div>

          <div className="mt-8 p-4 bg-slate-700 rounded">
            <h3 className="text-white font-bold mb-2">使用说明：</h3>
            <ul className="text-slate-300 space-y-2 text-sm">
              <li>• 点击任意按钮打开弹窗</li>
              <li>• 弹窗会根据传入的 inspectionId 获取对应的查验详情</li>
              <li>• 点击弹窗外部区域或右上角关闭按钮可关闭弹窗</li>
              <li>• 可以在弹窗内编辑数据并提交修改</li>
            </ul>
          </div>

          <div className="mt-6 p-4 bg-slate-700 rounded">
            <h3 className="text-white font-bold mb-2">组件使用代码：</h3>
            <pre className="text-xs text-cyan-300 overflow-x-auto">
{`import { RealTimeCheckModal } from '@/components/real-time-check-modal'

function YourComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [inspectionId, setInspectionId] = useState('')

  return (
    <>
      <button onClick={() => {
        setInspectionId('6145')
        setIsModalOpen(true)
      }}>
        打开弹窗
      </button>

      <RealTimeCheckModal
        inspectionId={inspectionId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}`}
            </pre>
          </div>
        </div>
      </div>

      {/* 弹窗组件 */}
      <RealTimeCheckModal
        inspectionId={selectedInspectionId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  )
}

