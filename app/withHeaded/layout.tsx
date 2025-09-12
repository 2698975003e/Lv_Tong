// my-app/app/withHeader/layout.tsx
import { SiteHeader } from "@/components/header"

export default function WithHeaderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-slate-900 min-h-screen">
      <SiteHeader />
      {children}
    </div>
  )
}