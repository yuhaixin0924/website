# 我的学习博客

一个基于 Astro 构建的个人博客，记录算法导论与学习笔记，支持数学公式和静态站点部署。

**主要内容**
- 算法导论学习笔记与解析
- 数据结构与算法题解与思路
- 数学公式（KaTeX）示例与讲解
- 博客随笔与技术沉淀

**技术栈**
- 框架：Astro（静态站点生成）
- 内容：Markdown / MDX，使用 Astro Content Collections 管理文章
- 样式：Tailwind CSS（项目中使用 Tailwind 类名，可按需启用）
- 数学公式：remark-math + rehype-katex + KaTeX
- 构建与运行：Node.js + npm
- 部署：推荐 GitHub + Vercel（自动构建与 CDN）

**本地运行**
在项目根目录下运行：

```bash
npm install
npm run dev      # 本地开发 (默认端口 localhost:4321)
npm run build    # 生成生产文件到 dist/
npm run preview  # 预览构建结果
```

**部署（推荐）**
1. 将项目推送到 GitHub 仓库。
2. 在 Vercel 上新建项目并连接该 GitHub 仓库，构建命令使用 `npm run build`，输出目录为 `dist`。
3. 每次推送都会触发自动部署。

**项目结构（简要）**
```
├── public/
├── src/
│   ├── assets/         # 图片与静态资源
│   ├── components/     # 公共组件（Header/Footer/BaseHead）
│   ├── content/        # 内容集合（src/content/blog）
│   ├── layouts/        # 页面布局
│   └── pages/          # 路由页面（index.astro, about.astro, blog/*）
├── astro.config.mjs
├── package.json
└── README.md
```

**注意事项**
- 请检查每篇文章 frontmatter 中的 `description`、`pubDate` 与 `heroImage` 路径是否正确。
- 本仓库包含 `.gitignore`，会忽略 `node_modules`、构建输出与本地环境文件。

