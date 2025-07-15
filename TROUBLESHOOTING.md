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

### 2. Tauri Action 版本兼容性

**问题描述：**
- tauri-action@v0.5 在某些情况下有路径解析问题
- 出现 "No path was found" 错误
- Rust版本显示异常（如1.88.0这种未来版本）

**解决方案：**
1. **版本回退**：使用更稳定的 `tauri-apps/tauri-action@v0`
2. **Rust工具链**：明确指定工具链版本：
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

### 4. tauri.conf.json 配置错误

**问题描述：**
```
Error `tauri.conf.json` error: "identifier" is a required property
Error `tauri.conf.json` error on "build": Additional properties are not allowed ('distDir', 'devPath' were unexpected)
Error `tauri.conf.json` error: Additional properties are not allowed ('package', 'tauri' were unexpected)
```

**原因分析：**
- 配置文件格式不符合Tauri v1规范
- 属性位置错误或重复配置
- 缺少必要的schema引用

**解决方案：**
✅ **已修复**：重新调整了 `tauri.conf.json` 的结构
- 添加了正确的 `$schema` 引用
- 修复了属性位置（build应在根级别）
- 移除了重复的配置项
- 确保identifier在bundle下正确位置

### 5. 前端构建依赖问题

**问题描述：**
```
Error No path was found. about ["/path/to/src-tauri/Cargo.toml"]
```

**原因分析：**
- Tauri需要前端先构建完成才能找到正确的dist目录
- `beforeBuildCommand` 可能没有正确执行
- Tauri CLI未正确安装或配置

**解决方案：**
1. **手动前端构建**：在Tauri构建前明确执行 `yarn run web:build`
2. **安装Tauri CLI**：确保正确安装 `@tauri-apps/cli`
3. **检查配置**：确认 `tauri.conf.json` 中的 `distDir` 路径正确
4. **使用调试构建**：运行 `Debug Build` 或 `Manual Build` 获取详细信息

### 6. Tauri路径错误（持续性问题）

**问题描述：**
即使前端构建成功，仍然出现路径找不到的错误

**解决方案：**
1. **使用Manual Build**：完全手动控制构建流程
2. **安装cargo tauri**：`cargo install tauri-cli`
3. **检查工作目录**：确保在正确的项目根目录

### 7. macOS 代码签名失败

**问题描述：**
macOS构建时代码签名相关错误

**解决方案：**
1. **临时解决**：移除代码签名配置，先完成基础构建
2. **完整解决**：配置Apple开发者证书（见下方配置说明）

## ⚙️ 快速修复建议

### 方法1：使用Manual Build（推荐）
完全手动控制的构建流程：
```bash
# 手动触发 build-manual.yml 工作流
# 不依赖 tauri-action，完全手动构建
```

### 方法2：使用调试构建
专门用于诊断问题的工作流：
```bash
# 手动触发 build-debug.yml 工作流
# 会尝试多种构建方式并显示详细错误信息
```

### 方法3：使用简化配置
如果完整配置有问题，可以先使用简化版本：
```bash
# 手动触发 build-simple.yml 工作流
# 已添加前端预构建步骤
```

### 方法4：本地构建测试
先在本地测试构建是否正常：
```bash
# 安装依赖
yarn install

# 本地构建测试
yarn tauri build

# 如果成功，说明代码没问题，是CI配置问题
```

### 方法5：分步骤调试
1. 先注释掉代码签名相关配置
2. 只保留基础的构建步骤
3. 逐步添加功能

## 🔧 配置修复

### 已修复的问题
✅ 添加构建超时设置（60分钟）  
✅ 回退到稳定的tauri-action@v0版本  
✅ 优化Rust工具链配置  
✅ 增加网络超时时间  
✅ 添加构建缓存优化  
✅ 完善系统依赖列表  
✅ **修复tauri.conf.json配置错误**  
✅ 修复前端构建依赖问题  
✅ 添加Manual Build工作流（完全手动构建）  
✅ 增强Debug Build（多种构建方式）  
✅ 预先安装Tauri CLI  
✅ 明确的前端构建步骤  

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

### 推荐的测试顺序

**第一步：使用Manual Build**
1. 进入 `Actions` 页面
2. 选择 `Manual Build` 工作流
3. 点击 `Run workflow`
4. 这是最可靠的构建方式，不依赖tauri-action

**第二步：使用Debug Build（如果Manual Build失败）**
1. 选择 `Debug Build` 工作流
2. 点击 `Run workflow`
3. 查看详细的诊断信息和多种构建尝试

**第三步：使用Simple Build（最后选择）**
1. 选择 `Simple Build` 工作流
2. 已更新为包含前端预构建
3. 保持默认设置，点击运行

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