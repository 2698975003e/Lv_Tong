"use client"
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import localFont from 'next/font/local'

const youSheBiaoTiHei = localFont({
  src: '../../fonts/YouSheBiaoTiHei-2.ttf',  // 从 ../fonts/ 改为 ../../fonts/
  display: 'swap'
})

const pingFangSC = localFont({
  src: '../../fonts/PingFang SC Regular.ttf',  // 从 ../fonts/ 改为 ../../fonts/
  display: 'swap'
})

const alibabaPuHuiTiM = localFont({
  src: '../../fonts/Alibaba PuHuiTi M.ttf',  // 从 ../fonts/ 改为 ../../fonts/
  display: 'swap'
})

export default function RealTimeCheckPage() {
  // 获取 URL 查询参数
  const searchParams = useSearchParams()
  const inspectionId = searchParams.get('inspaectionId') // 注意：URL中的拼写
  
  // 状态管理 - 存储所有字段的值
  const [formData, setFormData] = useState({
    查验时间: "2025-03-01 08:00",
    查验结果: "18798357935",
    不合格类型: "",
    入口站编号: "",
    满载率: "90%",
    车牌号码: "",
    出口站编号: "",
    货物名称: "水果",
    交易支付方式: "",
    出口交易时间: "2025-03-01 08:00",
    入口重量: "300 KM",
    车辆状态标识: "",
    总交易金额: "XXXXX 元",
    出口重量: "300 KM",
    查验依据: "",
    车货长宽高: "",
    应收金额: "XXXXX元",
    货箱类型: "",
    通行省份个数: "2个",
    班组编号: "2个",
    司机电话: "18798357935",
    通行介质: "",
    出口交易编号: "XXXXX XXXXX XXXXX XXXXX XXXXX XXXXX",
    车型: "",
    复核: "",
    通行标识符10: "XXXXX XXXXX XXXXX XXXXX XXXXX XXXXX",
    车种: "",
    查验: "",
    备注内容: ""
  })

  // 原始数据 - 用于对比修改
  const [originalData, setOriginalData] = useState({
    查验时间: "2025-03-01 08:00",
    查验结果: "18798357935",
    不合格类型: "",
    入口站编号: "",
    满载率: "90%",
    车牌号码: "",
    出口站编号: "",
    货物名称: "水果",
    交易支付方式: "",
    出口交易时间: "2025-03-01 08:00",
    入口重量: "300 KM",
    车辆状态标识: "",
    总交易金额: "XXXXX 元",
    出口重量: "300 KM",
    查验依据: "",
    车货长宽高: "",
    应收金额: "XXXXX元",
    货箱类型: "",
    通行省份个数: "2个",
    班组编号: "2个",
    司机电话: "18798357935",
    通行介质: "",
    出口交易编号: "XXXXX XXXXX XXXXX XXXXX XXXXX XXXXX",
    车型: "",
    复核: "",
    通行标识符10: "XXXXX XXXXX XXXXX XXXXX XXXXX XXXXX",
    车种: "",
    查验: "",
    备注内容: ""
  })

  // 更新字段值
  const handleFieldChange = (label: string, value: string) => {
    setFormData(prev => ({ ...prev, [label]: value }))
  }

  // 根据 inspectionId 
  useEffect(() => {
    if (inspectionId) fetchInspectionData()
  }, [inspectionId])

  // 获取查验数据
  const fetchInspectionData = async () => {
    try {
      const response = await fetch(
        `http://116.57.120.171:8081/api/api/inspection/detail/${inspectionId}?test=scutgreenpass`
      )

      if (!response.ok) return

      const result = await response.json()

      if (result.code === 200 && result.data) {
        const apiData = result.data
        
        const mappedData = {
          // 基础信息
          查验时间: apiData.checkTime || "",
          查验结果: apiData.checkResultText || (apiData.checkResult === 0 ? "合格" : "不合格"),
          不合格类型: mapValueToLabel('不合格类型', apiData.reason || ""),
          
          // 车辆信息
          车牌号码: apiData.vehicleId?.split('_')[0] || "",
          司机电话: apiData.driverTelephone || "",
          车型: mapValueToLabel('车型', apiData.vehicleType?.toString() || ""),
          车种: mapValueToLabel('车种', apiData.vehicleClass?.toString() || ""),
          车辆状态标识: mapValueToLabel('车辆状态标识', apiData.vehicleSign || ""),
          货箱类型: mapValueToLabel('货箱类型', apiData.crateType || ""),
          车货长宽高: apiData.vehicleSize || "",
          
          // 货物信息
          货物名称: apiData.freightTypesText || apiData.freightTypes || "",
          满载率: apiData.fullLoadRate ? `${apiData.fullLoadRate}%` : "",
          
          // 重量信息
          查验依据: mapValueToLabel('查验依据', apiData.checkBasis || "1"),
          入口重量: apiData.enWeight ? `${apiData.enWeight} KG` : "",
          出口重量: apiData.exWeight ? `${apiData.exWeight} KG` : "",
          
          // 站点信息
          入口站编号: apiData.enStationId || "",
          出口站编号: apiData.exStationId || "",
          
          // 交易信息
          出口交易时间: apiData.exTime || "",
          出口交易编号: apiData.transactionId || "",
          通行标识符10: apiData.passId || "",
          通行介质: mapValueToLabel('通行介质', apiData.mediaType?.toString() || ""),
          交易支付方式: mapValueToLabel('交易支付方式', apiData.transPayType?.toString() || ""),
          总交易金额: apiData.fee ? `${(apiData.fee / 100).toFixed(2)}元` : "",
          应收金额: apiData.payFee ? `${(apiData.payFee / 100).toFixed(2)}元` : "",
          通行省份个数: apiData.provinceCount ? `${apiData.provinceCount}个` : "",
          
          // 其他信息
          班组编号: apiData.groupId ? `${apiData.groupId}个` : "",
          查验: mapValueToLabel('查验', apiData.inspector || ""),
          复核: mapValueToLabel('复核', apiData.reviewer || ""),
          备注内容: apiData.memo || ""
        }
        
        setFormData(mappedData)
        setOriginalData(mappedData)
      }
    } catch (err) {
      // 静默失败
    }
  }

  // 预编译正则表达式（避免重复创建）
  // 注意：replace() 方法不会有 lastIndex 问题，可以安全使用 g 标志
  const REGEX_PERCENT = /%/g
  const REGEX_KG = /\s*KG/gi
  const REGEX_YUAN = /[元\s]/g
  const REGEX_GE = /个/g

  // 下拉框字段集合（使用Set优化查找性能）
  const DROPDOWN_FIELDS = new Set([
    '不合格类型', '交易支付方式', '车辆状态标识', '查验依据', 
    '货箱类型', '通行介质', '车型', '车种', '复核', '查验'
  ])

  // 前端字段名到后端字段名的映射（完整版）
  const fieldMapping: Record<string, { backendField: string; fieldType: string; readonly?: boolean }> = {
    // 基础信息
    '查验时间': { backendField: 'checkTime', fieldType: 'CHECK_RESULT', readonly: true },
    '查验结果': { backendField: 'checkResult', fieldType: 'CHECK_RESULT' },
    '不合格类型': { backendField: 'reason', fieldType: 'CHECK_RESULT' },
    
    // 车辆信息
    '车牌号码': { backendField: 'vehicleId', fieldType: 'VEHICLE_INFO' },
    '司机电话': { backendField: 'driverTelephone', fieldType: 'VEHICLE_INFO' },
    '车型': { backendField: 'vehicleType', fieldType: 'VEHICLE_INFO' },
    '车种': { backendField: 'vehicleClass', fieldType: 'VEHICLE_INFO' },
    '车辆状态标识': { backendField: 'vehicleSign', fieldType: 'VEHICLE_INFO' },
    '货箱类型': { backendField: 'crateType', fieldType: 'VEHICLE_INFO' },
    '车货长宽高': { backendField: 'vehicleSize', fieldType: 'VEHICLE_INFO' },
    
    // 货物信息
    '货物名称': { backendField: 'freightTypes', fieldType: 'FREIGHT_INFO' },
    '满载率': { backendField: 'fullLoadRate', fieldType: 'FREIGHT_INFO' },
    
    // 重量信息
    '查验依据': { backendField: 'checkBasis', fieldType: 'WEIGHT_INFO' },
    '入口重量': { backendField: 'enWeight', fieldType: 'WEIGHT_INFO' },
    '出口重量': { backendField: 'exWeight', fieldType: 'WEIGHT_INFO' },
    
    // 站点信息
    '入口站编号': { backendField: 'enStationId', fieldType: 'STATION_INFO' },
    '出口站编号': { backendField: 'exStationId', fieldType: 'STATION_INFO' },
    
    // 交易信息
    '出口交易时间': { backendField: 'exTime', fieldType: 'TRANSACTION_INFO', readonly: true },
    '出口交易编号': { backendField: 'transactionId', fieldType: 'TRANSACTION_INFO', readonly: true },
    '通行标识符10': { backendField: 'passId', fieldType: 'TRANSACTION_INFO', readonly: true },
    '通行介质': { backendField: 'mediaType', fieldType: 'TRANSACTION_INFO' },
    '交易支付方式': { backendField: 'transPayType', fieldType: 'TRANSACTION_INFO' },
    '总交易金额': { backendField: 'fee', fieldType: 'TRANSACTION_INFO' },
    '应收金额': { backendField: 'payFee', fieldType: 'TRANSACTION_INFO' },
    '通行省份个数': { backendField: 'provinceCount', fieldType: 'TRANSACTION_INFO' },
    
    // 其他信息
    '班组编号': { backendField: 'groupId', fieldType: 'OTHER_INFO' },
    '查验': { backendField: 'inspector', fieldType: 'OTHER_INFO' },
    '复核': { backendField: 'reviewer', fieldType: 'OTHER_INFO' },
    '备注内容': { backendField: 'memo', fieldType: 'OTHER_INFO' },
  }

  // 值转换函数（提取公共逻辑，避免重复）
  const convertFieldValue = (frontendField: string, value: string): string => {
    // 早期退出：空值直接返回
    if (!value) return ''

    // 下拉框字段
    if (DROPDOWN_FIELDS.has(frontendField)) {
      return mapLabelToValue(frontendField, value)
    }

    // 使用switch优化多条件判断
    switch (frontendField) {
      case '查验结果':
        return value === '合格' ? '1' : '2'
      
      case '满载率':
        return value.replace(REGEX_PERCENT, '').trim()
      
      case '入口重量':
      case '出口重量':
        return value.replace(REGEX_KG, '').trim()
      
      case '总交易金额':
      case '应收金额':
        // 金额转换为分
        const amount = parseFloat(value.replace(REGEX_YUAN, '').trim() || '0')
        return Math.round(amount * 100).toString()
      
      case '通行省份个数':
      case '班组编号':
        return value.replace(REGEX_GE, '').trim()
      
      case '车牌号码':
        // 车牌号码保持原样（后端需要完整格式）
        return value
      
      default:
        return value
    }
  }

  // 修改数据并提交
  const handleSave = async () => {
    if (!inspectionId) return

    // 找出修改的字段
    const modifyFields = Object.keys(formData).reduce<Array<{
      fieldName: string
      oldValue: string
      newValue: string
      fieldType: string
    }>>((acc, frontendField) => {
      const currentValue = formData[frontendField as keyof typeof formData]
      const originalValue = originalData[frontendField as keyof typeof originalData]
      
      // 跳过：无变化、无映射、只读字段
      if (currentValue === originalValue || !fieldMapping[frontendField]) return acc
      
      const { backendField, fieldType, readonly } = fieldMapping[frontendField]
      if (readonly) return acc

      // 转换值
      acc.push({
        fieldName: backendField,
        oldValue: convertFieldValue(frontendField, originalValue) || "",
        newValue: convertFieldValue(frontendField, currentValue) || "",
        fieldType: fieldType
      })

      return acc
    }, [])

    // 无修改则退出
    if (modifyFields.length === 0) return

    // 构建请求数据
    const requestData = {
      inspectionId: parseInt(inspectionId),
      changeReason: "数据修正",
      modifyFields
    }

    try {
      const token = localStorage.getItem('token') || 'your-token-here'
      
      const response = await fetch('http://116.57.120.171:8081/api/api/inspection/modify?test=scutgreenpass', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      })

      const result = await response.json()

      if (response.ok && result.code === 200) {
        setOriginalData({ ...formData })
      }
    } catch (err) {
      // 静默失败
    }
  }

  // 保存为 JSON 文件
  const handleSaveJson = () => {
    const jsonString = JSON.stringify(formData, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `实时查验数据_${new Date().getTime()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950">
      {/* 页面标题栏 - 使用 headBar.png 作为背景 */}
      <div className="px-6" style={{ marginTop: '-20px' }}>
        <div 
          className="relative"
          style={{
            backgroundImage: 'url(/assets/headBar.png)',
            backgroundSize: 'contain',
            backgroundPosition: 'left center',
            backgroundRepeat: 'no-repeat',
            height: '80px',
            width: '100%',
            maxWidth: '1800px'
          }}
        />
      </div>

      {/* 内容区域 */}
      <div className="relative z-15 px-6 pb-4 flex gap-4 items-start" style={{ marginTop: '-20px' }}>
        {/* 左侧主要内容 */}
        <div className="flex-1 space-y-4" style={{ maxWidth: '1240px' }}>
        {/* 详情照片区域 */}
        <div className="space-y-2" style={{ marginTop: '4px' }}>
          {/* 详情照片标题 */}
          <h2 className={`${youSheBiaoTiHei.className} font-medium text-white px-2`} style={{ fontSize: '16px' }}>
            详情照片
          </h2>

          {/* 5张小图：1240x145px */}
          <div 
            className="flex gap-2.5"
            style={{ 
              width: '1240px', 
              height: '128px' 
            }}
          >
            {/* 5个容器，每个 240x128px */}
            {[1, 2, 3, 4, 5].map((index) => (
              <div
                key={index}
                className="relative bg-slate-900/70 backdrop-blur-sm border border-cyan-500/40 rounded-lg overflow-hidden hover:border-cyan-400/60 transition-colors cursor-pointer"
                style={{ 
                  width: '240px', 
                  height: '128px' 
                }}
              >
                <Image
                  src="/assets/carFace.png"
                  alt={`详情照片 ${index}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 图像区域 - 两张并排 */}
        <div className="flex gap-1.5 items-start">
          {/* 车身侧面图像 */}
          <div 
            className="relative bg-slate-900/70 backdrop-blur-sm border border-cyan-500/40 rounded-lg hover:border-cyan-400/60 transition-colors"
            style={{ 
              width: '618px', 
              height: '234px',
              padding: '12px'
            }}
          >
            {/* 标题 - 左上角 */}
            <h3 className={`${youSheBiaoTiHei.className} font-medium text-white mb-2`} style={{ fontSize: '16px' }}>
              车身侧面图像
            </h3>
            
            {/* 图片显示区域 594×187 */}
            <div 
              className="relative overflow-hidden rounded"
              style={{ 
                width: '594px', 
                height: '187px',
                marginTop: '-8px'
              }}
            >
              <Image
                src="/assets/carSide.png"
                alt="车身侧面图像"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* X摄像图像 */}
          <div 
            className="relative bg-slate-900/70 backdrop-blur-sm border border-cyan-500/40 rounded-lg hover:border-cyan-400/60 transition-colors"
            style={{ 
              width: '618px', 
              height: '234px',
              padding: '12px'
            }}
          >
            {/* 标题 - 左上角 */}
            <h3 className={`${youSheBiaoTiHei.className} font-medium text-white mb-2`} style={{ fontSize: '16px' }}>
              X摄像图像
            </h3>
            
            {/* 图片显示区域 594×187 */}
            <div 
              className="relative overflow-hidden rounded"
              style={{ 
                width: '594px', 
                height: '187px',
                marginTop: '-8px'
              }}
            >
              <Image
                src="/assets/xrayImage.png"
                alt="X摄像图像"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* 信息编辑框区域 - 独立布局 */}
        <div className="space-y-2">
          {/* 第一行 */}
          <div className="flex gap-2.5 items-center">
            <InfoField label="查验时间" value={formData.查验时间} width={426} onChange={(val) => handleFieldChange("查验时间", val)} />
            <InfoField label="查验结果" value={formData.查验结果} width={340.16} onChange={(val) => handleFieldChange("查验结果", val)} />
            <InfoField label="不合格类型" value={formData.不合格类型} width={426} dropdown onChange={(val) => handleFieldChange("不合格类型", val)} />
          </div>

          {/* 第二行 */}
          <div className="flex gap-2.5 items-center">
            <InfoField label="入口站编号" value={formData.入口站编号} width={426} onChange={(val) => handleFieldChange("入口站编号", val)} />
            <InfoField label="满载率" value={formData.满载率} width={340.16} onChange={(val) => handleFieldChange("满载率", val)} />
            <InfoField label="车牌号码" value={formData.车牌号码} width={426} withButton onChange={(val) => handleFieldChange("车牌号码", val)} />
          </div>

          {/* 第三行 */}
          <div className="flex gap-2.5 items-center">
            <InfoField label="出口站编号" value={formData.出口站编号} width={426} onChange={(val) => handleFieldChange("出口站编号", val)} />
            <InfoField label="货物名称" value={formData.货物名称} width={340.16} onChange={(val) => handleFieldChange("货物名称", val)} />
            <InfoField label="交易支付方式" value={formData.交易支付方式} width={426} dropdown onChange={(val) => handleFieldChange("交易支付方式", val)} />
          </div>

          {/* 第四行 */}
          <div className="flex gap-2.5 items-center">
            <InfoField label="出口交易时间" value={formData.出口交易时间} width={426} onChange={(val) => handleFieldChange("出口交易时间", val)} />
            <InfoField label="入口重量" value={formData.入口重量} width={340.16} onChange={(val) => handleFieldChange("入口重量", val)} />
            <InfoField label="车辆状态标识" value={formData.车辆状态标识} width={426} dropdown onChange={(val) => handleFieldChange("车辆状态标识", val)} />
          </div>

          {/* 第五行 */}
          <div className="flex gap-2.5 items-center">
            <InfoField label="总交易金额" value={formData.总交易金额} width={426} onChange={(val) => handleFieldChange("总交易金额", val)} />
            <InfoField label="出口重量" value={formData.出口重量} width={340.16} onChange={(val) => handleFieldChange("出口重量", val)} />
            <InfoField label="查验依据" value={formData.查验依据} width={426} dropdown onChange={(val) => handleFieldChange("查验依据", val)} />
          </div>

          {/* 第六行 - 车辆长度 */}
          <div className="flex gap-2.5 items-center">
            <InfoField label="车货长宽高" value={formData.车货长宽高} width={426} onChange={(val) => handleFieldChange("车货长宽高", val)} customBg="/assets/HWBox.png" isHWBox />
            <InfoField label="应收金额" value={formData.应收金额} width={340.16} onChange={(val) => handleFieldChange("应收金额", val)} />
            <InfoField label="货箱类型" value={formData.货箱类型} width={426} dropdown onChange={(val) => handleFieldChange("货箱类型", val)} />
          </div>

          {/* 第七行 - 操作符个数 */}
          <div className="flex gap-2.5 items-center">
            <div className="flex gap-2.5">
              <InfoField label="通行省份个数" value={formData.通行省份个数} width={209} onChange={(val) => handleFieldChange("通行省份个数", val)} customBg="/assets/operation_nums.png" labelWidth="50%" />
              <InfoField label="班组编号" value={formData.班组编号} width={209} onChange={(val) => handleFieldChange("班组编号", val)} customBg="/assets/operation_num2.png" labelWidth="45%" />
            </div>
            <InfoField label="司机电话" value={formData.司机电话} width={340.16} onChange={(val) => handleFieldChange("司机电话", val)} />
            <InfoField label="通行介质" value={formData.通行介质} width={426} dropdown onChange={(val) => handleFieldChange("通行介质", val)} />
          </div>

          {/* 第八行 - 进口交易编号 */}
          <div className="flex gap-2.5 items-center">
            <InfoField label="出口交易编号" value={formData.出口交易编号} width={618} onChange={(val) => handleFieldChange("出口交易编号", val)} />
            <div className="flex gap-2.5">
              <InfoField label="车型" value={formData.车型} width={287} dropdown onChange={(val) => handleFieldChange("车型", val)} />
              <InfoField label="复核" value={formData.复核} width={287} dropdown onChange={(val) => handleFieldChange("复核", val)} />
            </div>
          </div>

          {/* 第九行 - 操作新项目 */}
          <div className="flex gap-2.5 items-center">
            <InfoField label="通行标识符10" value={formData.通行标识符10} width={618} onChange={(val) => handleFieldChange("通行标识符10", val)} />
            <div className="flex gap-2.5">
              <InfoField label="车种" value={formData.车种} width={287} dropdown onChange={(val) => handleFieldChange("车种", val)} />
              <InfoField label="查验" value={formData.查验} width={287} dropdown onChange={(val) => handleFieldChange("查验", val)} />
            </div>
          </div>

          {/* 第十行 - 备注内容 */}
          <div className="flex gap-2.5 items-center">
            <InfoField label="备注内容" value={formData.备注内容} width={1210} isBeiZhu onChange={(val) => handleFieldChange("备注内容", val)} />
          </div>
        </div>

        {/* 底部操作按钮 */}
        <div className="flex justify-center gap-6" style={{ marginTop: '16px' }}>
          <button
            className={`${alibabaPuHuiTiM.className} relative text-cyan-400 font-medium transition-all duration-300 hover:scale-105 hover:brightness-110 active:scale-95 flex items-center justify-center cursor-pointer`}
            style={{
              backgroundImage: 'url(/assets/modify.png)',
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              width: '180px',
              height: '60px',
              fontSize: '20px'
            }}
            onClick={handleSave}
          >
            修改
          </button>
          <button
            className={`${alibabaPuHuiTiM.className} relative text-cyan-400 font-medium transition-all duration-300 hover:scale-105 hover:brightness-110 active:scale-95 flex items-center justify-center cursor-pointer`}
            style={{
              backgroundImage: 'url(/assets/return.png)',
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              width: '180px',
              height: '60px',
              fontSize: '20px'
            }}
            onClick={() => window.history.back()}
          >
            返回
          </button>
        </div>
        </div>

        {/* 右侧图像区域 - 两列六行 */}
        <div className="flex flex-col gap-2.5" style={{ marginTop: '48px', flexShrink: 0 }}>
          {[...Array(6)].map((_, rowIndex) => (
            <div key={rowIndex} className="flex gap-2.5">
              {[1, 2].map((colIndex) => (
                <div
                  key={colIndex}
                  className="relative bg-slate-900/70 backdrop-blur-sm border border-cyan-500/40 rounded-lg overflow-hidden hover:border-cyan-400/60 transition-colors cursor-pointer"
                  style={{ 
                    width: '240px', 
                    height: '128px' 
                  }}
                >
                  <Image
                    src="/assets/carFace.png"
                    alt={`图片 ${rowIndex * 2 + colIndex + 6}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// 下拉框选项配置（根据接口文档）
const dropdownOptionsConfig: Record<string, Array<{ value: string; label: string }>> = {
  '不合格类型': [
    // 绿通车不合格类型（11-26，排除16、17）
    { value: '11', label: '车货总质量超限' },
    { value: '12', label: '外廊尺寸超限' },
    { value: '13', label: '货物非《目录》内' },
    { value: '14', label: '货物属深加工产品' },
    { value: '15', label: '货物冷冻发硬、腐烂、变质' },
    { value: '18', label: '未达核定载质量和车厢容积80%以上' },
    { value: '19', label: '混装非鲜活农产品' },
    { value: '20', label: '混装《目录》外鲜活农产品超20%' },
    { value: '21', label: '假冒绿通' },
    { value: '22', label: '未提供行驶证原件（含电子证件）' },
    { value: '23', label: '提供的电子证件无法核定载质量' },
    { value: '24', label: '行驶证过期' },
    { value: '25', label: '行驶证标注"仅可运送不可拆解物体"' },
    { value: '26', label: '无动物检疫合格证明、证明过期、证明信息与实际不符' },
    // 联合收割机不合格类型（31-42，排除36、37）
    { value: '31', label: '《作业证》无效' },
    { value: '33', label: '车货总质量超限' },
    { value: '34', label: '外廓尺寸超限' },
    { value: '35', label: '收割机未悬挂正式号牌' },
    { value: '38', label: '混装其他物品（必要配件除外）' },
    { value: '39', label: '无《作业证》' },
    { value: '40', label: '未提供行驶证原件（含电子证件）' },
    { value: '41', label: '提供的电子证件无法核定载质量' },
    { value: '42', label: '行驶证过期' },
  ],
  '交易支付方式': [
    { value: '1', label: '出口ETC通行' },
    { value: '2', label: '出口ETC刷卡通行' },
  ],
  '车辆状态标识': [
    { value: '0x02', label: '绿通车' },
    { value: '0x03', label: '联合收割机' },
    { value: '0xFF', label: '默认值' },
  ],
  '查验依据': [
    { value: '1', label: '入口称重' },
    { value: '2', label: '出口称重' },
  ],
  '货箱类型': [
    { value: '1', label: '罐式货车' },
    { value: '2.1', label: '敞篷货车（平板式）' },
    { value: '2.2', label: '敞篷货车（栅栏式）' },
    { value: '3.1', label: '普通货车（篷布包裹式）' },
    { value: '4.1', label: '厢式货车（封闭货车）' },
    { value: '5.1', label: '特殊结构货车（水箱式）' },
  ],
  '通行介质': [
    { value: '1', label: 'OBU' },
    { value: '2', label: 'CPC卡' },
    { value: '3', label: '纸券' },
    { value: '4', label: 'M1卡' },
    { value: '9', label: '无通行介质' },
  ],
  '车型': [
    { value: '11', label: '一型货车' },
    { value: '12', label: '二型货车' },
    { value: '13', label: '三型货车' },
    { value: '14', label: '四型货车' },
    { value: '15', label: '五型货车' },
    { value: '16', label: '六型货车' },
  ],
  '车种': [
    { value: '2', label: '绿通车' },
    { value: '3', label: '联合收割机' },
  ],
  '复核': [
    { value: '1', label: '已复核' },
    { value: '0', label: '未复核' },
  ],
  '查验': [
    { value: '1', label: '已查验' },
    { value: '0', label: '未查验' },
  ],
}

// 获取下拉框选项（内联优化）
function getDropdownOptions(label: string): Array<{ value: string; label: string }> {
  return dropdownOptionsConfig[label] || []
}

// 创建映射缓存（避免重复查找）
const valueLabelCache = new Map<string, Map<string, string>>()
const labelValueCache = new Map<string, Map<string, string>>()

// 初始化缓存
Object.keys(dropdownOptionsConfig).forEach(fieldName => {
  const options = dropdownOptionsConfig[fieldName]
  
  // value -> label 缓存
  const vlMap = new Map<string, string>()
  options.forEach(opt => vlMap.set(opt.value, opt.label))
  valueLabelCache.set(fieldName, vlMap)
  
  // label -> value 缓存
  const lvMap = new Map<string, string>()
  options.forEach(opt => lvMap.set(opt.label, opt.value))
  labelValueCache.set(fieldName, lvMap)
})

// 将后端值映射为下拉框显示文本（使用缓存优化）
function mapValueToLabel(fieldName: string, value: string): string {
  if (!value) return ''
  
  const cache = valueLabelCache.get(fieldName)
  if (!cache) return value
  
  return cache.get(value) || value
}

// 将下拉框显示文本映射回后端值（使用缓存优化）
function mapLabelToValue(fieldName: string, label: string): string {
  if (!label) return ''
  
  const cache = labelValueCache.get(fieldName)
  if (!cache) return label
  
  return cache.get(label) || label
}

// 信息字段组件
function InfoField({ label, value, width, dropdown = false, isBeiZhu = false, onChange, customBg, isHWBox = false, labelWidth, withButton = false }: { label: string; value: string; width: number; dropdown?: boolean; isBeiZhu?: boolean; onChange?: (value: string) => void; customBg?: string; isHWBox?: boolean; labelWidth?: string; withButton?: boolean }) {
  // 车辆长宽高特殊处理 - 三个输入框
  if (isHWBox) {
    const [length, setLength] = useState('')
    const [widthVal, setWidthVal] = useState('')
    const [height, setHeight] = useState('')

    // 从外部 value 初始化内部状态
    useEffect(() => {
      if (value && value.includes('|')) {
        const parts = value.split('|')
        setLength(parts[0] || '')
        setWidthVal(parts[1] || '')
        setHeight(parts[2] || '')
      }
    }, [value])

    const handleChange = (type: 'length' | 'width' | 'height', val: string) => {
      if (type === 'length') setLength(val)
      if (type === 'width') setWidthVal(val)
      if (type === 'height') setHeight(val)
      
      const combined = type === 'length' ? `${val}|${widthVal}|${height}` :
                       type === 'width' ? `${length}|${val}|${height}` :
                       `${length}|${widthVal}|${val}`
      onChange?.(combined)
    }

    return (
      <div 
        className="relative bg-center bg-no-repeat flex items-center flex-shrink-0"
        style={{ 
          backgroundImage: customBg ? `url(${customBg})` : 'url(/assets/checkTimeBox.png)',
          backgroundSize: '100% 100%',
          width: `${width}px`,
          height: '38px'
        }}
      >
        {/* 左侧标签区域 */}
        <div className="w-[35%] px-3 flex items-center justify-center">
          <span className={`${youSheBiaoTiHei.className} text-cyan-400 font-medium whitespace-nowrap`} style={{ fontSize: '16px' }}>
            {label}
          </span>
        </div>
        
        {/* 右侧三段式输入框区域 - 背景图自带竖线 */}
        <div className="flex-1 flex items-center justify-around" style={{ paddingLeft: '12px', paddingRight: '12px' }}>
          {/* 长 */}
          <input
            type="text"
            value={length}
            onChange={(e) => handleChange('length', e.target.value)}
            className={`${pingFangSC.className} bg-transparent text-white outline-none border-none text-center`}
            style={{ fontSize: '16px', width: '30%' }}
          />
          {/* 宽 */}
          <input
            type="text"
            value={widthVal}
            onChange={(e) => handleChange('width', e.target.value)}
            className={`${pingFangSC.className} bg-transparent text-white outline-none border-none text-center`}
            style={{ fontSize: '16px', width: '30%' }}
          />
          {/* 高 */}
          <input
            type="text"
            value={height}
            onChange={(e) => handleChange('height', e.target.value)}
            className={`${pingFangSC.className} bg-transparent text-white outline-none border-none text-center`}
            style={{ fontSize: '16px', width: '30%' }}
          />
        </div>
      </div>
    )
  }
  
  if (isBeiZhu) {
    // 备注框特殊处理 - 使用 typeComboBoxLongest.png 背景
    return (
      <div 
        className="relative bg-no-repeat flex items-center flex-shrink-0"
        style={{ 
          backgroundImage: 'url(/assets/typeComboBoxLongest.png)',
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          width: `${width}px`,
          height: '38px'
        }}
      >
        {/* 左侧标签区域 - "备注内容" */}
        <div style={{ width: '150px' }} className="px-3 flex items-center justify-center flex-shrink-0">
          <span className={`${youSheBiaoTiHei.className} text-cyan-400 font-medium whitespace-nowrap`} style={{ fontSize: '16px' }}>
            {label}
          </span>
        </div>
        
        {/* 右侧可编辑区域 - "请输入备注" */}
        <div className="flex-1 px-4 flex items-center">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className={`${pingFangSC.className} flex-1 bg-transparent text-white outline-none border-none`}
            style={{ caretColor: 'cyan', fontSize: '16px' }}
          />
        </div>
      </div>
    )
  }
  
  return (
    <div 
      className="relative bg-center bg-no-repeat flex items-center flex-shrink-0"
      style={{ 
        backgroundImage: customBg ? `url(${customBg})` : 'url(/assets/checkTimeBox.png)',
        backgroundSize: '100% 100%',
        width: `${width}px`,
        height: '38px'
      }}
    >
      {/* 左侧标签区域 */}
      <div className="px-3 flex items-center justify-center" style={{ width: labelWidth || '35%' }}>
        <span className={`${youSheBiaoTiHei.className} text-cyan-400 font-medium whitespace-nowrap`} style={{ fontSize: '16px' }}>
          {label}
        </span>
      </div>
      
      {/* 右侧可编辑区域 */}
      <div className="flex-1 px-2 pr-3 flex items-center justify-between overflow-hidden">
        {dropdown ? (
          <>
            <select
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              className={`${pingFangSC.className} flex-1 bg-transparent text-white outline-none border-none appearance-none cursor-pointer text-center`}
              style={{ fontSize: '16px' }}
            >
              <option value="" style={{ backgroundColor: '#1e293b', color: 'white' }}>请选择</option>
              {getDropdownOptions(label).map((option) => (
                <option key={option.label} value={option.label} style={{ backgroundColor: '#1e293b', color: 'white' }}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute right-8 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </>
        ) : withButton ? (
          <>
            <div className="flex-1 overflow-x-auto overflow-y-hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <input
                type="text"
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                className={`${pingFangSC.className} w-full bg-transparent text-white outline-none border-none text-center whitespace-nowrap`}
                style={{ caretColor: 'cyan', fontSize: '16px', minWidth: '100%' }}
              />
            </div>
            <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
              <button
                className="w-3 h-3 bg-cyan-400 hover:bg-cyan-300 transition-colors flex-shrink-0"
                onClick={() => {}}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-x-auto overflow-y-hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <input
              type="text"
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              className={`${pingFangSC.className} w-full bg-transparent text-white outline-none border-none text-center whitespace-nowrap`}
              style={{ caretColor: 'cyan', fontSize: '16px', minWidth: '100%' }}
            />
          </div>
        )}
      </div>
    </div>
  )
}