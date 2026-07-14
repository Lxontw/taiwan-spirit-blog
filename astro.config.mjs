import { defineConfig } from 'astro/config';

// 預設部署在 github pages，因為網域先保留，所以 site 先設定為預設的 github.io
export default defineConfig({
  site: 'https://imacpro3.github.io',
  base: '/taiwan-spirit-blog',
  output: 'static'
});
