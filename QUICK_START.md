# 快速部署指南

## 快速开始（5 分钟部署）

### 前提条件
- 已准备好远程服务器（Linux）
- 服务器已安装 Docker 或 Node.js

### 方式一：使用 Docker（最简单）

#### 1. 在本地准备环境变量文件

在 `my-app` 目录下创建 `.env` 文件：

```bash
NEXT_PUBLIC_API_BASE_URL=http://your-backend-api:8081
NODE_ENV=production
```

#### 2. 上传项目到服务器

```bash
# 使用 scp（Windows PowerShell）
scp -r my-app user@your-server-ip:/opt/frontend

# 或使用 rsync（Linux/Mac）
rsync -avz --exclude 'node_modules' --exclude '.next' my-app/ user@your-server-ip:/opt/frontend/
```

#### 3. SSH 登录服务器并部署

```bash
ssh user@your-server-ip
cd /opt/frontend

# 使用 Docker Compose
docker-compose up -d --build

# 查看日志
docker-compose logs -f
```

完成！访问 `http://your-server-ip:3000` 即可。

### 方式二：使用部署脚本

#### 1. 修改部署脚本中的配置

编辑 `deploy.sh`，或直接使用：

```bash
# 在 my-app 目录下
chmod +x deploy.sh
./deploy.sh production your-server-ip root
```

脚本会自动：
- 构建项目
- 上传文件
- 在服务器上部署

### 方式三：手动部署（PM2）

#### 1. 在服务器上安装依赖

```bash
ssh user@your-server-ip
cd /opt/frontend

# 安装 Node.js 和 pnpm
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install -g pnpm

# 安装项目依赖
pnpm install
```

#### 2. 配置环境变量

```bash
cat > .env << EOF
NEXT_PUBLIC_API_BASE_URL=http://your-backend-api:8081
NODE_ENV=production
PORT=3000
EOF
```

#### 3. 构建和启动

```bash
# 构建
pnpm build

# 使用 PM2 启动
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 配置 Nginx 反向代理（可选）

如果需要使用域名或 HTTPS：

```bash
sudo nano /etc/nginx/sites-available/frontend
```

添加配置：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

启用配置：

```bash
sudo ln -s /etc/nginx/sites-available/frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 常见问题

**Q: 如何更新应用？**

A: 
```bash
# Docker 方式
cd /opt/frontend
git pull  # 或重新上传文件
docker-compose up -d --build

# PM2 方式
cd /opt/frontend
git pull
pnpm install
pnpm build
pm2 restart frontend
```

**Q: 如何查看日志？**

A:
```bash
# Docker
docker-compose logs -f

# PM2
pm2 logs frontend
```

**Q: 端口被占用怎么办？**

A: 修改 `.env` 文件中的 `PORT` 变量，或修改 `docker-compose.yml` 中的端口映射。

## 详细文档

更多详细信息请查看 [DEPLOYMENT.md](../DEPLOYMENT.md)

