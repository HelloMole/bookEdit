import {LiteGraph, LGraphNode, LGraph} from '../../litegraph/litegraph'
import * as CocosMgr from '../CocosMgr';
import { BaseYWNode } from './BaseYwNode'


class dragNumGame extends BaseYWNode {
    // Name to show
    title = "value"
    desc = "这是一个拖拽数数游戏的模型";   //不会在显示节点中用到，仅仅在代码中的解释
    name = '拖拽数数游戏控制器'

    constructor() {
      super()
    //   this.addInput("触发", "number")   //增加一个输入触点，  输入触点的名称， 值类型    //不需要触发了
    //   this.addInput("B", "number")
      this.addInput("物体", "codeNode")

      this.addOutput("播放问题", LiteGraph.EVENT)   //增加一个输出触点，  输出节点的名称， 值类型

      this.addOutput("当前正确数量", 'number')   //增加一个输出触点，  输出节点的名称， 值类型

      this.addOutput("输出正确反馈", LiteGraph.EVENT)
      this.addOutput("输出错误反馈", LiteGraph.EVENT)
      this.addOutput("输出结束反馈", LiteGraph.EVENT)


      this.addProperty("rightCount", 5);   //增加一个变量，    变量名称， 变量名称
    //   this.progress = 0.5               //设置节点的进度，一般来说用于在执行的时候设置
      this.widget = this.addWidget("number","正确选项数量",5,"rightCount", {precision: 0, step2: 1});
    //    this.serialize_widgets = true;
    //   this.widget = this.addWidget("number","value",1,"value");  //增加一个控件用于修改变量，  类型，显示名称，默认值，要修改的变量的名称
    //   this.widgets_up = true;                                    //设置输入组件在顶部（覆盖input和output）
    //   this.size = [180, 30];                                     //设置默认节点尺寸
    //   this.properties.precision = 1
    }

    onStart(){
        this.trigger('播放问题')
        this.curRightCount = 0
    }

    onAction(state){
        if(state == 'right'){
            this.curRightCount += 1
            this.setOutputData(1, this.curRightCount)
            this.trigger('输出正确反馈')
            if(this.curRightCount == this.properties.rightCount){
                 this.trigger('输出结束反馈')
            }
        }else if(state == 'error'){
            this.trigger('输出错误反馈')
        }
    }
  
    // Function to call when the node is executed
    //执行时的方法
    // onExecute() {
    //   var A = this.getInputData(0)
    //   this.setOutputData(0, parseFloat(this.properties["value"])) //发送一个参数出去
    // }


}
  
// Register the node type
dragNumGame.title = '拖拽数数游戏控制器'    //设置中文名称标题，是否需要实现多语言？
dragNumGame.nodeType = "output/tatagame/dragGame/dragGameControl"
LiteGraph.registerNodeType(dragNumGame.nodeType, dragNumGame)    //第一个是唯一key，同时也是菜单选项路径


class dragNumObj extends BaseYWNode {
    // Name to show
    title = "value"
    desc = "这是一个拖拽数数游戏的选项，关联到选项上";   //不会在显示节点中用到，仅仅在代码中的解释
    name = '拖拽数数游戏选项'

    constructor() {
      super()
      this.addInput("物体", "codeNode")   //增加一个输入触点，  输入触点的名称， 值类型    //不需要触发了
      //this.addInput("B", "number")

      this.addProperty("isRight", true);   //增加一个变量，    变量名称， 变量名称
      this.widget = this.addWidget("toggle", "是否为正确选项", true, "isRight");

        //   this.progress = 0.5               //设置节点的进度，一般来说用于在执行的时候设置
        //   this.widget = this.addWidget("number","值",1,"value");
        //   this.serialize_widgets = true;
        //   this.widget = this.addWidget("number","value",1,"value");  //增加一个控件用于修改变量，  类型，显示名称，默认值，要修改的变量的名称
      this.widgets_up = true;                                    //设置输入组件在顶部（覆盖input和output）
       //   this.size = [180, 30];                                     //设置默认节点尺寸
       //   this.properties.precision = 1
    }
  
    // Function to call when the node is executed
    //执行时的方法
    onExecute() {
    //   var A = this.getInputData(0)
    //   this.setOutputData(0, parseFloat(this.properties["value"])) //发送一个参数出去
    }

    onStart(){
        super.onStart()
        let codeNode = this.getInputData(0)
        // let linkObjectNode = this.getInputNode(0)
        // if(linkObjectNode == null){
        //     console.log('当前没有连接节点', linkObjectNode)
        //     return
        // }
        this.touchIds = {}
        if(codeNode != null){
            if(this.startPos == null){
                this.startPos = cc.v2(codeNode.x, codeNode.y)
                this.startZIndex = codeNode.zIndex
            }

            var lastMovePos = null
            var moveCount = 5
            var eventId = null
            
            codeNode.targetOff(this)
            codeNode.on(cc.Node.EventType.TOUCH_START, (event)=>{
                if(this.inAni == true){
                    return
                }
                lastMovePos = null
                eventId = event.getID() 
                var eventid = event.getID() 
                this.touchIds[eventid] = 1
                codeNode.zIndex = 1999
            }, this)
            codeNode.on(cc.Node.EventType.TOUCH_MOVE, (event)=>{
                if(Object.keys(this.touchIds).length > 1){
                    //多点触摸时不响应
                    return
                }
                if(eventId != event.getID()){
                    return
                }
                if(this.graph.config.pause == 1){
                    return
                }
                if(this.inAni == true){
                    return
                }
                if(this.instance != null && moveCount < 5){
                    moveCount += 1
                    return
                }
                moveCount = 0
                if(lastMovePos == null){
                    lastMovePos = codeNode.parent.convertToNodeSpaceAR(event.getLocation())
                    return
                }
                var nowMovePos = codeNode.parent.convertToNodeSpaceAR(event.getLocation())
                //移动的时候检测，只在碰撞框内才出发移动
                var inTouch = true

                // if(this.properties.needCheckIn.default == 1){
                //     var collider = codeNode.getComponent(cc.PolygonCollider)
                //     if(collider != null){
                //         var inNodePos = codeNode.node.convertToNodeSpaceAR(event.getLocation())
                //         var inTouch = cc.Intersection.pointInPolygon(inNodePos, collider.points)
                //     }
                // }
            
                var delta = nowMovePos.sub(lastMovePos)
                if(inTouch == true){
                    // this.setOutputData(0, delta.x)
                    // this.setOutputData(1, delta.y)
                    // this.triggerSlot(2, 1)
                    // if(this.properties.controllObj == true){
                        codeNode.x += delta.x
                        codeNode.y += delta.y
                    // }
                }
                lastMovePos = nowMovePos
            }, this)

            codeNode.on(cc.Node.EventType.TOUCH_END, (event)=>{
                if(this.inAni == true){
                    return
                }
                var eventid = event.getID()
                delete this.touchIds[eventid]
                //判断是否
                this.checkIsInTarget(codeNode, event)
            }, this)
            codeNode.on(cc.Node.EventType.TOUCH_CANCEL, (event)=>{
                if(this.inAni == true){
                    return
                }
                var eventid = event.getID()
                delete this.touchIds[eventid]
                this.checkIsInTarget(codeNode, event)
            }, this)
        }
        
        // if(this.touchEndNode == null){
        //     let touchEndNode = LiteGraph.createNode('input/screen/touchEnd')
        //     linkObjectNode.connect(0, touchEndNode, 0)
        //     touchEndNode.onAction('监听')
        //     this.touchEndNode = touchEndNode
        // }else{
        //     this.touchEndNode.onAction('监听')
        // }
    }

    checkIsInTarget(codeNode, event){
        let isIn = false 
        let dragNumGameControll = this.graph.findNodesByType(dragNumGame.nodeType)[0]
        if(dragNumGameControll == null){
            return
        }

        let targetNode = dragNumGameControll.getInputData(0, true)
        if(targetNode != null){
            var collider = targetNode.getComponent(cc.PolygonCollider)
            if(collider != null){
                var inNodePos = targetNode.node.convertToNodeSpaceAR(event.getLocation())
                isIn = cc.Intersection.pointInPolygon(inNodePos, collider.points)
                console.log('判断是否处于碰撞框内', isIn)
            }else{
                //没有添加碰撞框
                console.warn("目标对象没有添加碰撞框")
                if(CocosMgr.isInApp == false){
                    if(window.antAleart != null){
                       window.antAleart('目标对象没有添加碰撞框')
                    }
                }
            }
        }

        if(isIn == false){
            //如果没有拖到目标位置，不管正确错误都回到原来位置
            this.inAni = true
            cc.tween(codeNode).to(0.5, {x: this.startPos.x, y: this.startPos.y}).call(()=>{
                codeNode.zIndex = this.startZIndex
                this.inAni = false
            }).start()
        }else{
            //通知游戏控制器
            if(this.properties.isRight == true){
                dragNumGameControll.onAction('right')
                codeNode.targetOff(this)
                cc.tween(codeNode).to(0.5, {opacity: 0}).start()
            }else{
                dragNumGameControll.onAction('error')
                //错误选项回到原来位置
                this.inAni = true
                cc.tween(codeNode).to(0.5, {x: this.startPos.x, y: this.startPos.y}).call(()=>{
                    codeNode.zIndex = this.startZIndex
                    this.inAni = false
                }).start()
            }
        }
    }
}
  
// Register the node type
dragNumObj.title = '拖拽数数游戏选项'    //设置中文名称标题，是否需要实现多语言？
dragNumObj.nodeType = "output/tatagame/dragGame/dragNumObj"
LiteGraph.registerNodeType(dragNumObj.nodeType, dragNumObj)    //第一个是唯一key，同时也是菜单选项路径
