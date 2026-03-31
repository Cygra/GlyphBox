# GlyphBox（字符魔盒）

> 一款简洁优雅的 Chrome 侧边栏扩展，帮你快速获取 Unicode 字符、将文本转换为各种风格的字体，并管理你收藏的字形——无需离开浏览器。

📖 **[English README](README.md)**

<img width="637" height="499" alt="image" src="https://github.com/user-attachments/assets/771f4ebc-56fd-4dad-80b9-e3fb6fdda308" />

---

## ✨ 功能介绍

### 1 · 文字风格转换
将任意文字实时转换为 **12 种 Unicode 数学字体风格**：

| 风格 | 示例 |
|---|---|
| 粗体 (Bold) | 𝐇𝐞𝐥𝐥𝐨 |
| 斜体 (Italic) | 𝐻𝑒𝑙𝑙𝑜 |
| 粗斜体 (Bold Italic) | 𝑯𝒆𝒍𝒍𝒐 |
| 手写体 (Script) | ℋ𝒶𝓁𝓁ℴ |
| 粗手写体 (Bold Script) | 𝓗𝓮𝓵𝓵𝓸 |
| 哥特体 (Fraktur) | ℌ𝔢𝔩𝔩𝔬 |
| 双线体 (Double-Struck) | ℍ𝕖𝕝𝕝𝕠 |
| 粗哥特体 (Bold Fraktur) | 𝕳𝖊𝖑𝖑𝖔 |
| 无衬线 (Sans-Serif) | 𝖧𝖾𝗅𝗅𝗈 |
| 无衬线粗体 (Sans-Serif Bold) | 𝗛𝗲𝗹𝗹𝗼 |
| 无衬线斜体 (Sans-Serif Italic) | 𝘏𝘦𝘭𝘭𝘰 |
| 等宽 (Monospace) | 𝙷𝚎𝚕𝚕𝚘 |

在输入框中输入文字，所有风格实时更新。点击 **⎘ Copy** 按钮即可复制转换后的文字。

### 2 · Unicode 字符搜索
通过名称或关键词搜索 857 条精选 Unicode 字符：
- `heart` → ❤ 💙 ♥ …
- `arrow` → → ⇒ ⟶ …
- `math` → ∑ ∞ ∂ …
- `star` → ★ ✦ ✨ …
- `x` → 𝕏 ✕ × …

点击任意字符即可**立即复制**到剪贴板。

### 3 · 收藏夹
- **长按**或**右键点击**任意字形，将其添加到收藏夹。
- 收藏数据保存在浏览器的 `localStorage` 中，重启浏览器后依然保留。
- 在专属的**收藏夹标签页**中管理已收藏的字形。

### 4 · 最近使用记录
面板顶部显示你**最近使用的 10 个**字符，方便快速再次访问。

### 5 · 深色 / 浅色模式
自动跟随系统主题偏好，也可点击标题栏按钮手动切换。

---

## 🚀 安装方法

### 方式一 — 从 Releases 下载（推荐）

1. 前往 [**Releases**](https://github.com/Cygra/GlyphBox/releases) 页面。
2. 下载最新的 `GlyphBox-vX.X.X.zip`。
3. 将压缩包解压到电脑上的一个**永久目录**（不要删除）。
4. 打开 Chrome，访问 `chrome://extensions/`。
5. 开启右上角的**开发者模式**。
6. 点击**「加载已解压的扩展程序」**，选择刚才解压的文件夹。
7. Chrome 工具栏中会出现 **GlyphBox** 图标。
8. 点击图标即可打开侧边栏。

### 方式二 — 克隆代码加载

```bash
git clone https://github.com/Cygra/GlyphBox.git
```

然后按上述第 4–8 步操作，选择克隆后的文件夹即可。

---

## 🎯 使用说明

| 操作 | 方式 |
|---|---|
| 转换文字风格 | 在 **Style（风格）** 标签页的输入框中输入文字 |
| 复制某种风格 | 点击对应风格卡片上的 **⎘ Copy** 按钮 |
| 搜索 Unicode 字符 | 切换到 **Search（搜索）** 标签页，输入关键词 |
| 复制字符 | 点击任意字形卡片 |
| 添加到收藏 | 右键点击或长按字形卡片 |
| 取消收藏 | 在收藏夹标签页中右键点击或长按 |
| 切换深色模式 | 点击标题栏的 🌙 / ☀️ 按钮 |
| 清除最近记录 | 点击「Recent」旁边的 **Clear** 按钮 |

---

## 🗂 项目结构

```
GlyphBox/
├── manifest.json       # Chrome 扩展 Manifest v3 配置
├── background.js       # Service Worker — 点击图标时打开侧边栏
├── sidepanel.html      # 主侧边栏界面
├── sidepanel.css       # 样式（CSS 变量、深色/浅色主题）
├── sidepanel.js        # 应用逻辑（转换、搜索、收藏、历史）
├── unicode-data.js     # 精选 Unicode 数据集（857 条）
├── icons/              # 扩展图标（16、32、48、128 像素）
└── README_zh.md
```

---

## 🛠 技术细节

- **Manifest 版本：** MV3（Manifest Version 3）
- **使用的 API：** `chrome.sidePanel`、`localStorage`、`Clipboard API`
- **零外部依赖** — 纯 HTML / CSS / JavaScript
- **Unicode 转换：** 纯数学码位偏移运算（A–Z 无需查表）
- **搜索：** 基于精选名称 + 关键词字段的全文匹配

---

## 📄 许可证

[MIT](LICENSE) © 2024 GlyphBox contributors
