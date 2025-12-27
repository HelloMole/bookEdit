import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "绘本编辑器文档",
  description: "技术文档",
  base: '/BookEditDoc/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    search: {
      provider: 'local'
    },
    nav: [
      { text: '主页', link: '/' },
      // { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: '新手入门',
        collapsed: false,
        items: [
          { text: '快速部署', link: '/quick-start' },
          { text: '快速上手', link: '/quick-use' },
          { text: '制作第一个分镜', link: '/first-fenjin' }
        ]
      },
      {
        text: '内置节点介绍',
        collapsed: false,
        items: [
          { text: '输入', link: '/node-input'  },
          { text: '中间', link: '/node-middle' },
          { text: '输出', link: '/node-output' },
          { text: '物件', link: '/node-object' },
          { text: '快捷操作', link: '/node-quickHand' },
        ]
      },
      {
        text: '进阶使用',
        collapsed: false,
        items: [
          { text: '表格模式', link: '/table-edit' },
          { text: '自定义节点', link: '/custom-node' },
          // { text: '扩展编辑器', link: '/custom-edit' },
          { text: '动态校验码', link: '/authcode' },
        ]
      },
    ],



    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
