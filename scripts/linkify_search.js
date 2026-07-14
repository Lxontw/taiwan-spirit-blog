import fs from 'fs';
import path from 'path';

const blogDir = '/Users/imacpro3/Documents/Obsidian/Lxon_Obsidian/Projects/《台灣靈格》部落格/src/content/blog/fuzhe';

const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));

files.forEach(file => {
  const filePath = path.join(blogDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 匹配前文與 "圖片參考搜尋"，將其換行獨立段落（往下一行）
  // 支援原本為 "。圖片參考搜尋：" 或 "，圖片參考搜尋：" 的形式
  const regex = /[。，]\s*圖片參考搜尋：/g;
  
  if (regex.test(content)) {
    content = content.replace(/[。，]\s*圖片參考搜尋：/g, (match) => {
      const punc = match[0]; // 保留原有的句號或逗號
      return `${punc}\n\n圖片參考搜尋：`;
    });
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Markdown formatted and linkified for: ${file}`);
  }
});

console.log('Markdown formatting complete!');
