# GitHub Actions 构建指南

我为您创建了两个GitHub Actions工作流程来自动构建所有平台的安装包。

## 🚀 快速开始

### 方式1：自动触发构建
1. 推送代码到 `main` 或 `master` 分支
2. 或者推送版本标签（如 `v1.4.0`）
3. GitHub Actions会自动开始构建

### 方式2：手动触发构建
1. 进入GitHub仓库的 `Actions` 页面
2. 选择 `Build Release` 工作流
3. 点击 `Run workflow`
4. 输入版本号并选择是否为预发布版本

## 📦 支持的平台

| 平台 | 输出文件 | 说明 |
|------|---------|------|
| Windows | `.msi` | Windows安装包 |
| Windows | `.exe` (portable) | 便携版 |
| macOS (Intel) | `.dmg` | Intel芯片Mac |
| macOS (Apple Silicon) | `.dmg` | M1/M2芯片Mac |
| Linux | `.deb` | Debian/Ubuntu包 |
| Linux | `.AppImage` | 通用Linux包 |

## ⚙️ 工作流程说明

### 1. build-release.yml (完整版)
**特点:**
- 支持4个平台的构建
- 包含macOS的Apple Silicon支持
- 自动创建GitHub Release
- 支持代码签名和公证
- 生成updater文件

**触发条件:**
- 推送版本标签（`v*`）
- 手动触发
- Pull Request（仅构建，不发布）

### 2. build-simple.yml (简化版)
**特点:**
- 基础的三平台构建
- 配置简单，易于理解
- 适合快速测试

**触发条件:**
- 推送到主分支
- 推送版本标签
- 手动触发

## 🔐 必需的Secrets

为了完整功能，您需要在GitHub仓库设置中添加以下Secrets：

### 基础Secrets
```
GITHUB_TOKEN    # GitHub自动提供，无需手动设置
TAURI_PRIVATE_KEY    # Tauri更新签名私钥
TAURI_KEY_PASSWORD   # 私钥密码
```

### macOS代码签名（可选）
```
APPLE_CERTIFICATE              # 开发者证书
APPLE_CERTIFICATE_PASSWORD     # 证书密码
APPLE_SIGNING_IDENTITY         # 签名身份
APPLE_ID                       # Apple ID
APPLE_PASSWORD                 # App专用密码
APPLE_TEAM_ID                  # 团队ID
```

## 📝 使用步骤

1. **生成Tauri签名密钥**
   ```bash
   yarn tauri signer generate -w ~/.tauri/myapp.key
   ```
   将生成的私钥和密码添加到GitHub Secrets

2. **提交代码并打标签**
   ```bash
   git add .
   git commit -m "ready for v1.4.0"
   git tag v1.4.0
   git push origin main --tags
   ```

3. **检查构建进度**
   - 访问GitHub仓库的Actions页面
   - 查看构建状态和日志

4. **下载构建结果**
   - 构建完成后，前往Releases页面
   - 下载对应平台的安装包

## 🛠️ 自定义配置

### 修改构建平台
编辑 `.github/workflows/build-release.yml` 文件中的 `matrix.include` 部分，可以添加或移除平台。

### 修改版本号
版本号来源：
- 自动：从Git标签获取
- 手动：工作流输入参数

### 修改Release信息
在工作流文件中的 `Create Release` 步骤中修改 `body` 内容。

## 🔧 故障排除

### 常见问题

1. **构建失败：权限不足**
   - 确保已设置必要的Secrets
   - 检查GITHUB_TOKEN权限

2. **macOS构建失败**
   - 确保已设置Apple开发者证书
   - 检查证书是否过期

3. **Linux依赖问题**
   - 构建环境会自动安装必要依赖
   - 如有特殊依赖，修改Ubuntu安装步骤

### 调试技巧

1. **查看详细日志**
   - 在Actions页面点击失败的步骤
   - 查看完整的错误信息

2. **本地测试**
   ```bash
   yarn tauri build
   ```

## 📚 相关文档

- [Tauri GitHub Actions文档](https://tauri.app/v1/guides/building/cross-platform)
- [GitHub Actions文档](https://docs.github.com/en/actions)
- [Tauri Updater文档](https://tauri.app/v1/guides/distribution/updater)

## 🎯 注意事项

1. 首次构建可能需要较长时间（20-30分钟）
2. 后续构建会利用缓存，速度更快
3. macOS构建需要Apple开发者证书进行代码签名
4. Windows便携版会额外构建一个不需要安装的exe文件 