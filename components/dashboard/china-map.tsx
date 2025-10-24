import Image from "next/image"

export function ChinaMap() {
  return (
    <div className="bg-slate-800/50 border border-blue-500/30 rounded-lg p-4 h-full flex items-center justify-center">
      <Image
        src="/assets/ChinaMap.png"
        alt="China Map"
        width={500}
        height={500}
        className="object-contain"
      />
    </div>
  )
}
