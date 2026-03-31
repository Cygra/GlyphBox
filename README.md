# GlyphBox

> A sleek Chrome Side Panel extension for quickly accessing Unicode characters, converting text into stylized fonts, and managing your favorite glyphs — all without leaving your browser.

📖 **[中文文档 (Chinese README)](README_zh.md)**

<img width="637" height="499" alt="image" src="https://github.com/user-attachments/assets/771f4ebc-56fd-4dad-80b9-e3fb6fdda308" />

---

## ✨ Features

### 1 · Text Style Converter
Convert any text into **12 beautiful Unicode mathematical font styles** in real time:

| Style | Example |
|---|---|
| Bold | 𝐇𝐞𝐥𝐥𝐨 |
| Italic | 𝐻𝑒𝑙𝑙𝑜 |
| Bold Italic | 𝑯𝒆𝒍𝒍𝒐 |
| Script | ℋ𝒶𝓁𝓁ℴ |
| Bold Script | 𝓗𝓮𝓵𝓵𝓸 |
| Fraktur | ℌ𝔢𝔩𝔩𝔬 |
| Double-Struck | ℍ𝕖𝕝𝕝𝕠 |
| Bold Fraktur | 𝕳𝖊𝖑𝖑𝖔 |
| Sans-Serif | 𝖧𝖾𝗅𝗅𝗈 |
| Sans-Serif Bold | 𝗛𝗲𝗹𝗹𝗼 |
| Sans-Serif Italic | 𝘏𝘦𝘭𝘭𝘰 |
| Monospace | 𝙷𝚎𝚕𝚕𝚘 |

Type into the input box and all styles update instantly. Hit **Copy** to copy the converted text to your clipboard.

### 2 · Unicode Character Search
Search 857 curated Unicode characters by name or keyword:
- `heart` → ❤ 💙 ♥ …
- `arrow` → → ⇒ ⟶ …
- `math` → ∑ ∞ ∂ …
- `star` → ★ ✦ ✨ …
- `x` → 𝕏 ✕ ×  …

Click any character to **instantly copy** it to your clipboard.

### 3 · Favorites
- **Long-press** or **right-click** any glyph to add it to Favorites.
- Favorites are persisted in the browser's `localStorage` — they survive browser restarts.
- A dedicated **Favorites tab** lets you manage your saved glyphs.

### 4 · Recent History
The top of the panel shows your **10 most recently used** characters for quick re-access.

### 5 · Dark & Light Mode
Automatically matches your system preference, with a manual toggle button in the header.

---

## 🚀 Installation

### Option A — Download from Releases (Recommended)

1. Go to the [**Releases**](https://github.com/Cygra/GlyphBox/releases) page.
2. Download the latest `GlyphBox-vX.X.X.zip`.
3. Unzip the file to a permanent folder on your computer.
4. Open Chrome and navigate to `chrome://extensions/`.
5. Enable **Developer mode** (toggle in the top-right corner).
6. Click **"Load unpacked"** and select the unzipped folder.
7. The **GlyphBox** icon will appear in your Chrome toolbar.
8. Click the icon to open the Side Panel.

### Option B — Clone & Load

```bash
git clone https://github.com/Cygra/GlyphBox.git
```

Then follow steps 4–8 above, pointing to the cloned folder.

---

## 🎯 Usage

| Action | How |
|---|---|
| Convert text | Type in the **Style** tab input box |
| Copy a style | Click the **⎘ Copy** button on any style card |
| Search Unicode | Switch to the **Search** tab, type a keyword |
| Copy a glyph | Click any glyph card |
| Add to favorites | Right-click or long-press a glyph card |
| Remove favorite | Right-click or long-press in the Favorites tab |
| Toggle dark mode | Click the 🌙/☀️ button in the header |
| Clear recent | Click **Clear** next to "Recent" |

---

## 🗂 Project Structure

```
GlyphBox/
├── manifest.json       # Chrome Extension Manifest v3
├── background.js       # Service worker — opens side panel on action click
├── sidepanel.html      # Main side panel UI
├── sidepanel.css       # Styles (CSS variables, light/dark themes)
├── sidepanel.js        # App logic (converter, search, favorites, history)
├── unicode-data.js     # Curated Unicode dataset (857 entries)
├── icons/              # Extension icons (16, 32, 48, 128 px)
└── README.md
```

---

## 🛠 Technical Notes

- **Manifest Version:** 3 (MV3)
- **APIs used:** `chrome.sidePanel`, `localStorage`, `Clipboard API`
- **No external dependencies** — pure HTML / CSS / JavaScript
- **Unicode conversion:** pure mathematical code-point arithmetic (no lookup tables for A–Z)
- **Search:** full-text match against curated name + keyword fields

---

## 🔍 Findability

**Chrome Extension** | **Unicode** | **Glyph** | **Symbol** | **Side Panel** | **Text Converter** | **Font Styles** | **Clipboard** | **Emoji** | **Math Symbols** | **Monospace** | **Double-Struck** | **Fraktur** | **Script Font** | **Favorites**

---

## 📄 License

[MIT](LICENSE) © 2024 GlyphBox contributors
