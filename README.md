# brokenvase 的学习笔记

记录算法导论、数据结构、数学与计算机基础的个人学习博客。

项目使用 Astro 6、TypeScript 和 Tailwind CSS 4 构建。目前以静态网站方式运行，并部署到 Vercel；正式域名为 `https://www.brokenvase.top`。

## 开始使用

需要 Node.js 22.12 或更高版本。

```bash
npm install
npm run dev
```

开发服务器默认地址为 `http://localhost:4321`。

```bash
npm run check    # 类型、代码规范和格式检查
npm run build    # 生成正式网站到 dist/
npm run preview  # 在本地预览正式构建
npm run fix      # 自动修复可修复的格式和代码规范问题
```

## 项目结构

```text
.
├── api/                    # Vercel Functions 后端接口
├── public/                 # 原样复制到网站根目录的静态文件
├── src/
│   ├── assets/             # 会经过 Astro 优化的图片、样式和站内资源
│   ├── components/         # 页面复用组件
│   │   ├── blog/           # 文章列表、文章正文、标签、分页
│   │   ├── common/         # SEO、主题切换、图片、分享等通用功能
│   │   ├── ui/             # 按钮、标题、内容容器等基础组件
│   │   └── widgets/        # 页头、页脚、首页区块
│   ├── data/post/          # Markdown / MDX 博客文章
│   ├── layouts/            # 全站、普通页面和文章页面布局
│   ├── pages/              # 文件路由；文件路径决定网页地址
│   ├── utils/              # 文章读取、链接、图片和 frontmatter 工具
│   ├── config.yaml         # 站名、域名、语言、SEO、博客规则等核心配置
│   ├── content.config.ts   # 文章集合及 frontmatter 字段规则
│   └── navigation.ts       # 顶部导航、页脚和公开社交链接
├── vendor/integration/     # 读取 config.yaml 的 AstroWind 配置集成
├── astro.config.ts         # Astro、MDX、Tailwind、站点地图和图片配置
├── vercel.json             # Vercel 路由与缓存响应头配置
├── package.json            # 依赖、Node.js 版本和 npm 命令
├── tsconfig.json           # TypeScript 和 `~/` 路径别名配置
└── .github/workflows/      # GitHub 推送或 PR 时执行构建和检查
```

以下目录由工具生成或仅用于本地恢复，不应手动编辑，也不会部署：

- `node_modules/`、`node_modules.nosync/`：本地安装的依赖。
- `.astro/`：Astro 开发缓存和类型文件。
- `dist/`：`npm run build` 生成的网站成品。
- `_local-archive/`、`local-backups/`：工程整理前的本地备份。

## 页面和网址

| 源文件                                | 网站地址        | 作用                   |
| ------------------------------------- | --------------- | ---------------------- |
| `src/pages/index.astro`               | `/`             | 首页                   |
| `src/pages/about.astro`               | `/about`        | 关于我资料卡           |
| `src/pages/contact.astro`             | `/contact`      | 联系表单               |
| `src/pages/[...blog]/[...page].astro` | `/blog`         | 文章列表与分页         |
| `src/pages/[...blog]/index.astro`     | 文章固定链接    | 文章正文               |
| `src/pages/[...blog]/category/`       | `/category/...` | 分类页                 |
| `src/pages/[...blog]/tag/`            | `/tag/...`      | 标签页                 |
| `src/pages/rss.xml.ts`                | `/rss.xml`      | RSS 订阅源             |
| `src/pages/404.astro`                 | `/404`          | 找不到页面时显示的内容 |

## 写一篇文章

在 `src/data/post/` 新建 `.md` 或 `.mdx` 文件。常用 frontmatter 示例：

```yaml
---
title: '文章标题'
publishDate: 2026-08-27
excerpt: '文章摘要'
image: '../../assets/images/cover.jpg'
category: '数据结构'
tags: ['CSAPP', '学习笔记']
author: 'brokenvase'
draft: false
---
```

文章使用的图片建议放在 `src/assets/images/`，Astro 会在构建时压缩并生成适合浏览器的格式。头像文件是 `src/assets/images/avatar.jpg`；当前 Logo 是 `public/logo.jpg`。

## 配置与部署

- 网站名称、描述、正式域名和 SEO：`src/config.yaml`
- 导航和 GitHub 链接：`src/navigation.ts`
- Vercel 构建命令：`npm run build`
- Vercel 输出目录：`dist`
- DNS 与外层 CDN：Cloudflare
- 网站托管：Vercel

Vercel 会自动提供 HTTPS 证书并续期；域名正确连接到 Vercel 后，不需要自行购买或上传证书。

## 留言与联系表单

文章留言使用 Giscus，数据保存在 GitHub Discussions，不需要数据库。联系表单通过 `api/contact.ts` 调用 Resend，收件地址仅保存在 Vercel 环境变量中，不会写入仓库。

### Giscus 留言

GitHub Discussions 与 Giscus 应用均已启用。留言使用 `Announcements` 分类，并按文章路径分别建立 Discussion；仓库名、仓库 ID 与分类 ID 均已写入 `src/components/blog/Comments.astro`，不需要在 Vercel 中配置留言相关环境变量。访客需要登录 GitHub 才能留言，你可以直接在仓库的 Discussions 页面管理内容。

### 启用联系邮件

1. 注册 Resend，并添加发送域名 `brokenvase.top`。
2. 按 Resend 提示在 Cloudflare DNS 中添加 SPF、DKIM 等验证记录。
3. 在 Resend 创建 API Key。
4. 在 Vercel 项目中添加以下环境变量：

```text
RESEND_API_KEY=Resend 生成的密钥
CONTACT_TO_EMAIL=你的收件邮箱
CONTACT_FROM_EMAIL=brokenvase 的学习笔记 <contact@brokenvase.top>
```

不要把真实密钥或私人邮箱提交到 Git；本地测试时应填写在被 Git 忽略的 `.env` 中。

## 尚待替换的品牌资源

- 新 Logo：替换 `public/logo.jpg`，建议使用正方形 PNG、WebP 或 JPG。
- 默认分享封面：建议使用 1200 × 630 图片，放入 `src/assets/images/` 后在 `src/config.yaml` 的 `metadata.openGraph.images` 中启用。

在分享封面提供前，网站不会使用 AstroWind 模板的默认社交图片。
