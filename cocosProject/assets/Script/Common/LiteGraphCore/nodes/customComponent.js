import {LiteGraph, LGraphNode} from '../../litegraph/litegraph'
import * as CocosMgr from '../CocosMgr';

class BaseScriptRobot extends LGraphNode{
    title = "自定义脚本基础类"
    desc = "直接挂载游戏中的脚本的指令继承于此"

    constructor() {
        super()
    }

    getCom(){
        let configKey = this.properties.configKey
        if(configKey.indexOf('cc.') != -1){
            //使用cc内置组件
            return new cc[configKey.split('.')[1]]()
        }
        let comClass = cc.js.getClassByName(configKey)
        if(comClass == null){
            console.warn('找不到脚本组件' + configKey + '请在App中测试真实运行效果')
            return null
        }
        return new comClass()
    }

    onStart(){
        var bindNode = this.getInputNode(0)
        if(bindNode != null && bindNode.codeNode != null){
            //已经绑定到某个节点中
            this.hasRunRobotStart = true
             if(this.component && this.component.robotStart != null){
                this.component.robotStart(this)
            }
        }else{
            let component = null
            if(this.properties.isSingleClass == true){
                component = this.getCom()
            }else{
                let rootccNode = this.graph.vars.rootccNode
                if(rootccNode == null){
                    // 
                    if(CocosMgr.isInApp == false){
                        let canvas = cc.director.getScene().getChildByName('Canvas');
                        rootccNode = canvas.getChildByName('_componentsNode')
                        if(rootccNode == null){
                            rootccNode = new cc.Node()
                            rootccNode.name = '_componentsNode'
                            rootccNode.parent = canvas
                        }
                    }else{
                        console.warn("没有rootccNode")
                        return
                    }
                }
                component = this.getCom()
                rootccNode.addComponent(component)
            }

            if(component == null){
                return
            }

            //将变量同步到脚本中去
            for(var key in this.properties){
                var value = null
                let probInfo = this.getPropertyInfo(key)
                if(probInfo.type == 'robot'){
                    value = this.graph.getNodeById(this.properties[key])
                }else{
                    // if(probInfo.type == 'enum' && this.properties[key].choosesKey != null){
                    //     // console.log('应该动态赋值', this.properties[key].choosesKey[this.properties[key]])
                    //     value = this.properties[key].choosesKey[this.properties[key]]
                    // }else{
                        
                    // }
                    value = this.properties[key]
                }
                if(component[key] != value){
                    component[key] = value
                }
            }

            this.component = component
            this.component.outputHandle = this.outputHandle
            this.component.codeProgress = this.graph
            
            if(this.component && this.component.robotStart != null){
                this.component.robotStart(this)
            }
        }
        if(this.getInputDataType(0) == 'codeNode'){
            if(this.getInputData(0) != null){
                this.onBindCodeNode(this.getInputData(0))
            }
        }
    }


    onBindCodeNode(codeNode){
        let comClass = cc.js.getClassByName(this.properties.configKey)
        if(comClass == null){
            console.warn('找不到脚本组件' + this.properties.configKey + '请在App中测试真实运行效果')
            return
        }

        var component = codeNode.getComponent(this.properties.configKey)
        if(component == null){
            component = codeNode.addComponent(this.properties.configKey)
        }
        if(this.properties.configKey == 'cc.Mask'){
            //特殊处理一下
            if(this.properties.radius != 0){
                var roundRectMask = codeNode.getComponent('RoundRectMask')
                if(roundRectMask == null){
                    roundRectMask = codeNode.addComponent('RoundRectMask')
                }
                roundRectMask._radius = this.properties.radius
            }else{
                codeNode.removeComponent('RoundRectMask')
            }
        }

        var initKey = (key)=>{
            var value = null
            let probInfo = this.getPropertyInfo(key)

            if(probInfo.type == 'robot'){
                value = this.graph.getNodeById(this.properties[key])
            }else if(probInfo.type == 'spriteFrame'){
                this.codeProgress.codeRobotConfig.loadResHandle(this.properties[key], cc.SpriteFrame, (res)=>{
                    value = res
                    if(component[key] != value && value != null){
                        component[key] = value
                    }
                })
            }else{
                // if(probInfo.type == 'toggleGroup' && this.properties.otherConfig[key].choosesKey != null){
                //     // console.log('应该动态赋值', this.properties.otherConfig[key].choosesKey[this.properties.otherConfig[key]])
                //     value = this.properties.otherConfig[key].choosesKey[this.properties.otherConfig[key]]
                // }else{
                //     value = this.properties.otherConfig[key]
                // }
                value = this.properties[key]
            }
            if(component[key] != value && value != null){
                component[key] = value
            }
        }

        // console.log('给component设置值的时候是否已经init了', component.hasInit)
        for(var key in this.properties){
            initKey(key)
        }
        this.component = component
        this.component.outputHandle = this.outputHandle.bind(this)
        this.component.codeProgress = this.graph
      
        // console.log(this.properties.configKey,'this.hasRunRobotStart' ,this.hasRunRobotStart)
        if(this.hasRunRobotStart == true){
            if(this.component.robotStart != null){
                this.component.robotStart(this)
            }
        }
    }

   
    inputHandle(inputData){
        if(this.component == null){
            if(CocosMgr.isInApp == false){
                CocosMgr.showAlert(this.properties.configKey + '还未初始化就输入了')
            }else{
                console.warn(this.properties.configKey + '还未初始化就输入了')
            }
        }else{
            if(this.component.inputHandle != null){
                this.component.inputHandle(inputData)
            }
        }
    }

    //适配output handle的输出
    outputHandle(key, value){
        let index = this.findOutputSlot(key)
        if(index != -1){
            let info = this.getOutputInfo(index)
            if(info.type == LiteGraph.EVENT){
                this.triggerSlot(index, value)
            }else{
                this.setOutputData(index, value)
            }
        }
    }

    onPause(){
        if(this.component && this.component.robotPause != null){
            this.component.robotPause()
        }
    }

    onResume(){
        if(this.component && this.component.robotResume != null){
            this.component.robotResume()
        }
    }

    //运行时刷新配置
    inRunFreshConfig(key){
        if(this.component != null){
            this.component[key] = this.properties.otherConfig[key]
            if(this.component.inRunFreshConfig != null){
                this.component.inRunFreshConfig(key)
            }
        }
    }

    //停止运行
    onStop(){
        this.hasRunRobotStart = false
        if(this.component && this.component.robotRelease != null){
            this.component.robotRelease()
        }
        // if(this.component != null){
        //     if(cc.isValid(this.component.node)){
        //         this.component.node.removeComponent(this.component)
        //     }
        //     this.component.codeProgress = null
        //     this.component = null
        // }
    }
}


//自定义脚本组件
class MotionText extends BaseScriptRobot {
    // Name to show
    title = "字幕"
    desc = "在绘本中添加字幕";   //不会在显示节点中用到，仅仅在代码中的解释
    // color= '#510'
    

    constructor() {
        super()
        // this.serialize_widgets = true
        this.mode = LiteGraph.ON_EVENT;     //设置触发模式
        this.size = [80, 20];               //设置默认节点尺寸
        // this.addInput("触发", "number")   //增加一个输入触点，  输入触点的名称， 值类型
        
        // this.addInput("scale", "number")
        // this.addProperty("scale", 0, 'number');   //增加一个变量，    变量名称， 变量名称
        // this.addWidget("number","缩放倍数", this.properties.scale ,"scale", {precision: 1});  //增加一个控件用于修改变量，  类型，显示名称，默认值，要修改的变量的名称)
        this.addInput("物体", 'codeNode');

        this.addInput("启用", LiteGraph.ACTION);
        this.addInput("隐藏", LiteGraph.ACTION);

        this.addOutput("onend", LiteGraph.EVENT)

        this.addProperty('autoRun', false, 'boolean')
        this.addWidget('toggle', '自动播放', this.properties.autoRun, 'autoRun')


        this.addProperty('dir', false, 'boolean')
        this.addWidget('toggle', '文本竖向排列', this.properties.dir, 'dir')

        this.addProperty('hideBeforRun', true, 'boolean')
        this.addWidget('toggle', '运行前隐藏', this.properties.hideBeforRun, 'hideBeforRun')


        this.addProperty('hideAfterRun', false, 'boolean')
        this.addWidget('toggle', '运行结束隐藏', this.properties.hideAfterRun, 'hideAfterRun')

        this.addProperty('hideBaseLabel', false, 'boolean')
        this.addWidget('toggle', '隐藏底层文字', this.properties.hideBaseLabel, 'hideBaseLabel')


        this.addProperty('position', '0,1', 'string')
        this.addWidget('string', '分段位置', this.properties.position, 'position')


        this.addProperty('positionTime', '0,2', 'string')
        this.addWidget('string', '分段时间', this.properties.positionTime, 'positionTime')


        this.addProperty('maskColor', '#88BF3D', 'string')
        this.addWidget('string', '过渡颜色', this.properties.maskColor, 'maskColor')

        this.addProperty('configKey', 'MotionText', 'string')
        // this.addProperty("modal", 0, "number");
        // this.addWidget("slider", '振动强度', this.properties.modal, "modal", {min: 0, max: 1, precision: 0});

            //设置节点的进度，一般来说用于在执行的时候设置
        //  this.serialize_widgets = true; //widget的值是否也可以被序列化，weidget值和Property中的值不是绑定的，如果初始时不一致，就会出现weidget显示的不是真实的值，所以建议绑定
        // this.widgets_up = true;                                    //设置输入组件在顶部（覆盖input和output）
    //   this.properties.precision = 1
    }

    onConnectInput(inputIndex, outPutType, output, linkedNode, outputIndex){
        console.log('MotionText onConnectInput', inputIndex, outPutType)
        if(inputIndex == 0 && outPutType == 'codeNode'){
            //将文本的anchorX设置为0
            linkedNode.setProperty('anchorX', 0)
        }
    }
    // 当节点Toggle时调用
    onAction(action, param)
	{
      if(this.component == null){
        return
      }
      if(this.component.inputHandle == null){
        console.warn('inputHandle == null')
        return
      }
      if(action == '启用'){
        this.component.inputHandle({targetSolt: 'show'})
      }else if(action == '隐藏'){
        this.component.inputHandle({targetSolt: 'hide'})
      }
	}
}

MotionText.title = '字幕'
LiteGraph.registerNodeType("output/customComponent/MotionText", MotionText);




//
//自定义脚本组件
class CaiDanComponent extends BaseScriptRobot {
    // Name to show
    title = "桃桃彩蛋"
    desc = "在绘本中添加桃桃彩蛋";   //不会在显示节点中用到，仅仅在代码中的解释
    // color= '#510'
    

    constructor() {
        super()
        // this.serialize_widgets = true
        this.mode = LiteGraph.ON_EVENT;     //设置触发模式
        this.size = [80, 20];               //设置默认节点尺寸
        // this.addInput("触发", "number")   //增加一个输入触点，  输入触点的名称， 值类型
        
        // this.addInput("scale", "number")
        // this.addProperty("scale", 0, 'number');   //增加一个变量，    变量名称， 变量名称
        // this.addWidget("number","缩放倍数", this.properties.scale ,"scale", {precision: 1});  //增加一个控件用于修改变量，  类型，显示名称，默认值，要修改的变量的名称)
        this.addInput("物体", 'codeNode');

        // this.addInput("启用", LiteGraph.ACTION);
        // this.addInput("隐藏", LiteGraph.ACTION);

        this.addOutput("onclick", LiteGraph.EVENT)


        this.addProperty('caidanYuyin', '', 'string')
        this.addWidget('string', '彩蛋语音', this.properties.caidanYuyin, 'caidanYuyin')

        this.addProperty('startSound', '', 'string')
        this.addWidget('string', '出现语音', this.properties.startSound, 'startSound')

        this.addProperty("caidanId", 0, "number");
        this.addWidget("slider", '彩蛋Id', this.properties.caidanId, "caidanId", {min: 0, max: 10, precision: 0});

        this.addProperty("caidanPosX", 0, "number");
        this.addWidget("number", '桃桃动画位置X', this.properties.caidanPosX, "caidanPosX", {precision: 1});

        this.addProperty("caidanPosY", 0, "number");
        this.addWidget("number", '桃桃动画位置Y', this.properties.caidanPosY, "caidanPosY", {precision: 1});

        // this.addProperty('autoRun', false, 'boolean')
        // this.addWidget('toggle', '自动播放', this.properties.autoRun, 'autoRun')


        this.addProperty('playSound', true, 'boolean')
        this.addWidget('toggle', '播放声音', this.properties.playSound, 'playSound')

        // this.addProperty('hideBeforRun', false, 'boolean')
        // this.addWidget('toggle', '运行前隐藏', this.properties.hideBeforRun, 'hideBeforRun')


        // this.addProperty('hideAfterRun', false, 'boolean')
        // this.addWidget('toggle', '运行结束隐藏', this.properties.hideAfterRun, 'hideAfterRun')

        // this.addProperty('hideBaseLabel', false, 'boolean')
        // this.addWidget('toggle', '隐藏底层文字', this.properties.hideBaseLabel, 'hideBaseLabel')



        // this.addProperty('positionTime', '0,2', 'string')
        // this.addWidget('string', '分段时间', this.properties.positionTime, 'positionTime')


        // this.addProperty('maskColor', '#88BF3D', 'string')
        // this.addWidget('string', '过渡颜色', this.properties.maskColor, 'maskColor')

        this.addProperty('configKey', 'CaiDanComponent', 'string')
        // this.addProperty("modal", 0, "number");
        // this.addWidget("slider", '振动强度', this.properties.modal, "modal", {min: 0, max: 1, precision: 0});

            //设置节点的进度，一般来说用于在执行的时候设置
        //  this.serialize_widgets = true; //widget的值是否也可以被序列化，weidget值和Property中的值不是绑定的，如果初始时不一致，就会出现weidget显示的不是真实的值，所以建议绑定
        // this.widgets_up = true;                                    //设置输入组件在顶部（覆盖input和output）
    //   this.properties.precision = 1
    }

  
    // 当节点Toggle时调用
    // onAction(action, param)
	// {
      
	// }
}

CaiDanComponent.title = '桃桃彩蛋'
LiteGraph.registerNodeType("output/customComponent/CaiDanComponent", CaiDanComponent);






//自定义脚本组件
class CaiDanComponent2 extends BaseScriptRobot {
    // Name to show
    title = "收藏品彩蛋"
    desc = "在绘本中添加收藏品彩蛋";   //不会在显示节点中用到，仅仅在代码中的解释
    // color= '#510'
    

    constructor() {
        super()
        // this.serialize_widgets = true
        this.mode = LiteGraph.ON_EVENT;     //设置触发模式
        this.size = [80, 30];               //设置默认节点尺寸
        // this.addInput("触发", "number")   //增加一个输入触点，  输入触点的名称， 值类型
        
        // this.addInput("scale", "number")
        // this.addProperty("scale", 0, 'number');   //增加一个变量，    变量名称， 变量名称
        // this.addWidget("number","缩放倍数", this.properties.scale ,"scale", {precision: 1});  //增加一个控件用于修改变量，  类型，显示名称，默认值，要修改的变量的名称)
        this.addInput("物体", 'codeNode');

        // this.addInput("启用", LiteGraph.ACTION);
        // this.addInput("隐藏", LiteGraph.ACTION);

        // this.addOutput("onclick", LiteGraph.EVENT)


        this.addProperty("caidanId", 0, "number");
        this.addWidget("slider", '彩蛋Id', this.properties.caidanId, "caidanId", {min: 0, max: 10, precision: 0});


        // this.addProperty('autoRun', false, 'boolean')
        // this.addWidget('toggle', '自动播放', this.properties.autoRun, 'autoRun')


        // this.addProperty('playSound', true, 'boolean')
        // this.addWidget('toggle', '播放声音', this.properties.playSound, 'playSound')

        // this.addProperty('hideBeforRun', false, 'boolean')
        // this.addWidget('toggle', '运行前隐藏', this.properties.hideBeforRun, 'hideBeforRun')


        // this.addProperty('hideAfterRun', false, 'boolean')
        // this.addWidget('toggle', '运行结束隐藏', this.properties.hideAfterRun, 'hideAfterRun')

        // this.addProperty('hideBaseLabel', false, 'boolean')
        // this.addWidget('toggle', '隐藏底层文字', this.properties.hideBaseLabel, 'hideBaseLabel')



        // this.addProperty('positionTime', '0,2', 'string')
        // this.addWidget('string', '分段时间', this.properties.positionTime, 'positionTime')


        // this.addProperty('maskColor', '#88BF3D', 'string')
        // this.addWidget('string', '过渡颜色', this.properties.maskColor, 'maskColor')

        // this.addProperty('key', 'MotionText', 'string')
        this.addProperty('configKey', 'CaiDanComponent2', 'string')

        // this.addProperty("modal", 0, "number");
        // this.addWidget("slider", '振动强度', this.properties.modal, "modal", {min: 0, max: 1, precision: 0});

            //设置节点的进度，一般来说用于在执行的时候设置
        //  this.serialize_widgets = true; //widget的值是否也可以被序列化，weidget值和Property中的值不是绑定的，如果初始时不一致，就会出现weidget显示的不是真实的值，所以建议绑定
        // this.widgets_up = true;                                    //设置输入组件在顶部（覆盖input和output）
    //   this.properties.precision = 1
    }

  
    // 当节点Toggle时调用
    // onAction(action, param)
	// {
      
	// }
}

CaiDanComponent2.title = '收藏品彩蛋'
LiteGraph.registerNodeType("output/customComponent/CaiDanComponent2", CaiDanComponent2);




//剧情气泡
//自定义脚本组件
class ChatComponent extends BaseScriptRobot {
    // Name to show
    title = "对话提示气泡"
    desc = "在绘本中添加对话提示气泡";   //不会在显示节点中用到，仅仅在代码中的解释
    // color= '#510'
    

    constructor() {
        super()
        // this.serialize_widgets = true
        this.mode = LiteGraph.ON_EVENT;     //设置触发模式
        this.size = [80, 30];               //设置默认节点尺寸
        // this.addInput("触发", "number")   //增加一个输入触点，  输入触点的名称， 值类型
        
        // this.addInput("scale", "number")
        // this.addProperty("scale", 0, 'number');   //增加一个变量，    变量名称， 变量名称
        // this.addWidget("number","缩放倍数", this.properties.scale ,"scale", {precision: 1});  //增加一个控件用于修改变量，  类型，显示名称，默认值，要修改的变量的名称)
        this.addInput("物体", 'codeNode');

        this.addInput("输入", LiteGraph.ACTION);
        this.addInput("更新", LiteGraph.ACTION);

        this.addOutput("点击", LiteGraph.EVENT)


        this.addProperty("key", '', "string");
        this.addWidget("string", '点击标记', this.properties.key, "key");

        this.addProperty('configKey', 'ChatComponent', 'string')


        
        this.addProperty('dirType', '左下', 'enum')
        this.addWidget('combo', '气泡箭头方向', this.properties.dirType, {property: "dirType", values: ['左下','右下','右上','左上']} )
        
        // this.addProperty('autoRun', false, 'boolean')
        // this.addWidget('toggle', '自动播放', this.properties.autoRun, 'autoRun')


        // this.addProperty('playSound', true, 'boolean')
        // this.addWidget('toggle', '播放声音', this.properties.playSound, 'playSound')

        // this.addProperty('hideBeforRun', false, 'boolean')
        // this.addWidget('toggle', '运行前隐藏', this.properties.hideBeforRun, 'hideBeforRun')


        // this.addProperty('hideAfterRun', false, 'boolean')
        // this.addWidget('toggle', '运行结束隐藏', this.properties.hideAfterRun, 'hideAfterRun')

        // this.addProperty('hideBaseLabel', false, 'boolean')
        // this.addWidget('toggle', '隐藏底层文字', this.properties.hideBaseLabel, 'hideBaseLabel')



        // this.addProperty('positionTime', '0,2', 'string')
        // this.addWidget('string', '分段时间', this.properties.positionTime, 'positionTime')


        // this.addProperty('maskColor', '#88BF3D', 'string')
        // this.addWidget('string', '过渡颜色', this.properties.maskColor, 'maskColor')

        // this.addProperty('key', 'MotionText', 'string')
        // this.addProperty("modal", 0, "number");
        // this.addWidget("slider", '振动强度', this.properties.modal, "modal", {min: 0, max: 1, precision: 0});

            //设置节点的进度，一般来说用于在执行的时候设置
        //  this.serialize_widgets = true; //widget的值是否也可以被序列化，weidget值和Property中的值不是绑定的，如果初始时不一致，就会出现weidget显示的不是真实的值，所以建议绑定
        // this.widgets_up = true;                                    //设置输入组件在顶部（覆盖input和output）
    //   this.properties.precision = 1
    }

  
    // 当节点Toggle时调用
    // onAction(action, param)
	// {
      
	// }
}

ChatComponent.title = '对话提示气泡'
LiteGraph.registerNodeType("output/customComponent/ChatComponent", ChatComponent);



class VoiceCheck extends BaseScriptRobot {
    // Name to show
    title = "声音检测"
    desc = "在绘本中添加声音检测";   //不会在显示节点中用到，仅仅在代码中的解释
    // color= '#510'
    

    constructor() {
        super()
        // this.serialize_widgets = true
        this.mode = LiteGraph.ON_EVENT;     //设置触发模式
        this.size = [80, 30];               //设置默认节点尺寸
        // this.addInput("触发", "number")   //增加一个输入触点，  输入触点的名称， 值类型
        
        // this.addInput("scale", "number")
        // this.addProperty("scale", 0, 'number');   //增加一个变量，    变量名称， 变量名称
        // this.addWidget("number","缩放倍数", this.properties.scale ,"scale", {precision: 1});  //增加一个控件用于修改变量，  类型，显示名称，默认值，要修改的变量的名称)
        // this.addInput("物体", 'codeNode');

        this.addInput("开始", LiteGraph.ACTION);
        this.addInput("停止", LiteGraph.ACTION);

        this.addOutput("输出", LiteGraph.EVENT)


        this.addProperty("testStr", '', "string");
        this.addWidget("string", '检测的字符', this.properties.testStr, "testStr");

        this.addProperty("testStrGroup", '', "string");
        this.addWidget("string", '检测的词组（用,分割）', this.properties.testStrGroup, "testStrGroup");

        this.addProperty('checkType', '左下', 'enum')
        this.addWidget('combo', '检测模式', this.properties.checkType, {property: "checkType", values: ['跟读','关键字模式']} )

        this.addProperty('configKey', 'VoiceCheck', 'string')
        this.addProperty('isSingleClass', true, 'boolean')

        // this.addProperty("key", 0, "string");
        
        
        
        // this.addProperty('autoRun', false, 'boolean')
        // this.addWidget('toggle', '自动播放', this.properties.autoRun, 'autoRun')


        // this.addProperty('playSound', true, 'boolean')
        // this.addWidget('toggle', '播放声音', this.properties.playSound, 'playSound')

        // this.addProperty('hideBeforRun', false, 'boolean')
        // this.addWidget('toggle', '运行前隐藏', this.properties.hideBeforRun, 'hideBeforRun')


        // this.addProperty('hideAfterRun', false, 'boolean')
        // this.addWidget('toggle', '运行结束隐藏', this.properties.hideAfterRun, 'hideAfterRun')

        // this.addProperty('hideBaseLabel', false, 'boolean')
        // this.addWidget('toggle', '隐藏底层文字', this.properties.hideBaseLabel, 'hideBaseLabel')



        // this.addProperty('positionTime', '0,2', 'string')
        // this.addWidget('string', '分段时间', this.properties.positionTime, 'positionTime')


        // this.addProperty('maskColor', '#88BF3D', 'string')
        // this.addWidget('string', '过渡颜色', this.properties.maskColor, 'maskColor')

        // this.addProperty('key', 'MotionText', 'string')
        // this.addProperty("modal", 0, "number");
        // this.addWidget("slider", '振动强度', this.properties.modal, "modal", {min: 0, max: 1, precision: 0});

            //设置节点的进度，一般来说用于在执行的时候设置
        //  this.serialize_widgets = true; //widget的值是否也可以被序列化，weidget值和Property中的值不是绑定的，如果初始时不一致，就会出现weidget显示的不是真实的值，所以建议绑定
        // this.widgets_up = true;                                    //设置输入组件在顶部（覆盖input和output）
    //   this.properties.precision = 1
    }

  
    // 当节点Toggle时调用
    // onAction(action, param)
	// {
      
	// }
}

VoiceCheck.title = '声音检测'
LiteGraph.registerNodeType("output/customComponent/VoiceCheck", VoiceCheck);




class AngleCompoment extends BaseScriptRobot {
    // Name to show
    title = "角度定位"
    desc = "在绘本中添加物让其根据输入的角度定位";   //不会在显示节点中用到，仅仅在代码中的解释
    // color= '#510'
    

    constructor() {
        super()
        // this.serialize_widgets = true
        this.mode = LiteGraph.ON_EVENT;     //设置触发模式
        this.size = [80, 30];               //设置默认节点尺寸
        // this.addInput("触发", "number")   //增加一个输入触点，  输入触点的名称， 值类型
        
        // this.addInput("scale", "number")
        // this.addProperty("scale", 0, 'number');   //增加一个变量，    变量名称， 变量名称
        // this.addWidget("number","缩放倍数", this.properties.scale ,"scale", {precision: 1});  //增加一个控件用于修改变量，  类型，显示名称，默认值，要修改的变量的名称)
        this.addInput("物体", 'codeNode');

        this.addInput("开启监听", LiteGraph.ACTION);
        this.addInput("重置", LiteGraph.ACTION);

        this.addOutput("number1", 'number')


        // this.addProperty("key", '', "string");
        // this.addWidget("string", '点击标记', this.properties.key, "key");

        this.addProperty('configKey', 'AngleCompoment', 'string')

        
        // this.addProperty('dirType', '左下', 'enum')
        // this.addWidget('combo', '气泡箭头方向', this.properties.dirType, {property: "dirType", values: ['左下','右下','右上','左上']} )
        
        // this.addProperty('autoRun', false, 'boolean')
        // this.addWidget('toggle', '自动播放', this.properties.autoRun, 'autoRun')


        // this.addProperty('playSound', true, 'boolean')
        // this.addWidget('toggle', '播放声音', this.properties.playSound, 'playSound')

        // this.addProperty('hideBeforRun', false, 'boolean')
        // this.addWidget('toggle', '运行前隐藏', this.properties.hideBeforRun, 'hideBeforRun')


        // this.addProperty('hideAfterRun', false, 'boolean')
        // this.addWidget('toggle', '运行结束隐藏', this.properties.hideAfterRun, 'hideAfterRun')

        // this.addProperty('hideBaseLabel', false, 'boolean')
        // this.addWidget('toggle', '隐藏底层文字', this.properties.hideBaseLabel, 'hideBaseLabel')



        // this.addProperty('positionTime', '0,2', 'string')
        // this.addWidget('string', '分段时间', this.properties.positionTime, 'positionTime')


        // this.addProperty('maskColor', '#88BF3D', 'string')
        // this.addWidget('string', '过渡颜色', this.properties.maskColor, 'maskColor')

        // this.addProperty('key', 'MotionText', 'string')
        // this.addProperty("modal", 0, "number");
        // this.addWidget("slider", '振动强度', this.properties.modal, "modal", {min: 0, max: 1, precision: 0});

            //设置节点的进度，一般来说用于在执行的时候设置
        //  this.serialize_widgets = true; //widget的值是否也可以被序列化，weidget值和Property中的值不是绑定的，如果初始时不一致，就会出现weidget显示的不是真实的值，所以建议绑定
        // this.widgets_up = true;                                    //设置输入组件在顶部（覆盖input和output）
    //   this.properties.precision = 1
    }

  
    // 当节点Toggle时调用
    // onAction(action, param)
	// {
      
	// }
}

AngleCompoment.title = '角度定位'
LiteGraph.registerNodeType("output/customComponent/AngleCompoment", AngleCompoment);




class ScaleObj extends BaseScriptRobot {
    // Name to show
    title = "双指缩放"
    desc = "在绘本中添加双指缩放手势";   //不会在显示节点中用到，仅仅在代码中的解释
    // color= '#510'
    

    constructor() {
        super()
        // this.serialize_widgets = true
        this.mode = LiteGraph.ON_EVENT;     //设置触发模式
        this.size = [80, 30];               //设置默认节点尺寸
        // this.addInput("触发", "number")   //增加一个输入触点，  输入触点的名称， 值类型
        
        // this.addInput("scale", "number")
        // this.addProperty("scale", 0, 'number');   //增加一个变量，    变量名称， 变量名称
        // this.addWidget("number","缩放倍数", this.properties.scale ,"scale", {precision: 1});  //增加一个控件用于修改变量，  类型，显示名称，默认值，要修改的变量的名称)
        this.addInput("物体", 'codeNode');

        this.addInput("启用", LiteGraph.ACTION);
        this.addInput("关闭", LiteGraph.ACTION);

        this.addOutput("onScale", LiteGraph.EVENT)


        // this.addProperty("key", '', "string");
        // this.addWidget("string", '点击标记', this.properties.key, "key");

        this.addProperty('configKey', 'AngleCompoment', 'string')

        
        // this.addProperty('dirType', '左下', 'enum')
        // this.addWidget('combo', '气泡箭头方向', this.properties.dirType, {property: "dirType", values: ['左下','右下','右上','左上']} )
        
        // this.addProperty('autoRun', false, 'boolean')
        // this.addWidget('toggle', '自动播放', this.properties.autoRun, 'autoRun')


        // this.addProperty('playSound', true, 'boolean')
        // this.addWidget('toggle', '播放声音', this.properties.playSound, 'playSound')

       


        // this.addProperty('hideAfterRun', false, 'boolean')
        // this.addWidget('toggle', '运行结束隐藏', this.properties.hideAfterRun, 'hideAfterRun')

        // this.addProperty('hideBaseLabel', false, 'boolean')
        // this.addWidget('toggle', '隐藏底层文字', this.properties.hideBaseLabel, 'hideBaseLabel')



        // this.addProperty('positionTime', '0,2', 'string')
        // this.addWidget('string', '分段时间', this.properties.positionTime, 'positionTime')


        // this.addProperty('maskColor', '#88BF3D', 'string')
        // this.addWidget('string', '过渡颜色', this.properties.maskColor, 'maskColor')

        // this.addProperty('key', 'MotionText', 'string')
        this.addProperty("scaleMin", 0.5, "number");
        this.addWidget('number', '最小缩放', this.properties.scaleMin, "scaleMin", {precision: 1});

        this.addProperty("scaleMax", 2, "number");
        this.addWidget('number', '最大缩放', this.properties.scaleMax, "scaleMax", {precision: 1});


        this.addProperty('dynimicCenter', false, 'boolean')
        this.addWidget('toggle', '是否以当前中心缩放', this.properties.dynimicCenter, 'dynimicCenter')

            //设置节点的进度，一般来说用于在执行的时候设置
        //  this.serialize_widgets = true; //widget的值是否也可以被序列化，weidget值和Property中的值不是绑定的，如果初始时不一致，就会出现weidget显示的不是真实的值，所以建议绑定
        // this.widgets_up = true;                                    //设置输入组件在顶部（覆盖input和output）
    //   this.properties.precision = 1
    }

  
    // 当节点Toggle时调用
    // onAction(action, param)
	// {
      
	// }
}


ScaleObj.title = '双指缩放'
LiteGraph.registerNodeType("output/customComponent/ScaleObj", ScaleObj);




class ProgressCompoment extends BaseScriptRobot {
    // Name to show
    title = "进度条"
    desc = "发送绘本页面进度事件，关联图片类型的物体使用";   //不会在显示节点中用到，仅仅在代码中的解释
    // color= '#510'
    

    constructor() {
        super()
        // this.serialize_widgets = true
        this.mode = LiteGraph.ON_EVENT;     //设置触发模式
        this.size = [80, 30];               //设置默认节点尺寸
        // this.addInput("触发", "number")   //增加一个输入触点，  输入触点的名称， 值类型
        
        // this.addInput("scale", "number")
        // this.addProperty("scale", 0, 'number');   //增加一个变量，    变量名称， 变量名称
        // this.addWidget("number","缩放倍数", this.properties.scale ,"scale", {precision: 1});  //增加一个控件用于修改变量，  类型，显示名称，默认值，要修改的变量的名称)
        this.addInput("物体", 'codeNode');

        this.addInput("进度", 'number');
        this.addInput("更新", LiteGraph.ACTION);

        // this.addOutput("增量", LiteGraph.EVENT)


        // this.addProperty("key", '', "string");
        // this.addWidget("string", '点击标记', this.properties.key, "key");

        this.addProperty('configKey', 'ProgressCompoment', 'string')

        
        // this.addProperty('dirType', '左下', 'enum')
        // this.addWidget('combo', '气泡箭头方向', this.properties.dirType, {property: "dirType", values: ['左下','右下','右上','左上']} )
        
        // this.addProperty('autoRun', false, 'boolean')
        // this.addWidget('toggle', '自动播放', this.properties.autoRun, 'autoRun')


        // this.addProperty('playSound', true, 'boolean')
        // this.addWidget('toggle', '播放声音', this.properties.playSound, 'playSound')

       


        // this.addProperty('hideAfterRun', false, 'boolean')
        // this.addWidget('toggle', '运行结束隐藏', this.properties.hideAfterRun, 'hideAfterRun')

        // this.addProperty('hideBaseLabel', false, 'boolean')
        // this.addWidget('toggle', '隐藏底层文字', this.properties.hideBaseLabel, 'hideBaseLabel')



        // this.addProperty('positionTime', '0,2', 'string')
        // this.addWidget('string', '分段时间', this.properties.positionTime, 'positionTime')


        // this.addProperty('maskColor', '#88BF3D', 'string')
        // this.addWidget('string', '过渡颜色', this.properties.maskColor, 'maskColor')

        // this.addProperty('key', 'MotionText', 'string')
        // this.addProperty("scaleMin", 0.5, "number");
        // this.addWidget('number', '最小缩放', this.properties.scaleMin, "scaleMin", {precision: 1});

        // this.addProperty("scaleMax", 2, "number");
        // this.addWidget('number', '最大缩放', this.properties.scaleMax, "scaleMax", {precision: 1});


        // this.addProperty('dynimicCenter', false, 'boolean')
        // this.addWidget('toggle', '是否以当前中心缩放', this.properties.dynimicCenter, 'dynimicCenter')

            //设置节点的进度，一般来说用于在执行的时候设置
        //  this.serialize_widgets = true; //widget的值是否也可以被序列化，weidget值和Property中的值不是绑定的，如果初始时不一致，就会出现weidget显示的不是真实的值，所以建议绑定
        // this.widgets_up = true;                                    //设置输入组件在顶部（覆盖input和output）
    //   this.properties.precision = 1
    }

  
    // 当节点Toggle时调用
    // onAction(action, param)
	// {
      
	// }
}


ProgressCompoment.title = '进度条'
LiteGraph.registerNodeType("output/customComponent/ProgressCompoment", ProgressCompoment);


class ccMask extends BaseScriptRobot {
    // Name to show
    title = "蒙版"
    desc = "给节点添加蒙版效果";   //不会在显示节点中用到，仅仅在代码中的解释
    // color= '#510'
    

    constructor() {
        super()
        // this.serialize_widgets = true
        this.mode = LiteGraph.ON_EVENT;     //设置触发模式
        // this.size = [80, 30];               //设置默认节点尺寸
        // this.addInput("触发", "number")   //增加一个输入触点，  输入触点的名称， 值类型
        
        // this.addInput("scale", "number")
        // this.addProperty("scale", 0, 'number');   //增加一个变量，    变量名称， 变量名称
        // this.addWidget("number","缩放倍数", this.properties.scale ,"scale", {precision: 1});  //增加一个控件用于修改变量，  类型，显示名称，默认值，要修改的变量的名称)
        this.addInput("物体", 'codeNode');

        // this.addInput("进度", 'number');
        // this.addInput("更新", LiteGraph.ACTION);

        // this.addOutput("增量", LiteGraph.EVENT)


        // this.addProperty("key", '', "string");
        // this.addWidget("string", '点击标记', this.properties.key, "key");
        // console.log('cc.Mask Name', cc.Mask)
        this.addProperty('configKey', 'cc.Mask', 'string')

        
        this.addProperty('type', 0, 'number')
        this.addWidget('combo', '遮罩类型', this.properties.type, {property: "type", values: {0:'矩形', 1: '圆形', 2:'图片'}} )
        // let arr = [cc.Mask.Type.RECT,cc.Mask.Type.ELLIPSE,cc.Mask.Type.IMAGE_STENCIL]
        // console.log('这招类型', arr)

        // this.addProperty('autoRun', false, 'boolean')
        // this.addWidget('toggle', '自动播放', this.properties.autoRun, 'autoRun')


        this.addProperty('inverted', false, 'boolean')
        this.addWidget('toggle', '反向遮罩', this.properties.inverted, 'inverted')

       


        // this.addProperty('hideAfterRun', false, 'boolean')
        // this.addWidget('toggle', '运行结束隐藏', this.properties.hideAfterRun, 'hideAfterRun')

        // this.addProperty('hideBaseLabel', false, 'boolean')
        // this.addWidget('toggle', '隐藏底层文字', this.properties.hideBaseLabel, 'hideBaseLabel')



       


        // this.addProperty('maskColor', '#88BF3D', 'string')
        // this.addWidget('string', '过渡颜色', this.properties.maskColor, 'maskColor')

        // this.addProperty('key', 'MotionText', 'string')
        // this.addProperty("scaleMin", 0.5, "number");
        // this.addWidget('number', '最小缩放', this.properties.scaleMin, "scaleMin", {precision: 1});

        this.addProperty("alphaThreshold", 0.5, "number");
        this.addWidget('number', '透明度阀值', this.properties.alphaThreshold, "alphaThreshold", {precision: 2, min: 0, max: 1});

        this.addProperty("segements", 50, "number");
        this.addWidget('number', '椭圆遮罩曲线数', this.properties.segements, "segements", {precision: 2, min: 1, max: 100});

        this.addProperty("radius", 0, "number");
        this.addWidget('number', '矩形圆角曲线数', this.properties.radius, "radius", {precision: 1, min: 0, max: 100});

        this.addProperty('spriteFrame', '', 'string')
        this.addWidget('string', '图片路径', this.properties.spriteFrame, 'spriteFrame')

        // this.addProperty('dynimicCenter', false, 'boolean')
        // this.addWidget('toggle', '是否以当前中心缩放', this.properties.dynimicCenter, 'dynimicCenter')

            //设置节点的进度，一般来说用于在执行的时候设置
        //  this.serialize_widgets = true; //widget的值是否也可以被序列化，weidget值和Property中的值不是绑定的，如果初始时不一致，就会出现weidget显示的不是真实的值，所以建议绑定
        // this.widgets_up = true;                                    //设置输入组件在顶部（覆盖input和output）
    //   this.properties.precision = 1
    }

    updateWidght(){
        var type = this.properties.type
        this.widgets.map((widget)=>{
            if(widget.name == '矩形圆角曲线数'){
                widget.disabled = type != 0
            }else if(widget.name == '椭圆遮罩曲线数'){
                widget.disabled = type != 1
            }
        })
        // this.expandToFitContent()
    }

    onWidgetChanged(name){
        console.log('当前这招类型',this.properties.type)
        if(name == '遮罩类型'){
           this.updateWidght() 
        }
    }
  
    // 当节点Toggle时调用
    // onAction(action, param)
	// {
      
	// }
}


ccMask.title = '蒙版'
LiteGraph.registerNodeType("output/customComponent/ccMask", ccMask);
