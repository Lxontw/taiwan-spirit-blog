import fs from 'fs';
import path from 'path';

const blogDir = '/Users/imacpro3/Documents/Obsidian/Lxon_Obsidian/Projects/《台灣靈格》部落格/src/content/blog';
const outFile = '/Users/imacpro3/Documents/Obsidian/Lxon_Obsidian/Projects/《台灣靈格》部落格/image_generation_tracker.md';

const themes = ['fuzhe', 'monsters', 'plants', 'talismans', 'temples'];
const themeNames = {
  fuzhe: '福澤系統',
  monsters: '精怪・地景',
  plants: '植物・作物',
  talismans: '符咒・法器',
  temples: '廟宇神靈'
};

let mdContent = `# 🎨 《台灣靈格》插圖生成與進度追蹤總表

本表用於追蹤全站 305 筆條目的 AI 像素風格插圖生成進度。

---

## 📌 統一像素風格 Prompt 範本
複製以下 Prompt 並將 \`[ ]\` 內的主體資訊替換，即可生成與「台北樹蛙」同系列（民俗暗金、神祕深夜、復古像素）的插圖：

\`\`\`text
A high-quality 32-bit retro pixel art illustration of [主角或物件名稱] ([英文名或學名]), [主體細節特徵描述，例如：vibrant green skin, dry wood texture]. [主體姿態，例如：perched on a damp mossy stone / floating in the air]. Around the [主體], faint golden magical runes and glowing Taiwanese folklore symbols float in the air. The background is a dark, atmospheric mystical environment at night, blending retro game design with a mysterious Taiwanese folklore aesthetic. Cozy lighting, detailed shading, 16-bit console graphics.
\`\`\`

---

## 📂 圖片存放與更新步驟
1. 使用 AI 生成 **1:1 (正方形)** 的像素圖片。
2. 將圖片存放到部落格專案的靜態資產目錄中，命名格式建議為英文/拼音：
   [public/assets/images/](file:///Users/imacpro3/Documents/Obsidian/Lxon_Obsidian/Projects/《台灣靈格》部落格/public/assets/images/) \`[主題]/[檔名].jpg\`
3. 開啟該條目的 Markdown 檔案，在 frontmatter 中填入圖片路徑：
   \`\`\`yaml
   image: "/taiwan-spirit-blog/assets/images/[主題]/[檔名].jpg"
   \`\`\`
4. 儲存並 Git Push，網頁即會自動渲染新圖片。

---

`;

themes.forEach(theme => {
  const themeDir = path.join(blogDir, theme);
  if (!fs.existsSync(themeDir)) return;
  
  const files = fs.readdirSync(themeDir).filter(f => f.endsWith('.md'));
  
  mdContent += `## 📂 ${themeNames[theme]} (${files.length} 筆)\n\n`;
  mdContent += `| 狀態 | 條目名稱 | 學名/副標題 | 子分類 | 本地檔案連結 |\n`;
  mdContent += `| :---: | :--- | :--- | :--- | :--- |\n`;
  
  files.forEach(file => {
    const filePath = path.join(themeDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // 解析 frontmatter 欄位 (支援雙引號或無引號格式)
    const titleMatch = fileContent.match(/title:\s*"(.*?)"/) || fileContent.match(/title:\s*([^\n\r]+)/);
    const title = titleMatch ? titleMatch[1].replace(/"/g, '') : file.replace('.md', '');
    
    const subtitleMatch = fileContent.match(/subtitle:\s*"(.*?)"/) || fileContent.match(/subtitle:\s*([^\n\r]+)/);
    const subtitle = subtitleMatch ? subtitleMatch[1].replace(/"/g, '') : '';
    
    const categoryMatch = fileContent.match(/category:\s*"(.*?)"/) || fileContent.match(/category:\s*([^\n\r]+)/);
    const category = categoryMatch ? categoryMatch[1].replace(/"/g, '') : '未分類';
    
    const hasImage = fileContent.includes('image:');
    const status = hasImage ? '✅ 有圖' : '❌ 缺圖';
    
    // Obsidian 本地檔案連結
    const localLink = `[${file}](file://${filePath})`;
    
    mdContent += `| ${status} | **${title}** | *${subtitle}* | ${category} | ${localLink} |\n`;
  });
  
  mdContent += `\n\n`;
});

fs.writeFileSync(outFile, mdContent, 'utf8');
console.log('Tracker generated!');
