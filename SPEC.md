# 《台灣靈格》部落格設計規格書 (SPEC.md)

本文件定義《台灣靈格》部落格專案的系統架構、視覺風格與部署流程。此部落格旨在提供一個高質感的閱讀平台，並以 Obsidian 本地 Markdown 檔案作為文章管理後台，透過 GitHub Actions 實現自動化靜態網站構建與 GitHub Pages 部署。

---

## 🎯 專案目標與限制

### 1. 專案目標
*   **Decoupled Obsidian 後台**：使用者可在 Obsidian 內直接用 Markdown 撰寫文章，並透過 Git 同步自動觸發部落格更新。
*   **民俗暗金風格 (Dark Gold Folk Style)**：延續原《台灣靈格》的視覺風格，利用 Vanilla CSS 打造高端、神祕、奢華的排版與動畫效果。
*   **分類卡片導覽**：採用「分類樹導覽 -> 文章卡片 -> 文章詳情」的結構，與原專案的知識庫架構保持一致。
*   **優雅無圖 Placeholder**：當文章暫無 AI 生成圖時，顯示精心設計的民俗幾何裝飾框，確保視覺完整性。

### 2. 技術限制與規範
*   **核心框架**：使用 **Astro** (SSG) 靜態網站產生器。
*   **樣式系統**：使用 **Vanilla CSS** 進行全自訂設計，不使用 TailwindCSS，以確保動畫與 HSL 色彩微調的最高自由度。
*   **部署平台**：託管於 GitHub Pages，預設使用 `*.github.io` 網域，並保留未來綁定 Cloudflare 自訂網域的彈性。

---

## 🏗️ 系統架構與目錄結構

部落格專案目錄位於：`/Users/imacpro3/Documents/Obsidian/Lxon_Obsidian/Projects/《台灣靈格》部落格`

```
《台灣靈格》部落格/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions 自動部署腳本
├── public/
│   ├── assets/                 # 視覺素材、AI 生成圖片存放區
│   └── favicon.svg             # 網站圖示
├── src/
│   ├── content/
│   │   ├── config.ts           # Astro Content Collections 定義
│   │   └── blog/               # Markdown 文章後台 (依大主題分子目錄)
│   │       ├── fuzhe/          # 福澤系統
│   │       ├── plants/         # 植物・作物
│   │       ├── monsters/       # 精怪・地景
│   │       ├── talismans/      # 符咒・法器
│   │       └── temples/        # 廟宇神靈
│   ├── components/
│   │   ├── Sidebar.astro       # 左側大主題與子分類導覽樹
│   │   ├── ArticleCard.astro   # 右側文章卡片 (含無圖 Placeholder 邏輯)
│   │   └── Header.astro        # 頁首 (搜尋框與選單)
│   ├── layouts/
│   │   └── BlogLayout.astro    # 暗金風格 Layout 基礎模版 (含 View Transitions)
│   ├── pages/
│   │   ├── index.astro         # 首頁 (全局搜尋、最新文章、各分類快速入口)
│   │   ├── [theme]/
│   │   │   └── index.astro     # 主題大分類頁面 (如 /plants)
│   │   └── posts/
│   │       └── [slug].astro    # 文章閱讀內頁
│   └── styles/
│       └── global.css          # 全域民俗暗金風格變數與樣式表
├── astro.config.mjs            # Astro 設定檔
├── package.json
└── tsconfig.json
```

---

## 💾 資料架構 (Content Collection Schema)

使用 Astro 的 Content Collections 機制來規範文章的 metadata。在 `src/content/config.ts` 中定義：

```typescript
import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),                  // 文章標題 (如：台北樹蛙)
    subtitle: z.string().optional(),    // 次標題/學名 (如：Rhacophorus taipeianus)
    category: z.string(),               // 子分類 (如：樹蛙／北部地域型)
    date: z.date(),                     // 撰寫/發布日期
    image: z.string().optional(),       // AI 生成圖片路徑 (選填)
    regions: z.array(z.string()),       // 關聯地區 (如：["北部盆地・河口"])
    cities: z.array(z.string()),        // 縣市 (如：["台北", "新北"])
    tags: z.array(z.string()).optional(),// 其他標籤
    draft: z.boolean().default(false),  // 是否為草稿
  }),
});

export const collections = {
  blog: blogCollection,
};
```

---

## 🎨 視覺與互動設計規範

### 1. 配色系統 (CSS Custom Properties)
```css
:root {
  --color-bg: #0d0f12;          /* 極暗墨黑底色 */
  --color-surface: #13171e;     /* 卡片與側欄底色 */
  --color-surface-hover: #1b212a;
  --color-text: #e2e8f0;        /* 舒適淡灰內文字 */
  --color-text-muted: #94a3b8;  /* 輔助灰色字 */
  --color-gold: #d8b66d;        /* 經典古銅暗金 */
  --color-gold-bright: #f1d280; /* hover 狀態發光金 */
  --color-border: #2e2518;      /* 暗金褐色邊框 */
  --color-glow: rgba(216, 182, 109, 0.15); /* 輕微金色發光 */
}
```

### 2. 字型排版
*   **中文標題與文章內容**：優先使用思源宋體 `Noto Serif TC`，加強神秘古典的氛圍。
*   **英文與學名**：使用具有羅馬石雕感的 `Cinzel`，在呈現學名或儀式名稱時顯得極具質感。

### 3. 無圖古典 Placeholder 設計
若文章 frontmatter 中沒有提供 `image` 路徑，卡片的圖片區域將不顯示預設圖，而是動態載入一個帶有古典氣息的裝飾盒：
*   外框採用 `dashed`（虛線）的暗金色邊框。
*   背景為與底色略有對比的深金色漸層。
*   中央使用 CSS/SVG 繪製一個細緻的民俗幾何圖騰（如簡化八卦、符碼紋樣或自然植物徽章）。
*   中央下方顯示該文章的學名或主題英文，使其本身就像一個神秘設定集的「封印卡牌」。

---

## 🚀 GitHub Actions 自動部署工作流

在 `.github/workflows/deploy.yml` 中定義 CI/CD：

```yaml
name: Deploy Taiwan Spirit Blog

on:
  push:
    branches:
      - main # 當 push 到 main 分支時觸發

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build Astro site
        run: npm run build

      - name: Upload pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## 🧪 驗證標準與計畫 (Verification Plan)

實作完成後，主代理將執行以下測試來驗證品質：
1.  **Astro 本地編譯驗證**：執行 `npm run build` 必須成功，無任何 TypeScript 或是 Astro 語法錯誤，產出 `dist/` 目錄。
2.  **分類與卡片列表驗證**：左側目錄應能正確讀取 `src/content/blog/` 下的子目錄作為主題，點擊時，右側應正確篩選出對應主題的卡片。
3.  **無圖 Placeholder 視覺驗證**：手動建立一篇不帶 `image` 欄位的測試文章，確認卡片圖片區呈現的是暗金虛線古典裝飾盒，而不是破圖或 generic 占位符。
4.  **GitHub Actions 設定驗證**：檢查 `.github/workflows/deploy.yml` 的語法正確性。
