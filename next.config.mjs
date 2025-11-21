/** @type {import('next').NextConfig} */
const nextConfig = {
  // 启用 standalone 输出模式，用于 Docker 部署
  output: 'standalone',

  // 部署优先：构建时忽略 ESLint 报错（保留类型检查）
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
