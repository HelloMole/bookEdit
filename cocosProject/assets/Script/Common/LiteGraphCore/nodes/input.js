import {LiteGraph, LGraphNode} from '../../litegraph/litegraph'
import * as CocosMgr from '../CocosMgr';

class valueRobot extends LGraphNode {
    // Name to show
    title = "value"
    desc = "定义一个数";   //不会在显示节点中用到，仅仅在代码中的解释
    name = '数值'

    constructor() {
      super()
    //   this.addInput("触发", "number")   //增加一个输入触点，  输入触点的名称， 值类型    //不需要触发了
    //   this.addInput("B", "number")
      this.addOutput("输出", "number")   //增加一个输出触点，  输出节点的名称， 值类型
      this.addProperty("value", 1.0);   //增加一个变量，    变量名称， 变量名称
    //   this.progress = 0.5               //设置节点的进度，一般来说用于在执行的时候设置
      this.widget = this.addWidget("number","值",1,"value");
    //    this.serialize_widgets = true;
    //   this.widget = this.addWidget("number","value",1,"value");  //增加一个控件用于修改变量，  类型，显示名称，默认值，要修改的变量的名称
      this.widgets_up = true;                                    //设置输入组件在顶部（覆盖input和output）
    //   this.size = [180, 30];                                     //设置默认节点尺寸
    //   this.properties.precision = 1
    }
  
    // Function to call when the node is executed
    //执行时的方法
    onExecute() {
    //   var A = this.getInputData(0)
      this.setOutputData(0, parseFloat(this.properties["value"])) //发送一个参数出去
    }

    //动态返回卡片显示的title
    getTitle() {
        if (this.flags.collapsed) {
            return this.properties.value;
        }
        return this.title;
    };

    //暂不清楚用处
    setValue(v){
		this.setProperty("value",v);
	}

    //自定义触点显示的文字
    onDrawBackground(ctx) {
        //show the current value
        this.outputs[0].label = this.properties["value"].toFixed(3);
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
  
// Register the node type
valueRobot.title = '数值'    //设置中文名称标题，是否需要实现多语言？
LiteGraph.registerNodeType("input/value", valueRobot)    //第一个是唯一key，同时也是菜单选项路径

class valueStringRobot extends LGraphNode {
    // Name to show
    title = "文字"
    desc = "定义文字值";   //不会在显示节点中用到，仅仅在代码中的解释

    constructor() {
      super()
    //   this.addInput("触发", "number")   //增加一个输入触点，  输入触点的名称， 值类型    //不需要触发了
    //   this.addInput("B", "number")
      this.addOutput("输出", "string")   //增加一个输出触点，  输出节点的名称， 值类型
      this.addProperty("value", "");   //增加一个变量，    变量名称， 变量名称
    //   this.progress = 0.5               //设置节点的进度，一般来说用于在执行的时候设置
    this.widget = this.addWidget("text","value","","value"); 
    //  this.serialize_widgets = true;
    //   this.widget = this.addWidget("number","value",1,"value");  //增加一个控件用于修改变量，  类型，显示名称，默认值，要修改的变量的名称
      this.widgets_up = true;                                    //设置输入组件在顶部（覆盖input和output）
    //   this.size = [180, 30];                                     //设置默认节点尺寸
    //   this.properties.precision = 1
    }
  
    // Function to call when the node is executed
    //执行时的方法
    onExecute() {
    //   var A = this.getInputData(0)
      this.setOutputData(0, this.properties["value"]) //发送一个参数出去
    }

    //动态返回卡片显示的title
    getTitle() {
        if (this.flags.collapsed) {
            return this.properties.value;
        }
        return this.title;
    };

    //暂不清楚用处
    setValue(v){
		this.setProperty("value",v);
	}

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
valueStringRobot.title = '文字'    //设置中文名称标题，是否需要实现多语言？
LiteGraph.registerNodeType("input/valueString", valueStringRobot)    //第一个是唯一key，同时也是菜单选项路径



class BooleanRobot extends LGraphNode {
    // Name to show
    title = "布尔值"
    desc = "定义一个数";   //不会在显示节点中用到，仅仅在代码中的解释

    constructor() {
        super()
        // this.addInput("触发", "number")   //增加一个输入触点，  输入触点的名称， 值类型
    //   this.addInput("B", "number")
        this.addOutput("bool", "boolean")   //增加一个输出触点，  输出节点的名称， 值类型
        this.addProperty("value", true);   //增加一个变量，    变量名称， 变量名称
    //   this.progress = 0.5               //设置节点的进度，一般来说用于在执行的时候设置
        this.widget = this.addWidget("toggle","value",true,"value");
    //   this.widget = this.addWidget("number","value",1,"value");  //增加一个控件用于修改变量，  类型，显示名称，默认值，要修改的变量的名称
        //  this.serialize_widgets = true; //widget的值是否也可以被序列化，weidget值和Property中的值不是绑定的，如果初始时不一致，就会出现weidget显示的不是真实的值，所以建议绑定
        // this.widgets_up = true;                                    //设置输入组件在顶部（覆盖input和output）
        // this.size = [140, 30];                                  //设置默认节点尺寸
    //   this.properties.precision = 1
    }
  
    // Function to call when the node is executed
    //执行时的方法
    onExecute() {
    //   var A = this.getInputData(0)
      this.setOutputData(0, parseFloat(this.properties["value"])) //发送一个参数出去
    }

    //动态返回卡片显示的title
    getTitle() {
        if (this.flags.collapsed) {
            return this.properties.value;
        }
        return this.title;
    };

    //暂不清楚用处
    setValue(v){
		this.setProperty("value",v);
	}
    
    // 获取可以接受的输出
    // onGetInputs() {
	// 	return [["toggle", LiteGraph.ACTION]];
	// };

    // 当节点Toggle时调用
    // onAction(action)
	// {
	// 	this.setValue( !this.properties.value );
	// }

    //自定义触点显示的文字
    onDrawBackground(ctx) {
        //show the current value
        this.outputs[0].label = this.properties["value"] ? '真' : '假'
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

BooleanRobot.title = '布尔值'
LiteGraph.registerNodeType("input/boolean", BooleanRobot);


class gameStartRobot extends LGraphNode {
    // Name to show
    title = "开始时"
    desc = "但游戏开始时执行一次";   //不会在显示节点中用到，仅仅在代码中的解释

    constructor() {
      super()
    //   this.addInput("触发", "number")   //增加一个输入触点，  输入触点的名称， 值类型    //不需要触发了
    //   this.addInput("B", "number")
      this.addOutput("游戏开始", LiteGraph.EVENT)   //增加一个输出触点，  输出节点的名称， 值类型

      this.addProperty('modal', '开始时', 'enum')
      this.addWidget('combo', '输出时机', this.properties.modal, {property: "modal", values: ['开始前','开始时','开始后']} )
    //   this.addProperty("value", "");   //增加一个变量，    变量名称， 变量名称
    //   this.progress = 0.5               //设置节点的进度，一般来说用于在执行的时候设置
    // this.widget = this.addWidget("text","value","","value"); 
    //   this.widget = this.addWidget("number","value",1,"value");  //增加一个控件用于修改变量，  类型，显示名称，默认值，要修改的变量的名称
      this.widgets_up = true;                                    //设置输入组件在顶部（覆盖input和output）
      this.size = [180, 30];                                     //设置默认节点尺寸
    //   this.properties.precision = 1
    }
  
    // Function to call when the node is executed
    //执行时的方法
    // onExecute() {
    // //   var A = this.getInputData(0)
    // //   this.setOutputData(0, this.properties["value"]) //发送一个参数出去
    //     this.triggerSlot(0, 1);
    // }

    //这一阶段加载所有资源
    onStartBeforeLoad(){
        if(this.properties.modal == '开始前'){
            this.triggerSlot(0, 1);
        }
    }
    
    //开始时，在所有onExecute执行之前
    onStart(){
        if(this.properties.modal == '开始时'){
            this.triggerSlot(0, 1);
        }
    }


    //开始后在第一次onExecute执行之后
    onStartAfter(){
        if(this.properties.modal == '开始后'){
            this.triggerSlot(0, 1);
        }
    }

    //动态返回卡片显示的title
    getTitle() {
        if (this.flags.collapsed) {
            return this.properties.modal;
        }
        return this.title;
    };

    //暂不清楚用处
    setValue(v){
		this.setProperty("value",v);
	}

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
gameStartRobot.title = '开始时'    //设置中文名称标题，是否需要实现多语言？
LiteGraph.registerNodeType("input/gameStart", gameStartRobot)    //第一个是唯一key，同时也是菜单选项路径



class customButtonRobot extends LGraphNode {
    // Name to show
    title = "按钮"
    desc = "一个可以点击的按钮";   //不会在显示节点中用到，仅仅在代码中的解释
    font = 'Arial'
    constructor() {
        super()
        // this.addInput("触发", "number")   //增加一个输入触点，  输入触点的名称， 值类型
    //   this.addInput("B", "number")
        this.addOutput("", LiteGraph.EVENT)   //增加一个输出触点，  输出节点的名称， 值类型
        this.addOutput("", "boolean");
        this.addProperty("font_size", 30);
        this.addProperty("text", "按钮");
        this.addProperty("message", "");
        // this.addProperty("value", true);   //增加一个变量，    变量名称， 变量名称
    //   this.progress = 0.5               //设置节点的进度，一般来说用于在执行的时候设置
        // this.widget = this.addWidget("toggle","value",true,"value");
    //   this.widget = this.addWidget("number","value",1,"value");  //增加一个控件用于修改变量，  类型，显示名称，默认值，要修改的变量的名称
        //  this.serialize_widgets = true; //widget的值是否也可以被序列化，weidget值和Property中的值不是绑定的，如果初始时不一致，就会出现weidget显示的不是真实的值，所以建议绑定
        // this.widgets_up = true;                                    //设置输入组件在顶部（覆盖input和output）
        this.size = [164, 84];                                        //设置默认节点尺寸
        this.clicked = false;
    //   this.properties.precision = 1
    }
  

    onMouseDown(e, local_pos) {
        if (
            local_pos[0] > 1 &&
            local_pos[1] > 1 &&
            local_pos[0] < this.size[0] - 2 &&
            local_pos[1] < this.size[1] - 2
        ) {
            this.clicked = true;
            this.setOutputData(1, this.clicked);
            this.triggerSlot(0, this.properties.message);
            this.clicked = false;
            this.setOutputData(1, this.clicked);
            return true;
        }
    };

    // onMouseUp(e) {
    //     console.log('鼠标离开了')
    //     this.clicked = false;
    //     this.setOutputData(1, this.clicked);
    // };

    // Function to call when the node is executed
    //执行时的方法
    onExecute() {
    //   var A = this.getInputData(0)
    //   this.setOutputData(0, parseFloat(this.properties["value"])) //发送一个参数出去
        this.setOutputData(1, this.clicked);
    }

    //动态返回卡片显示的title
    // getTitle() {
    //     if (this.flags.collapsed) {
    //         return this.properties.value;
    //     }
    //     return this.title;
    // };

    //暂不清楚用处
    // setValue(v){
	// 	this.setProperty("value",v);
	// }
    
    // 获取可以接受的输出
    // onGetInputs() {
	// 	return [["toggle", LiteGraph.ACTION]];
	// };

    // 当节点Toggle时调用
    // onAction(action)
	// {
	// 	this.setValue( !this.properties.value );
	// }

    //自定义触点显示的文字
    // onDrawBackground(ctx) {
    //     //show the current value
    //     this.outputs[0].label = this.properties["value"] ? '真' : '假'
    // };

    //使用ctx绘制需要显示的内容
    onDrawForeground(ctx){
        if (this.flags.collapsed) {
            return;
        }
        var margin = 10;
        ctx.fillStyle = "black";
        ctx.fillRect(
            margin + 1,
            margin + 1,
            this.size[0] - margin * 2,
            this.size[1] - margin * 2
        );
        ctx.fillStyle = "#AAF";
        ctx.fillRect(
            margin - 1,
            margin - 1,
            this.size[0] - margin * 2,
            this.size[1] - margin * 2
        );
        ctx.fillStyle = this.clicked
            ? "white"
            : this.mouseOver
            ? "#668"
            : "#334";
        ctx.fillRect(
            margin,
            margin,
            this.size[0] - margin * 2,
            this.size[1] - margin * 2
        );

        if (this.properties.text || this.properties.text === 0) {
            var font_size = this.properties.font_size || 30;
            ctx.textAlign = "center";
            ctx.fillStyle = this.clicked ? "black" : "white";
            ctx.font = font_size + "px " + 'Arial';
            ctx.fillText(
                this.properties.text,
                this.size[0] * 0.5,
                this.size[1] * 0.5 + font_size * 0.3
            );
            ctx.textAlign = "left";
        }
    }
}

customButtonRobot.title = '按钮'
LiteGraph.registerNodeType("input/button/customButton", customButtonRobot);



class controllRobot extends LGraphNode {
    // Name to show
    title = "摇杆"
    desc = "操作杆的x和y的范围：[-1, 1]，当拖动操控杆时\n仅改变时：操控杆移发生位移变化时输出当前操作杆范围\n持续：一直输出操控杆当前值*这一帧的时长";   //不会在显示节点中用到，仅仅在代码中的解释
    font = 'Arial'
    constructor() {
        super()
        // this.addInput("触发", "number")   //增加一个输入触点，  输入触点的名称， 值类型
    //   this.addInput("B", "number")
        this.addOutput("左右", 'number')   //增加一个输出触点，  输出节点的名称， 值类型
        this.addOutput("上下", 'number');
        this.addOutput("按下时", LiteGraph.EVENT);

        this.addProperty("controllType", 0);
        this.addProperty("modal", 0);
        this.addProperty("outputScale", 250);
        // this.addProperty("outputScale", 0);


        // this.addProperty("font_size", 30);
        // this.addProperty("text", "click me");
        // this.addProperty("message", "");
        // this.addProperty("value", true);   //增加一个变量，    变量名称， 变量名称
    //   this.progress = 0.5               //设置节点的进度，一般来说用于在执行的时候设置
        // this.widget = this.addWidget("toggle","value",true,"value");
    //   this.widget = this.addWidget("number","value",1,"value");  //增加一个控件用于修改变量，  类型，显示名称，默认值，要修改的变量的名称
        //  this.serialize_widgets = true; //widget的值是否也可以被序列化，weidget值和Property中的值不是绑定的，如果初始时不一致，就会出现weidget显示的不是真实的值，所以建议绑定
        // this.widgets_up = true;                                    //设置输入组件在顶部（覆盖input和output）
        this.size = [164, 164];                                        //设置默认节点尺寸
        this.clicked = false;
    //   this.properties.precision = 1
    }
  
    freshHandlePos(local_pos){
        var minLength = Math.min(this.size[0], this.size[1])
        let maxDistance = minLength * 0.5

        let deltaX = (local_pos[0] - maxDistance)
        let deltaY = (local_pos[1] - maxDistance)
        let distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY), maxDistance);

        // 限制在圆形范围内
        let angle = Math.atan2(deltaY, deltaX);
        let limitedX = distance * Math.cos(angle);
        let limitedY = distance * Math.sin(angle);

        if (
            local_pos[0] > 0 &&
            local_pos[1] > 0 &&
            local_pos[0] < minLength &&
            local_pos[1] < minLength
        ) {
            // this.clicked = true;
            // var halfLength = minLength * 0.5
            this.setOutputData(0, limitedX / maxDistance);
            this.setOutputData(1, limitedY / maxDistance);

            // this.triggerSlot(0, this.properties.message);
            // this.clicked = false;
            // this.setOutputData(1, this.clicked);
            // console.log('点击了摇杆', local_pos)
            return true;
        }
    }

    onMouseDown(e, local_pos) {
        this.clicked = true;
        this.freshHandlePos(local_pos)
        this.triggerSlot(2);
    };

    onMouseMove(e,local_pos){
        if(this.clicked != true){
            return
        }
        this.freshHandlePos(local_pos)
    }

    onMouseUp(e) {
        // console.log('鼠标离开了')
        this.clicked = false;
        this.setOutputData(0, 0);
        this.setOutputData(1, 0);
    };

    // Function to call when the node is executed
    //执行时的方法
    onExecute() {
    //   var A = this.getInputData(0)
    //   this.setOutputData(0, parseFloat(this.properties["value"])) //发送一个参数出去
        this.setOutputData(1, this.clicked);
    }

    //动态返回卡片显示的title
    // getTitle() {
    //     if (this.flags.collapsed) {
    //         return this.properties.value;
    //     }
    //     return this.title;
    // };

    //暂不清楚用处
    // setValue(v){
	// 	this.setProperty("value",v);
	// }
    
    // 获取可以接受的输出
    // onGetInputs() {
	// 	return [["toggle", LiteGraph.ACTION]];
	// };

    // 当节点Toggle时调用
    // onAction(action)
	// {
	// 	this.setValue( !this.properties.value );
	// }

    //自定义触点显示的文字
    onDrawBackground(ctx) {
        //show the current value
        if (this.flags.collapsed) {
            return;
        }
        var x = this.getOutputData(0)
        var y = this.getOutputData(1)
        if(x != null && x.toFixed != null){
            this.outputs[0].label = '左右：' + x.toFixed(3)
        }
        if(y != null && y.toFixed != null){
            this.outputs[1].label = '上下：' + y.toFixed(3)
        }
    };

    //使用ctx绘制需要显示的内容
    onDrawForeground(ctx){
        if (this.flags.collapsed) {
            return;
        }
        var minLength = Math.min(this.size[0], this.size[1])
        var base = {width: minLength, height: minLength} //整体大小
        var handle = {width: minLength * 0.25, height: minLength * 0.25} //手柄大小
        this.size[0]
        // ctx.fillStyle = "black";
       

        // ctx.clearRect(0, 0, base.width, base.height);
            
        // 底座渐变
        var gradient = ctx.createRadialGradient(
            base.width/2, base.height/2, 0,
            base.width/2, base.height/2, base.width/2
        );
        gradient.addColorStop(0, '#666');
        gradient.addColorStop(1, '#222');
        
        ctx.beginPath();
        ctx.arc(base.width/2, base.height/2, base.width/2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // 底座刻度
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 2;
        
        // 十字线
        ctx.beginPath();
        ctx.moveTo(base.width/2, 0);
        ctx.lineTo(base.width/2, base.height);
        ctx.moveTo(0, base.height/2);
        ctx.lineTo(base.width, base.height/2);
        ctx.stroke();
        
        // 圆圈刻度
        for (let i = 1; i <= 3; i++) {
            ctx.beginPath();
            ctx.arc(base.width/2, base.height/2, i * base.width/6, 0, Math.PI * 2);
            ctx.stroke();
        }
    

         // 绘制摇杆手柄
        // ctx.moveTo(base.width * 0.5, base.height * 0.5)

        var gradient = ctx.createRadialGradient(
            handle.width/2, handle.height/2, 0,
            handle.width/2, handle.height/2, handle.width/2
        );
        gradient.addColorStop(0, '#fff');
        gradient.addColorStop(1, '#aaa');

        var dirX = this.getOutputData(0) || 0
        var dirY = this.getOutputData(1) || 0

        var xPos = base.width * 0.5 + (0 + dirX) * base.width * 0.5
        var yPos = base.height * 0.5 + (0 + dirY) * base.height * 0.5

        
        ctx.beginPath();
        ctx.arc(xPos, yPos, handle.width/2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // 手柄高光
        ctx.beginPath();
        ctx.arc(xPos, yPos, handle.width/3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fill();
        
    }
}

controllRobot.title = '摇杆'
LiteGraph.registerNodeType("input/button/controll", controllRobot);



class touchStart extends LGraphNode {
    // Name to show
    title = "触摸开始"
    desc = "检测物体触摸开始";   //不会在显示节点中用到，仅仅在代码中的解释

    constructor() {
      super()
      this.mode = LiteGraph.ON_EVENT;
    //   this.serialize_widgets = true
    //   this.addInput("触发", "number")   //增加一个输入触点，  输入触点的名称， 值类型    //不需要触发了
        this.addInput("物体", "codeNode")
        this.addInput("监听", LiteGraph.ACTION);
        this.addInput("取消监听", LiteGraph.ACTION);

        this.addOutput('开始X', 'number')
        this.addOutput('开始Y', 'number')

        this.addOutput('点击', LiteGraph.EVENT)

        this.addProperty('controllObj', false, 'boolean')
        this.addWidget('toggle', '控制物体位置', this.properties.controllObj, 'controllObj')
    //   this.addOutput("游戏开始", LiteGraph.EVENT)   //增加一个输出触点，  输出节点的名称， 值类型
    //   this.addProperty("value", "");   //增加一个变量，    变量名称， 变量名称
    //   this.progress = 0.5               //设置节点的进度，一般来说用于在执行的时候设置
    // this.widget = this.addWidget("text","value","","value"); 
    //   this.widget = this.addWidget("number","value",1,"value");  //增加一个控件用于修改变量，  类型，显示名称，默认值，要修改的变量的名称
    //   this.widgets_up = true;                                    //设置输入组件在顶部（覆盖input和output）
    //   this.size = [180, 30];                                     //设置默认节点尺寸

    //   this.properties.precision = 1
        this.useCanvas = false
        this.lastBindCodeNode = null
    }
  
    // Function to call when the node is executed
    //执行时的方法
    // onExecute() {
    // //   var A = this.getInputData(0)
    // //   this.setOutputData(0, this.properties["value"]) //发送一个参数出去
    //     this.triggerSlot(0, 1);
    // }

    // onStart(){
    //     // this.triggerSlot(0, 1);
       
    // }

    onStop(){
        this.touchIds = {}
        if(this.useCanvas == true){
            this.useCanvas = false
            let canvas =  this.graph.config.rootccNode
            if(canvas == null){
                // console.warn("没有rootccNode")
                // return
                canvas = cc.director.getScene().getChildByName('Canvas')
            }
            canvas.targetOff(this)
        }else{
            if(this.lastBindCodeNode != null){
                this.lastBindCodeNode.targetOff(this)
                this.lastBindCodeNode = null
            }
        }
    }

    
    realRun(codeNode, isListen){
        if(isListen != 0){
            if(this.lastBindCodeNode != null){
                this.lastBindCodeNode.node.targetOff(this)
            }
            if(codeNode != null){
                this.useCanvas = false
                this.lastBindCodeNode = codeNode
                
                codeNode.checkAddComponent('SpinePlusComponent')
                // var result = cc.js.getClassByName('SpinePlusComponent')
                // console.log('是否存在', result)

                codeNode.targetOff(this)
                codeNode.on(cc.Node.EventType.TOUCH_START, (event)=>{
                    if(this.graph.config.pause == 1){
                        return
                    }
                    var location = codeNode.node.parent.convertToNodeSpaceAR(event.getLocation())
                    if(this.properties.controllObj == true){
                        codeNode.x = location.x
                        codeNode.y = location.y
                    }
                    this.setOutputData(0, location.x)
                    this.setOutputData(1, location.y)
                    this.triggerSlot(2, 1)
                }, this)
            }else{
                this.useCanvas = true
                let canvas =  this.graph.config.rootccNode
                if(canvas == null){
                    // console.warn("没有rootccNode")
                    canvas = cc.director.getScene().getChildByName('Canvas')
                    // return
                }
                canvas.targetOff(this)
                canvas.on(cc.Node.EventType.TOUCH_START, (event)=>{
                    if(this.graph.config.pause == 1){
                        return
                    }
                    var location = canvas.convertToNodeSpaceAR(event.getLocation())
                    this.setOutputData(0, location.x)
                    this.setOutputData(1, location.y)
                    this.triggerSlot(2, 1)
                }, this)
            }
        }else{
            if(this.useCanvas == true){
                let canvas =  this.graph.config.rootccNode
                if(canvas == null){
                    // console.warn("没有rootccNode")
                    canvas = cc.director.getScene().getChildByName('Canvas')
                    return
                }
                canvas.targetOff(this)
            }else{
                if(this.lastBindCodeNode != null){
                    this.lastBindCodeNode.targetOff(this)
                }
            }
        }
    }

    onAction(action, param){
        if(action == '监听'){
            var codeNode = this.getInputData(0)
            this.realRun(codeNode)
        }else if(action == '取消监听'){
            var codeNode = this.getInputData(0)
            this.realRun(codeNode, false)
        }
    }

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
touchStart.title = '触摸开始'    //设置中文名称标题，是否需要实现多语言？
LiteGraph.registerNodeType("input/screen/touchStart", touchStart)    //第一个是唯一key，同时也是菜单选项路径




class touchMove extends LGraphNode {
    // Name to show
    title = "触摸移动"
    desc = "检测物体触摸开始";   //不会在显示节点中用到，仅仅在代码中的解释

    constructor() {
      super()
      this.mode = LiteGraph.ON_EVENT;
    //   this.serialize_widgets = true
    //   this.addInput("触发", "number")   //增加一个输入触点，  输入触点的名称， 值类型    //不需要触发了
        this.addInput("物体", "codeNode")
        this.addInput("监听", LiteGraph.ACTION);
        this.addInput("取消监听", LiteGraph.ACTION);

        this.addOutput('X轴移动', 'number')
        this.addOutput('Y轴移动', 'number')

        this.addOutput('移动', LiteGraph.EVENT)

        this.addProperty('controllObj', false, 'boolean')
        this.addWidget('toggle', '控制物体位置', this.properties.controllObj, 'controllObj')

        this.addProperty('needCheckIn', false, 'boolean')
        this.addWidget('toggle', '碰撞框检测', this.properties.needCheckIn, 'needCheckIn')

        this.addProperty('mutplayTouch', false, 'boolean')
        this.addWidget('toggle', '忽略多点触摸', this.properties.mutplayTouch, 'mutplayTouch')
    //   this.addOutput("游戏开始", LiteGraph.EVENT)   //增加一个输出触点，  输出节点的名称， 值类型
    //   this.addProperty("value", "");   //增加一个变量，    变量名称， 变量名称
    //   this.progress = 0.5               //设置节点的进度，一般来说用于在执行的时候设置
    // this.widget = this.addWidget("text","value","","value"); 
    //   this.widget = this.addWidget("number","value",1,"value");  //增加一个控件用于修改变量，  类型，显示名称，默认值，要修改的变量的名称
    //   this.widgets_up = true;                                    //设置输入组件在顶部（覆盖input和output）
    //   this.size = [180, 30];                                     //设置默认节点尺寸
    //   this.properties.precision = 1
        this.useCanvas = false
        this.lastBindCodeNode = null
        this.touchIds = {}
    }
  
    // Function to call when the node is executed
    //执行时的方法
    // onExecute() {
    // //   var A = this.getInputData(0)
    // //   this.setOutputData(0, this.properties["value"]) //发送一个参数出去
    //     this.triggerSlot(0, 1);
    // }

    // onStart(){
    //     console.log('toucmove onstart')
    // }

    //停止运行
    onStop(){
        this.touchIds = {}
        if(this.useCanvas == true){
            this.useCanvas = false
            let canvas =  this.graph.config.rootccNode
            if(canvas == null){
                // console.warn("没有rootccNode")
                // return
                canvas = cc.director.getScene().getChildByName('Canvas')
            }
            canvas.targetOff(this)
        }else{
            console.log('停止运行了 lastBindCodeNode', this.lastBindCodeNode)
            if(this.lastBindCodeNode != null){
                this.lastBindCodeNode.targetOff(this)
                this.lastBindCodeNode = null
            }
        }
    }

    
    realRun(codeNode, isListen){
        if(isListen != 0){
            if(this.lastBindCodeNode != null){
                this.lastBindCodeNode.targetOff(this)
            }
            if(codeNode != null){
                this.useCanvas = false
                this.lastBindCodeNode = codeNode
                if(codeNode.node != null){
                    // console.log('realRun lastBindCodeNode id', codeNode._id)
                }else{
                     console.log('realRun lastBindCodeNode 节点已经被销毁')
                }
                
                codeNode.checkAddComponent('SpinePlusComponent')
                // var result = cc.js.getClassByName('SpinePlusComponent')
                // console.log('是否存在', result)

                var lastMovePos = null
                var moveCount = 5
                var eventId = null
                
                codeNode.targetOff(this)
                codeNode.on(cc.Node.EventType.TOUCH_START, (event)=>{
                    lastMovePos = null
                    eventId = event.getID() 
                    var eventid = event.getID() 
                    this.touchIds[eventid] = 1
                }, this)
                codeNode.on(cc.Node.EventType.TOUCH_MOVE, (event)=>{
                    if(Object.keys(this.touchIds).length > 1 && this.properties.mutplayTouch == true){
                        //多点触摸时不响应
                        return
                    }
                    if(eventId != event.getID()){
                        return
                    }
                    if(this.graph.config.pause == 1){
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

                    if(this.properties.needCheckIn.default == 1){
                        var collider = codeNode.getComponent(cc.PolygonCollider)
                        if(collider != null){
                            var inNodePos = codeNode.node.convertToNodeSpaceAR(event.getLocation())
                            var inTouch = cc.Intersection.pointInPolygon(inNodePos, collider.points)
                        }
                    }
                
                    var delta = nowMovePos.sub(lastMovePos)
                    if(inTouch == true){
                        this.setOutputData(0, delta.x)
                        this.setOutputData(1, delta.y)
                        this.triggerSlot(2, 1)
                        if(this.properties.controllObj == true){
                            codeNode.x += delta.x
                            codeNode.y += delta.y
                        }
                    }
                    lastMovePos = nowMovePos
                }, this)
                codeNode.on(cc.Node.EventType.TOUCH_END, (event)=>{
                    var eventid = event.getID()
                    delete this.touchIds[eventid]
                }, this)
                codeNode.on(cc.Node.EventType.TOUCH_CANCEL, (event)=>{
                    var eventid = event.getID()
                    delete this.touchIds[eventid]
                }, this)
            }else{
                this.useCanvas = true
                let canvas =  this.graph.config.rootccNode
                if(canvas == null){
                    // console.warn("没有rootccNode")
                    // return
                    canvas = cc.director.getScene().getChildByName('Canvas')
                }
                canvas.targetOff(this)
                var lastMovePos = null
                var moveCount = 5
                canvas.on(cc.Node.EventType.TOUCH_START, (event)=>{
                    lastMovePos = null
                    var eventid = event.getID()
                    this.touchIds[eventid] = 1
                }, this)
                canvas.on(cc.Node.EventType.TOUCH_MOVE, (event)=>{
                    if(Object.keys(this.touchIds).length > 1 && this.properties.mutplayTouch == true){
                        //多点触摸时不响应
                        return
                    }
                    if(this.graph.config.pause == 1){
                        return
                    }
                    if(moveCount < 5){
                        moveCount += 1
                        return
                    }
                    moveCount = 0
                    if(lastMovePos == null){
                        lastMovePos = canvas.parent.convertToNodeSpaceAR(event.getLocation())
                        return
                    }
                    var nowMovePos = canvas.parent.convertToNodeSpaceAR(event.getLocation())
                    var delta = nowMovePos.sub(lastMovePos)
                    this.setOutputData(0, delta.x)
                    this.setOutputData(1, delta.y)
                    lastMovePos = nowMovePos
                }, this)
                canvas.on(cc.Node.EventType.TOUCH_END, (event)=>{
                    var eventid = event.getID()
                    delete this.touchIds[eventid]
                }, this)
                canvas.on(cc.Node.EventType.TOUCH_CANCEL, (event)=>{
                    var eventid = event.getID()
                    delete this.touchIds[eventid]
                }, this)
            }
        }else{
            if(this.useCanvas == true){
                let canvas =  this.graph.config.rootccNode
                if(canvas == null){
                    // console.warn("没有rootccNode")
                    // return
                    canvas = cc.director.getScene().getChildByName('Canvas')
                }
                canvas.targetOff(this)
                this.useCanvas = false
            }else{
                if(this.lastBindCodeNode != null){
                    this.lastBindCodeNode.targetOff(this)
                }
            }
        }
    }

    onAction(action, param){
        if(action == '监听'){
            var codeNode = this.getInputData(0)
            console.log('我开始监听移动', codeNode)
            this.realRun(codeNode)
        }else if(action == '取消监听'){
            var codeNode = this.getInputData(0)
            this.realRun(codeNode, false)
        }
    }

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
touchMove.title = '触摸移动'    //设置中文名称标题，是否需要实现多语言？
LiteGraph.registerNodeType("input/screen/touchMove", touchMove)    //第一个是唯一key，同时也是菜单选项路径



class touchEnd extends LGraphNode {
    // Name to show
    title = "触摸结束"
    desc = "检测物体触摸开始";   //不会在显示节点中用到，仅仅在代码中的解释

    constructor() {
      super()
      this.mode = LiteGraph.ON_EVENT;
    //   this.serialize_widgets = true
    //   this.addInput("触发", "number")   //增加一个输入触点，  输入触点的名称， 值类型    //不需要触发了
        this.addInput("物体", "codeNode")
        this.addInput("监听", LiteGraph.ACTION);
        this.addInput("取消监听", LiteGraph.ACTION);

        this.addOutput('结束X', 'number')
        this.addOutput('结束Y', 'number')
        
        //触摸开始到触摸结束时移动的距离小于10，【结束】输出为1，大于10，【结束】输出为2
        this.addOutput('结束', LiteGraph.EVENT) 
        this.addOutput('点击结束', LiteGraph.EVENT) 
        //触摸开始到触摸结束时移动的距离大于10
        this.addOutput('移动结束', LiteGraph.EVENT)


        this.addProperty('controllObj', false, 'boolean')
        this.addWidget('toggle', '控制物体位置', this.properties.controllObj, 'controllObj')

        this.addProperty('listernTouchCancel', false, 'boolean')
        this.addWidget('toggle', '响应触摸取消', this.properties.listernTouchCancel, 'listernTouchCancel')
    //   this.addOutput("游戏开始", LiteGraph.EVENT)   //增加一个输出触点，  输出节点的名称， 值类型
    //   this.addProperty("value", "");   //增加一个变量，    变量名称， 变量名称
    //   this.progress = 0.5               //设置节点的进度，一般来说用于在执行的时候设置
    // this.widget = this.addWidget("text","value","","value"); 
    //   this.widget = this.addWidget("number","value",1,"value");  //增加一个控件用于修改变量，  类型，显示名称，默认值，要修改的变量的名称
    //   this.widgets_up = true;                                    //设置输入组件在顶部（覆盖input和output）
    //   this.size = [180, 30];                                     //设置默认节点尺寸

    //   this.properties.precision = 1
        this.touchIds = {}
    }
  
    // Function to call when the node is executed
    //执行时的方法
    // onExecute() {
    // //   var A = this.getInputData(0)
    // //   this.setOutputData(0, this.properties["value"]) //发送一个参数出去
    //     this.triggerSlot(0, 1);
    // }

    onStart(){
        // this.triggerSlot(0, 1);
        
    }

    onStop(){
        this.touchIds = {}
        if(this.useCanvas == true){
            let canvas =  this.graph.config.rootccNode
            if(canvas == null){
                // console.warn("没有rootccNode")
                // return
                canvas = cc.director.getScene().getChildByName('Canvas')
            }
            canvas.targetOff(this)
        }else{
            if(this.lastBindCodeNode != null){
                this.lastBindCodeNode.targetOff(this)
                this.lastBindCodeNode = null
            }
        }
    }

    
    realRun(codeNode, isListen){
        if(isListen != 0){
            if(this.lastBindCodeNode != null){
                this.lastBindCodeNode.node.targetOff(this)
            }
            if(codeNode != null){
                this.useCanvas = false
                this.lastBindCodeNode = codeNode
                
                codeNode.checkAddComponent('SpinePlusComponent')
                // var result = cc.js.getClassByName('SpinePlusComponent')
                // console.log('是否存在', result)

                codeNode.targetOff(this)
                var startLocation = null
                codeNode.on(cc.Node.EventType.TOUCH_START, (event)=>{
                    startLocation = codeNode.node.parent.convertToNodeSpaceAR(event.getLocation())
                }, this)
                var onTouchEnd = (event)=>{
                    // console.log('点击结束')
                    if(this.graph.config.pause == 1){
                        return
                    }
                    var location = codeNode.node.parent.convertToNodeSpaceAR(event.getLocation())
                    this.setOutputData(0, location.x)
                    this.setOutputData(1, location.y)
                    if(this.properties.controllObj == true){
                        codeNode.x = location.x
                        codeNode.y = location.y
                    }
                    if(startLocation && location.sub(startLocation).mag() < 10){
                        // this.triggerSlot(2, 1)
                        this.trigger('结束')
                        this.trigger('点击结束')
                    }else{
                        // this.triggerSlot(3, 1)
                        this.trigger('结束')
                        this.trigger('移动结束')
                    }
                }
                codeNode.on(cc.Node.EventType.TOUCH_END, (event)=>{
                    onTouchEnd(event)
                }, this)
                codeNode.on(cc.Node.EventType.TOUCH_CANCEL, (event)=>{
                    if(this.properties.listernTouchCancel == true){
                        onTouchEnd(event)
                    }
                }, this)
            }else{
                this.useCanvas = true
                let canvas =  this.graph.config.rootccNode
                if(canvas == null){
                    // console.warn("没有rootccNode")
                    // return
                    canvas = cc.director.getScene().getChildByName('Canvas')
                }
                canvas.targetOff(this)
                var startLocation = null
                canvas.on(cc.Node.EventType.TOUCH_START, (event)=>{
                    startLocation = canvas.convertToNodeSpaceAR(event.getLocation())
                }, this)
                var onTouchEnd = (event)=>{
                    if(this.graph.config.pause == 1){
                        return
                    }
                    var location = canvas.convertToNodeSpaceAR(event.getLocation())
                    this.setOutputData(0, location.x)
                    this.setOutputData(1, location.y)
                    if(location.sub(startLocation).mag() < 10){
                        this.trigger('结束')
                        this.trigger('点击结束')
                    }else{
                        this.trigger('结束')
                        this.trigger('移动结束')
                    }
                }
                canvas.on(cc.Node.EventType.TOUCH_END, (event)=>{
                    onTouchEnd(event)
                }, this)
                canvas.on(cc.Node.EventType.TOUCH_CANCEL, (event)=>{
                    if(this.properties.listernTouchCancel == true){
                        onTouchEnd(event)
                    }
                }, this)
            }
        }else{
            if(this.useCanvas == true){
                let canvas =  this.graph.config.rootccNode
                if(canvas == null){
                    // console.warn("没有rootccNode")
                    // return
                    canvas = cc.director.getScene().getChildByName('Canvas')
                }
                canvas.targetOff(this)
            }else{
                if(this.lastBindCodeNode != null){
                    this.lastBindCodeNode.targetOff(this)
                }
            }
        }
    }

    onAction(action, param){
        if(action == '监听'){
            var codeNode = this.getInputData(0)
            this.realRun(codeNode)
        }else if(action == '取消监听'){
            var codeNode = this.getInputData(0)
            this.realRun(codeNode, false)
        }
    }

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
touchEnd.title = '触摸结束'    //设置中文名称标题，是否需要实现多语言？
LiteGraph.registerNodeType("input/screen/touchEnd", touchEnd)    //第一个是唯一key，同时也是菜单选项路径




class leftOrRightAct extends LGraphNode {
    // Name to show
    title = "重力感应"
    desc = "检测设备的陀螺仪";   //不会在显示节点中用到，仅仅在代码中的解释

    constructor() {
      super()
        // this.mode = LiteGraph.ON_EVENT;
        // this.serialize_widgets = true
    //   this.addInput("触发", "number")   //增加一个输入触点，  输入触点的名称， 值类型    //不需要触发了
        // this.addInput("监听", LiteGraph.ACTION);
        // this.addInput("取消监听", LiteGraph.ACTION);

        this.addOutput('x轴', 'number')
        this.addOutput('y轴', 'number')
        this.addOutput('z轴', 'number')

        // this.addProperty('modal', '收到回调输出', 'enum')
        // this.addWidget('combo', '输出模式', this.properties.controllObj, 'controllObj')

    //   this.addOutput("游戏开始", LiteGraph.EVENT)   //增加一个输出触点，  输出节点的名称， 值类型
    //   this.addProperty("value", "");   //增加一个变量，    变量名称， 变量名称
    //   this.progress = 0.5               //设置节点的进度，一般来说用于在执行的时候设置
    // this.widget = this.addWidget("text","value","","value"); 
    //   this.widget = this.addWidget("number","value",1,"value");  //增加一个控件用于修改变量，  类型，显示名称，默认值，要修改的变量的名称
    //   this.widgets_up = true;                                    //设置输入组件在顶部（覆盖input和output）
    //   this.size = [180, 30];                                     //设置默认节点尺寸

    //   this.properties.precision = 1
    }

    //可以新增一个模拟设备方向的输出

    onChangeEvent(event){
        this.x = event.acc.x
        this.y = event.acc.y
        this.z = event.acc.z

        this.setOutputData(0, this.x)
        this.setOutputData(1, this.y)
        this.setOutputData(2, this.z)
    }
  
    // Function to call when the node is executed
    //执行时的方法
    onStart(){
        // this.triggerSlot(0, 1);
        cc.systemEvent.setAccelerometerEnabled(true);
        this.curState = 0
        this.x = 0
        this.y = 0
        this.z = 0

        this.setOutputData(0, this.x)
        this.setOutputData(1, this.y)
        this.setOutputData(2, this.z)

        cc.systemEvent.on(cc.SystemEvent.EventType.DEVICEMOTION, this.onChangeEvent, this);
    }

    onStop(){
        cc.systemEvent.off(cc.SystemEvent.EventType.DEVICEMOTION, this.onChangeEvent, this);
    }

    

    //动态返回卡片显示的title
    // getTitle() {
    //     if (this.flags.collapsed) {
    //         return this.properties.value;
    //     }
    //     return this.title;
    // };


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
leftOrRightAct.title = '重力感应'    //设置中文名称标题，是否需要实现多语言？
LiteGraph.registerNodeType("input/leftOrRightAct", leftOrRightAct)    //第一个是唯一key，同时也是菜单选项路径

