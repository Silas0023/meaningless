# GitHub Actions 故障排除指南

## 🚨 常见构建错误及解决方案

### 1. "The operation was canceled" 错误

**问题描述：**
构建在Rust工具链安装阶段被取消，通常显示：
```
Error: The operation was canceled.
```

**原因分析：**
- 构建超时（GitHub Actions免费账户有6小时限制，但单个job默认超时可能更短）
- 网络连接问题导致依赖下载失败
- Rust工具链安装卡住

**解决方案：**
1. **已在配置中修复**：添加了 `timeout-minutes: 60` 设置
2. **重新运行**：在GitHub Actions页面点击 "Re-run failed jobs"
3. **检查网络**：等待一段时间后重试，可能是GitHub服务临时问题

### 2. Rust 版本问题

**问题描述：**
Rust版本显示异常（如1.88.0这种未来版本）

**解决方案：**
已更新配置明确指定工具链版本：
```yaml
- name: Setup Rust
  uses: dtolnay/rust-toolchain@stable
  with:
    toolchain: stable
    targets: ${{ matrix.rust_target }}
    components: rustfmt, clippy
```

### 3. 依赖安装失败

**问题描述：**
- Ubuntu系统依赖安装失败
- Node.js依赖安装超时

**解决方案：**
- **系统依赖**：已添加 `libssl-dev` 等必要依赖
- **Node依赖**：添加了网络超时配置 `--network-timeout 100000`

### 4. Tauri路径错误

**问题描述：**
```
Error No path was found. about ["/path/to/src-tauri/Cargo.toml"]
```

**原因分析：**
- Tauri action无法找到正确的项目路径
- 工作目录配置错误
- Tauri CLI配置问题

**解决方案：**
已在配置中添加明确的路径设置：
```yaml
with:
  projectPath: '.'
  tauriScript: yarn tauri
```

### 5. macOS 代码签名失败

**问题描述：**
macOS构建时代码签名相关错误

**解决方案：**
1. **临时解决**：移除代码签名配置，先完成基础构建
2. **完整解决**：配置Apple开发者证书（见下方配置说明）

## ⚙️ 快速修复建议

### 方法1：使用调试构建（推荐）
专门用于诊断问题的工作流：
```bash
# 手动触发 build-debug.yml 工作流
# 会显示详细的项目结构和错误信息
```

### 方法2：使用简化配置
如果完整配置有问题，可以先使用简化版本：
```bash
# 手动触发 build-simple.yml 工作流
```

### 方法3：本地构建测试
先在本地测试构建是否正常：
```bash
# 安装依赖
yarn install

# 本地构建测试
yarn tauri build

# 如果成功，说明代码没问题，是CI配置问题
```

### 方法4：分步骤调试
1. 先注释掉代码签名相关配置
2. 只保留基础的构建步骤
3. 逐步添加功能

## 🔧 配置修复

### 已修复的问题
✅ 添加构建超时设置（60分钟）  
✅ 更新tauri-action版本到v0.5  
✅ 优化Rust工具链配置  
✅ 增加网络超时时间  
✅ 添加构建缓存优化  
✅ 完善系统依赖列表  
✅ 修复Tauri路径配置问题  
✅ 添加调试构建工作流  

### 临时禁用代码签名
如果遇到签名问题，可以临时移除以下环境变量：
```yaml
# 注释掉这些行
# APPLE_CERTIFICATE: ${{ secrets.APPLE_CERTIFICATE }}
# APPLE_CERTIFICATE_PASSWORD: ${{ secrets.APPLE_CERTIFICATE_PASSWORD }}
# APPLE_SIGNING_IDENTITY: ${{ secrets.APPLE_SIGNING_IDENTITY }}
# APPLE_ID: ${{ secrets.APPLE_ID }}
# APPLE_PASSWORD: ${{ secrets.APPLE_PASSWORD }}
# APPLE_TEAM_ID: ${{ secrets.APPLE_TEAM_ID }}
```

## 🎯 具体操作步骤

### 立即重试构建
1. 进入GitHub仓库
2. 点击 `Actions` 标签
3. 找到失败的构建
4. 点击 `Re-run failed jobs`

### 查看详细错误
1. 点击失败的构建项
2. 展开失败的步骤
3. 查看完整错误日志
4. 根据错误信息对症下药

### 手动触发测试
1. 进入 `Actions` 页面
2. 选择 `Debug Build` 工作流（推荐用于调试）
3. 点击 `Run workflow`
4. 查看详细的构建信息和错误日志

### 使用简化构建测试
1. 进入 `Actions` 页面
2. 选择 `Simple Build` 工作流
3. 点击 `Run workflow`
4. 保持默认设置，点击运行

## 📝 报告问题

如果以上方案都无法解决，请提供以下信息：

1. **错误日志**：完整的失败步骤日志
2. **构建环境**：哪个平台失败（Windows/macOS/Linux）
3. **触发方式**：手动触发还是推送标签触发
4. **账户类型**：GitHub免费账户还是付费账户

## 🚀 性能优化建议

### 减少构建时间
1. **并行构建**：确保不同平台并行执行
2. **缓存优化**：Rust和Node依赖都启用缓存
3. **选择性构建**：开发阶段可以只构建单个平台

### 减少失败率
1. **网络超时**：增加下载超时时间
2. **重试机制**：某些步骤添加自动重试
3. **失败快速恢复**：`fail-fast: false` 确保其他平台继续构建

---

**💡 提示：** 大多数"被取消"的错误都是临时性的，重新运行通常能解决问题。如果连续多次失败，再考虑配置问题。 