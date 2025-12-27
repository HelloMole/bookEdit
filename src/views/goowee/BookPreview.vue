<template>
  <div class="about" style="height: 100vh; width: 100vw; ">
    <a-card size="small" style="height: 100%; width: 100%; display: flex; flex-direction: column;" :bodyStyle="{display: 'flex', 'flex-direction': 'column', 'flex-grow': 1, 'user-select': 'none', 'overflow': 'hidden'}">
        <template #title>
          <div id="dragTitle">分镜预览{{screenWidth}}x{{screenHeight}}</div>
        </template>
        <template #extra>
            <a-flex gap="small">
              <!-- <a-button @click="onClickFreshPreview">刷新</a-button> -->
              <!-- <a-button type="link" shape="circle" @click="onClickExpandPreview"> -->
                <!-- <ExpandAltOutlined /> -->
                <!-- <LockOutlined v-if="cocosConfig.radioLock" style="font-size:larger; color: #1568DD" @click="onClickTreePreview('radioLock')"/>
                <UnlockOutlined v-else style="font-size:larger;" @click="onClickTreePreview('radioLock')"/> -->
                <a-select size="small" optionLabelProp="value"  :dropdownMatchSelectWidth="150" v-model:value="cocosConfig.radio" :options="cocosConfig.radioOptions" @change="onChangeRadionPicker(cocosConfig.radio)"></a-select>
                <a-tooltip>
                  <template #title>清空场景</template>
                  <ClearOutlined style="font-size:larger; color: #FF4D50" @click="onClickClearScene"/>
                </a-tooltip>
                <a-tooltip>
                  <template #title>激活摄像机预览</template>
                  <VideoCameraOutlined :style="{'color' : !cocosConfig.isPreviewMode ? '#1568DD' : ''}" style="font-size:larger;" @click="onClickTreePreview('isPreviewMode')" />
                </a-tooltip>
                <a-tooltip>
                  <template #title>显示安全框</template>
                  <NumberOutlined :style="{'color' : cocosConfig.cocosPreviewIsShowGird ? '#1568DD' : ''}" style="font-size:larger;"  @click="onClickTreePreview('cocosPreviewIsShowGird')" />
                </a-tooltip>
                <a-tooltip>
                  <template #title>显示节点树</template>
                  <DeploymentUnitOutlined :style="{'color' : cocosConfig.cocosPreviewIsShowTree ? '#1568DD' : ''}" style="font-size:large;" @click="onClickTreePreview('cocosPreviewIsShowTree')" />
                </a-tooltip>
                <a-tooltip>
                  <template #title>显示帧率信息</template>
                  <DashboardOutlined style="font-size:large;" :style="{'color' : cocosConfig.cocosPreviewIsShowState ? '#1568DD' : ''}"  @click="onClickTreePreview('cocosPreviewIsShowState')"/>
                </a-tooltip>
                <a-tooltip>
                  <template #title>显示碰撞框</template>
                  <GatewayOutlined style="font-size:large;" :style="{'color' : cocosConfig.cocosPreviewIsShowColiderBox ? '#1568DD' : ''}" @click="onClickTreePreview('cocosPreviewIsShowColiderBox')"/>
                </a-tooltip>
                <SoundFilled v-if="cocosConfig.mute == false" style="font-size:large; color:#1677FF; " @click="onClickTreePreview('mute')"/>
                <SoundOutlined v-else style="font-size:large;"  @click="onClickTreePreview('mute')"/>
                <!-- <SyncOutlined style="font-size:larger;" @click="onClickFreshPreview"/> -->
                <!-- <FullscreenOutlined v-if="cocosConfig.cocosPreviewCanDrag == false" style="font-size: large;" @click="onClickTreePreview('cocosPreviewCanDrag')"/> -->
                <!-- <FullscreenExitOutlined v-else style="font-size: large;" @click="onClickTreePreview('cocosPreviewCanDrag')"/> -->
                <!-- <CompressOutlined /> -->
                <!-- FullscreenExitOutlined -->
              <!-- </a-button> -->
            </a-flex>
        </template>
        
        <!-- <UseElementSize   v-slot="{width, height}"> -->
          <!-- :style="{width: width + 'px', height: height + 'px'}" -->
        <div id="GameDiv" v-element-size="onPreviewSizeChange" style="flex-grow: 2;  width: 100%; user-select: none; overflow: hidden;">
          <canvas id='GameCanvas' style="user-select: none;  ">
            
          </canvas>
          <!-- <canvas id='SpineCanvas' :width="width - 12" :height="height - 50"></canvas> -->
          <div style="position: absolute; top: 42px; pointer-events: none;" :style="{width: canvasWidth + 'px', height: canvasHeight + 'px'}">
            <div v-if='cocosConfig.cocosPreviewIsShowGird' v-for="line in saveAreaLines" style="position:absolute; background-color: #FF4D50;" :style="{top: line.top + 'px', left: line.left + 'px', width: line.width, height: line.height}"></div>
          </div>
        </div>
        <!-- <div id="GameDiv"  style=" height: 100px; width: 100px;  user-select: none; background-color: blue;"> -->
          <!-- <canvas id='GameCanvas' style="user-select: none; width: 100%; height: 100px;"></canvas> -->
          <!-- <canvas id='SpineCanvas' :width="width - 12" :height="height - 50"></canvas> -->
          <!-- <div v-if='cocosConfig.cocosPreviewIsShowGird' v-for="line in saveAreaLines" style="position:absolute; background-color: #FF4D50;" :style="{top: line.top + 'px', left: line.left + 'px', width: line.width, height: line.height}"></div> -->
        <!-- </div> -->
        <!-- </UseElementSize>  -->
    </a-card>
    <TopFreeDrag v-if="cocosConfig.cocosPreviewIsShowTree" drageHandId="dragTitle" :enableDrag="true" :oriWidth="229" :localStorageDrag="true" :localStorageName="'TopFreeDragPreviewTree'">
        <UseElementSize :style="{'min-height':'100px'}" style="width: 100%; height: 100%;" v-slot="{width, height}">
          <a-card size="small" id="dragTitle" title="节点层级" >
              <template #extra>
                <a-flex gap="middle">
                  <ExpandAltOutlined style="font-size:larger;" @click="onClickTreeExport"/>
                  <CodeOutlined style="font-size:larger;"      @click="onClickConsoleSelect"/>
                  <SyncOutlined style="font-size:larger;"      @click="onClickFreshPreview"/>
                </a-flex>
              </template>
              <div style="overflow: scroll;" :style="{height: (height - 50) + 'px'}">
                <a-tree :tree-data="cocosPreviewTreeData" v-model:expandedKeys="expandedKeys" :fieldNames="{title:'name', key:'id' }" @select="onSelectCocosNode"></a-tree>
              </div>
          </a-card>
        </UseElementSize>
    </TopFreeDrag>
  </div>
</template>
  
  <script>
    import { UseElementSize } from '@vueuse/components';
    import * as CocosMgr from '../../viewCode/CocosMgr'
    import {LGraph, LiteGraph, LGraphCanvas, LGraphNode, createBounds} from '../../litegraph/litegraph'
    import '../../viewCode/RegisterNodeType'

    let graph = null
    // console('hello tensorflow', tf)
    export default {
      name: 'App',
    
      components: {
        // HelloWorld
        UseElementSize
      },
      data() {
        // const value1 = ref<string>('a');
        return {
          screenHeight: document.body.clientHeight,
          screenWidth:  document.body.clientWidth,
          canvasHeight: 0,
          canvasWidth: 0,
          cocosConfig: {
            cocosPreviewIsShowTree: false,       //是否显示节点树
            cocosPreviewIsShowState: false,      //是否显示状态
            cocosPreviewIsShowGird: false,       //是否显示参考线
            cocosPreviewCanDrag: false,          //是否可以拖拽
            isPreviewMode: true,                 //是否可以预览
            cocosPreviewIsShowColiderBox: false, //是否显示碰撞框
            mute: false,    //是否静音状态

            radioLock: false,               //比例是否锁定状态
            radio: '2560:1500',
            aspectRadio: 1500 / 2560,
            radioOptions: [
              {value: '无比例', label: '无比例'},
              {value: '16:9', label: '常规显示器'},
              {value: '4:3', label: 'ipad'},
              {value: '19.5:9', label: 'iPhone全面屏'},
              {value: '2560:1500', label: '绘本设计分辨率'},
            ]
          },
          cocosPreviewTreeData:[],
          expandedKeys: [],
        };
      },

      mounted () {
        document.title = '分镜预览'
        let hasInit = CocosMgr.hasInit
        CocosMgr.init()
        CocosMgr.changeIsSinglePreview(true)

        window.channel = new BroadcastChannel('BookEditFM');

        // window.channel.postMessage({ type: 'update', data: '新内容' });
        window.channel.onmessage = async (event) => {
          console.log('收到消息:', event.data);
          let eventData = event.data
          if(eventData.type == 'initLgraphCanvas'){
            if(graph != null){
              graph.clear()
              graph = null
            }
            await CocosMgr.waitCocosInit()  //这个时候可能还没加载好
            if(hasInit != true){
              hasInit = true
              let cocosConfig = localStorage.getItem('cocosConfigOfpreview')
              if(cocosConfig != null){
                try {
                  cocosConfig = JSON.parse(cocosConfig)
                  console.log('本地保存的cocosConfig', cocosConfig)
                  if(cocosConfig['cocosPreviewIsShowState'] == true){
                    CocosMgr.showOrHideFPS()
                  }
                  if(cocosConfig['cocosPreviewIsShowColiderBox'] == true){
                    CocosMgr.showOrHideColiderBox()
                  }
                  if(cocosConfig['isPreviewMode'] == false){
                    CocosMgr.changePreviewMode()
                  }
                  this.cocosConfig = cocosConfig
                }catch(error){
                  console.error(error)
                }
              }
            }

            //初始化graph
            graph = new LGraph();
            graph.isSinglePreview = true
            graph.configure(eventData.graph)
            graph.config.mute = this.cocosConfig.mute
            // console.log('初始化了graph', graph)
          }else if(eventData.type == 'graphStart'){
            if(graph != null){
              graph.clear()
              graph = null
            }
            //初始化graph
            graph = new LGraph();
            graph.isSinglePreview = true
            graph.configure(eventData.graph)
            graph.config.mute = this.cocosConfig.mute
            setTimeout(() => {
              graph.start()
            }, 1000);
          }else if(eventData.type == 'graphStop'){
            if(graph != null){
              graph.stop()
            }
          }else if(eventData.type == 'nodeEvent'){
            //节点方法被调用，同步修改graph
            if(graph == null){
              return
            }
            let func = eventData.func
            let id = eventData.datas.id
            let node = graph.getNodeById(id)
            if(node == null && eventData.func != 'onAdd'){
              console.warn('node == null', id)
              return
            }
            if(func == 'onPropertyChanged'){
              node.setProperty(eventData.datas.property, eventData.datas.value)
            }else if(func == 'onBtnWidgetClick'){
              //查询对应名称的按钮并点击
              let widget = node.widgets.find((item)=>{
                return item.name == eventData.datas.buttonName
              })
              if(widget != null){
                if(widget.callback != null){
                  widget.clickeName = eventData.datas.buttonName != null ? eventData.datas.buttonName : eventData.datas.clickeName
                  widget.callback()
                }
              }
            }else if(func == 'onRemove'){
              graph.remove(node)
            }else if(func == 'onAdd'){
              //创建一个新的node
              let newNode = LiteGraph.createNode(eventData.datas.type)
              newNode.id = id
              if(eventData.datas.params != null){
                for(let key in eventData.datas.params){
                  newNode.properties[key] = eventData.datas.params[key]
                }
              }
              graph.add(newNode)
            }else if(func == 'justRunFunc'){
              if(node[eventData.datas.funcName] != null){
                if(eventData.datas.params != null){
                  node[eventData.datas.funcName](...eventData.datas.params)
                }else{
                  node[eventData.datas.funcName]()
                }
              }
            }else if(func == 'onConnect'){
              let linkedNode = graph.getNodeById(eventData.datas.linkedNodeId)
              if(linkedNode != null){
                linkedNode.connect(eventData.datas.outputIndex, node, eventData.datas.inputIndex )
              }
            }else if(func == 'onDisConnect'){
              node.disconnectInput(eventData.datas.slot, eventData.datas.keepReroutes)
            }
          }
        };

        window.onresize = ()=>{
          this.screenHeight = document.body.clientHeight
          this.screenWidth  = document.body.clientWidth
          console.log(this.screenHeight,  this.screenWidth)
          CocosMgr.updateCanvasSize()
        }

        let gameDiv = document.getElementById('GameDiv')
        this.onPreviewSizeChange({ width: gameDiv.clientWidth, height: gameDiv.clientHeight })
        // window.addEventListener('BookEditEvent', (e)=>{
        //   console.log('我收到了BookEdit发来的事件', e)
        // })
      },

      methods: {
        onClickClearScene(){
          CocosMgr.clearScene()  
          this.$message.info('已清空场景')
        },
        onClickTreePreview(key){
          if(key == 'cocosPreviewIsShowState'){
            this.cocosConfig[key] = CocosMgr.showOrHideFPS()
            localStorage.setItem('cocosConfigOfpreview', JSON.stringify(this.cocosConfig))
            return
          }
          if(key == 'cocosPreviewIsShowColiderBox'){
            this.cocosConfig[key] = CocosMgr.showOrHideColiderBox()
            localStorage.setItem('cocosConfigOfpreview', JSON.stringify(this.cocosConfig))
            return
          }
          this.cocosConfig[key] = !this.cocosConfig[key]
          // this.cocosPreviewIsShowTree = !this.cocosPreviewIsShowTree
          if(key == 'cocosPreviewIsShowTree'){
            CocosMgr.refreshTree()
            this.cocosPreviewTreeData = CocosMgr.treeData
          }else if(key == 'cocosPreviewCanDrag'){
            if(this.cocosConfig['cocosPreviewIsShowGird']){
              this.cocosConfig['cocosPreviewIsShowGird'] = false
              setTimeout(() => {
                this.cocosConfig['cocosPreviewIsShowGird'] = true
              }, 700);
            } 
          }else if(key == 'isPreviewMode'){
            // CocosMgr.isPreviewMode = !CocosMgr.isPreviewMode
            CocosMgr.changePreviewMode()
            this.cocosConfig[key] = CocosMgr.isPreviewMode
            console.log('CocosMgr.isPreviewMode', CocosMgr.isPreviewMode)
          }else if(key == 'mute'){
            graph.config.mute = this.cocosConfig.mute
          }
          localStorage.setItem('cocosConfigOfpreview', JSON.stringify(this.cocosConfig))
        },
        onPreviewTreeSizeChange(data){
          this.cocosPreviewTreeWidth = data.width
        },

        onPreviewSizeChange(data){
          this.canvasWidth  = data.width
          this.canvasHeight = data.height
          console.log('onPreviewSizeChange', this.canvasWidth, this.canvasHeight)
          // clearTimeout(this.timeOutInt)
          setTimeout(() => {
            //如果不加setTimeout，切换标签页会导致预览界面渲染放大
            CocosMgr.updateCanvasSize(data.width, data.height)
          }, 100);
          // CocosMgr.updateCanvasSize(data.width, data.height)
          // this.$nextTick(()=>{
            
          // })
          //同时计算安全框线的位置
          var baseSize = {width: CocosMgr.designViewWidth,  height: CocosMgr.designViewHeight}
          var sizeOne = {width: 1920,  height: 1500} //框都是绘制在画布中间的
          var sizeTwo = {width: 2560,  height: 1080}
          var boxArr = [sizeOne, sizeTwo]
          var lineArr = []
          for(var i = 0; i < boxArr.length; i++){
              var box = boxArr[i]
              var marginTop = (baseSize.height - box.height) * 0.5
              var top1 = marginTop / baseSize.height
              var top2 = (box.height + marginTop) / baseSize.height

              if(top1 != 0){
                lineArr.push({top: top1 * data.height, left: 0, width: '100%', height: '2px'})
              }
              if(top2 != 1){
                lineArr.push({top: top2 * data.height, left: 0, width: '100%', height: '2px'})
              }

              var marginLeft = (baseSize.width - box.width) * 0.5
              var left1 = marginLeft / baseSize.width
              var left2 = (box.width + marginLeft) / baseSize.width
              if(left1 != 0){
                lineArr.push({ top: 0, left: left1 * data.width, width: '2px', height: '100%'})
              }
              if(left2 != 1){
                lineArr.push({ top: 0, left: left2 * data.width, width: '2px', height: '100%'})
              }
              // console.log('top1', top1, top2, left1, left2)
          }
          this.saveAreaLines = lineArr
          // console.log('saveAreaLines', this.saveAreaLines)
        },


        onClickFreshPreview(){
          // var gameCanvas = document.getElementById('GameCanvas')
          // gameCanvas.getBoundingClientRect()
          // CocosMgr.updateCanvasSize(gameCanvas.width, gameCanvas.height)
          CocosMgr.refreshTree()
          console.log('TreeData', CocosMgr.treeData)
          this.cocosPreviewTreeData = CocosMgr.treeData
        },

        onClickConsoleSelect(){
          this.$message.info('对象已打印至控制台')
          console.log(CocosMgr.selectedNode)
        },

        onClickTreeExport(){
          console.log(this.expandedKeys)
          this.expandedKeys = CocosMgr.getHasChildrenNodeId()
        },

        onSelectCocosNode(treeNodes){
          // console.log('选择了节点数的节点', treeNodes)
          var nodeId = treeNodes[0]
          var node = CocosMgr.getNodeById(nodeId)
          if(node != null){
            CocosMgr.drawNodeRect(node)
          }
        },
      }
    }
  </script>
  
  <style>
    .about {
      /* min-height: 100vh; */
      width: 100vw;
      display: flex;
      align-items: center;
    }
  </style>

<style scoped>
  .about>>>
  .ant-card
  .ant-card-body{
    padding: 5px;
  }
</style>

  