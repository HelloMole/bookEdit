import './assets/main.css'
import './assets/litegraph.css'
// import './assets/litegraph-editor.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';



import VirtualScroller from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
// import { RecycleScroller } from 'vue-virtual-scroller'

// import {EditOutlined, WalletOutlined} from '@ant-design/icons-vue';
import * as Icons from '@ant-design/icons-vue';

import ConfigInput from './components/ConfigInput.vue'; // 确保路径正确
import ConfigCard from './components/ConfigCard.vue'; // 确保路径正确
import ConfigValues from './components/ConfigValues.vue'; // 确保路径正确
import { VueDraggable } from 'vue-draggable-plus'
import CurverEChart from './components/CurverEChart.vue'; // 确保路径正确
import TopFreeDrag from './components/TopFreeDrag.vue'; // 确保路径正确

// import * as schedule from 'node-schedule';
// import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'
import { notification } from 'ant-design-vue';
import moment from 'moment'

import { UseElementSize, vElementSize } from '@vueuse/components';

import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';


// 额外引入图标库
import ArcoVueIcon from '@arco-design/web-vue/es/icon';


// import './assets/coverAnt.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(ArcoVue, {
  // 用于改变使用组件时的前缀名称
  componentPrefix: 'arco'
});

app.use(ArcoVueIcon)

app.use(Antd)



// app.component('RecycleScroller', RecycleScroller)
app.use(VirtualScroller)
app.component('ConfigInput', ConfigInput)
app.component('ConfigCard', ConfigCard)
app.component('ConfigValues', ConfigValues)
app.component('VueDraggable', VueDraggable)
app.component('CurverEChart', CurverEChart)
app.component('TopFreeDrag', TopFreeDrag)
app.component('UseElementSize', UseElementSize)
app.directive('element-size', vElementSize)



// app.use(ElementPlus, { size: 'small', zIndex: 3000 })


// app.component('EditOutlined',EditOutlined)
// console.log('Icon', Icon)
// app.use(Icon)
//一次导入所有图标
for(var i in Icons){
    app.component(i, Icons[i])
}

app.mount('#app')