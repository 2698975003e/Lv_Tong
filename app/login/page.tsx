"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import { ImageBgButton } from "@/components/image-bg-button"
import { login } from "@/lib/api"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!username || !password) {
      setError("请输入用户名和密码")
      return
    }

    setLoading(true)
    setError(null)

    try {
      await login(username, password)
      // 登录成功，跳转到首页
      router.push("/")
    } catch (err) {
      console.error('登录失败:', err)
      setError(err instanceof Error ? err.message : '登录失败，请稍后重试')
    } finally {
      setLoading(false)
    }
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

          {error && (
            <div className="text-red-400 text-sm mt-2">
              {error}
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <ImageBgButton
              bgSrc="/assets/longBtn.png"
              text={loading ? "登录中..." : "登录"}
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
