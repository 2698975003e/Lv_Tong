# Windows 环境部署指南

由于部署脚本 `deploy.sh` 是为 Linux/Mac 设计的，在 Windows 上部署需要以下步骤：

## 方法一：使用 Git Bash 或 WSL

如果你安装了 Git for Windows 或 WSL，可以直接使用 `deploy.sh`：

```bash
# 在 Git Bash 中
cd my-app
chmod +x deploy.sh
./deploy.sh production your-server-ip root
```

## 方法二：手动部署步骤

### 1. 在本地构建项目

在 PowerShell 或 CMD 中：

```powershell
cd my-app
pnpm install
pnpm build
```

### 2. 上传文件到服务器

使用 WinSCP、FileZilla 或 PowerShell 的 `scp`：

```powershell
# 使用 PowerShell scp（需要 OpenSSH）
scp -r my-app user@your-server-ip:/opt/frontend

# 或使用 WinSCP（图形界面，推荐）
# 下载地址: https://winscp.net/
```

上传时需要包含以下文件/目录：
- `.next/` (构建输出)
- `public/` (静态资源)
- `package.json`
- `pnpm-lock.yaml` 或 `package-lock.json`
- `next.config.mjs`
- `Dockerfile` (如果使用 Docker)
- `docker-compose.yml` (如果使用 Docker)
- `ecosystem.config.js` (如果使用 PM2)

**不需要上传**：
- `node_modules/`
- `.git/`
- `.env*` (在服务器上单独创建)

### 3. 在服务器上执行部署

SSH 登录服务器后，按照 [DEPLOYMENT.md](../DEPLOYMENT.md) 中的步骤执行。

## 方法三：使用 VS Code Remote SSH

1. 安装 VS Code 扩展 "Remote - SSH"
2. 连接到服务器
3. 直接在服务器上操作，就像本地一样

## 推荐工具

- **WinSCP**: 图形化 SFTP 客户端
- **PuTTY**: SSH 客户端
- **Git Bash**: 提供 Linux 命令环境
- **WSL**: Windows Subsystem for Linux

