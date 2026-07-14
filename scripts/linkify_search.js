import fs from 'fs';
import path from 'path';

const blogDir = '/Users/imacpro3/Documents/Obsidian/Lxon_Obsidian/Projects/《台灣靈格》部落格/src/content/blog/fuzhe';

const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));

files.forEach(file => {
  const filePath = path.join(blogDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 匹配 "圖片參考搜尋：關鍵字"
  const regex = /圖片參考搜尋：([^\n\r]+)/g;
  
  if (regex.test(content)) {
    content = content.replace(/圖片參考搜尋：([^\n\r]+)/g, (match, query) => {
      // 防止重複連結化
      if (query.includes('http')) return match;
      const cleanQuery = query.trim();
      const encodedQuery = encodeURIComponent(cleanQuery);
      return `圖片參考搜尋：[${cleanQuery}](https://www.google.com/search?tbm=isch&q=${encodedQuery})`;
    });
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Linkified search query for: ${file}`);
  }
});

console.log('Linkify search complete!');
