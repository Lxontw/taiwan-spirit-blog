import fs from 'fs';
import path from 'path';

const talismansDir = '/Users/imacpro3/Documents/Obsidian/Lxon_Obsidian/Projects/《台灣靈格》部落格/src/content/blog/talismans';
const targetImageDir = '/Users/imacpro3/Documents/Obsidian/Lxon_Obsidian/Projects/《台灣靈格》部落格/public/assets/images/talismans';

// 確保目標資料夾存在
if (!fs.existsSync(targetImageDir)) {
  fs.mkdirSync(targetImageDir, { recursive: true });
}

// 檔案英文化命名對照表
const nameMap = {
  '道經師寶印': 'dao-jing-shi-bao-yin',
  '八卦五雷符': 'bagua-five-thunder-talisman',
  '地府錢-將軍錢': 'difu-money-jiangjun-money',
  '天師鎮宅符': 'tianshi-town-house-talisman',
  '太歲紙錢': 'taisui-joss-paper',
  '法印': 'dharma-seal'
};

const files = fs.readdirSync(talismansDir).filter(f => f.endsWith('.md'));

files.forEach(file => {
  const filePath = path.join(talismansDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 匹配 frontmatter 中的 base64 圖片內容
  const match = content.match(/image:\s*["']data:image\/(png|jpeg);base64,([^"']+)["']/);
  if (match) {
    const ext = match[1]; // png 或 jpeg
    const base64Data = match[2];
    
    const baseName = file.replace('.md', '');
    
    // 從對照表中取得英文檔名
    let englishName = nameMap[baseName];
    if (!englishName) {
      englishName = baseName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      if (/^-+$/.test(englishName)) {
        englishName = `talisman-${Date.now()}`;
      }
    }
    
    // 依使用者指示改用 [中文條目名稱]_[英文].[副檔名] 命名，以方便在Finder本機尋找
    const outputImageName = `${baseName}_${englishName}.${ext}`;
    const outputImagePath = path.join(targetImageDir, outputImageName);
    
    // 將 Base64 解碼並寫入實體圖片檔案
    fs.writeFileSync(outputImagePath, Buffer.from(base64Data, 'base64'));
    console.log(`Extracted Base64 image to: ${outputImagePath}`);
    
    // 將 Markdown 中的 image 欄位替換為專屬目錄的實體圖片 URL 連結
    const relativePath = `/taiwan-spirit-blog/assets/images/talismans/${outputImageName}`;
    content = content.replace(/image:\s*["']data:image\/(png|jpeg);base64,[^"']+["']/, `image: "${relativePath}"`);
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Successfully updated image path in markdown: ${file}`);
  }
});

console.log('Base64 image extraction complete!');
