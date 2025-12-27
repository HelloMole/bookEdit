<!-- 任意元素放入此元素下，可以全屏幕随意拖拽，但不会超出屏幕 -->
<template>
  <div ref="dragCard" style="z-index: 1000; user-select: none;" :style="daragCardpositionStyle + 'position:' + (enableDrag ? 'fixed': '') + ';width:' + width + 'px;height:' + height + 'px;' + 'min-width:' + oriWidth + 'px;min-height:' + oriHeight + 'px;'">
    <!-- <div v-if="enableDrag" style="pointer-events: none; position: absolute; width: 100%; height: 100%; background-color: blue;" ></div> -->
    <div ref="resizeHand" v-show="enableDrag && enableResize" style="position: absolute; right: 1px; bottom: 4px; width: 10px; height: 10px;" :style="{'right': handPosOnLeft ? '' : '1px', left: handPosOnLeft ? '-2px' : '', cursor: handPosOnLeft ? 'sw-resize' : 'se-resize'}">
        <RadiusBottomrightOutlined v-if="handPosOnLeft == false" style="color: #1568DD;"/>
        <RadiusBottomleftOutlined v-else style="color: #1568DD;"/>
    </div>
    <slot></slot>
  </div>
</template>

<script>
//   const model = defineModel()
//   import {defineModel} from 'vue'
import { useDraggable } from '@vueuse/core';
// import { UseElementSize } from '@vueuse/components';

export default {
    name: 'TopFreeDrag',
    components: {
        // UseElementSize
    },
    props:{
        drageHandId: {type: String, default: '' , required: false},
        
        enableDrag:  {type: Boolean, default: true, required: false},       //是否进入自由模式
        enableResize:{type: Boolean, default: true, required: false},
        
        disableHeight: {type: Boolean, default: false, required: false},    //默认禁止修改高度
        disableWidth: {type: Boolean, default: false, required: false},    //默认禁止修改宽度
        oriWidth: {type: Number, default: 332, required: false},
        oriHeight:{type: Number, default: 229, required: false},

        handPosOnLeft:{type: Boolean, default: false, required: false},
        aspectRadio:{type: Number, default: 0, required: false},    //如果是0，表示不限制
        titleHeight: {type: Number, default: 43, required: false},   //传入比例限制时，容器中放的是card，限制的是卡片body的尺寸，所以要减去title的尺寸再计算38 + 5
        localStorageDrag:{type: Boolean, default: false, required: false},  //持久化保存拖拽的尺寸信息
        localStorageName: {type: String, default: 'TopFreeDrag' , required: false},


        // title:{type: String, default: '列表' ,required: false},
        // configList: {type: Array, required: true}
    },
    data() {
        return {
        // dataSource: this.configList,
            daragCardX: 0,
            daragCardY: 0,
            resizeX: 0,
            resizeY: 0,
            daragCardisDragging: false,
            daragCardposition: null,
            daragCardpositionStyle: '',
            viewHeight: 0,
            viewWidth: 0,
            resizeisDragging: false,
            resizeStartX: null,
            resizeStartY: null,
            width: this.oriWidth,
            height: this.oriHeight,
            changeStartWidth: null,
            changeStartHeight: null,
            lastWidth: null,
            lastHeight: null,
        }
    },
    watch: {
        enableDrag(newVal, oldVal){
            // console.log('enableDrag change',newVal)
            if(newVal == false){
                this.lastWidth = this.width
                this.lastHeight = this.height
                this.width = this.oriWidth
                this.height = this.oriHeight
            }else{
                if(this.lastWidth != null){
                    this.width = this.lastWidth
                }
                if(this.lastHeight != null){
                    this.height = this.lastHeight
                }
            }
        },
        daragCardX(newVal, oldVal){
            // console.log('daragCardX change',newVal)
            if(newVal < 0){
                this.daragCardX = 0
            }else{
                var viewRect = this.$refs.dragCard.getBoundingClientRect()
                if(newVal + viewRect.width > document.body.clientWidth){
                    this.daragCardX = document.body.clientWidth - viewRect.width - 1 //oldVal
                }
            }
        },
        daragCardY(newVal, oldVal){
            // console.log('daragCardY change',newVal)
            if(newVal < 0){
                this.daragCardY = 0
            }else{
                var viewRect = this.$refs.dragCard.getBoundingClientRect()
                if(newVal + viewRect.height > document.body.clientHeight){
                    this.daragCardY = document.body.clientHeight - viewRect.height - 1
                }
            }
        },

        daragCardisDragging(newVal, oldVal){
            // console.log('daragCardisDragging change',newVal)
            if(oldVal == true && newVal == false){
                this.onDrageEnd()
            }
        },
        
        resizeisDragging(newVal, oldVal){
            if(oldVal == false && newVal == true){
                console.log('开始拖拽了')
                // this.resizeStartX = this.resizeX
                // this.resizeStartY = this.resizeY
                this.changeStartWidth = this.width
                this.changeStartHeight = this.height
            }else if(oldVal == true && newVal == false){
                console.log('停止拖拽了')
                this.resizeStartX = null
                this.resizeStartY = null
                this.resizeX = null
                this.resizeY = null
                this.onDrageEnd()
            }
        },
        
        resizeX(newVal, oldVal){
            if(this.resizeisDragging == false){
                return
            }
            if(this.disableWidth == true){
                return
            }
            if(this.resizeStartX == null){
                this.resizeStartX = newVal
            }
            var changedX = newVal - this.resizeStartX
            if(this.handPosOnLeft == true){
                changedX = this.resizeStartX - newVal
            }
            // console.log('resizeX changedX', newVal, this.resizeStartX, changedX)
            //重置这个也不能超出窗口，否则会卡死
            
            var newWidth = this.changeStartWidth + changedX
            if(this.daragCardX + newWidth < document.body.clientWidth){
                if(this.aspectRadio > 0){
                    var newHeight = newWidth * this.aspectRadio + this.titleHeight
                    if(this.daragCardY + newHeight < document.body.clientHeight){
                        this.width = newWidth
                        this.height = newHeight
                    }
                }else{
                    this.width = newWidth
                }
            }
        },
        resizeY(newVal, oldVal){
            if(this.resizeisDragging == false){
                return
            }
            if(this.disableHeight == true){
                return
            }
            if(this.aspectRadio != 0){
                //只需要根据x轴的变化修改y轴的就行
                return
            }
            if(this.resizeStartY == null){
                this.resizeStartY = newVal
            }
            var changedY = newVal - this.resizeStartY
            // console.log('resizeX changedX', newVal, this.resizeStartX, changedX)
            if(this.daragCardY + this.changeStartHeight + changedY < document.body.clientHeight){
                this.height = this.changeStartHeight + changedY
            }
            // console.log('resizeY change',newVal)
        },
        
        // daragCardposition(newVal, oldVal){
        //     // console.log('daragCardposition change',newVal)
        // },
        // daragCardpositionStyle(newVal, oldVal){
        //     console.log('daragCardpositionStyle change',newVal)
        // },
    },
    mounted(){
        this.$nextTick(()=>{
           this.bindDrag()
           this.bindResize()
           if(this.localStorageDrag == true){
            let info = localStorage.getItem(this.localStorageName)
                if(info != null){
                    info = JSON.parse(info)
                    console.log("重新设置一下拖拽位置", info)
                    this.daragCardX = info.daragCardX
                    this.daragCardY = info.daragCardY
                    if(this.enableDrag == true){
                        this.width = info.lastWidth
                        this.height = info.lastHeight
                    }else{
                        this.lastWidth = info.lastWidth
                        this.lastHeight = info.lastHeight
                    }
                    
                    this.daragCardpositionStyle = info.daragCardpositionStyle
                }
            }
        })
    },
    unmounted(){
        //保存一下最后的信息
        
    },
    methods: {
        onDrageEnd(){
            if(this.localStorageDrag == true){
                let obj = {
                    lastWidth:  this.width,
                    lastHeight:  this.height,
                    daragCardX: this.daragCardX,
                    daragCardY: this.daragCardY,
                    daragCardpositionStyle: this.daragCardpositionStyle
                }
                console.log('保存一下拖拽结束后的信息', obj)
                localStorage.setItem(this.localStorageName, JSON.stringify(obj))
            }
        },
        bindDrag(){
           
            // console.log('dragCard viewRect', viewRect)
            var htmlobj = this.$refs.dragCard
            // console.log('this.$refs.dragCard', this.$refs.dragCard)
            if(this.drageHandId != ''){
                console.log(this.$refs.daragCardX)
                //  parentElement.querySelector('#' + );
                htmlobj = this.$refs.dragCard.querySelector('#' + this.drageHandId)
                // htmlobj = document.getElementById(this.drageHandId)
            }
            // console.log('拖拽的目标节点', htmlobj)
            var {x, y, isDragging, position, style} = useDraggable(htmlobj)
            this.daragCardX = x
            this.daragCardY = y
            this.daragCardisDragging = isDragging
            this.daragCardposition = position
            this.daragCardpositionStyle = style
        },

        bindResize(){
            //绑定缩放事件
            var scaleobj = this.$refs.resizeHand
            var { x, y , isDragging} = useDraggable(scaleobj)
            this.resizeX = x
            this.resizeY = y
            this.resizeisDragging = isDragging
        }
    }
}
</script>

<style scoped>

</style>
