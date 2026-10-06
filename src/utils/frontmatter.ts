import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';
import type { RehypePlugin, RemarkPlugin } from '@astrojs/markdown-remark';
import type { Element, Root } from 'hast';

export const readingTimeRemarkPlugin: RemarkPlugin = () => {
  return function (tree, file) {
    const textOnPage = toString(tree);
    const readingTime = Math.ceil(getReadingTime(textOnPage).minutes);

    if (typeof file?.data?.astro?.frontmatter !== 'undefined') {
      file.data.astro.frontmatter.readingTime = readingTime;
    }
  };
};

export const responsiveTablesRehypePlugin: RehypePlugin = () => {
  return function (tree) {
    const wrapTables = (parent: Root | Element) => {
      for (let i = 0; i < parent.children.length; i++) {
        const child = parent.children[i];
        if (child.type !== 'element') continue;

        if (child.tagName === 'table') {
          parent.children[i] = {
            type: 'element',
            tagName: 'div',
            properties: {
              className: ['markdown-table-wrapper'],
              tabIndex: 0,
              role: 'region',
              ariaLabel: '文章表格（可横向滚动）',
            },
            children: [child],
          };
        } else {
          wrapTables(child);
        }
      }
    };

    wrapTables(tree);
  };
};
