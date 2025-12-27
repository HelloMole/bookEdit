<!-- 这是一个用于设置一个大的CondifRule的Card组件 -->
<!-- 配合ConfigInput，可以实现无限嵌套的结构 -->
<template>
     <a-dropdown :trigger="['contextmenu']" @contextmenu="handleContextMenu">
     <VueDraggable v-model="dataSource" :animation="150" group="people" :clone="clone" @sort="onListChange" @end="onItemMove" @add="onAdd"  style="display: flex; flex-direction: column; gap: 5px; overflow:auto; width: 100%; min-height:80px" :style="{height: height}" >
                <a-collapse v-for="(item, index) in dataSource" :key="item.id" size="small"  style="min-width: 300px" collapsible="icon">
                    <a-collapse-panel :showArrow="item.inCardBottom == true">
                        <template #header>
                            <a-flex gap='0px' align='center'>
                                <a-input-number v-if='showChildScore' v-model:value="item.score" style="margin-right: 8px; width: 70px; text-align: center;" :step='1' size="small">
                                    <template #prefix>
                                        <TagOutlined />
                                    </template>
                                </a-input-number>
                                <!-- @openChange="openChange" -->
                                <a-dropdown  :trigger="['contextmenu']"  @contextmenu="handleContextMenu">
                                    <div style="margin-right: 8px;">{{ item.getTitle != null ? item.getTitle(hideChildKeys) : item.name }}</div>
                                    <template #overlay>
                                    <a-menu>
                                        <a-menu-item key="1" @click="onClickCopy(item)">复制</a-menu-item>
                                        <a-menu-item key="2" @click="onClickPaste(item)">粘贴</a-menu-item>
                                        <a-menu-item key="3" @click="onClickClearPaste">清空粘贴板({{ getPastCount() }})</a-menu-item>
                                        <a-sub-menu key="4" title="模版">
                                            <a-menu-item v-for="moban in templateRules" :key="moban.name"  @click="onClickMoban(moban, index)">{{ moban.name }}</a-menu-item>
                                        </a-sub-menu>
                                    </a-menu>
                                </template>
                                </a-dropdown>
                                <a-tag v-if="item.isLoop" color="blue">循环</a-tag>
                                <a-tag v-if="item.needMinData" color="pink">分时</a-tag>
                                <a-tag v-if="item.needJinjiaData" color="orange">竞价</a-tag>
                                <a-tag v-if="item.isOrderRule" color="green">下单</a-tag>
                                <a-tag v-if="item.justByDay" color="cyan">日K</a-tag>
                            </a-flex>
                        </template>
                        <template #extra>
                            <a-flex gap='small' justify='center' align='center'>
                                <ConfigInput :hideChildKeys="hideChildKeys" :values="item.values" @onChange="onConfigInputChange($event, item)"/> 
                                <Component style="color: red;" is="DeleteOutlined" @click="onClickDelete(index)"/>
                                <a-checkbox v-model:checked="item.checked" :disabled="item.forceChecked" @change="onCheckChange"></a-checkbox>
                                <a-badge :count='item.resultCount' :overflow-count="9999"></a-badge>
                            </a-flex>
                        </template>
                        <ConfigInput v-if='item.inCardBottom == true' marginLeft="0px" :vertical='true'  :hideChildKeys="hideChildKeys" :values="item.values" @onChange="onConfigInputChange($event, item)"/> 
                    </a-collapse-panel>
                </a-collapse>
    </VueDraggable>
    <template #overlay>
        <a-menu>
            <a-menu-item key="2" @click="onClickPaste(item)">粘贴</a-menu-item>
            <a-menu-item key="3" @click="onClickClearPaste">清空粘贴板({{ getPastCount() }})</a-menu-item>
            <a-sub-menu key="4" title="模版">
                <a-menu-item v-for="moban in templateRules" :key="moban.name"  @click="onClickMoban(moban)">{{ moban.name }}</a-menu-item>
            </a-sub-menu>
        </a-menu>
    </template>
    </a-dropdown>
</template>
   
<script>
import * as Rules from '@/views/lianghua/Rules'
import { message } from 'ant-design-vue'

//   const model = defineModel()
//   import {defineModel} from 'vue'
  export default {
    name: 'ConfigValues',
    props:{
        height: {type: String, default:'', required: false},
        width:{type: String, required: false},
        title:{type: String, default: '列表' ,required: false},
        configList: {type: Array, required: true},
        hideChildKeys: {type: Array, default: [], required: false},
        showChildScore: {type: Boolean, default: false, required: false},
    },
    data() {
    //   console.log('传入ConfigValues的configList', this.configList)
      return {
        dataSource: this.configList,
        templateRules: Rules.templateRules
        // cardMenuHasShow: false,
      }
    },
    watch:{
        configList(newVal, oldVal){
            // console.log('configList变化了', newVal)
            this.dataSource = newVal
        },
        hideChildKeys(newVal, oldVal){
            // console.log('hideChildKeys 修改了', newVal, this.dataSource)
            this.freshHideChildKeys()
        }
    },
    mounted() {
        this.freshHideChildKeys()
        // 个税=（劳务费-劳务费×20%）×30%-2000。
        // （劳务费-劳务费×20%）× 30% - 2000 + 劳务费 = 30000
        // (x - x * 0.2) * 0.3 - 2000 + x = 真实所得
        // 实际转账 = (真实所得 + 2000) / 1.24

        // 4000以下
        // 个税 =（劳务费 - 800）× 20%。
        // 个税 + 劳务费 = 真实所得
        // 实际转账 = (真实所得 + 160) / 1.2
    },
    methods: {
        handleContextMenu(event){
            // console.log('handleContextMenu event', event)
            event.preventDefault(); // 阻止默认行为
            event.stopPropagation(); // 停止事件冒泡
        },
        freshHideChildKeys(){
            for(var i = 0; i < this.dataSource.length; i++){
                var configPopover = false
                if(this.dataSource[i].hasConfigPopover == true){
                    for(var j = 0; j < this.dataSource[i].values.length; j++){
                        var rowConfig = this.dataSource[i].values[j]
                        if(rowConfig.key == 'configPopover'){
                            configPopover = rowConfig.value
                        }
                        if(configPopover == true && rowConfig.type == 'values'){
                            rowConfig.hideChildKeys = this.hideChildKeys
                        }
                    }
                }
            }
        },
        onConfigInputChange(changedKey, changedItem){
            // console.log('当前的datasource', this.dataSource, this.hideChildKeys)
            // console.log('ConfigValues 收到了 ConfigInput 的数据修改', changedItem, '哪个值修改了', changedKey)
            this.$emit('onChange', this.dataSource)
            // if(changedItem.watch != null){
            //     changedItem.watch(changedKey, )
            // }
            if(changedKey == 'configPopover'){
                var keyValue = changedItem.values.find((rowConfig)=>{
                    return rowConfig.key == changedKey
                }).value
                var index = changedItem.values.findIndex((rowConfig)=>{
                    return rowConfig.type == 'values'
                })
                if(index != -1){
                    if(keyValue == true){
                        changedItem.values[index].hideChildKeys =  this.hideChildKeys
                    }else{
                        delete changedItem.values[index].hideChildKeys
                    }
                }
            }
        },
        onListChange(){
            this.$emit('onChange', this.dataSource)
        },
        onCheckChange(){
            this.$emit('onChange', this.dataSource)
        },
        onItemMove(){
            // console.log('onItemMove', this.dataSource)
            this.$emit('onChange', this.dataSource)
        },
        onClickDelete(index){
            this.dataSource.splice(index, 1)
            // console.log('onClickDelete', this.dataSource)
            this.$emit('onChange', this.dataSource)
        },
        clone(element){
            //排序的时候从一个容器拖动到另一个容器里也会触发克隆
            // console.log('configValues listClone', element)
            var newObj = Rules.cloneAndInit(element) //JSON.parse(JSON.stringify(element))  
            newObj.checked = true
            return newObj
        },
        
        onAdd(event){
            // console.log('添加了新的元素eveent', event)
            var index = event.newIndex
            if(Array.isArray(event.clonedData) == true){
                //把数据里的数据，放到原始的数据流中
                var shouldPushData = Rules.saveDataToRule(event.clonedData)
                this.dataSource.splice(index, 1, ...shouldPushData)
            }
            // console.log('当前的dataSource', this.dataSource)
            // @onAdd="onAdd"
        },
        onClickCopy(item){
            if(window.copyedRule == null){
                window.copyedRule = Rules.ruleToSaveData([item])
            }else{
                window.copyedRule = window.copyedRule.concat(Rules.ruleToSaveData([item]))
            }
            // console.log('点击了拷贝', window.copyedRule)
            // this.cardMenuHasShow = false
        },

        onClickClearPaste(){
            window.copyedRule = null
        },

        getPastCount(){
            if(window.copyedRule != null){
                return window.copyedRule.length
            }else{
                return 0
            }
        },
        onClickPaste(item){
            if(window.copyedRule != null){
                // console.log('点击了粘贴', this.dataSource)
                var copyedRules = Rules.saveDataToRule(window.copyedRule)
                // console.log('copyedRules', copyedRules)
                for(var i = 0; i < copyedRules.length; i++){
                    this.dataSource.push(copyedRules[i])
                }
                window.copyedRule = null
            }
            // this.cardMenuHasShow = false
        },

        onClickMoban(moban, index){
            // console.log('moban', moban)
            // var copyedRules = Rules.saveDataToRule(window.copyedRule)
            // // console.log('copyedRules', copyedRules)
            // for(var i = 0; i < copyedRules.length; i++){
            //     this.dataSource.push(copyedRules[i])
            // }

            var rules = []
            var keyArr = ['ruleOfSale', 'ruleOfBuy', 'ruleOfSelect']
            for(var i = 0; i < keyArr.length; i++){
                if(moban.rulesDit[keyArr[i]].length > 0){
                    rules = moban.rulesDit[keyArr[i]]
                }
            }
            
            if(rules.length > 0){
                var shouldPushData = Rules.saveDataToRule(rules)
                if(index != null){
                    this.dataSource.splice(index, 0, ...shouldPushData)
                }else{
                    this.dataSource.push(...shouldPushData)
                }
            }else{
                message.info('模版为空！')
            }
        },

        openChange(isShow){
            // console.log('openChange', isShow)
            // this.cardMenuHasShow = isShow
        }
    }
  }
  </script>
   
  <style scoped>
    
  </style>