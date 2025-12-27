import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import legacy from '@vitejs/plugin-legacy';
// import obfuscator from 'rollup-plugin-obfuscator'; // 导入代码混淆插件
// import { viteObfuscateFile } from 'vite-plugin-obfuscator';
import vitePluginBundleObfuscator from 'vite-plugin-bundle-obfuscator';

// https://vite.dev/config/
export default defineConfig({
  base: './',
  assetsDir: "assets",
  sourcemap: false,
  build:{
    // cssCodeSplit: true,
    // rollupOptions: {
      // 　　output: {
      //     　　// 最小化拆分包
      //     　　manualChunks: (id) => {
      //      　　   if (id.includes('node_modules')) {
      //       　　      return id.toString().split('node_modules/')[1].split('/')[0].toString();
      //       　　  }
      //     　　},
      //     　　// 用于从入口点创建的块的打包输出格式[name]表示文件名,[hash]表示该文件内容hash值
      //     　　entryFileNames: 'js/[name].[hash].js',
      //     　　// 用于命名代码拆分时创建的共享块的输出命名
      //     　　chunkFileNames: 'js/[name].[hash].js',
      //     　　// 用于输出静态资源的命名，[ext]表示文件扩展名
      //     　　assetFileNames: '[ext]/[name].[hash].[ext]',
      //     　　// 拆分js到模块文件夹
      //     　　// chunkFileNames: (chunkInfo) => {
      //     　　//     const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/') : [];
      //     　　//     const fileName = facadeModuleId[facadeModuleId.length - 2] || '[name]';
      //     　　//     return `js/${fileName}/[name].[hash].js`;
      //     　　// },
      // 　　},
      // output: {
      //   assetFileNames: assetInfo => {
      //     var info = assetInfo.name.split('.')
      //     var extType = info[info.length - 1]
      //     if (
      //       /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name)
      //     ) {
      //       extType = 'media'
      //     } else if (/\.(png|jpe?g|gif|svg)(\?.*)?$/.test(assetInfo.name)) {
      //       extType = 'img'
      //     } else if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name)) {
      //       extType = 'fonts'
      //     }
      //     return `static/${extType}/[name]-[hash][extname]`
      //   },
      //   chunkFileNames: 'static/js/[name]-[hash].js',
      //   entryFileNames: 'static/js/[name]-[hash].js'
      // }
  // 　　},

  },
  plugins: [
    // viteObfuscateFile({
    //     // 配置选项-混淆选项
    //     compact: true, // 压缩代码
    //     controlFlowFlattening: false, // 控制流扁平化
    //     controlFlowFlatteningThreshold: 0.5, //// 应用概率;在较大的代码库中，建议降低此值，因为大量的控制流转换可能会增加代码的大小并降低代码的速
    //     deadCodeInjection: true, // 死代码注入 会导致包体积变大
    //     deadCodeInjectionThreshold: 0.2,  // 死代码块的影响概率
    //     debugProtection: false, // 调试保护
    //     debugProtectionInterval: 2000, // 调试保护间隔
    //     disableConsoleOutput: false, // 禁用控制台输出，  // 通过用空函数替换它们来禁用console.log，console.info，console.error和console.warn。这使得调试器的使用更加困难。
    //     identifierNamesGenerator: 'hexadecimal', // 标识符名称生成器
    //     domainLock: [],  //锁定混淆的源代码，使其仅在特定域和/或子域上运行。这使得某人只需复制并粘贴您的源代码并在其他地方运行就变得非常困难。
    //     log: false, // 是否显示日志
    //      //全局标识符添加特定前缀,在混淆同一页面上加载的多个文件时使用此选项。此选项有助于避免这些文件的全局标识符之间发生冲突。为每个文件使用不同的前缀
    //     identifiersPrefix: '',
    //     numbersToExpressions: true, // 数字转换为表达式
    //     renameGlobals: false, // 重命名全局变量
    //     selfDefending: true, // 自我防御
    //     simplify: true, // 简化代码
    //     splitStrings: true, // 分割字符串
    //     stringArray: true, // 字符串数组
    //     // 编码的所有字符串文字stringArray使用base64或rc4并插入即用其解码回在运行时的特殊代码。true（boolean）：stringArray使用编码值base64;false（boolean）：不编码stringArray值;'base64'（string）：stringArray使用编码值base64;'rc4'（string）：stringArray使用编码值rc4。大约慢30-50％base64，但更难获得初始值。建议禁用unicodeEscapeSequence带rc4编码的选项以防止非常大的混淆代码。
    //     // stringArrayEncoding: false,//['base64'], // 字符串数组编码
    //     // stringArrayThreshold: 0.75, // 字符串数组阈值// 调整字符串文字将插入stringArray的概率
    //     transformObjectKeys: false, // 转换对象键
    //     unicodeEscapeSequence: false, // Unicode 转义序列
    // }),
    vue(),
    
    vueDevTools(),
    legacy({ targets: ['defaults', 'not IE 11'] }),
    // 配置代码混淆插件
    // vitePluginBundleObfuscator({
    //     enable: true,
    //     log: true,
    //     autoExcludeNodeModules: true,
    //     threadPool: true,
        // options:{
        //   compact: true, // 压缩代码
        //   controlFlowFlattening: false, // 控制流扁平化
        //   controlFlowFlatteningThreshold: 0.5, //// 应用概率;在较大的代码库中，建议降低此值，因为大量的控制流转换可能会增加代码的大小并降低代码的速
        //   deadCodeInjection: true,
        //   deadCodeInjectionThreshold: 0.5,  // 死代码块的影响概率
        //   debugProtection: true,
        //   debugProtectionInterval: 100,
        //   disableConsoleOutput: false,

        //   // selfDefending: true, // 自我防御
        //   splitStrings: true,
        //   stringArray: true,
        //   stringArrayEncoding: ['base64'],
        //   stringArrayThreshold: 0.4,
        // }
    // })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
