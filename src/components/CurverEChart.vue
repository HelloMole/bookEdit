<!-- 这是一个用于显示k线图的组件 -->
<template>
    <v-chart class="chart" :option="option" autoresize :theme="isOpenDark ? 'dark' : 'white'" @click="onChartClick" @mouseover="onChartMouseOver" @mouseout="onChartMouseOut" />
</template>
   
<script>
//   const model = defineModel()
//   import {defineModel} from 'vue'
  import VChart, {THEME_KEY} from 'vue-echarts'
  import { ref } from 'vue';
  import moment from 'moment';


  const rawData = [
      
];

  var selectPointIndex = -1 //选择标记点的坐标

  export default {
    name: 'CurverEChart',
    components: {
      // HelloWorld
      VChart
    },
    props:{
        width:{type: String, required: false},
        // symbol:{type: String, default: '000858' ,required: false},  //传入哪一个股票代码
        legend:{type: Array, default: ['全局', '股票', '策略'], required: false},
        xAxisArr: {type: Array, default: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月'], required: false},
        dataArr:{type: Array, default: [[1,2,3,4,5,6,7], [6,2,3,3,4,4,5], [7,6,5,4,3,2,1]], required: false}
    },
    data() {
      return {
        isOpenDark: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches,
        option: ref({
          // backgroundColor: '#181818',
          legend: {
                data: ['全局', '股票', '策略'],
                inactiveColor: '#777'
          },
          grid: {
                top: '9%',  // 左边距，可以调整为适合的百分比或固定值
                bottom: '6%',  // 右边距
                left: '12%',
                right: '3%',
                // 通过调整left和right，可以为y轴提供更多的空间
            },
          tooltip: {
            trigger: 'axis',
            formatter: function (params) {
              // console.log("params", params)
              // params = params[0]
              var str = "<div>" + params[0].name + '</div>'
              for(var i = 0; i < params.length; i++){
                str += '<div>'
                str += params[i].seriesName + ':' +  params[i].data
                str += '</div>'
              }
              return  (str);   //data  //dataIndex
            },
            axisPointer: {
              animation: false
            }
          },
          dataZoom: [
            // {
            //   type: 'slider', // 这是另一种实现缩放的方式，使用滑动条进行缩放
            //   xAxisIndex: 0,
            //   // startValue: 2, // 初始缩放范围的开始值
            //   // endValue: 6 // 初始缩放范围的结束值
            // },
            {
              type: 'inside',
              xAxisIndex: [0, 1],
            }
          ],
          xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            splitLine: {
              show: false
            },
            scale: true,
            boundaryGap: false,
            axisLabel: {
              formatter: function (value) {
                return moment(value).format('MM/DD')
              }
            },
          },
          yAxis: {
            type: 'value',
            scale: true,
          },
          series: [
            {
              name: '全局',
              data: [1,2,3,4,5,6,7],
              type: 'line',
              showSymbol: false,  //是否显示点
            },
            {
              name: '股票',
              data: [2,2,3,3,4,4,5],
              type: 'line',
              showSymbol: false,  //是否显示点
            },
            {
              name: '策略',
              data: [7,6,5,4,3,2,1],
              type: 'line',
              showSymbol: false,  //是否显示点
            },
          ]
        })
      }
    },
    watch: {
      // 监听initialMessage的变化
      legend(newVal, oldVal){
        // consloe
        // this.freshChart()
        this.option.legend.data = newVal
      },
      xAxisArr(newVal, oldVal){
        // consloe
        // this.freshChart()
        this.option.xAxis.data = newVal
      },
      dataArr(newVal, oldVal){
        // consloe
        this.freshChart()
      },
    },
    mounted() {
      console.log(`the component is now mounted.`)
      this.option.legend.data = this.legend
      this.option.xAxis.data = this.xAxisArr
      this.freshChart()

      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        this.isOpenDark = event.matches
        this.freshOptionBackGround()
      });
      this.freshOptionBackGround()
    },
    
    methods: {
      freshOptionBackGround(){
        if(this.isOpenDark){
            this.option.backgroundColor = '#181818'
        }else{
            this.option.backgroundColor = ''
        }
      },
      onListChange(){
          console.log('onListChange', this.dataSource)
      },
      onItemMove(){
          console.log('onItemMove', this.dataSource)
      },

      //图表点击
      onChartClick(e){
        console.log('图表点击', e)
        var componentType = e.componentType
        var dataIndex = e.dataIndex
        if(componentType == 'markPoint'){
          //这里做处理显示数据
          selectPointIndex = e.dataIndex
        }
      },

      onChartMouseOver(e){

      },

      onChartMouseOut(e){

      },

      //刷新界面
      freshChart(){
        var series = []
        for(var i = 0; i < this.dataArr.length; i++){
          series.push({
              name: this.legend[i],
              data: this.dataArr[i],
              type: 'line',
              showSymbol: false,  //是否显示点
          })
        }
        this.option.series = series
      }
    }
  }
</script>
  
<style scoped>

</style>