"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import { ImageBgButton } from "@/components/ui/image-bg-button"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: 调用登录接口校验
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-white">登录</h1>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-slate-300 text-sm">用户名</label>
            <input
              className="w-full h-11 rounded-md bg-slate-800/80 border border-slate-600 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名"
            />
          </div>
          <div className="space-y-2">
            <label className="text-slate-300 text-sm">密码</label>
            <input
              type="password"
              className="w-full h-11 rounded-md bg-slate-800/80 border border-slate-600 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <ImageBgButton
              bgSrc="/assets/longBtn.png"
              text="登录"
              width="107px"
              height="44px"
              stretch="cover"
              onClick={onSubmit as any}
            />
            <Link href="/">
              <ImageBgButton
                bgSrc="/assets/shortBtn.png"
                text="返回首页"
                width="88px"
                height="44px"
                stretch="cover"
              />
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
