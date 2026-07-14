import fs from 'fs';
import path from 'path';

const sourceDir = '/Users/imacpro3/Documents/Obsidian/Lxon_Obsidian/Projects/《台灣靈格》/TaiwanSpiritCore/data';
const targetDir = '/Users/imacpro3/Documents/Obsidian/Lxon_Obsidian/Projects/《台灣靈格》部落格/src/content/blog';

// 我們的 5 個大主題目錄
const themes = ['fuzhe', 'monsters', 'plants', 'talismans', 'temples'];

themes.forEach(theme => {
  const themeSrcDir = path.join(sourceDir, theme);
  const themeTargetDir = path.join(targetDir, theme);
  
  if (!fs.existsSync(themeSrcDir)) {
    console.log(`Source directory not found: ${themeSrcDir}`);
    return;
  }
  
  if (!fs.existsSync(themeTargetDir)) {
    fs.mkdirSync(themeTargetDir, { recursive: true });
  }
  
  const files = fs.readdirSync(themeSrcDir).filter(f => f.endsWith('.json'));
  
  files.forEach(file => {
    const filePath = path.join(themeSrcDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // 1. 建立 frontmatter
    let frontmatter = `---
title: "${data.title.replace(/"/g, '\\"')}"
`;
    if (data.subtitle) {
      frontmatter += `subtitle: "${data.subtitle.replace(/"/g, '\\"')}"\n`;
    }
    
    // category 容錯，若無 category 則設定預設值
    const category = data.category || '未分類';
    frontmatter += `category: "${category.replace(/"/g, '\\"')}"\n`;
    frontmatter += `date: 2026-07-14\n`;
    
    if (data.image) {
      // 保留原有圖片設定，若原本有就使用
      frontmatter += `image: "${data.image}"\n`;
    }
    
    const regions = data.content?.regions || [];
    const cities = data.content?.cities || [];
    frontmatter += `regions: ${JSON.stringify(regions)}\n`;
    frontmatter += `cities: ${JSON.stringify(cities)}\n`;
    
    const transformations = data.content?.transformations || [];
    if (transformations.length > 0) {
      frontmatter += `tags: ${JSON.stringify(transformations)}\n`;
    }
    frontmatter += `draft: false\n`;
    frontmatter += `---\n\n`;
    
    // 2. 建立內文 (summary)
    let content = data.content?.summary || '';
    
    // 3. 追加靈格轉化可能
    if (transformations.length > 0) {
      content += `\n\n## 靈格轉化可能\n`;
      transformations.forEach(t => {
        content += `- ${t}\n`;
      });
    }
    
    // 4. 追加參考來源
    if (data.source?.url) {
      content += `\n\n## 參考來源\n`;
      content += `- [${data.source.label || '相關連結'}](${data.source.url})\n`;
    }
    
    const mdContent = frontmatter + content;
    const targetFilePath = path.join(themeTargetDir, file.replace('.json', '.md'));
    fs.writeFileSync(targetFilePath, mdContent, 'utf8');
  });
  
  console.log(`Migrated ${files.length} items for theme: ${theme}`);
});

console.log('Migration complete!');
