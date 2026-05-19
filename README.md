# 我的学习博客

一个基于 Astro 构建的个人博客，主要分享算法导论、数据结构与算法、数学公式和学习笔记。

**主要内容**
- 算法导论学习笔记与解析
- 数据结构与算法题解与思路
- 数学公式（KaTeX）示例与讲解
- 博客随笔与技术沉淀

**技术栈**
- 框架：Astro（静态站点生成）
- 内容：Markdown / MDX，使用 Astro Content Collections 管理文章
- 样式：Tailwind CSS
- 数学公式：remark-math + rehype-katex + KaTeX
- 构建与运行：Node.js + npm
- 部署：GitHub + Vercel

**本地运行**
在项目根目录下运行：

```bash
npm install
npm run dev
npm run build
npm run preview
```

**部署（推荐）**
1. 将项目推送到 GitHub 仓库。
2. 在 Vercel 上新建项目并连接该 GitHub 仓库，构建命令使用 `npm run build`，输出目录为 `dist`。
3. 每次推送都会触发自动部署。

**项目结构（简要）**
```
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── content/
│   ├── layouts/
│   └── pages/
├── astro.config.mjs
├── package.json
└── README.md
```

**注意事项**
- 请检查每篇文章 frontmatter 中的 `description`、`pubDate` 与 `heroImage` 路径是否正确。
- 本仓库包含 `.gitignore`，会忽略 `node_modules`、构建输出与本地环境文件。
