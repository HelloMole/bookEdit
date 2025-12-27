<!-- 这是一个用于聚合所有输入类元素的组件，输入指定的config配置项目，生成对应的输入元素，并在修改时发送修改后的config值 -->
<template>
    <div>
        <div class="markBox" ref="markBox2" style="width: 100%; height: 600px; margin-bottom: 10px; border: solid 1px gray;"></div>
        <a-flex gap="small" align="center">
            <a-button @click="create2" :disabled="!editing2 || !!curEditMarkItem2">新增碰撞框</a-button>
            <a-button @click="exit2" :disabled="!isCreateMarking2">退出新增</a-button>
            <a-button @click="deleteItem2" :disabled="!curEditMarkItem2">删除选中</a-button>
            <a-button @click="deleteAll2">清空</a-button>
            <div style="flex-grow: 1;"></div>
            <div>缩放</div>
            <a-slider style="width: 100px;" v-model:value="scale"  :max="1" :min="0.1" :step="0.01"/>
            <div style="flex-grow: 1;"></div>
            <a-button type="primary" @click="getMarkData2">保存</a-button>
        </a-flex>
    </div>
</template>
   
<script>
    import Markjs from '@/viewCode/markjs/index'
    import mousePlugin from '@/viewCode/markjs/src/plugins/mouse'
    import imgPlugin from '@/viewCode/markjs/src/plugins/img'
    // 引入图片插件，图片插件需要在编辑插件之前注册，因为编辑插件已经默认注册了，且在第一项，所以图片插件需要指定插到第一项
    Markjs.use(imgPlugin, 0)
    // Markjs.use(mousePlugin)

    let mark2 = null
  
    export default {
        name: 'MarkEdit',
        props:{
            // marginLeft: {type: String, default:'10px', required: false},
            // width:{type: String, required: false},
            // values:{type: Array, required: false},
            // vertical:{type: Boolean, required: false},
            // hideChildKeys: {type: Array, default: [], required: false},

            img:{type: String, required: false},
            pointArr: {type: Array, default: [], required: false},
            imgScale: {type: Number,default: 1, required: false},
            // colliderValue: {type: Object, default: {}, required: false},
            // showChildScore: {type: Boolean, default: false, required: false},
        },
        data() {
            return {
                dataSource: [],
                editing2: true,
                curEditMarkItem2: null,
                isCreateMarking2: false,
                scale: this.imgScale
            }
        },
        watch:{
            scale(newValue, oldValue){
                // mark2.opt.scale = newValue
                if(mark2 != null){
                    mark2.updateOpt({scale: newValue})
                }
                // console.log("更新了", mark2.opt)
            }
        },
        mounted () {
            // this.scale = this.imgScale
            console.log('当前的scale', this.imgScale)
            mark2 = new Markjs({
                el: this.$refs.markBox2,
                hoverActive: true,
                img: this.img,
                // elBg: '#000',
                scale: this.scale
                // max: 3,
                // noCrossing: true
            })
            console.log('mark2', mark2)
            let initData = ()=>{
                this.timeOutInt = null
                if(mark2.createMarkItem != null){
                    for(var j = 0; j < this.pointArr.length; j++){
                        mark2.createMarkItem({
                            pointArr: this.pointArr[j]
                        });
                    }
                }else{
                    this.timeOutInt = setTimeout(() => {
                        initData()
                    }, 10);
                }
            }
            initData()            
            // this.$nextTick(()=>{
                
            // })
            
            mark2.on('CURRENT-MARK-ITEM-CHANGE', (item) => {
                this.curEditMarkItem2 = item
            })
            mark2.on('IS-CREATE-MARKING-CHANGE', (state) =>{
                this.isCreateMarking2 = state
            })
            mark2.on('LINE-CROSS', (item) => {
                this.$message.warning('线段不允许交叉')
            })
            mark2.on('NOT-ENOUGH-END-POINTS', (item) =>{
                this.$message.warning('至少需要绘制三个端点')
            })
            mark2.on('COUNT-LIMIT', (item) =>{
                this.$message.warning('最多只能绘制三个区域')
            })
        },
        unmounted(){
            if(this.timeOutInt != null){
                clearTimeout(this.timeOutInt)
            }
        },
        methods: {
        
            //switch组件切换时通知
            // onSwitchChange(e, rowConfig){
            //     // console.log("onSwitchChange", e, rowConfig)
            //     this.$emit('onChange',  rowConfig.key)
            // },

            getMarkData2() {
                // console.log(mark2.getMarkData(), JSON.stringify(mark2.getMarkData()))
                let data = mark2.getMarkData()
                if(data.length == 0){
                    this.$emit('onChange',  [], this.scale)
                }else{
                    this.$emit('onChange', data.map(one=>{
                        return one.pointArr
                    }), this.scale)
                }
            },
            deleteItem2() {
                console.log('删除了选中的碰撞框', this.curEditMarkItem2)
                mark2.deleteMarkItem(this.curEditMarkItem2)
            },
            deleteAll2() {
                mark2.deleteAllMarkItem()
            },
            create2() {
                // console.log('create2', mark2.createMarkItem)
                mark2.createMarkItem()
            },
            exit2() {
                mark2.exitCreate()
            }
        }
    }
  </script>
   
  <style scoped>
 
  </style>