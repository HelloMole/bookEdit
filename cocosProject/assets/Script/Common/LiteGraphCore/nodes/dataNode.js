import {LiteGraph, LGraphNode} from '../../litegraph/litegraph'

class systemData extends LGraphNode {
    // Name to show
    title = "系统数据"
    desc = "获取系统数据";   //不会在显示节点中用到，仅仅在代码中的解释

    constructor() {
      super()
    //   this.serialize_widgets  = true
    //   this.addInput("触发", "number")   //增加一个输入触点，  输入触点的名称， 值类型    //不需要触发了
    //   this.addInput("B", "number")
      this.addOutput("值", 'number,string,boolean,object,array')   //增加一个输出触点，  输出节点的名称， 值类型

      this.addProperty('modal', '时间戳-秒', 'enum')
      this.addWidget('combo', '类型', this.properties.modal, {property: "modal", values: systemData.valueTypes} )
      
      this.addProperty('fileName', '')
      this.addWidget('string', '表名称', this.properties.fileName, 'fileName')


    //'输出空间的x轴范围，是一个数组，如[-1280,1280]，表示该空间最左侧x坐标为-1280，最右侧坐标为1280'},

    //   this.addProperty('fileName', '')
    //   this.addWidget('string', '配置表名称', this.properties.fileName, 'fileName')



    //   this.addProperty("value", 1.0);   //增加一个变量，    变量名称， 变量名称
    //   this.progress = 0.5               //设置节点的进度，一般来说用于在执行的时候设置
    //   this.widget = this.addWidget("number","值",1,"value");
    //   this.serialize_widgets = true;
    //   this.widget = this.addWidget("number","value",1,"value");  //增加一个控件用于修改变量，  类型，显示名称，默认值，要修改的变量的名称
      this.widgets_up = true;                                      //设置输入组件在顶部（覆盖input和output）
      this.size = [180, 40];   
    //                                   //设置默认节点尺寸
        
    //   this.properties.precision = 1
    }
  
    // Function to call when the node is executed
    //执行时的方法
    // onExecute() {
     //   var A = this.getInputData(0)
      //this.setOutputData(0, parseFloat(this.properties["value"])) //发送一个参数出去
    // }

    //动态返回卡片显示的title
    getTitle() {
        if (this.flags.collapsed) {
            if(this.properties.modal == '配置表'){
                return this.properties.modal + ':' + this.properties.fileName
            }else{
                return this.properties.modal;
            }
        }
        return this.title;
    };

    onAdded(){
        // console.log('节点添加到蓝图中了', this.properties.customeName, this.properties.modal)
        //如果是拖拽资源的话，这里也是需要触发的
        this.updateWidght()
    }

    //onConfigure从json还原到蓝图中才会调用，如果从json还原，onAdded会优先触发
    onConfigure(){
        // console.log('节点配置了', this.properties.customeName, this.properties.modal)
        this.updateWidght()
    }

    updateWidght(){
        var value = this.properties.modal
        this.widgets.map((widget)=>{
            if(widget.name == '表名称'){
                widget.disabled = value != '配置表'
            }
        })
        // this.expandToFitContent()
    }

    onWidgetChanged(name, value, oldValue, widget){
        if(name == '类型'){
            this.updateWidght()
        }
    }

    onStart(){
        this.onExecute()
    }

    getLinkData(){
        let value = null
        var modalIndex = systemData.valueTypes.indexOf(this.properties.modal)
        if(modalIndex == 0){
            value = Math.floor(new Date().getTime() / 1000)
        }else if(modalIndex == 1){
            var date = new Date()
            var month = date.getMonth() + 1
            if(month < 10){
                month = "0" + month
            }
            var day =  date.getDate()
            if(day < 10){
                day = "0" + day
            }
            value = date.getFullYear() + '/' + month + '/' + day
        }else if(modalIndex == 2){
            var date = new Date()
            var hours = date.getHours()
            var minutes = date.getMinutes()
            var seconds = date.getSeconds()
            if(hours < 10){
                hours = "0" + hours
            }
            if(minutes < 10){
                minutes = "0" + minutes
            }
            if(seconds < 10){
                seconds = "0" + seconds
            }
            value = hours + ':' + minutes + ':' + seconds
        }else if(modalIndex == 3){
            var date = new Date()
            var hours = date.getHours()
            var minutes = date.getMinutes()
            var seconds = date.getSeconds()
            if(hours < 10){
                hours = "0" + hours
            }
            if(minutes < 10){
                minutes = "0" + minutes
            }
            value = hours + ':' + minutes
        }else if(modalIndex == 4){
            value = cc.sys.os
        }else if(modalIndex == 5){
            value = 1.0
        }else if(modalIndex == 6){
            //读取配置表
            // var fileName = this.config.otherConfig.fileName.default
            // value = this.codeProgress.getConfigData(fileName)
        }else if(modalIndex == 7){
            // var fileName = this.config.otherConfig.fileName.default
            value = {}
        }else if(modalIndex == 8){
            value = []
        }else if(modalIndex == 9){
             //其实这里应该返回设计分辨率
            value = cc.winSize.width
        }else if(modalIndex == 10){
            value = cc.winSize.height
            //其实这里应该返回设计分辨率
        }else if(modalIndex == 11){
            // 空间X轴范围
            value = cc.winSize.width * 0.5
            value = [-value, value]
        }else if(modalIndex == 12){
            // 空间Y轴范围
            value = cc.winSize.height * 0.5
            value = [-value, value]
        }
        return value
    }

    //可以每帧触发，也可以onStart触发，还可以手动调用触发刷新值
    onExecute(){
        let data = this.getLinkData()
        this.setOutputData(0, data)
    }

    //暂不清楚用处
    // setValue(v){
    //     this.setProperty("value",v);
    // }

    //自定义触点显示的文字
    // onDrawBackground(ctx) {
    //     //show the current value
    //     this.outputs[0].label = this.properties["value"].toFixed(3);
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
  
// Register the node type
systemData.title = '系统数据'    //设置中文名称标题，是否需要实现多语言？
systemData.valueTypes = ['时间戳-秒','年:月:日','时:分:秒','时:分','系统','版本','配置表','Object','Array','空间宽度', '空间高度','空间X轴范围','空间Y轴范围']
LiteGraph.registerNodeType("input/getData/systemData", systemData)    //第一个是唯一key，同时也是菜单选项路径




class customData extends LGraphNode {
    // Name to show
    title = "自定义数据"
    desc = "获取自定义数据";   //不会在显示节点中用到，仅仅在代码中的解释

    constructor() {
      super()
      this.mode = LiteGraph.ON_EVENT; 
    //   this.serialize_widgets  = true
    //   this.addInput("触发", "number")   //增加一个输入触点，  输入触点的名称， 值类型    //不需要触发了
    //   this.addInput("B", "number")
      this.addOutput("值", 'number,string,boolean,object,array')   //增加一个输出触点，  输出节点的名称， 值类型

    //   this.addProperty('modal', '时间戳-秒', 'enum')
    //   this.addWidget('combo', '类型', this.properties.modal, {property: "modal", values: systemData.valueTypes} )
      
      this.addProperty('saveKey', '', 'string')
      this.addWidget('string', '数据key', this.properties.saveKey, 'saveKey')


      this.addProperty('ifEmpty', '', 'enum')
      this.addWidget('combo', '默认类型', this.properties.ifEmpty, {property: "ifEmpty", values: customData.valueTypes} )

      this.addProperty('defaultValue', '', 'string')
      this.addWidget('text', '默认值', this.properties.defaultValue, 'defaultValue' )

    //'输出空间的x轴范围，是一个数组，如[-1280,1280]，表示该空间最左侧x坐标为-1280，最右侧坐标为1280'},

    //   this.addProperty('fileName', '')
    //   this.addWidget('string', '配置表名称', this.properties.fileName, 'fileName')



    //   this.addProperty("value", 1.0);   //增加一个变量，    变量名称， 变量名称
    //   this.progress = 0.5               //设置节点的进度，一般来说用于在执行的时候设置
    //   this.widget = this.addWidget("number","值",1,"value");
    //   this.serialize_widgets = true;
    //   this.widget = this.addWidget("number","value",1,"value");  //增加一个控件用于修改变量，  类型，显示名称，默认值，要修改的变量的名称
      this.widgets_up = true;                                      //设置输入组件在顶部（覆盖input和output）
      this.size = [180, 30];   
    //                                   //设置默认节点尺寸
        
    //   this.properties.precision = 1
    }
  
    // Function to call when the node is executed
    //执行时的方法
    // onExecute() {
     //   var A = this.getInputData(0)
      //this.setOutputData(0, parseFloat(this.properties["value"])) //发送一个参数出去
    // }

    //动态返回卡片显示的title
    getTitle() {
        if (this.flags.collapsed) {
            return this.title + ':' + this.properties.saveKey;
        }
        return this.title;
    };

    onAdded(){
        // console.log('节点添加到蓝图中了', this.properties.customeName, this.properties.modal)
        //如果是拖拽资源的话，这里也是需要触发的
        // this.updateWidght()
    }

    //onConfigure从json还原到蓝图中才会调用，如果从json还原，onAdded会优先触发
    onConfigure(){
        // console.log('节点配置了', this.properties.customeName, this.properties.modal)
        // this.updateWidght()
    }

    updateWidght(){
        var value = this.properties.modal
        this.widgets.map((widget)=>{
            // if(widget.name == '表名称'){
            //     widget.disabled = value != '配置表'
            // }
        })
        // this.expandToFitContent()
    }

    // onWidgetChanged(name, value, oldValue, widget){
    //     if(name == '类型'){
    //         this.updateWidght()
    //     }
    // }

    onStart(){
        this.onExecute()
    }

   
    //可以每帧触发，也可以onStart触发，还可以手动调用触发刷新值
    onExecute(){
        let codeJsonData = cc.sys.localStorage.getItem('codeJsonData')
          if(codeJsonData == null || codeJsonData == ''){
            codeJsonData = {}
        }else{
            codeJsonData = JSON.parse(codeJsonData)
        }
        let value = codeJsonData[this.properties.saveKey]
        if(value == null){
            let ifEmpty = this.properties.ifEmpty
            if(ifEmpty == '数值'){
                value = Number(this.properties.defaultValue)
                if(isNaN(value)){
                    value = 0
                }
            }else if(ifEmpty == '文字'){
                value = this.properties.defaultValue
            }else if(ifEmpty == '字典' || '数组'){
                try {
                    value = JSON.parse(this.properties.defaultValue)
                } catch (error) {
                    value = ifEmpty == '字典' ? {} : []
                }
            }
        }
        this.setOutputData(0, value)
    }

    //暂不清楚用处
    // setValue(v){
    //     this.setProperty("value",v);
    // }

    //自定义触点显示的文字
    // onDrawBackground(ctx) {
    //     //show the current value
    //     this.outputs[0].label = this.properties["value"].toFixed(3);
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
  
// Register the node type
customData.title = '自定义数据'    //设置中文名称标题，是否需要实现多语言？
customData.valueTypes = ['数值', '文字', '字典', '数组']
LiteGraph.registerNodeType("input/getData/customData", customData)    //第一个是唯一key，同时也是菜单选项路径



class screenSize extends LGraphNode {
    // Name to show
    title = "屏幕适配"
    desc = "获取屏幕适配数据";   //不会在显示节点中用到，仅仅在代码中的解释

    constructor() {
      super()
      this.mode = LiteGraph.ON_EVENT; 
    //   this.serialize_widgets  = true
    //   this.addInput("触发", "number")   //增加一个输入触点，  输入触点的名称， 值类型    //不需要触发了
    //   this.addInput("B", "number")
      this.addOutput("4:3", LiteGraph.EVENT)   //增加一个输出触点，  输出节点的名称， 值类型
      this.addOutput("16:9", LiteGraph.EVENT)
      this.addOutput("18:9", LiteGraph.EVENT)

    //   this.addProperty('modal', '时间戳-秒', 'enum')
    //   this.addWidget('combo', '类型', this.properties.modal, {property: "modal", values: systemData.valueTypes} )
      
    //   this.addProperty('saveKey', '', 'string')
    //   this.addWidget('string', '数据key', this.properties.saveKey, 'saveKey')


    //   this.addProperty('ifEmpty', '', 'enum')
    //   this.addWidget('combo', '默认类型', this.properties.ifEmpty, {property: "ifEmpty", values: customData.valueTypes} )

    //   this.addProperty('defaultValue', '', 'string')
    //   this.addWidget('text', '默认值', this.properties.defaultValue, 'defaultValue' )

    //'输出空间的x轴范围，是一个数组，如[-1280,1280]，表示该空间最左侧x坐标为-1280，最右侧坐标为1280'},

    //   this.addProperty('fileName', '')
    //   this.addWidget('string', '配置表名称', this.properties.fileName, 'fileName')



    //   this.addProperty("value", 1.0);   //增加一个变量，    变量名称， 变量名称
    //   this.progress = 0.5               //设置节点的进度，一般来说用于在执行的时候设置
    //   this.widget = this.addWidget("number","值",1,"value");
    //   this.serialize_widgets = true;
    //   this.widget = this.addWidget("number","value",1,"value");  //增加一个控件用于修改变量，  类型，显示名称，默认值，要修改的变量的名称
    //   this.widgets_up = true;                                      //设置输入组件在顶部（覆盖input和output）
    //   this.size = [180, 30];   
    //                                   //设置默认节点尺寸
        
    //   this.properties.precision = 1
    }
  
    // Function to call when the node is executed
    //执行时的方法
    // onExecute() {
     //   var A = this.getInputData(0)
      //this.setOutputData(0, parseFloat(this.properties["value"])) //发送一个参数出去
    // }

    //动态返回卡片显示的title
    // getTitle() {
    //     if (this.flags.collapsed) {
    //         return this.title + ':' + this.properties.saveKey;
    //     }
    //     return this.title;
    // };

    onAdded(){
        // console.log('节点添加到蓝图中了', this.properties.customeName, this.properties.modal)
        //如果是拖拽资源的话，这里也是需要触发的
        // this.updateWidght()
    }

    //onConfigure从json还原到蓝图中才会调用，如果从json还原，onAdded会优先触发
    onConfigure(){
        // console.log('节点配置了', this.properties.customeName, this.properties.modal)
        // this.updateWidght()
    }

    updateWidght(){
        var value = this.properties.modal
        this.widgets.map((widget)=>{
            // if(widget.name == '表名称'){
            //     widget.disabled = value != '配置表'
            // }
        })
        // this.expandToFitContent()
    }

    // onWidgetChanged(name, value, oldValue, widget){
    //     if(name == '类型'){
    //         this.updateWidght()
    //     }
    // }

    onStart(){
        this.onExecute()
    }

   
    //可以每帧触发，也可以onStart触发，还可以手动调用触发刷新值
    onExecute(){
        let value = Math.max(cc.winSize.width , cc.winSize.height) / Math.min(cc.winSize.width , cc.winSize.height)
        //这里要加上以节点为准的适配规则
        // console.log('计算屏幕尺寸', cc.winSize.width,  cc.winSize.height)
        if(value < 1.6){
            this.triggerSlot(0)
        }else if(value < 1.9){
            this.triggerSlot(1)
        }else{
            this.triggerSlot(2)
        }
    }

    //暂不清楚用处
    // setValue(v){
    //     this.setProperty("value",v);
    // }

    //自定义触点显示的文字
    // onDrawBackground(ctx) {
    //     //show the current value
    //     this.outputs[0].label = this.properties["value"].toFixed(3);
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
  
// Register the node type
screenSize.title = '屏幕适配'    //设置中文名称标题，是否需要实现多语言？
LiteGraph.registerNodeType("input/screenSize", screenSize)    //第一个是唯一key，同时也是菜单选项路径





class setData extends LGraphNode {
    // Name to show
    title = "保存自定义数据"
    desc = "保存自定义数据";   //不会在显示节点中用到，仅仅在代码中的解释

    constructor() {
      super()
      this.mode = LiteGraph.ON_EVENT; 
    //   this.serialize_widgets  = true
       
      this.addInput("值", 'number,string,boolean,object,array')

      this.addInput("保存", LiteGraph.ACTION)   //增加一个输入触点，  输入触点的名称， 值类型    //不需要触发了
    //   this.addInput("B", "number")
        //增加一个输出触点，  输出节点的名称， 值类型

    //   this.addProperty('modal', '时间戳-秒', 'enum')
    //   this.addWidget('combo', '类型', this.properties.modal, {property: "modal", values: systemData.valueTypes} )
      
      this.addProperty('saveKey', '', 'string')
      this.addWidget('string', '数据key', this.properties.saveKey, 'saveKey')


    //   this.addProperty('ifEmpty', '', 'enum')
    //   this.addWidget('combo', '默认类型', this.properties.ifEmpty, {property: "ifEmpty", values: customData.valueTypes} )

    //   this.addProperty('defaultValue', '', 'string')
    //   this.addWidget('text', '默认值', this.properties.defaultValue, 'defaultValue' )

    //'输出空间的x轴范围，是一个数组，如[-1280,1280]，表示该空间最左侧x坐标为-1280，最右侧坐标为1280'},

    //   this.addProperty('fileName', '')
    //   this.addWidget('string', '配置表名称', this.properties.fileName, 'fileName')



    //   this.addProperty("value", 1.0);   //增加一个变量，    变量名称， 变量名称
    //   this.progress = 0.5               //设置节点的进度，一般来说用于在执行的时候设置
    //   this.widget = this.addWidget("number","值",1,"value");
    //   this.serialize_widgets = true;
    //   this.widget = this.addWidget("number","value",1,"value");  //增加一个控件用于修改变量，  类型，显示名称，默认值，要修改的变量的名称
    //   this.widgets_up = true;                                      //设置输入组件在顶部（覆盖input和output）
    //   this.size = [180, 30];   
    //                                   //设置默认节点尺寸
        
    //   this.properties.precision = 1
    }
  
    // Function to call when the node is executed
    //执行时的方法
    // onExecute() {
     //   var A = this.getInputData(0)
      //this.setOutputData(0, parseFloat(this.properties["value"])) //发送一个参数出去
    // }

    //动态返回卡片显示的title
    getTitle() {
        if (this.flags.collapsed) {
            return this.title + ':' + this.properties.saveKey;
        }
        return this.title;
    };

    onAdded(){
        // console.log('节点添加到蓝图中了', this.properties.customeName, this.properties.modal)
        //如果是拖拽资源的话，这里也是需要触发的
        // this.updateWidght()
    }

    //onConfigure从json还原到蓝图中才会调用，如果从json还原，onAdded会优先触发
    onConfigure(){
        // console.log('节点配置了', this.properties.customeName, this.properties.modal)
        // this.updateWidght()
    }

    updateWidght(){
        var value = this.properties.modal
        this.widgets.map((widget)=>{
            // if(widget.name == '表名称'){
            //     widget.disabled = value != '配置表'
            // }
        })
        // this.expandToFitContent()
    }

    // onWidgetChanged(name, value, oldValue, widget){
    //     if(name == '类型'){
    //         this.updateWidght()
    //     }
    // }

    // onStart(){
    //     this.onExecute()
    // }

   
    //可以每帧触发，也可以onStart触发，还可以手动调用触发刷新值
    onAction(name){
        let data = this.getInputData(0)
        if(data == undefined){
            return
        }
        let codeJsonData = cc.sys.localStorage.getItem('codeJsonData')
          if(codeJsonData == null || codeJsonData == ''){
            codeJsonData = {}
        }else{
            codeJsonData = JSON.parse(codeJsonData)
        }
        codeJsonData[this.properties.saveKey] = data
        cc.sys.localStorage.setItem('codeJsonData', JSON.stringify(codeJsonData))
    }

    //暂不清楚用处
    // setValue(v){
    //     this.setProperty("value",v);
    // }

    //自定义触点显示的文字
    // onDrawBackground(ctx) {
    //     //show the current value
    //     this.outputs[0].label = this.properties["value"].toFixed(3);
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
  
// Register the node type
setData.title = '保存自定义数据'    //设置中文名称标题，是否需要实现多语言？
// setData.valueTypes = ['数值', '文字', '字典', '数组']
LiteGraph.registerNodeType("output/setData", setData)    //第一个是唯一key，同时也是菜单选项路径
