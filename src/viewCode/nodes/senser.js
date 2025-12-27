// import { LinkDirection } from '@/litegraph/types/globalEnums'
import {LiteGraph, LGraphNode} from '../../litegraph/litegraph'
// import * as CocosMgr from '../CocosMgr';


class contact extends LGraphNode {
  // Name to show
  title = "接触感应器"
  desc = "检测物体相互接触"

  constructor() {
    super()
    // this.addProperty("time_in_ms", 1000);
    // this.serialize_widgets = true;
    // this.serialize_widgets = true;
    this.size = [250, 50]
    // let slot = this.addOutput("A", 'codeNode')
    // slot.dir = LinkDirection.DOWN
    // this.addOutput("B", 'codeNode')

    this.addInput("检测目标物体", 'codeNode')
    this.addInput("其它可接触物体", 'codeNode')

    this.getOutputNodes()
    // this.getInputNode()

    // cardacSolt:{index: 0, type: 'number', info: '等待检测对象'},

    // // this.addInput("触发",  LiteGraph.ACTION)
    // // this.addInput("减少",  LiteGraph.ACTION)
    // // this.addInput("重置",  LiteGraph.ACTION)

    // this.addOutput("key", 0)  
    // // this.addOutput("index", 'number') 
    // this.addOutput("value", 0)

    this.addOutput("接触数量", 'number')
    this.addOutput("最后接触物体", 'codeNode')

    this.addOutput("接触时", LiteGraph.EVENT)
    this.addOutput("离开时", LiteGraph.EVENT)
    
    // this.addProperty("开始值", 0, 'number');   //增加一个变量，    变量名称， 变量名称
    // this.addWidget("number","开始值", 0, "开始值", {precision: 0});

    // this.addProperty("modal", '无限制', 'enum', {values: ['无限制', '范围限制', '循环', '来回']});   //增加一个变量，    变量名称， 变量名称
    // this.addWidget("combo","模式",this.properties.modal,{ property: "modal", values:['无限制', '范围限制', '循环', '来回'] } );

    // this.addProperty("min", 1,  'number')
    // this.addWidget("number","最小值", 1, "min", {precision: 0});

    // this.addProperty("max", 10,  'number')
    // this.addWidget("number","最大值", 10, "max", {precision: 0});

    // this.addProperty("upStepmodal", '不乘以时间', 'enum', {values: ['乘以时间', '不乘以时间']});   //增加一个变量，    变量名称， 变量名称
    // this.addWidget("combo","步进模式",this.properties.upStepmodal,{ property: "upStepmodal", values:['乘以时间', '不乘以时间'] } );

    // this.addProperty("stepValue", 1,  'number')
    // this.addWidget("number","步进数值", 1, "stepValue", {precision: 0});
    
    // this.updateWidght()
    // this.progress = 0.5               //设置节点的进度，一般来说用于在执行的时候设置
    // 
    // this.properties.precision = 1
    this.curContactNum = 0
    this.bindTrackCodeNode = []

  }
  
    onGetInputs() {
        console.log('我调用了onGetOutputs')
        return [["其它可接触物体", "codeNode"]];
    };


//   onGetOutputs() {
//     console.log('我调用了onGetOutputs')
//     return [["number", "string"]];
//   };

  onStart(){
    // this.repetDir = 1
    // this.value = this.getInputOrProperty("开始值") | 0
    this.bindTrackCodeNode = []
    // let otherSolts = this.slots.filter((slot)=>{
    //     return slot.name == '其它可接触物体' && slot.link != null
    // })
    // let linkNodes = otherSolts.map((solt)=>{
    //     return this.graph.links.get(solt.link)
    // }).map((link)=>{
    //     return this.graph.getNodeById(link.origin_id)
    // })
    let linkCodeNodes = []
    for(var i = 1; i < this.inputs.length; i++){
        linkCodeNodes.push(this.getInputData(i))
        if(this.getInputData(i) != null){
            this.bindTrackCodeNode.push(this.getInputData(i))
        }
    }
    console.log('当前链接的solts', linkCodeNodes)
    // var bindChildRobot = this.linkDatas.cardacSolt
    // for(var i = 0; i < bindChildRobot.length; i++){
    //     var robot = bindChildRobot[i].robot
    //     if(robot.codeNode != null){
    //         this.bindTrackCodeNode.push(robot.codeNode)
    //     }
    // }
    this.onBindCodeNode(this.getInputData(0))
  }

  

  onBindCodeNode(codeNode){
    // this.addOutput("是否接触", 'number')
    // this.addOutput("接触对象", 'codeNode')
    console.log('开始监听接触对象', codeNode)
    if(this.codeNode != null){
        //如果有绑定旧的codeNode，先删除旧的codeNode绑定的id
        this.codeNode.removeRobotListener('contact',  this.getIdWithGraph())
        this.codeNode.removeRobotListener('uncontact',this.getIdWithGraph())
    }
    this.curContactNum = 0
    this.setOutputData(0, this.curContactNum)
    this.codeNode = codeNode
    if(codeNode == null){
        return
    }
    this.codeNode.addRobotListener('contact',this.getIdWithGraph(), (value)=>{
        // console.log('物体接触了', value, this.bindTrackCodeNode.indexOf(value))
        if(this.bindTrackCodeNode.indexOf(value) != -1){
            this.curContactNum += 1
            //会传送最后一个接触的对象
            this.setOutputData(0, this.curContactNum)
            this.setOutputData(1, value)
            this.triggerSlot(2) //接触对象时触发
        }
    })
    this.codeNode.addRobotListener('uncontact',this.getIdWithGraph(),(value)=>{
        if(this.bindTrackCodeNode.indexOf(value) != -1){
            this.curContactNum -= 1
            this.setOutputData(0, this.curContactNum)
            this.setOutputData(1, value)
            if(this.curContactNum <= 0){
                this.curContactNum = 0
                this.triggerSlot(3) //离开所有接触对象
            }
        }
    })
  }

  onStop(){
    console.log('移除监听事件', this.codeNode, this.getIdWithGraph())
    if(this.codeNode != null){
        //如果有绑定旧的codeNode，先删除旧的codeNode绑定的id
        this.codeNode.removeRobotListener('contact',  this.getIdWithGraph())
        this.codeNode.removeRobotListener('uncontact',this.getIdWithGraph())
    }
  }

  // updateWidght(){
  //   var value = this.properties.modal
  //   if(value != '无限制'){
  //       this.widgets.map((widget)=>{
  //         if(widget.name == '最大值' || widget.name == '最小值'){
  //             widget.disabled = false
  //         }
  //       })
  //     }else{
  //       this.widgets.map((widget)=>{
  //         if(widget.name == '最大值' || widget.name == '最小值'){
  //             widget.disabled = true
  //         }
  //       })
  //     }
  // }

  // onWidgetChanged(name, value, old_value, widget){
  //   // console.log('onWidgetChanged', node, name, value, old_value)
  //   // this.isWidgetVisible
  //   if(name == '模式'){
  //       this.updateWidght()
  //   }
  // }

  // Function to call when the node is executed
  // onAction(action, param, options) {
    
  // };

//   onExecute() {
    // var data = this.getInputData(0)
    // if(data !== undefined){
    //   if(data instanceof Array){
    //     for(var i = 0; i < data.length; i++){
    //       this.setOutputData(0, i)
    //       this.setOutputData(1, data[i])
    //       this.triggerSlot(2)
    //     }
    //   }else if(data instanceof Object){
    //     for(var key in data){
    //       this.setOutputData(0, key)
    //       this.setOutputData(1, data[key])
    //       this.triggerSlot(2)
    //     }
    //   }
    // }
//   }
}

contact.title = '接触感应器'
// Register the node type
LiteGraph.registerNodeType("objects/objectSensor/contact", contact)





class position extends LGraphNode {
  // Name to show
  title = "位置感应器"
  desc = "检测物体位置变化"

  constructor() {
    super()
    // this.addProperty("time_in_ms", 1000);
    // this.serialize_widgets = true;
    // this.serialize_widgets = true;
    this.size = [250, 50]
    this.mode = LiteGraph.ON_EVENT; 
    // let slot = this.addOutput("A", 'codeNode')
    // slot.dir = LinkDirection.DOWN
    // this.addOutput("B", 'codeNode')

    this.addInput("目标物体", 'codeNode')
    
    this.addInput("修改x", 'number')
    this.addInput("修改y", 'number')

    this.addInput("触发", LiteGraph.ACTION)
    

    // this.addInput("其它可接触物体", 'codeNode')

    // this.getOutputNodes()
    // this.getInputNode()

    // cardacSolt:{index: 0, type: 'number', info: '等待检测对象'},

    // // this.addInput("触发",  LiteGraph.ACTION)
    // // this.addInput("减少",  LiteGraph.ACTION)
    // // this.addInput("重置",  LiteGraph.ACTION)

    // this.addOutput("key", 0)  
    this.addOutput("x", 'number') 
    this.addOutput("y", 'number')
    this.addOutput("变化", LiteGraph.EVENT)
    // this.addOutput("value", 0)

    // this.addOutput("是否接触", 'number')
    // this.addOutput("接触对象", 'codeNode')

    // this.addOutput("接触时", LiteGraph.EVENT)
    // this.addOutput("离开时", LiteGraph.EVENT)
    
    this.addProperty("xRange", '[-999999, 999999]', 'text');   //增加一个变量，    变量名称， 变量名称
    // this.addWidget("number","x范围", 0, "xRange", {precision: 0});
    this.xRangeWidget = this.addWidget("text","x范围",this.properties.xRange,"xRange");

    this.addProperty("yRange", '[-999999, 999999]', 'text');   //增加一个变量，    变量名称， 变量名称
    this.yRangeWidget = this.addWidget("text","y范围",this.properties.yRange,"yRange");
    // this.addWidget("number","y范围", 0, "yRange", {precision: 0});


    // this.addProperty("yRange", 0, 'number');   //增加一个变量，    变量名称， 变量名称
    // this.addWidget("number","y范围", 0, "yRange", {precision: 0});
    // this.addProperty("modal", '无限制', 'enum', {values: ['无限制', '范围限制', '循环', '来回']});   //增加一个变量，    变量名称， 变量名称
    // this.addWidget("combo","模式",this.properties.modal,{ property: "modal", values:['无限制', '范围限制', '循环', '来回'] } );

    // this.addProperty("min", 1,  'number')
    // this.addWidget("number","最小值", 1, "min", {precision: 0});

    // this.addProperty("max", 10,  'number')
    // this.addWidget("number","最大值", 10, "max", {precision: 0});

    this.addProperty("modal", '直接修改', 'enum', {values: ['直接修改', '增量修改']});   //增加一个变量，    变量名称， 变量名称
    this.addWidget("combo","修改方式", this.properties.modal,{ property: "modal", values:['直接修改', '增量修改'] } );

    // this.addProperty("stepValue", 1,  'number')
    // this.addWidget("number","步进数值", 1, "stepValue", {precision: 0});
    
    this.addProperty('rangeWithSize', false, 'boolean')
    this.addWidget('toggle', '范围包含节点尺寸', this.properties.rangeWithSize, 'resetWhenToggle')



    // this.updateWidght()
    // this.progress = 0.5               //设置节点的进度，一般来说用于在执行的时候设置
    // 
    // this.properties.precision = 1
    // this.curContactNum = 0
    // this.bindTrackCodeNode = []

  }

    onPropertyChanged(name, value) {
        // console.log("onPropertyChanged", name, value)
        if(name == 'xRange' || name == 'yRange'){
            try {
                this['_' + name] = JSON.parse(value)
                this.boxcolor = "#AEA";
            } catch (err) {
                this.boxcolor = "red";
            }
        }
    };
  
    // onGetInputs() {
    //     console.log('我调用了onGetOutputs')
    //     return [["其它可接触物体", "codeNode"]];
    // };


//   onGetOutputs() {
//     console.log('我调用了onGetOutputs')
//     return [["number", "string"]];
//   };

  onStart(){
    this._xRange = JSON.parse(this.properties.xRange)
    this._yRange = JSON.parse(this.properties.yRange)
    // this.repetDir = 1
    // this.value = this.getInputOrProperty("开始值") | 0
    // this.bindTrackCodeNode = []
    // let otherSolts = this.slots.filter((slot)=>{
    //     return slot.name == '其它可接触物体' && slot.link != null
    // })
    // let linkNodes = otherSolts.map((solt)=>{
    //     return this.graph.links.get(solt.link)
    // }).map((link)=>{
    //     return this.graph.getNodeById(link.origin_id)
    // })
    // let linkCodeNodes = []
    // for(var i = 1; i < this.inputs.length; i++){
    //     linkCodeNodes.push(this.getInputData(i))
    //     if(this.getInputData(i) != null){
    //         this.bindTrackCodeNode.push(this.getInputData(i))
    //     }
    // }
    // console.log('当前链接的solts', linkCodeNodes)
    // var bindChildRobot = this.linkDatas.cardacSolt
    // for(var i = 0; i < bindChildRobot.length; i++){
    //     var robot = bindChildRobot[i].robot
    //     if(robot.codeNode != null){
    //         this.bindTrackCodeNode.push(robot.codeNode)
    //     }
    // }
    this.onBindCodeNode(this.getInputData(0))
  }

  
  onBindCodeNode(codeNode){
    // this.addOutput("是否接触", 'number')
    // this.addOutput("接触对象", 'codeNode')
    // console.log('开始监听接触对象', codeNode)
    if(this.codeNode != null){
        //如果有绑定旧的codeNode，先删除旧的codeNode绑定的id
        this.codeNode.removeRobotListener('x', this.getIdWithGraph())
        this.codeNode.removeRobotListener('y', this.getIdWithGraph())
    }
    this.codeNode = codeNode
    if(codeNode == null){
        return
    }
    this.codeNode.addRobotListener('x',this.getIdWithGraph(),(value)=>{
        this.setOutputData(0, value)
        this.triggerSlot(2)
    })
    this.codeNode.addRobotListener('y',this.getIdWithGraph(),(value)=>{
        this.setOutputData(1, value)
        this.triggerSlot(2)
    })
  }

  onStop(){
    this.codeNode = null
  }

  // updateWidght(){
  //   var value = this.properties.modal
  //   if(value != '无限制'){
  //       this.widgets.map((widget)=>{
  //         if(widget.name == '最大值' || widget.name == '最小值'){
  //             widget.disabled = false
  //         }
  //       })
  //     }else{
  //       this.widgets.map((widget)=>{
  //         if(widget.name == '最大值' || widget.name == '最小值'){
  //             widget.disabled = true
  //         }
  //       })
  //     }
  // }

  // onWidgetChanged(name, value, old_value, widget){
  //   // console.log('onWidgetChanged', node, name, value, old_value)
  //   // this.isWidgetVisible
  //   if(name == '模式'){
  //       this.updateWidght()
  //   }
  // }

  // Function to call when the node is executed
  // onAction(action, param, options) {
    
  // };
  //触发模式来更新
  onAction() {
    if(this.codeNode == null){
        return
    }
    let x = this.getInputData(1)
    let y = this.getInputData(2)

    let xRange = this._xRange
    let yRange = this._yRange
    // console.log('x', x, xRange)
    
    if(x != null){
        if(this.properties.rangeWithSize == true){
            var addWidth = this.codeNode.anchorX * this.codeNode.width * Math.abs(this.codeNode.scaleX)
            // console.log('addWith', addWidth, xRange[0], this.codeNode.anchorX, this.codeNode.width, this.codeNode.scaleX)
            xRange = [xRange[0] + addWidth, xRange[1] - addWidth]
            //当目标物体的宽高小于父节点的宽高，这样子是正常的
            if(xRange[1] < xRange[0]){
                xRange[1] = xRange[1] + xRange[0]
                xRange[0] = xRange[1] - xRange[0]
                xRange[1] = xRange[1] - xRange[0]
            }
            // console.log('xRange new', xRange[0], xRange[1])
            //当目标物体的宽高大于父节点的宽高，这样子就不正常了
        }
        if(this.properties.modal == '增量修改'){
            if(this.codeNode.realX + x >= xRange[1]){
                x = xRange[1] - this.codeNode.realX
            }else if(this.codeNode.realX + x <= xRange[0]){
                x = xRange[0] - this.codeNode.realX
            }
            this.codeNode.realX = this.codeNode.realX + x
        }else{
            if(x > xRange[1]){
                x = xRange[1]
            }
            if(x < xRange[0]){
                x = xRange[0]
            }
            this.codeNode.realX = x
            // console.log('直接修改数值', x)
        }
    }

    if(y != null){
        //修改y轴相关
        if(this.properties.rangeWithSize == true){
            var addHeight = this.codeNode.anchorY * this.codeNode.height * Math.abs(this.codeNode.scaleY)
            yRange = [yRange[0] + addHeight, yRange[1] - addHeight]
            if(yRange[1] < yRange[0]){
                yRange[1] = yRange[1] + yRange[0]
                yRange[0] = yRange[1] - yRange[0]
                yRange[1] = yRange[1] - yRange[0]
            }
        }
        if(this.properties.modal == '增量修改'){
            if(this.codeNode.realY + y >= yRange[1]){
                y = yRange[1] - this.codeNode.realY 
            }else if(this.codeNode.realY + y <= yRange[0]){
                y = yRange[0] - this.codeNode.realY
            }
            this.codeNode.realY = this.codeNode.realY + y
        }else{
            if(y > yRange[1]){
                y = yRange[1]
            }
            if(y < yRange[0]){
                y = yRange[0]
            }
            this.codeNode.realY = y
        }
    }
    
  }
}

position.title = '位置感应器'
// Register the node type
LiteGraph.registerNodeType("objects/objectSensor/position", position)



class publicListen extends LGraphNode {
  // Name to show
  title = "属性感应器"
  desc = "检测物体各种属性变化"

  constructor() {
    super()
    // this.addProperty("time_in_ms", 1000);
    // this.serialize_widgets = true;
    // this.serialize_widgets = true;
    // this.size = [250, 50]
    this.mode = LiteGraph.ON_EVENT; 
    // let slot = this.addOutput("A", 'codeNode')
    // slot.dir = LinkDirection.DOWN
    // this.addOutput("B", 'codeNode')

    this.addInput("目标物体", 'codeNode')
    
    this.addInput("修改值", 'number')

    this.addInput("触发", LiteGraph.ACTION)
    

    // this.addInput("其它可接触物体", 'codeNode')

    // this.getOutputNodes()
    // this.getInputNode()

    // cardacSolt:{index: 0, type: 'number', info: '等待检测对象'},

    // // this.addInput("触发",  LiteGraph.ACTION)
    // // this.addInput("减少",  LiteGraph.ACTION)
    // // this.addInput("重置",  LiteGraph.ACTION)

    // this.addOutput("key", 0)  
    this.addOutput("数值", 'number') 
    this.addOutput("变化", LiteGraph.EVENT)
    // this.addOutput("value", 0)

    // this.addOutput("是否接触", 'number')
    // this.addOutput("接触对象", 'codeNode')

    // this.addOutput("接触时", LiteGraph.EVENT)
    // this.addOutput("离开时", LiteGraph.EVENT)
    
    this.addProperty("range", '[-999999, 999999]', 'text');   //增加一个变量，    变量名称， 变量名称
    // this.addWidget("number","范围", 0, "range", {precision: 0});
    this.rangeWidget = this.addWidget("text","范围",this.properties.range,"range");

    // this.addProperty("yRange", '[-999999, 999999]', 'text');   //增加一个变量，    变量名称， 变量名称
    // this.yRangeWidget = this.addWidget("text","y范围",this.properties.yRange,"yRange");
    // this.addWidget("number","y范围", 0, "yRange", {precision: 0});


    // this.addProperty("yRange", 0, 'number');   //增加一个变量，    变量名称， 变量名称
    // this.addWidget("number","y范围", 0, "yRange", {precision: 0});
    this.addProperty("customKey", '透明度', 'enum', {values: publicListen.selectEnums});   //增加一个变量，    变量名称， 变量名称
    this.addWidget("combo","监听信息",this.properties.customKey,{ property: "customKey", values:publicListen.selectEnums } );

    // this.addProperty("min", 1,  'number')
    // this.addWidget("number","最小值", 1, "min", {precision: 0});

    // this.addProperty("max", 10,  'number')
    // this.addWidget("number","最大值", 10, "max", {precision: 0});

    this.addProperty("modal", '直接修改', 'enum', {values: ['直接修改', '增量修改']});   //增加一个变量，    变量名称， 变量名称
    this.addWidget("combo","修改方式", this.properties.modal,{ property: "modal", values:['直接修改', '增量修改'] } );

    // this.addProperty("stepValue", 1,  'number')
    // this.addWidget("number","步进数值", 1, "stepValue", {precision: 0});
    
    // this.addProperty('rangeWithSize', false, 'boolean')
    // this.addWidget('toggle', '范围包含节点尺寸', this.properties.rangeWithSize, 'resetWhenToggle')



    // this.updateWidght()
    // this.progress = 0.5               //设置节点的进度，一般来说用于在执行的时候设置
    // 
    // this.properties.precision = 1
    // this.curContactNum = 0
    // this.bindTrackCodeNode = []

  }

    onPropertyChanged(name, value) {
        // console.log("onPropertyChanged", name, value)
        if(name == 'range'){
            try {
                this['_' + name] = JSON.parse(value)
                this.boxcolor = "#AEA";
            } catch (err) {
                this.boxcolor = "red";
            }
        }
    };
  
    // onGetInputs() {
    //     console.log('我调用了onGetOutputs')
    //     return [["其它可接触物体", "codeNode"]];
    // };


//   onGetOutputs() {
//     console.log('我调用了onGetOutputs')
//     return [["number", "string"]];
//   };

  onStart(){
    this._range = JSON.parse(this.properties.range)
    // this._yRange = JSON.parse(this.properties.yRange)
    // this.repetDir = 1
    // this.value = this.getInputOrProperty("开始值") | 0
    // this.bindTrackCodeNode = []
    // let otherSolts = this.slots.filter((slot)=>{
    //     return slot.name == '其它可接触物体' && slot.link != null
    // })
    // let linkNodes = otherSolts.map((solt)=>{
    //     return this.graph.links.get(solt.link)
    // }).map((link)=>{
    //     return this.graph.getNodeById(link.origin_id)
    // })
    // let linkCodeNodes = []
    // for(var i = 1; i < this.inputs.length; i++){
    //     linkCodeNodes.push(this.getInputData(i))
    //     if(this.getInputData(i) != null){
    //         this.bindTrackCodeNode.push(this.getInputData(i))
    //     }
    // }
    // console.log('当前链接的solts', linkCodeNodes)
    // var bindChildRobot = this.linkDatas.cardacSolt
    // for(var i = 0; i < bindChildRobot.length; i++){
    //     var robot = bindChildRobot[i].robot
    //     if(robot.codeNode != null){
    //         this.bindTrackCodeNode.push(robot.codeNode)
    //     }
    // }
    this.onBindCodeNode(this.getInputData(0))
  }

  
  onBindCodeNode(codeNode){
    // this.addOutput("是否接触", 'number')
    // this.addOutput("接触对象", 'codeNode')
    // console.log('开始监听接触对象', codeNode)
    let index = publicListen.selectEnums.indexOf(this.properties.customKey)
    if(index == -1){
        console.warn('没有对应的可监听事件', this.properties.customKey)
        return
    }
    let bindKey = publicListen.chooseKey[index]
    if(this.codeNode != null){
        //如果有绑定旧的codeNode，先删除旧的codeNode绑定的id
        this.codeNode.removeRobotListener(bindKey, this.getIdWithGraph())
    }
    this.codeNode = codeNode
    if(codeNode == null){
        return
    }
    this.codeNode.addRobotListener(bindKey,this.getIdWithGraph(),(value)=>{
        this.setOutputData(0, value)
        this.triggerSlot(1)
    })
  }

  onStop(){
    this.codeNode = null
  }

  // updateWidght(){
  //   var value = this.properties.modal
  //   if(value != '无限制'){
  //       this.widgets.map((widget)=>{
  //         if(widget.name == '最大值' || widget.name == '最小值'){
  //             widget.disabled = false
  //         }
  //       })
  //     }else{
  //       this.widgets.map((widget)=>{
  //         if(widget.name == '最大值' || widget.name == '最小值'){
  //             widget.disabled = true
  //         }
  //       })
  //     }
  // }

  // onWidgetChanged(name, value, old_value, widget){
  //   // console.log('onWidgetChanged', node, name, value, old_value)
  //   // this.isWidgetVisible
  //   if(name == '模式'){
  //       this.updateWidght()
  //   }
  // }

  // Function to call when the node is executed
  // onAction(action, param, options) {
    
  // };
  //触发模式来更新
  onAction() {
    if(this.codeNode == null){
        return
    }
    let value = this.getInputData(1)
    let index = publicListen.selectEnums.indexOf(this.properties.customKey)
    if(index == -1){
        console.warn('没有对应的可监听事件', this.properties.customKey)
        return
    }
    let bindKey = publicListen.chooseKey[index]
    if(bindKey != null){
        var range = this._range
        if(this.properties.modal == '增量修改'){
            if(this.codeNode[bindKey] + value >= range[1]){
                value = range[1] - this.codeNode[bindKey] 
            }
            if(this.codeNode[bindKey] + value <= range[0]){
                value = range[0] - this.codeNode[bindKey]
            }
            this.codeNode[bindKey] = this.codeNode[bindKey] + value
        }else{
            if(value > range[1]){
                value = range[1]
            }
            if(value < range[0]){
                value = range[0]
            }
            this.codeNode[bindKey] = value
        }
    }else{
        this.codeNode[bindKey] = value
    }
  }
}

publicListen.title = '属性感应器'
publicListen.selectEnums = ['透明度','层级','缩放X','缩放Y','长度','高度','显隐','角度']
publicListen.chooseKey = ['opacity', 'zIndex','scaleX','scaleY','width','height','active','angle']

// Register the node type
LiteGraph.registerNodeType("objects/objectSensor/publicListen", publicListen)
