import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

// history: createWebHashHistory(import.meta.env.BASE_URL),
// 修改为上面的模式后，开发时访问路径 http://localhost:5173/codeGupiao#/codeGupiao
// 直接打开本地路径 file:///Users/guyi/Documents/work/ywsVueThree/dist/index.html#/codeGupiao
// 打包放在服务器目录下访问路径   http://localhost:3033/index.html#/codeGupiao

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_UR),
  routes: [
    {
      path: '/',
      redirect: '/BookEdit'
    },
     {
      path: '/BookEdit',
      name: 'BookEdit',
      component: () => import('../views/goowee/BookEdit.vue'),
    },
  ],
})

export default router
