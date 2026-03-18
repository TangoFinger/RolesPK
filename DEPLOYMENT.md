# GitHub Pages 部署指南

## 问题修复说明

已修复 GitHub Pages 空白页面问题，主要改动：

### 1. 修复 Vite 配置
将 `vite.config.ts` 中的 `base: '/'` 改为 `base: './'`

**原因**: 
- 绝对路径 `/` 在 GitHub Pages 上会导致资源 404
- 相对路径 `./` 确保资源引用正确

### 2. 路由配置
项目已使用 `HashRouter`，这对 GitHub Pages 是正确的选择

**说明**:
- HashRouter 使用 `#` 符号，无需服务器端路由支持
- 适合部署到静态网站托管服务

### 3. 自动部署配置
已创建 `.github/workflows/deploy.yml` 自动部署配置

## 部署步骤

### 方式一：GitHub Actions 自动部署（推荐）

1. **启用 GitHub Pages**
   - 进入仓库设置 → Settings → Pages
   - Source 选择 "GitHub Actions"

2. **推送代码**
   ```bash
   git add .
   git commit -m "fix: 修复 GitHub Pages 部署问题"
   git push
   ```

3. **查看部署状态**
   - 进入仓库的 "Actions" 标签页
   - 等待 workflow 完成部署

4. **访问网站**
   - `https://your-username.github.io/RolesPK/`

### 方式二：手动部署

1. **构建项目**
   ```bash
   npm run build
   ```

2. **推送 dist 目录**
   ```bash
   # 方式 A：使用 gh-pages 分支
   npm install -g gh-pages
   gh-pages -d dist
   
   # 方式 B：手动推送
   git subtree push --prefix dist origin gh-pages
   ```

3. **在 GitHub 设置中配置**
   - Settings → Pages → Source → 选择 `gh-pages` 分支

## 验证部署

部署完成后，检查以下内容：

1. **浏览器控制台**
   - 按 F12 打开开发者工具
   - 检查 Console 是否有错误
   - 检查 Network 标签页，确认 JS/CSS 文件加载成功

2. **常见问题排查**

   - **仍然空白？** 
     - 清除浏览器缓存
     - 检查控制台是否有 404 错误
     - 确认 URL 路径正确

   - **样式丢失？**
     - 确认 CSS 文件加载成功
     - 检查 Network 标签页

   - **JavaScript 报错？**
     - 查看控制台错误信息
     - 确认所有依赖都已正确构建

## 本地预览生产版本

```bash
npm run build
npm run preview
```

然后在浏览器打开 `http://localhost:4173`

## 技术细节

### 为什么是空白页面？

1. **资源路径错误**: `base: '/'` 导致 GitHub Pages 上 JS/CSS 文件 404
2. **相对路径解决方案**: `base: './'` 确保资源从当前目录加载
3. **HashRouter 优势**: 使用 URL hash 进行路由，无需服务器支持

### 构建输出说明

```
dist/
├── index.html          # 入口文件（相对路径引用资源）
├── assets/
│   ├── index-xxxxx.js   # 打包后的 JavaScript
│   └── index-xxxxx.css  # 打包后的样式
└── data/                # 静态数据文件
```

## 注意事项

1. **确保 dist 目录包含所有必要文件**
2. **检查构建日志是否有错误**
3. **GitHub Actions 需要仓库有写入权限**
4. **首次部署可能需要等待几分钟生效**

## 其他部署选项

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

---

现在你可以重新部署到 GitHub Pages，应该能正常显示了！
