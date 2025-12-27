// import { EventConst } from '../../../logic/EventConst';
// import { EventCenter } from '../../../UIFrame/EventCenter';
import {LiteGraph, LGraphNode} from '../../litegraph/litegraph'
import * as CocosMgr from '../CocosMgr';
import VoiceGen from '@/xfyun/VoiceGen';


//ONEVENT是节点自带的事件触发，ONToggle是通用的节点触发，节点自带的事件想要触发就只能设置为OnEvent模式，执行对应的Action
class showTextTip extends LGraphNode {
    // Name to show
    title = "文字提示"
    desc = "弹出文字提示信息";   //不会在显示节点中用到，仅仅在代码中的解释
    color= '#510'

    constructor() {
        super()
        this.mode = LiteGraph.ON_EVENT;     //设置触发模式
        // this.size = [80, 30];               //设置默认节点尺寸
        // this.addInput("触发", "number")   //增加一个输入触点，  输入触点的名称， 值类型
    //   this.addInput("B", "number")
        // this.addOutput("bool", "boolean")   //增加一个输出触点，  输出节点的名称， 值类型
        this.addProperty("msg", "");   //增加一个变量，    变量名称， 变量名称
        this.addInput("", LiteGraph.EVENT);
        this.widget = this.addWidget("text", "Text", "", "msg");
        this.widgets_up = true;
        this.size = [200, 30];


    //   this.progress = 0.5               //设置节点的进度，一般来说用于在执行的时候设置
        // this.widget = this.addWidget("toggle","value",true,"value");
    //   this.widget = this.addWidget("number","value",1,"value");  //增加一个控件用于修改变量，  类型，显示名称，默认值，要修改的变量的名称
        //  this.serialize_widgets = true; //widget的值是否也可以被序列化，weidget值和Property中的值不是绑定的，如果初始时不一致，就会出现weidget显示的不是真实的值，所以建议绑定
        // this.widgets_up = true;                                    //设置输入组件在顶部（覆盖input和output）
    //   this.properties.precision = 1
    }
  
    // Function to call when the node is executed
    //执行时的方法
    onExecute() {
        // console.log("consoleInfo onExecute")
    //   var A = this.getInputData(0)
        //可以反向获取输入的值，不需要被动输入值，目前看来确实更合理
        // var msg = this.getInputData(0); //getInputDataByName("msg");
        // console.log('consoleInfo:', msg);
        // if (!msg) msg = this.properties.msg;
        // if (msg != null && typeof msg != "undefined") {
        //     this.properties.msg = msg;
        // }
    }


    // onSelected(){
    //     console.log("consoleInfo onSelected")
    // }

    //动态返回卡片显示的title
    // getTitle() {
    //    var msg = this.getInputOrProperty('msg')
    //    if(msg != null)
    //    return this.title;
    // };

    //暂不清楚用处
    setValue(v){
		this.setProperty("value",v);
	}
    
    // 获取可以接受的输入
    // onGetInputs() {
	// 	return [
    //         ["log", LiteGraph.ACTION],
    //         ["warn", LiteGraph.ACTION],
    //         ["error", LiteGraph.ACTION]
    //     ];
	// };

    // 当节点Toggle时调用
    onAction(action, param)
	{
        var msg = this.properties.msg;
        CocosMgr.showAlert(msg);
        //暂时调用网页提醒
        //提供接入cocos的提示，或者是ant的消息提示
        //需要一个统一的接入管理器
	}

    //自定义触点显示的文字
    // onDrawBackground(ctx) {
    //     //show the current value
    //     this.outputs[0].label = this.properties["value"] ? '真' : '假'
    // };

    //使用ctx绘制需要显示的内容
    // onDrawForeground(ctx){
    //     var size = this.size[1] * 0.5;
    //     var h = this.size[1] * 0.8;

    //     ctx.textAlign = "left";
    //     ctx.fillStyle = "#AAA";
    //     ctx.fillText('测试绘制文字', size * 1.2, h * 0.85);
    //     ctx.textAlign = "left";
    //     // this.outputs[0].label = this.properties["value"].toFixed(2);
    // }
}

showTextTip.title = '文字提示'
LiteGraph.registerNodeType("output/tips/showTextTip", showTextTip);



class showConfirm extends LGraphNode {
    // Name to show
    title = "确认框"
    desc = "弹出文字提示确认框，用户可点击确认或取消";   //不会在显示节点中用到，仅仅在代码中的解释
    color= '#510'

    constructor() {
        super()
        this.mode = LiteGraph.ON_EVENT;     //设置触发模式
        // this.size = [80, 30];               //设置默认节点尺寸
        // this.addInput("触发", "number")   //增加一个输入触点，  输入触点的名称， 值类型
    //   this.addInput("B", "number")
        // this.addOutput("bool", "boolean")   //增加一个输出触点，  输出节点的名称， 值类型
        this.addProperty("msg", "");   //增加一个变量，    变量名称， 变量名称
        this.addInput("", LiteGraph.EVENT);
        this.widget = this.addWidget("text", "Text", "", "msg");
        // this.widgets_up = true;
        // this.size = [200, 30];

        this.addOutput('确认', LiteGraph.EVENT)
        this.addOutput('取消', LiteGraph.EVENT)

    //   this.progress = 0.5               //设置节点的进度，一般来说用于在执行的时候设置
        // this.widget = this.addWidget("toggle","value",true,"value");
    //   this.widget = this.addWidget("number","value",1,"value");  //增加一个控件用于修改变量，  类型，显示名称，默认值，要修改的变量的名称
        //  this.serialize_widgets = true; //widget的值是否也可以被序列化，weidget值和Property中的值不是绑定的，如果初始时不一致，就会出现weidget显示的不是真实的值，所以建议绑定
        // this.widgets_up = true;                                    //设置输入组件在顶部（覆盖input和output）
    //   this.properties.precision = 1
    }
  
    // Function to call when the node is executed
    //执行时的方法
    // onExecute() {
        // console.log("consoleInfo onExecute")
    //   var A = this.getInputData(0)
        //可以反向获取输入的值，不需要被动输入值，目前看来确实更合理
        // var msg = this.getInputData(0); //getInputDataByName("msg");
        // console.log('consoleInfo:', msg);
        // if (!msg) msg = this.properties.msg;
        // if (msg != null && typeof msg != "undefined") {
        //     this.properties.msg = msg;
        // }
    // }


    // onSelected(){
    //     console.log("consoleInfo onSelected")
    // }

    //动态返回卡片显示的title
    // getTitle() {
    //    var msg = this.getInputOrProperty('msg')
    //    if(msg != null)
    //    return this.title;
    // };

    //暂不清楚用处
    // setValue(v){
	// 	this.setProperty("value",v);
	// }
    
    // 获取可以接受的输入
    // onGetInputs() {
	// 	return [
    //         ["log", LiteGraph.ACTION],
    //         ["warn", LiteGraph.ACTION],
    //         ["error", LiteGraph.ACTION]
    //     ];
	// };

    // 当节点Toggle时调用
    onAction(action, param)
	{
        var msg = this.properties.msg;
        CocosMgr.showConfirm(msg, (result)=>{
             if(result == true){
                this.trigger('确认')
            }else{
                this.trigger('取消')
            }
        })
        // console.log('用户点击了result', result)

        //暂时调用网页提醒
        //提供接入cocos的提示，或者是ant的消息提示
        //需要一个统一的接入管理器
	}

    //自定义触点显示的文字
    // onDrawBackground(ctx) {
    //     //show the current value
    //     this.inputs[0].label = 'msg:' + this.msg
    // };

    //使用ctx绘制需要显示的内容
    // onDrawForeground(ctx){
    //     var size = this.size[1] * 0.5;
    //     var h = this.size[1] * 0.8;

    //     ctx.textAlign = "left";
    //     ctx.fillStyle = "#AAA";
    //     ctx.fillText('测试绘制文字', size * 1.2, h * 0.85);
    //     ctx.textAlign = "left";
    //     // this.outputs[0].label = this.properties["value"].toFixed(2);
    // }
}

showConfirm.title = '确认框'
LiteGraph.registerNodeType("output/tips/showConfirm", showConfirm);



class showHandTip extends LGraphNode {
    // Name to show
    title = "触摸提示"
    desc = "播放一个触摸提示的动画";   //不会在显示节点中用到，仅仅在代码中的解释
    // color= '#510'

    constructor() {
        super()
        // this.serialize_widgets = true
        this.mode = LiteGraph.ON_EVENT;     //设置触发模式
        // this.size = [80, 30];               //设置默认节点尺寸
        // this.addInput("触发", "number")   //增加一个输入触点，  输入触点的名称， 值类型
    //   this.addInput("B", "number")
        // this.addOutput("bool", "boolean")   //增加一个输出触点，  输出节点的名称， 值类型
        // this.addProperty("msg", "");   //增加一个变量，    变量名称， 变量名称
        this.addInput("物体", 'codeNode');
        this.addInput("显示", LiteGraph.ACTION);
        this.addInput("关闭", LiteGraph.ACTION);
        this.addOutput('结束', LiteGraph.EVENT)

        // this.widget = this.addWidget("text", "Text", "", "msg");
        // this.widgets_up = true;
        // this.size = [200, 30];

        this.properties.modal = showHandTip.modalEnum[0]
        this.addWidget('combo', '类型', this.properties.modal, {property: "modal", values: showHandTip.modalEnum })

        this.properties.scale = 1
        this.addWidget('number', '大小', this.properties.scale, 'scale', {precision: 1})

        this.properties.x = 0
        this.addWidget('number', '拖拽终点-x', this.properties.x, 'x', {precision: 0})

        this.properties.y = 0
        this.addWidget('number', '拖拽终点-y', this.properties.y, 'y', {precision: 0})

        this.properties.length = 100
        this.addWidget('number', '长度或半径', this.properties.length, 'length', {precision: 0})

        this.properties.speed = 400
        this.addWidget('number', '速度', this.properties.length, 'speed', {precision: 0})
        // this.addOutput('取消', LiteGraph.EVENT)
        this.updateWidght()

        this.addWidget('button','预览效果', "", ()=>{
            this.showTips()
        })

        this.addWidget('button', '创建触摸动画', "", ()=>{
            this.createLinkNode()
        })

        // this.addWidget('button','重置起始位置', "", ()=>{
        //     this.oriX = null
        //     this.oriY = null
        //     this.
        // })

    //   this.progress = 0.5               //设置节点的进度，一般来说用于在执行的时候设置
        // this.widget = this.addWidget("toggle","value",true,"value");
    //   this.widget = this.addWidget("number","value",1,"value");  //增加一个控件用于修改变量，  类型，显示名称，默认值，要修改的变量的名称
        //  this.serialize_widgets = true; //widget的值是否也可以被序列化，weidget值和Property中的值不是绑定的，如果初始时不一致，就会出现weidget显示的不是真实的值，所以建议绑定
        // this.widgets_up = true;                                    //设置输入组件在顶部（覆盖input和output）
    //   this.properties.precision = 1
    // this.isAnyOutputConnected()
    // this.isInputConnected()
    }

    //当添加的时候自动生成物体组件并关联
    // onAdded(){
    //     if(CocosMgr.isInImport){
    //         //整体导入时不自动添加物体
    //         return
    //     }
    //     let aniNode = LiteGraph.createNode("objects/createObject");
    //     aniNode.pos = [this.pos[0] - this.width - 3, this.pos[1]]
        
    //     aniNode.setProperty('x', 0)
    //     aniNode.setProperty('y', 0)
    //     aniNode.setProperty('modal', CocosMgr.ObjectTypeEnum.spine)
    //     aniNode.setProperty('customeName', 'P0_Common_Finger')
    //     aniNode.properties.nodeConfig.x = 0
    //     aniNode.properties.nodeConfig.y = 0

    //     this.graph.add(aniNode);
    //     // aniNode.properties.customeName = 'P0_Common_Finger'
    //     aniNode.connect(0, this, 0)
    // }

    createLinkNode(){
        if(this.getInputNode(0) == null){
            let aniNode = LiteGraph.createNode("objects/createObject");
            aniNode.pos = [this.pos[0] - this.width - 3, this.pos[1]]
            
            aniNode.setProperty('x', 0)
            aniNode.setProperty('y', 0)
            aniNode.setProperty('modal', CocosMgr.ObjectTypeEnum.spine)
            aniNode.setProperty('customeName', 'P0_Common_Finger')
            aniNode.properties.nodeConfig.x = 0
            aniNode.properties.nodeConfig.y = 0

            this.graph.add(aniNode);
            // aniNode.properties.customeName = 'P0_Common_Finger'
            aniNode.connect(0, this, 0)
        }
    }

    //更新模块
    updateWidght(){
      var value = this.properties.modal
      this.widgets.map((widget)=>{
        if(widget.name == '拖拽终点-x' || widget.name == '拖拽终点-y'){
            widget.disabled = value != '拖拽'
        }else if(widget.name == '长度或半径'){
            widget.disabled = (value == '拖拽' || value == '单次点击' || value == '快速点击' || value == '长按')
        }else if(widget.name == '速度'){
            widget.disabled = (value == '单次点击' || value == '快速点击' || value == '长按')
        }
      })
    }

    onWidgetChanged(name){
        if(name == '类型'){
          this.updateWidght()
        }
    }
  
    // Function to call when the node is executed
    //执行时的方法
    // onExecute() {
        // console.log("consoleInfo onExecute")
    //   var A = this.getInputData(0)
        //可以反向获取输入的值，不需要被动输入值，目前看来确实更合理
        // var msg = this.getInputData(0); //getInputDataByName("msg");
        // console.log('consoleInfo:', msg);
        // if (!msg) msg = this.properties.msg;
        // if (msg != null && typeof msg != "undefined") {
        //     this.properties.msg = msg;
        // }
    // }


    // onSelected(){
    //     console.log("consoleInfo onSelected")
    // }

    //动态返回卡片显示的title
    // getTitle() {
    //    var msg = this.getInputOrProperty('msg')
    //    if(msg != null)
    //    return this.title;
    // };

    //暂不清楚用处
    // setValue(v){
	// 	this.setProperty("value",v);
	// }
    
    // 获取可以接受的输入
    // onGetInputs() {
	// 	return [
    //         ["log", LiteGraph.ACTION],
    //         ["warn", LiteGraph.ACTION],
    //         ["error", LiteGraph.ACTION]
    //     ];
	// };
    onSelected(){
        this.showTips()
    }

    //更新起点位置
    upDateOriPos(){
        var curLink = this.getInputLink(0)
        if(curLink == null){
            return
        }
        var linkedNode = this.graph.getNodeById(curLink.origin_id)
        if(linkedNode == null){
            return
        }
        let codeNode = this.getInputData(0)
        if(linkedNode.properties.x != null && codeNode != null){
            codeNode.x = linkedNode.properties.x
            codeNode.y = linkedNode.properties.y
        }
    }

    onDeselected(){
        this.hideTips()
        // var curLink = this.getInputLink(0)
        // if(curLink == null){
        //     return
        // }
        // var linkedNode = this.graph.getNodeById(curLink.origin_id)
        // if(linkedNode == null){
        //     return
        // }

        // if(linkedNode != null){
        //     // if(linkedNode.codeNode != null){
        //     //     linkedNode.codeNode.active = true
        //     // } 
        //     linkedNode.resetSizeConfig()
        // }
        let codeNode = this.getInputData(0)
        if(this.oriX != null && codeNode != null){
            codeNode.x = this.oriX
            codeNode.y = this.oriY
        }   
    }

    onPause(){
        if(this.inShowTips == true){
            this.hideTips()
        }
    }

    onResume(){
        if(this.inShowTips == true){
            this.showTips()
        }
    }

    
    onStop(){
        // this.oriX = null
        // this.oriY = null
    }

    showTips(){
        let codeNode = this.getInputData(0)
        if(codeNode == null){
            console.warn('showTips 当前没有关联codeNode')
            return
        }   

        codeNode.useCenterMode = false  //使用中心模式
        cc.Tween.stopAllByTarget(this);
        cc.Tween.stopAllByTag(this.getIdWithGraph())


        this.upDateOriPos()
        // this.hideTips()  
        // this.oriX = codeNode.x
        // this.oriY = codeNode.y
        codeNode.center = [codeNode.x, codeNode.y]

        codeNode.active = true
        codeNode.scale = this.properties.scale

        var modal = showHandTip.modalEnum.indexOf(this.properties.modal)

        var spineCom = codeNode.spineCom
        // console.log('准备showTips', modal)
        if(spineCom != null){
            // ['单次点击','快速点击','拖拽','上下滑动','左右滑动','转圈','长按']
            if(modal == 0){
                //单次点击
                spineCom.setAnimation(0, 'act1', true)
                spineCom.setCompleteListener((trackEntry)=>{
                    // let ccompleteName = trackEntry.animation.name;
                    this.outputHandle()
                })
            }else if(modal == 1){
                //快速点击
                spineCom.setAnimation(0, 'act2', true)
                spineCom.setCompleteListener((trackEntry)=>{
                    // let ccompleteName = trackEntry.animation.name;
                    this.outputHandle()
                })
            }else if(modal == 2){
                //拖拽
                spineCom.setAnimation(0, 'act3_1', false)
                spineCom.addAnimation(0, 'act3_2', true)
                var x = this.properties.x
                var y = this.properties.y
                var lengthx = codeNode.x - x
                var lengthy = codeNode.y - y
                if(this.properties.speed == 0){
                    return
                }
                var time = Math.sqrt(lengthy * lengthy + lengthx * lengthx) / this.properties.speed
                if(time == 0){
                    return
                }
                // var oriX = codeNode.x 
                // var oriY = codeNode.y
                cc.tween(codeNode).tag(this.getIdWithGraph()).delay(0.3).to(time, {x: x, y: y}).call(()=>{
                    spineCom.loop = false
                    spineCom.addAnimation(0, 'act3_3', false)
                    cc.tween(this).delay(1).call(()=>{
                        // codeNode.x = oriX
                        // codeNode.y = oriY
                        this.outputHandle()
                        this.showTips()
                    }).start()
                }).start()
            }else if(modal == 3){
                //上下滑动
                var length = this.properties.length
                if(this.properties.speed == 0){
                    return
                }
                var time = length / this.properties.speed
                spineCom.setAnimation(0, 'act3_2', true)
                if(time == 0){
                    return
                }
                cc.tween(codeNode)
                    .tag(this.getIdWithGraph())
                    .to(time, {y: codeNode.y - length})
                    .to(time * 2, {y: codeNode.y + length})
                    .to(time, {y: codeNode.y})
                    .call(()=>{
                        this.outputHandle()
                        this.showTips()
                    })
                    .start() 
            }else if(modal == 4){
                //左右滑动
                var length = this.properties.length
                if(this.properties.speed == 0){
                    return
                }
                var time = Math.abs(length / this.properties.speed)
                spineCom.setAnimation(0, 'act3_2', true)
                if(time == 0){
                    return
                }
                cc.tween(codeNode)
                    .tag(this.getIdWithGraph())
                    .to(time, {x: codeNode.x - length})
                    .to(time * 2, {x: codeNode.x + length})
                    .to(time, {x: codeNode.x})
                    .call(()=>{
                        this.outputHandle()
                        this.showTips()
                    })
                    .start()
            }else if(modal == 5){
                //转圈
                codeNode.radius = this.properties.length
                codeNode.useCenterMode = true
                if(this.properties.speed == 0){
                    return
                }
                var time = Math.abs(Math.PI * 2 / (this.properties.speed *0.01))
                if(time == 0){
                    return
                }
                spineCom.setAnimation(0, 'act3_2', true)
                var angle = this.properties.speed > 0 ? 360 : -360
                // console.log('多少秒转一圈',time, angle)
                cc.tween(codeNode)
                    .tag(this.getIdWithGraph())
                    .by(time, {angleToPos: angle})
                    .call(()=>{
                        this.outputHandle()
                        this.showTips()
                    })
                    .start() 
            }else if(modal == 6){
                //长按
                spineCom.setAnimation(0, 'act3_1', false)
                spineCom.addAnimation(0, 'act3_2', true)
                cc.tween(this).delay(2).call(()=>{
                    spineCom.loop = false
                    spineCom.addAnimation(0, 'act3_3', false)
                    cc.tween(this).delay(0.8).call(()=>{
                        this.outputHandle()
                        this.showTips()
                    }).start()
                }).start()
            }
        }else{
            console.warn('showTip 目标没有spine')
        }
    }

    outputHandle(){
        this.triggerSlot(0)
    }

    hideTips(){
        cc.Tween.stopAllByTarget(this);
        let codeNode = this.getInputData(0)
        if(codeNode == null){
            console.warn('showTips 当前没有关联codeNode')
            return
        }        
        if(codeNode != null){
            codeNode.useCenterMode = false  //使用中心模式
            // cc.Tween.stopAllByTarget(codeNode);
            cc.Tween.stopAllByTag(this.getIdWithGraph())
            if(codeNode.spineCom != null){
                codeNode.spineCom.clearTrack(0)
            }
            codeNode.active = false
        }
        // this.oriX = null
        // this.oriY = null
    }

    onStart(){
        //开始时默认是关闭引导的
        this.onAction('关闭')
    }

    // 当节点Toggle时调用
    onAction(action, param)
	{
        if(action == '显示'){
            this.inShowTips = true
            this.showTips()
        }else if(action == '关闭'){
            this.inShowTips = false
            this.hideTips()
        }
        //结束
        //this.trigger('结束')
        //暂时调用网页提醒
        //提供接入cocos的提示，或者是ant的消息提示
        //需要一个统一的接入管理器
	}

    //自定义触点显示的文字
    // onDrawBackground(ctx) {
    //     //show the current value
    //     this.outputs[0].label = this.properties["value"] ? '真' : '假'
    // };

    //使用ctx绘制需要显示的内容
    // onDrawForeground(ctx){
    //     var size = this.size[1] * 0.5;
    //     var h = this.size[1] * 0.8;

    //     ctx.textAlign = "left";
    //     ctx.fillStyle = "#AAA";
    //     ctx.fillText('测试绘制文字', size * 1.2, h * 0.85);
    //     ctx.textAlign = "left";
    //     // this.outputs[0].label = this.properties["value"].toFixed(2);
    // }
}

showHandTip.title = '触摸提示'
showHandTip.modalEnum = ['单次点击','快速点击','拖拽','上下滑动','左右滑动','转圈','长按']
LiteGraph.registerNodeType("output/tips/showHandTip", showHandTip);

// blockTouch
class blockTouch extends LGraphNode {
    // Name to show
    title = "屏蔽触摸"
    desc = "屏蔽触摸事件，简化流程";   //不会在显示节点中用到，仅仅在代码中的解释
    // color= '#510'

    constructor() {
        super()
        // this.serialize_widgets = true
        this.mode = LiteGraph.ON_EVENT;     //设置触发模式
        this.size = [80, 30];               //设置默认节点尺寸
        // this.addInput("触发", "number")   //增加一个输入触点，  输入触点的名称， 值类型
    //   this.addInput("B", "number")
        // this.addOutput("bool", "boolean")   //增加一个输出触点，  输出节点的名称， 值类型
        // this.addProperty("msg", "");   //增加一个变量，    变量名称， 变量名称
        this.addInput("开启", LiteGraph.ACTION);
        this.addInput("关闭", LiteGraph.ACTION);
            //设置节点的进度，一般来说用于在执行的时候设置
        // this.widget = this.addWidget("toggle","value",true,"value");
    //   this.widget = this.addWidget("number","value",1,"value");  //增加一个控件用于修改变量，  类型，显示名称，默认值，要修改的变量的名称
        //  this.serialize_widgets = true; //widget的值是否也可以被序列化，weidget值和Property中的值不是绑定的，如果初始时不一致，就会出现weidget显示的不是真实的值，所以建议绑定
        // this.widgets_up = true;                                    //设置输入组件在顶部（覆盖input和output）
    //   this.properties.precision = 1
    }

  
    // Function to call when the node is executed
    //执行时的方法
    // onExecute() {
        // console.log("consoleInfo onExecute")
    //   var A = this.getInputData(0)
        //可以反向获取输入的值，不需要被动输入值，目前看来确实更合理
        // var msg = this.getInputData(0); //getInputDataByName("msg");
        // console.log('consoleInfo:', msg);
        // if (!msg) msg = this.properties.msg;
        // if (msg != null && typeof msg != "undefined") {
        //     this.properties.msg = msg;
        // }
    // }


    // onSelected(){
    //     console.log("consoleInfo onSelected")
    // }

    //动态返回卡片显示的title
    // getTitle() {
    //    var msg = this.getInputOrProperty('msg')
    //    if(msg != null)
    //    return this.title;
    // };

    // onStart(){
    // //    this.codeNode = CocosMgr.createObj(config, loadCb)
    // }

    onStop(){
        CocosMgr.blockTouch(false)
    }

    //暂不清楚用处
    // setValue(v){
	// 	this.setProperty("value",v);
	// }
    
    // 获取可以接受的输入
    // onGetInputs() {
	// 	return [
    //         ["log", LiteGraph.ACTION],
    //         ["warn", LiteGraph.ACTION],
    //         ["error", LiteGraph.ACTION]
    //     ];
	// };

    // 当节点Toggle时调用
    onAction(action, param)
	{
        if(action == '开启'){
            CocosMgr.blockTouch(true)
        }else if(action == '关闭'){
            CocosMgr.blockTouch(false)
        }
        //结束
        //this.trigger('结束')
        //暂时调用网页提醒
        //提供接入cocos的提示，或者是ant的消息提示
        //需要一个统一的接入管理器
	}

    //自定义触点显示的文字
    // onDrawBackground(ctx) {
    //     //show the current value
    //     this.outputs[0].label = this.properties["value"] ? '真' : '假'
    // };

    //使用ctx绘制需要显示的内容
    // onDrawForeground(ctx){
    //     var size = this.size[1] * 0.5;
    //     var h = this.size[1] * 0.8;

    //     ctx.textAlign = "left";
    //     ctx.fillStyle = "#AAA";
    //     ctx.fillText('测试绘制文字', size * 1.2, h * 0.85);
    //     ctx.textAlign = "left";
    //     // this.outputs[0].label = this.properties["value"].toFixed(2);
    // }
}

blockTouch.title = '屏蔽触摸'
LiteGraph.registerNodeType("output/blockTouch", blockTouch);


class consoleInfo extends LGraphNode {
    // Name to show
    title = "输出控制台"
    desc = "打印内容到控制台";   //不会在显示节点中用到，仅仅在代码中的解释

    constructor() {
        super()
        this.mode = LiteGraph.ON_EVENT;     //设置触发模式
        // this.size = [80, 30];               //设置默认节点尺寸
        // this.addInput("触发", "number")   //增加一个输入触点，  输入触点的名称， 值类型
    //   this.addInput("B", "number")
        // this.addOutput("bool", "boolean")   //增加一个输出触点，  输出节点的名称， 值类型
        

        this.addInput("msg", 0);    //0表示可以是任何类型
        this.addInput("log",   LiteGraph.ACTION);
        this.addInput("warn",  LiteGraph.ACTION);
        this.addInput("error", LiteGraph.ACTION);

        this.addProperty("msg", "");   //增加一个变量，    变量名称， 变量名称
        this.addWidget("string", "msg", this.properties.msg, 'msg');   //增加一个变量，    变量名称， 变量名称

    //   this.progress = 0.5               //设置节点的进度，一般来说用于在执行的时候设置
        // this.widget = this.addWidget("toggle","value",true,"value");
    //   this.widget = this.addWidget("number","value",1,"value");  //增加一个控件用于修改变量，  类型，显示名称，默认值，要修改的变量的名称
        //  this.serialize_widgets = true; //widget的值是否也可以被序列化，weidget值和Property中的值不是绑定的，如果初始时不一致，就会出现weidget显示的不是真实的值，所以建议绑定
        this.widgets_up = true;                                    //设置输入组件在顶部（覆盖input和output）
    //   this.properties.precision = 1
    }
  
    // Function to call when the node is executed
    //执行时的方法
    onExecute() {
        // console.log("consoleInfo onExecute")
    //   var A = this.getInputData(0)
        //可以反向获取输入的值，不需要被动输入值，目前看来确实更合理
        var msg = this.getInputOrProperty('msg'); //getInputDataByName("msg");
        console.log('consoleInfo:', msg);
        // if (!msg) msg = this.properties.msg;
        // if (msg != null && typeof msg != "undefined") {
        //     this.properties.msg = msg;
        // }
    }


    // onSelected(){
    //     console.log("consoleInfo onSelected")
    // }

    //动态返回卡片显示的title
    // getTitle() {
    //     if (this.flags.collapsed) {
    //         return this.properties.value;
    //     }
    //     return this.title;
    // };

    //暂不清楚用处
    setValue(v){
		this.setProperty("value",v);
	}
    
    // 获取可以接受的输入
    onGetInputs() {
		return [
            ["log", LiteGraph.ACTION],
            ["warn", LiteGraph.ACTION],
            ["error", LiteGraph.ACTION]
        ];
	};

    // 当节点Toggle时调用
    onAction(action, param)
	{
        // console.log("consoleInfo onAction", action, param)
		 // param is the action
        var msg = this.getInputOrProperty('msg'); //getInputDataByName("msg");
         //if (msg == null || typeof msg == "undefined") return;
        //  if (!msg) msg = this.properties.msg;
        //  if (!msg) msg = "Event param: " + param; // msg is undefined if the slot is lost?
         if (action == "log") {
             console.log('consoleInfo',msg);
         } else if (action == "warn") {
             console.warn('consoleInfo',msg);
         } else if (action == "error") {
             console.error('consoleInfo',msg);
         }
	}

    //自定义触点显示的文字
    // onDrawBackground(ctx) {
    //     //show the current value
    //     this.outputs[0].label = this.properties["value"] ? '真' : '假'
    // };
    onDrawBackground(ctx) {
        //show the current value
        if(this.getInputData(0) != null){
            this.inputs[0].label = 'msg:' + this.getInputData(0);
        }else{
            this.inputs[0].label = 'msg'
        }
    };

    //使用ctx绘制需要显示的内容
    // onDrawForeground(ctx){
    //     var size = this.size[1] * 0.5;
    //     var h = this.size[1] * 0.8;

    //     ctx.textAlign = "left";
    //     ctx.fillStyle = "#AAA";
    //     ctx.fillText('测试绘制文字', size * 1.2, h * 0.85);
    //     ctx.textAlign = "left";
    //     // this.outputs[0].label = this.properties["value"].toFixed(2);
    // }
}

consoleInfo.title = '输出控制台'
LiteGraph.registerNodeType("output/tips/consoleInfo", consoleInfo);



class restartGame extends LGraphNode {
    // Name to show
    title = "重新开始"
    desc = "重新开始游戏流程";   //不会在显示节点中用到，仅仅在代码中的解释
    // color= '#510'
    

    constructor() {
        super()
        // this.serialize_widgets = true
        this.mode = LiteGraph.ON_EVENT;     //设置触发模式
        this.size = [80, 20];               //设置默认节点尺寸
        // this.addInput("触发", "number")   //增加一个输入触点，  输入触点的名称， 值类型
    //   this.addInput("B", "number")
        // this.addOutput("bool", "boolean")   //增加一个输出触点，  输出节点的名称， 值类型
        // this.addProperty("msg", "");   //增加一个变量，    变量名称， 变量名称
        this.addInput("重启", LiteGraph.ACTION);
            //设置节点的进度，一般来说用于在执行的时候设置
        // this.widget = this.addWidget("toggle","value",true,"value");
    //   this.widget = this.addWidget("number","value",1,"value");  //增加一个控件用于修改变量，  类型，显示名称，默认值，要修改的变量的名称
        //  this.serialize_widgets = true; //widget的值是否也可以被序列化，weidget值和Property中的值不是绑定的，如果初始时不一致，就会出现weidget显示的不是真实的值，所以建议绑定
        // this.widgets_up = true;                                    //设置输入组件在顶部（覆盖input和output）
    //   this.properties.precision = 1
    }

  
    // 当节点Toggle时调用
    onAction(action, param)
	{
        if(action == '重启'){
                this.graph.stop()
                this.graph.start()
        }
	}
}

restartGame.title = '重新开始'
LiteGraph.registerNodeType("output/game/restartGame", restartGame);


class changeGame extends LGraphNode {
    // Name to show
    title = "切换页面"
    desc = "切换到新的页面";   //不会在显示节点中用到，仅仅在代码中的解释
    // color= '#510'
    

    constructor() {
        super()
        // this.serialize_widgets = true
        this.mode = LiteGraph.ON_EVENT;     //设置触发模式
        this.size = [80, 20];               //设置默认节点尺寸
        // this.addInput("触发", "number")   //增加一个输入触点，  输入触点的名称， 值类型
    //   this.addInput("B", "number")
        // this.addOutput("bool", "boolean")   //增加一个输出触点，  输出节点的名称， 值类型
        this.addProperty("pageIndex", 0, 'number');   //增加一个变量，    变量名称， 变量名称
        this.addWidget("number","页码", this.properties.pageIndex ,"pageIndex", {precision: 0, min: 1});  //增加一个控件用于修改变量，  类型，显示名称，默认值，要修改的变量的名称

        this.addProperty("gamePath", "", 'string');
        this.addWidget("string", '页面名称', this.properties.gamePath, "gamePath");

        this.addInput("切换", LiteGraph.ACTION);
            //设置节点的进度，一般来说用于在执行的时候设置
        //  this.serialize_widgets = true; //widget的值是否也可以被序列化，weidget值和Property中的值不是绑定的，如果初始时不一致，就会出现weidget显示的不是真实的值，所以建议绑定
        // this.widgets_up = true;                                    //设置输入组件在顶部（覆盖input和output）
    //   this.properties.precision = 1
    }

  
    // 当节点Toggle时调用
    onAction(action, param)
	{
        if(action == '切换'){
            this.graph.stop()
            CocosMgr.changeGraph(this.properties.gamePath, this.properties.pageIndex - 1)
        }
	}
}

changeGame.title = '切换页面'
LiteGraph.registerNodeType("output/game/changeGame", changeGame);




class endGame extends LGraphNode {
    // Name to show
    title = "页面结束"
    desc = "这一页阅读结束了";   //不会在显示节点中用到，仅仅在代码中的解释
    // color= '#510'
    

    constructor() {
        super()
        // this.serialize_widgets = true
        this.mode = LiteGraph.ON_EVENT;     //设置触发模式
        this.size = [80, 20];               //设置默认节点尺寸
        // this.addInput("触发", "number")   //增加一个输入触点，  输入触点的名称， 值类型
    //   this.addInput("B", "number")
        // this.addOutput("bool", "boolean")   //增加一个输出触点，  输出节点的名称， 值类型
        // this.addProperty("pageIndex", 0, 'number');   //增加一个变量，    变量名称， 变量名称
        // this.addWidget("number","页码", this.properties.pageIndex ,"pageIndex", {precision: 0});  //增加一个控件用于修改变量，  类型，显示名称，默认值，要修改的变量的名称

        // this.addProperty("gamePath", "", 'string');
        // this.addWidget("string", '页面路径', this.properties.gamePath, "gamePath");

        this.addInput("结束", LiteGraph.ACTION);
            //设置节点的进度，一般来说用于在执行的时候设置
        //  this.serialize_widgets = true; //widget的值是否也可以被序列化，weidget值和Property中的值不是绑定的，如果初始时不一致，就会出现weidget显示的不是真实的值，所以建议绑定
        // this.widgets_up = true;                                    //设置输入组件在顶部（覆盖input和output）
    //   this.properties.precision = 1
    }

  
    // 当节点Toggle时调用
    onAction(action, param)
	{
        if(action == '结束'){
            // this.graph.stop()
            if(CocosMgr.isInApp){
                //通知StoryView页面结束了
                EventCenter.emit(EventConst.PAGE_END)
            }
        }
	}
}

endGame.title = '页面结束'
LiteGraph.registerNodeType("output/game/endGame", endGame);


class sendEventToBook extends LGraphNode {
    // Name to show
    title = "通知绘本操作"
    desc = "操作绘本相关事件";   //不会在显示节点中用到，仅仅在代码中的解释
    // color= '#510'
    

    constructor() {
        super()
        // this.serialize_widgets = true
        this.mode = LiteGraph.ON_EVENT;     //设置触发模式
        // this.size = [80, 20];               //设置默认节点尺寸
        // this.addInput("触发", "number")   //增加一个输入触点，  输入触点的名称， 值类型
    //   this.addInput("B", "number")
        // this.addOutput("bool", "boolean")   //增加一个输出触点，  输出节点的名称， 值类型
        // this.addProperty("pageIndex", 0, 'number');   //增加一个变量，    变量名称， 变量名称
        // this.addWidget("number","页码", this.properties.pageIndex ,"pageIndex", {precision: 0});  //增加一个控件用于修改变量，  类型，显示名称，默认值，要修改的变量的名称

        

        this.addInput("触发", LiteGraph.ACTION);
        this.addInput('param', 0)
         
        this.addProperty("modal", "隐藏底部字幕", 'string');
        this.addWidget('combo', '事件', this.properties.modal, {property: "modal", values: sendEventToBook.modalEnum })


        this.addProperty("param", "", 'string');
        this.addWidget("string", '附加信息', this.properties.param, "param");
            //设置节点的进度，一般来说用于在执行的时候设置
        //  this.serialize_widgets = true; //widget的值是否也可以被序列化，weidget值和Property中的值不是绑定的，如果初始时不一致，就会出现weidget显示的不是真实的值，所以建议绑定
        this.widgets_up = true;                                    //设置输入组件在顶部（覆盖input和output）
        // this.widgets_start_y = 2
        this.setSize(this.computeSize())
    //   this.properties.precision = 1
    }

  
    // 当节点Toggle时调用
    onAction(action, param)
	{
        if(action == '触发'){
            // this.graph.stop()
            if(CocosMgr.isInApp){
                //通知StoryView页面结束了
                let eventName = sendEventToBook.modalEnumDit[this.properties.modal]
                let exInfo = this.getInputOrProperty('param')
                EventCenter.emit(eventName, exInfo)
            }
        }
	}
}

sendEventToBook.title = '通知绘本操作'
sendEventToBook.modalEnum = ['隐藏底部字幕']
sendEventToBook.modalEnumDit = {'隐藏底部字幕':'OnHideReadText'}

LiteGraph.registerNodeType("output/game/sendEventToBook", sendEventToBook);



class sound extends LGraphNode {
    // Name to show
    title = "播放音频"
    desc = "播放一段音频";   //不会在显示节点中用到，仅仅在代码中的解释
    // color= '#510'
    

    constructor() {
        super()
        // this.serialize_widgets = true
        this.mode = LiteGraph.ALWAYS;     //设置触发模式
        // this.size = [80, 20];               //设置默认节点尺寸
        // this.addInput("触发", "number")   //增加一个输入触点，  输入触点的名称， 值类型
    //   this.addInput("B", "number")
        // this.addProperty("pageIndex", 0, 'number');   //增加一个变量，    变量名称， 变量名称
        // this.addWidget("number","页码", this.properties.pageIndex ,"pageIndex", {precision: 0});  //增加一个控件用于修改变量，  类型，显示名称，默认值，要修改的变量的名称)

        this.addInput("播放", LiteGraph.ACTION);
        this.addInput("停止", LiteGraph.ACTION);
        this.addInput("字幕", 'array');

        this.addOutput("结束",    LiteGraph.EVENT)   //增加一个输出触点，  输出节点的名称， 值类型
        this.addOutput("是否结束", 'boolean') 

        this.addProperty("modal", "自定义", 'string');
        this.addWidget('combo', '选择音频', this.properties.modal, {property: "modal", values: sound.modalEnum })

        this.addProperty("customeName", "", 'string');
        this.addWidget("string", '资源', this.properties.customeName, "customeName");

        //当音轨为0时不限制播放，其它音轨同一时间只有一个音频在播放
        this.addProperty("yinggui", '无', 'enum');
        this.addWidget('combo', '选择音轨', this.properties.yinggui,  {property: "yinggui", values: ['无', 'A', 'B', 'C', 'D', 'E', 'F', 'G'] });

        this.addProperty("loop", false, "boolean");
        this.addWidget("toggle", '是否循环', this.properties.loop, "loop");

       

        this.addProperty("volume", 0.5, "number");
        this.addWidget("slider", '音量', this.properties.volume, "volume", {min: 0, max: 1, precision: 2, step2: 0.01});

        this.addProperty('autoRun', false, 'boolean')
        this.addWidget('toggle', '是否自动播放', this.properties.autoRun, 'autoRun')

        this.addProperty('delayTime', 0, 'number')
        this.addWidget('number', '延迟几秒播放', this.properties.delayTime, 'delayTime')

        this.addProperty('duration', 0, 'number')
        let durationWidget = this.addWidget('number', '音频时长', this.properties.duration, 'duration')
        durationWidget.disabled = true  //不可以修改


        this.addWidget('button','', "", (btnWidget)=>{
            console.log('btnWidget', btnWidget.clickeName)
            if(btnWidget.clickeName != ''){
                this.onAction(btnWidget.clickeName)
            }
        }, {buttons: ['播放', '停止']})


        this.addProperty('motionTextData', [], 'array')
        this.addWidget('button','编辑字幕', "", ()=>{
            if(window.onGraphMenuClick != null){
                window.onGraphMenuClick('editSoundText', {customeName: this.properties.customeName, motionTextData: this.properties.motionTextData, id: this.getIdWithGraph(), onValueChange: (data)=>{
                    // this.setProperty('motionTextData', data)
                    console.log('返回的data',data)
                    // 点击这里其实是创建字幕，如果没有的话
                    if(this.getInputNode(2) == null){
                        let emptyNode = LiteGraph.createNode('objects/createObject')
                        emptyNode.pos = [this.pos[0] -  30, this.pos[1]]
                        
                        emptyNode.setProperty('zIndex', 996)
                        emptyNode.setProperty('x', 0)
                        emptyNode.setProperty('y', 0)
                        this.graph.add(emptyNode)
                        let textGroup = LiteGraph.createNode('objects/textGroup')
                        textGroup.pos = [this.pos[0] - 10, this.pos[1]]
                        this.graph.add(textGroup)
                        
                        for(var i = 0; i < data.length; i++){
                            textGroup.addLine()
                            textGroup.setProperty('text' + (i + 1), data[i].text)
                        }
                        emptyNode.connect(0, textGroup, 0)
                        textGroup.connect(0, this, 2)
                        textGroup.freshTexts(data)
                        if(window.onGraphMenuClick != null){
                            this.graph.setDirtyCanvas(true, true)
                            window.onGraphMenuClick('layoutNodesJustX')
                        }
                    }else{
                        //如果当前已经绑定了，动态增加或删除
                        let textGroup = this.getInputNode(2)
                        while(textGroup.properties.linesNum != 0){
                            textGroup.removeLine()
                        }
                        for(var i = 0; i < data.length; i++){
                            textGroup.addLine()
                            textGroup.setProperty('text' + (i + 1), data[i].text)
                        }
                        textGroup.freshTexts(data)
                    }
                }})
            }
        })

        //设置节点的进度，一般来说用于在执行的时候设置
        //  this.serialize_widgets = true; //widget的值是否也可以被序列化，weidget值和Property中的值不是绑定的，如果初始时不一致，就会出现weidget显示的不是真实的值，所以建议绑定
        // this.widgets_up = true;                                    //设置输入组件在顶部（覆盖input和output）
        //   this.properties.precision = 1
        // this.inputs[0].link != -
    }

    onPropertyChanged(property, value){
        if(property == 'customeName'){
            var path = value
            // if(this.properties.modal != '自定义'){
            //     path = this.properties.modal + '.mp3'
            // }
            this.clip = null
            cc.assetManager.loadRemote(CocosMgr.rootHost + '/' + path, (err, clip)=>{
                if(err != null){
                    console.warn('加载音频失败', err)
                    return
                }
                // console.log('加载出来的clip', clip)
                this.clip = clip
                this.setProperty('duration',clip.duration)
            })
        }else if(property == 'modal'){
            if(value != '自定义'){
                this.setProperty('customeName', sound.modalDit[value])
            }
        }
    }

    onStart(){
        // 部分声音在开始前播放了，但开始的时候又把audio变成空了，导致翻页声音还在，注意不需要在开始前播放，同时将初始化操作滞空
        // this.audioID = null
        // console.log('sound onStart', this.properties.customeName)
        // this.clip = null
        if(this.properties.motionTextData != null){
            if(this.properties.motionTextData.length > 0){
                let textGroup = this.getInputNode(2)
                if(textGroup != null){
                    textGroup.freshTexts(this.properties.motionTextData)
                }
            }
        }
        if(this.properties.autoRun){
            this.onAction('播放')
        }
    }

    onPause(){
        if(this.audioID != null){
            cc.audioEngine.pause(this.audioID)
        }
    }

    onResume(){
        if(this.audioID != null){
            cc.audioEngine.resume(this.audioID)
        }
    }

    getTitle() {
        if (this.flags.collapsed) {
            return "播放音频." + this.properties.customeName.split('.')[0];
        }
        return this.title;
    };

    onConfigure(){
        this.updateWidght()
    }

    updateWidght(){
      var value = this.properties.modal
      this.widgets.map((widget)=>{
        if(widget.name == '资源'){
            widget.disabled = value != '自定义'
        }
      })
    }

    onWidgetChanged(name){
        if(name == '选择音频'){
          this.updateWidght()
        }
    }

    onStop(){
        this.onAction('停止')
    }

    //开始播放
    realPlayAudio(){
        let yinggui = this.properties.yinggui
        let audioArray = this.graph.config.audioArray

        let volume =  this.properties.volume
        if(this.graph.config.mute == true){
            //静音模式所有音频声音为0
            volume = 0
        }
        
        var path = this.properties.customeName
        // if(this.properties.modal != '自定义'){
        //     path = this.properties.modal + '.mp3'
        // }
        console.log('准备播放音频', path)
        if(this.clip == null){
            cc.assetManager.loadRemote(CocosMgr.rootHost + '/' + path, (err, clip)=>{
                if(err != null){
                    console.warn('加载音频失败', err)
                    return
                }
                if(yinggui != '无'){
                    if(audioArray[yinggui] != this.getIdWithGraph()){
                        return
                    }
                }
                clip.addRef()
                // console.log('音频加载成功', path, volume, clip._name, clip.duration, clip.loaded, clip) //
                this.clip = clip
                var audioID = cc.audioEngine.play(clip, this.properties.loop, volume);
                if(this.audioID != null){
                    cc.audioEngine.stop(this.audioID)
                }
                this.audioID = audioID
                // console.log('我播放音频2', this.audioID, yinggui, this.properties.customeName)
                cc.audioEngine.setFinishCallback(this.audioID, () => {
                    this.triggerSlot(0)
                    this.setOutputData(1, true)
                    if(this.playEndCb != null){
                        this.playEndCb()
                    }
                });
            })
        }else{
            // console.log('已经加载了音频可以直接播放', this.clip)
            if(yinggui != '无'){
                if(audioArray[yinggui] != this.getIdWithGraph()){
                    return
                }
            }
            var audioID = cc.audioEngine.play(this.clip, this.properties.loop, volume);
            if(this.audioID != null){
                cc.audioEngine.stop(this.audioID)
            }
            this.audioID = audioID
            // console.log('我播放音频3', this.audioID, yinggui, this.properties.customeName)
            cc.audioEngine.setFinishCallback(this.audioID, () => {
                this.triggerSlot(0)
                this.setOutputData(1, true)
                if(this.playEndCb != null){
                    this.playEndCb()
                }
            });
        }
    }
  
    // 当节点Toggle时调用
    onAction(action, param)
	{
       let yinggui = this.properties.yinggui
       let audioArray = this.graph.config.audioArray
       //console.log('audioArray 是否 为空', audioArray, audioArray == null, audioArray == undefined)
       if(audioArray == undefined){
            this.graph.config.audioArray = {}
            audioArray = this.graph.config.audioArray
       }
       if(action == '播放'){
            //播放前要先停止音频
            this.onAction('停止')
            let textGroupNode = this.getInputNode(2)
            if(textGroupNode != null){
                if(textGroupNode.properties.showInPageBottom == true){
                    if(CocosMgr.isInApp){
                        //通知StoryView页面结束了
                        EventCenter.emit(EventConst.OnPlayReadText, this.properties.motionTextData)
                    }
                }else{
                    textGroupNode.onAction('播放')
                }
            }
            //不管有没有延迟都要先设置音轨，逻辑已经执行了
            if(yinggui != '无'){
                var curYingui = audioArray[yinggui]
                if(curYingui != null){
                    curYingui = this.graph.getNodeById(curYingui)
                    if(curYingui != null){
                        curYingui.onAction('停止')
                    }
                }
                audioArray[yinggui] = this.getIdWithGraph()
                console.log('设置音轨播放的id', yinggui, this.getIdWithGraph())
            }

            this.setOutputData(1, false)
            // console.log('我设置isSoundEnd',false)
            if(this.properties.delayTime > 0){
                this.curWaitTime = this.properties.delayTime
                this.mode = LiteGraph.ALWAYS;
            }else{
                this.realPlayAudio()
            }
       }else if(action == '停止'){
            let textGroupNode = this.getInputNode(2)
            if(textGroupNode != null){
                if(textGroupNode.properties.showInPageBottom == true){
                    if(CocosMgr.isInApp){
                        //通知StoryView页面结束了
                        EventCenter.emit(EventConst.OnHideReadText)
                    }
                }else{
                    textGroupNode.onAction('停止')
                }
            }
            if(audioArray[yinggui] == this.getIdWithGraph()){
                audioArray[yinggui] = null
            }
            if(this.audioID != null){
                // console.log('我收到了停止播放音频', this.audioID, yinggui, this.properties.customeName)
                cc.audioEngine.stop(this.audioID)
            }
            if(this.clip != null){
                this.clip.decRef()
                this.clip = null
            }
            this.audioID = null
            this.curWaitTime = null
       }
	}

    onExecute(){
        if(this.curWaitTime != null){
            var dt = this.graph.elapsed_time //in ms
            // console.log('dt', dt)
            this.curWaitTime -= dt
            if(this.curWaitTime <= 0){
                // console.log('延迟结束播放了声音', this.curWaitTime)
                this.curWaitTime = null
                this.realPlayAudio()
            }
        }
    }
}

sound.title = '播放音频'
sound.modalEnum = ['自定义','胜利', '开始', '正确', '错误']
sound.modalDit = {'胜利': 'WIN.d434ffea.mp3', '错误': '错误.4893a3c2.mp3', '开始': 'readygo.a873eb49.mp3', '正确': 'dinlin.1ac6169b.mp3'}
LiteGraph.registerNodeType("output/sound", sound);


class textToSound extends LGraphNode {
    // Name to show
    title = "文本转音频"
    desc = "接入文本生成音频接口实现文本生成配音";   //不会在显示节点中用到，仅仅在代码中的解释
    // color= '#510'
    

    constructor() {
        super()
        // this.serialize_widgets = true
        this.mode = LiteGraph.ON_EVENT;     //设置触发模式
        // this.size = [80, 20];               //设置默认节点尺寸
        // this.addInput("触发", "number")   //增加一个输入触点，  输入触点的名称， 值类型
    //   this.addInput("B", "number")
        // this.addProperty("pageIndex", 0, 'number');   //增加一个变量，    变量名称， 变量名称
        // this.addWidget("number","页码", this.properties.pageIndex ,"pageIndex", {precision: 0});  //增加一个控件用于修改变量，  类型，显示名称，默认值，要修改的变量的名称)

        // this.addInput("震动", LiteGraph.ACTION);

        this.addProperty("text", "今天天气真不错"); 
        this.addWidget("text","文本", this.properties.text ,"text");

        this.addProperty("soundName", "xunfei"); 
        this.addWidget("text","命名", this.properties.soundName, "soundName");

        this.addProperty("peopleSound", textToSound.peopleSounds[1], 'enum'); 
        this.widget = this.addWidget("combo","音色", this.properties.peopleSound, {property: 'peopleSound', values: textToSound.peopleSounds}); //{'小明': 'xm', '塔塔': 'tata'}

        this.addProperty("speed", 50, 'number'); 
        this.addWidget("slider","语速", this.properties.speed ,"speed", {precision: 0, min: 0, max: 100}); 

        this.addProperty("volume", 50, 'number'); 
        this.addWidget("slider","音量", this.properties.volume ,"volume", {precision: 0, min: 0, max: 100}); 

        this.addProperty("pitch", 50, 'number'); 
        this.addWidget("slider","语调", this.properties.pitch ,"pitch", {precision: 0, min: 0, max: 100}); 

        this.addProperty('bgs', false, 'boolean')
        this.addWidget('toggle', '背景音', this.properties.bgs, 'bgs')

        this.btnWidget = this.addWidget('button','生成音频', "", async ()=>{
            // console.log('生成音频资源', this.properties.text, )
            let soundPeople = textToSound.peopleSoundDit[this.properties.peopleSound]
            this.btnWidget.disabled = true
            let soundBlob = await VoiceGen.genSound({
                text: this.properties.text,
                vcn: soundPeople,
                speed: this.properties.speed,  //语速：0对应默认语速的1/2，100对应默认语速的2倍
                volume: this.properties.volume, //音量：0是静音，1对应默认音量1/2，100对应默认音量的2倍
                pitch: this.properties.pitch, //语调：0对应默认语调的1/2，100对应默认语调的2倍
                bgs: this.properties.bgs == true ? 1 : 0,     //是否有背景音，背景音：0无背景音（默认值），1有背景音
            })
            this.btnWidget.disabled = false
            if(window.uploadGroupFile != null){
                //上传文件到云端
                // window.setDropXY(this.pos[0] + this.width + 3, this.pos[1])
                window.uploadGroupFile([{files: [soundBlob], type: 'mp3', name: this.properties.soundName, x: this.pos[0] + this.width + 3, y: this.pos[1]}])
            }
        })

       

        this.setSize(this.computeSize())
        // this.addProperty("modal", 0, "number");
        // this.addWidget("slider", '振动强度', this.properties.modal, "modal", {min: 0, max: 1, precision: 0});

            //设置节点的进度，一般来说用于在执行的时候设置
        //  this.serialize_widgets = true; //widget的值是否也可以被序列化，weidget值和Property中的值不是绑定的，如果初始时不一致，就会出现weidget显示的不是真实的值，所以建议绑定
        // this.widgets_up = true;                                    //设置输入组件在顶部（覆盖input和output）
    //   this.properties.precision = 1
        
    }

  
    // 当节点Toggle时调用
    onAction(action, param)
	{
       if(action == '生成'){
          
       }
	}
}

textToSound.title = '文本转音频'
textToSound.peopleSounds = ['聆飞逸', '聆小璇', '聆小玥', '聆玉昭', '聆玉言', '动漫少女']
textToSound.peopleSoundDit = {
    '聆飞逸': 'x5_lingfeiyi_flow',
    '聆小璇': 'x5_lingxiaoxuan_flow',
    '聆小玥': 'x5_lingxiaoyue_flow',
    '聆玉昭': 'x5_lingyuzhao_flow',
    '聆玉言': 'x5_lingyuyan_flow',
    '动漫少女': 'x6_dongmanshaonv_pro'
}
LiteGraph.registerNodeType("output/textToSound", textToSound);




class vibrate extends LGraphNode {
    // Name to show
    title = "震动"
    desc = "调用设备振动";   //不会在显示节点中用到，仅仅在代码中的解释
    // color= '#510'
    

    constructor() {
        super()
        // this.serialize_widgets = true
        this.mode = LiteGraph.ON_EVENT;     //设置触发模式
        this.size = [80, 20];               //设置默认节点尺寸
        // this.addInput("触发", "number")   //增加一个输入触点，  输入触点的名称， 值类型
    //   this.addInput("B", "number")
        // this.addProperty("pageIndex", 0, 'number');   //增加一个变量，    变量名称， 变量名称
        // this.addWidget("number","页码", this.properties.pageIndex ,"pageIndex", {precision: 0});  //增加一个控件用于修改变量，  类型，显示名称，默认值，要修改的变量的名称)

        this.addInput("震动", LiteGraph.ACTION);


        this.addProperty("modal", 0, "number");
        this.addWidget("slider", '振动强度', this.properties.modal, "modal", {min: 0, max: 1, precision: 0});

            //设置节点的进度，一般来说用于在执行的时候设置
        //  this.serialize_widgets = true; //widget的值是否也可以被序列化，weidget值和Property中的值不是绑定的，如果初始时不一致，就会出现weidget显示的不是真实的值，所以建议绑定
        // this.widgets_up = true;                                    //设置输入组件在顶部（覆盖input和output）
    //   this.properties.precision = 1
    }

  
    // 当节点Toggle时调用
    onAction(action, param)
	{
       if(action == '震动'){
           if(this.properties.modal < 0.5){
                CocosMgr.vibrate(false)
           }else{
                CocosMgr.vibrate(true)
           }
       }
	}
}

vibrate.title = '震动'
LiteGraph.registerNodeType("output/vibrate", vibrate);



class stopTime extends LGraphNode {
    // Name to show
    title = "停止时间"
    desc = "暂停游戏时间";   //不会在显示节点中用到，仅仅在代码中的解释
    // color= '#510'
    

    constructor() {
        super()
        // this.serialize_widgets = true
        this.mode = LiteGraph.ON_EVENT;     //设置触发模式
        this.size = [80, 30];               //设置默认节点尺寸
        // this.addInput("触发", "number")   //增加一个输入触点，  输入触点的名称， 值类型
    //   this.addInput("B", "number")
        // this.addProperty("pageIndex", 0, 'number');   //增加一个变量，    变量名称， 变量名称
        // this.addWidget("number","页码", this.properties.pageIndex ,"pageIndex", {precision: 0});  //增加一个控件用于修改变量，  类型，显示名称，默认值，要修改的变量的名称)

        this.addInput("停止", LiteGraph.ACTION);
        this.addInput("恢复", LiteGraph.ACTION);


        // this.addProperty("modal", 0, "number");
        // this.addWidget("slider", '振动强度', this.properties.modal, "modal", {min: 0, max: 1, precision: 0});

            //设置节点的进度，一般来说用于在执行的时候设置
        //  this.serialize_widgets = true; //widget的值是否也可以被序列化，weidget值和Property中的值不是绑定的，如果初始时不一致，就会出现weidget显示的不是真实的值，所以建议绑定
        // this.widgets_up = true;                                    //设置输入组件在顶部（覆盖input和output）
    //   this.properties.precision = 1
    }

  
    // 当节点Toggle时调用
    onAction(action, param)
	{
       if(action == '停止'){
            this.graph.pause()
       }else if(action == '恢复'){
            this.graph.resume()
       }
	}
}

stopTime.title = '停止时间'
LiteGraph.registerNodeType("output/time/stopTime", stopTime);


class timeScale extends LGraphNode {
    // Name to show
    title = "时间缩放"
    desc = "加速或减慢时间效果";   //不会在显示节点中用到，仅仅在代码中的解释
    // color= '#510'
    

    constructor() {
        super()
        // this.serialize_widgets = true
        this.mode = LiteGraph.ON_EVENT;     //设置触发模式
        this.size = [80, 20];               //设置默认节点尺寸
        // this.addInput("触发", "number")   //增加一个输入触点，  输入触点的名称， 值类型
        
        this.addInput("scale", "number")
        this.addProperty("scale", 1, 'number');   //增加一个变量，    变量名称， 变量名称
        this.addWidget("number","缩放倍数", this.properties.scale ,"scale", {precision: 1, min: 0});  //增加一个控件用于修改变量，  类型，显示名称，默认值，要修改的变量的名称)

        this.addInput("修改", LiteGraph.ACTION);


        // this.addProperty("modal", 0, "number");
        // this.addWidget("slider", '振动强度', this.properties.modal, "modal", {min: 0, max: 1, precision: 0});

            //设置节点的进度，一般来说用于在执行的时候设置
        //  this.serialize_widgets = true; //widget的值是否也可以被序列化，weidget值和Property中的值不是绑定的，如果初始时不一致，就会出现weidget显示的不是真实的值，所以建议绑定
        this.widgets_up = true;                                    //设置输入组件在顶部（覆盖input和output）
    //   this.properties.precision = 1
    }

  
    // 当节点Toggle时调用
    onAction(action, param)
	{
       if(action == '修改'){
            let scale = this.properties.scale || 1
            if(scale < 0){
                scale = 1
            }
            this.graph.config.timeScale = scale
            this.graph.sendEventToAllNodes('onChangeTimeScale')
       }
	}
}

timeScale.title = '时间缩放'
LiteGraph.registerNodeType("output/time/timeScale", timeScale);





class autoRunRecordTouch extends LGraphNode {
    // Name to show
    title = "自动点击"
    desc = "自动执行点击事件";   //不会在显示节点中用到，仅仅在代码中的解释
    // color= '#510'
    

    constructor() {
        super()
        // this.serialize_widgets = true
        // this.mode = LiteGraph;     //设置触发模式
        this.size = [80, 20];               //设置默认节点尺寸
        // this.addInput("触发", "number")   //增加一个输入触点，  输入触点的名称， 值类型
        
        this.addProperty('active', false, 'boolean')
        this.addWidget('toggle', '是否激活', this.properties.active, 'active')
        this.addProperty('recordTouch', [], 'array')
        this.widgets_up = true;                                    //设置输入组件在顶部（覆盖input和output）
    //   this.properties.precision = 1
    // this.getOutputNodes(0)
    }

    onStart(){
        this.curRunStepIndex = -1
    }

    //开始执行
    onExecute(){
        if(this.properties.active == false){
            //不激活自动点击操作事件
            return
        }
        if(this.properties.recordTouch == null){
            return
        }
        let curTime = this.graph.getTime()
        if(this.properties.recordTouch[this.curRunStepIndex + 1] != null){
            if(curTime > this.properties.recordTouch[this.curRunStepIndex + 1].time){
                this.curRunStepIndex += 1
                let stepData = this.properties.recordTouch[this.curRunStepIndex]
                //{nodeId: this.getIdWithGraph(),  time: this.graph.getTime(), funcName: 'onClick'}
                let node = this.graph.getNodeById(stepData.nodeId)
                if(node != null){
                    if(node[stepData.funcName] != null){
                        node[stepData.funcName]()
                    }
                }
            }
        }
    }
}

autoRunRecordTouch.title = '自动点击'
LiteGraph.registerNodeType("output/autoRunRecordTouch", autoRunRecordTouch);






