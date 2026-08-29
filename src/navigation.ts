import { getPermalink, getBlogPermalink } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: '首页',
      href: getPermalink('/'),
    },
    {
      text: '文章',
      href: getBlogPermalink(),
    },
    {
      text: '关于我',
      href: getPermalink('/about'),
    },
    {
      text: '联系我',
      href: getPermalink('/contact'),
    },
  ],
  actions: [],
};

export const footerData = {
  socialLinks: [{ ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/yuhaixin0924' }],
  footNote: `
    © ${new Date().getFullYear()} brokenvase · 内容仅代表个人学习记录。
  `,
};
