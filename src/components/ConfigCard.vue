<!-- 这是一个用于设置一个大的CondifRule的Card组件 -->
<!-- 配合ConfigInput，可以实现无限嵌套的结构 -->
<template>
    <a-card size="small" :title="title" style="min-width: 325px;">
       <ConfigValues :configList=configList></ConfigValues>
    </a-card>
</template>
   
<script>
//   const model = defineModel()
//   import {defineModel} from 'vue'
  export default {
    name: 'ConfigCard',
    props:{
        width:{type: String, required: false},
        title:{type: String, default: '列表' ,required: false},
        configList: {type: Array, required: true}
    },
    data() {
      return {
        dataSource: this.configList,
      }
    },
    methods: {
        onConfigInputChange(e){
            this.$emit('onChange', this.configList)
        },
        onListChange(){
            console.log('onListChange', this.dataSource)
        },
        onItemMove(){
            console.log('onItemMove', this.dataSource)
        }
    }
  }
  </script>
   
  <style scoped>
 
  </style>