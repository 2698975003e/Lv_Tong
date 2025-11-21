#!/bin/bash

# 前端部署脚本
# 使用方法: ./deploy.sh [环境] [服务器地址] [用户名]
# 例如: ./deploy.sh production 192.168.1.100 root

set -e

ENV=${1:-production}
SERVER=${2:-""}
USER=${3:-root}
APP_DIR="/opt/frontend"
REMOTE_PATH="${USER}@${SERVER}:${APP_DIR}"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

echo_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

echo_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查参数
if [ -z "$SERVER" ]; then
    echo_error "请提供服务器地址"
    echo "使用方法: ./deploy.sh [环境] [服务器地址] [用户名]"
    exit 1
fi

echo_info "开始部署到 ${ENV} 环境..."
echo_info "服务器: ${SERVER}"
echo_info "用户: ${USER}"
echo_info "目标目录: ${APP_DIR}"

# 检查本地构建
echo_info "检查本地构建..."
if [ ! -d ".next" ]; then
    echo_warn ".next 目录不存在，开始构建..."
    pnpm install
    pnpm build
else
    echo_info "使用现有构建..."
fi

# 创建部署包
echo_info "创建部署包..."
TEMP_DIR=$(mktemp -d)
cp -r .next "$TEMP_DIR/"
cp -r public "$TEMP_DIR/"
cp -r package.json "$TEMP_DIR/"
cp -r pnpm-lock.yaml "$TEMP_DIR/" 2>/dev/null || true
cp -r Dockerfile "$TEMP_DIR/" 2>/dev/null || true
cp -r docker-compose.yml "$TEMP_DIR/" 2>/dev/null || true
cp -r next.config.mjs "$TEMP_DIR/"
cp -r tsconfig.json "$TEMP_DIR/" 2>/dev/null || true
cp -r tailwind.config.ts "$TEMP_DIR/" 2>/dev/null || true
cp -r postcss.config.mjs "$TEMP_DIR/" 2>/dev/null || true

# 上传文件
echo_info "上传文件到服务器..."
rsync -avz --delete \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude '.env*' \
    "$TEMP_DIR/" "$REMOTE_PATH/"

# 清理临时目录
rm -rf "$TEMP_DIR"

# 在服务器上执行部署命令
echo_info "在服务器上执行部署..."
ssh "${USER}@${SERVER}" << EOF
    set -e
    cd ${APP_DIR}
    
    # 检查 Docker 是否可用
    if command -v docker &> /dev/null; then
        echo "使用 Docker 部署..."
        if [ -f docker-compose.yml ]; then
            docker-compose down || true
            docker-compose up -d --build
        else
            docker build -t frontend-app .
            docker stop frontend || true
            docker rm frontend || true
            docker run -d --name frontend -p 3000:3000 --restart unless-stopped frontend-app
        fi
    else
        echo "使用 PM2 部署..."
        # 安装依赖
        if command -v pnpm &> /dev/null; then
            pnpm install --production
        else
            npm install --production
        fi
        
        # 使用 PM2 管理
        if command -v pm2 &> /dev/null; then
            pm2 restart frontend || pm2 start npm --name "frontend" -- start
        else
            npm start
        fi
    fi
    
    echo "部署完成！"
EOF

echo_info "部署成功！"
echo_info "应用地址: http://${SERVER}:3000"

