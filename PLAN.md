# 《台灣靈格》部落格實作計畫 (PLAN.md)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立一個使用 Astro 驅動的《台灣靈格》靜態部落格，繼承民俗暗金視覺風格，提供「左側分類樹導覽 ➔ 右側卡片列表/文章詳情」的雙欄結構，支援無圖古典 Placeholder 卡牌設計，並透過 GitHub Actions 自動編譯部署至 GitHub Pages。

**Architecture:** 本專案採用 Astro Content Collections 機制管理本地 Markdown 檔案，頁面切換引入 Astro View Transitions 實現 SPA 般的平滑過渡。全站樣式完全基於自訂 Vanilla CSS 實作。

**Tech Stack:** Astro v4.16+, TypeScript, Vanilla CSS (無 Tailwind), GitHub Actions, GitHub Pages.

## Global Constraints
*   使用 **繁體中文 (台灣)** 進行所有對話、註解與檔案文件撰寫。
*   全自訂 CSS 樣式，不使用 TailwindCSS。
*   專案路徑為 `/Users/imacpro3/Documents/Obsidian/Lxon_Obsidian/Projects/《台灣靈格》部落格`。
*   在 GitHub 建立的 repo 必須為 public repo。
*   所有變更均需符合 Commit 與備份規範。

---

### Task 1: 初始化 Astro 專案與基本設定

**Files:**
- Create: `/Users/imacpro3/Documents/Obsidian/Lxon_Obsidian/Projects/《台灣靈格》部落格/package.json`
- Create: `/Users/imacpro3/Documents/Obsidian/Lxon_Obsidian/Projects/《台灣靈格》部落格/astro.config.mjs`
- Create: `/Users/imacpro3/Documents/Obsidian/Lxon_Obsidian/Projects/《台灣靈格》部落格/tsconfig.json`

**Interfaces:**
- Produces: Astro 本地運行與編譯環境。

- [ ] **Step 1: 建立 package.json 檔案**

在 `/Users/imacpro3/Documents/Obsidian/Lxon_Obsidian/Projects/《台灣靈格》部落格/package.json` 寫入以下內容：
```json
{
  "name": "taiwan-spirit-blog",
  "type": "module",
  "version": "1.0.0",
  "scripts": {
    "dev": "astro dev",
    "start": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "astro": "astro"
  },
  "dependencies": {
    "astro": "^4.16.0"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.4",
    "typescript": "^5.5.4"
  }
}
```

- [ ] **Step 2: 建立 astro.config.mjs 設定檔**

在 `/Users/imacpro3/Documents/Obsidian/Lxon_Obsidian/Projects/《台灣靈格》部落格/astro.config.mjs` 寫入以下內容：
```javascript
import { defineConfig } from 'astro/config';

// 預設部署在 github pages，因為網域先保留，所以 site 先設定為預設的 github.io
export default defineConfig({
  site: 'https://imacpro3.github.io',
  base: '/taiwan-spirit-blog',
  output: 'static'
});
```

- [ ] **Step 3: 建立 tsconfig.json 設定檔**

在 `/Users/imacpro3/Documents/Obsidian/Lxon_Obsidian/Projects/《台灣靈格>部落格/tsconfig.json` 寫入以下內容：
```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "astro"
  }
}
```

- [ ] **Step 4: 執行 npm install 安裝相依套件**

在專案目錄下執行：
```bash
npm install
```
預期輸出：成功安裝 astro 及其關聯套件，產生 `node_modules` 與 `package-lock.json`。

- [ ] **Step 5: 建立並提交初始 Git Commit**

執行以下命令初始化 Git 倉庫並進行首次提交：
```bash
git init
echo "node_modules/" > .gitignore
echo ".astro/" >> .gitignore
echo "dist/" >> .gitignore
git add package.json package-lock.json astro.config.mjs tsconfig.json .gitignore
git commit -m "chore: initialize Astro project structure"
```

---

### Task 2: 設定 Content Collections 結構與全域樣式系統

**Files:**
- Create: `/Users/imacpro3/Documents/Obsidian/Lxon_Obsidian/Projects/《台灣靈格》部落格/src/content/config.ts`
- Create: `/Users/imacpro3/Documents/Obsidian/Lxon_Obsidian/Projects/《台灣靈格》部落格/src/styles/global.css`

**Interfaces:**
- Produces: 文章型別規範與全域民俗暗金風格 CSS 變數。

- [ ] **Step 1: 建立 src/content/config.ts 定義檔**

在 `/Users/imacpro3/Documents/Obsidian/Lxon_Obsidian/Projects/《台灣靈格》部落格/src/content/config.ts` 中寫入 Content Collection 的 Schema 設計：
```typescript
import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    category: z.string(),
    date: z.coerce.date(),
    image: z.string().optional(),
    regions: z.array(z.string()).default([]),
    cities: z.array(z.string()).default([]),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  blog: blogCollection,
};
```

- [ ] **Step 2: 建立全域樣式表 src/styles/global.css**

在 `/Users/imacpro3/Documents/Obsidian/Lxon_Obsidian/Projects/《台灣靈格》部落格/src/styles/global.css` 中設定民俗暗金風格變數與基本重設：
```css
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Noto+Serif+TC:wght@400;600;700&display=swap');

:root {
  --color-bg: #0d0f12;
  --color-surface: #13171e;
  --color-surface-hover: #1b212a;
  --color-text: #e2e8f0;
  --color-text-muted: #94a3b8;
  --color-gold: #d8b66d;
  --color-gold-bright: #f1d280;
  --color-border: #2e2518;
  --color-glow: rgba(216, 182, 109, 0.15);
  
  --font-serif: 'Noto Serif TC', serif;
  --font-cinzel: 'Cinzel', serif;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-serif);
  line-height: 1.6;
  overflow-x: hidden;
}

a {
  color: inherit;
  text-decoration: none;
}

/* 捲軸美化 */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: var(--color-bg);
}
::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--color-gold);
}
```

- [ ] **Step 3: 建立樣式測試文件並提交**

執行以下 Git 命令提交變更：
```bash
git add src/content/config.ts src/styles/global.css
git commit -m "feat: setup content collections config and global css rules"
```

---

### Task 3: 實作 BlogLayout 與 Sidebar 元件

**Files:**
- Create: `/Users/imacpro3/Documents/Obsidian/Lxon_Obsidian/Projects/《台灣靈格》部落格/src/layouts/BlogLayout.astro`
- Create: `/Users/imacpro3/Documents/Obsidian/Lxon_Obsidian/Projects/《台灣靈格》部落格/src/components/Sidebar.astro`

**Interfaces:**
- Consumes: `src/styles/global.css`
- Produces: 提供給全站頁面使用的 Layout 與大主題分類導覽樹。

- [ ] **Step 1: 建立 BlogLayout.astro**

在 `/Users/imacpro3/Documents/Obsidian/Lxon_Obsidian/Projects/《台灣靈格》部落格/src/layouts/BlogLayout.astro` 實作主框架，導入 View Transitions 以實現平滑換頁：
```astro
---
import { ViewTransitions } from 'astro:transitions';
import Sidebar from '../components/Sidebar.astro';
import '../styles/global.css';

interface Props {
  title: string;
}

const { title } = Astro.props;
---

<!DOCTYPE html>
<html lang="zh-Hant-TW">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title} | 《台灣靈格》部落格</title>
    <link rel="icon" type="image/svg+xml" href="/taiwan-spirit-blog/favicon.svg" />
    <ViewTransitions />
  </head>
  <body>
    <div class="layout-container">
      <Sidebar />
      <main class="main-content" transition:animate="fade">
        <slot />
      </main>
    </div>

    <style>
      .layout-container {
        display: flex;
        min-height: 100vh;
      }
      .main-content {
        flex: 1;
        padding: 2rem;
        background-color: var(--color-bg);
        overflow-y: auto;
        height: 100vh;
      }
      @media (max-width: 768px) {
        .layout-container {
          flex-direction: column;
        }
        .main-content {
          height: auto;
          padding: 1rem;
        }
      }
    </style>
  </body>
</html>
```

- [ ] **Step 2: 建立 Sidebar.astro**

在 `/Users/imacpro3/Documents/Obsidian/Lxon_Obsidian/Projects/《台灣靈格》部落格/src/components/Sidebar.astro` 實作左側分類導覽樹。我們會讀取 Content Collections 中的所有文章，動態整理出大主題（theme）與子分類（category）並顯示為 `details` 下拉樹：
```astro
---
import { getCollection } from 'astro:content';

const allPosts = await getCollection('blog', ({ data }) => !data.draft);

// 動態彙整主題與子分類結構
// theme 來自檔案 path 的子目錄名稱 (例如: blog/plants/xxx.md -> theme 為 plants)
const navigationData: Record<string, Set<string>> = {};

// 主題中文對照表
const themeNames: Record<string, string> = {
  fuzhe: '福澤系統',
  plants: '植物・作物',
  monsters: '精怪・地景',
  talismans: '符咒・法器',
  temples: '廟宇神靈'
};

allPosts.forEach((post) => {
  const parts = post.slug.split('/');
  if (parts.length > 1) {
    const theme = parts[0];
    const category = post.data.category;
    if (!navigationData[theme]) {
      navigationData[theme] = new Set();
    }
    navigationData[theme].add(category);
  }
});

const themes = Object.keys(navigationData).sort();
---

<aside class="sidebar">
  <div class="brand">
    <a href="/taiwan-spirit-blog/">
      <h1 class="brand-title">台灣靈格</h1>
      <span class="brand-subtitle">TAIWAN SPIRIT LOG</span>
    </a>
  </div>
  
  <nav class="nav-tree">
    {themes.map((theme) => (
      <details class="theme-group" open>
        <summary class="theme-summary">
          <span class="gold-bullet">✦</span>
          {themeNames[theme] || theme}
        </summary>
        <ul class="category-list">
          <li>
            <a href={`/taiwan-spirit-blog/${theme}`} class="category-link all-link">
              全部條目
            </a>
          </li>
          {Array.from(navigationData[theme]).sort().map((category) => (
            <li>
              <a 
                href={`/taiwan-spirit-blog/${theme}?category=${encodeURIComponent(category)}`} 
                class="category-link"
              >
                {category}
              </a>
            </li>
          ))}
        </ul>
      </details>
    ))}
  </nav>
</aside>

<style>
  .sidebar {
    width: 280px;
    background-color: var(--color-surface);
    border-right: 1px solid var(--color-border);
    padding: 2rem 1.5rem;
    height: 100vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }
  .brand {
    margin-bottom: 2rem;
    text-align: center;
    border-bottom: 1px solid var(--color-border);
    padding-bottom: 1.5rem;
  }
  .brand-title {
    font-family: var(--font-serif);
    font-size: 1.5rem;
    color: var(--color-gold);
    letter-spacing: 2px;
  }
  .brand-subtitle {
    font-family: var(--font-cinzel);
    font-size: 0.75rem;
    color: var(--color-text-muted);
    letter-spacing: 3px;
  }
  .nav-tree {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  .theme-group {
    border-bottom: 1px dashed rgba(216, 182, 109, 0.1);
    padding-bottom: 1rem;
  }
  .theme-summary {
    font-family: var(--font-serif);
    font-weight: 600;
    color: var(--color-gold);
    cursor: pointer;
    list-style: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0;
    font-size: 1.05rem;
  }
  .theme-summary::-webkit-details-marker {
    display: none;
  }
  .gold-bullet {
    font-size: 0.8rem;
    transition: transform 0.3s;
  }
  .theme-group[open] .gold-bullet {
    transform: rotate(45deg);
  }
  .category-list {
    list-style: none;
    padding-left: 1.2rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }
  .category-link {
    font-size: 0.9rem;
    color: var(--color-text-muted);
    display: block;
    padding: 0.25rem 0;
    transition: color 0.2s;
  }
  .category-link:hover {
    color: var(--color-gold-bright);
  }
  @media (max-width: 768px) {
    .sidebar {
      width: 100%;
      height: auto;
      border-right: none;
      border-bottom: 1px solid var(--color-border);
      padding: 1rem;
    }
    .brand {
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
    }
  }
</style>
```

- [ ] **Step 3: 建立 favicon 佔位檔案並 Commit**

建立一個基本的 favicon 檔案並提交代碼：
```bash
mkdir -p public
echo '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#d8b66d"/></svg>' > public/favicon.svg
git add src/layouts/BlogLayout.astro src/components/Sidebar.astro public/favicon.svg
git commit -m "feat: add BlogLayout and Sidebar navigation tree components"
```

---

### Task 4: 實作 ArticleCard 元件 (無圖古典 Placeholder 卡牌設計)

**Files:**
- Create: `/Users/imacpro3/Documents/Obsidian/Lxon_Obsidian/Projects/《台灣靈格》部落格/src/components/ArticleCard.astro`

**Interfaces:**
- Consumes: Astro Content Collection 單一條目資料
- Produces: 民俗暗金風格卡片，在沒有設定圖片時渲染古典圖騰裝飾盒。

- [ ] **Step 1: 建立 ArticleCard.astro 元件**

在 `/Users/imacpro3/Documents/Obsidian/Lxon_Obsidian/Projects/《台灣靈格》部落格/src/components/ArticleCard.astro` 實作以下內容：
```astro
---
import type { CollectionEntry } from 'astro:content';

interface Props {
  post: CollectionEntry<'blog'>;
}

const { post } = Astro.props;
const { title, subtitle, category, image, date } = post.data;
const formattedDate = new Date(date).toLocaleDateString('zh-TW', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});
---

<article class="article-card">
  <a href={`/taiwan-spirit-blog/posts/${post.slug}`}>
    <div class="image-area">
      {image ? (
        <img src={image} alt={title} class="card-image" />
      ) : (
        <div class="card-placeholder">
          <div class="ritual-pattern">
            <div class="inner-circle"></div>
            <div class="outer-decor"></div>
          </div>
          <div class="placeholder-text">{subtitle || 'TAIWAN SPIRIT'}</div>
        </div>
      )}
    </div>
    
    <div class="info-area">
      <div class="card-meta">
        <span class="meta-tag">{category}</span>
        <time class="meta-date">{formattedDate}</time>
      </div>
      <h3 class="card-title">{title}</h3>
      {subtitle && <p class="card-subtitle">{subtitle}</p>}
    </div>
  </a>
</article>

<style>
  .article-card {
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 4px;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  .article-card:hover {
    transform: translateY(-4px);
    border-color: var(--color-gold);
    box-shadow: 0 10px 20px rgba(216, 182, 109, 0.1), 0 0 15px var(--color-glow);
  }
  .image-area {
    position: relative;
    width: 100%;
    height: 180px;
    background-color: #0b0d10;
    overflow: hidden;
  }
  .card-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s;
  }
  .article-card:hover .card-image {
    transform: scale(1.05);
  }
  
  /* 古典無圖占位框設計 */
  .card-placeholder {
    width: 100%;
    height: 100%;
    border: 2px dashed rgba(216, 182, 109, 0.2);
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    background: radial-gradient(circle, rgba(46, 37, 24, 0.3) 0%, rgba(13, 15, 18, 0.8) 100%);
  }
  .article-card:hover .card-placeholder {
    border-color: rgba(216, 182, 109, 0.5);
  }
  .ritual-pattern {
    width: 60px;
    height: 60px;
    border: 1px solid rgba(216, 182, 109, 0.3);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    margin-bottom: 0.8rem;
    animation: rotate-slow 20s linear infinite;
  }
  .inner-circle {
    width: 40px;
    height: 40px;
    border: 1px dashed rgba(216, 182, 109, 0.4);
    border-radius: 50%;
  }
  .outer-decor::before, .outer-decor::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 48px;
    height: 48px;
    border: 1px solid rgba(216, 182, 109, 0.2);
    transform: translate(-50%, -50%) rotate(45deg);
  }
  .outer-decor::after {
    transform: translate(-50%, -50%) rotate(22.5deg);
  }
  .placeholder-text {
    font-family: var(--font-cinzel);
    font-size: 0.75rem;
    color: var(--color-gold);
    letter-spacing: 2px;
    text-transform: uppercase;
    opacity: 0.8;
  }
  
  /* 資訊區 */
  .info-area {
    padding: 1.25rem;
  }
  .card-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  .meta-tag {
    font-size: 0.75rem;
    color: var(--color-gold);
    background-color: rgba(216, 182, 109, 0.1);
    padding: 0.15rem 0.4rem;
    border-radius: 2px;
    border: 1px solid rgba(216, 182, 109, 0.15);
  }
  .meta-date {
    font-size: 0.75rem;
    color: var(--color-text-muted);
  }
  .card-title {
    font-family: var(--font-serif);
    font-size: 1.2rem;
    color: var(--color-text);
    margin-bottom: 0.25rem;
    transition: color 0.2s;
  }
  .article-card:hover .card-title {
    color: var(--color-gold-bright);
  }
  .card-subtitle {
    font-family: var(--font-cinzel);
    font-size: 0.8rem;
    color: var(--color-text-muted);
    font-style: italic;
  }
  
  @keyframes rotate-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
</style>
```

- [ ] **Step 2: 提交元件 Git Commit**

執行以下 Git 命令：
```bash
git add src/components/ArticleCard.astro
git commit -m "feat: implement ArticleCard with classical decorative placeholder for posts without image"
```

---

### Task 5: 實作部落格首頁、主題分類頁與文章詳細頁

**Files:**
- Create: `/Users/imacpro3/Documents/Obsidian/Lxon_Obsidian/Projects/《台灣靈格》部落格/src/pages/index.astro`
- Create: `/Users/imacpro3/Documents/Obsidian/Lxon_Obsidian/Projects/《台灣靈格》部落格/src/pages/[theme]/index.astro`
- Create: `/Users/imacpro3/Documents/Obsidian/Lxon_Obsidian/Projects/《台灣靈格》部落格/src/pages/posts/[slug].astro`

**Interfaces:**
- Consumes: BlogLayout, ArticleCard
- Produces: 部落格主要訪問入口與路由。

- [ ] **Step 1: 建立部落格首頁 index.astro**

在 `/Users/imacpro3/Documents/Obsidian/Lxon_Obsidian/Projects/《台灣靈格》部落格/src/pages/index.astro` 實作部落格大門，列出最新發布的文章：
```astro
---
import { getCollection } from 'astro:content';
import BlogLayout from '../layouts/BlogLayout.astro';
import ArticleCard from '../components/ArticleCard.astro';

const allPosts = await getCollection('blog', ({ data }) => !data.draft);
const sortedPosts = allPosts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
const recentPosts = sortedPosts.slice(0, 6);
---

<BlogLayout title="大盤點">
  <header class="page-header">
    <h2 class="section-title">最新條目盤點</h2>
    <p class="section-desc">彙整台灣山川、精怪、福澤、民俗儀式之神靈圖鑑與顯化故事。</p>
  </header>
  
  <div class="posts-grid">
    {recentPosts.map((post) => (
      <ArticleCard post={post} />
    ))}
  </div>
  
  {recentPosts.length === 0 && (
    <div class="empty-state">
      <p>目前尚無文章，請在 Obsidian 中撰寫並推送以發佈您的首篇靈格誌。</p>
    </div>
  )}
</BlogLayout>

<style>
  .page-header {
    margin-bottom: 2.5rem;
    border-bottom: 1px solid var(--color-border);
    padding-bottom: 1.5rem;
  }
  .section-title {
    font-family: var(--font-serif);
    font-size: 2rem;
    color: var(--color-gold);
    margin-bottom: 0.5rem;
  }
  .section-desc {
    color: var(--color-text-muted);
    font-size: 1rem;
  }
  .posts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
  }
  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
    border: 1px dashed var(--color-border);
    border-radius: 4px;
    color: var(--color-text-muted);
  }
</style>
```

- [ ] **Step 2: 建立主題頁面 [theme]/index.astro**

在 `/Users/imacpro3/Documents/Obsidian/Lxon_Obsidian/Projects/《台灣靈格》部落格/src/pages/[theme]/index.astro` 實作大主題與子分類篩選頁面：
```astro
---
import { getCollection } from 'astro:content';
import BlogLayout from '../../layouts/BlogLayout.astro';
import ArticleCard from '../../components/ArticleCard.astro';

export async function getStaticPaths() {
  const themes = ['fuzhe', 'plants', 'monsters', 'talismans', 'temples'];
  return themes.map((theme) => ({
    params: { theme }
  }));
}

const { theme } = Astro.params;
const allPosts = await getCollection('blog', ({ data }) => !data.draft);

// 篩選屬於當前 theme 的文章
const filteredPosts = allPosts.filter((post) => post.slug.startsWith(`${theme}/`));

const themeNames: Record<string, string> = {
  fuzhe: '福澤系統',
  plants: '植物・作物',
  monsters: '精怪・地景',
  talismans: '符咒・法器',
  temples: '廟宇神靈'
};

const pageTitle = themeNames[theme as string] || theme;
---

<BlogLayout title={pageTitle}>
  <header class="page-header">
    <div class="breadcrumb">
      <a href="/taiwan-spirit-blog/">首頁</a> ➔ <span>{pageTitle}</span>
    </div>
    <h2 class="section-title">{pageTitle}</h2>
  </header>
  
  <div class="posts-grid" id="posts-list">
    {filteredPosts.map((post) => (
      <ArticleCard post={post} />
    ))}
  </div>
  
  {filteredPosts.length === 0 && (
    <div class="empty-state">
      <p>此主題下暫無文章。</p>
    </div>
  )}
</BlogLayout>

<script>
  // 透過網址的 category 參數動態在客戶端做二次過濾
  function filterByCategory() {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');
    if (!category) return;
    
    const cards = document.querySelectorAll('.article-card');
    cards.forEach((card) => {
      const tagElement = card.querySelector('.meta-tag');
      if (tagElement) {
        const text = tagElement.textContent?.trim();
        if (text !== category) {
          (card as HTMLElement).style.display = 'none';
        } else {
          (card as HTMLElement).style.display = 'block';
        }
      }
    });
  }

  // 監聽 View Transition 頁面切換事件重新過濾
  document.addEventListener('astro:page-load', filterByCategory);
</script>

<style>
  .page-header {
    margin-bottom: 2.5rem;
    border-bottom: 1px solid var(--color-border);
    padding-bottom: 1.5rem;
  }
  .breadcrumb {
    font-size: 0.85rem;
    color: var(--color-text-muted);
    margin-bottom: 0.5rem;
  }
  .breadcrumb a:hover {
    color: var(--color-gold);
  }
  .section-title {
    font-family: var(--font-serif);
    font-size: 2rem;
    color: var(--color-gold);
  }
  .posts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
  }
  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
    border: 1px dashed var(--color-border);
    color: var(--color-text-muted);
  }
</style>
```

- [ ] **Step 3: 建立文章詳細頁 posts/[slug].astro**

在 `/Users/imacpro3/Documents/Obsidian/Lxon_Obsidian/Projects/《台灣靈格》部落格/src/pages/posts/[slug].astro` 實作 Markdown 的內文渲染頁：
```astro
---
import { getCollection } from 'astro:content';
import BlogLayout from '../../layouts/BlogLayout.astro';

export async function getStaticPaths() {
  const allPosts = await getCollection('blog');
  return allPosts.map((post) => ({
    params: { slug: post.slug },
    props: { post }
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
const { title, subtitle, category, image, date, regions, cities } = post.data;

const formattedDate = new Date(date).toLocaleDateString('zh-TW', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});
---

<BlogLayout title={title}>
  <article class="post-detail">
    <header class="post-header">
      <div class="breadcrumb">
        <a href="/taiwan-spirit-blog/">首頁</a> ➔ <span>{title}</span>
      </div>
      
      <h1 class="post-title">{title}</h1>
      {subtitle && <p class="post-subtitle">{subtitle}</p>}
      
      <div class="post-meta">
        <span class="meta-item">分類：{category}</span>
        <span class="meta-item">發佈：{formattedDate}</span>
      </div>
      
      {(regions.length > 0 || cities.length > 0) && (
        <div class="post-tags">
          {regions.map((r) => <span class="tag">🗺️ {r}</span>)}
          {cities.map((c) => <span class="tag">📍 {c}</span>)}
        </div>
      )}
    </header>

    {image && (
      <div class="post-banner">
        <img src={image} alt={title} />
      </div>
    )}

    <section class="post-content">
      <Content />
    </section>
    
    <footer class="post-footer">
      <a href="javascript:history.back()" class="back-btn">
        ➔ 返回列表
      </a>
    </footer>
  </article>
</BlogLayout>

<style>
  .post-detail {
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem 0;
  }
  .post-header {
    margin-bottom: 2rem;
    border-bottom: 1px solid var(--color-border);
    padding-bottom: 1.5rem;
  }
  .breadcrumb {
    font-size: 0.85rem;
    color: var(--color-text-muted);
    margin-bottom: 0.8rem;
  }
  .breadcrumb a:hover {
    color: var(--color-gold);
  }
  .post-title {
    font-family: var(--font-serif);
    font-size: 2.5rem;
    color: var(--color-gold);
    margin-bottom: 0.5rem;
  }
  .post-subtitle {
    font-family: var(--font-cinzel);
    font-size: 1.2rem;
    color: var(--color-text-muted);
    font-style: italic;
    margin-bottom: 1rem;
  }
  .post-meta {
    display: flex;
    gap: 1.5rem;
    font-size: 0.9rem;
    color: var(--color-text-muted);
    margin-bottom: 1rem;
  }
  .post-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  .tag {
    font-size: 0.8rem;
    color: var(--color-text);
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    padding: 0.2rem 0.5rem;
    border-radius: 2px;
  }
  .post-banner {
    width: 100%;
    max-height: 400px;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 2.5rem;
    border: 1px solid var(--color-border);
  }
  .post-banner img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  /* Markdown 內文樣式 */
  .post-content {
    font-size: 1.1rem;
    line-height: 1.8;
    color: #cbd5e1;
    letter-spacing: 0.5px;
  }
  .post-content :global(h2) {
    font-family: var(--font-serif);
    color: var(--color-gold);
    font-size: 1.6rem;
    margin: 2rem 0 1rem;
    border-bottom: 1px dashed var(--color-border);
    padding-bottom: 0.5rem;
  }
  .post-content :global(h3) {
    font-family: var(--font-serif);
    color: var(--color-gold-bright);
    font-size: 1.3rem;
    margin: 1.5rem 0 0.8rem;
  }
  .post-content :global(p) {
    margin-bottom: 1.5rem;
  }
  .post-content :global(ul), .post-content :global(ol) {
    margin-bottom: 1.5rem;
    padding-left: 2rem;
  }
  .post-content :global(li) {
    margin-bottom: 0.5rem;
  }
  .post-content :global(blockquote) {
    border-left: 3px solid var(--color-gold);
    padding-left: 1.5rem;
    font-style: italic;
    color: var(--color-text-muted);
    margin: 1.5rem 0;
  }
  
  .post-footer {
    margin-top: 4rem;
    border-top: 1px solid var(--color-border);
    padding-top: 2rem;
  }
  .back-btn {
    font-family: var(--font-serif);
    color: var(--color-gold);
    font-weight: 600;
    transition: color 0.2s;
  }
  .back-btn:hover {
    color: var(--color-gold-bright);
  }
</style>
```

- [ ] **Step 4: 提交程式碼 Commit**

將頁面程式碼加入 Git 並提交：
```bash
git add src/pages/index.astro src/pages/\[theme\]/index.astro src/pages/posts/\[slug\].astro
git commit -m "feat: add main blog pages (index, theme listing, and slug rendering)"
```

---

### Task 6: 導入初始測試文章並進行本地編譯驗證

**Files:**
- Create: `/Users/imacpro3/Documents/Obsidian/Lxon_Obsidian/Projects/《台灣靈格》部落格/src/content/blog/plants/betel.md`
- Create: `/Users/imacpro3/Documents/Obsidian/Lxon_Obsidian/Projects/《台灣靈格》部落格/src/content/blog/monsters/frog.md`

**Interfaces:**
- Produces: 測試用文章與本地成功的靜態編譯產出。

- [ ] **Step 1: 建立第一篇測試植物文章**

在 `/Users/imacpro3/Documents/Obsidian/Lxon_Obsidian/Projects/《台灣靈格》部落格/src/content/blog/plants/betel.md` 中寫入內容（不含圖片以測試古典 Placeholder 框）：
```markdown
---
title: "檳榔"
subtitle: "Areca catechu"
category: "聚落老樹"
date: 2026-07-14
regions: ["聚落老樹・家屋"]
cities: ["南投", "屏東"]
draft: false
---

## 植物特性

檳榔是台灣常見的棕櫚科常綠喬木，樹幹筆直、葉片成羽狀複葉。在民俗文化中，檳榔常扮演重要的儀式角色，也是早期台灣社會常見的交際贈禮與祭祀供品。

## 靈格轉化可能

於設定中，檳榔可轉化為「聚落邊界護衛者」，筆直的樹身宛如矗立的靈哨，為家屋守護邊界。
```

- [ ] **Step 2: 建立第二篇測試精怪文章**

在 `/Users/imacpro3/Documents/Obsidian/Lxon_Obsidian/Projects/《台灣靈格》部落格/src/content/blog/monsters/frog.md` 中寫入內容：
```markdown
---
title: "台北樹蛙"
subtitle: "Rhacophorus taipeianus"
category: "北部盆地"
date: 2026-07-14
regions: ["北部盆地・河口"]
cities: ["台北", "新北"]
draft: false
---

## 精怪傳說

生活在北部盆地邊界的綠色樹蛙，通常在濕冷的冬季進行繁殖，其產下的泡沫卵泡常被民間視為「大地豐澤與孕育之兆」。

## 靈格特徵

綠色的外表使牠們與都市邊緣的綠林完美融合，能發出低沉的鳴叫以調和濕地的豐澤靈氣。
```

- [ ] **Step 3: 執行 Astro 本地編譯驗證**

執行以下編譯命令，確認程式碼與 Markdown 配置無錯誤：
```bash
npm run build
```
預期輸出：成功生成靜態檔案，在 `dist/` 資料夾下產生編譯完成的 HTML 檔，無任何 TypeScript 或是 Astro 錯誤。

- [ ] **Step 4: 提交測試資料 Git Commit**

```bash
git add src/content/blog/plants/betel.md src/content/blog/monsters/frog.md
git commit -m "test: add two test markdown posts for validation"
```

---

### Task 7: 建立 GitHub 公開倉庫並配置 Actions 自動化部署

**Files:**
- Create: `/Users/imacpro3/Documents/Obsidian/Lxon_Obsidian/Projects/《台灣靈格》部落格/.github/workflows/deploy.yml`

**Interfaces:**
- Produces: GitHub 雲端 Public Repository，並配置 GitHub Actions 自動發布至 GitHub Pages。

- [ ] **Step 1: 建立 GitHub Actions 部署工作流檔案**

在 `/Users/imacpro3/Documents/Obsidian/Lxon_Obsidian/Projects/《台灣靈格》部落格/.github/workflows/deploy.yml` 寫入先前 SPEC.md 定義的佈署配置：
```yaml
name: Deploy Taiwan Spirit Blog

on:
  push:
    branches:
      - main

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

- [ ] **Step 2: 建立 GitHub 公開 Repo 並推送**

使用 GitHub CLI `gh` 來建立一個公開的 Repo 並將當前代碼推送上傳。
執行以下指令：
```bash
git add .github/workflows/deploy.yml
git commit -m "feat: add GitHub Actions workflow for Pages deployment"
gh repo create taiwan-spirit-blog --public --source=. --push
```
預期輸出：GitHub Repo 建立成功，並將 main 分支代碼推送上傳。

- [ ] **Step 3: 說明並引導設定 GitHub Pages 來源**

執行以下命令取得專案的 Pages 部署狀態連結：
```bash
gh run list --limit 1
```
預期輸出：顯示剛推送的 "Deploy Taiwan Spirit Blog" Actions 工作流正在執行（In Progress）或成功。

---
