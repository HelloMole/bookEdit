import GlobalConfig from "../../../script/logic/GlobalConfig"
import StaticValue from "./StaticValue"
import PF from "../../../script/Common/PathFinding/PathFinding"
import LocalStorageUtils from "../../../script/frame/utils/LocalStorageUtils"
const {Bezier} = require('../../../script/Common/Bezier/bezier')

function CodeRobot(config, linkDatas, instance){
    this.config = config
    this.linkDatas = linkDatas
    this.instance = instance
    this.id = StaticValue.getID()
}

CodeRobot.prototype.robotInit = function () {   
    return true
}

CodeRobot.prototype.robotStart = function () {    
  
}

CodeRobot.prototype.inputHandle = function () {    
  
}

CodeRobot.prototype.getRobotById = function (id) {
    
}

CodeRobot.prototype.outputHandle = function (cb, targetSolt, data) {    
    // cc.log('showOutputDot   outputHandle')
    // if(GlobalConfig.recordMode == true){
    //     //屏蔽所有的输出
    //     return
    // }
    if(this.instance == null){
        cb()
        return
    }
    if(cc.codeJsonDevConfig.curIsdebugMode == false){
        cb()
        return
    }
    var allCount = 0
    for(var key in this.linkDatas.outputSolt){
        if(targetSolt != null){
            //如果只调用目标solt那就不考虑其他solt的dot输出
            if(key != targetSolt){
                continue
            }
        }
        // cc.log('调用了outputHandle', this.config.key)
        var startDrop = this.instance.getSoltDropNodeByKey('outputSolt', key)
        // cc.log("startDrop", startDrop)
        var onelinkDatas = this.linkDatas.outputSolt[key]
        for(var i = 0; i < onelinkDatas.length; i++){
            allCount += 1
            var onelinkData = onelinkDatas[i]
            var otherDrop = onelinkData.robot.instance.getSoltDropNodeByKey('inputSolt', onelinkData.otherSolt)
            cc.director.emit('showOutputDot', startDrop, otherDrop, data,()=>{
                allCount -= 1
                if(allCount == 0){
                    cb(true)
                }
            })
        }
    }
}

// CodeRobot.prototype.robotUpdate = function () {    
//     // cc.log('CodeRobot Update')
// }

CodeRobot.prototype.robotRelease = function () { 
    // if(this.instance == null){
    //     this.codeProgress = null
    // }   
}

function BaseScriptRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)

    this.robotInit = ()=>{
        return true
    }

    this.robotStart = ()=>{
        var bindRobot = this.linkDatas.cardexSolt[0]
        if(bindRobot != null){
            this.hasRunRobotStart = true
            // console.log(this.config.key,'this.hasRunRobotStart1111' ,this.hasRunRobotStart, this.component)
            if(this.component && this.component.robotStart != null){
                this.component.robotStart(this)
            }

            bindRobot = bindRobot.robot
            if(bindRobot.codeNode != null){ 
                // var component = bindRobot.codeNode.getComponent(this.config.key)
                // if(component == null){
                //     component = bindRobot.codeNode.addComponent(this.config.key)
                // }

                // for(var key in this.config.otherConfig){
                //     component[key] = this.config.otherConfig[key].default
                // }
                // this.component = component
                // this.component.outputHandle = this.outputHandle
                // this.component.codeProgress = this.codeProgress
                // cc.log('component', component)
            }
        }else{
            var component = null
            if(this.config.isSingleClass == true){
                var comClass = cc.js.getClassByName(this.config.key)
                component = new comClass()
            }else{
                //直接加到whitenode上
                var spaceCard = this.codeProgress.onGetSingleCard('space')
                if(spaceCard == null){
                    cc.warn("没有添加space卡片")
                    this.codeProgress.showTips('没有添加space卡片')
                    return
                }
                var whiteNode = spaceCard.getChildByName('whiteNode')
                if(whiteNode == null){
                    cc.warn("没有添加space/whiteNode")
                    return
                }

                component = whiteNode.getComponent(this.config.key)
                if(component == null){
                    component = whiteNode.addComponent(this.config.key)
                }
            }


          

            for(var key in this.config.otherConfig){
                var value = null
                if(this.config.otherConfig[key].type == 'robot'){
                    value = this.codeProgress.getRobotById(this.config.otherConfig[key].default)
                }else{
                    if(this.config.otherConfig[key].type == 'toggleGroup' && this.config.otherConfig[key].choosesKey != null){
                        // console.log('应该动态赋值', this.config.otherConfig[key].choosesKey[this.config.otherConfig[key].default])
                        value = this.config.otherConfig[key].choosesKey[this.config.otherConfig[key].default]
                    }else{
                        value = this.config.otherConfig[key].default
                    }
                }
                if(component[key] != value){
                    component[key] = value
                }
            }
            this.component = component
            this.component.outputHandle = this.outputHandle
            this.component.codeProgress = this.codeProgress

            if(this.component && this.component.robotStart != null){
                this.component.robotStart(this)
            }
        }
    }

    this.onBindCodeNode =  (codeNode)=>{
        var component = codeNode.getComponent(this.config.key)
        if(component == null){
            component = codeNode.addComponent(this.config.key)
        }
        if(this.config.key == 'cc.Mask'){
            //特殊处理一下
            if(this.config.otherConfig.radius.default != 0){
                var roundRectMask = codeNode.getComponent('RoundRectMask')
                if(roundRectMask == null){
                    roundRectMask = codeNode.addComponent('RoundRectMask')
                }
                roundRectMask._radius = this.config.otherConfig.radius.default
            }else{
                codeNode.removeComponent('RoundRectMask')
            }
        }

        var initKey = (key)=>{
            var value = null
            if(this.config.otherConfig[key].type == 'robot'){
                value = this.codeProgress.getRobotById(this.config.otherConfig[key].default)
            }else if(this.config.otherConfig[key].type == 'spriteFrame'){
                this.codeProgress.codeRobotConfig.loadResHandle(this.config.otherConfig[key].default, cc.SpriteFrame, (res)=>{
                    value = res
                    if(component[key] != value && value != null){
                        component[key] = value
                    }
                })
            }else{
                if(this.config.otherConfig[key].type == 'toggleGroup' && this.config.otherConfig[key].choosesKey != null){
                    // console.log('应该动态赋值', this.config.otherConfig[key].choosesKey[this.config.otherConfig[key].default])
                    value = this.config.otherConfig[key].choosesKey[this.config.otherConfig[key].default]
                }else{
                    value = this.config.otherConfig[key].default
                }
            }
            if(component[key] != value && value != null){
                component[key] = value
            }
        }

        for(var key in this.config.otherConfig){
            initKey(key)
        }
        this.component = component
        this.component.outputHandle = this.outputHandle
        this.component.codeProgress = this.codeProgress
      
        // console.log(this.config.key,'this.hasRunRobotStart' ,this.hasRunRobotStart)
        if(this.hasRunRobotStart == true){
            if(this.component.robotStart != null){
                this.component.robotStart(this)
            }
        }
        
        // if(this.component.robotStart != null){
        //     this.component.robotStart(this)
        // }
        // console.log('脚本也换了一种绑定方式', component)
    }


    this.inputHandle = (inputData)=>{
        // if(this.config.key == 'VoiceCheck'){
        //     console.log('输入当前VoiceCheck 的robot', this, inputData)
        // }
        if(this.component == null){
            if(this.codeProgress != null){
                this.codeProgress.showTips(this.config.key + '还未初始化就输入了')
            }else{
                console.warn(this.config.key + '还未初始化就输入了')
            }
        }else{
            if(this.component.inputHandle != null){
                this.component.inputHandle(inputData)
            }
        }
    }

    this.robotPause = ()=>{
        if(this.component && this.component.robotPause != null){
            this.component.robotPause()
        }
    }
    this.robotResume = ()=>{
        if(this.component && this.component.robotResume != null){
            this.component.robotResume()
        }
    }

    this.outputHandle = (key, value)=>{
        // if(this.config.key == 'VoiceCheck'){
        //     console.log('输出当前VoiceCheck 的robot', this)
        // }
        //输出内容        
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            if(this.linkDatas.outputSolt[key]){
                var onelinkDatas = this.linkDatas.outputSolt[key]
                for(var i = 0; i < onelinkDatas.length; i++){
                    var onelinkData = onelinkDatas[i]
                    onelinkData.robot.inputHandle({solt:onelinkData.solt, data: value, targetSolt: onelinkData.otherSolt})
                }
            }
        }, key, value)
    }

    //运行时刷新配置
    this.inRunFreshConfig = (key)=>{
        if(this.component != null){
            this.component[key] = this.config.otherConfig[key].default
            if(this.component.inRunFreshConfig != null){
                this.component.inRunFreshConfig(key)
            }
        }
    }

    //流程结束
    this.robotRelease = ()=>{
        this.hasRunRobotStart = false
        if(this.component && this.component.robotRelease != null){
            this.component.robotRelease()
        }
        if(this.component != null){
            this.component.codeProgress = null
            this.component = null
        }
        CodeRobot.prototype.robotRelease.call(this)
    }
}
BaseScriptRobot.prototype = new CodeRobot()


function CaiDanComponentRobot(config, linkDatas, instance){
    BaseScriptRobot.call(this, config, linkDatas, instance)

    this.freshOtherConfig = (config)=>{
        if(this.instance != null){
            // this.instance.soltIds[0].node.parent.getChildByName('infoLabel').getComponent(cc.Label).string = caidanId + '   '  config.caidanYuyin.default
            this.instance.node.getChildByName('resultLabel').getComponent(cc.Label).string =  config.caidanId.default + '   ' + config.caidanYuyin.default
        }
    }
}
CaiDanComponentRobot.prototype = new BaseScriptRobot()

function CaiDanComponent2Robot(config, linkDatas, instance){
    BaseScriptRobot.call(this, config, linkDatas, instance)

    //卡片下方的数据显示
    this.freshOtherConfig = (config)=>{
        if(this.instance != null){
            this.instance.node.getChildByName('resultLabel').getComponent(cc.Label).string =  config.caidanId.default
        }
    }
}
CaiDanComponent2Robot.prototype = new BaseScriptRobot()


//动态贴图Robot
function DynamicTextureRobot(config, linkDatas, instance){
    BaseScriptRobot.call(this, config, linkDatas, instance)
}
DynamicTextureRobot.prototype = new BaseScriptRobot()

function AnyMaskRobot(config, linkDatas, instance){
    BaseScriptRobot.call(this, config, linkDatas, instance)
}
AnyMaskRobot.prototype = new BaseScriptRobot()

function InGirdMapAIRobot(config, linkDatas, instance){
    BaseScriptRobot.call(this, config, linkDatas, instance)

    // this.robotUpdate = (time)=>{
    //     if(this.component != null){
    //         this.component.robotUpdate(time)
    //     }
    // }
}
InGirdMapAIRobot.prototype = new BaseScriptRobot()


function MotionTextRobot(config, linkDatas, instance){
    BaseScriptRobot.call(this, config, linkDatas, instance)

    this.freshOtherConfig = (config)=>{
        if(this.instance != null){
            // this.instance.soltIds[0].node.parent.getChildByName('infoLabel').getComponent(cc.Label).string = caidanId + '   '  config.caidanYuyin.default
            // this.instance.node.getChildByName('resultLabel').getComponent(cc.Label).string =  config.caidanId.default + '   ' + config.caidanYuyin.default
        }
    }
}
MotionTextRobot.prototype = new BaseScriptRobot()


//绘制robot
function DrawComponentRobot(config, linkDatas, instance){
    BaseScriptRobot.call(this, config, linkDatas, instance)

    this.freshOtherConfig = (config)=>{
        if(this.instance != null){
            // this.instance.soltIds[0].node.parent.getChildByName('infoLabel').getComponent(cc.Label).string = caidanId + '   '  config.caidanYuyin.default
            // this.instance.node.getChildByName('resultLabel').getComponent(cc.Label).string =  config.caidanId.default + '   ' + config.caidanYuyin.default
        }
    }

    this.robotUpdate = (dt)=>{
        if(this.component && this.component.robotUpdate != null){
            this.component.robotUpdate()
        }
    }

}
DrawComponentRobot.prototype = new BaseScriptRobot()



function ChatComponentRobot(config, linkDatas, instance){
    BaseScriptRobot.call(this, config, linkDatas, instance)

    this.freshOtherConfig = (config)=>{
        if(this.instance != null){
            // this.instance.soltIds[0].node.parent.getChildByName('infoLabel').getComponent(cc.Label).string = caidanId + '   '  config.caidanYuyin.default
            this.instance.node.getChildByName('resultLabel').getComponent(cc.Label).string = config.key.default
        }
    }
}
ChatComponentRobot.prototype = new BaseScriptRobot()


function VoiceCheckRobot(config, linkDatas, instance){
    BaseScriptRobot.call(this, config, linkDatas, instance)

    // this.freshOtherConfig = (config)=>{
    //     if(this.instance != null){
    //         // this.instance.soltIds[0].node.parent.getChildByName('infoLabel').getComponent(cc.Label).string = caidanId + '   '  config.caidanYuyin.default
    //     }
    // }
}
VoiceCheckRobot.prototype = new BaseScriptRobot()



function AutoTipsRobot(config, linkDatas, instance){
    BaseScriptRobot.call(this, config, linkDatas, instance)
}
AutoTipsRobot.prototype = new BaseScriptRobot()


function SpinePlusComponentRobot(config, linkDatas, instance){
    BaseScriptRobot.call(this, config, linkDatas, instance)
}
SpinePlusComponentRobot.prototype = new BaseScriptRobot()


function ProgressCompomentRobot(config, linkDatas, instance){
    BaseScriptRobot.call(this, config, linkDatas, instance)
}
ProgressCompomentRobot.prototype = new BaseScriptRobot()

function AngleCompomentRobot(config, linkDatas, instance){
    BaseScriptRobot.call(this, config, linkDatas, instance)
}
AngleCompomentRobot.prototype = new BaseScriptRobot()


function ScaleObjRobot(config, linkDatas, instance){
    BaseScriptRobot.call(this, config, linkDatas, instance)
}
ScaleObjRobot.prototype = new BaseScriptRobot()



function valueRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)

    this.robotInit = ()=>{
        //初始化
        // this.value = Number(this.config.otherConfig.value.default)
        return true
    }

    this.robotStart = ()=>{
        if(this.config.otherConfig.modal.default == 0){
            this.outputHandle()
        }
    }

    this.inputHandle = (inputData)=>{
        //手动触发
        this.outputHandle()
    }

    this.outputHandle = ()=>{
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            //输出内容
            if(this.linkDatas.outputSolt['number']){
                var onelinkDatas = this.linkDatas.outputSolt['number']
                for(var i = 0; i < onelinkDatas.length; i++){
                    var onelinkData = onelinkDatas[i]
                    onelinkData.robot.inputHandle({solt:onelinkData.solt, data: this.config.otherConfig.value.default, targetSolt: onelinkData.otherSolt})
                }
            }
        }, null, this.config.otherConfig.value.default)
    }

    this.freshOtherConfig = (config)=>{
        if(this.instance != null){
            this.instance.soltIds[0].node.parent.getChildByName('infoLabel').getComponent(cc.Label).string = config.value.default
        }
    }

    // this.inRunFreshConfig = (key)=>{
    //     this.value = this.config.otherConfig.value.default
    // }
}

valueRobot.prototype = new CodeRobot()


function valueStringRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)

    this.robotInit = ()=>{
        //初始化
        // this.value = this.config.otherConfig.value.default
        return true
    }

    this.robotStart = ()=>{
        if(this.config.otherConfig.modal.default == 0){
            this.outputHandle()
        }
    }

    this.inputHandle = (inputData)=>{
        //手动触发
        this.outputHandle()
    }

    this.outputHandle = ()=>{
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            //输出内容
            if(this.linkDatas.outputSolt['string']){
                var onelinkDatas = this.linkDatas.outputSolt['string']
                for(var i = 0; i < onelinkDatas.length; i++){
                    var onelinkData = onelinkDatas[i]
                    onelinkData.robot.inputHandle({solt:onelinkData.solt, data: this.config.otherConfig.value.default, targetSolt: onelinkData.otherSolt})
                }
            }
        }, null, this.config.otherConfig.value.default)
    }

    this.freshOtherConfig = (config)=>{
        if(this.instance != null){
            if( config.value.default.length < 10){
                this.instance.node.getChildByName('resultLabel').getComponent(cc.Label).string = config.value.default
            }else{
                this.instance.node.getChildByName('resultLabel').getComponent(cc.Label).string = config.value.default.substring(0, 10) + '...'
            }
            // this.instance.soltIds[0].node.parent.getChildByName('infoLabel').getComponent(cc.Label).string = config.value.default.substring(0, 3) + '...'
        }
    }

    // this.inRunFreshConfig = (key)=>{
    //     this.value = this.config.otherConfig.value.default
    // }
}

valueStringRobot.prototype = new CodeRobot()


function gameStartRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)

    this.robotInit = ()=>{
        //初始化
        this.value = 1
        if(this.config.otherConfig.modal.default == 2){
            this.outputHandle()
        }
        return true
    }

    this.robotStartBefore = ()=>{
        if(this.config.otherConfig.modal.default == 1){
            this.outputHandle()
        }
    }

    this.robotStart = ()=>{
        if(this.config.otherConfig.modal.default == 0){
            this.outputHandle()
        }
    }

    this.outputHandle = ()=>{
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            //输出内容
            if(this.linkDatas.outputSolt['number1']){
                var onelinkDatas = this.linkDatas.outputSolt['number1']
                for(var i = 0; i < onelinkDatas.length; i++){
                    var onelinkData = onelinkDatas[i]
                    onelinkData.robot.inputHandle({solt:onelinkData.solt, data: this.value, targetSolt: onelinkData.otherSolt})
                }
            }
        }, null, this.value);
    }


    this.freshOtherConfig = (config)=>{
        if(this.instance != null){
            var strArr = ['开始时', '初始化时', '初始化前']
            this.instance.node.getChildByName('nameLabel').getComponent(cc.Label).string = strArr[config.modal.default]
        }
    }
}
gameStartRobot.prototype = new CodeRobot()





function addRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)
 
    this.robotInit = ()=>{
        //初始化
        this.number1 = null
        this.number2 = null
        return true
    }

    this.inputHandle = (inputData)=>{
        //接收输入的参数
        this[inputData.targetSolt] = inputData.data
        // cc.log('addRobot我收到了inputData', inputData, this.number1, this.number2, this.id)
        if(this.number1 != null && this.number2 != null){
            this.outputHandle()
            if(this.config.otherConfig.input1Keep.default == 0){
                this.number1 = null
            }
            if(this.config.otherConfig.input2Keep.default == 0){
                this.number2 = null
            }
        }
    }

    // linkData:{solt: 'number1', robot:{}}

    this.outputHandle = ()=>{
        var result =  this.number1 + this.number2
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            if(this.linkDatas.outputSolt['number']){
                var onelinkDatas = this.linkDatas.outputSolt['number']
                for(var i = 0; i < onelinkDatas.length; i++){
                    var onelinkData = onelinkDatas[i]
                    onelinkData.robot.inputHandle({solt:onelinkData.solt, data: result, targetSolt: onelinkData.otherSolt})
                }
            }
        }, null, result)
    }
  
}
addRobot.prototype = new CodeRobot()


function lengthRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)
 
    this.robotInit = ()=>{
        //初始化
        this.number1 = null
        this.number2 = null
        return true
    }

    this.inputHandle = (inputData)=>{
        //接收输入的参数
        this[inputData.targetSolt] = inputData.data
        if(this.number1 != null && this.number2 != null){
            this.outputHandle()
            if(this.config.otherConfig.input1Keep.default == 0){
                this.number1 = null
            }
            if(this.config.otherConfig.input2Keep.default == 0){
                this.number2 = null
            }
        }
    }

    // linkData:{solt: 'number1', robot:{}}

    this.outputHandle = ()=>{
        var result = Math.sqrt(this.number1 * this.number1 + this.number2 * this.number2)
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            if(this.linkDatas.outputSolt['number']){
                var onelinkDatas = this.linkDatas.outputSolt['number']
                for(var i = 0; i < onelinkDatas.length; i++){
                    var onelinkData = onelinkDatas[i]
                    onelinkData.robot.inputHandle({solt:onelinkData.solt, data: result, targetSolt: onelinkData.otherSolt})
                }
            }
        }, null, result)
    }
  
}
lengthRobot.prototype = new CodeRobot()

function delRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)

    this.robotInit = ()=>{
        //初始化
        this.number1 = null
        this.number2 = null
        return true
    }


    this.inputHandle = (inputData)=>{
        //接收输入的参数
        // cc.log('我收到了inputData', inputData)
        this[inputData.targetSolt] = inputData.data
        if(this.number1 != null && this.number2 != null){
            this.outputHandle()
            if(this.config.otherConfig.input1Keep.default == 0){
                this.number1 = null
            }
            if(this.config.otherConfig.input2Keep.default == 0){
                this.number2 = null
            }
        }
    }

    // linkData:{solt: 'number1', robot:{}}

    this.outputHandle = ()=>{
        var result =  this.number1 - this.number2
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            if(this.linkDatas.outputSolt['number']){
                var onelinkDatas = this.linkDatas.outputSolt['number']
                for(var i = 0; i < onelinkDatas.length; i++){
                    var onelinkData = onelinkDatas[i]
                    onelinkData.robot.inputHandle({solt:onelinkData.solt, data: result, targetSolt: onelinkData.otherSolt})
                }
            }
        }, null, result)
    }
}
delRobot.prototype = new CodeRobot()


function xRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)

    this.robotInit = ()=>{
        //初始化
        this.number1 = null
        this.number2 = null
        return true
    }

    this.inputHandle = (inputData)=>{
        //接收输入的参数
        this[inputData.targetSolt] = inputData.data
        if(this.number1 != null && this.number2 != null){
            this.outputHandle()
            if(this.config.otherConfig.input1Keep.default == 0){
                this.number1 = null
            }
            if(this.config.otherConfig.input2Keep.default == 0){
                this.number2 = null
            }
        }
    }

    // linkData:{solt: 'number1', robot:{}}

    this.outputHandle = ()=>{
        var result = this.number1 * this.number2
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            if(this.linkDatas.outputSolt['number']){
                var onelinkDatas = this.linkDatas.outputSolt['number']
                for(var i = 0; i < onelinkDatas.length; i++){
                    var onelinkData = onelinkDatas[i]
                    onelinkData.robot.inputHandle({solt:onelinkData.solt, data: result, targetSolt: onelinkData.otherSolt})
                }
            }
        }, null, result)

    }
}
xRobot.prototype = new CodeRobot()


function chuRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)

    this.robotInit = ()=>{
        //初始化
        this.number1 = null
        this.number2 = null
        return true
    }

    this.inputHandle = (inputData)=>{
        //接收输入的参数
        this[inputData.targetSolt] = inputData.data
        if(this.number1 != null && this.number2 != null){
            this.outputHandle()
            if(this.config.otherConfig.input1Keep.default == 0){
                this.number1 = null
            }
            if(this.config.otherConfig.input2Keep.default == 0){
                this.number2 = null
            }
        }
    }

    this.outputHandle = ()=>{
        var result = 0
        if(this.number2 != 0){
            result = this.number1 / this.number2
        }
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            if(this.linkDatas.outputSolt['number']){
                var onelinkDatas = this.linkDatas.outputSolt['number']
                for(var i = 0; i < onelinkDatas.length; i++){
                    var onelinkData = onelinkDatas[i]
                    onelinkData.robot.inputHandle({solt:onelinkData.solt, data: result, targetSolt: onelinkData.otherSolt})
                }
            }
        }, null, result)
    }
}
chuRobot.prototype = new CodeRobot()

function angleDifferenceRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)

    this.robotInit = ()=>{
        //初始化
        this.number1 = null
        this.number2 = null
        return true
    }

    this.inputHandle = (inputData)=>{
        //接收输入的参数
        this[inputData.targetSolt] = inputData.data
        if(this.number1 != null && this.number2 != null){
            this.outputHandle()
            if(this.config.otherConfig.input1Keep.default == 0){
                this.number1 = null
            }
            if(this.config.otherConfig.input2Keep.default == 0){
                this.number2 = null
            }
        }
    }

    this.outputHandle = ()=>{
        var result = 0
        if(this.config.otherConfig.inputType.default == 0){
            var number = Math.max(this.number1 , this.number2) - Math.min(this.number1 , this.number2)
            result = Math.min(360 - number, number)
        }else{
            //输入向量求夹角
            var x1 = this.number1.x
            var y1 = this.number1.y

            var x2 = this.number2.x
            var y2 = this.number2.y

            // 与v1起始向量方向相反
            // const _v1 = {x: -x1, y: -y1}
            let cosRadian =
            (Math.pow(x1, 2) +
              Math.pow(y1, 2) +
              Math.pow(x2, 2) +
              Math.pow(y2, 2) -
              (Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))) /
            (2 *
              Math.sqrt(Math.pow(x1, 2) + Math.pow(y1, 2)) *
              Math.sqrt(Math.pow(x2, 2) + Math.pow(y2, 2)))
        
              result = Math.acos(cosRadian) * (180 / Math.PI)
        }
       
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            if(this.linkDatas.outputSolt['number']){
                var onelinkDatas = this.linkDatas.outputSolt['number']
                for(var i = 0; i < onelinkDatas.length; i++){
                    var onelinkData = onelinkDatas[i]
                    onelinkData.robot.inputHandle({solt:onelinkData.solt, data: result, targetSolt: onelinkData.otherSolt})
                }
            }
        }, null, result)
    }
}
angleDifferenceRobot.prototype = new CodeRobot()


function vectorToAngelRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)

    this.robotInit = ()=>{
        //初始化
        this.number1 = null
        this.number2 = null
        return true
    }

    this.inputHandle = (inputData)=>{
        //接收输入的参数
        this[inputData.targetSolt] = inputData.data
        if(this.number1 != null && this.number2 != null){
            this.outputHandle()
            if(this.config.otherConfig.input1Keep.default == 0){
                this.number1 = null
            }
            if(this.config.otherConfig.input2Keep.default == 0){
                this.number2 = null
            }
        }
    }

    this.outputHandle = ()=>{
        var result = Math.atan2(this.number2 , this.number1) * (180 / Math.PI) // 360*Math.atan(this.number2/this.number1)/(2*Math.PI)
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            if(this.linkDatas.outputSolt['number']){
                var onelinkDatas = this.linkDatas.outputSolt['number']
                for(var i = 0; i < onelinkDatas.length; i++){
                    var onelinkData = onelinkDatas[i]
                    onelinkData.robot.inputHandle({solt:onelinkData.solt, data: result, targetSolt: onelinkData.otherSolt})
                }
            }
        }, null, result)

    }
}
vectorToAngelRobot.prototype = new CodeRobot()

function angleConvertVectorRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)

    this.robotInit = ()=>{
        //初始化
        this.number1 = null
        this.number2 = null
        return true
    }

    this.inputHandle = (inputData)=>{
        //接收输入的参数
        this[inputData.targetSolt] = inputData.data
        if(this.number1 != null && this.number2 != null){
            this.outputHandle()
            if(this.config.otherConfig.input1Keep.default == 0){
                this.number1 = null
            }
            if(this.config.otherConfig.input2Keep.default == 0){
                this.number2 = null
            }
        }
    }

    this.outputHandle = ()=>{
        var angle = 180 / Math.PI * this.number1
        var x = Math.cos(angle) * this.number2
        var y = Math.sin(angle) * this.number2
        // console.log(angle, 'x', x, 'y', Math.sign(angle))
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            if(this.linkDatas.outputSolt['number1']){
                var onelinkDatas = this.linkDatas.outputSolt['number1']
                for(var i = 0; i < onelinkDatas.length; i++){
                    var onelinkData = onelinkDatas[i]
                    onelinkData.robot.inputHandle({solt:onelinkData.solt, data: x, targetSolt: onelinkData.otherSolt})
                }
            }
            if(this.linkDatas.outputSolt['number2']){
                var onelinkDatas = this.linkDatas.outputSolt['number2']
                for(var i = 0; i < onelinkDatas.length; i++){
                    var onelinkData = onelinkDatas[i]
                    onelinkData.robot.inputHandle({solt:onelinkData.solt, data: y, targetSolt: onelinkData.otherSolt})
                }
            }
        }, null, {'number1': x, 'number2': y})
    }
}
angleConvertVectorRobot.prototype = new CodeRobot()

function upCountRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)

    this.robotInit = ()=>{
        //初始化
        this.add = 0
        this.delete = 0
        this.reset = 0
        this.repetDir = 1
        this.number = this.config.otherConfig.startValue.default
        // cc.log('upCountRobot otherConfig',this.config.otherConfig)
        return true
    }

    this.inputHandle = (inputData)=>{
        //接收输入的参数
        if(inputData.targetSolt == 'reset'){
            if(this.config.otherConfig.resetMode.default == 0){
                this.number = this.config.otherConfig.startValue.default
            }else{
                this.number = inputData.data
            }
            this.outputHandle()
        }else{
            this.add = 0
            this.delete = 0
            this[inputData.targetSolt] = inputData.data
        }
        // this.number = inputData.data
        if(this.config.otherConfig.tigger.default == 0){
            this.upCount()
        }
    }

    // linkData:{solt: 'number1', robot:{}}
    this.outputHandle = ()=>{
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            if(this.linkDatas.outputSolt['number']){
                var onelinkDatas = this.linkDatas.outputSolt['number']
                for(var i = 0; i < onelinkDatas.length; i++){
                    var onelinkData = onelinkDatas[i]
                    onelinkData.robot.inputHandle({solt:onelinkData.solt, data: this.number, targetSolt: onelinkData.otherSolt})
                }
            }
        }, null, this.number)
    }

    this.robotUpdate = (time)=>{
        if(this.config.otherConfig.tigger.default == 1){
            this.upCount(time)
        }
    }

    this.upCount = (time)=>{
        var modal = this.config.otherConfig.modal.default
        var rangeLeft = this.config.otherConfig.range.default[0]
        var rangeRight = this.config.otherConfig.range.default[1]
        if(time == null || this.config.otherConfig.upStepmodal.default == 1){
            time = 1
        }
        if(this.add != 0){
            this.number += this.repetDir * time * this.config.otherConfig.stepValue.default
            if(modal == 1){
                if(this.number > rangeRight){
                    this.number = rangeRight
                }
            }else if(modal == 2){
                if(this.number > rangeRight){
                    this.number = rangeLeft
                }
            }else if(modal == 3){
                if(this.number >= rangeRight){
                    this.repetDir = -1
                }else if(this.number <= rangeLeft){
                    this.repetDir = 1
                }
            }
            this.outputHandle()
        }else if(this.delete != 0){
            this.number -= this.repetDir * time * this.config.otherConfig.stepValue.default
            if(modal == 1){
                if(this.number < rangeLeft){
                    this.number = rangeLeft
                }
            }else if(modal == 2){
                if(this.number < rangeLeft){
                    this.number = rangeRight
                }
            }else if(modal == 3){
                if(this.number >= rangeRight){
                    this.repetDir = 1
                }else if(this.number <= rangeLeft){
                    this.repetDir = -1
                }
            }
            this.outputHandle()
        }
    }
}
upCountRobot.prototype = new CodeRobot()

function tointRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)

    this.robotInit = ()=>{
        //初始化
        this.floor = 0
        this.ceil = 0
        this.round = 0
        this.number = 0
        return true
    }

    this.inputHandle = (inputData)=>{
        //接收输入的参数
        this.floor = 0
        this.ceil = 0
        this.round = 0
        this[inputData.targetSolt] = 1
        this.number = inputData.data
        this.outputHandle()
    }

    // linkData:{solt: 'number1', robot:{}}
    this.outputHandle = ()=>{
        // var onelinkData = this.linkDatas.outputSolt['number']
        var result = this.number
        if(this.floor == 1){
            result = Math.floor(this.number)
        }else if(this.ceil == 1){
            result = Math.ceil(this.number)
        }else if(this.round == 1){
            result = Math.round(this.number)
        }
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            if(this.linkDatas.outputSolt['number']){
                var onelinkDatas = this.linkDatas.outputSolt['number']
                for(var i = 0; i < onelinkDatas.length; i++){
                    var onelinkData = onelinkDatas[i]
                    onelinkData.robot.inputHandle({solt:onelinkData.solt, data: result, targetSolt: onelinkData.otherSolt})
                }
            }
        }, null, result)
    }
}
tointRobot.prototype = new CodeRobot()

function mappingRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)

    this.robotInit = ()=>{
        //初始化
        this.number1 = 0
        this.number2 = 0
        this.number3 = 10
        return true
    }


    this.inputHandle = (inputData)=>{
        //接收输入的参数
        this[inputData.targetSolt] = inputData.data
        if(inputData.targetSolt  == 'number1'){
            this.outputHandle()
        }
    }

    this.outputHandle = ()=>{
        var result = this.number3 - (this.number1) % (this.number3 - this.number2)
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            if(this.linkDatas.outputSolt['number']){
                var onelinkDatas = this.linkDatas.outputSolt['number']
                for(var i = 0; i < onelinkDatas.length; i++){
                    var onelinkData = onelinkDatas[i]
                    onelinkData.robot.inputHandle({solt:onelinkData.solt, data: result, targetSolt: onelinkData.otherSolt})
                }
            }
        }, null, this.number)
    }
}
mappingRobot.prototype = new CodeRobot()

function showTextTipRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)
   
    this.robotInit = ()=>{
        //初始化
        if(this.instance){
            this.instance.node.getChildByName('resultLabel').getComponent(cc.Label).string = ''
        }
        return true
    }

    this.inputHandle = (inputData)=>{
        //接收输入的参数
        var showText = inputData.data
        if(this.config.otherConfig.modal.default == 1){
            showText = this.config.otherConfig.customInfo.default
        }else if(this.config.otherConfig.modal.default == 2){
            showText =this.config.otherConfig.customInfo.default + ' ' + showText
        }

        if(this.instance){
            this.instance.node.getChildByName('resultLabel').getComponent(cc.Label).string = showText
        }else{
            this.codeProgress.showTips(showText)
        }
        cc.log('我准备显示内容', showText)
    }

    this.freshOtherConfig = (config)=>{
        var customInfo = config.customInfo.default
        var showText = ''
        if(config.modal.default == 1){
            showText = customInfo.substring(0, 9)
            if(customInfo.length > 9){
                showText += '...'
            }
        }else if(config.modal.default == 2){
            showText = customInfo.substring(0, 9) + '...'
        }
        
        if(this.instance){
            this.instance.node.getChildByName('resultLabel').getComponent(cc.Label).string = showText
        }
    }

    // linkData:{solt: 'number1', robot:{}}

    this.outputHandle = ()=>{
       
    }
}
showTextTipRobot.prototype = new CodeRobot()


function consoleInfoRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)
   
    this.robotInit = ()=>{
        //初始化
        
        return true
    }

    this.inputHandle = (inputData)=>{
        // eval('console.log("Hello, World", this)')
        //接收输入的参数
        var showText = inputData.data
        if(this.config.otherConfig.modal.default == 1){
            showText = this.config.otherConfig.customInfo.default
        }else if(this.config.otherConfig.modal.default == 2){
            showText = this.config.otherConfig.customInfo.default + ' ' + showText
        }
        if(this.instance){
            this.instance.resultLabel.string += (showText + '\n')
        }else{
            // cc.log('没有instance', showText)
        }
        cc.log('控制台显示', showText)
    }

    this.freshOtherConfig = (config)=>{
        var customInfo = config.customInfo.default
        var showText = ''
        if(config.modal.default == 1){
            showText = customInfo.substring(0, 9)
            if(customInfo.length > 9){
                showText += '...'
            }
        }else if(config.modal.default == 2){
            showText = customInfo.substring(0, 9) + '...'
        }
        
        if(this.instance){
            this.instance.string = showText
        }
    }

    // linkData:{solt: 'number1', robot:{}}

    this.outputHandle = ()=>{
       
    }

    this.robotRelease = ()=>{
        if(this.instance){
            this.instance.resultLabel.string = ''
        }
    }
}
consoleInfoRobot.prototype = new CodeRobot()

function textCodeRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)
   
    this.robotInit = ()=>{
        //初始化
        if(this.instance){
            this.instance.node.getChildByName('resultLabel').getComponent(cc.Label).string = ''
        }
        return true
    }

    this.inputHandle = (inputData)=>{
        //接收输入的参数
        // cc.log('我准备显示内容', inputData)
        // this[inputData.targetSolt] = inputData.data
        var valueA = inputData.data
        var valueB = 0
        var codeString = this.config.otherConfig.codeString.default
        try {
            eval(codeString)
        } catch (error) {
            console.warn('文本代码执行失败', error)            
        }
        this.outputHandle(valueB)
    }

    this.freshOtherConfig = (config)=>{
       
    }

    // linkData:{solt: 'number1', robot:{}}
    this.outputHandle = (valueB)=>{
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            if(this.linkDatas.outputSolt['number']){
                var onelinkDatas = this.linkDatas.outputSolt['number']
                for(var i = 0; i < onelinkDatas.length; i++){
                    var onelinkData = onelinkDatas[i]
                    onelinkData.robot.inputHandle({solt:onelinkData.solt, data: valueB, targetSolt: onelinkData.otherSolt})            }
            }
        }, null,valueB)
    }
}
textCodeRobot.prototype = new CodeRobot()


function showConfirmRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)
   
    this.robotInit = ()=>{
        //初始化
        if(this.instance){
            this.instance.node.getChildByName('resultLabel').getComponent(cc.Label).string = ''
        }
        return true
    }

    this.inputHandle = (inputData)=>{
        //接收输入的参数
        var showText = inputData.data
        if(this.config.otherConfig.modal.default == 1){
            showText = this.config.otherConfig.customInfo.default
        }else if(this.config.otherConfig.modal.default == 2){
            showText =this.config.otherConfig.customInfo.default + ' ' + showText
        }

        // if(this.instance){
        //     // this.instance.node.getChildByName('resultLabel').getComponent(cc.Label).string = showText
        // }else{
           
        // }
        this.codeProgress.showConfirm(showText, (result)=>{
          if(result == 1){
            this.outputHandle(1)
          }  
        })
        cc.log('我准备显示确认框', showText)
    }

    this.freshOtherConfig = (config)=>{
        var customInfo = config.customInfo.default
        var showText = ''
        if(config.modal.default == 1){
            showText = customInfo.substring(0, 9)
            if(customInfo.length > 9){
                showText += '...'
            }
        }else if(config.modal.default == 2){
            showText = customInfo.substring(0, 9) + '...'
        }
        
        if(this.instance){
            this.instance.node.getChildByName('resultLabel').getComponent(cc.Label).string = showText
        }
    }

    // linkData:{solt: 'number1', robot:{}}

    this.outputHandle = (data)=>{
        if(data == 1){
            CodeRobot.prototype.outputHandle.call(this, ()=>{
                if(this.linkDatas.outputSolt['yes']){
                    var onelinkDatas = this.linkDatas.outputSolt['yes']
                    for(var i = 0; i < onelinkDatas.length; i++){
                        var onelinkData = onelinkDatas[i]
                        onelinkData.robot.inputHandle({solt:onelinkData.solt, data: 1, targetSolt: onelinkData.otherSolt})            }
                }
            }, "yes",1)
        }else{
            CodeRobot.prototype.outputHandle.call(this, ()=>{
                if(this.linkDatas.outputSolt['no']){
                    var onelinkDatas = this.linkDatas.outputSolt['no']
                    for(var i = 0; i < onelinkDatas.length; i++){
                        var onelinkData = onelinkDatas[i]
                        onelinkData.robot.inputHandle({solt:onelinkData.solt, data: 1, targetSolt: onelinkData.otherSolt})            }
                }
            }, "no",1)
        }
    }
}
showConfirmRobot.prototype = new CodeRobot()


function absRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)

    this.robotInit = ()=>{
       this.number = 0
       return true
    }

    this.inputHandle = (inputData)=>{
        //接收输入的参数
        // cc.log('我收到了inputData', inputData)
        this[inputData.targetSolt] = inputData.data
        this.outputHandle()
    }

    this.outputHandle = ()=>{
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            if(this.linkDatas.outputSolt['number']){
                var onelinkDatas = this.linkDatas.outputSolt['number']
                for(var i = 0; i < onelinkDatas.length; i++){
                    var onelinkData = onelinkDatas[i]
                    onelinkData.robot.inputHandle({solt:onelinkData.solt, data: Math.abs(this.number), targetSolt: onelinkData.otherSolt})            }
            }
        }, null, Math.abs(this.number))
    }
 
}
absRobot.prototype = new CodeRobot()


function revertNegativeRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)

    this.robotInit = ()=>{
       this.number = 0
       return true
    }

    this.inputHandle = (inputData)=>{
        //接收输入的参数
        // cc.log('我收到了inputData', inputData)
        this[inputData.targetSolt] = inputData.data
        this.outputHandle()
    }

    this.outputHandle = ()=>{
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            if(this.linkDatas.outputSolt['number']){
                var onelinkDatas = this.linkDatas.outputSolt['number']
                for(var i = 0; i < onelinkDatas.length; i++){
                    var onelinkData = onelinkDatas[i]
                onelinkData.robot.inputHandle({solt:onelinkData.solt, data: this.number * -1, targetSolt: onelinkData.otherSolt})
                }
            }
        }, null, this.number * -1)
    }
}
revertNegativeRobot.prototype = new CodeRobot()


function squareRootRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)

    this.robotInit = ()=>{
       this.number = 0
       return true
    }

    this.inputHandle = (inputData)=>{
        //接收输入的参数
        this[inputData.targetSolt] = inputData.data
        this.outputHandle()
    }

    this.outputHandle = ()=>{
        var result = Math.sqrt(this.number)
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            if(this.linkDatas.outputSolt['number']){
                var onelinkDatas = this.linkDatas.outputSolt['number']
                for(var i = 0; i < onelinkDatas.length; i++){
                    var onelinkData = onelinkDatas[i]
                    onelinkData.robot.inputHandle({solt:onelinkData.solt, data: result, targetSolt: onelinkData.otherSolt})
                }
            }
        }, null, result)

    }
}
squareRootRobot.prototype = new CodeRobot()


function notRightRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)


    this.robotInit = ()=>{
       this.number = 0
       return true
    }

    this.inputHandle = (inputData)=>{
        //接收输入的参数
        this.outputHandle(inputData.data)
    }

    this.outputHandle = (data)=>{
        var result = data == 0 ? 1 : 0
        if(this.config.otherConfig.breakOutPut.default == 1 && result == 0){
            //结果为0时阻断输出
            return
        }
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            if(this.linkDatas.outputSolt['number']){
                var onelinkDatas = this.linkDatas.outputSolt['number']
                for(var i = 0; i < onelinkDatas.length; i++){
                    var onelinkData = onelinkDatas[i]
                    onelinkData.robot.inputHandle({solt:onelinkData.solt, data: result, targetSolt: onelinkData.otherSolt})
                }
            }
        }, null, result)
    }
     
}
notRightRobot.prototype = new CodeRobot()


function allRightRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)


    this.robotInit = ()=>{
       this.number1 = null
       this.number2 = null
       return true
    }

    this.inputHandle = (inputData)=>{
        //接收输入的参数
        this[inputData.targetSolt] = inputData.data
        if(this.config.otherConfig.console.default != 0){
            var consoleTag = this.config.otherConfig.console.chooses[this.config.otherConfig.console.default]
            cc.log('我收到了' + consoleTag + ":" +  inputData.targetSolt,  inputData.data)
        }
        if(this.config.otherConfig.modal.default == 0){
            this.outputHandle()
        }else{
            if(this.number1 != null && this.number2 != null){
                this.outputHandle()
            }
        }
        
    }

    this.outputHandle = (data)=>{
        var result = 1
        if(this.number1 == 0 || this.number1 == null){
            result = 0
        }
        if(this.number2 == 0 || this.number2 == null){
            result = 0
        }

        if(this.config.otherConfig.input1Keep.default == 0){
            this.number1 = null
        }
        if(this.config.otherConfig.input2Keep.default == 0){
            this.number2 = null
        }

        if(this.config.otherConfig.breakOutPut.default == 1 && result == 0){
            //结果为0时阻断输出
            return
        }
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            if(this.linkDatas.outputSolt['number']){
                if(this.config.otherConfig.console.default != 0){
                    var consoleTag = this.config.otherConfig.console.chooses[this.config.otherConfig.console.default]
                    cc.log('我输出了结果' + consoleTag,  result)
                }
            
                
                var onelinkDatas = this.linkDatas.outputSolt['number']
                for(var i = 0; i < onelinkDatas.length; i++){
                    var onelinkData = onelinkDatas[i]
                    onelinkData.robot.inputHandle({solt:onelinkData.solt, data: result, targetSolt: onelinkData.otherSolt})
                }
            }
        }, null, result)
    }
}
allRightRobot.prototype = new CodeRobot()


function orRightRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)
    
    this.robotInit = ()=>{
       this.number1 = null
       this.number2 = null
       this.number3 = null
       return true
    }

    this.inputHandle = (inputData)=>{
        //接收输入的参数
        this[inputData.targetSolt] = inputData.data

        if(this.config.otherConfig.modal.default == 0){
            this.outputHandle()
        }else{
            if(this.linkDatas.inputSolt['number1'].length > 0){
                if(this.number1 == null){
                    return
                }
            }
            if(this.linkDatas.inputSolt['number2'].length > 0){
                if(this.number2 == null){
                    return
                }
            }
            if(this.linkDatas.inputSolt['number3'].length > 0){
                if(this.number3 == null){
                    return
                }
            }
            
            this.outputHandle()
        }

    }

    this.outputHandle = (data)=>{
        var result = 0
        if(this.number1 != null){
            if(this.number1 != 0){
                result = 1
            }
        }
        if(this.number2 != null){
            if(this.number2 != 0){
                result = 1
            }
        }
        if(this.number3 != null){
            if(this.number3 != 0){
                result = 1
            }
        }
        this.robotInit()
        if(this.config.otherConfig.breakOutPut.default == 1 && result == 0){
            //结果为0时阻断输出
            return
        }
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            if(this.linkDatas.outputSolt['number']){
                var onelinkDatas = this.linkDatas.outputSolt['number']
                for(var i = 0; i < onelinkDatas.length; i++){
                    var onelinkData = onelinkDatas[i]
                    onelinkData.robot.inputHandle({solt:onelinkData.solt, data: result, targetSolt: onelinkData.otherSolt})
                }
            }
        }, null, result)
    }
}
orRightRobot.prototype = new CodeRobot()


function equireRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)

    this.robotInit = ()=>{
       this.number1 = null
       this.number2 = null
       return true
    }

    this.inputHandle = (inputData)=>{
        //接收输入的参数
        this[inputData.targetSolt] = inputData.data
        if(this.number1 != null && this.number2 != null){
            this.outputHandle()
        }
    }

    this.outputHandle = ()=>{
        var result = 0
        // cc.log('开始对比',this.number1, this.number2, this.number1 == this.number2)
        if(this.number1 == this.number2){
            result = 1
        }
        if(this.config.otherConfig.input1Keep.default == 0){
            this.number1 = null
        }
        if(this.config.otherConfig.input2Keep.default == 0){
            this.number2 = null
        }
        if(this.config.otherConfig.breakOutPut.default == 1 && result == 0){
            //结果为0时阻断输出
            return
        }
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            if(this.linkDatas.outputSolt['number']){
                var onelinkDatas = this.linkDatas.outputSolt['number']
                for(var i = 0; i < onelinkDatas.length; i++){
                    var onelinkData = onelinkDatas[i]
                    onelinkData.robot.inputHandle({solt:onelinkData.solt, data: result, targetSolt: onelinkData.otherSolt})
                }
            }
        }, null, result)
    }
}
equireRobot.prototype = new CodeRobot()


function litterRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)
 
    this.robotInit = ()=>{
       this.number1 = null
       this.number2 = null
       return true
    }

    this.inputHandle = (inputData)=>{
        //接收输入的参数
        this[inputData.targetSolt] = inputData.data
        if(this.number1 != null && this.number2 != null){
            this.outputHandle()
        }
    }

    this.outputHandle = ()=>{
        var result = 0
        if(this.number1 < this.number2){
            result = 1
        }
        if(this.config.otherConfig.input1Keep.default == 0){
            this.number1 = null
        }
        if(this.config.otherConfig.input2Keep.default == 0){
            this.number2 = null
        }
        if(this.config.otherConfig.breakOutPut.default == 1 && result == 0){
            //结果为0时阻断输出
            return
        }
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            if(this.linkDatas.outputSolt['number']){
                var onelinkDatas = this.linkDatas.outputSolt['number']
                for(var i = 0; i < onelinkDatas.length; i++){
                    var onelinkData = onelinkDatas[i]
                    onelinkData.robot.inputHandle({solt:onelinkData.solt, data: result, targetSolt: onelinkData.otherSolt})
                }
            }
        }, null, result)
    }
     
}
litterRobot.prototype = new CodeRobot()


function biggerRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)

    this.robotInit = ()=>{
       this.number1 = null
       this.number2 = null
       return true
    }

    this.inputHandle = (inputData)=>{
        //接收输入的参数
        this[inputData.targetSolt] = inputData.data
        if(this.number1 != null && this.number2 != null){
            this.outputHandle()
        }
    }

    this.outputHandle = ()=>{
        var result = 0
        if(this.number1 > this.number2){
            result = 1
        }
        if(this.config.otherConfig.input1Keep.default == 0){
            this.number1 = null
        }
        if(this.config.otherConfig.input2Keep.default == 0){
            this.number2 = null
        }
        if(this.config.otherConfig.breakOutPut.default == 1 && result == 0){
            //结果为0时阻断输出
            return
        }
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            if(this.linkDatas.outputSolt['number']){
                var onelinkDatas = this.linkDatas.outputSolt['number']
                for(var i = 0; i < onelinkDatas.length; i++){
                    var onelinkData = onelinkDatas[i]
                    onelinkData.robot.inputHandle({solt:onelinkData.solt, data: result, targetSolt: onelinkData.otherSolt})
                }
            }
        }, null, result)
    }
}
biggerRobot.prototype = new CodeRobot()


function inRangeRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)

    this.robotInit = ()=>{
        this.number1 = this.config.otherConfig.number1.default
        this.number2 = null
        this.number3 = this.config.otherConfig.number3.default
        if(this.linkDatas.inputSolt['number1'].length != 0){
            this.number1 = null
        }
        if(this.linkDatas.inputSolt['number3'].length != 0){
            this.number3 = null
        }
       return true
    }

    this.inputHandle = (inputData)=>{
        //接收输入的参数
        this[inputData.targetSolt] = inputData.data
        if(this.number1 != null && this.number2 != null && this.number3 != null){
            this.outputHandle()
        }
    }

    this.outputHandle = ()=>{
        var result = 0
        var outputValue = this.number2
        var contanLeftAndRigght = this.config.otherConfig.contanLeftAndRigght.default
        if(contanLeftAndRigght == 1){
            if(this.number2 >= this.number1 && this.number2 <= this.number3){
                result = 1
            }
        }else{
            if(this.number2 > this.number1 && this.number2 < this.number3){
                result = 1
            }
        }
        if(this.number2 < this.number1){
            outputValue = this.number1
        }
        if(this.number2 > this.number3){
            outputValue = this.number3
        }
        
        if(this.config.otherConfig.input1Keep.default == 0){
            this.number1 = null
        }
        if(this.config.otherConfig.input2Keep.default == 0){
            this.number3 = null
        }
        if(this.config.otherConfig.breakOutPut.default == 1 && result == 0){
            //结果为0时阻断输出
            return
        }
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            if(this.linkDatas.outputSolt['number']){
                var onelinkDatas = this.linkDatas.outputSolt['number']
                for(var i = 0; i < onelinkDatas.length; i++){
                    var onelinkData = onelinkDatas[i]
                    onelinkData.robot.inputHandle({solt:onelinkData.solt, data: result, targetSolt: onelinkData.otherSolt})
                }
            }
            if(this.linkDatas.outputSolt['number2']){
                var onelinkDatas = this.linkDatas.outputSolt['number2']
                for(var i = 0; i < onelinkDatas.length; i++){
                    var onelinkData = onelinkDatas[i]
                    onelinkData.robot.inputHandle({solt:onelinkData.solt, data: outputValue, targetSolt: onelinkData.otherSolt})
                }
            }
        }, null, result)
    }
}
inRangeRobot.prototype = new CodeRobot()


function timeDownRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)

    this.robotInit = ()=>{
        //初始化
        this.number1 = 0
        this.number2 = this.config.otherConfig.number2.default
        this.number3 = this.config.otherConfig.number3.default
        this.runTime = 0
        this.tigerRun = 1

        if(this.linkDatas.inputSolt['number1'].length != 0){
            this.number1 = null
        }
        if(this.linkDatas.inputSolt['number2'].length != 0){
            this.number2 = null
        }
        if(this.linkDatas.inputSolt['number3'].length != 0){
            this.number3 = null
        }
        return true
    }

    this.robotStart = ()=>{

    }

    this.inputHandle = (inputData)=>{
        //接收输入的参数
        this[inputData.targetSolt] = inputData.data
        if(this.number1 == 0){
            //如果输入为0时停止计时
            this.runTime = 0
            this.tigerRun = 1
            return
        }
        // console.log('这个倒计时有问题', this.number1, this.number2)
        // if(this.number1 != 0 && this.number2 == 0){
        //     //等待时间为0时就是等待一帧再执行
        //     this.codeProgress.scheduleOnce(()=>{
        //         this.outputHandle()
        //         this.number1 = 0
        //     }, 0)
        //     return
        // }
        if(this.number1 != null && this.number2 != null && this.number3 != null){
            //所有条件齐全了才开始计算时间
            this.runTime = 0
            this.tigerRun = 0
        }
    }

    this.robotUpdate = (dt)=>{
        this.runTime += dt
        
        if(this.tigerRun == 0){
            if(this.runTime > this.number2){
                // cc.log('timeDownRobot', this.runTime)
                if(this.number3 == 0){
                    this.tigerRun = 1
                    this.outputHandle(dt)
                }else{
                    this.runTime = 0
                    this.outputHandle(dt)
                }
            }
        }
    }

    this.outputHandle = (dt)=>{
        //输出内容
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            if(this.linkDatas.outputSolt['number']){
                var onelinkDatas = this.linkDatas.outputSolt['number']
                for(var i = 0; i < onelinkDatas.length; i++){
                    var onelinkData = onelinkDatas[i]
                    onelinkData.robot.inputHandle({solt:onelinkData.solt, data: dt , targetSolt: onelinkData.otherSolt})
                }
            }
        }, null, this.number1)
    }
}
timeDownRobot.prototype = new CodeRobot()

//输出数字的区间为[0，输入数字)
function randomNumRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)

    this.robotInit = ()=>{
        return true
    }

    this.inputHandle = (inputData)=>{
        //接收输入的参数
        this.outputHandle(inputData.data)
    }

    this.outputHandle = (value)=>{
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            if(this.config.otherConfig.modal.default == 0){
                var random = Math.floor(Math.random() * value) // [0,输入值-1]
                if(this.linkDatas.outputSolt['number']){
                    var onelinkDatas = this.linkDatas.outputSolt['number']
                    for(var i = 0; i < onelinkDatas.length; i++){
                        var onelinkData = onelinkDatas[i]
                        onelinkData.robot.inputHandle({solt:onelinkData.solt, data:random, targetSolt: onelinkData.otherSolt})
                    }
                }
            }else{
                if(this.linkDatas.outputSolt['number']){
                    var onelinkDatas = this.linkDatas.outputSolt['number']
                    for(var i = 0; i < onelinkDatas.length; i++){
                        var random = Math.floor(Math.random() * value)
                        var onelinkData = onelinkDatas[i]
                        onelinkData.robot.inputHandle({solt:onelinkData.solt, data:random, targetSolt: onelinkData.otherSolt})
                    }
                }
            }
        }, null, 1)
    }
}
randomNumRobot.prototype = new CodeRobot()


function checkTagRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)
    
    this.robotInit = ()=>{
       //默认是关闭状态
       if(this.config.otherConfig.initWithValue.default == 1){
            var key = ''
            var bindRobot = this.linkDatas.cardexSolt[0]
            if(bindRobot != null && bindRobot.robot != null){
                key = 'id' + bindRobot.robot.id
            }else{
                if(this.config.otherConfig.modal.default == 0){
                    key = this.config.otherConfig.customeName.default
                }else{
                    key = this.config.otherConfig.modal.default
                }
            }
            var targetValue = this.config.otherConfig.customeValue.default
            if(targetValue.indexOf("+") == 0 && Number(targetValue.split('+')[1] > 0)){
                targetValue =  Number(targetValue.split('+')[1])
            }else if(targetValue.indexOf("-") == 0 && Number(targetValue.split('-')[1] > 0)){
                targetValue = -Number(targetValue.split('-')[1])
            }
            this.codeProgress.codeRobotConfig.states[key] = targetValue
       }
       return true 
    }

    this.inputHandle = (inputData)=>{
        //接收输入的参数
        if(inputData.targetSolt == 'number1'){
            if(inputData.data != 0){
                this.outputHandle()
            }
        }
        if(inputData.targetSolt == 'number2'){
            //设置值并触发，为0也触发
            var bindRobot = this.linkDatas.cardexSolt[0]
            var targetValue = inputData.data
            var key = ''
            if(bindRobot != null && bindRobot.robot != null){
                key = 'id' + bindRobot.robot.id
            }else{
                if(this.config.otherConfig.modal.default == 0){
                    key = this.config.otherConfig.customeName.default
                }else{
                    key = this.config.otherConfig.modal.default
                }
            }
            if(this.config.otherConfig.customeValue.default != ''){
                targetValue = this.config.otherConfig.customeValue.default
                if(targetValue.indexOf("+") == 0 && Number(targetValue.split('+')[1] > 0)){
                    targetValue = Number(this.codeProgress.codeRobotConfig.states[key]) +  Number(targetValue.split('+')[1])
                }else if(targetValue.indexOf("-") == 0 && Number(targetValue.split('-')[1] > 0)){
                    targetValue = Number(this.codeProgress.codeRobotConfig.states[key]) -  Number(targetValue.split('-')[1])
                }
            }
            this.codeProgress.codeRobotConfig.states[key] = targetValue
            this.outputHandle()
        }
    }

    this.outputHandle = (data)=>{
        var state = 0
        var key = null
        var bindRobot = this.linkDatas.cardexSolt[0]
        if(bindRobot != null && bindRobot.robot != null){
            key = 'id' + bindRobot.robot.id
        }else{
            if(this.config.otherConfig.modal.default == 0){
                key = this.config.otherConfig.customeName.default
            }else{
                key = this.config.otherConfig.modal.default
            }
        }

        state = this.codeProgress.codeRobotConfig.states[key]
        if(this.config.otherConfig.breakOutPut.default == 1 && state == 0){
            return
        }

        //cc.log(key + '我输出了当前状态', state)

        CodeRobot.prototype.outputHandle.call(this, ()=>{
            if(this.linkDatas.outputSolt['number']){
                var onelinkDatas = this.linkDatas.outputSolt['number']
                for(var i = 0; i < onelinkDatas.length; i++){
                    var onelinkData = onelinkDatas[i]
                    onelinkData.robot.inputHandle({solt:onelinkData.solt, data: state, targetSolt: onelinkData.otherSolt})
                }
            }
        }, null, state)
    }

    this.freshOtherConfig = (config)=>{
        if(this.instance != null){
            if(config.modal.default != 0){
                this.instance.node.getChildByName('resultLabel').getComponent(cc.Label).string = config.modal.chooses[config.modal.default]
            }else{
                this.instance.node.getChildByName('resultLabel').getComponent(cc.Label).string = config.customeName.default
            }
        }
    }
}
checkTagRobot.prototype = new CodeRobot()


function exportObjectRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)
    
    this.robotInit = ()=>{
       return true 
    }

    this.inputHandle = (inputData)=>{
        //接收输入的参数,应该是一个robot类型
        // if(inputData.targetSolt == 'number1'){
        //     this.state = 1
        // }
        // if(inputData.targetSolt == 'number2'){
        //     this.state = 0
        // }

        if(inputData.targetSolt == 'robot1'){
            if(inputData.isSingleExport == true){
                //如果第二次调用就要警告了
                if(this.isSingleExport == true){
                    console.warn('isSingleExport只能触发一次，但是触发了不止一次，说明一个引用物体不止引用了一个对象')
                }
                this.isSingleExport = true
            }
            this.codeNode = inputData.codeNode != null ? inputData.codeNode : inputData.data.codeNode
            if(this.codeNode != null){
                this.spineCom = this.codeNode.spineCom
            }else{
                this.spineCom = null
                return
            }
            // cc.log('exportObjectRobot收到了引用对象', this.id, this.codeNode.node.uuid)
            this.bindRobotListener()
            if(this.config.otherConfig.modal.default == 1){
                this.outputHandle(1)
            }
        }else if(inputData.targetSolt == 'number1'){
            if(inputData.data == 0){
                return
            }
            this.outputHandle(inputData.data)
        }
    }

    this.robotRelease = ()=>{
        if(this.isSingleExport){
            if(this.codeNode != null){
                cc.Tween.stopAllByTarget(this.codeNode);
                this.codeNode.targetOff()
                this.codeNode.destroyNode()
            }
        }
        this.codeNode = null
        this.spineCom = null
        CodeRobot.prototype.robotRelease.call(this)
    }

    this.robotPause = ()=>{
        if(this.isSingleExport){
            if(this.spineCom != null){
                this.spineCom.paused = true
            }
            if(this.codeNode != null){
                cc.director.getActionManager().pauseTarget(this.codeNode);
            }
        }
    }

    this.robotResume = ()=>{
        if(this.isSingleExport){
            if(this.spineCom != null){
                this.spineCom.paused = false
            }
            if(this.codeNode != null){
                cc.director.getActionManager().resumeTarget(this.codeNode);
            }
        }
    }

    this.bindRobotListener = ()=>{
        // cc.log('exportObjectRobot bindRobotListener', this.id, this.linkDatas.cardacSolt)

        for(var i = 0; i < this.linkDatas.cardacSolt.length; i++){
            var soltData = this.linkDatas.cardacSolt[i]
            if(soltData.robot.onBindCodeNode != null){
                soltData.robot.onBindCodeNode(this.codeNode)
            }
        }
    }

    this.outputHandle = (value)=>{
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            if(this.linkDatas.outputSolt['number']){
                var onelinkDatas = this.linkDatas.outputSolt['number']
                for(var i = 0; i < onelinkDatas.length; i++){
                    var onelinkData = onelinkDatas[i]
                    onelinkData.robot.inputHandle({solt:onelinkData.solt, data: value, targetSolt: onelinkData.otherSolt})
                }
            }
            if(this.linkDatas.outputSolt['robot']){
                var onelinkDatas = this.linkDatas.outputSolt['robot']
                for(var i = 0; i < onelinkDatas.length; i++){
                    var onelinkData = onelinkDatas[i]
                    onelinkData.robot.inputHandle({solt:onelinkData.solt, data: this, targetSolt: onelinkData.otherSolt})
                }
            }
        }, null, 1)
    }

    //仅仅在编辑时会调用
    this.getLinkCodeNode = ()=>{
        var findCodeNode = null
        for(var key in this.instance.linkData.inputSolt){
            if(findCodeNode != null){
                break
            }
            var dropNode = this.instance.linkData.inputSolt[key]
            cc.director.emit('getLineBySolt', {soltid: dropNode.dot.uuid, dontAutoCreate: true, cb:(line)=>{
                if(line != null){
                    var bindRobot
                    if(line.endDrop.card == this.instance){
                        bindRobot = line.startDrop.card.robot
                    }else{
                        bindRobot = line.endDrop.card.robot
                    }
                    if(bindRobot.getLinkCodeNode != null){
                        findCodeNode = bindRobot.getLinkCodeNode()
                    }
                }
             }})
        }
        return findCodeNode
    }
}
exportObjectRobot.prototype = new CodeRobot()


function acceptDataRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)
    
    this.robotInit = ()=>{
       //将广播名称注册到codeProgress.codeRobotConfig.broadCast
       var eventKey = this.config.otherConfig.customeName.default
       if(this.codeProgress.codeRobotConfig.broadCast[eventKey] == null){
            this.codeProgress.codeRobotConfig.broadCast[eventKey] = {}
       }
       this.codeProgress.codeRobotConfig.broadCast[eventKey][this.id] = this.outputHandle
       //this.codeProgress.codeRobotConfig.broadCast[this.config.otherConfig.customeName.default] = this.outputHandle
       return true
    }

    this.inputHandle = (inputData)=>{
        //接收输入的参数
        this.outputHandle(inputData.data)
        cc.log(this.config.otherConfig.customeName.default + ':我收到了', inputData.data)
    }

    this.outputHandle = (data)=>{
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            if(this.linkDatas.outputSolt['number']){
                var onelinkDatas = this.linkDatas.outputSolt['number']
                for(var i = 0; i < onelinkDatas.length; i++){
                    var onelinkData = onelinkDatas[i]
                    onelinkData.robot.inputHandle({solt:onelinkData.solt, data: data, targetSolt: onelinkData.otherSolt})
                }
            }
        }, null, data)
    }

    this.freshOtherConfig = (config)=>{
        if(this.instance != null){
            this.instance.leftSolt.children[0].getChildByName('infoLabel').getComponent(cc.Label).string = config.customeName.default
        }
    }

    this.getLinkCodeNode = ()=>{
       var codeNode = this.codeNode
       cc.director.emit('getSendDataRobotsByEvent', {name: this.config.otherConfig.customeName.default , cb: (arr)=>{
            for(var i = 0; i < arr.length; i++){
                codeNode = arr[i].getLinkCodeNode()
                if(codeNode != null){
                    break
                }
            }    
       }})
       return codeNode
    }

    this.robotRelease = ()=>{
        if(this.codeProgress.codeRobotConfig.broadCast[this.config.otherConfig.customeName.default] != null){
            delete this.codeProgress.codeRobotConfig.broadCast[this.config.otherConfig.customeName.default][this.id]
            if(Object.keys(this.codeProgress.codeRobotConfig.broadCast[this.config.otherConfig.customeName.default]).length == 0){
                delete this.codeProgress.codeRobotConfig.broadCast[this.config.otherConfig.customeName.default]
            }
        }
    }
}
acceptDataRobot.prototype = new CodeRobot()

function sendDataRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)
    
    this.robotInit = ()=>{
        return true
    }

    this.inputHandle = (inputData)=>{
        //接收输入的参数
        this.outputHandle(inputData.data)
        this.codeProgress.sendDataOut(this.config.otherConfig.customeName.default, inputData)
    }
   

    this.outputHandle = (data)=>{
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            if(this.linkDatas.outputSolt['number']){
                var onelinkDatas = this.linkDatas.outputSolt['number']
                for(var i = 0; i < onelinkDatas.length; i++){
                    var onelinkData = onelinkDatas[i]
                    onelinkData.robot.inputHandle({solt:onelinkData.solt, data: data, targetSolt: onelinkData.otherSolt})
                }
            }
        }, null, data)
    }

    this.freshOtherConfig = (config)=>{
        if(this.instance != null){
            this.instance.rightSolt.children[0].getChildByName('infoLabel').getComponent(cc.Label).string = config.customeName.default
        }
    }

    this.getLinkCodeNode = ()=>{
        var linkCodeNode = null
        cc.director.emit('getLineBySolt', {soltid: this.instance.linkData.inputSolt['number'].dot.uuid, dontAutoCreate: true, cb:(line)=>{
            if(line != null){
                var bindRobot
                if(line.endDrop.card == this.instance){
                    bindRobot = line.startDrop.card.robot
                }else{
                    bindRobot = line.endDrop.card.robot
                }
                if(bindRobot.getLinkCodeNode != null){
                    linkCodeNode = bindRobot.getLinkCodeNode()
                }
            }
        }});
        return linkCodeNode
    }
}
sendDataRobot.prototype = new CodeRobot()

function writeNoteRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)
    
    this.robotInit = (cb)=>{
        if(this.config.otherConfig.modal.default == 0){
            //仅仅是备忘录不是方法块
            return true
        }
        // console.log('branch', branch, inputArrRobots, outputArrRobots)
        for(var i = 0; i < this.inblockRobots.length; i++){
            var robot = this.inblockRobots[i] 
            if(robot.config.key == 'inputArr'){
                robot.config.otherConfig.modal.default = 1
            }
            if(robot.config.key == 'outputArr'){
                robot.config.otherConfig.modal.default = 1
            }
        }

        if(this.config.otherConfig.modal.default == 2){
            this.branch = {}
            //动态方法块
            return true
        }

        if(this.branch != null){
            // console.log('使用了现成的branch', this.branch)
            this.branchInit(cb)
            return
        }else{
            // console.log('没有使用现成branch', this.branch)
        }

        //在robotInit的时候才会生成副本，但是导出的时候会保存此代码块中包含的robot的id，方便初始化的时候生成，初始化的时候生成的副本robot要在这里面初始化，并添加到codeProgress的robot列表中
        // cc.log('方法块包含的robot', this.inblockRobots)
        //先找到判断生成副本数量的[inputArr]
        if(this.inblockRobots == null){
            cc.warn('writeNoteRobot 没有找到 inblockRobots')
            return true
        }
        var inputArrRobot = null
        for(var i = 0; i < this.inblockRobots.length; i++){
            var robot = this.inblockRobots[i]
            if(robot.config.key == 'inputArr'){
                //只要找到一个就行
                inputArrRobot = robot
                break
            }
        }
        var branchCount = 0
        if(inputArrRobot != null){
            //没有分支
            // cc.warn('没有inputArr')
            // return true
            branchCount = inputArrRobot.config.otherConfig.inputSoltCount.default
        }
        var branch = {}
        for(var i = 0; i < branchCount; i++){
            //创建branch
            branch[i] = this.createBranch(i)
        }
       
       

        this.branch = branch
        // console.log('实现了branch', this.branch)
        this.branchInit(cb)
        if(branchCount == 0){
            return true
        }
    }

    //现在这个要改成运行时动态创建分支
    this.createBranch = (z)=>{
        var oneBranch = {}
        var idMap = {}
        var oriRobots = {}
        if(this.inblockRobots == null){
            cc.warn('createBranchs时 没有找到 inblockRobots')
            return oneBranch
        }
        for(var i = 0; i < this.inblockRobots.length; i++){
            var robot = this.inblockRobots[i]
            if(oriRobots[robot.id] == null){
                oriRobots[robot.id] = robot
            }

            var config = StaticValue.clone(StaticValue.zhilinConfig[robot.config.key])
            
            var robotClone

            if(config.key.indexOf('cc.') == 0){
                robotClone = new ExportClass['BaseScriptRobot'](config)
            }else{
                robotClone = new ExportClass[config.key + 'Robot'](config)
            }
             
            if(robot.instance != null){
                robotClone.instance = robot.instance
            }
            robotClone.codeProgress = this.codeProgress
            
            if(robotClone.config.otherConfig != null){
                for(var key in robotClone.config.otherConfig){
                    robotClone.config.otherConfig[key].default = robot.config.otherConfig[key].default
                    //针对不同的分支使用不同的value
                    if(robot.config.curValueArr != null && robot.config.curValueArr[z] != null){
                        if(robot.config.curValueArr[z][key] != null){
                            robotClone.config.otherConfig[key].default = robot.config.curValueArr[z][key]
                        }
                    }
                }
            }

            idMap[robot.id] = robotClone.id
            oneBranch[robotClone.id] = robotClone
        }

        for(var id in oriRobots){
            var cloneId = idMap[id]
            var oriRobot = oriRobots[id]
            var cloneRobot = oneBranch[cloneId]
            var relinklinkDatas = {}
            for(var soltTypeKey in oriRobot.linkDatas){
                var onelinkData = oriRobot.linkDatas[soltTypeKey]
                if(onelinkData instanceof Array){
                    //左下和右上
                    relinklinkDatas[soltTypeKey] = []
                    for(var j = 0; j < onelinkData.length; j++){
                        var linkData = onelinkData[j]
                        var mapRobot = oneBranch[idMap[linkData.robot.id]]
                        if(mapRobot == null){
                            mapRobot = linkData.robot
                            // cc.warn('linkData.robot', linkData)
                            var otherSoltType = soltTypeKey == 'cardacSolt' ? 'cardexSolt' : 'cardacSolt'
                            linkData.robot.linkDatas[otherSoltType].push({solt: linkData.otherSolt, robot: cloneRobot,otherSolt:linkData.solt})
                        }
                        relinklinkDatas[soltTypeKey].push({solt: linkData.solt, robot: mapRobot, otherSolt: linkData.otherSolt})
                    }
                }else if(onelinkData instanceof Object){
                    //输入和输出
                    relinklinkDatas[soltTypeKey] = {}
                    for(var soltKey in onelinkData){
                        relinklinkDatas[soltTypeKey][soltKey] = []
                        for(var j = 0; j < onelinkData[soltKey].length; j++){
                            var linkData = onelinkData[soltKey][j]
                            var mapRobot = oneBranch[idMap[linkData.robot.id]]
                            if(mapRobot == null && cloneRobot.config.key != 'inputArr' && cloneRobot.config.key != 'outputArr'){
                                mapRobot = linkData.robot
                                // cc.warn('linkData.robot', linkData)
                                var otherSoltType = soltTypeKey == 'inputSolt' ? 'outputSolt' : 'inputSolt'
                                if(linkData.robot.linkDatas[otherSoltType][linkData.otherSolt] == null){
                                    cc.warn('linkData.robot', soltTypeKey, linkData.otherSolt, linkData)
                                }else{
                                    linkData.robot.linkDatas[otherSoltType][linkData.otherSolt].push({solt: linkData.otherSolt, robot: cloneRobot, otherSolt:linkData.solt})
                                }
                            }
                            relinklinkDatas[soltTypeKey][soltKey].push({solt: linkData.solt, robot: mapRobot, otherSolt: linkData.otherSolt})
                        }
                    }
                }
            }
            //这两个特殊处理
            if(cloneRobot.config.key == 'inputArr'){
                cloneRobot.config.otherConfig.modal.default = 0
                var soltKey = 'input' + z
                var oriinputSolt = oriRobot.linkDatas.inputSolt[soltKey]

                for(var otherKey in relinklinkDatas.inputSolt){
                    if(otherKey != soltKey){
                        relinklinkDatas.inputSolt[otherKey] = []
                    }
                }

                for(var y = 0; y < relinklinkDatas.outputSolt.number.length; y++){
                    var oneLink = relinklinkDatas.outputSolt.number[y]
                    if(oneLink.robot == null){
                        relinklinkDatas.outputSolt.number[y].robot = oriRobot.linkDatas.outputSolt.number[y].robot
                        oriRobot.linkDatas.outputSolt.number[y].robot.linkDatas.inputSolt[oneLink.otherSolt].push({solt: oneLink.otherSolt, robot: cloneRobot, otherSolt: oneLink.solt})
                    }
                }
               
                //需要把外部输入的线的robot关联进来
                if(relinklinkDatas.inputSolt[soltKey] != null){
                    for(var y = 0; y < relinklinkDatas.inputSolt[soltKey].length; y++){
                        //outputrobot可能输入连接的是内部的，如果是内部的话就不重新赋值
                        if(relinklinkDatas.inputSolt[soltKey][y].robot == null){
                            relinklinkDatas.inputSolt[soltKey][y].robot = oriinputSolt[y].robot
                            oriinputSolt[y].robot.linkDatas.outputSolt[oriinputSolt[y].otherSolt].push({solt: oriinputSolt[y].otherSolt, robot: cloneRobot, otherSolt: oriinputSolt[y].solt})
                        }
                    }
                }else{
                    console.warn('输入扩展没有对应的solt', soltKey)
                }
            }
            if(cloneRobot.config.key == 'outputArr'){
                cloneRobot.config.otherConfig.modal.default = 0
                var soltKey = 'output' + z
                var orioutputSolt = oriRobot.linkDatas.outputSolt[soltKey]

                for(var otherKey in relinklinkDatas.outputSolt){
                    if(otherKey != soltKey){
                        relinklinkDatas.outputSolt[otherKey] = []
                    }
                }

                for(var y = 0; y < relinklinkDatas.inputSolt.number.length; y++){
                    var oneLink = relinklinkDatas.inputSolt.number[y]
                    if(oneLink.robot == null){
                        relinklinkDatas.inputSolt.number[y].robot = oriRobot.linkDatas.inputSolt.number[y].robot
                        oriRobot.linkDatas.inputSolt.number[y].robot.linkDatas.outputSolt[oneLink.otherSolt].push({solt: oneLink.otherSolt, robot: cloneRobot, otherSolt: oneLink.solt})
                    }
                }

                //需要把外部输入的线的robot关联进来
                if(relinklinkDatas.outputSolt[soltKey] != null){
                    for(var y = 0; y < relinklinkDatas.outputSolt[soltKey].length; y++){
                        //outputrobot可能输入连接的是内部的，如果是内部的话就不重新赋值
                        if(relinklinkDatas.outputSolt[soltKey][y].robot == null){
                            relinklinkDatas.outputSolt[soltKey][y].robot = orioutputSolt[y].robot
                            orioutputSolt[y].robot.linkDatas.inputSolt[orioutputSolt[y].otherSolt].push({solt: orioutputSolt[y].otherSolt, robot: cloneRobot, otherSolt: orioutputSolt[y].solt})
                        }
                    }
                }else{
                    console.warn('输出扩展没有对应的solt', soltKey)
                }
            }
            cloneRobot.linkDatas = relinklinkDatas
        }

        return oneBranch
    }

    this.removeBranch = (branchKey)=>{
        if(this.branch == null){
            return
        }

        var oneBranch = this.branch[branchKey]
        for(var subKey in oneBranch) {
            var robot = oneBranch[subKey]

            if(robot.robotRelease != null){
                robot.robotRelease(false, false)
            }

            for(var soltKey in robot.linkDatas.inputSolt){
                for(var j = 0; j < robot.linkDatas.inputSolt[soltKey].length; j++){
                    var oneLink = robot.linkDatas.inputSolt[soltKey][j]
                    if(oneLink.robot == null){
                        console.warn('inputSolt oneLink.robot == null', robot, soltKey)
                        continue   
                    }
                    for(var i = 0; i < oneLink.robot.linkDatas.outputSolt[oneLink.otherSolt].length; i++){
                        var otherLink = oneLink.robot.linkDatas.outputSolt[oneLink.otherSolt][i]
                        if(otherLink.robot != null){
                            if(otherLink.robot.id == robot.id){
                                oneLink.robot.linkDatas.outputSolt[oneLink.otherSolt].splice(i, 1)
                                i--
                            }
                        }else{
                            console.warn('otherLink.robot == null', branchKey)
                        }
                    }
                    robot.linkDatas.inputSolt[soltKey] = []          
                }
            }


            for(var soltKey in robot.linkDatas.outputSolt){
                for(var j = 0; j < robot.linkDatas.outputSolt[soltKey].length; j++){
                    var oneLink = robot.linkDatas.outputSolt[soltKey][j]
                    if(oneLink.robot == null){
                        console.warn('outputSolt oneLink.robot == null', robot, soltKey)
                        continue   
                    }
                    if(oneLink.robot.linkDatas.inputSolt[oneLink.otherSolt] != null){
                        for(var i = 0; i < oneLink.robot.linkDatas.inputSolt[oneLink.otherSolt].length; i++){
                            var otherLink = oneLink.robot.linkDatas.inputSolt[oneLink.otherSolt][i]
                            if(otherLink.robot != null){
                                if(otherLink.robot.id == robot.id){
                                    oneLink.robot.linkDatas.inputSolt[oneLink.otherSolt].splice(i, 1)
                                    i--
                                }
                            }else{
                                console.warn('otherLink.robot == null', branchKey)
                            }
                        }
                    } 
                    robot.linkDatas.outputSolt[soltKey] = []  
                }
            }

            //所有输入输出关联都删除
            robot.linkDatas.cardacSolt = []
            robot.linkDatas.cardexSolt = []
            
            
        }
    }

    this.removeAllBranch = ()=>{
        if(this.branch == null){
            return
        }
        for(var key in this.branch){
            this.removeBranch(key)
        }
        this.branch = null
    }

    this.branchInit = (cb)=>{
        var needInitCount = 0
        var curInitCount = 0

        var checkStart = ()=>{
            // console.log('branchInit', this.branch, curInitCount, needInitCount)
            if(curInitCount == needInitCount){
                cb()
            }
        }

        
        for(var key in this.branch){
            needInitCount += Object.keys(this.branch[key]).length
        }

        for(var key in this.branch){
            for(var subKey in this.branch[key]) {
                var initOk = this.branch[key][subKey].robotInit(()=>{
                    curInitCount += 1
                    checkStart()
                })
                if(initOk == true){
                    curInitCount += 1
                    checkStart()
                }
            }
        }
    }

    this.robotStart = ()=>{
        if(this.branch != null){
            for(var key in this.branch){
                for(var subKey in this.branch[key]) {
                    if(this.branch[key][subKey].robotStart != null){
                        this.branch[key][subKey].robotStart()
                    }
                }
            }
        }
    }

    this.robotRelease = (withPreview, dontDestroy)=>{
        if(this.branch != null){
            this.removeAllBranch()
        }
        CodeRobot.prototype.robotRelease.call(this)
    }

    this.robotPause = ()=>{
        if(this.branch != null){
            for(var key in this.branch){
                for(var subKey in this.branch[key]) {
                    if(this.branch[key][subKey].robotPause != null){
                        this.branch[key][subKey].robotPause()
                    }
                }
            }
        }
    }

    this.robotResume = ()=>{
        if(this.branch != null){
            for(var key in this.branch){
                for(var subKey in this.branch[key]) {
                    if(this.branch[key][subKey].robotResume != null){
                        this.branch[key][subKey].robotResume()
                    }
                }
            }
        }
    }

    this.robotUpdate = (dt)=>{
        if(this.branch != null){
            for(var key in this.branch){
                for(var subKey in this.branch[key]) {
                    if(this.branch[key][subKey].robotUpdate != null){
                        this.branch[key][subKey].robotUpdate(dt)
                    }
                }
            }
        }
    }

    this.inputHandle = (inputData)=>{
        //接收输入的参数
        // cc.log('writeNoteRobot接收输入的参数', inputData)
        if(inputData.targetSolt == 'value1' || inputData.targetSolt == 'value2'){
            this[inputData.targetSolt] = inputData.data
            return
        }
        //输入之后就直接创建一个分支
        var key = Object.keys(this.branch).length
        var oneBranch = this.createBranch(key)
        this.branch[key] = oneBranch

        var needInitCount = Object.keys(oneBranch).length
        var curInitCount = 0

        var checkStart = ()=>{
            if(curInitCount == needInitCount){
                for(var subKey in oneBranch) {
                    if(oneBranch[subKey].robotStart != null){
                        oneBranch[subKey].robotStart()
                    }
                    if(oneBranch[subKey].config.key == 'exportObject'){
                        if(oneBranch[subKey].linkDatas.inputSolt != null){
                            var bindRobot = oneBranch[subKey].linkDatas.inputSolt.robot1
                            for(var z = 0; z < bindRobot.length; z++){
                                var otherRobot = bindRobot[z].robot
                                // console.log('otherRobot', otherRobot.id, this.id)
                                if(otherRobot.id == this.id){
                                    //这个exportObject是由此writeNote关联的，把传入的引用物体输出到robot
                                    oneBranch[subKey].inputHandle({solt: 'robot1', data: inputData.data, targetSolt: 'robot1', isSingleExport: true})
                                }
                            }
                        }
                    }else{
                        // console.log('oneBranchzzzzzzz', oneBranch[subKey].linkDatas.inputSolt)
                        if(oneBranch[subKey].linkDatas.inputSolt != null){
                            for(var soltKey in oneBranch[subKey].linkDatas.inputSolt){
                                var bindInfo = oneBranch[subKey].linkDatas.inputSolt[soltKey]
                                for(var z = 0; z < bindInfo.length; z++){
                                    var otherRobot = bindInfo[z].robot
                                    if(otherRobot.id == this.id){
                                        // console.log('2otherRobot',bindInfo[z].otherSolt,  this[bindInfo[z].otherSolt])
                                        //这个exportObject是由此writeNote关联的，把传入的引用物体输出到robot
                                        oneBranch[subKey].inputHandle({solt: bindInfo[z].otherSolt, data: this[bindInfo[z].otherSolt], targetSolt: bindInfo[z].solt})
                                    }
                                }
                            }
                        }
                    }
                }
                // cc.log('新创建的分支初始化完成', this.branch)
            }
        }

        for(var subKey in oneBranch) {
            var initOk = oneBranch[subKey].robotInit(()=>{
                curInitCount += 1
                checkStart()
            })
            if(initOk == true){
                curInitCount += 1
                checkStart()
            }
        }
        // console.log('当前branch', this.id, this.branch)
    }

    this.outputHandle = (data)=>{
        
    }

    //getinCards
    this.getInCards = ()=>{
        var findCards = []
        var minX = this.instance.node.x - this.instance.node.width * 0.5 * this.instance.node.scaleX
        var maxX = this.instance.node.x + this.instance.node.width * 0.5 * this.instance.node.scaleX

        var minY = this.instance.node.y - this.instance.node.height * 0.5 * this.instance.node.scaleY
        var maxY = this.instance.node.y + this.instance.node.height * 0.5 * this.instance.node.scaleY

        for(var i = 0; i < this.instance.node.parent.children.length; i++){
            var item = this.instance.node.parent.children[i]
            if(item.name != 'card'){continue}
            if(item == this.instance.node){continue}
            if((item.x - item.width * 0.5 * item.scaleX) > minX && (item.x + item.width * 0.5 * item.scaleX) < maxX){
                if((item.y - item.height * 0.5 * item.scaleY) > minY && (item.y + item.height * 0.5 * item.scaleY) < maxY){
                    findCards.push(item.getComponent('CodeCard'))
                }
            }
        }
        return findCards
    }

    this.onEditTouchStart = (event)=>{
        cc.log("我收到了编辑时的点击开始")
        this.findOthers = []
        this.findCards = this.getInCards()

        for(var i = 0; i < this.findCards.length; i++){
            var moveObjs = this.findCards[i].node.getComponents('MoveObj')
            moveObjs[0].touchStart(event)
            moveObjs[1].touchStart(event)
            this.findOthers.push(moveObjs[0])
            this.findOthers.push(moveObjs[1])
        }
    }
    this.onEditTouchMove = (event)=>{
        for(var i = 0; i < this.findOthers.length; i++){
            this.findOthers[i].moveFun(event)
        } 
        for(var i = 0; i < this.findCards.length; i++){
            cc.director.emit('onMoveCard', this.findCards[i]);
        }
    }
    this.onEditTouchEnd = (event)=>{
        for(var i = 0; i < this.findOthers.length; i++){
            this.findOthers[i].cancelFun(event)
        }
    }

    this.onBeforeExport = ()=>{
        this.findCards = this.getInCards()
        if(this.instance != null){
            this.inblockRobots = []
            for(var i = 0; i < this.findCards.length; i++){
                if(this.findCards[i].node.active == true){
                    this.inblockRobots.push(this.findCards[i].robot)
                }
            }
            this.robotRelease()
        }
    }

     //仅仅在编辑时会调用
     this.getLinkCodeNode = ()=>{
        var findCodeNode = null
        for(var key in this.instance.linkData.inputSolt){
            if(findCodeNode != null){
                break
            }
            var dropNode = this.instance.linkData.inputSolt[key]
            cc.director.emit('getLineBySolt', {soltid: dropNode.dot.uuid, dontAutoCreate: true, cb:(line)=>{
                if(line != null){
                    var bindRobot
                    if(line.endDrop.card == this.instance){
                        bindRobot = line.startDrop.card.robot
                    }else{
                        bindRobot = line.endDrop.card.robot
                    }
                    if(bindRobot.getLinkCodeNode != null){
                        findCodeNode = bindRobot.getLinkCodeNode()
                    }
                }
             }})
        }
        return findCodeNode
    }
    
}
writeNoteRobot.prototype = new CodeRobot()


function stopTimeRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)
    
    this.robotInit = ()=>{
        return true
    }

    this.inputHandle = (inputData)=>{
        //接收输入的参数
        // this.outputHandle(inputData.data)
        if(inputData.data != 0){
            //停止时间
            this.codeProgress.pause()
        }else{
            //取消停止时间
            this.codeProgress.resume()
        }
    }

    this.outputHandle = (data)=>{
       
    }
}
stopTimeRobot.prototype = new CodeRobot()


function timeScaleRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)
    
    this.robotInit = ()=>{
        return true
    }

    this.inputHandle = (inputData)=>{
        //接收输入的参数
        var num = Number(inputData.data)
        if(num != null){
            this.codeProgress.changeTimeScale(num)
        }
    }

    this.outputHandle = (data)=>{
       
    }
}
timeScaleRobot.prototype = new CodeRobot()


function vibrateRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)
    
    this.robotInit = ()=>{
        return true
    }

    this.inputHandle = (inputData)=>{
        //接收输入的参数
        var num = Number(inputData.data)
        if(num != 0){
           //震动
           if(this.config.otherConfig.modal.default == 0){
                this.codeProgress.vibrate(false)
           }else{
                this.codeProgress.vibrate(true)
           }
        }
    }

    this.outputHandle = (data)=>{
       
    }
}
vibrateRobot.prototype = new CodeRobot()


function soundRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)
    
    this.robotInit = ()=>{
        this.audioID = null
        this.clip = null
        return true
    }

    this.inputHandle = (inputData)=>{
        //接收输入的参数
        var num = Number(inputData.data)
        cc.log( this.config.otherConfig.customeName.default + ':我收到了输入播放', num)
        if(num != 0){
            //开始播放
            var volume = this.config.otherConfig.volume.default / 10
            if(GlobalConfig.recordMode == true){
                //录音模式静音所有
                volume = 0
            }
            if(this.config.otherConfig.yinggui.default != 0){
                var curYingui = this.codeProgress.codeRobotConfig.audioArray[this.config.otherConfig.yinggui.default]
                if(curYingui != null){
                    curYingui.robotRelease()
                }
                this.codeProgress.codeRobotConfig.audioArray[this.config.otherConfig.yinggui.default] = this
            }
           
            var path = this.config.otherConfig.customeName.default
            if(this.config.otherConfig.modal.default != 0){
                path = this.config.otherConfig.modal.chooses[this.config.otherConfig.modal.default]
            }
            this.codeProgress.codeRobotConfig.loadResHandle(path, cc.AudioClip,  (clip)=> {
                if(this.config.otherConfig.yinggui.default != 0){
                    if(this.codeProgress.codeRobotConfig.audioArray[this.config.otherConfig.yinggui.default] != this){
                        if(clip != num){
                            //加载成功了，但实际上没有播放
                            clip.decRef()
                        }
                        return
                    }
                }
                if(clip == null){
                    console.warn('加载音频失败', path)
                    return
                }
                // console.log('音频加载成功', path, volume, clip._name, clip.duration, clip.loaded, clip) //
                this.clip = clip
                var audioID = cc.audioEngine.play(clip, this.config.otherConfig.loop.default == 0 ? true : false, volume);
                this.audioID = audioID
                cc.audioEngine.setFinishCallback(this.audioID, () => {
                    this.outputHandle()
                });
            });
        }else{
            //停止播放
            this.robotRelease()
        }
    }

    this.outputHandle = (data)=>{
        if(this.linkDatas == null){
            return
        }
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            if(this.linkDatas.outputSolt['number1']){
                var onelinkDatas = this.linkDatas.outputSolt['number1']
                for(var i = 0; i < onelinkDatas.length; i++){
                    var onelinkData = onelinkDatas[i]
                    onelinkData.robot.inputHandle({solt:onelinkData.solt, data:1, targetSolt: onelinkData.otherSolt})
                }
            }
        }, null, 1)
    }

    this.robotPause = ()=>{
        if(this.audioID != null){
            cc.audioEngine.pause(this.audioID)
        }
    }

    this.robotResume = ()=>{
        if(this.audioID != null){
            cc.audioEngine.resume(this.audioID)
        }
    }
    
    this.robotRelease = ()=>{
        if(this.codeProgress.codeRobotConfig.audioArray[this.config.otherConfig.yinggui.default] == this){
            this.codeProgress.codeRobotConfig.audioArray[this.config.otherConfig.yinggui.default] = null
        }
        if(this.audioID != null){
            cc.audioEngine.stop(this.audioID)
        }
        if(this.clip != null){
            this.clip.decRef()
        }
        this.clip = null
        this.audioID = null
        CodeRobot.prototype.robotRelease.call(this)
    }

    this.freshOtherConfig = (config)=>{
        if(this.instance != null){
            this.instance.resultLabel.string = config.customeName.default
        }
    }
}
soundRobot.prototype = new CodeRobot()

function animateRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)
    
    this.robotInit = ()=>{
        this.aniEnd = false
        this.clickWaitOutPut = false
        return true
    }

    this.robotStart = ()=>{
        if(this.config.otherConfig.autoRun.default == 1){
            this.inputHandle({data: 1})
        }
    }

    this.inputHandle = (inputData)=>{
        //接收输入的参数
        //只要输入不为0时即可播放
        // cc.log('输入', inputData.data)
        if(inputData.data == 0){
            return
        }
        this.aniEnd = false
        this.clickWaitOutPut = false
        // console.log('cardexSolt', this.linkDatas.cardexSolt)
        for(var i = 0; i < this.linkDatas.cardexSolt.length; i++){
            var bindRobot = this.linkDatas.cardexSolt[i]
            if(bindRobot != null){
                bindRobot = bindRobot.robot
                if(bindRobot.codeNode != null){ 
                    this.realRun(bindRobot.codeNode)
                }else{
                    cc.warn('无效的instance')
                }
            }
        }
    }

    this.realRun = (codeNode)=>{
        var spineCom = codeNode.spineCom
        try {
            if(spineCom != null && spineCom.skeletonData != null ){ //&& spineCom.skeletonData.skeletonJson != null
                var animations = Object.keys(spineCom.skeletonData.skeletonJson.animations)
                var aniName = animations[this.config.otherConfig.playAniName.default]
                if(aniName == null){
                    console.warn('获取到了不正确的ani')
                    return
                }                    
                var loop = this.config.otherConfig.loop.default == 1 ? false : true
                var modal = this.config.otherConfig.modal.default
                var aniEndCanClick = this.config.otherConfig.aniEndCanClick.default
                // cc.log('播放了动画',codeNode.name, aniName, loop)
                if(modal == 0 || modal == 1){
                    var skins = Object.keys(spineCom.skeletonData.skeletonJson.skins)
                    var skin = skins[this.config.otherConfig.skin.default]
                    spineCom.setSkin(skin)
                }
    
                if(modal == 0 || modal == 2){
                    if(this.config.otherConfig.cancelEvent.default == 0){ 
                       codeNode.targetOff()
                    }
                    //把这两样东西放在设置动画之前
                    spineCom.setEventListener((trackEntry, event)=>{
                        // cc.log('spineCom event.data', event.data)
                        if(event.intValue < 0){
                            return
                        }
                        this.codeProgress.playSound(event.data.name ,spineCom.node.name + ':' + trackEntry.animation.name)
                    });
                    spineCom.setCompleteListener((trackEntry)=>{
                        let ccompleteName = trackEntry.animation.name;
                        if(ccompleteName == aniName){
                            this.aniEnd = true
                            this.outputHandle('number1', codeNode)
                            if(this.clickWaitOutPut == true){
                                this.outputHandle('number2', codeNode)
                            }
                        }
                    })
    
                    if(this.config.otherConfig.softChange.default == 0){
                        spineCom.setAnimation(0, aniName, loop)
                    }else{
                        spineCom.loop = false
                        spineCom.addAnimation(0, aniName, loop)
                    }
    
                    spineCom.timeScale = this.config.otherConfig.timeScale.default / 10
    
                    if(this.linkDatas.outputSolt['number2'] && this.linkDatas.outputSolt['number2'].length != 0){
                        if(codeNode.getComponent('SpinePlusComponent') == null){
                            codeNode.addComponent('SpinePlusComponent')
                        }
                        codeNode.on(cc.Node.EventType.TOUCH_END, ()=>{
                            if(this.codeProgress.codeRobotConfig.pause == 1){
                                return
                            }
                            if(aniEndCanClick == 1){
                                //直接可以点击
                                codeNode.targetOff()
                                if(this.config.otherConfig.clickWait.default == 1){
                                    this.clickWaitOutPut = true
                                }else{
                                    this.outputHandle('number2', codeNode)
                                }
                            }else{
                                if(this.aniEnd == true){
                                    codeNode.targetOff()
                                    if(this.config.otherConfig.clickWait.default == 1){
                                        this.clickWaitOutPut = true
                                    }else{
                                        this.outputHandle('number2', codeNode)
                                    }
                                }else{
                                    cc.log('点击了但动画没有播放结束')
                                }
                            }
                        })
                    }
                }
            }else{
                cc.warn('绑定的instance没有动画组件')
            }
        } catch (error) {
            console.error('animateRobot realRun error', error)
        }
    }
    
    this.outputHandle = (targetSolt, codeNode)=>{
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            if(this.linkDatas.outputSolt[targetSolt]){
                var onelinkDatas = this.linkDatas.outputSolt[targetSolt]
                for(var i = 0; i < onelinkDatas.length; i++){
                    var onelinkData = onelinkDatas[i]
                    onelinkData.robot.inputHandle({solt:onelinkData.solt, data: 1, codeNode: codeNode, targetSolt: onelinkData.otherSolt})
                }
            }
        }, targetSolt, 1)
    }


    this.robotRelease = ()=>{
        // var bindRobot = this.linkDatas.cardexSolt[0]
        // if(bindRobot != null){
        //     bindRobot = bindRobot.robot
        //     if(bindRobot.codeNode != null){
        //         //直接执行
        //         cc.Tween.stopAllByTarget(bindRobot.codeNode);
        //         bindRobot.codeNode.targetOff(this);
        //     }else{
        //         // cc.warn('无效的instance')
        //     }
        // }
        // if(thi)
        CodeRobot.prototype.robotRelease.call(this)
    } 

    this.freshOtherConfig = (config)=>{
        if(this.instance != null){
            var modal = this.config.otherConfig.modal.default
            if(modal == 1){
                if(config.skin.chooses[config.skin.default]){
                    this.instance.resultLabel.string = config.skin.chooses[config.skin.default]
                }
            }else{
                if(config.playAniName.chooses[config.playAniName.default]){
                    this.instance.resultLabel.string = config.playAniName.chooses[config.playAniName.default]
                }
            }
           
            // if(config.skin.chooses[config.skin.default]){
            //     this.instance.resultLabel.string = config.skin.chooses[config.skin.default]
            // }
        }
    }

    this.onCardSelect = ()=>{
        cc.director.emit('getLinesBySolt', {soltid: this.instance.cardexSolt.getChildByName('dot').uuid, cb:(lineArr)=>{
            for(var i = 0; i < lineArr.length; i++){
                var line = lineArr[i]
                var spineCom = null
                var bindRobot
                if(line.endDrop.card == this.instance){
                    bindRobot = line.startDrop.card.robot
                }else{
                    bindRobot = line.endDrop.card.robot
                }
                if(bindRobot.codeNode != null){
                    spineCom = bindRobot.codeNode.spineCom
                }else{
                    //有可能是引用物体，需要查找原始物体
                    if(bindRobot.config.key == 'exportObject'){
                        //查找这个物体绑定的物体，反向查询有点复杂，还是用预览的时候修改设置？
                        var linkCodeNode = bindRobot.getLinkCodeNode()
                        if(linkCodeNode != null){
                            spineCom = linkCodeNode.spineCom
                        }
                    }
                }
                // setTimeout(() => {
                if(spineCom != null && spineCom.skeletonData != null ){ //&& spineCom.skeletonData.skeletonJson != null
                    var animations = Object.keys(spineCom.skeletonData.skeletonJson.animations)
                    var aniName = animations[this.config.otherConfig.playAniName.default]
                    var loop = this.config.otherConfig.loop.default == 1 ? false : true
                    var modal = this.config.otherConfig.modal.default
                    //cc.log('播放了动画',aniName)
                    spineCom.clearTrack(0)
                    spineCom.setToSetupPose()
                    if(modal == 0 || modal == 1){
                        var skins = Object.keys(spineCom.skeletonData.skeletonJson.skins)
                        var skin = skins[this.config.otherConfig.skin.default]
                        spineCom.setSkin(skin)
                    }
                    if(modal == 0 || modal == 2){
                        spineCom.setAnimation(0, aniName, loop)
                    }
                }
                // }, 10);
            } 
        }});
    }

    this.onCardUnSelect = ()=>{
        cc.director.emit('getLinesBySolt', {soltid: this.instance.cardexSolt.getChildByName('dot').uuid, cb:(lineArr)=>{
            for(var i = 0; i < lineArr.length; i++){
                var line = lineArr[i]
                var spineCom = null
                var bindRobot
                if(line.endDrop.card == this.instance){
                    bindRobot = line.startDrop.card.robot
                }else{
                    bindRobot = line.endDrop.card.robot
                }
                if(bindRobot.codeNode != null){
                    spineCom = bindRobot.codeNode.spineCom
                }else{
                    //有可能是引用物体，需要查找原始物体
                    if(bindRobot.config.key == 'exportObject'){
                        //查找这个物体绑定的物体，反向查询有点复杂，还是用预览的时候修改设置？
                        var linkCodeNode = bindRobot.getLinkCodeNode()
                        if(linkCodeNode != null){
                            spineCom = linkCodeNode.spineCom
                        }
                    }
                }
                if(spineCom != null){
                    spineCom.clearTrack(0)
                }
            }
        }});
    }

    //仅在编辑状态使用
    this.onClickSetting = ()=>{
        cc.director.emit('getLineBySolt', {soltid: this.instance.cardexSolt.getChildByName('dot').uuid, dontAutoCreate: true, cb:(line)=>{
            if(line != null){
                var bindRobot
                if(line.endDrop.card == this.instance){
                    bindRobot = line.startDrop.card.robot
                }else{
                    bindRobot = line.endDrop.card.robot
                }
                if(bindRobot.codeNode != null){
                    var spineCom = bindRobot.codeNode.spineCom
                    if(spineCom != null && spineCom.skeletonData != null){  // && spineCom.skeletonData.skeletonJson != null
                        this.config.otherConfig.skin.chooses =  Object.keys(spineCom.skeletonData.skeletonJson.skins)
                        this.config.otherConfig.playAniName.chooses =  Object.keys(spineCom.skeletonData.skeletonJson.animations)
                    }
                }else{
                    //有可能是引用物体，需要查找原始物体
                    if(bindRobot.config.key == 'exportObject'){
                        //查找这个物体绑定的物体，反向查询有点复杂，还是用预览的时候修改设置？
                        var linkCodeNode = bindRobot.getLinkCodeNode()
                        if(linkCodeNode != null){
                            var spineCom = linkCodeNode.spineCom
                            if(spineCom != null && spineCom.skeletonData != null ){ //&& spineCom.skeletonData.skeletonJson != null
                                this.config.otherConfig.skin.chooses =  Object.keys(spineCom.skeletonData.skeletonJson.skins)
                                this.config.otherConfig.playAniName.chooses =  Object.keys(spineCom.skeletonData.skeletonJson.animations)
                            }
                        }
                    }
                }
            }
        }});
    }

    this.robotPause = ()=>{
       
    }

    this.robotResume = ()=>{
       
    }

    this.getLinkCodeNode = ()=>{
        var codeNode = null
        cc.director.emit('getLineBySolt', {soltid: this.instance.cardexSolt.getChildByName('dot').uuid, dontAutoCreate: true, cb:(line)=>{
            if(line != null){
                var bindRobot
                if(line.endDrop.card == this.instance){
                    bindRobot = line.startDrop.card.robot
                }else{
                    bindRobot = line.endDrop.card.robot
                }
                
                if(bindRobot.instance != null){
                    if(bindRobot.getLinkCodeNode != null){
                        codeNode = bindRobot.getLinkCodeNode()
                    }else{
                        codeNode = bindRobot.codeNode
                    }
                }
            }
        }});
        return codeNode
    }

   

}
animateRobot.prototype = new CodeRobot()


function bezierCurveRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)

    this.robotInit = ()=>{
        this.t = 0  //t表示当前贝塞尔曲线的进度
        this.length = new Bezier(this.config.otherConfig.points.default).length() * 2
        this.end = false

        return true
    }

    this.inRunFreshConfig = (key)=>{
        if(key == 'points'){
            this.length = new Bezier(this.config.otherConfig.points.default).length() * 2
        }
    }

    this.robotStart = ()=>{

    }

    this.inputHandle = (inputData)=>{
        //接收输入的参数
        //只要输入不为0时即可播放
        // cc.log('输入', inputData.data)
        if(inputData.data == 0){
            return
        }
        if(inputData.targetSolt == 'resetT'){
            this.end = false
            var bindRobot = this.linkDatas.cardexSolt[0]
            if(bindRobot == null){return}
            bindRobot = bindRobot.robot
            if(bindRobot.codeNode == null){return}
            if(bindRobot != null && bindRobot.codeNode != null){
                var curve = new Bezier(this.config.otherConfig.points.default)
                bindRobot.codeNode.curve = curve 
                bindRobot.codeNode.t = this.config.otherConfig.startT.default * 0.01    //每次执行是否要重置t
            }
        }else{
            this.runAnimate(inputData.data)
        }
    }

    //运行时间
    this.runAnimate = (value)=>{
        if(this.config.otherConfig.aniType.default == 2){
            var bindRobot = this.linkDatas.cardexSolt[0]
            if(bindRobot != null){
                bindRobot = bindRobot.robot
                if(bindRobot.codeNode == null){
                    return
                }
                bindRobot.codeNode.lookUp = this.config.otherConfig.lookUp.default
                if(bindRobot.codeNode.curve == null){
                    var curve = new Bezier(this.config.otherConfig.points.default)
                    bindRobot.codeNode.curve = curve 
                }
                var oneStep = value / this.length
                // console.log('输入的value / lenght', value, this.length)
                bindRobot.codeNode.t += oneStep
                if(bindRobot.codeNode.t == 1){
                    this.outputHandle('number1', bindRobot.codeNode)
                }
                this.t = bindRobot.codeNode.t
            }
        }else if(this.config.otherConfig.aniType.default == 0){
            //随着步长
            var oneStep = this.config.otherConfig.oneStep.default
            var bindRobot = this.linkDatas.cardexSolt[0]
            if(bindRobot != null){
                bindRobot = bindRobot.robot
                if(bindRobot.codeNode == null){
                    return
                }
                bindRobot.codeNode.lookUp = this.config.otherConfig.lookUp.default
                if(bindRobot.codeNode.curve == null){
                    var curve = new Bezier(this.config.otherConfig.points.default)
                    bindRobot.codeNode.curve = curve 
                }
                bindRobot.codeNode.t += oneStep * 0.01    //每次执行是否要重置t
                if(bindRobot.codeNode.t == 1){
                    this.outputHandle('number1', bindRobot.codeNode)
                }
                this.t = bindRobot.codeNode.t
            }
        }else{
            //跟随时间
            var bindRobot = this.linkDatas.cardexSolt[0]
            if(bindRobot != null){
                this.inRun = true
                bindRobot = bindRobot.robot
                if(bindRobot.codeNode != null){
                    var curve = new Bezier(this.config.otherConfig.points.default)
                    bindRobot.codeNode.curve = curve 
                    bindRobot.codeNode.lookUp = this.config.otherConfig.lookUp.default
                    if(this.config.otherConfig.startResetT.default == 0){
                        bindRobot.codeNode.t = this.config.otherConfig.startT.default
                    }
                    cc.tween(bindRobot.codeNode).to(this.config.otherConfig.duration.default * 0.1, {t: this.config.otherConfig.endT.default * 0.01}).call(()=>{
                        this.outputHandle('number1', bindRobot.codeNode)
                    }).start()
                }
            }
        }
    }

    this.outputHandle = (targetSolt, codeNode)=>{
        if(this.end)
        {
            return
        }
        this.end = true
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            if(this.linkDatas.outputSolt[targetSolt]){
                var onelinkDatas = this.linkDatas.outputSolt[targetSolt]
                for(var i = 0; i < onelinkDatas.length; i++){
                    var onelinkData = onelinkDatas[i]
                    onelinkData.robot.inputHandle({solt:onelinkData.solt, data: 1, codeNode: codeNode, targetSolt: onelinkData.otherSolt})
                }
            }
        }, targetSolt, 1)
    }

    this.robotRelease = ()=>{
        // var bindRobot = this.linkDatas.cardexSolt[0]
        // if(bindRobot != null){
        //     bindRobot = bindRobot.robot
        //     if(bindRobot.codeNode != null){
        //         //直接执行
        //         cc.Tween.stopAllByTarget(bindRobot.codeNode);
        //         bindRobot.codeNode.targetOff(this);
        //     }else{
        //         // cc.warn('无效的instance')
        //     }
        // }
        CodeRobot.prototype.robotRelease.call(this)
    } 


    this.onCardSelect = ()=>{
        var spaceCard = this.codeProgress.onGetSingleCard('space')
        if(spaceCard == null){
            cc.warn("没有添加space卡片")
            this.codeProgress.showTips('没有添加space卡片')
            return
        }
        var whiteNode = spaceCard.getChildByName('whiteNode')
        if(whiteNode == null){
            cc.warn("没有添加space/whiteNode")
            return
        }
     
        if(this.tempDrawNode == null){
            var tempDrawNode = new cc.Node()
            this.tempDrawNode = tempDrawNode
            tempDrawNode.parent = spaceCard
            tempDrawNode.zIndex = 9999
            tempDrawNode.x = 0
            tempDrawNode.y = 0
            tempDrawNode.name = 'tempDrawNode'

            var ctx = tempDrawNode.addComponent(cc.Graphics)
            var controlPoint = this.config.otherConfig.points.default

            var ccPosArr = []
            for(var i = 0; i < controlPoint.length; i++){
                ccPosArr.push(cc.v2(controlPoint[i], controlPoint[i+1]))
                i+=1
            }
            // console.log('ccPosArr', ccPosArr)

            var drawCurve = ()=>{
                ctx.lineWidth = 4
                controlPoint = []
                for(var i = 0; i < ccPosArr.length; i++){
                    controlPoint.push(ccPosArr[i].x)
                    controlPoint.push(ccPosArr[i].y)
                }
                this.config.otherConfig.points.default = controlPoint
                ctx.clear()
                var curve = new Bezier(controlPoint)
                var d = 400
                for(var t=0; t<=1; t+=0.01) {
                    var pt = curve.get(t);
                    var nv = curve.normal(t);
                    // this.drawLine(pt, { x: pt.x + d*nv.x, y: pt.y + d*nv.y} );
                    if(t == 0){
                        ctx.moveTo(pt.x , pt.y )
                    }else{
                        ctx.lineTo(pt.x , pt.y )
                    }
                }
                ctx.stroke()

                ctx.strokeColor = cc.Color.BLUE
                var t = this.t
                var dv = curve.derivative(t);
                var pt = curve.get(t); //0.5时候的点
                ctx.moveTo(pt.x , pt.y )
                ctx.lineTo(pt.x + dv.x, pt.y  +dv.y)
                ctx.stroke()
            }
            
            drawCurve()
             
            // console.log('bezierCurveRobot 选择了')
            
            var initControllNode = (i)=>{
                var pos = ccPosArr[i]
                var ctrlNode = new cc.Node()
                ctrlNode.parent = tempDrawNode
                ctrlNode.x = pos.x
                ctrlNode.y = pos.y
                ctrlNode.width = 10
                ctrlNode.height = 10
                var handCtx = ctrlNode.addComponent(cc.Graphics)
                handCtx.circle(0, 0, ctrlNode.width)
                handCtx.fillColor = cc.Color.GREEN
                handCtx.strokeColor = cc.Color.GREEN
                handCtx.lineWidth = 4
                if(i == 0 || i == ccPosArr.length - 1){
                    handCtx.stroke()
                }else{
                    handCtx.fill()
                }

                ctrlNode.on(cc.Node.EventType.TOUCH_MOVE, (e)=>{
                    console.log('instance node scale',)
                    ctrlNode.x += e.getDeltaX() * (1 / whiteNode.scale) * (1 /  this.instance.node.parent.scale)
                    ctrlNode.y += e.getDeltaY() * (1 / whiteNode.scale) * (1 /  this.instance.node.parent.scale)
                    ccPosArr[i].x = ctrlNode.x
                    ccPosArr[i].y = ctrlNode.y
                    drawCurve()
                }, this)
            }

            //生成控制点位
            for(var i = 0; i < ccPosArr.length; i++){
                initControllNode(i)
            }
        }
    }   

    this.onCardUnSelect = ()=>{
        console.log('bezierCurveRobot 取消选择了')
        if(this.tempDrawNode != null){
            this.tempDrawNode.destroy()
            this.tempDrawNode = null
        }
    }
}
bezierCurveRobot.prototype = new CodeRobot()


function tweenRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)
    
    this.robotInit = ()=>{
        this.aniEnd = false
        this.tween = null
        this.runTime = 0
        this.inRun = false
    
        // if(GlobalConfig.recordMode == true){
        //     var bindRobot = this.linkDatas.cardexSolt[0]
        //     if(bindRobot != null){
        //         bindRobot = bindRobot.robot
        //         if(bindRobot.codeNode != null){
        //             var x = this.config.otherConfig.x.default
        //             var y = this.config.otherConfig.y.default
        //             var scaleX = this.config.otherConfig.scaleX.default  * 0.1
        //             var scaleY = this.config.otherConfig.scaleY.default  * 0.1
        //             var opacity = this.config.otherConfig.opacity.default
        //             var zoomRatio = this.config.otherConfig.zoomRatio.default  * 0.1
        //             var angle = this.config.otherConfig.angle.default
            
        //             var justChange = this.config.otherConfig.justChange.default
        //             var justChangeValue = this.config.otherConfig.justChangeValue.default
            
        //             var props = {x: x, y: y, scaleX: scaleX, scaleY: scaleY, opacity: opacity, zoomRatio: zoomRatio, angle: angle}

        //             if(justChange == 1){
        //                 props.zIndex = justChangeValue
        //             }else if(justChange == 2){
        //                 props.active = justChangeValue
        //             }else if(justChange == 3){
        //                 props.width = justChangeValue
        //             }else if(justChange == 4){
        //                 props.height = justChangeValue
        //             }else if(justChange == 5){
        //                 //自定义标签
        //                 props.customTag = justChangeValue
        //             }

        //             for(var key in props){
        //                 bindRobot.codeNode[key] = props[key]
        //             }
        //         }
        //     }
        // }
        return true
    }

    this.inputHandle = (inputData)=>{
        //接收输入的参数
        //只要输入不为0时即可播放
        if(inputData.data == 0){
            return
        }

        var bindRobot = this.linkDatas.cardexSolt[0]
        var delay = this.config.otherConfig.delay.default * 0.1
        var duration = this.config.otherConfig.duration.default * 0.1
        var easingIndex = this.config.otherConfig.easing.default
        var easingConfig = ['none', 'quadIn', 'quadOut', 'quadInOut', 'backOut', 'bounceOut']   //backIn
        var easing = {}
        if(easingIndex != 0){
            easing = {easing: easingConfig[easingIndex]}
        }

        var x = this.config.otherConfig.x.default
        var y = this.config.otherConfig.y.default
        var scaleX = this.config.otherConfig.scaleX.default  * 0.1
        var scaleY = this.config.otherConfig.scaleY.default  * 0.1
        var opacity = this.config.otherConfig.opacity.default
        var zoomRatio = this.config.otherConfig.zoomRatio.default  * 0.1
        var angle = this.config.otherConfig.angle.default

        var justChange = this.config.otherConfig.justChange.default
        var justChangeValue = this.config.otherConfig.justChangeValue.default

        var props = {x: x, y: y, scaleX: scaleX, scaleY: scaleY, opacity: opacity, zoomRatio: zoomRatio, angle: angle}
        this.aniEnd = false
        if(bindRobot != null){

            // if(this.config.otherConfig.tweenMode.default == 1){
            //     if(inputData.isResume == true){
            //         // delay + duration - this.runTime
            //         if(this.runTime <= delay){
            //             delay = delay - this.runTime
            //         }else if(this.runTime > delay){
            //             delay = 0
            //             duration = duration - (this.runTime - delay)
            //         }
            //     }else{
            //         this.runTime = 0
            //     }
            // }else{
            // }
            

            this.inRun = true
            bindRobot = bindRobot.robot
            if(bindRobot.codeNode != null){
                if(justChange == 1){
                    bindRobot.codeNode.zIndex = justChangeValue
                }else if(justChange == 2){
                    bindRobot.codeNode.active = justChangeValue
                }else if(justChange == 3){
                    bindRobot.codeNode.width = justChangeValue
                }else if(justChange == 4){
                    bindRobot.codeNode.height = justChangeValue
                }else if(justChange == 5){
                    //自定义标签
                    bindRobot.codeNode.customTag = justChangeValue
                }
                //直接执行
                if(this.config.otherConfig.dontTween.default == 0){
                    if(this.config.otherConfig.cancelOtherTween.default == 1){ 
                        cc.Tween.stopAllByTarget(bindRobot.codeNode)
                        cc.Tween.stopAllByTarget(bindRobot.codeNode.node)   //有的脚本组件是直接控制node的动画的，也要取消掉
                    }
                    if(this.config.otherConfig.cancelEvent.default == 0){ 
                        bindRobot.codeNode.targetOff()
                    }
                    if(this.config.otherConfig.tweenMode.default == 1){
                        this.tween = cc.tween(bindRobot.codeNode).delay(delay).by(duration, props, easing).call(() => {
                            this.outputHandle('number1')
                            this.aniEnd = true
                            this.inRun = false
                         }).start();
                    }else{
                        this.tween = cc.tween(bindRobot.codeNode).delay(delay).to(duration, props, easing).call(() => {
                            this.outputHandle('number1')
                            this.aniEnd = true
                            this.inRun = false
                         }).start();
                    }
                   

                    if(this.linkDatas.outputSolt['number2'] && this.linkDatas.outputSolt['number2'].length != 0){
                        bindRobot.codeNode.on(cc.Node.EventType.TOUCH_END, ()=>{
                            if(this.codeProgress.codeRobotConfig.pause == 1){
                                return
                            }
                            if(this.aniEnd == true){
                                bindRobot.codeNode.targetOff()
                                this.outputHandle('number2')
                            }
                        })
                    }
                }else{
                    this.outputHandle('number1')
                }
            }else{
                cc.warn('无效的instance')
            }
        }
    }

    this.outputHandle = (targetSolt)=>{
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            if(this.linkDatas.outputSolt[targetSolt]){
                var onelinkDatas = this.linkDatas.outputSolt[targetSolt]
                for(var i = 0; i < onelinkDatas.length; i++){
                    var onelinkData = onelinkDatas[i]
                    onelinkData.robot.inputHandle({solt:onelinkData.solt, data:1, targetSolt: onelinkData.otherSolt})
                }
            }
        }, targetSolt, 1)
    }

    this.robotRelease = ()=>{
        // var bindRobot = this.linkDatas.cardexSolt[0]
        // if(bindRobot != null){
        //     bindRobot = bindRobot.robot
        //     if(bindRobot.codeNode != null){
        //         //直接执行
        //         cc.Tween.stopAllByTarget(bindRobot.codeNode);
        //         bindRobot.codeNode.targetOff(this);
        //     }else{
        //         cc.warn('无效的instance')
        //     }
        // }
        this.tween = null
        if(this.previewTween != null){
            this.previewTween.destroyNode()
            this.previewTween = null
        }else if(this.previewInstance != null){
            this.previewInstance = null
        }
        CodeRobot.prototype.robotRelease.call(this)
    }

    //
    this.freshOtherConfig = (config)=>{
        if(this.previewTween != null){
            var x = config.x.default
            var y = config.y.default
            var scaleX = config.scaleX.default / 10
            var scaleY = config.scaleY.default / 10
            var opacity = config.opacity.default
            var angle = config.angle.default


            if(scaleX == 0){
                scaleX = 0.1
            }
            if(scaleY == 0){
                scaleY = 0.1
            }
            if(opacity == 255){
                opacity = 155
            }
            
            if(this.config.otherConfig.tweenMode.default == 0){
                this.previewTween.x = x
                this.previewTween.y = y
                this.previewTween.scaleX = scaleX
                this.previewTween.scaleY = scaleY
                this.previewTween.opacity = opacity
                this.previewTween.angle = angle
            }
           

            //不要使用这里的了，手动预览zoomRatio
            // this.previewTween.zoomRatio = zoomRatio
        }else if(this.previewInstance != null){
            this.previewInstance.robot.freshOtherConfig(config)
        }
    }

    // this.robotPause = ()=>{
    //     if(this.aniEnd == true){
    //         return
    //     }
    //     if(this.tween == null){
    //         return
    //     }
    //     this.inRun = false
    //     // console.log(this.tween)
    //     // this.tween.stop()
    // }

    // this.robotResume = ()=>{
    //     if(this.aniEnd == true){
    //         return
    //     }
    //     if(this.tween == null){
    //         return
    //     }
    //     // this.inputHandle({data: 1, isResume: true})
    // }

    // this.robotUpdate = (dt)=>{
    //     if(this.inRun == true){
    //         this.runTime += dt
    //     }
    // }

    this.onCardSelect = ()=>{
        if(this.previewTween == null){
            cc.director.emit('getLineBySolt', {soltid: this.instance.cardexSolt.getChildByName('dot').uuid, dontAutoCreate: true, cb:(line)=>{
                if(line != null){
                    var bindRobot
                    if(line.endDrop.card == this.instance){
                        bindRobot = line.startDrop.card.robot
                    }else{
                        bindRobot = line.endDrop.card.robot
                    }
                    
                    if(bindRobot.instance != null){
                        if(bindRobot.instance.config.key == 'camera'){
                            this.previewInstance = bindRobot.instance
                            this.freshOtherConfig(this.config.otherConfig)
                        }else{
                            if(bindRobot.codeNode != null){
                                var previewNode = cc.instantiate(bindRobot.codeNode.node)
                                previewNode.isClone = true
                                previewNode.zIndex = 9999
                                this.previewTween = previewNode.getComponent('CodeNode')
                                this.previewTween.init()
                                this.previewTween.parent = bindRobot.codeNode.parent
                                this.freshOtherConfig(this.config.otherConfig)
                            }else{
                                //有可能是引用物体，需要查找原始物体，只会使用找到的第一个物体作为克隆对象
                                if(bindRobot.config.key == 'exportObject'){
                                    //查找这个物体绑定的物体，反向查询有点复杂，还是用预览的时候修改设置？
                                    var linkCodeNode = bindRobot.getLinkCodeNode()
                                    if(linkCodeNode != null){
                                        var previewNode = cc.instantiate(linkCodeNode.node)
                                        previewNode.isClone = true
                                        previewNode.zIndex = 9999
                                        this.previewTween = previewNode.getComponent('CodeNode')
                                        this.previewTween.init()
                                        this.previewTween.parent = linkCodeNode.parent
                                        this.freshOtherConfig(this.config.otherConfig)
                                    }
                                }
                            }
                        }
                    }
                }
            }});
        }
    }

    this.onCardUnSelect = ()=>{
        if(this.previewTween != null){
            this.previewTween.destroyNode()
            this.previewTween = null
        }else if(this.previewInstance != null){
            this.previewInstance.robot.freshOtherConfig(this.previewInstance.config.otherConfig)
            this.previewInstance = null
        }
    }
}
tweenRobot.prototype = new CodeRobot()


function connectionRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)

    this.robotInit = (cb)=>{
        this.linkCodeNodes = []
        return true
    }

    this.robotStart = ()=>{
        var bindRobot = this.linkDatas.cardexSolt[0]
        if(bindRobot == null){
            return
        }
        bindRobot = bindRobot.robot
        var parent = null

        if(bindRobot.codeNode != null){
            parent = bindRobot.codeNode.node
        }

        if(parent != null){
            var bindChildRobot = this.linkDatas.cardacSolt
            for(var i = 0; i < bindChildRobot.length; i++){
                var robot = bindChildRobot[i].robot
                if(robot.codeNode != null){
                    robot.codeNode.parent = parent
                    this.linkCodeNodes.push(robot.codeNode)
                }
            }
        }
    }

    this.inputHandle = (inputData)=>{
        var codeNode = inputData.data.codeNode

        var bindRobot = this.linkDatas.cardexSolt[0]
        if(bindRobot == null){
            return
        }
        bindRobot = bindRobot.robot
        var parent = null

        if(bindRobot.codeNode != null){
            parent = bindRobot.codeNode.node
        }

        codeNode.parent = parent
        this.linkCodeNodes.push(codeNode)
    }

    this.outputHandle = (data)=>{
        
    }

    //只有编辑时会执行
    this.getLinkRobot = ()=>{
        var bindRobot
        cc.director.emit('getLineBySolt', {soltid: this.instance.cardexSolt.getChildByName('dot').uuid, dontAutoCreate: true, cb:(line)=>{
            if(line != null){
                if(line.endDrop.card == this.instance){
                    bindRobot = line.startDrop.card.robot
                }else{
                    bindRobot = line.endDrop.card.robot
                }
            }
        }})
        return bindRobot
     }

    this.onCardSelect = ()=>{
        //为了预览的时候可以看到关联效果
        var spaceCard = this.codeProgress.onGetSingleCard('space')
        if(spaceCard == null){
            cc.warn("没有添加space卡片")
            this.codeProgress.showTips('没有添加space卡片')
            return
        }
        var whiteNode = spaceCard.getChildByName('whiteNode')
        if(whiteNode == null){
            cc.warn("没有添加space/whiteNode")
            return
        }

        if(this.linkCodeNodes == null){
            this.linkCodeNodes = []
        }
        for(var i = 0; i < this.linkCodeNodes.length; i++){
            var linkNode = this.linkCodeNodes[i]
            if(cc.isValid(linkNode.node) == true){
                linkNode.parent = whiteNode
            }
        }
        this.linkCodeNodes = []
        var parentRobot = this.getLinkRobot()
        // cc.log('parentRobot', parentRobot)
        if(parentRobot != null && parentRobot.codeNode != null){
            cc.director.emit('getLinesBySolt', {soltid: this.instance.cardacSolt.getChildByName('dot').uuid, dontAutoCreate: true, cb:(lines)=>{
                for(var i = 0 ; i < lines.length; i++){
                    var line = lines[i]
                    var bindRobot = null
                    if(line.endDrop.card == this.instance){
                        bindRobot = line.startDrop.card.robot
                    }else{
                        bindRobot = line.endDrop.card.robot
                    }
                    if(bindRobot != null && bindRobot.codeNode != null){
                        if(bindRobot.codeNode){
                            bindRobot.codeNode.parent = parentRobot.codeNode.node
                            this.linkCodeNodes.push(bindRobot.codeNode)
                        }
                    }
                }
            }})
        }
        // this.robotStart()
    }

    this.robotRelease = ()=>{
        if(this.instance != null){
            var spaceCard = this.codeProgress.onGetSingleCard('space')
            if(spaceCard == null){
                cc.warn("没有添加space卡片")
                this.codeProgress.showTips('没有添加space卡片')
                return
            }
            var whiteNode = spaceCard.getChildByName('whiteNode')
            if(whiteNode == null){
                cc.warn("没有添加space/whiteNode")
                return
            }
    
            for(var i = 0; i < this.linkCodeNodes.length; i++){
                var linkNode = this.linkCodeNodes[i]
                if(cc.isValid(linkNode.node) == true){
                    linkNode.parent = whiteNode
                }
            }
        }else{
            this.linkCodeNodes = []
        }
        CodeRobot.prototype.robotRelease.call(this)
    }
}
connectionRobot.prototype = new CodeRobot()

function Gird(x, y, width, height, robot){
    var obj =  {
        _x: x,
        _y: y,
        _width: width,
        _height: height,
        xPos: 0,
        yPos: 0,
        _codeNode: null,
        parentRobot: robot,
        _prepareUpdate: 0,
        girdType: 1,//根据地图设置格子类型 1，默认，0无效的，2草地，3沙滩，4雪地，5：水里
        set prepareUpdate(value){
            this.__prepareUpdate = value
            // this.parentRobot.onListenOtherOneGirdChange()
        },
        get prepareUpdate(){
            return this._prepareUpdate
        },
        set codeNode(value){
            var aniType = null
            if(this._codeNode != null && value == null){
                this.prepareUpdate = 0
                // if(this.parentRobot.config.otherConfig.canEmpty.default == 0){
                //     //var easingConfig = ['none', 'quadIn', 'quadOut', 'quadInOut', 'backOut', 'bounceOut']
                //     cc.tween(this).to(0.4, {width: 0, height: 0, prepareUpdate: 1}, {easing:'quadOut'}).start()
                // }
                if(this.parentRobot.config.key == 'layoutEx'){
                    if(this.parentRobot.config.otherConfig.canEmpty.default == 0){
                        this.width = 0
                        this.height = 0
                    }
                    if(this.parentRobot.config.otherConfig.layoutAni.default == 1){
                        aniType = 'quadOut'
                    }
                }
            }
            if(this._codeNode == null){
                this.prepareUpdate = 0
                if(this.parentRobot.config.key == 'layoutEx'){
                     // if(this.parentRobot.config.otherConfig.canEmpty.default == 0){
                    //     cc.tween(this).to(0.4, {
                    //         width: this.parentRobot.config.otherConfig.girdWidth.default,
                    //         height: this.parentRobot.config.otherConfig.girdHeight.default,
                    //         prepareUpdate: 1
                    //     }, {easing:'quadIn'}).start()
                    // }
                    if(this.parentRobot.config.otherConfig.canEmpty.default == 0){
                        this.width = this.parentRobot.config.otherConfig.girdWidth.default
                        this.height = this.parentRobot.config.otherConfig.girdHeight.default
                    }
                    if(this.parentRobot.config.otherConfig.dragInputAni.default == 1){
                        aniType = 'quadIn'
                    }
                }
            }
            this._codeNode = value
            this.parentRobot.onListenOtherOneGirdChange(aniType)
            // this.fresh()
        },
        get codeNode(){
            return this._codeNode
        },
        set x(value){
            this._x = value
        },
        get x(){
            return this._x
        },
        set y(value){
            this._y = value
        },
        get y(){
            return this._y
        },
        set width(value){
            this._width = value
        },
        get width(){
            return this._width
        },
        set height(value){
            this._height = value
        },
        get height(){
            return this._height
        },
        fresh(aniType){
            // this.xPos = this.x * this.width
            // this.yPos = this.y * this.height
            if(this.codeNode != null){
                if(this.parentRobot.config.key == 'layoutEx'){
                    if(aniType != null){
                        var speed = this.parentRobot.config.otherConfig.speed.default
                        if(speed <= 0){
                            speed = 0.1
                        }
                        var time = speed / 10
                        if(this.parentRobot.config.otherConfig.aniType.default == 1){
                            time = cc.v2(this.xPos, this.yPos).sub(cc.v2(this.codeNode.x, this.codeNode.y)).mag() / speed
                        }
                        this.curTween = cc.tween(this.codeNode).to(time, {x: this.xPos, y: this.yPos}, {easing:aniType}).start()
                    }else{
                        if(this.curTween != null){
                            this.curTween.stop()
                        }
                        this.codeNode.x = this.xPos
                        this.codeNode.y = this.yPos
                    }
                    this.codeNode.node.setSiblingIndex((this.x + 1) * (this.y + 1) - 1)
                }
            }
        },
        release(){
            this.curTween = null
            this.codeNode = null
        }
    }
    // obj.fresh()
    return obj
}


//排列组合
function layoutExRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)

    this.robotInit = (cb)=>{
        this.goodMap = []
        this.curPutCount = 0
        this.rowNums = this.config.otherConfig.rowNums.default
        this.columnNums = this.config.otherConfig.columnNums.default

        this.girdHeight =  this.config.otherConfig.girdHeight.default
        this.girdWidth =  this.config.otherConfig.girdWidth.default

        for(var i = 0; i < this.columnNums; i++){
            for(var j = 0; j < this.rowNums; j++){
                this.goodMap.push(Gird(i, j, this.girdWidth, this.girdHeight, this))
            }
        }
       
        this.onListenOtherOneGirdChange()
        // console.log('goodMap',this.goodMap)
        return true
    }

    this.robotStart = ()=>{
        if(this.codeNode == null){
            var bindRobot = this.linkDatas.cardexSolt[0]
            if(bindRobot != null){
                bindRobot = bindRobot.robot
                if(bindRobot.codeNode != null){
                    this.codeNode = bindRobot.codeNode
                    if(this.config.otherConfig.showMode.default == 1){
                        var mask = this.codeNode.getComponent(cc.Mask)
                        if(mask == null){
                            var mask = this.codeNode.addComponent(cc.Mask)
                        }
                    }
                    var dir = this.config.otherConfig.dir.default

                    if(dir == 0){
                        this.codeNode.node.anchorX = 0
                        this.codeNode.node.anchorY = 0
                    }else if(dir == 1 ){
                        this.codeNode.node.anchorX = 1
                        this.codeNode.node.anchorY = 1
                    }else if(dir == 2){
                        this.codeNode.node.anchorX = 0
                        this.codeNode.node.anchorY = 1
                    }else if(dir == 3){
                        this.codeNode.node.anchorX = 1
                        this.codeNode.node.anchorY = 0
                    }
                }
            }
        }
    }

    this.getIndexByCodeNode = (codeNode)=>{
        var hasFindIndex = -1
        for(var i = 0; i < this.goodMap.length; i++){
            if(this.goodMap[i].codeNode == codeNode){
                hasFindIndex = i
                break
            }
        }
        return hasFindIndex
    }

    //拖拽出来
    this.dragOutByIndex = (index)=>{
        if(this.goodMap[index] == null || this.goodMap[index].codeNode == null){
            cc.log('物体本来就不在布局中')
            return
        }
        var codeNode = this.goodMap[index].codeNode
        this.goodMap[index].codeNode = null

        if(this.config.otherConfig.canDragChangePos.default == 1){
            var gird = this.goodMap[index]
            this.goodMap.splice(index, 1)
            this.goodMap.push(gird)
        }

        var spaceCard = this.codeProgress.onGetSingleCard('space')
        if(spaceCard == null){
            cc.warn("没有添加space卡片")
            this.codeProgress.showTips('没有添加space卡片')
            return
        }
        var whiteNode = spaceCard.getChildByName('whiteNode')
        if(whiteNode == null){
            cc.warn("没有添加space/whiteNode")
            return
        }

        cc.Tween.stopAllByTarget(codeNode)
        var dragPos = whiteNode.convertToNodeSpaceAR(codeNode.getWorldPos())
        codeNode.parent = whiteNode
        codeNode.x = dragPos.x
        codeNode.y = dragPos.y
        codeNode.hasDragOut = true
        this.curPutCount -= 1
        this.outputHandle('robot1', codeNode)
    }
    
    //放置
    this.inputCodeNode = (codeNode)=>{
        if(codeNode.parent == this.codeNode.node){
            //已经放到容器中了
            cc.log('已经放到容器中了')
            return
        }
        if(this.curPutCount == this.goodMap.length){
            //已经放满了
            var sizeMode = this.config.otherConfig.sizeMode.default
            if(sizeMode == 0){
                cc.log('已经放满了')
                return
            }else if(sizeMode == 1){
                //扩展列数
                this.columnNums += 1
                for(var j = 0; j < this.rowNums; j++){
                    this.goodMap.push(Gird(this.columnNums - 1, j, this.girdWidth, this.girdHeight, this))
                }
            }else if(sizeMode == 2){
                //扩展行数
                this.rowNums += 1
                for(var j = 0; j < this.rowNums; j++){
                    this.goodMap.push(Gird(j, this.rowNums - 1, this.girdWidth, this.girdHeight, this))
                }
            }
        }

        //如果有空位判断最接近的两个不为空的格子，插入到两个格子之间，
        //会区分x轴优先还是y轴优先，如果是x轴优先，找的是横向间距最近的，如果是y轴优先，找的是竖向距离最近的
        if(this.config.otherConfig.canDragChangePos.default == 1 && codeNode.hasDragOut == true){
            // var gird = this.goodMap[index]
            // this.goodMap.splice(index, 1)
            // this.goodMap.push(gird)
            var worldPos = codeNode.getWorldPos()
            var nodePos = this.codeNode.node.convertToNodeSpaceAR(worldPos)
            var minLength = 99999
            var minIndex = -1
            for(var i = 0; i < this.goodMap.length; i++){
                if(this.goodMap[i].codeNode == null){
                    continue
                }
                var gird = this.goodMap[i]
                var length = nodePos.sub(cc.v2(gird.xPos, gird.yPos)).mag()
                // console.log('找最小值',i, length)
                if(length < minLength){
                    minLength = length
                    minIndex = i
                }
            }
            var emptyGird = this.goodMap.pop()
            this.goodMap.splice(minIndex,0,emptyGird)
            // console.log('找到了最小i', minIndex)
        }

        

        var hasPut = false
        for(var i = 0; i < this.goodMap.length; i++){
            if(this.goodMap[i].codeNode == null){
                var worldPos = codeNode.getWorldPos()
                codeNode.parent = this.codeNode.node
                var nodePos = this.codeNode.node.convertToNodeSpaceAR(worldPos)
                codeNode.x = nodePos.x
                codeNode.y = nodePos.y
                this.goodMap[i].codeNode = codeNode
                this.curPutCount += 1
                hasPut = true
                // console.log("放到了", i, nodePos)
                break
            }
        }
        if(hasPut == false){
            console.warn('明明可以放但是没有放进去')
        }else{
            this.outputHandle('robot2', codeNode)
        }
        if(this.codeNode != null){
            if(this.config.otherConfig.showMode.default == 1 || this.config.otherConfig.showMode.default == 0){
                this.codeNode.width = this.config.otherConfig.columnNums.default * this.girdWidth
                this.codeNode.height = this.config.otherConfig.rowNums.default * this.girdHeight
            }else if(this.config.otherConfig.showMode.default == 2){
                this.codeNode.width = this.columnNums * this.girdWidth
                this.codeNode.height = this.rowNums * this.girdHeight
            }
        }
    }

    this.inputHandle = (inputData)=>{
        // console.log('layoutEx收到了 inputHandle', inputData)
        if(this.codeNode == null){
           this.robotStart()
        }
        
        if(inputData.targetSolt == 'number1'){
            if(inputData.data.codeNode != null){
                if(inputData.targetSolt == 'number1'){
                    this.inputCodeNode(inputData.data.codeNode)
                }
            }else{
                console.warn('layoutEx inputData.data.codeNode == null ')
            }
        }else if(inputData.targetSolt == 'number2'){
            if(inputData.data.codeNode != null){
                if(inputData.data.codeNode.parent == this.codeNode.node){
                    this.dragOutByIndex(this.getIndexByCodeNode(inputData.data.codeNode))
                }
            }
        }
    }

    //收到某个格子长度发生改变后改变自身的位置
    this.onListenOtherOneGirdChange = (aniType)=>{
       

        var curI = 0
        var curJ = 0

        var dirX = 1
        var dirY = 1

        var dir = this.config.otherConfig.dir.default
        if(dir == 1 ){
            dirX = -1
            dirY = -1
        }else if(dir == 2){
            dirX = 1
            dirY = -1
        }else if(dir == 3){
            dirX = -1
            dirY = 1
        }

        var startX = this.girdWidth * 0.5 * dirX
        var startY = this.girdHeight * 0.5 * dirY

        var rowNums = this.rowNums
        var columnNums = this.columnNums
        var girdHeight = this.config.otherConfig.girdHeight.default
        var canEmpty = this.config.otherConfig.canEmpty.default
        var xOrY = this.config.otherConfig.xOrY.default
        // if(xOrY == 1){
        //     dirX *= dirX
        //     dirY *= dirY
        // }

        // console.log('rowNums', rowNums, 'columnNums', columnNums)

        if(xOrY == 0){
            for(var i = 0; i < this.goodMap.length; i++){
                var gird = this.goodMap[i]
                if(canEmpty == 0){
                    if(gird.codeNode == null){
                        continue
                    }
                }
                if(curI < columnNums){
                    curI += 1
                }else{
                    curJ += 1
                    curI = 1
                    startX = this.girdWidth * 0.5 * dirX
                    startY = (curJ + 0.5) * this.girdHeight * dirY
                }
                // console.log('i', i, curI, curJ, startY, gird.codeNode)
                gird.xPos = startX
                gird.yPos = startY
                startX += this.girdWidth * dirX
                gird.fresh(aniType)
            }
        }else{
            for(var i = 0; i < this.goodMap.length; i++){
                var gird = this.goodMap[i]
                if(canEmpty == 0){
                    if(gird.codeNode == null){
                        continue
                    }
                }
                if(curJ < rowNums){
                    curJ += 1
                }else{
                    curI += 1
                    curJ = 1
                    startX = (curI + 0.5) * this.girdWidth * dirX
                    startY = this.girdHeight * 0.5 * dirY
                }

                gird.xPos = startX
                gird.yPos = startY
                startY += this.girdHeight * dirY
                gird.fresh(aniType)
            }
        }
    }

    this.outputHandle = (targetSolt, codeNode)=>{
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            if(this.linkDatas.outputSolt[targetSolt]){
                var onelinkDatas = this.linkDatas.outputSolt[targetSolt]
                for(var i = 0; i < onelinkDatas.length; i++){
                    var onelinkData = onelinkDatas[i]
                    onelinkData.robot.inputHandle({solt:onelinkData.solt, data:{codeNode: codeNode}, targetSolt: onelinkData.otherSolt})
                }
            }
        }, targetSolt, 1)
    }

    this.robotRelease = ()=>{
        for(var i = 0; i < this.goodMap.length; i++){
            this.goodMap[i].release()
        }
        this.goodMap = []
        this.codeNode = null
        CodeRobot.prototype.robotRelease.call(this)
    }


    this.runAnimate = ()=>{

    }

    this.onCardSelect = ()=>{
        this.onClickSetting()
        this.freshOtherConfig(this.config.otherConfig)
    }

    this.robotPreview = ()=>{
        
        this.onClickSetting()
        this.freshOtherConfig(this.config.otherConfig)
        // console.log('layoutEx预览时是否查找到', this.previewCodeNode)
        this.onCardUnSelect()
    }

    this.onClickSetting = ()=>{
        cc.director.emit('getLineBySolt', {soltid: this.instance.cardexSolt.getChildByName('dot').uuid, dontAutoCreate: true, cb:(line)=>{
            if(line != null){
                var bindRobot
                if(line.endDrop.card == this.instance){
                    bindRobot = line.startDrop.card.robot
                }else{
                    bindRobot = line.endDrop.card.robot
                }
                if(bindRobot.codeNode != null){
                    this.previewCodeNode = bindRobot.getLinkCodeNode()
                }else{
                    if(bindRobot.getLinkCodeNode != null){
                        this.previewCodeNode = bindRobot.getLinkCodeNode()
                    }
                }
            }
        }});
    }

    //
    this.freshOtherConfig = (config)=>{
     
        if(this.previewCodeNode == null){
            this.onClickSetting()
        }
        if(this.previewCodeNode != null){
            var girdWidth = config.girdWidth.default
            var girdHeight = config.girdHeight.default

            var rowNums = config.rowNums.default
            var columnNums = config.columnNums.default

            // this.previewCodeNode.width = girdWidth * columnNums 
            // this.previewCodeNode.height = girdHeight * rowNums

            var dirX = 1
            var dirY = 1
    
            var dir = this.config.otherConfig.dir.default
            if(dir == 1 ){
                dirX = -1
                dirY = -1
            }else if(dir == 2){
                dirX = 1
                dirY = -1
            }else if(dir == 3){
                dirX = -1
                dirY = 1
            }
    
            var ctx = this.previewCodeNode.ctx
            this.previewCodeNode.disableUpdatePreview = true
            // console.log('更新绘制范围', ctx, rowNums, columnNums, girdWidth, girdHeight)

            ctx.clear()
            ctx.lineWidth = 9;
            ctx.strokeColor = cc.Color.RED;
            ctx.rect(0, 0, girdWidth * columnNums  * dirX, girdHeight * rowNums * dirY)
            ctx.stroke();

            ctx.fillColor = cc.Color.BLUE;
            ctx.circle(0, 0, 20);
            ctx.fill()

            if(rowNums > 1){
                ctx.strokeColor = cc.Color.GREEN
                for(var i = 1; i < rowNums; i++){
                    ctx.moveTo(0, i * girdHeight * dirY)
                    ctx.lineTo(columnNums * girdWidth * dirX, i * girdHeight * dirY)
                }
            }

            if(columnNums > 1){
                ctx.strokeColor = cc.Color.GREEN
                for(var j = 1; j < columnNums; j++){
                    ctx.moveTo(j * girdWidth * dirX, 0)
                    ctx.lineTo(j * girdWidth * dirX, rowNums * girdHeight * dirY)
                }
            }
            
            ctx.stroke()
        }
    }

    this.onCardUnSelect = ()=>{
        this.previewCodeNode = null
    }

    this.getLinkCodeNode = ()=>{
        var findCodeNode = null
        for(var key in this.instance.linkData.inputSolt){
            if(findCodeNode != null){
                break
            }
            var dropNode = this.instance.linkData.inputSolt[key]
            cc.director.emit('getLineBySolt', {soltid: dropNode.dot.uuid, dontAutoCreate: true, cb:(line)=>{
                if(line != null){
                    var bindRobot
                    if(line.endDrop.card == this.instance){
                        bindRobot = line.startDrop.card.robot
                    }else{
                        bindRobot = line.endDrop.card.robot
                    }
                    if(bindRobot.getLinkCodeNode != null){
                        findCodeNode = bindRobot.getLinkCodeNode()
                    }
                }
             }})
        }
        return findCodeNode
    }
}
layoutExRobot.prototype = new CodeRobot()

//一个格子地图需要实现的功能，
//放置物品，物品尺寸是以格子为基础单位，有大有小，且需要判断是否有空间可以放置
//删除物品（）
//获取点击区域的物品（已经实现）
const MapCtrlType = {
    MOVE: 'move',
    NONE: 'none',
}


// "mapGoods": [
//     {
//         "girdX": 20,
//         "girdY": 10,
//         "flip": 1,
//         "modal": 1,
//         "url": "cityTiles11_3x2"
//         "ani": ?
//         "skin": ?
//     }
// ],

function createCodeNode(info, codeProgress, cb){
    var node = new cc.Node()
    var codeNode = node.addComponent('CodeNode')
    codeNode.codeProgress = codeProgress
    
    var anchorInfo = GlobalConfig.getZooBuidingDit()[info.src]
   
    if(anchorInfo != null){
        codeNode.anchorX = anchorInfo.anchorX / 10
        codeNode.anchorY = anchorInfo.anchorY / 10
    }

    var customName = info.src.split('/')
    
    var scaleX = 1 
    if(info.scaleX != null){
        scaleX = info.scaleX
    }
    codeNode.scaleX *= info.flip * scaleX
    
    if(info.scaleY != null){
        codeNode.scaleY = info.scaleY
    }
    
    codeNode.modal = info.modal
    codeNode.src = info.src

    if(info.modal == 4){
        //文字类型
        codeNode.customeName = 'label'
        node.name = 'label'
    }else{
        codeNode.customeName = info.src
        node.name = customName[customName.length - 1]
    }

    if(info.modal == 0){
        cb()
    }else if(info.modal == 1){
        var sprite = node.addComponent(cc.Sprite)
        codeProgress.codeRobotConfig.loadResHandle(info.src, cc.SpriteFrame, (res)=>{
            // console.log('加载成功sf', res)
            sprite.spriteFrame = res
            codeNode.premulAlpha = info.premulAlpha
            if(res != null && res.getTexture() != null){
                if(res.getTexture().hasPremultipliedAlpha()){
                    sprite.srcBlendFactor = cc.macro.BlendFactor.ONE;
                }
            }
            cb()
        })
    }else if(info.modal == 2){
        node.addComponent(cc.Sprite)
        cb()
    }else if(info.modal == 3){
        var spineCom = node.addComponent(sp.Skeleton)
        // if(info.premulAlpha == 1){
        //     spineCom.premultipliedAlpha = false
        // }
       
        codeProgress.codeRobotConfig.loadResHandle(info.src, sp.SkeletonData, (res)=>{
            spineCom.skeletonData = res
            if(info.ani != null && info.ani != ""){
                spineCom.setAnimation(0, info.ani, true)
            }
            if(info.skin != null && info.skin != ""){
                spineCom.setSkin(info.skin)
            }
            codeNode.premulAlpha = info.premulAlpha
            // spineCom.loop = true
            // node.addComponent('SpinePlusComponent')
            cb()
        })
    }else if(info.modal == 4){
        var label = node.addComponent(cc.Label)
        cc.resources.load('app/font/wowfont', cc.Font, (err, asset) => {
            if (err) {
                cc.error(`wowfont[资源加载] 错误 ${err}`);
                cb()
            } else {
                if(cc.isValid(node) == true){
                    label.font = asset
                }
                cb()
            }
        });
    }else {
        cb()
    }
    codeNode.init()
    return codeNode
}

//格子地图
function girdMapRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)
    this.yScale = 0.628
    this.xRotation = 45
    this.normalize = null
    this.curSelectCodeNode = null   //当前选择的codeNode也有可能是未放入mapmap的节点，预先放入
    this.curDoCtrl = MapCtrlType.NONE
    this.errColor = 'EA3F5D'
    this.okColor = '50B18E'
    this.tagSpriteNode = null
    this.tagSpriteNodeBack = null


    this.initTouchTag = (width, height)=>{
        if(this.touchTag == null){
            this.touchTag = new cc.Node().addComponent("CodeNode")
            this.touchTag.zIndex = 9999
            this.touchTag.parent = this.codeNode.node

            this.tagSpriteNode = new cc.Node().addComponent('CodeNode')
            this.tagSpriteNode.parent = this.touchTag.node
            this.tagSpriteNode.name = 'ctrlGird'

            this.tagSpriteNodeBack = new cc.Node().addComponent('CodeNode')
            this.tagSpriteNodeBack.parent = this.codeNode.node //this.touchTag.node
            this.tagSpriteNodeBack.name = 'ctrlGird'
            this.tagSpriteNodeBack.zIndex = -1

            var ctx = this.tagSpriteNode.addComponent(cc.Graphics)
            ctx.lineWidth = 15
            ctx.lineJoin = cc.Graphics.LineJoin.ROUND;
            ctx.lineCap = cc.Graphics.LineCap.ROUND;
            this.tagSpriteNode.active = 0
            

            var ctx2 = this.tagSpriteNodeBack.addComponent(cc.Graphics)
            ctx2.lineWidth = 15
            ctx2.lineJoin = cc.Graphics.LineJoin.ROUND;
            ctx2.lineCap = cc.Graphics.LineCap.ROUND;
            // this.tagSpriteNode.addComponent(cc.Sprite).srcBlendFactor = cc.macro.BlendFactor.ONE;
            this.tagSpriteNodeBack.active = 0
            
            var mapctrl_del = new cc.Node().addComponent("CodeNode")
            var mapctrl_filp = new cc.Node().addComponent("CodeNode")
            var mapctrl_move = new cc.Node().addComponent("CodeNode")

            mapctrl_del.parent = this.touchTag.node
            mapctrl_filp.parent = this.touchTag.node
            mapctrl_move.parent = this.touchTag.node

            mapctrl_del.addComponent(cc.Sprite).srcBlendFactor = cc.macro.BlendFactor.ONE;
            mapctrl_filp.addComponent(cc.Sprite).srcBlendFactor = cc.macro.BlendFactor.ONE;
            mapctrl_move.addComponent(cc.Sprite).srcBlendFactor = cc.macro.BlendFactor.ONE;

            mapctrl_del.name = 'mapctrl_del'
            mapctrl_filp.name = 'mapctrl_filp'
            mapctrl_move.name = 'mapctrl_move'

            var angles = [-45, 0, 45]
            var arr = [mapctrl_del, mapctrl_filp, mapctrl_move]
            var initButton = (index)=>{

                arr[index].node.scale = 2

                var btn = arr[index].addComponent(cc.Button)
                btn.transition = cc.Button.Transition.SCALE
                btn.duration = 0.1
                btn.zoomScale = 0.9

                this.codeProgress.codeRobotConfig.loadViewCodeRes(arr[index].name, cc.SpriteFrame, (res)=>{
                    arr[index].getComponent(cc.Sprite).spriteFrame = res
                })

                arr[index].center = [0,0]
                arr[index].radius = 300
                
                // arr[j].angleToPos = -90 + 
                arr[index].angleToPos = angles[index]
                arr[index].node.active = false

                arr[index].on(cc.Node.EventType.TOUCH_END, (event)=>{
                    if(arr[index].opacity != 255){return}
                    console.log('惦记了,' , arr[index].name)

                    if(arr[index].name == 'mapctrl_move'){
                        this.curDoCtrl = MapCtrlType.MOVE
                        this.curSelectCodeNode.opacity = 175
                        this.tagSpriteNode.active = 1
                        this.tagSpriteNodeBack.active = 1
                        this.showMenuArrAni(false)

                        var widthGird = this.curSelectCodeNode.widthGird
                        var heightGird = this.curSelectCodeNode.heightGird

                        for(var i = 0; i < widthGird; i++){
                            for(var j = 0; j < heightGird; j++){
                                var xi = this.curSelectCodeNode.girdX + i
                                var yj = this.curSelectCodeNode.girdY + j
                                var gird = this.goodMapMap[xi][yj]
                                gird.codeNode = null
                                // console.log('当前建筑占用的格子',gird)    
                            }
                        }
                    }else if(arr[index].name == 'mapctrl_del'){
                        var widthGird = this.curSelectCodeNode.widthGird
                        var heightGird = this.curSelectCodeNode.heightGird

                        for(var i = 0; i < widthGird; i++){
                            for(var j = 0; j < heightGird; j++){
                                var xi = this.curSelectCodeNode.girdX + i
                                var yj = this.curSelectCodeNode.girdY + j
                                var gird = this.goodMapMap[xi][yj]
                                gird.codeNode = null
                                // console.log('当前建筑占用的格子',gird)    
                            }
                        }
                        //删除物体时会触发选中物体为空，不会触发取消选中物体
                        this.outputHandle('robot1',  {codeNode: null})

                        this.curSelectCodeNode.destroyNode()
                        this.curSelectCodeNode = null
                        this.tagSpriteNode.active = 0
                        this.tagSpriteNodeBack.active = 0
                        this.showMenuArrAni(false)
                        this.curDoCtrl = MapCtrlType.NONE
                    }else if(arr[index].name == 'mapctrl_filp'){
                        this.curSelectCodeNode.scaleX *= -1
                        if(this.curSelectCodeNode.widthGird != this.curSelectCodeNode.heightGird){
                            this.curDoCtrl = MapCtrlType.MOVE
                            this.curSelectCodeNode.opacity = 175
                            this.tagSpriteNode.active = 1
                            this.tagSpriteNodeBack.active = 1
                            this.showMenuArrAni(false)

                            var widthGird = this.curSelectCodeNode.widthGird
                            var heightGird = this.curSelectCodeNode.heightGird
    
                            for(var i = 0; i < widthGird; i++){
                                for(var j = 0; j < heightGird; j++){
                                    var xi = this.curSelectCodeNode.girdX + i
                                    var yj = this.curSelectCodeNode.girdY + j
                                    var gird = this.goodMapMap[xi][yj]
                                    gird.codeNode = null
                                    // console.log('当前建筑占用的格子',gird)    
                                }
                            }
    
                            var a = this.curSelectCodeNode.widthGird
                            this.curSelectCodeNode.widthGird = this.curSelectCodeNode.heightGird
                            this.curSelectCodeNode.heightGird = a

                            // var dir = this.curSelectCodeNode.scaleX > 0 ? 1 : 2
                            this.initTouchTag(this.curSelectCodeNode.widthGird, this.curSelectCodeNode.heightGird)
                            
                        }
                    }
                }, this)
            }
            this.menuArr = arr
            for(var j = 0; j < arr.length; j++){
                initButton(j)
            }

            this.touchTag.x = 0
            this.touchTag.y = 0
            // this.touchTag.scaleX = 1
            // this.touchTag.scaleY = 1
        }

        var sfName = width + 'x' + height 
        // if(dir != null){
        //     sfName += '-' + dir
        // }
        this.touchTag.widthGird = width
        this.touchTag.heightGird = height
        this.tagSpriteNode.sfName = sfName
        this.tagSpriteNodeBack.sfName = sfName

        this.freshTagSprite()


        // ctx.moveTo(0, 0)
        // ctx.lineTo(0, this.girdHeight)
        // ctx.lineTo(this.girdWidth, this.girdHeight)
        // ctx.lineTo(this.girdWidth, 0)
        // ctx.lineTo(0, 0)
        // ctx.stroke()

        // this.codeProgress.codeRobotConfig.loadViewCodeRes(sfName, cc.SpriteFrame, (res)=>{
        //     if(this.tagSpriteNode.sfName == res.name){
        //         this.tagSpriteNode.getComponent(cc.Sprite).spriteFrame = res
        //     }
        // })
       
    }

    //刷新tagSprite
    this.freshTagSprite = (color)=>{
        var width = this.touchTag.widthGird
        var height = this.touchTag.heightGird

        // this.tagSpriteNode.sfName = sfName

        var ctx = this.tagSpriteNode.getComponent(cc.Graphics)
        var ctx2 = this.tagSpriteNodeBack.getComponent(cc.Graphics)
        if(this.curSelectCodeNode != null){
            this.tagSpriteNodeBack.zIndex = this.curSelectCodeNode.zIndex - 1
        }

        if(color != null){
            ctx.strokeColor = cc.Color.WHITE.fromHEX(color)
            ctx2.strokeColor = cc.Color.WHITE.fromHEX(color)
            ctx.fillColor = cc.Color.WHITE.fromHEX(color + '80')
            ctx2.fillColor = cc.Color.WHITE.fromHEX(color + '80')
        }

        var point1 = this.D2To25D(0, this.girdHeight * height)
        var point2 = this.D2To25D(width * this.girdWidth, this.girdHeight * height)
        var point3 = this.D2To25D(width * this.girdWidth, 0)

        var moveX = point2.x * 0.5
        var moveY = (point3.y - point1.y) * 0.5
        // console.log(point1.y, point2.y, point3.y)
        // console.log('转换坐标',girdWidth * columnNums, girdHeight * rowNums,  point1)
        ctx.clear()
        // ctx.moveTo(point2.x, point2.y)
        // ctx.lineTo(point3.x, point3.y)
        // ctx.lineTo(0,0)
        // ctx.moveTo(0,0)
        // ctx.lineTo(point1.x, point1.y)
        // ctx.lineTo(point2.x, point2.y)
        // ctx.lineTo(point3.x, point3.y)
        // ctx.lineTo(0,0)
        // ctx.stroke();

        ctx2.clear()
        // ctx2.moveTo(0,0)
        // ctx2.lineTo(point1.x, point1.y)
        // ctx2.lineTo(point2.x, point2.y)
        // ctx2.stroke();

        ctx2.moveTo(0,0)
        ctx2.lineTo(point1.x, point1.y)
        ctx2.lineTo(point2.x, point2.y)
        ctx2.lineTo(point3.x, point3.y)
        ctx2.lineTo(0,0)
        ctx2.fill()

        this.tagSpriteNode.x = -moveX
        this.tagSpriteNode.y = -point2.y * 0.5

        this.tagSpriteNodeBack.x = this.touchTag.x - moveX
        this.tagSpriteNodeBack.y = this.touchTag.y - point2.y * 0.5
    }

    this.showMenuArrAni = (isShow, withAni)=>{
        if(this.touchTag != null){
            this.touchTag.node.pauseSystemEvents(true)
            this.codeProgress.scheduleOnce(()=>{
                this.touchTag.node.resumeSystemEvents(true)
            }, 0.6)
        }
        
        if(isShow == false){
            var initItem = (i)=>{
                var item = this.menuArr[i]
                cc.Tween.stopAllByTarget(item)
                if(withAni == false){
                    item.node.active = false
                }else{
                    cc.tween(item).to(0.5, {radius : 0, opacity: 0},  {easing: 'backIn'}).call(()=>{
                        item.node.active = false
                        //必须把touchTag区分出来了
                    }).start()
                }
            }
            for(var i = 0; i < this.menuArr.length; i++){
                initItem(i)
            }
        }else{
            for(var i = 0; i < this.menuArr.length; i++){
                var item = this.menuArr[i]
                if(this.curDoCtrl == MapCtrlType.MOVE && i == 2){
                    item.node.active = false
                    continue
                }
                item.radius = 0
                item.node.active = true
                cc.Tween.stopAllByTarget(item)
                // var radius = (this.girdHeight * this.yScale * this.touchTag.heightGird) + (this.girdWidth * this.touchTag.widthGird) 
                // radius = Math.max(250, radius * 0.5)
                cc.tween(item).to(0.5, {radius: -300, opacity: 255},  {easing: 'backOut'}).start()
            }
        }
    }

    this.robotInit = (cb)=>{
        this.goodMapMap = [] //从下到上y , 从左到右x, |||
        this.curPutCount = 0
        this.rowNums = this.config.otherConfig.rowNums.default
        this.columnNums = this.config.otherConfig.columnNums.default
        this.girdHeight =  this.config.otherConfig.girdHeight.default
        this.girdWidth =  this.config.otherConfig.girdWidth.default
        this.yScale =  this.config.otherConfig.yScale.default
        this.xRotation =  this.config.otherConfig.xRotation.default

        
        var mapGirds = this.config.otherConfig.mapGirds.default
        for(var i = 0; i < this.columnNums; i++){
            var row = []
            for(var j = 0; j < this.rowNums; j++){
                var gird = Gird(i, j, this.girdWidth, this.girdHeight, this)
                if(mapGirds[i] != null && mapGirds[i][j] != null){
                    gird.girdType = mapGirds[i][j]
                }
                row.push(gird)
            }
            this.goodMapMap.push(row)
        }

        this.onListenOtherOneGirdChange()
        // console.log('goodMap',this.goodMapMap)
        return true
    }

    this.D2To25D = (x, y)=>{
        var hudu = (Math.PI / 180) *  this.xRotation    //顺时针旋转角度是负的
        // var hudu2 = (Math.PI / 180) * (90 - this.xRotation)
        // x = -x
        y = -y
        var oriX = (x - y) * Math.cos(hudu)
        var oriY = (x + y) * Math.sin(hudu)
        return cc.v2(oriX, -oriY * this.yScale)
    }

    this.D25ToD2 = (x, y)=>{
        var hudu = (Math.PI / 180) * -this.xRotation //逆时针转回去角度是正的
        var hudu2 = (Math.PI / 180) * (-90 + this.xRotation) //逆时针转回去角度是正的

        // var scale = 2 //this.D2To25D(0, this.girdWidth)

        y = y * (1 / this.yScale)
        var oriX = (y * Math.sin(hudu2) + x * Math.cos(hudu2)) / 2
        var oriY = (y * Math.cos(hudu) - x * Math.sin(hudu)) / 2 

        var scale = this.D25ToD2Normalize()
        return cc.v2(oriX * scale.x, oriY * scale.y)
    }

    this.D25ToD2Normalize = ()=>{
        if(this.normalize != null){
            return this.normalize
        }
        var oriWidth = this.columnNums * this.girdWidth
        var oriHeight = this.rowNums * this.girdHeight
        var pointMax = this.D2To25D(oriWidth, oriHeight)
        
        
        var hudu = (Math.PI / 180) * -this.xRotation //逆时针转回去角度是正的
        var hudu2 = (Math.PI / 180) * (-90 + this.xRotation) //逆时针转回去角度是正的
        // var scale = 2 //this.D2To25D(0, this.girdWidth)
        pointMax.y = pointMax.y * (1 / this.yScale)
        var oriX = (pointMax.y * Math.sin(hudu2) + pointMax.x * Math.cos(hudu2)) / 2
        var oriY = (pointMax.y * Math.cos(hudu) - pointMax.x * Math.sin(hudu)) / 2 
        this.normalize = cc.v2(oriWidth / oriX, oriHeight / oriY)
        return this.normalize
    }

    this.GirdXYToD25 = (startX, startY, widthGird = 1, heightGird = 1)=>{
        return this.D2To25D((startX + widthGird * 0.5) * this.girdWidth, (startY + heightGird * 0.5) * this.girdHeight)
    }

    this.D25ToGirdXY = (D25pos)=>{
        var D2pos = this.D25ToD2(D25pos.x, D25pos.y)
        return this.D2ToGirdXY(D2pos)
    }

    this.D2ToGirdXY = (D2pos, widthGird = 1, heightGird = 1)=>{
        var x = Math.round(D2pos.x / this.girdWidth - widthGird * 0.5)
        var y = Math.round(D2pos.y / this.girdHeight - heightGird * 0.5)
        return {x: x, y: y}
    }


    this.checkCanPut = (x, y, widthGird, heightGird, girdTypeArr)=>{
        if(x >= 0 && x + widthGird <= this.columnNums && y >= 0 && y + heightGird <= this.rowNums){
            var canPut = true
            for(var i = 0; i < widthGird; i++){
                for(var j = 0; j < heightGird; j++){
                    var xi = x + i
                    var yj = y + j
                    var gird = this.goodMapMap[xi][yj]
                    if(gird.codeNode != null){
                        canPut = false
                    }
                    if(gird.girdType == 0){
                        canPut = false
                    }
                    if(this.config.otherConfig.unlockGirdTypes.default.indexOf(gird.girdType) == -1){
                        //未在解锁列表的格子也不能放置
                        canPut = false
                    }
                    if(girdTypeArr != null){
                        //不是同一个区域的也不能放置
                        if(girdTypeArr.indexOf(gird.girdType) == -1){
                            canPut = false
                        }
                    }
                }
            }
            return canPut
        }else{
            return false
        }
    }

    this.robotStart = ()=>{
        if(this.codeNode == null){
            var bindRobot = this.linkDatas.cardexSolt[0]
            if(bindRobot != null){
                bindRobot = bindRobot.robot
                if(bindRobot.codeNode != null){
                    this.codeNode = bindRobot.codeNode
                    //可以响应点击的区域也要用转换后的尺寸包围
                    var centerUp = this.D2To25D(0, this.rowNums * this.girdHeight)
                    var rightDown = this.D2To25D(this.columnNums * this.girdWidth, this.rowNums * this.girdHeight)
                    var cneterDown = this.D2To25D(this.columnNums * this.girdWidth, 0)

                    this.codeNode.height = centerUp.y - cneterDown.y
                    this.codeNode.width =  rightDown.x
                    this.codeNode.anchorX = 0
                    this.codeNode.anchorY = 1 - (centerUp.y / this.codeNode.height)
                    // console.log("this.codeNode.height", this.codeNode.height, this.codeNode.width, this.codeNode.anchorY)

                    this.initTouchTag(1,1)
                    // console.log('this.touch', this.tagSpriteNode)
                    // this.touchTag.active = false
                
                    var hasMove = 0

                    this.codeNode.on(cc.Node.EventType.TOUCH_START, (event)=>{
                        hasMove = 0
                        if(this.config.otherConfig.canEdit.default == 0){
                            return
                        }
                        if(this.curDoCtrl == MapCtrlType.MOVE){
                            event.stopPropagation()
                            this.showMenuArrAni(false)
                        }
                    }, this)
                
                    this.codeNode.on(cc.Node.EventType.TOUCH_END, (event)=>{
                        
                        var location = this.codeNode.node.convertToNodeSpaceAR(event.getLocation())
                        var D2pos = this.D25ToD2(location.x, location.y)
                        // var D25pos = this.D2To25D(D2pos.x, D2pos.y)
                        // console.log('event', D2pos.x, D2pos.y)
                        // if(this.codeNode.node.children[0] != null){
                        //     this.codeNode.node.children[0].x = D25pos.x
                        //     this.codeNode.node.children[0].y = D25pos.y
                        // }
                        // if(this.codeNode.node.children[1] != null){
                        //     this.codeNode.node.children[1].x = D2pos.x
                        //     this.codeNode.node.children[1].y = D2pos.y
                        // }
                        var x = Math.floor(D2pos.x / this.girdWidth)
                        var y = Math.floor(D2pos.y / this.girdHeight)

                        var clickgird = null
                        if( this.goodMapMap[x] != null){
                            clickgird = this.goodMapMap[x][y]
                        }

                        if(clickgird != null && clickgird.codeNode == null){
                            this.testClick(clickgird)
                        }
                        
                        if(this.config.otherConfig.canEdit.default == 0){//没有移动才算点击
                            if(clickgird != null && clickgird.codeNode != null && hasMove < 3){
                                //当不是编辑状态时输出的是点击了物体
                                this.outputHandle('robot3',  {codeNode: clickgird.codeNode})
                                //当编辑状态时输出的是选中了物体
                            }
                            return
                        }
                        // console.log('当前状态',this.curDoCtrl, this.curSelectCodeNode, this.config.otherConfig.unlockGirdTypes.default)

                        if(this.curDoCtrl == MapCtrlType.NONE){
                            //如果当前操作的是空
                            
                            // console.log('点击到clickgird', clickgird)

                            if(clickgird != null && clickgird.codeNode != null){
                                if(hasMove > 3){return}
                                // if(clickgird.codeNode.getComponent('InGirdMapAI') != null){
                                //     //编辑状态下点击的是动态物体，忽视
                                //     return
                                // }
                                //点击了地图上位置不是空的格子
                                if(this.config.otherConfig.unlockGirdTypes.default.indexOf(clickgird.girdType) == -1){
                                    //未在解锁列表的格子不响应点击
                                    return
                                }
                                if(this.curSelectCodeNode != clickgird.codeNode){
                                    if(this.curSelectCodeNode != null){
                                        this.outputHandle('robot2',  {codeNode: this.curSelectCodeNode} )
                                    }
                                    this.outputHandle('robot1',  {codeNode: clickgird.codeNode} )
                                    this.curSelectCodeNode = clickgird.codeNode
                                    
                                    var widthGird = clickgird.codeNode.widthGird
                                    var heightGird = clickgird.codeNode.heightGird

                                    // console.log('当前点击格子的clickgird', clickgird.codeNode)
    
                                    var D25pos = this.D2To25D((this.curSelectCodeNode.girdX + widthGird * 0.5) * this.girdWidth, (this.curSelectCodeNode.girdY + heightGird * 0.5) * this.girdHeight)
                                   
                                    this.initTouchTag(widthGird, heightGird)
                                    // this.touchTag.active = true
                                    this.showMenuArrAni(true)//显示菜单选项的动画
                                    this.touchTag.x = D25pos.x
                                    this.touchTag.y = D25pos.y
                                    this.freshTagSprite(this.okColor)
                                    this.tagSpriteNode.active = 1
                                    this.tagSpriteNodeBack.active = 1
                                    // this.tagSpriteNode.color = this.okColor
                                }
                            }else{
                                //点击到了空白地方，或者空白格子
                                if(this.curSelectCodeNode != null){
                                    this.outputHandle('robot2', {codeNode: this.curSelectCodeNode})
                                    this.curSelectCodeNode = null
                                    this.showMenuArrAni(false)
                                    this.tagSpriteNode.active = 0
                                    this.tagSpriteNodeBack.active = 0
                                }
                            }
                            return
                        }

                        if(this.curDoCtrl != MapCtrlType.MOVE){
                            return
                        }

                        event.stopPropagation()

                        var widthGird = this.curSelectCodeNode.widthGird
                        var heightGird = this.curSelectCodeNode.heightGird

                        var D25pos = this.D2To25D((x + widthGird * 0.5) * this.girdWidth, (y + heightGird * 0.5) * this.girdHeight)

                        this.touchTag.x = D25pos.x
                        this.touchTag.y = D25pos.y


                        var girdTypeArr = null
                        if(this.curSelectCodeNode != null){
                            this.curSelectCodeNode.x = this.touchTag.x
                            this.curSelectCodeNode.y = this.touchTag.y
                            this.curSelectCodeNode.girdX = x
                            this.curSelectCodeNode.girdY = y
                            if(this.curSelectCodeNode.girdTypeArr.length != 0){
                                girdTypeArr = this.curSelectCodeNode.girdTypeArr
                            }
                        }

                        var canPut = this.checkCanPut(x, y, widthGird, heightGird, girdTypeArr)
                        if(canPut == false){
                            this.freshTagSprite(this.errColor)
                            this.showMenuArrAni(true)
                        }else{
                            for(var i = 0; i < widthGird; i++){
                                for(var j = 0; j < heightGird; j++){
                                    var xi = x + i
                                    var yj = y + j
                                    var gird = this.goodMapMap[xi][yj]
                                    gird.codeNode = this.curSelectCodeNode
                                }
                            }
                            
                            this.curSelectCodeNode.girdX = x
                            this.curSelectCodeNode.girdY = y
                            this.outputHandle('robot2', {codeNode: this.curSelectCodeNode})
                            this.curSelectCodeNode.opacity = 255
                            this.curSelectCodeNode = null
                            // this.tagSpriteNode.color = this.okColor
                            this.freshTagSprite(this.okColor)
                            this.curDoCtrl = MapCtrlType.NONE
                            this.tagSpriteNode.active = 0
                            this.tagSpriteNodeBack.active = 0
                        }
                    }, this)

                    this.codeNode.on(cc.Node.EventType.TOUCH_MOVE, (event)=>{
                        hasMove += 1
                        if(this.config.otherConfig.canEdit.default == 0){
                            return
                        }
                        
                        if(this.curDoCtrl != MapCtrlType.MOVE){
                            return
                        }
                        event.stopPropagation()
                        var location = this.codeNode.node.convertToNodeSpaceAR(event.getLocation())
                        var D2pos = this.D25ToD2(location.x, location.y)

                        var x = Math.floor(D2pos.x / this.girdWidth)
                        var y = Math.floor(D2pos.y / this.girdHeight)
                        
                        var widthGird = this.touchTag.widthGird
                        var heightGird = this.touchTag.heightGird

                        var D25pos = this.D2To25D((x + widthGird * 0.5) * this.girdWidth, (y + heightGird * 0.5) * this.girdHeight)

                        this.touchTag.x = D25pos.x
                        this.touchTag.y = D25pos.y

                        var girdTypeArr = null
                        if(this.curSelectCodeNode != null){
                            this.curSelectCodeNode.x = this.touchTag.x
                            this.curSelectCodeNode.y = this.touchTag.y
                            this.curSelectCodeNode.girdX = x
                            this.curSelectCodeNode.girdY = y
                            if(this.curSelectCodeNode.girdTypeArr.length != 0){
                                girdTypeArr = this.curSelectCodeNode.girdTypeArr
                            }
                        }

                        var canPut = this.checkCanPut(x, y, widthGird, heightGird, girdTypeArr)
                        if(canPut == false){
                            this.freshTagSprite(this.errColor)
                        }else{
                            this.freshTagSprite(this.okColor)
                        }
                    }, this)
                }
            }

            //现在还要初始化,格子原本有的物品
            var initOk = 0
            var mapGoods = this.config.otherConfig.mapGoods.default
            
            var init = (i)=>{
                var good = mapGoods[i]
                var codeNode = createCodeNode(good, this.codeProgress, ()=>{
                    initOk += 1
                    if(initOk == mapGoods.length){
                        // if(cb != null){
                        //     cb(true)
                        // }
                    }

                    if(codeNode.spineCom != null){
                        if(codeNode.spineCom.skeletonData == null){
                            this.removeNodefromGirdMap(codeNode)
                            codeNode.destroyNode()
                            return
                        }
                    }else if(codeNode.sprite != null){
                        if(codeNode.sprite.spriteFrame == null){
                            this.removeNodefromGirdMap(codeNode)
                            codeNode.destroyNode()
                            return
                        }
                    }
                    if(good.isAi == 1){
                        var inGirdMapAI = codeNode.addComponent('InGirdMapAI')
                        // id暂时为空
                        inGirdMapAI.id = good.id
                        inGirdMapAI.girdMapRobot = this
                    }
                })
                codeNode.dynamiczIndex = 1
                this.inputCodeNodeWithPos(codeNode, good.girdX, good.girdY, good.flip)
            }
            // console.log("mapGoods on初始化", mapGoods)
            for(var i = 0; i < mapGoods.length; i++){
                init(i)
            }
        }
    }

    this.removeNodefromGirdMap = (codeNode)=>{
        if(this.goodMapMap[codeNode.girdX] != null){
            if(this.goodMapMap[codeNode.girdX][codeNode.girdY] != null){
                if(this.goodMapMap[codeNode.girdX][codeNode.girdY].codeNode == codeNode){
                    this.goodMapMap[codeNode.girdX][codeNode.girdY].codeNode = null
                }
            }
        }
    }

    //获取行动路径
    this.getRoad = (startGird, endGird, byTypeArr)=>{
        var findMap = this.buildFindMap(byTypeArr)
        // console.log('findMap', findMap)
        var girds = new PF.Grid(findMap)
        var finder = new PF.AStarFinder();
        var path = finder.findPath(startGird.x, startGird.y, endGird.x,  endGird.y, girds);
        findMap = null
        girds = null
        finder = null
        return path
    }

    //获取随机一个可以行走的格子
    this.getRandomEmptyGird = (byTypeArr)=>{
        var arr = []
        for(var j = 0; j < this.rowNums; j++){
            for(var i = 0; i < this.columnNums; i++){
                var gird = this.goodMapMap[i][j]
                var hadBuilding = 0
                //如果有东西的话一定不能走
                if(gird.codeNode != null){
                    hadBuilding = 1
                }else{
                   
                }
                if(byTypeArr != null){
                    if(byTypeArr.indexOf(gird.girdType) == -1){
                        hadBuilding = 1
                    }
                }
                if(hadBuilding == 0){
                    arr.push(gird)
                }
            }
        }
        if(arr.length == 0){
            return null
        }
        var randomIndex = Math.ceil(Math.random() * 10000) % arr.length
        return arr[randomIndex]
    }

    //测试寻路效果
    this.testClick = (gird)=>{
        if(this.instance != null){
            var needFresh = false
            // console.log('editGirdType', this.instance.editGirdType)
            if(this.instance.editGirdType != null){
                gird.girdType = this.instance.editGirdType
                if(this.config.otherConfig.mapGirds.default.length != 0){
                    this.config.otherConfig.mapGirds.default[gird.x][gird.y] = gird.girdType
                }
                needFresh = true
            }

            //当前是在编辑模式下
            if(this.pathFindStartGird == null){
                this.pathFindStartGird = gird
            }else if(this.pathFindEndGird == null){
                this.pathFindEndGird = gird
            }
            if(this.pathFindStartGird != null && this.pathFindEndGird != null){
                var findMap = this.buildFindMap([1,2,3,4])
                // console.log('findMap', findMap)
                var girds = new PF.Grid(findMap)
                var finder = new PF.AStarFinder();
                var path = finder.findPath(this.pathFindStartGird.x, this.pathFindStartGird.y, this.pathFindEndGird.x,  this.pathFindEndGird.y, girds);
               
                this.pathFindEndGird = null
                this.pathFindStartGird = null

                if(path.length > 0){
                    // var newPath = PF.Util.smoothenPath(girds, path); //只留下最关键的几个拐点
                    var newPath = path
                    // console.log('寻路路径path',path, newPath)
                    this.pathPointArr = newPath
                    needFresh = true
                }
            }
            if(needFresh){
                this.freshOtherConfig(this.config.otherConfig)
                this.pathPointArr = null
            }
        }
    }

    //拖拽出来
    this.dragOutByIndex = (x, y)=>{
        if(this.goodMapMap[x][y] == null){
            cc.log('物体本来就不在布局中')
            return
        }
        var codeNode = this.goodMapMap[x][y].codeNode
        this.goodMapMap[x][y].codeNode = null
    }
    
    //放置
    this.inputCodeNode = (codeNode)=>{
        if(this.curDoCtrl == MapCtrlType.MOVE){
            codeNode.destroyNode()
            this.codeProgress.showTips('当前有移动中的物品')
            return
        }

        if(codeNode.parent == this.codeNode.node){
            //已经放到容器中了
            cc.log('已经放到容器中了')
            return
        }

        var arr = codeNode.name.split('_')
        if(arr[arr.length - 1] != null){
            var girdConfig = arr[arr.length - 1].split('x')
            if(girdConfig[0] > 0){
                codeNode.widthGird = Number(girdConfig[0])
            }
            if(girdConfig[1] > 0){
                codeNode.heightGird = Number(girdConfig[1])
            }
        }
        if(this.curSelectCodeNode != null){
            this.outputHandle('robot2', {codeNode: this.curSelectCodeNode})
        }
        this.curSelectCodeNode = codeNode
        this.outputHandle('robot1', {codeNode: this.curSelectCodeNode})
        this.curSelectCodeNode.parent = this.codeNode.node

        this.curSelectCodeNode.x = this.codeNode.node.width * 0.5
        this.curSelectCodeNode.y = 0
        //放置到地图上一定是有位置的
        this.initTouchTag(codeNode.widthGird, codeNode.heightGird) 
        this.curDoCtrl = MapCtrlType.MOVE
        this.curSelectCodeNode.opacity = 175
        this.touchTag.x = this.codeNode.node.width * 0.5
        this.touchTag.y = 0
        this.tagSpriteNode.active = 1
        this.tagSpriteNodeBack.active = 1
        // this.tagSpriteNode.color = this.errColor
        this.freshTagSprite(this.errColor)
        this.showMenuArrAni(false,false)
        // console.log('this.curDoCtrl，切换到move状态', MapCtrlType.MOVE)
        // this.touchTag.active = true
    }

    //格子坐标，转换为在地图中的真实坐标
    this.inputCodeNodeWithPos = (codeNode, girdX, girdY, flip)=>{
        this.inputCodeNode(codeNode)

        if(flip == -1 && codeNode.widthGird != codeNode.heightGird){
            var a = codeNode.widthGird
            codeNode.widthGird = codeNode.heightGird
            codeNode.heightGird = a
        }
        var widthGird = codeNode.widthGird
        var heightGird = codeNode.heightGird

        var D25pos = this.D2To25D((girdX + widthGird * 0.5) * this.girdWidth, (girdY + heightGird * 0.5) * this.girdHeight)

        // console.log('inputCodeNodeWithPos', widthGird, heightGird, girdX, girdY)

        for(var i = 0; i < widthGird; i++){
            for(var j = 0; j < heightGird; j++){
                var xi = girdX + i
                var yj = girdY + j
                var gird = this.goodMapMap[xi][yj]
                gird.codeNode = this.curSelectCodeNode
            }
        }
        
        this.curSelectCodeNode.girdX = girdX
        this.curSelectCodeNode.girdY = girdY
        this.curSelectCodeNode.opacity = 255

        codeNode.x = D25pos.x
        codeNode.y = D25pos.y

        this.outputHandle('robot2', {codeNode: this.curSelectCodeNode} )
        this.curSelectCodeNode = null
        // this.tagSpriteNode.color = this.okColor
        this.freshTagSprite(this.okColor)
        this.curDoCtrl = MapCtrlType.NONE
        this.tagSpriteNode.active = 0
        this.tagSpriteNodeBack.active = 0
    }

    //优化一下drawCall
    this.freshShowNodes = ()=>{
        //因为暂时是合并了图集的，感觉不是很重要
    }

    //获取一些格子靠中心，选中小动物时，周边一圈的格子都隐藏
    this.getGirdsGoodByCenter = (girdX, girdY, radio)=>{
        var startX = girdX - radio
        var startY = girdY - radio

        var arr = []

        for(var i = startX; i <= girdX + radio; i++){
            for(var j = startY; j <= girdY + radio; j++){
                var gird = this.goodMapMap[i][j]
                if(gird.codeNode != null){
                    arr.push(gird.codeNode)
                }
            }
        }
        return arr
    }

    this.inputHandle = (inputData)=>{
        // console.log('layoutEx收到了 inputHandle', inputData)
        if(this.codeNode == null){
            this.robotStart()
        }
        
        if(inputData.targetSolt == 'number1'){
            if(inputData.data.codeNode != null){
                if(inputData.targetSolt == 'number1'){
                    this.inputCodeNode(inputData.data.codeNode)
                }
            }else{
                console.warn('layoutEx inputData.data.codeNode == null ')
            }
        }else if(inputData.targetSolt == 'number2'){
            var data = this.getMapGoods()
            this.outputHandle('exportData', data)
        }
    }

    //收到某个格子长度发生改变后改变自身的位置
    this.onListenOtherOneGirdChange = (aniType)=>{
       
    }

    // {codeNode: data}
    this.outputHandle = (targetSolt, data)=>{
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            if(this.linkDatas.outputSolt[targetSolt]){
                var onelinkDatas = this.linkDatas.outputSolt[targetSolt]
                for(var i = 0; i < onelinkDatas.length; i++){
                    var onelinkData = onelinkDatas[i]
                    if(data != null){
                        onelinkData.robot.inputHandle({solt:onelinkData.solt, data:data, targetSolt: onelinkData.otherSolt})
                    }
                }
            }
        }, targetSolt, 1)
    }

    this.robotRelease = ()=>{
        if(this.goodMapMap != null){
            for(var i = 0; i < this.goodMapMap.length; i++){
                for(var j = 0; j < this.goodMapMap[i].length; j++){
                    this.goodMapMap[i][j].release()
                }
            }
        }

        this.pathFindEndGird = null
        this.pathFindStartGird = null
        if(this.touchTag != null){
            this.touchTag.destroyNode()
        }
        this.touchTag = null
        this.menuArr = []
        this.goodMapMap = []
        this.curSelectCodeNode = null
        this.curDoCtrl = MapCtrlType.NONE
        
        //由girdMap控制的节点也要在这里面清空
        if(this.codeNode != null && cc.isValid(this.codeNode.node)){
            var codeNodes = this.codeNode.node.getComponentsInChildren('CodeNode')
            for(var i = 0; i < codeNodes.length; i++){
                codeNodes[i].destroyNode()
            }
        }
        
        this.codeNode = null
        CodeRobot.prototype.robotRelease.call(this)
    }

    this.onCardSelect = ()=>{
        this.onClickSetting()
        this.freshOtherConfig(this.config.otherConfig)
    }

    this.robotPreview = ()=>{
        this.onClickSetting()
        this.freshOtherConfig(this.config.otherConfig)
        // console.log('layoutEx预览时是否查找到', this.previewCodeNode)
        this.onCardUnSelect()
    }

    this.onClickSetting = ()=>{
        cc.director.emit('getLineBySolt', {soltid: this.instance.cardexSolt.getChildByName('dot').uuid, dontAutoCreate: true, cb:(line)=>{
            if(line != null){
                var bindRobot
                if(line.endDrop.card == this.instance){
                    bindRobot = line.startDrop.card.robot
                }else{
                    bindRobot = line.endDrop.card.robot
                }
                if(bindRobot.codeNode != null){
                    this.previewCodeNode = bindRobot.getLinkCodeNode()
                }else{
                    if(bindRobot.getLinkCodeNode != null){
                        this.previewCodeNode = bindRobot.getLinkCodeNode()
                    }
                }
            }
        }});
    }

    this.robotPause = ()=>{
        if(this.codeNode == null){
            return
        }
        var codeNodes = this.codeNode.node.getComponentsInChildren('CodeNode')
        for(var i = 0; i < codeNodes.length; i++){
            if(codeNodes[i].spineCom != null){
                codeNodes[i].spineCom.paused = true
            }
            cc.director.getActionManager().pauseTarget(codeNodes[i]);
        }
    }

    this.robotResume = ()=>{
        if(this.codeNode == null){
            return
        }
        var codeNodes = this.codeNode.node.getComponentsInChildren('CodeNode')
        for(var i = 0; i < codeNodes.length; i++){
            if(codeNodes[i].spineCom != null){
                codeNodes[i].spineCom.paused = false
            }
            cc.director.getActionManager().resumeTarget(codeNodes[i]);
        }
    }

    //
    this.freshOtherConfig = (config)=>{
        this.normalize = null
        if(this.previewCodeNode == null){
            this.onClickSetting()
        }
        this.yScale =  config.yScale.default
        this.xRotation =  config.xRotation.default

        if(this.previewCodeNode != null){
            var girdWidth = config.girdWidth.default
            var girdHeight = config.girdHeight.default

            var rowNums = config.rowNums.default
            var columnNums = config.columnNums.default

            // this.previewCodeNode.width = girdWidth * columnNums 
            // this.previewCodeNode.height = girdHeight * rowNums

            var dirX = 1
            var dirY = 1
    
            var ctx = this.previewCodeNode.ctx
            this.previewCodeNode.disableUpdatePreview = true

            // console.log('更新绘制范围', ctx, rowNums, columnNums, girdWidth, girdHeight)

            ctx.clear()
            ctx.lineWidth = 9;
            ctx.strokeColor = cc.Color.RED;
            // ctx.rect(0, 0, girdWidth * columnNums  * dirX, girdHeight * rowNums * dirY)
            
            //这个画的是正方形
            ctx.moveTo(0, 0)
            // ctx.lineTo(0, girdHeight * rowNums)
            // ctx.lineTo(girdWidth * columnNums, girdHeight * rowNums)
            // ctx.lineTo(girdWidth * columnNums, 0)
            // ctx.lineTo(0, 0)

            var point1 = this.D2To25D(0, girdHeight * rowNums)
            var point2 = this.D2To25D(columnNums * girdWidth, girdHeight * rowNums)
            var point3 = this.D2To25D(columnNums * girdWidth, 0)

            // console.log('转换坐标',girdWidth * columnNums, girdHeight * rowNums,  point1)
            ctx.lineTo(point1.x, point1.y)
            ctx.lineTo(point2.x, point2.y)
            ctx.lineTo(point3.x, point3.y)
            ctx.lineTo(0,0)
            ctx.stroke();

            ctx.fillColor = cc.Color.BLUE;
            ctx.circle(0, 0, 20);
            ctx.fill()

            if(rowNums > 1){
                ctx.strokeColor = cc.Color.GREEN
                for(var i = 1; i < rowNums; i++){
                    var startPos = this.D2To25D(0, i * girdHeight * dirY)
                    ctx.moveTo(startPos.x, startPos.y)
                    var endPos = this.D2To25D(columnNums * girdWidth * dirX, i * girdHeight * dirY)
                    ctx.lineTo(endPos.x, endPos.y)
                }
            }

            if(columnNums > 1){
                ctx.strokeColor = cc.Color.GREEN
                for(var j = 1; j < columnNums; j++){
                    var startPos = this.D2To25D(j * girdWidth, 0)
                    ctx.moveTo(startPos.x, startPos.y)
                    var endPos = this.D2To25D(j * girdWidth * dirX, rowNums * girdHeight * dirY)
                    ctx.lineTo(endPos.x, endPos.y)
                }
            }
            
            ctx.stroke()

            if(this.pathPointArr != null){
                ctx.strokeColor = cc.Color.BLUE;
                for(var i = 0; i < this.pathPointArr.length; i++){
                    var pos = this.pathPointArr[i]
                    var realPos = this.D2To25D((pos[0] + 0.5) * girdWidth, (pos[1] + 0.5) * girdHeight)
                    if(i == 0){
                        ctx.moveTo(realPos.x, realPos.y)
                    }else{
                        ctx.lineTo(realPos.x, realPos.y)
                    }
                }
                ctx.stroke()
            }

            var mapGirds = this.config.otherConfig.mapGirds.default
            // console.log('刷新时的 mapGirds', mapGirds)
            if(mapGirds.length > 0){
                var colorConst = [cc.Color.RED, cc.Color.GREEN, cc.Color.BLUE, cc.Color.YELLOW, cc.Color.GRAY, cc.Color.ORANGE]

                for(var i = 0; i < columnNums; i++){
                    for(var j = 0; j < rowNums; j++){
                        var girdType = mapGirds[i][j]
                        var realPos = this.D2To25D((i + 0.5) * girdWidth, (j + 0.5) * girdHeight)

                        ctx.fillColor = colorConst[girdType];

                        ctx.circle(realPos.x, realPos.y, 20);
                        ctx.fill()
                    }
                }
                ctx.stroke()
            }
           

        }
    }

    this.onCardUnSelect = ()=>{
        this.previewCodeNode = null
    }

    this.getLinkCodeNode = ()=>{
        var findCodeNode = null
        for(var key in this.instance.linkData.inputSolt){
            if(findCodeNode != null){
                break
            }
            var dropNode = this.instance.linkData.inputSolt[key]
            cc.director.emit('getLineBySolt', {soltid: dropNode.dot.uuid, dontAutoCreate: true, cb:(line)=>{
                if(line != null){
                    var bindRobot
                    if(line.endDrop.card == this.instance){
                        bindRobot = line.startDrop.card.robot
                    }else{
                        bindRobot = line.endDrop.card.robot
                    }
                    if(bindRobot.getLinkCodeNode != null){
                        findCodeNode = bindRobot.getLinkCodeNode()
                    }
                }
            }})
        }
        return findCodeNode
    }

    //获取当前地图里面的所有物品及其坐标
    this.getMapGoods = ()=>{
        var arr = []
        if(this.codeNode == null){
            return arr
        }
        var children = this.codeNode.node.children
        for(var i = 0; i < children.length; i++){
            var child = children[i].getComponent('CodeNode')
            // if(child.getComponent('InGirdMapAI') != null){
            //     //动态物品不加入表中
            // }else{
                
            // }
            if(this.goodMapMap[child.girdX][child.girdY].codeNode == child){
                arr.push(child)
            }
        }
        arr = arr.map((item)=>{
            var obj = {girdX: item.girdX, girdY: item.girdY, flip: item.scaleX < 0 ? -1 : 1, modal: item.modal, src: item.src}
            if(item.premulAlpha == 1){
                obj.premulAlpha = 1
            }
            if(Math.abs(item.scaleX) != 1){
                obj.scaleX = Math.abs(item.scaleX)
            }
            if(item.scaleY != 1){
                obj.scaleY = item.scaleY
            }
            if(item.spineCom != null){
                obj.ani = item.spineCom.animation
                if(item.spineCom._skeleton != null && item.spineCom._skeleton.skin != null){
                    obj.skin = item.spineCom._skeleton.skin.name
                }
            }
            if(item.getComponent('InGirdMapAI') != null){
                obj.isAi = 1
                obj.id = item.getComponent('InGirdMapAI').id
            }
            return obj
        })
        return arr
    }

    //获取当前地图里面所有格子类型数据
    this.getMapGirds = ()=>{
        var mapGirds = []
        for(var i = 0; i < this.columnNums; i++){
            var row = []
            for(var j = 0; j < this.rowNums; j++){
                row.push(this.goodMapMap[i][j].girdType)
            }
            mapGirds.push(row)
        }
        return mapGirds
    }

    //构建自动寻路需要的地图，地图方向为从左到右x，从上到下y , byTypeArr传入可以走动的格子类型
    this.buildFindMap = (byTypeArr)=>{
        if(byTypeArr == null){

        }
        var findMap = []
        // console.log('this.goodMapMap',  this.goodMapMap)

        for(var j = 0; j < this.rowNums; j++){
            findMap.push([])
            for(var i = 0; i < this.columnNums; i++){
                var gird = this.goodMapMap[i][j]
                var hadBuilding = 0
                //如果有东西的话一定不能走
                if(gird.codeNode != null){
                    hadBuilding = 1
                }else{
                   
                }
                if(byTypeArr != null){
                    if(byTypeArr.indexOf(gird.girdType) == -1){
                        hadBuilding = 1
                    }
                }
                findMap[j].push(hadBuilding)
            }
        }
        return findMap
    }

    //在预览状态下点击了Expor按钮，适用于某些特殊情况的功能
    this.inPreviewExport = ()=>{
        if(this.instance != null){
           var mapGoods = this.getMapGoods()
           this.config.otherConfig.mapGoods.default = mapGoods

           var mapGirds = this.getMapGirds()
           this.config.otherConfig.mapGirds.default = mapGirds

        //    console.log("mapGoods onBeforeExport", mapGoods, mapGirds)

        }
    }

    this.inRunFreshConfig = (key)=>{
        if(key == 'canEdit'){
            if(this.curDoCtrl == MapCtrlType.MOVE && this.curSelectCodeNode != null && this.config.otherConfig.canEdit.default == 0){
                //删除当前操作的codeNode
                this.outputHandle('robot1',  {codeNode: null})
                this.curSelectCodeNode.destroyNode()
            }
            this.showMenuArrAni(false, false)
            this.curDoCtrl = MapCtrlType.NONE
            this.tagSpriteNode.active = 0
            this.tagSpriteNodeBack.active = 0
            this.curSelectCodeNode = null
            
            //进入编辑状态，需要显示格子
            if(this.config.otherConfig.canEdit.default == 0){
                //关闭格子
                this.codeNode.node.removeComponent(cc.Graphics)
            }else{
                //显示格子
                // console.log('开启格子', this.codeNode)
                var ctx = this.codeNode.getComponent(cc.Graphics)
                if(ctx == null){
                    ctx = this.codeNode.addComponent(cc.Graphics)
                }

                ctx.lineJoin = cc.Graphics.LineJoin.ROUND;
                ctx.lineCap = cc.Graphics.LineCap.ROUND;

                var config = this.config.otherConfig
                var girdWidth = config.girdWidth.default
                var girdHeight = config.girdHeight.default
    
                var rowNums = config.rowNums.default
                var columnNums = config.columnNums.default
    
                var dirX = 1
                var dirY = 1
        
    
                // console.log('更新绘制范围', ctx, rowNums, columnNums, girdWidth, girdHeight)
    
                ctx.clear()
                ctx.lineWidth = 12;
                ctx.strokeColor = cc.Color.WHITE.fromHEX('A3A3A34D');
                // ctx.rect(0, 0, girdWidth * columnNums  * dirX, girdHeight * rowNums * dirY)
                
                //这个画的是正方形
                ctx.moveTo(0, 0)
                // ctx.lineTo(0, girdHeight * rowNums)
                // ctx.lineTo(girdWidth * columnNums, girdHeight * rowNums)
                // ctx.lineTo(girdWidth * columnNums, 0)
                // ctx.lineTo(0, 0)
    
                var point1 = this.D2To25D(0, girdHeight * rowNums)
                var point2 = this.D2To25D(columnNums * girdWidth, girdHeight * rowNums)
                var point3 = this.D2To25D(columnNums * girdWidth, 0)
    
                // console.log('转换坐标',girdWidth * columnNums, girdHeight * rowNums,  point1)
                ctx.lineTo(point1.x, point1.y)
                ctx.lineTo(point2.x, point2.y)
                ctx.lineTo(point3.x, point3.y)
                ctx.lineTo(0,0)
                ctx.stroke();
    
                // ctx.fillColor = cc.Color.BLUE;
                // ctx.circle(0, 0, 20);
                // ctx.fill()
    
                if(rowNums > 1){
                    ctx.strokeColor = cc.Color.WHITE.fromHEX('A3A3A34D');
                    for(var i = 1; i < rowNums; i++){
                        var startPos = this.D2To25D(0, i * girdHeight * dirY)
                        ctx.moveTo(startPos.x, startPos.y)
                        var endPos = this.D2To25D(columnNums * girdWidth * dirX, i * girdHeight * dirY)
                        ctx.lineTo(endPos.x, endPos.y)
                    }
                }
    
                if(columnNums > 1){
                    ctx.strokeColor = cc.Color.WHITE.fromHEX('A3A3A34D');
                    for(var j = 1; j < columnNums; j++){
                        var startPos = this.D2To25D(j * girdWidth, 0)
                        ctx.moveTo(startPos.x, startPos.y)
                        var endPos = this.D2To25D(j * girdWidth * dirX, rowNums * girdHeight * dirY)
                        ctx.lineTo(endPos.x, endPos.y)
                    }
                }
                
                ctx.stroke()
            }
        }
    }
}
girdMapRobot.prototype = new CodeRobot()

//滚动格子Robot
function scrollRectRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)

    this.robotInit = ()=>{
        //初始化
        this.linkCodeNodes = []
        return true
    }

    this.robotStart = ()=>{
        if(this.codeNode == null){
            var bindRobot = this.linkDatas.cardexSolt[0]
            if(bindRobot != null){
                bindRobot = bindRobot.robot
                if(bindRobot.codeNode != null){
                    this.codeNode = bindRobot.codeNode
                    
                    var mask = this.codeNode.getComponent(cc.Mask)
                    if(this.config.otherConfig.mask.default == 0){
                        if(mask == null){
                            mask = this.codeNode.addComponent(cc.Mask)
                        }
                    }else{
                        if(mask != null && cc.isValid(mask) == true){
                            mask.destroy()
                        }
                    }
                   
                    var scrollComp = this.codeNode.getComponent(cc.ScrollView)
                    if(scrollComp == null){
                        scrollComp = this.codeNode.addComponent(cc.ScrollView)
                    }
                    scrollComp.horizontal = this.config.otherConfig.xScroll.default == 0
                    scrollComp.vertical = this.config.otherConfig.yScroll.default == 0
                    this.codeNode.width = this.config.otherConfig.width.default
                    this.codeNode.height = this.config.otherConfig.height.default
                    // this.codeNode.anchorX = 0
                    scrollComp.inertia = this.config.otherConfig.inertia.default == 0
                    scrollComp.elastic = this.config.otherConfig.elastic.default == 0
                    scrollComp.cancelInnerEvents = this.config.otherConfig.cancelInnerEvents.default == 0

                    var bindChildRobot = this.linkDatas.cardacSolt
                    for(var i = 0; i < bindChildRobot.length; i++){
                        var robot = bindChildRobot[i].robot
                        if(robot.codeNode != null){
                            // console.log('把节点设置为了content', robot.codeNode)
                            robot.codeNode.parent = bindRobot.codeNode.node
                            scrollComp.content = robot.codeNode.node
                            
                            if(scrollComp.vertical == false){
                                robot.codeNode.y = 0
                            }
                            if(scrollComp.horizontal == false){
                                robot.codeNode.x = 0
                            }

                            this.linkCodeNodes.push(robot.codeNode)
                            break
                        }
                    }
                }
            }
        }
    }

    this.inputHandle = (inputData)=>{
        //手动触发
    }

    this.outputHandle = ()=>{
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            //输出内容
            // if(this.linkDatas.outputSolt['number']){
            //     var onelinkDatas = this.linkDatas.outputSolt['number']
            //     for(var i = 0; i < onelinkDatas.length; i++){
            //         var onelinkData = onelinkDatas[i]
            //         onelinkData.robot.inputHandle({solt:onelinkData.solt, data: this.value, targetSolt: onelinkData.otherSolt})
            //     }
            // }
        }, null, this.value)
    }

    this.onCardSelect = ()=>{
        this.onClickSetting()
        this.freshOtherConfig(this.config.otherConfig)
    }
    
    this.robotPreview = ()=>{
        
        this.onClickSetting()
        this.freshOtherConfig(this.config.otherConfig)
        // console.log('layoutEx预览时是否查找到', this.previewCodeNode)
        this.onCardUnSelect()
    }

    this.onClickSetting = ()=>{
        cc.director.emit('getLineBySolt', {soltid: this.instance.cardexSolt.getChildByName('dot').uuid, dontAutoCreate: true, cb:(line)=>{
            if(line != null){
                var bindRobot
                if(line.endDrop.card == this.instance){
                    bindRobot = line.startDrop.card.robot
                }else{
                    bindRobot = line.endDrop.card.robot
                }
                if(bindRobot.codeNode != null){
                    this.previewCodeNode = bindRobot.getLinkCodeNode()
                }else{
                    if(bindRobot.getLinkCodeNode != null){
                        this.previewCodeNode = bindRobot.getLinkCodeNode()
                    }
                }
            }
        }});
    }

    //
    this.freshOtherConfig = (config)=>{
     
        if(this.previewCodeNode == null){
            this.onClickSetting()
        }
        if(this.previewCodeNode != null){
            this.previewCodeNode.width = config.width.default
            this.previewCodeNode.height = config.height.default
            this.previewCodeNode.updatePreview()
        }
    }

    this.onCardUnSelect = ()=>{
        this.previewCodeNode = null
    }

    this.getLinkCodeNode = ()=>{
        var findCodeNode = null
        for(var key in this.instance.linkData.inputSolt){
            if(findCodeNode != null){
                break
            }
            var dropNode = this.instance.linkData.inputSolt[key]
            cc.director.emit('getLineBySolt', {soltid: dropNode.dot.uuid, dontAutoCreate: true, cb:(line)=>{
                if(line != null){
                    var bindRobot
                    if(line.endDrop.card == this.instance){
                        bindRobot = line.startDrop.card.robot
                    }else{
                        bindRobot = line.endDrop.card.robot
                    }
                    if(bindRobot.getLinkCodeNode != null){
                        findCodeNode = bindRobot.getLinkCodeNode()
                    }
                }
             }})
        }
        return findCodeNode
    }

    this.robotRelease = ()=>{
        // return
        if(this.instance != null){
            var spaceCard = this.codeProgress.onGetSingleCard('space')
            if(spaceCard == null){
                cc.warn("没有添加space卡片")
                this.codeProgress.showTips('没有添加space卡片')
                return
            }
            var whiteNode = spaceCard.getChildByName('whiteNode')
            if(whiteNode == null){
                cc.warn("没有添加space/whiteNode")
                return
            }
    
            for(var i = 0; i < this.linkCodeNodes.length; i++){
                var linkNode = this.linkCodeNodes[i]
                if(cc.isValid(linkNode.node) == true){
                    linkNode.parent = whiteNode
                }
            }
        }else{
            this.linkCodeNodes = []
        }
        this.codeNode = null
        CodeRobot.prototype.robotRelease.call(this)
    }
}
scrollRectRobot.prototype = new CodeRobot()


function createObjectRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)

    this.robotPreview = ()=>{
        if(this.codeNode != null){
            this.codeNode.destroyNode()
            this.codeNode = null
            this.spineCom = null
            // this.freshOtherConfig(this.config.otherConfig)
        }else{
            
        }
        // this.createObj()
        this.createObj((codeNode)=>{
            this.codeNode = codeNode
            this.spineCom = this.codeNode.getComponent(sp.Skeleton)
        })
    }

    this.robotInit = (cb)=>{
        this.hasinit = true
        if(this.config.otherConfig.showTime.default == 0){
            if(this.codeNode != null){
                // console.log('创建时没了 this.codeNode11111', this.codeNode)
                this.codeNode.codeProgress = this.codeProgress
                // this.codeNode.destroyNode()
                // this.codeNode = null
                // this.spineCom = null
                
                this.codeNode.targetOff()
                // if(this.config.key == 'createObject'){
                //     cc.log('55555打印是否有动画', this.codeNode.spineCom)
                // }
                this.freshOtherConfig(this.config.otherConfig)
                // if(this.config.key == 'createObject'){
                //     cc.log('66666打印是否有动画', this.codeNode.spineCom)
                // }
                this.bindRobotListener()
                cc.log('节点还存在就不更创建新的了，直接使用')
    
                var spaceCard = this.codeProgress.onGetSingleCard('space')
                if(spaceCard == null){
                    cc.warn("没有添加space卡片")
                    this.codeProgress.showTips('没有添加space卡片')
                    return true
                }
                var whiteNode = spaceCard.getChildByName('whiteNode')
                if(whiteNode == null){
                    cc.warn("没有添加space/whiteNode")
                    return true
                }
                // console.log('创建时没了 this.codeNode', this.codeNode)
                if(this.codeNode != null){
                    this.codeNode.parent = whiteNode
                }
                
                return true
            }

            this.codeNode = this.createObj(cb)
            this.spineCom = this.codeNode.getComponent(sp.Skeleton)
            this.bindRobotListener()
        }else{
            this.robotRelease(false, false)
            return true
        }
    }

    this.bindRobotListener = ()=>{
        for(var i = 0; i < this.linkDatas.cardacSolt.length; i++){
            var soltData = this.linkDatas.cardacSolt[i]
            if(soltData.robot.onBindCodeNode != null){
                soltData.robot.onBindCodeNode(this.codeNode)
            }
        }
    }

    this.createObj = (callback)=>{
        var node = new cc.Node()
        var spaceCard = this.codeProgress.onGetSingleCard('space')
        if(spaceCard == null){
            console.warn("没有添加space卡片")
            this.codeProgress.showTips('没有添加space卡片')
            return
        }
        var whiteNode = spaceCard.getChildByName('whiteNode')
        if(whiteNode == null){
            console.warn("没有添加space/whiteNode")
            return
        }
        node.parent = whiteNode//this.instance.node.parent
        var codeNode = node.addComponent('CodeNode')
        codeNode.codeProgress = this.codeProgress
        //可以提前加上
        
        // var movex = node.addComponent('MoveObj')
        // movex.isMoveX = true

        // var movey = node.addComponent('MoveObj')
        // movey.isMoveX = false
        // node.addComponent(cc.BlockInputEvents)
       

        var cb = ()=>{
            if(this.instance != null && this.config.otherConfig.modal.default == 0){
                codeNode.ctx = codeNode.addComponent(cc.Graphics)
                codeNode.width = 50
                codeNode.height = 50
            }

            
            // console.log('this.config.otherConfig.color.default',  this.config.otherConfig)

            var colliderValue = this.config.otherConfig.colliderValue.default
            if(colliderValue.pointArr != null){
                if(codeNode.getComponent('SpinePlusComponent') == null){
                    var colliderArr = []
                    var comp = codeNode.addComponent('SpinePlusComponent')
                    comp.customCollider = true
                    for(var z = 0; z < colliderValue.pointArr.length; z++){
                        var collider = codeNode.addComponent(cc.PolygonCollider)
                        colliderArr.push(collider)
                        var points = colliderValue.pointArr[z]
                        for(var i = 0; i < points.length; i++){
                            var v2 = collider.points[i];
                            if (!v2) collider.points.push(cc.v2());
                            collider.points[i].x = ((points[i].x - 0.5) * colliderValue.baseWidth - colliderValue.offsetX) / colliderValue.scale 
                            collider.points[i].y = ((points[i].y - 0.5) * colliderValue.baseWidth - colliderValue.offsetY) / colliderValue.scale 
                        }
                    }
                    comp.polygonColliderArr = colliderArr
                    // cc.log("colliderArr", colliderArr, colliderValue)
                }
            }
            

            if(this.instance != null ){
                if(this.config.otherConfig.modal.default == 0){
                    this.instance.icon.node.getComponent(cc.Sprite).enabled = true
                }else if(this.config.otherConfig.modal.default == 4){
                    this.instance.icon.node.getComponent(cc.Sprite).enabled = true
                    this.instance.icon.setImgConfig({bundle: 'viewCode', url: 'image/textIcon'})

                }else{
                    this.instance.icon.node.getComponent(cc.Sprite).enabled = false
                    if(this.instance.icon.node.children[0] != null){
                        this.instance.icon.node.children[0].destroy()
                    }
                    var showNode = cc.instantiate(node)
                    showNode.isClone = true
                    showNode.parent = this.instance.icon.node
                    // var arr = showNode.getComponents('MoveObj')
                    showNode.x = 0
                    showNode.y = 0
                    showNode.opacity = 255
                    var polygonColliderArr = showNode.getComponents(cc.PolygonCollider)
                    for(var i = 0; i < polygonColliderArr.length; i++){
                        polygonColliderArr[i].destroy()
                    }
                    showNode.removeComponent('SpinePlusComponent')
    
                    // showNode.removeComponent(arr[0])
                    // showNode.removeComponent(arr[1])
                    // showNode.removeComponent(cc.BlockInputEvents)
                    if(showNode.width != 0){
                        showNode.scale = 70 / showNode.width 
                    }else{
                        showNode.scale = 0.2
                    }
                }
            }

            if(callback != null){
                callback(codeNode)
            }
        }
        var customName = this.config.otherConfig.customeName.default.split('/')
        node.name = customName[customName.length - 1]

        if(this.instance == null){
            //只有在运行时才需要修改，编辑时不要修改
            if(this.config.otherConfig.group.default == 1){
                node.group = 'storyui'
            }else{
                node.group = 'default'
            }
        }
       

        if(this.config.otherConfig.showTime.default == 1){
            console.log('创建时的customName', customName)
        }

        if(this.config.otherConfig.modal.default == 4){
            // 如果是4是文本
            // if(this.instance != null){
            // }
            var label = node.addComponent(cc.Label)
            
            cc.resources.load('app/font/wowfont', cc.Font, (err, asset) => {
                if (err) {
                    cc.error(`wowfont[加载] 错误 ${err}`);
                    cb()
                } else {
                    if(cc.isValid(node) == true){
                        label.font = asset
                    }
                    cb()
                }
            });

        }else if(this.config.otherConfig.modal.default == 0){
            // if(this.instance != null){
                
            cb()
            // }
        }else if(this.config.otherConfig.modal.default == 3){
            //如果是3是spine
            var spineCom = node.addComponent(sp.Skeleton)
            if(this.config.otherConfig.premulAlpha.default == 0){
                spineCom.premultipliedAlpha = false
            }
            // console.log('开始加载spine', this.config.otherConfig.customeName.default)
            this.codeProgress.codeRobotConfig.loadResHandle(this.config.otherConfig.customeName.default, sp.SkeletonData, (res)=>{
                // cc.log('加载成功skeletonData', res)
                if(res != null){
                    if(res.skeletonJson != null){
                        spineCom.skeletonData = res
                    }else{
                        cc.warn('skeletonData加载成功了但是没有skeletonJson')
                    }
                }else{
                    cc.warn('skeletonData加载失败了')
                }
                cb()
                // node.addComponent('SpinePlusComponent')
            })
        }else if(this.config.otherConfig.modal.default == 2){
            node.addComponent(cc.Sprite)
            cb()
        }else if(this.config.otherConfig.modal.default == 1){
            //如果是1 是图片
            var sprite = node.addComponent(cc.Sprite)
            if(this.config.otherConfig.premulAlpha.default == 1){
                sprite.srcBlendFactor = cc.macro.BlendFactor.ONE;
            }
            this.codeProgress.codeRobotConfig.loadResHandle(this.config.otherConfig.customeName.default, cc.SpriteFrame, (res)=>{
                // console.log('加载成功sf', res.getTexture().hasPremultipliedAlpha())
                sprite.spriteFrame = res
                if(res != null && res.getTexture() != null){
                    if(res.getTexture().hasPremultipliedAlpha()){
                        sprite.srcBlendFactor = cc.macro.BlendFactor.ONE;
                    }
                }
                cb()
            })
        }else{
            cb()
        }

        codeNode.init()
        codeNode.modal = this.config.otherConfig.modal.default
        codeNode.customeName = this.config.otherConfig.customeName.default
        codeNode.zIndex = this.config.otherConfig.zIndex.default
        codeNode.dynamiczIndex = this.config.otherConfig.dynamiczIndex.default
        codeNode.x = this.config.otherConfig.x.default
        codeNode.y = this.config.otherConfig.y.default
        
        if(this.config.otherConfig.modal.default == 0){
            codeNode.width = this.config.otherConfig.width.default
            codeNode.height = this.config.otherConfig.height.default
        }
        
        codeNode.scaleX = this.config.otherConfig.scaleX.default / 10
        codeNode.scaleY = this.config.otherConfig.scaleY.default / 10
        codeNode.opacity = this.config.otherConfig.opacity.default
        codeNode.angle = this.config.otherConfig.angle.default
        codeNode.center = [codeNode.realX, codeNode.realY]
        codeNode.anchorX = this.config.otherConfig.anchorX.default / 10
        codeNode.anchorY = this.config.otherConfig.anchorY.default / 10
        codeNode.string = this.config.otherConfig.string.default
        codeNode.color = this.config.otherConfig.color.default
        codeNode.outLineWidth = this.config.otherConfig.outLineWidth.default
        codeNode.outLineColor = this.config.otherConfig.outLineColor.default

        return codeNode
    }

    this.inputHandle = (inputData)=>{
        if(inputData.targetSolt == 'number1'){
            if(this.config.otherConfig.showTime.default == 1){
                var codeNode = this.createObj((codeNode)=>{
                    this.outputHandle(1, codeNode)
                })
                // this.bindRobotListener()
            }
        }else if(inputData.targetSolt == 'number2'){
            //触发执行
            if(inputData.data != 0){
                this.outputHandle(inputData.data)
            }
        }
    }

    this.outputHandle = (data, codeNode)=>{
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            if(this.linkDatas.outputSolt['robot1']){
                var onelinkDatas = this.linkDatas.outputSolt['robot1']
                for(var i = 0; i < onelinkDatas.length; i++){
                    var onelinkData = onelinkDatas[i]
                    onelinkData.robot.inputHandle({solt:onelinkData.solt, data: codeNode == null ? this : {codeNode: codeNode}, targetSolt: onelinkData.otherSolt})
                }
            }
            if(this.linkDatas.outputSolt['number2']){
                var onelinkDatas = this.linkDatas.outputSolt['number2']
                for(var i = 0; i < onelinkDatas.length; i++){
                    var onelinkData = onelinkDatas[i]
                    onelinkData.robot.inputHandle({solt:onelinkData.solt, data:data, targetSolt: onelinkData.otherSolt})
                }
            }
            //如果是动态创建的话，输出创建的物体之后不保留引用物体
            if(this.config.otherConfig.showTime.default == 1){
                this.codeNode = null
                this.spineCom = null
            }
        }, null, data)
    }
    
    this.changeTimeScale = ()=>{
        if(this.spineCom != null){
            this.spineCom.timeScale = this.codeProgress.codeRobotConfig.timeScale
        }
    }

    this.robotPause = ()=>{
        if(this.spineCom != null){
            this.spineCom.paused = true
        }
        // if(this.codeNode != null){
        //     this.codeNode.node.pauseAllActions();
        // }
        if(this.codeNode != null){
            cc.director.getActionManager().pauseTarget(this.codeNode);
        }
    }

    this.robotResume = ()=>{
        if(this.spineCom != null){
            this.spineCom.paused = false
        }
        // if(this.codeNode != null){
        //     this.codeNode.node.resumeAllActions();
        // }
        if(this.codeNode != null){
            cc.director.getActionManager().resumeTarget(this.codeNode);
        }
    }

    this.freshOtherConfig = (config)=>{
        if(this.instance != null){
            this.instance.resultLabel.string = config.modal.chooses[config.modal.default] + ':' + config.customeName.default
            if(this.customeName != config.customeName.default || this.modal != config.modal.default){
                this.customeName = config.customeName.default
                this.modal = config.modal.default
                this.robotPreview()
                return
            }
        }
        
        if(this.codeNode != null){
            this.codeNode.zIndex = this.config.otherConfig.zIndex.default
            this.codeNode.dynamiczIndex = this.config.otherConfig.dynamiczIndex.default
            this.codeNode.x = this.config.otherConfig.x.default
            this.codeNode.y = this.config.otherConfig.y.default

            this.codeNode.scaleX = this.config.otherConfig.scaleX.default / 10
            this.codeNode.scaleY = this.config.otherConfig.scaleY.default / 10

            this.codeNode.opacity = this.config.otherConfig.opacity.default
            this.codeNode.angle = this.config.otherConfig.angle.default

            this.codeNode.anchorX = this.config.otherConfig.anchorX.default / 10
            this.codeNode.anchorY = this.config.otherConfig.anchorY.default / 10

            if(this.config.otherConfig.modal.default == 0){
                this.codeNode.width = this.config.otherConfig.width.default
                this.codeNode.height = this.config.otherConfig.height.default
            }

            this.codeNode.string = this.config.otherConfig.string.default
            this.codeNode.color = this.config.otherConfig.color.default

            this.codeNode.outLineWidth = this.config.otherConfig.outLineWidth.default
            this.codeNode.outLineColor = this.config.otherConfig.outLineColor.default


            if(this.codeNode.spineCom != null){
                if(this.codeNode.spineCom.premultipliedAlpha != this.config.otherConfig.premulAlpha.default){
                    this.robotPreview()
                }
            }
        }
       
    }

    //运行时刷新配置
    this.inRunFreshConfig = (key)=>{
        // console.log('inRunFreshConfig', this.hasinit, key, this.config.otherConfig[key], this.codeNode)
        if(this.hasinit != true){
            if(this.codeNode != null){
                this.codeNode.destroyNode()
                this.codeNode = null
            }
        }
        if(this.codeNode != null){
            if(key == 'modal'){
                //已经创建的物品不支持修改物体类型
                return
            }
            if(key == 'scaleX'){
                this.codeNode.scaleX = this.config.otherConfig.scaleX.default / 10
            }else if(key == 'scaleY'){
                this.codeNode[key] = this.config.otherConfig.scaleY.default / 10
            }else if(key == 'anchorX'){
                this.codeNode[key] = this.config.otherConfig.anchorX.default / 10
            }else if(key == 'anchorY'){
                this.codeNode[key] = this.config.otherConfig.anchorY.default / 10
            }else if(this.codeNode[key] != null){
                this.codeNode[key] = this.config.otherConfig[key].default
            }
            if(key == 'premulAlpha'){
                if(this.spineCom != null){
                    this.spineCom.premultipliedAlpha = this.config.otherConfig.premulAlpha.default != 0
                }
            }
        }else{
            //未创建的物品不需要更新key
        }
    }

    this.getLinkCodeNode = ()=>{
        return this.codeNode
    }

    this.robotRelease = (withPreview, dontDestroy)=>{
        this.hasinit = false
        if(this.codeNode != null){
            cc.Tween.stopAllByTarget(this.codeNode);
            this.codeNode.targetOff()

            // this.codeNode.node.off(cc.Node.EventType.TOUCH_START)
            // this.codeNode.node.off(cc.Node.EventType.TOUCH_MOVE)
            // this.codeNode.node.off(cc.Node.EventType.TOUCH_END)

            this.codeNode.robotListener = {}
            if(this.spineCom != null){
                this.spineCom.setEventListener(null)
                this.spineCom.setCompleteListener(null)
                this.spineCom.clearTrack(0)
                this.spineCom.setToSetupPose()
            }
            // this.codeNode.targetOff(this);
            if(dontDestroy != true){
                this.codeNode.destroyNode()
                this.codeNode = null
                this.spineCom = null
            }
        }
        if(withPreview == true){
            this.robotPreview()
        }
        CodeRobot.prototype.robotRelease.call(this)
    }
}
createObjectRobot.prototype = new CodeRobot()

function positionRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)
    this.robotInit = (cb)=>{
        return true
    }

    this.onBindCodeNode = (codeNode)=>{
        // console.log("positionRobot 收到了onBindCodeNode", codeNode)s
        if(this.codeNode != null){
            //如果有绑定旧的codeNode，先删除旧的codeNode绑定的id
            this.codeNode.removeRobotListener('x',this.id)
            this.codeNode.removeRobotListener('y',this.id)
        }
        this.codeNode = codeNode
        this.codeNode.addRobotListener('x',this.id,(value)=>{
            this.outputHandle('x', value)
            if(this.config.otherConfig.consoleInfo.default == 1){
                cc.log('我监听的物体x发生变化：', value)
            }
        })
        this.codeNode.addRobotListener('y',this.id,(value)=>{
            this.outputHandle('y', value)
            if(this.config.otherConfig.consoleInfo.default == 1){
                cc.log('我监听的物体y发生变化：', value)
            }
        })
    }

    this.robotRelease = ()=>{
        // console.log("positionRobot robotRelease")
        this.codeNode = null
        CodeRobot.prototype.robotRelease.call(this)
    }

    this.inputHandle = (inputData)=>{
        if(this.codeNode != null){
            if(inputData.targetSolt == 'number1'){
                if(this.config.otherConfig.rangeWithSize.default == 1){
                    this.inputHandle({targetSolt: 'x', data : 0})
                    this.inputHandle({targetSolt: 'y', data : 0})
                }else{
                    this.outputHandle('x',this.codeNode.realX)
                    this.outputHandle('y',this.codeNode.realY)
                }
            }else if(inputData.targetSolt == 'x'){
                var value = inputData.data
                var xRange = this.config.otherConfig.xRange.default
                if(this.config.otherConfig.rangeWithSize.default == 1){
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
                if(this.config.otherConfig.modal.default == 1){
                    if(this.codeNode.realX + value >= xRange[1]){
                        value = xRange[1] - this.codeNode.realX 
                    }else if(this.codeNode.realX + value <= xRange[0]){
                        value = xRange[0] - this.codeNode.realX
                    }
                    this.codeNode.realX = this.codeNode.realX + value
                }else{
                    if(value > xRange[1]){
                        value = xRange[1]
                    }
                    if(value < xRange[0]){
                        value = xRange[0]
                    }
                    this.codeNode.realX = value
                }
               
            }else if(inputData.targetSolt == 'y'){
                var value = inputData.data
                // console.log('我收到了改变value', value)
                var yRange = this.config.otherConfig.yRange.default
                if(this.config.otherConfig.rangeWithSize.default == 1){
                    var addHeight = this.codeNode.anchorY * this.codeNode.height * Math.abs(this.codeNode.scaleY)
                    yRange = [yRange[0] + addHeight, yRange[1] - addHeight]
                    if(yRange[1] < yRange[0]){
                        yRange[1] = yRange[1] + yRange[0]
                        yRange[0] = yRange[1] - yRange[0]
                        yRange[1] = yRange[1] - yRange[0]
                    }
                }
                if(this.config.otherConfig.modal.default == 1){
                    if(this.codeNode.realY + value >= yRange[1]){
                        value = yRange[1] - this.codeNode.realY 
                    }else if(this.codeNode.realY + value <= yRange[0]){
                        value = yRange[0] - this.codeNode.realY
                    }
                    this.codeNode.realY = this.codeNode.realY + value
                }else{
                    if(value > yRange[1]){
                        value = yRange[1]
                    }
                    if(value < yRange[0]){
                        value = yRange[0]
                    }
                    this.codeNode.realY = value
                }
            }
        }else{
            // cc.warn('positionRobot未绑定实体')
        }
    }

    this.outputHandle = (targetSolt, value)=>{
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            if(this.linkDatas.outputSolt[targetSolt]){
                var onelinkDatas = this.linkDatas.outputSolt[targetSolt]
                for(var i = 0; i < onelinkDatas.length; i++){
                    var onelinkData = onelinkDatas[i]
                    onelinkData.robot.inputHandle({solt:onelinkData.solt, data:value, targetSolt: onelinkData.otherSolt})
                }
            }
        }, targetSolt,value)
    }
}
positionRobot.prototype = new CodeRobot()


function contactRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)
    this.robotInit = (cb)=>{
        this.curContactNum = 0
        this.bindTrackCodeNode = []
        return true
    }

    this.robotStart = ()=>{
        this.bindTrackCodeNode = []
        var bindChildRobot = this.linkDatas.cardacSolt
        for(var i = 0; i < bindChildRobot.length; i++){
            var robot = bindChildRobot[i].robot
            if(robot.codeNode != null){
                this.bindTrackCodeNode.push(robot.codeNode)
            }
        }
    }

    this.onBindCodeNode = (codeNode)=>{
        if(this.codeNode != null){
            //如果有绑定旧的codeNode，先删除旧的codeNode绑定的id
            this.codeNode.removeRobotListener('contact',this.id)
            this.codeNode.removeRobotListener('uncontact',this.id)
        }
        this.curContactNum = 0
        this.codeNode = codeNode
        this.codeNode.addRobotListener('contact',this.id,(value)=>{
            if(this.bindTrackCodeNode.indexOf(value) != -1){
                this.curContactNum += 1
                if(this.config.otherConfig.modal.default == 0){
                    this.outputHandle('number1', this.curContactNum)
                    //会传送最后一个接触的对象
                    this.outputHandle('robot1', value)
                }
            }
        })
        this.codeNode.addRobotListener('uncontact',this.id,(value)=>{
            if(this.bindTrackCodeNode.indexOf(value) != -1){
                this.curContactNum -= 1
                if(this.curContactNum < 0){
                    this.curContactNum = 0
                }
                if(this.curContactNum == 0){
                    if(this.config.otherConfig.modal.default == 0){
                        this.outputHandle('number1', this.curContactNum)
                        this.outputHandle('robot1', null)
                    }
                }
            }
        })
    }

    this.inputHandle = (inputData)=>{
        if(this.codeNode != null){
            if(inputData.targetSolt == 'number1'){
                this.outputHandle('number1', this.curContactNum)
            }
        }else{
            cc.warn('contactRobot未绑定实体')
        }
    }

    this.outputHandle = (targetSolt, value)=>{
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            if(this.linkDatas.outputSolt[targetSolt]){
                var onelinkDatas = this.linkDatas.outputSolt[targetSolt]
                for(var i = 0; i < onelinkDatas.length; i++){
                    var onelinkData = onelinkDatas[i]
                    onelinkData.robot.inputHandle({solt:onelinkData.solt, data:value, targetSolt: onelinkData.otherSolt})
                }
            }
        }, targetSolt, value)
    }

    this.robotRelease = ()=>{
        this.codeNode = null
        CodeRobot.prototype.robotRelease.call(this)
    }
}
contactRobot.prototype = new CodeRobot()


function angleRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)
    this.robotInit = (cb)=>{
        return true
    }

    this.onBindCodeNode = (codeNode)=>{
        if(this.codeNode != null){
            //如果有绑定旧的codeNode，先删除旧的codeNode绑定的id
            this.codeNode.removeRobotListener('angle',this.id)
        }
        this.codeNode = codeNode
        this.codeNode.addRobotListener('angle',this.id,(value)=>{
            this.outputHandle('angle', value)
            if(this.config.otherConfig.consoleInfo.default == 1){
                // cc.log('我监听的物体angle发生变化：', value)
            }
        })
    }

    this.robotRelease = ()=>{
        this.codeNode = null
        CodeRobot.prototype.robotRelease.call(this)
    }

    this.inputHandle = (inputData)=>{
        if(this.codeNode != null){
            if(inputData.targetSolt == 'number1'){
                this.outputHandle('angle',this.codeNode.angle)
            }else if(inputData.targetSolt == 'angle'){
                var value = inputData.data
                var angleRange = this.config.otherConfig.angleRange.default
                if(this.config.otherConfig.modal.default == 1){
                    if(this.codeNode.angle + value >= angleRange[1]){
                        value = angleRange[1] - this.codeNode.angle 
                    }
                    if(this.codeNode.angle + value <= angleRange[0]){
                        value = angleRange[0] - this.codeNode.angle
                    }
                    this.codeNode.angle = this.codeNode.angle + value
                }else{
                    if(value > angleRange[1]){
                        value = angleRange[1]
                    }
                    if(value < angleRange[0]){
                        value = angleRange[0]
                    }
                    this.codeNode.angle = value
                }
            }
        }else{
            cc.warn('angleRobot未绑定实体')
        }
    }

    this.outputHandle = (targetSolt, value)=>{
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            if(this.linkDatas.outputSolt[targetSolt]){
                var onelinkDatas = this.linkDatas.outputSolt[targetSolt]
                // if(onelinkDatas.length > 0){
                //     cc.log('我输出了位置变化' + targetSolt,value)
                // }
                for(var i = 0; i < onelinkDatas.length; i++){
                    var onelinkData = onelinkDatas[i]
                    onelinkData.robot.inputHandle({solt:onelinkData.solt, data:value, targetSolt: onelinkData.otherSolt})
                }
            }
        }, targetSolt, value)

    }
}
angleRobot.prototype = new CodeRobot()

function speedRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)

    this.robotInit = (cb)=>{
        return true
    }

    this.onBindCodeNode = (codeNode)=>{
        var bindKey = this.config.otherConfig.customKey.choosesKey[this.config.otherConfig.customKey.default]
        if(this.codeNode != null){
            //如果有绑定旧的codeNode，先删除旧的codeNode绑定的id
            this.codeNode.removeRobotListener(bindKey,this.id)
        }
        this.codeNode = codeNode
        this.codeNode.addRobotListener(bindKey,this.id,(value)=>{
            this.outputHandle('number1', value)
            if(this.config.otherConfig.consoleInfo.default == 1){
                cc.log('我监听的物体' + bindKey + '发生变化：', value)
            }
        })
    }

    this.robotRelease = ()=>{
        this.codeNode = null
        CodeRobot.prototype.robotRelease.call(this)
    }

    this.inputHandle = (inputData)=>{
        var bindKey = this.config.otherConfig.customKey.choosesKey[this.config.otherConfig.customKey.default]

        if(this.codeNode != null){
            if(inputData.targetSolt == 'number1'){
                this.outputHandle("number1",this.codeNode[bindKey])
            }else if(inputData.targetSolt == 'number2'){
                var value = inputData.data
                if(bindKey != 'string'){
                    var range = this.config.otherConfig.range.default
                    if(this.config.otherConfig.modal.default == 1){
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
        }else{
            cc.warn('Robot未绑定实体')
        }
    }

    this.outputHandle = (targetSolt, value)=>{
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            if(this.linkDatas.outputSolt[targetSolt]){
                var onelinkDatas = this.linkDatas.outputSolt[targetSolt]
                // if(onelinkDatas.length > 0){
                //     cc.log('我输出了位置变化' + targetSolt,value)
                // }
                for(var i = 0; i < onelinkDatas.length; i++){
                    var onelinkData = onelinkDatas[i]
                    onelinkData.robot.inputHandle({solt:onelinkData.solt, data:value, targetSolt: onelinkData.otherSolt})
                }
            }
        }, targetSolt, value)

    }
}
speedRobot.prototype = new CodeRobot()


function cameraRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)

    this.robotInit = (cb)=>{
        if(this.codeNode != null){
            this.freshOtherConfig(this.config.otherConfig) 
            this.bindRobotListener()
            return true
        }else{
            this.createObj(cb)
            this.bindRobotListener()
        }
    }

    this.createObj = (cb)=>{
        var node = new cc.Node()
        var spaceCard = this.codeProgress.onGetSingleCard('space')
        if(spaceCard == null){
            cc.warn("没有添加space卡片")
            return
        }
        var whiteNode = spaceCard.getChildByName('whiteNode')
        node.parent = whiteNode
        node.name = 'Camera'
        this.codeNode = node.addComponent('CodeNode')
        this.codeNode.codeProgress = this.codeProgress

        if(this.instance == null){
            // setTimeout(() => {
                var camera = node.addComponent(cc.Camera)
                // cc.log('cullingMask',)
                camera.cullingMask = -31 //特殊配置
                camera.clearFlags = 6
                camera.enabled = false
                // camera.depth = -2
                
                
                var node2 = new cc.Node()
                node2.parent = whiteNode
                node2.name = 'New 2D Camera'
                var cameraUi = node2.addComponent(cc.Camera)
                cameraUi.cullingMask = 24
                cameraUi.clearFlags = 6
                cameraUi.depth = 2
                cameraUi.enabled = false
                this.cameraUi = node2

                // setTimeout(() => {
                //     camera.enabled = true
                //     cameraUi.enabled = true
                // }, 2000);

                //需要手动激活camera生效，目前只有在story view里会用到camera，所以暂时不修改，后续应该把camera的激活放在start中，再把codeprogress的init和start从jsontorobot中分离出来，分开调用
            // }, 2000);
            
            this.codeNode.init()
            this.freshOtherConfig(this.config.otherConfig)

        }else{
            
        }
        cb()
    }

    this.bindRobotListener = ()=>{
        for(var i = 0; i < this.linkDatas.cardacSolt.length; i++){
            var soltData = this.linkDatas.cardacSolt[i]
            if(soltData.robot.onBindCodeNode != null){
                soltData.robot.onBindCodeNode(this.codeNode)
            }
        }
    }

    this.robotPause = ()=>{
        if(this.codeNode != null){
            cc.director.getActionManager().pauseTarget(this.codeNode);
        }
    }

    this.robotResume = ()=>{
        if(this.codeNode != null){
            cc.director.getActionManager().resumeTarget(this.codeNode);
        }
    }

    this.freshOtherConfig = (config)=>{
        if(this.instance != null){
            this.instance.node.x = config.x.default
            this.instance.node.y = config.y.default

            var zoomRatio = config.zoomRatio.default / 10
            var spaceCard = this.codeProgress.onGetSingleCard('space')
            if(spaceCard == null){
                cc.warn("没有添加space卡片")
                return
            }
            var whiteNode = spaceCard.getChildByName('whiteNode')
            this.instance.node.width = (whiteNode.width * 0.5) / zoomRatio
            this.instance.node.height = (whiteNode.height * 0.5) / zoomRatio
          
            this.instance.updateWeight()
            cc.director.emit('onMoveCard', this.instance);
        }
        if(this.codeNode != null){
            if(config.offsetx != null){
                this.codeNode.offsetx = config.offsetx.default
            }
            if(config.offsety != null){
                this.codeNode.offsety = config.offsety.default
            }

            this.codeNode.zoomRatio = config.zoomRatio.default / 10
            this.codeNode.x = config.x.default
            this.codeNode.y = config.y.default
        }
    }

    this.robotRelease = (withPreview, dontDestroy)=>{
        if(this.codeNode != null){
            cc.Tween.stopAllByTarget(this.codeNode);
            this.codeNode.targetOff()
            this.codeNode.robotListener = {}
            if(dontDestroy != true){
                this.codeNode.destroyNode()
                this.codeNode = null
                if(this.cameraUi != null && cc.isValid(this.cameraUi) == true){
                    this.cameraUi.destroy()
                }
            }
        }
        CodeRobot.prototype.robotRelease.call(this)
    }
}
cameraRobot.prototype = new CodeRobot()


function spaceRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)
    
    this.robotInit = ()=>{
        if(this.instance != null){
            // this.instance.node.pauseSystemEvents(false)
        }
        var spaceCard = this.codeProgress.onGetSingleCard('space')
        if(spaceCard == null){
            cc.warn("没有添加space卡片")
            this.codeProgress.showTips('没有添加space卡片')
            return
        }
        var whiteNode = spaceCard.getChildByName('whiteNode')
        whiteNode.width = 7680
        whiteNode.height = 4320
        this.codeNode = whiteNode.getComponent('CodeNode')
        if(this.codeNode == null){
            this.codeNode = whiteNode.addComponent('CodeNode')
            this.codeNode.codeProgress = this.codeProgress
        }
        return true
    }

    this.inputHandle = (inputData)=>{
        
    }

    this.outputHandle = (data)=>{
       
    }
    
    this.robotRelease = ()=>{
        if(this.instance != null){
            // this.instance.node.resumeSystemEvents(false)
        }
        CodeRobot.prototype.robotRelease.call(this)
    }
}
spaceRobot.prototype = new CodeRobot()


function blockTouchRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)
    this.robotInit = ()=>{
        var spaceCard = this.codeProgress.onGetSingleCard('space')
        if(spaceCard == null){
            cc.warn("没有添加space卡片")
            this.codeProgress.showTips('没有添加space卡片')
            return
        }
        var blockNode = spaceCard.getChildByName('blockNode')
        if(blockNode == null){
            blockNode = new cc.Node()
            blockNode.parent = spaceCard
            blockNode.width = spaceCard.width
            blockNode.height = spaceCard.height
            blockNode.addComponent(cc.BlockInputEvents)
            blockNode.x = 0
            blockNode.y = 0
            blockNode.active = false
            this.blockNode = blockNode
        }else{
            this.blockNode = blockNode
        }
        // console.log('blockNode',this.blockNode)
        return true
    }

    this.inputHandle = (inputData)=>{
        if(inputData.data == 0){
            //如果为0的话就返回
            return
        }
        if(inputData.targetSolt == 'number1'){
            this.changeBlock(true)
        }else if(inputData.targetSolt == 'number2'){
            this.changeBlock(false)
        }
    }

    this.changeBlock = (isBlock)=>{
        if(this.blockNode != null){
            this.blockNode.active = isBlock
            // console.log('blockNode',this.blockNode)
        }
    }

    this.robotRelease = ()=>{
        if(this.instance != null){
            // this.instance.node.resumeSystemEvents(false)
        }
        if(this.blockNode != null && cc.isValid(this.blockNode) == true){
            this.blockNode.destroy()
            this.blockNode = null
        }
        CodeRobot.prototype.robotRelease.call(this)
    }
}
blockTouchRobot.prototype = new CodeRobot()


function endGameRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)
    
    this.robotInit = ()=>{
        return true
    }

    this.inputHandle = (inputData)=>{
        //只要输入就一定是结束游戏了
        this.codeProgress.end()
    }

    this.outputHandle = (data)=>{
       
    }
}
endGameRobot.prototype = new CodeRobot()


function restartGameRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)
    
    this.robotInit = ()=>{
        return true
    }

    this.inputHandle = (inputData)=>{
        if(inputData.data != 0){
            this.codeProgress.restart()
        }
    }

    this.outputHandle = (data)=>{
       
    }
}
restartGameRobot.prototype = new CodeRobot()


function changeGameRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)
    
    this.robotInit = ()=>{
        return true
    }

    this.inputHandle = (inputData)=>{
        if(inputData.data != 0){
            this.codeProgress.changeGame(this.config.otherConfig.gamePath.default, this.config.otherConfig.pageIndex.default)
        }
    }

    this.outputHandle = (data)=>{
       
    }

    
}
changeGameRobot.prototype = new CodeRobot()


function changeGameGameRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)
    
    this.robotInit = ()=>{
        return true
    }

    this.inputHandle = (inputData)=>{
        //只要输入就一定是切换游戏了，需要备注一下切换的内容
        this.codeProgress.change()
    }

    this.outputHandle = (data)=>{
       
    }
}
changeGameGameRobot.prototype = new CodeRobot()


function touchStartRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)
    
    this.robotInit = ()=>{
        this.lastBindCodeNode = null
        return true
    }

    this.robotStart = ()=>{
       
    }

    this.inputHandle = (data)=>{
        if(data.data != 0){
            var bindRobot = this.linkDatas.cardexSolt[0]
            if(bindRobot != null){
                bindRobot = bindRobot.robot
                if(this.lastBindCodeNode != null){
                    this.lastBindCodeNode.node.targetOff(this)
                }
                if(bindRobot.codeNode != null){
                    this.lastBindCodeNode = bindRobot.codeNode
                    if(bindRobot.codeNode.getComponent('SpinePlusComponent') == null){
                        bindRobot.codeNode.addComponent('SpinePlusComponent')
                    }
                    bindRobot.codeNode.node.targetOff(this)
                    bindRobot.codeNode.node.on(cc.Node.EventType.TOUCH_START, (event)=>{
                        if(this.codeProgress.codeRobotConfig.pause == 1){
                            return
                        }
                        var location = bindRobot.codeNode.node.parent.convertToNodeSpaceAR(event.getLocation())
                        this.outputHandle('number1', location.x)
                        this.outputHandle('number2', location.y)
                        this.outputHandle('number3', 1)
                    }, this)
                }
            }else{
                this.useCanvas = true
                var canvas = this.codeProgress.onGetSingleCard('space')
                if(canvas == null){
                    cc.warn("没有添加space卡片")
                    this.codeProgress.showTips('没有添加space卡片')
                    return
                }
                cc.log('touchStart useCanvas', canvas.name)
                canvas.targetOff(this)
                canvas.on(cc.Node.EventType.TOUCH_START, (event)=>{
                    if(this.codeProgress.codeRobotConfig.pause == 1){
                        return
                    }
                    var location = canvas.convertToNodeSpaceAR(event.getLocation())
                    this.outputHandle('number1', location.x)
                    this.outputHandle('number2', location.y)
                    this.outputHandle('number3', 1)
                }, this)
            }
        }else{
            if(this.useCanvas == true){
                var canvas = this.codeProgress.onGetSingleCard('space')
                if(canvas == null){
                    cc.warn("没有添加space卡片")
                    this.codeProgress.showTips('没有添加space卡片')
                    return
                }
                canvas.targetOff(this)
                this.useCanvas = false
            }else{
                var bindRobot = this.linkDatas.cardexSolt[0]
                if(bindRobot != null){
                    bindRobot = bindRobot.robot
                    if(bindRobot.codeNode != null){
                        bindRobot.codeNode.node.targetOff(this)
                    }
                }
            }
        }
    }

    this.outputHandle = (targetSolt, value)=>{
        // if(GlobalConfig.recordMode == true){
        //     return
        // }
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            
        }, targetSolt, 1)

        var codeNode
        var bindRobot = this.linkDatas.cardexSolt[0]
        if(bindRobot != null){
            bindRobot = bindRobot.robot
            if(bindRobot.codeNode != null){
                codeNode = bindRobot.codeNode
            }
        }
        if(this.config.otherConfig.controllObj.default == 1 && codeNode != null){
            if(targetSolt == 'number1'){
                codeNode.x = value
            }
            if(targetSolt == 'number2'){
                codeNode.y = value
            }
        }

        if(this.linkDatas.outputSolt[targetSolt]){
            var onelinkDatas = this.linkDatas.outputSolt[targetSolt]
            for(var i = 0; i < onelinkDatas.length; i++){
                var onelinkData = onelinkDatas[i]
                onelinkData.robot.inputHandle({solt:onelinkData.solt, data:value, targetSolt: onelinkData.otherSolt})
            }
        }
    }

    this.robotRelease = ()=>{
        if(this.useCanvas == true){
            var canvas = this.codeProgress.onGetSingleCard('space')
            if(canvas == null){
                cc.warn("没有添加space卡片")
                this.codeProgress.showTips('没有添加space卡片')
                return
            }
            canvas.targetOff(this)
            this.useCanvas = false
        }
        CodeRobot.prototype.robotRelease.call(this)
    }
}
touchStartRobot.prototype = new CodeRobot()

function touchMoveRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)
    
    this.robotInit = ()=>{
        this.useCanvas = false
        this.lastBindCodeNode = null
        this.touchIds = {}
        return true
    }

    this.robotStart = ()=>{
        
    }

    this.inputHandle = (data)=>{
        if(data.data != 0){
            var bindRobot = this.linkDatas.cardexSolt[0]
            if(bindRobot != null){
                bindRobot = bindRobot.robot
                if(this.lastBindCodeNode != null){
                    this.lastBindCodeNode.node.targetOff(this)
                }
                if(bindRobot.codeNode != null){
                    this.lastBindCodeNode = bindRobot.codeNode
                    if(bindRobot.codeNode.getComponent('SpinePlusComponent') == null){
                        bindRobot.codeNode.addComponent('SpinePlusComponent')
                    }
                    // bindRobot.codeNode.node.off(cc.Node.EventType.TOUCH_MOVE)

                    var lastMovePos = null
                    var moveCount = 5
                    var eventId = null
                    bindRobot.codeNode.node.targetOff(this)
                    bindRobot.codeNode.node.on(cc.Node.EventType.TOUCH_START, (event)=>{
                        lastMovePos = null
                        eventId = event.getID() 
                        var eventid = event.getID() 
                        this.touchIds[eventid] = 1
                    }, this)
                    bindRobot.codeNode.node.on(cc.Node.EventType.TOUCH_MOVE, (event)=>{
                        if(Object.keys(this.touchIds).length > 1 && this.config.otherConfig.mutplayTouch.default == 1){
                            //多点触摸时不响应
                            return
                        }
                        if(eventId != event.getID()){
                            return
                        }
                        if(this.codeProgress.codeRobotConfig.pause == 1){
                            return
                        }
                        if(this.instance != null && moveCount < 5){
                            moveCount += 1
                            return
                        }
                        moveCount = 0
                        if(lastMovePos == null){
                            lastMovePos = bindRobot.codeNode.parent.convertToNodeSpaceAR(event.getLocation())
                            return
                        }
                        var nowMovePos = bindRobot.codeNode.parent.convertToNodeSpaceAR(event.getLocation())
                        //移动的时候检测，只在碰撞框内才出发移动
                        var inTouch = true

                        if(this.config.otherConfig.needCheckIn.default == 1){
                            var collider = bindRobot.codeNode.getComponent(cc.PolygonCollider)
                            if(collider != null){
                                var inNodePos = bindRobot.codeNode.node.convertToNodeSpaceAR(event.getLocation())
                                var inTouch = cc.Intersection.pointInPolygon(inNodePos, collider.points)
                            }
                        }
                    
                        var delta = nowMovePos.sub(lastMovePos)
                        if(inTouch == true){
                            this.outputHandle('number1', delta.x)
                            this.outputHandle('number2', delta.y)
                        }
                        
                        lastMovePos = nowMovePos
                        // this.outputHandle('number1', event.getDeltaX())
                        // this.outputHandle('number2', event.getDeltaY())
                    }, this)
                    bindRobot.codeNode.node.on(cc.Node.EventType.TOUCH_END, (event)=>{
                        var eventid = event.getID()
                        delete this.touchIds[eventid]
                    }, this)
                    bindRobot.codeNode.node.on(cc.Node.EventType.TOUCH_CANCEL, (event)=>{
                        var eventid = event.getID()
                        delete this.touchIds[eventid]
                    }, this)
                }
            }else{
                this.useCanvas = true
                var canvas = this.codeProgress.onGetSingleCard('space')
                canvas.targetOff(this)
                var lastMovePos = null
                var moveCount = 5
                canvas.on(cc.Node.EventType.TOUCH_START, (event)=>{
                    lastMovePos = null
                    var eventid = event.getID()
                    this.touchIds[eventid] = 1
                }, this)
                canvas.on(cc.Node.EventType.TOUCH_MOVE, (event)=>{
                    if(Object.keys(this.touchIds).length > 1 && this.config.otherConfig.mutplayTouch.default == 1){
                        //多点触摸时不响应
                        return
                    }
                    if(this.codeProgress.codeRobotConfig.pause == 1){
                        return
                    }
                    if(this.instance != null){
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
                        this.outputHandle('number1', delta.x)
                        this.outputHandle('number2', delta.y)
                        lastMovePos = nowMovePos
                    }else{
                        this.outputHandle('number1', event.getDeltaX())
                        this.outputHandle('number2', event.getDeltaY())
                    }
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
                var canvas = this.codeProgress.onGetSingleCard('space')
                if(canvas == null){
                    cc.warn("没有添加space卡片")
                    this.codeProgress.showTips('没有添加space卡片')
                    return
                }
                canvas.targetOff(this)
                this.useCanvas = false
            }else{
                var bindRobot = this.linkDatas.cardexSolt[0]
                if(bindRobot != null){
                    bindRobot = bindRobot.robot
                    if(bindRobot.codeNode != null){
                        bindRobot.codeNode.node.targetOff(this)
                    }
                }
            }
        }
    }

    this.outputHandle = (targetSolt, value)=>{
        // if(GlobalConfig.recordMode == true){
        //     return
        // }
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            
        }, targetSolt, 1)
        if(this.linkDatas.outputSolt[targetSolt]){
            var onelinkDatas = this.linkDatas.outputSolt[targetSolt]
            for(var i = 0; i < onelinkDatas.length; i++){
                var onelinkData = onelinkDatas[i]
                onelinkData.robot.inputHandle({solt:onelinkData.solt, data:value, targetSolt: onelinkData.otherSolt})
            }
        }
        if(this.config.otherConfig.controllObj.default == 1){
            var bindRobot = this.linkDatas.cardexSolt[0]
            if(bindRobot != null){
                bindRobot = bindRobot.robot
                if(bindRobot.codeNode != null){
                    // console.log(targetSolt, value)
                    if(targetSolt == 'number1'){
                        bindRobot.codeNode.x += value
                    }
                    if(targetSolt == 'number2'){
                        bindRobot.codeNode.y += value
                    }
                }
            }
        }
    }

    this.robotRelease = ()=>{
        this.touchIds = {}
        if(this.useCanvas == true){
            var canvas = this.codeProgress.onGetSingleCard('space')
            if(canvas == null){
                cc.warn("没有添加space卡片")
                this.codeProgress.showTips('没有添加space卡片')
                return
            }
            canvas.targetOff(this)
            this.useCanvas = false
        }
        CodeRobot.prototype.robotRelease.call(this)
    }
}
touchMoveRobot.prototype = new CodeRobot()

function touchEndRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)
    
    this.robotInit = ()=>{
        this.lastBindCodeNode = null
        return true
    }

    this.robotStart = ()=>{
        
    }
    

    this.inputHandle = (data)=>{
        if(data.data != 0){
            var bindRobot = this.linkDatas.cardexSolt[0]
            if(bindRobot != null){
                bindRobot = bindRobot.robot
                if(this.lastBindCodeNode != null){
                    this.lastBindCodeNode.node.targetOff(this)
                    // this.lastBindCodeNode.node.off(cc.Node.EventType.TOUCH_CANCEL)
                }
                if(bindRobot.codeNode != null){
                    this.lastBindCodeNode = bindRobot.codeNode
                    if(bindRobot.codeNode.getComponent('SpinePlusComponent') == null){
                        bindRobot.codeNode.addComponent('SpinePlusComponent')
                    }
                    // bindRobot.codeNode.node.off(cc.Node.EventType.TOUCH_END)
                    // bindRobot.codeNode.node.off(cc.Node.EventType.TOUCH_CANCEL)
                    bindRobot.codeNode.node.targetOff(this)

                    var startLocation = null
                    bindRobot.codeNode.node.on(cc.Node.EventType.TOUCH_START, (event)=>{
                        startLocation = bindRobot.codeNode.node.parent.convertToNodeSpaceAR(event.getLocation())
                    }, this)

                    bindRobot.codeNode.node.on(cc.Node.EventType.TOUCH_END, (event)=>{
                        // console.log('点击结束')
                        if(this.codeProgress.codeRobotConfig.pause == 1){
                            return
                        }
                        var location = bindRobot.codeNode.node.parent.convertToNodeSpaceAR(event.getLocation())
                        this.outputHandle('number1', location.x)
                        this.outputHandle('number2', location.y)
                        if(startLocation && location.sub(startLocation).mag() < 10){
                            this.outputHandle('number3', 1)
                        }else{
                            this.outputHandle('number3', 2)
                        }
                    }, this)
                    bindRobot.codeNode.node.on(cc.Node.EventType.TOUCH_CANCEL, (event)=>{
                        // console.log('点击取消')
                        if(this.codeProgress.codeRobotConfig.pause == 1){
                            return
                        }
                        if(this.config.otherConfig.listernTouchCancel.default == 1){return}
                        var location = bindRobot.codeNode.node.parent.convertToNodeSpaceAR(event.getLocation())
                        this.outputHandle('number1', location.x)
                        this.outputHandle('number2', location.y)
                        // this.outputHandle('number3', 1)
                        if(startLocation && location.sub(startLocation).mag() < 10){
                            this.outputHandle('number3', 1)
                        }else{
                            this.outputHandle('number3', 2)
                        }
                    }, this)
                }
            }else{
                    this.useCanvas = true
                    var canvas = this.codeProgress.onGetSingleCard('space')
                    if(canvas == null){
                        cc.warn("没有添加space卡片")
                        this.codeProgress.showTips('没有添加space卡片')
                        return
                    }
                    canvas.targetOff(this)
                    var startLocation = null
                    canvas.on(cc.Node.EventType.TOUCH_START, (event)=>{
                        startLocation = canvas.convertToNodeSpaceAR(event.getLocation())
                    }, this)

                    canvas.on(cc.Node.EventType.TOUCH_END, (event)=>{
                        console.log('点击结束')

                        if(this.codeProgress.codeRobotConfig.pause == 1){
                            return
                        }
                        var location = canvas.convertToNodeSpaceAR(event.getLocation())
                        this.outputHandle('number1', location.x)
                        this.outputHandle('number2', location.y)
                        if(location.sub(startLocation).mag() < 10){
                            this.outputHandle('number3', 1)
                        }else{
                            this.outputHandle('number3', 2)
                        }
                    }, this)
                    canvas.on(cc.Node.EventType.TOUCH_CANCEL, (event)=>{
                        console.log('点击取消')
                        if(this.codeProgress.codeRobotConfig.pause == 1){
                            return
                        }
                        if(this.config.otherConfig.listernTouchCancel.default == 1){return}

                        var location = canvas.convertToNodeSpaceAR(event.getLocation())
                        this.outputHandle('number1', location.x)
                        this.outputHandle('number2', location.y)
                        if(location.sub(startLocation).mag() < 10){
                            this.outputHandle('number3', 1)
                        }else{
                            this.outputHandle('number3', 2)
                        }
                    }, this)
            }
        }else{
            if(this.useCanvas == true){
                var canvas = this.codeProgress.onGetSingleCard('space')
                if(canvas == null){
                    cc.warn("没有添加space卡片")
                    this.codeProgress.showTips('没有添加space卡片')
                    return
                }

                canvas.targetOff(this)
                // canvas.off(cc.Node.EventType.TOUCH_END)
                // canvas.off(cc.Node.EventType.TOUCH_CANCEL)
                // cc.log('canvas input0 touchend')
                this.useCanvas = false
            }else{
                var bindRobot = this.linkDatas.cardexSolt[0]
                if(bindRobot != null){
                    bindRobot = bindRobot.robot
                    if(bindRobot.codeNode != null){
                        bindRobot.codeNode.node.targetOff(this)
                        // bindRobot.codeNode.node.off(cc.Node.EventType.TOUCH_CANCEL)
                    }
                }
            }
        }
    }

    this.outputHandle = (targetSolt, value)=>{
        // cc.log('touchEndRobot',targetSolt, value)
        // if(GlobalConfig.recordMode == true){
        //     return
        // }
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            
        }, targetSolt, 1)

        var codeNode
        var bindRobot = this.linkDatas.cardexSolt[0]
        if(bindRobot != null){
            bindRobot = bindRobot.robot
            if(bindRobot.codeNode != null){
                codeNode = bindRobot.codeNode
            }
        }
        if(this.config.otherConfig.controllObj.default == 1 && codeNode != null){
            if(targetSolt == 'number1'){
                codeNode.x = value
            }
            if(targetSolt == 'number2'){
                codeNode.y = value
            }
        }

        if(this.linkDatas.outputSolt[targetSolt]){
            var onelinkDatas = this.linkDatas.outputSolt[targetSolt]
            for(var i = 0; i < onelinkDatas.length; i++){
                var onelinkData = onelinkDatas[i]
                onelinkData.robot.inputHandle({solt:onelinkData.solt, data:value, targetSolt: onelinkData.otherSolt})
            }
        }
    }

    this.robotRelease = ()=>{
        if(this.useCanvas == true){
            cc.log('canvas Release touchend')
            var canvas = this.codeProgress.onGetSingleCard('space')
            if(canvas == null){
                cc.warn("没有添加space卡片")
                this.codeProgress.showTips('没有添加space卡片')
                return
            }
            canvas.targetOff(this)
            this.useCanvas = false
        }
        CodeRobot.prototype.robotRelease.call(this)
    }
}
touchEndRobot.prototype = new CodeRobot()


function showHandTipRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)

    this.robotInit = ()=>{
        this.inShowTips = false
        return true
     }


     this.robotStart = ()=>{
        this.hideTips()
     }
 
     this.inputHandle = (inputData)=>{
        
         //接收输入的参数
        if(inputData.targetSolt == 'number1'){
            if(inputData.data != 0){
                this.inShowTips = true
                this.showTips()
            }
        }else if(inputData.targetSolt == 'number2'){
            if(inputData.data != 0){
                this.inShowTips = false
                this.hideTips()
            }
        }
     }

     this.showTips = ()=>{
        var bindRobot
        if(this.linkDatas != null){
            bindRobot = this.linkDatas.cardexSolt[0]
            if(bindRobot != null){
                bindRobot = bindRobot.robot
            }
        }else{
            bindRobot = this.getLinkRobot()
        }
        if(bindRobot != null){
            if(bindRobot.codeNode != null){
                bindRobot.codeNode.active = 1
                bindRobot.codeNode.scale = this.config.otherConfig.scale.default / 10

                var modal = this.config.otherConfig.modal.default
                var spineCom = bindRobot.codeNode.spineCom
                if(spineCom != null){
                    if(modal == 0){
                        spineCom.setAnimation(0, 'act1', true)
                        spineCom.setCompleteListener((trackEntry)=>{
                            // let ccompleteName = trackEntry.animation.name;
                            this.outputHandle()
                        })
                    }else if(modal == 1){
                        spineCom.setAnimation(0, 'act2', true)
                        spineCom.setCompleteListener((trackEntry)=>{
                            // let ccompleteName = trackEntry.animation.name;
                            this.outputHandle()
                        })
                    }else if(modal == 2){
                        spineCom.setAnimation(0, 'act3_1', false)
                        spineCom.addAnimation(0, 'act3_2', true)
                        var x = this.config.otherConfig.x.default
                        var y = this.config.otherConfig.y.default
                        var lengthx = bindRobot.codeNode.x - x
                        var lengthy = bindRobot.codeNode.y - y
                        if(this.config.otherConfig.speed.default == 0){
                            return
                        }
                        var time = Math.sqrt(lengthy * lengthy + lengthx * lengthx) / this.config.otherConfig.speed.default
                        if(time == 0){
                            return
                        }
                        var oriX = bindRobot.codeNode.x 
                        var oriY = bindRobot.codeNode.y
                        cc.tween(bindRobot.codeNode).delay(0.3).to(time, {x: x, y: y}).call(()=>{
                            spineCom.loop = false
                            spineCom.addAnimation(0, 'act3_3', false)
                            cc.tween(this).delay(1).call(()=>{
                               bindRobot.codeNode.x = oriX
                               bindRobot.codeNode.y = oriY
                               this.outputHandle()
                               this.showTips()
                            }).start()
                        }).start()
                    }else if(modal == 3){
                        var length = this.config.otherConfig.length.default
                        if(this.config.otherConfig.speed.default == 0){
                            return
                        }
                        var time = length / this.config.otherConfig.speed.default
                        spineCom.setAnimation(0, 'act3_2', true)
                        if(time == 0){
                            return
                        }
                        cc.tween(bindRobot.codeNode)
                            
                            .to(time, {y: bindRobot.codeNode.y - length})
                            .to(time * 2, {y: bindRobot.codeNode.y + length})
                            .to(time, {y: bindRobot.codeNode.y})
                            .call(()=>{
                                this.outputHandle()
                                this.showTips()
                            })
                            .start() 
                    }else if(modal == 4){
                        var length = this.config.otherConfig.length.default
                        if(this.config.otherConfig.speed.default == 0){
                            return
                        }
                        var time = Math.abs(length / this.config.otherConfig.speed.default)
                        spineCom.setAnimation(0, 'act3_2', true)
                        if(time == 0){
                            return
                        }
                        cc.tween(bindRobot.codeNode)
                            .to(time, {x: bindRobot.codeNode.x - length})
                            .to(time * 2, {x: bindRobot.codeNode.x + length})
                            .to(time, {x: bindRobot.codeNode.x})
                            .call(()=>{
                                this.outputHandle()
                                this.showTips()
                            })
                            .start()
                    }else if(modal == 5){
                        bindRobot.codeNode.radius = this.config.otherConfig.length.default
                        if(this.config.otherConfig.speed.default == 0){
                            return
                        }
                        var time = Math.abs(Math.PI * 2 / (this.config.otherConfig.speed.default *0.01))
                        if(time == 0){
                            return
                        }
                        spineCom.setAnimation(0, 'act3_2', true)
                        var angle = this.config.otherConfig.speed.default > 0 ? 360 : -360
                        // console.log('多少秒转一圈',time, angle)
                        cc.tween(bindRobot.codeNode)
                            .by(time, {angleToPos: angle})
                            .call(()=>{
                                this.outputHandle()
                                this.showTips()
                            })
                            .start() 
                    }else if(modal == 6){
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
                }
            }
        }
     }

     this.hideTips = ()=>{
        cc.Tween.stopAllByTarget(this);
        var bindRobot
        if(this.linkDatas != null){
            bindRobot = this.linkDatas.cardexSolt[0]
            if(bindRobot != null){
                bindRobot = bindRobot.robot
            }
        }else{
            bindRobot = this.getLinkRobot()
        }
        if(bindRobot != null){
            if(bindRobot.codeNode != null){
                cc.Tween.stopAllByTarget(bindRobot.codeNode);
                if(bindRobot.spineCom != null){
                    bindRobot.spineCom.clearTrack(0)
                }
                bindRobot.codeNode.active = 0
            }
        }
     }

     this.robotPause = ()=>{
        if(this.inShowTips == true){
            this.hideTips()
        }
     }

     this.robotResume = ()=>{
        if(this.inShowTips == true){
            this.showTips()
        }
     }

     this.freshOtherConfig = ()=>{

     }
 
     this.outputHandle = (data)=>{
        cc.log('一次引导循环结束了')
     }

     this.onCardSelect = ()=>{
        this.showTips()
     }

     //只有编辑时会执行
     this.getLinkRobot = ()=>{
        var bindRobot
        cc.director.emit('getLineBySolt', {soltid: this.instance.cardexSolt.getChildByName('dot').uuid, dontAutoCreate: true, cb:(line)=>{
            if(line != null){
                if(line.endDrop.card == this.instance){
                    bindRobot = line.startDrop.card.robot
                }else{
                    bindRobot = line.endDrop.card.robot
                }
            }
        }})
        return bindRobot
     }
     

    this.onCardUnSelect = ()=>{
        this.hideTips()
        var robot = this.getLinkRobot()
        if(robot != null){
            if(robot.codeNode != null){
                robot.codeNode.active = 1
            } 
            robot.freshOtherConfig(robot.config.otherConfig)
        }
    }

    
     
     //流程结束
     this.robotRelease = ()=>{
        //  this.hideTips()
        this.inShowTips = false
         cc.Tween.stopAllByTarget(this);
         CodeRobot.prototype.robotRelease.call(this)
     }
}
showHandTipRobot.prototype = new CodeRobot()


function screenSizeRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)

    this.robotInit = ()=>{
        //初始化
        this.value = Math.max(cc.winSize.width , cc.winSize.height) / Math.min(cc.winSize.width , cc.winSize.height)

        if(this.instance != null){
            var spaceCard = this.codeProgress.onGetSingleCard('space')
            if(spaceCard == null){
                cc.warn("没有添加space卡片")
                this.codeProgress.showTips('没有添加space卡片')
                return
            }
            var whiteNode = spaceCard.getChildByName('whiteNode')
            if(whiteNode == null){
                cc.warn("没有添加space/whiteNode")
                return
            }
            this.value = Math.max(whiteNode.width , whiteNode.height) / Math.min(whiteNode.width , whiteNode.height)
        }

        if(this.value < 1.6){
            this.outputKey = 'number1'
        }else if(this.value < 1.9){
            this.outputKey = 'number2'
        }else{
            this.outputKey = 'number3'
        }
        return true
    }

    this.inputHandle = (inputData)=>{
        //手动触发
        if(inputData.data != 0){
            this.outputHandle(inputData.data)
        }
    }

    this.outputHandle = (value)=>{
        //输出内容
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            if(this.linkDatas.outputSolt[this.outputKey]){
                var onelinkDatas = this.linkDatas.outputSolt[this.outputKey]
                for(var i = 0; i < onelinkDatas.length; i++){
                    var onelinkData = onelinkDatas[i]
                    onelinkData.robot.inputHandle({solt:onelinkData.solt, data: value, targetSolt: onelinkData.otherSolt})
                }
            }
        }, this.outputKey, 1)
    }

    // this.freshOtherConfig = (config)=>{
    //     if(this.instance != null){
    //         this.instance.soltIds[0].node.parent.getChildByName('infoLabel').getComponent(cc.Label).string = config.value.default
    //     }
    // }
}

screenSizeRobot.prototype = new CodeRobot()


function systemDataRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)

    this.robotInit = ()=>{
      
        return true
    }

    this.inputHandle = (inputData)=>{
        if(inputData.data == 0){
            return
        }
        this.outputHandle()
    }

    this.outputHandle = ()=>{
        //输出内容
        var value = this.getLinkData()

        CodeRobot.prototype.outputHandle.call(this, ()=>{
            if(this.linkDatas.outputSolt['number1']){
                var onelinkDatas = this.linkDatas.outputSolt['number1']
                for(var i = 0; i < onelinkDatas.length; i++){
                    var onelinkData = onelinkDatas[i]
                    onelinkData.robot.inputHandle({solt:onelinkData.solt, data: value, targetSolt: onelinkData.otherSolt})
                }
            }
        }, null, 1)
    }


    this.getLinkData = ()=>{
        var value = 0
        if(this.config.otherConfig.modal.default == 0){
            value = Math.floor(new Date().getTime() / 1000)
        }else if(this.config.otherConfig.modal.default == 1){
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
        }else if(this.config.otherConfig.modal.default == 2){
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
        }else if(this.config.otherConfig.modal.default == 3){
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
        }else if(this.config.otherConfig.modal.default == 4){
            value = cc.sys.os
        }else if(this.config.otherConfig.modal.default == 5){
            value = 1.0
        }else if(this.config.otherConfig.modal.default == 6){
            //读取配置表
            var fileName = this.config.otherConfig.fileName.default
            value = this.codeProgress.getConfigData(fileName)
        }else if(this.config.otherConfig.modal.default == 7){
            var fileName = this.config.otherConfig.fileName.default
            value = {}
        }else if(this.config.otherConfig.modal.default == 8){
            value = []
        }else if(this.config.otherConfig.modal.default == 9){
            value = cc.winSize.width

            if(this.instance != null){
                var spaceCard = this.codeProgress.onGetSingleCard('space')
                if(spaceCard == null){
                    cc.warn("没有添加space卡片")
                    this.codeProgress.showTips('没有添加space卡片')
                    return
                }
                var whiteNode = spaceCard.getChildByName('whiteNode')
                if(whiteNode == null){
                    cc.warn("没有添加space/whiteNode")
                    return
                }
                value =whiteNode.width
            }
        }else if(this.config.otherConfig.modal.default == 10){
            value = cc.winSize.height

            if(this.instance != null){
                var spaceCard = this.codeProgress.onGetSingleCard('space')
                if(spaceCard == null){
                    cc.warn("没有添加space卡片")
                    this.codeProgress.showTips('没有添加space卡片')
                    return
                }
                var whiteNode = spaceCard.getChildByName('whiteNode')
                if(whiteNode == null){
                    cc.warn("没有添加space/whiteNode")
                    return
                }
                value = whiteNode.height
            }
        }else if(this.config.otherConfig.modal.default == 11){
            value = cc.winSize.width * 0.5
            if(this.instance != null){
                var spaceCard = this.codeProgress.onGetSingleCard('space')
                if(spaceCard == null){
                    cc.warn("没有添加space卡片")
                    this.codeProgress.showTips('没有添加space卡片')
                    return
                }
                var whiteNode = spaceCard.getChildByName('whiteNode')
                if(whiteNode == null){
                    cc.warn("没有添加space/whiteNode")
                    return
                }
                value = whiteNode.width * 0.5
            }
            value = [-value, value]
        }else if(this.config.otherConfig.modal.default == 12){
            value = cc.winSize.height * 0.5
            if(this.instance != null){
                var spaceCard = this.codeProgress.onGetSingleCard('space')
                if(spaceCard == null){
                    cc.warn("没有添加space卡片")
                    this.codeProgress.showTips('没有添加space卡片')
                    return
                }
                var whiteNode = spaceCard.getChildByName('whiteNode')
                if(whiteNode == null){
                    cc.warn("没有添加space/whiteNode")
                    return
                }
                value = whiteNode.height * 0.5
            }
            value = [-value, value]
        }
        return value
    }

    this.freshOtherConfig = (config)=>{
        if(this.instance != null){
            if(config.modal.default == 6){
                this.instance.resultLabel.string = config.fileName.default
            }else{
                this.instance.resultLabel.string = config.modal.chooses[config.modal.default]
            }
        }
    }
}

systemDataRobot.prototype = new CodeRobot()


function setDataRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)

    this.robotInit = ()=>{
        this.saveKey = this.config.otherConfig.saveKey.default
        return true
    }

    this.inputHandle = (inputData)=>{
        if(inputData.targetSolt == 'saveKey'){
            this.saveKey = inputData.data
            return
        }
        var codeJsonData = LocalStorageUtils.getItem('codeJsonData')
        if(codeJsonData == null || codeJsonData == ''){
            codeJsonData = {}
        }else{
            codeJsonData = JSON.parse(codeJsonData)
        }
        codeJsonData[this.saveKey] = inputData.data
        LocalStorageUtils.setItem('codeJsonData', JSON.stringify(codeJsonData))
    }

    this.outputHandle = ()=>{
       
    }
}

setDataRobot.prototype = new CodeRobot()

//处理数据
function handDataRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)

    this.robotInit = ()=>{
        this.keyOrIndex = null
        this.value = null
        if(this.config.otherConfig.keyOrIndex.default != ''){
            this.keyOrIndex = this.config.otherConfig.keyOrIndex.default
        }
        if(this.config.otherConfig.value != ''){
            this.value = this.config.otherConfig.value.default
        }
        return true
    }

    this.inputHandle = (inputData)=>{
        this[inputData.targetSolt] = inputData.data
        if(inputData.targetSolt == "number2"){
            var bindRobot = this.linkDatas.cardexSolt[0]
            if(bindRobot != null){
                bindRobot = bindRobot.robot
                if(bindRobot.data != null){ 
                    this.outputHandle('number2', bindRobot.data)
                }
            }
        }else{
            this.realDo()
        }
    }

    this.realDo = ()=>{
        var bindRobot = this.linkDatas.cardexSolt[0]
        if(bindRobot != null){
            bindRobot = bindRobot.robot
            if(bindRobot.data != null){ 
                var result = 0
                var hasDo = false
                switch(this.config.otherConfig.modal.default){
                    case 0://增加
                        if(this.value != null){
                            if(bindRobot.data instanceof Array){
                                if(this.keyOrIndex == null){
                                        bindRobot.data.push(this.value)
                                        hasDo = true
                                }else{
                                    bindRobot.data.splice(this.keyOrIndex - 1, 0, this.value)
                                    hasDo = true
                                }
                            }else{
                                if(this.keyOrIndex != null){
                                    bindRobot.data[this.keyOrIndex] = this.value
                                    hasDo = true
                                }
                            }
                        }
                        result = 1
                        break;
                    case 1://删除
                        if(this.keyOrIndex != null){
                            if(bindRobot.data instanceof Array){
                                var deleteCount = this.value
                                if(deleteCount == null){
                                    deleteCount = 1
                                }
                                //从第几位开始删除，以及删除的数量
                                bindRobot.data.splice(this.keyOrIndex -1, deleteCount)
                            }else{
                                //直接删除key
                                delete bindRobot.data[this.keyOrIndex]
                            }
                            hasDo = true
                        }
                        result = 1
                        break;
                    case 2://查询
                        if(this.value != null){
                            hasDo = true
                            if(bindRobot.data instanceof Array){
                                //如果是0的话就是不存在，不为0就是存在
                                result = bindRobot.data.indexOf(this.value) + 1
                            }else{
                                for(var key in bindRobot.data){
                                    if(bindRobot.data[key] == this.value){
                                        result = key
                                        break
                                    }
                                }
                            }
                        }
                        break;
                    case 3://修改
                        if(this.keyOrIndex != null && this.value != null){
                            if(bindRobot.data instanceof Array){
                                if(bindRobot.data[this.keyOrIndex - 1] != null){
                                    bindRobot.data[this.keyOrIndex - 1] = this.value
                                }else{
                                    bindRobot.data.push(this.value)
                                }
                            }else{
                                bindRobot.data[this.keyOrIndex] = this.value
                            }
                            hasDo = true
                            result = 1
                        }
                        break;
                    case 4://数量
                        if(bindRobot.data instanceof Array){
                            result = bindRobot.data.length
                        }else{
                            result = Object.keys(bindRobot.data.length)
                        }
                        hasDo = true
                        break;
                    case 5://取值
                        if(this.keyOrIndex != null){
                            if(bindRobot.data instanceof Array){
                                result = bindRobot.data[this.keyOrIndex - 1]
                            }else{
                                result = bindRobot.data[this.keyOrIndex]
                            }
                            hasDo = true
                        }
                        break;
                }
                if(hasDo == true){
                    // console.log("操作了数据", bindRobot.data, this.keyOrIndex == null, this.keyOrIndex, this.value)
                    this.outputHandle('number1',result)
                    this.outputHandle('number2', bindRobot.data)
                }
            }else{
                console.log('操作目标还未挂载值')
            }
        }
    }

    this.outputHandle = (solt,result)=>{
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            if(this.linkDatas.outputSolt[solt]){
                var onelinkDatas = this.linkDatas.outputSolt[solt]
                for(var i = 0; i < onelinkDatas.length; i++){
                    var onelinkData = onelinkDatas[i]
                    onelinkData.robot.inputHandle({solt:onelinkData.solt, data: result, targetSolt: onelinkData.otherSolt})
                }
            }
        }, null, result)
    }

    this.freshOtherConfig = (config)=>{
        if(this.instance != null){
            this.instance.resultLabel.string = config.modal.chooses[config.modal.default]
        }
    }
}

handDataRobot.prototype = new CodeRobot()

function customDataRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)

    this.robotInit = ()=>{
        return true
    }

    this.inputHandle = (inputData)=>{
        // if(inputData.data == 0){
        //     return
        // }
        var codeJsonData = LocalStorageUtils.getItem('codeJsonData')
        if(codeJsonData == null || codeJsonData == ''){
            codeJsonData = {}
        }else{
            codeJsonData = JSON.parse(codeJsonData)
        }
        var value = codeJsonData[this.config.otherConfig.saveKey.default]
        if(value == null){
            if(this.config.otherConfig.ifEmpty.default == 1){
                //如果是这样就返回
                return
            }
            value = 0
        }
        this.outputHandle(value)
        // cc.sys.localStorage.setItem('codeJsonData', JSON.stringify(codeJsonData))
    }

    this.outputHandle = (value)=>{
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            if(this.linkDatas.outputSolt['number1']){
                var onelinkDatas = this.linkDatas.outputSolt['number1']
                for(var i = 0; i < onelinkDatas.length; i++){
                    var onelinkData = onelinkDatas[i]
                    onelinkData.robot.inputHandle({solt:onelinkData.solt, data: value, targetSolt: onelinkData.otherSolt})
                }
            }
        }, null, value == 0 ? 0 : 1)
    }
}

customDataRobot.prototype = new CodeRobot()


function userDataRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)

    this.robotInit = ()=>{
        return true
    }

    this.inputHandle = (inputData)=>{
       
    }

    this.outputHandle = (value)=>{
      
    }
}

userDataRobot.prototype = new CodeRobot()

//负责处理Array或者Object结构的数据
function dataObjectRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)

    this.robotInit = ()=>{
        this.data = null
        return true
    }

    this.inputHandle = (inputData)=>{
        // console.log('dataObjectRobot收到了', inputData)
        if(inputData.targetSolt == 'number1'){
            this.data = inputData.data
            this.outputHandle()
        }else if(inputData.targetSolt == 'number2'){
            this.outputHandle()
        }
    }

    //输出
    this.outputHandle = ()=>{
        var onelinkDatasKey = []
        var onelinkDatasValue = []

        if(this.linkDatas.outputSolt['number1']){
            onelinkDatasKey = this.linkDatas.outputSolt['number1']
        }
        if(this.linkDatas.outputSolt['number2']){
            onelinkDatasValue = this.linkDatas.outputSolt['number2']
        }

        CodeRobot.prototype.outputHandle.call(this, ()=>{
            if(this.data instanceof Array){
                for(var i = 0; i < this.data.length; i++){
                    for(var z = 0; z < onelinkDatasKey.length; z++){
                        var onelinkData = onelinkDatasKey[z]
                        onelinkData.robot.inputHandle({solt:onelinkData.solt, data: i, targetSolt: onelinkData.otherSolt})
                    }
            
                    for(var j = 0; j < onelinkDatasValue.length; j++){
                        var onelinkData = onelinkDatasValue[j]
                        onelinkData.robot.inputHandle({solt:onelinkData.solt, data: this.data[i], targetSolt: onelinkData.otherSolt})
                    }
                }
            }else if(this.data instanceof Object){
                for(var key in this.data){
                    for(var z = 0; z < onelinkDatasKey.length; z++){
                        var onelinkData = onelinkDatasKey[z]
                        onelinkData.robot.inputHandle({solt:onelinkData.solt, data: key, targetSolt: onelinkData.otherSolt})
                    }
            
                    for(var j = 0; j < onelinkDatasValue.length; j++){
                        var onelinkData = onelinkDatasValue[j]
                        onelinkData.robot.inputHandle({solt:onelinkData.solt, data: this.data[key], targetSolt: onelinkData.otherSolt})
                    }
                }
            }
        }, null, 1)
    }

    this.onCardSelect = ()=>{
        this.getLinkData()
    }

    //获取绑定的data
    this.getLinkData = (targetSolt)=>{
        var data = null
        var dropNode = this.instance.linkData.inputSolt['number1']
        if(dropNode != null){
            cc.director.emit('getLineBySolt', {soltid: dropNode.dot.uuid, dontAutoCreate: true, cb:(line)=>{
                if(line != null){
                    // console.log('找到了line', line)
                    var otherOutputSolt = ''
                    // var bindRobot
                    if(line.endDrop.card == this.instance){
                        bindRobot = line.startDrop.card.robot
                        otherOutputSolt = line.startDrop.key
                    }else{
                        bindRobot = line.endDrop.card.robot
                        otherOutputSolt = line.endDrop.key
                    }
                    if(bindRobot.getLinkData != null){
                        data = bindRobot.getLinkData(otherOutputSolt)
                    }
                }
            }})
        }
        if(targetSolt == 'number2'){
            //取的是value的值
            if(data instanceof String){

            }else if(data instanceof Number){

            }else if(data instanceof Array){
                if(data.length > 0){
                    data = data[0]
                }else{
                    data = null
                }
            }else if(data instanceof Object){
                var keys = Object.keys(data)
                if(keys.length > 0){
                    data = data[keys[0]]
                }else{
                    data = null
                }
            }
        }else if(targetSolt == 'number1'){
            //取的是key的值
            if(data instanceof String){
                data = null
            }else if(data instanceof Number){
                data = null
            }else if(data instanceof Array){
                data = 0
            }else if(data instanceof Object){
                var keys = Object.keys(data)
                if(keys.length > 0){
                    data = keys[0]
                }else{
                    data = null
                }
            }
        }
        //如果targtSolt为null则表示自己从父节点获取数据
        // console.log('要返回的data', data, targetSolt)
        return data
    }
}

dataObjectRobot.prototype = new CodeRobot()


function getKeyValueRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)

    this.robotInit = ()=>{
        this.data = null
        return true
    }

    this.inputHandle = (inputData)=>{
        // console.log('getKeyValueRobot收到了', inputData)
        if(inputData.targetSolt == 'number1'){
            this.data = inputData.data
            this.outputHandle()
        }else if(inputData.targetSolt == 'number2'){
            this.outputHandle()
        }
    }

    //输出
    this.outputHandle = ()=>{
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            for(var key in this.linkDatas.outputSolt){//要改成这个的话就正常了？
                var onelinkDatas = this.linkDatas.outputSolt[key]
                if(onelinkDatas != null){
                    for(var i = 0; i < onelinkDatas.length; i++){
                        var onelinkData = onelinkDatas[i]
                        onelinkData.robot.inputHandle({solt:onelinkData.solt, data: this.data[key], targetSolt: onelinkData.otherSolt})
                    }
                }
            }
        }, null, 1)
    }

    this.onCardSelect = ()=>{
        if(this.config.otherConfig.customeKey.default == ''){
            var data = this.getLinkData()
            // console.log('我获取到了数据应该更新节点', data)
            if(data != null && data instanceof Object){
                var keys = Object.keys(data)
                this.config.otherConfig.outputSoltCount.default = keys.length
                this.config.otherConfig.outputSoltInfo.default = keys
                this.instance.freshOtherConfig()
            }else{
    
            }
        }
    }

     //获取绑定的data
    this.getLinkData = (targetSolt)=>{
        var data = null
        var dropNode = this.instance.linkData.inputSolt['number1']
        if(dropNode != null){
            cc.director.emit('getLineBySolt', {soltid: dropNode.dot.uuid, dontAutoCreate: true, cb:(line)=>{
                if(line != null){
                    // console.log('getKeyValueRobot 找到了line', line)
                    var otherOutputSolt = ''
                    // var bindRobot
                    if(line.endDrop.card == this.instance){
                        bindRobot = line.startDrop.card.robot
                        otherOutputSolt = line.startDrop.key
                    }else{
                        bindRobot = line.endDrop.card.robot
                        otherOutputSolt = line.endDrop.key
                    }
                    if(bindRobot.getLinkData != null){
                        data = bindRobot.getLinkData(otherOutputSolt)
                    }
                }
            }})
        }
        if(targetSolt != null){
            if(targetSolt == 'number2'){
                //取的是value的值
                if(data instanceof String){
    
                }else if(data instanceof Number){
    
                }else if(data instanceof Array){
                    if(data.length > 0){
                        data = data[0]
                    }else{
                        data = null
                    }
                }else if(data instanceof Object){
                    var keys = Object.keys(data)
                    if(keys.length > 0){
                        data = data[keys[0]]
                    }else{
                        data = null
                    }
                }
            }else if(targetSolt == 'number1'){
                //取的是key的值
                if(data instanceof String){
                    data = null
                }else if(data instanceof Number){
                    data = null
                }else if(data instanceof Array){
                    data = 0
                }else if(data instanceof Object){
                    var keys = Object.keys(data)
                    if(keys.length > 0){
                        data = keys[0]
                    }else{
                        data = null
                    }
                }
            }else if(data[targetSolt] != null){
                data = data[targetSolt]
            }
        }

        //如果targtSolt为null则表示自己从父节点获取数据
        // console.log('getKeyValueRobot 要返回的data', data, targetSolt)
        return data
    }

    this.freshOtherConfig = (config)=>{
        // console.log('freshOtherConfig',config)
        if(config.customeKey.default != ''){
            var keys = config.customeKey.default.split(',')
            this.config.otherConfig.outputSoltCount.default = keys.length
            this.config.otherConfig.outputSoltInfo.default = keys
        }
    }
}

getKeyValueRobot.prototype = new CodeRobot()


function addBagGoodRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)

    this.robotInit = ()=>{
        //初始化
        return true
    }


    this.inputHandle = (inputData)=>{
        //接收输入的参数
        this.outputHandle()
    }

    // linkData:{solt: 'number1', robot:{}}

    this.outputHandle = ()=>{
        //用户的背包数据
        var count = this.config.otherConfig.count.default
        var goodId = this.config.otherConfig.goodId.default
        if(this.config.otherConfig.isReset.default == 1){
            var result1 = this.codeProgress.addBagGood(goodId, 0)
            count = count - result1
        }
        var result = this.codeProgress.addBagGood(goodId, count)
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            if(this.linkDatas.outputSolt['number']){
                var onelinkDatas = this.linkDatas.outputSolt['number']
                for(var i = 0; i < onelinkDatas.length; i++){
                    var onelinkData = onelinkDatas[i]
                    onelinkData.robot.inputHandle({solt:onelinkData.solt, data: result, targetSolt: onelinkData.otherSolt})
                }
            }
        }, null, result)
    }

    this.freshOtherConfig = (config)=>{
        if(this.instance != null){
            var showInfo = '没有此goodId'
            if(GlobalConfig.goodsClient[config.goodId.default] == null){

            }else{
                var name = GlobalConfig.goodsClient[config.goodId.default].name
                if(name != null){
                    showInfo = name
                }else{
                    showInfo = config.goodId.default
                }
                if(config.count.default != 0){
                    showInfo += ':' + config.count.default
                }
            }
            this.instance.node.getChildByName('resultLabel').getComponent(cc.Label).string = showInfo
        }
    }
}
addBagGoodRobot.prototype = new CodeRobot()



function useBagGoodRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)

    this.robotInit = ()=>{
        //初始化
        return true
    }


    this.inputHandle = (inputData)=>{
        //接收输入的参数
        this.outputHandle()
    }

    // linkData:{solt: 'number1', robot:{}}

    this.outputHandle = ()=>{
        //用户的背包数据
        var result = this.codeProgress.useBagGood(this.config.otherConfig.goodId.default, this.config.otherConfig.count.default)
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            if(this.linkDatas.outputSolt['number']){
                var onelinkDatas = this.linkDatas.outputSolt['number']
                for(var i = 0; i < onelinkDatas.length; i++){
                    var onelinkData = onelinkDatas[i]
                    onelinkData.robot.inputHandle({solt:onelinkData.solt, data: result, targetSolt: onelinkData.otherSolt})
                }
            }
        }, null, result)
    }

    this.freshOtherConfig = (config)=>{
        if(this.instance != null){
            var showInfo = '没有此goodId'
            if(GlobalConfig.goodsClient[config.goodId.default] == null){

            }else{
                var name = GlobalConfig.goodsClient[config.goodId.default].name
                if(name != null){
                    showInfo = name
                }else{
                    showInfo = config.goodId.default
                }
                if(config.count.default != 0){
                    showInfo += ':' + config.count.default
                }
            }
            this.instance.node.getChildByName('resultLabel').getComponent(cc.Label).string = showInfo
        }
    }
}
useBagGoodRobot.prototype = new CodeRobot()


function controllRobot(config,  linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)

    this.robotInit = (cb)=>{
        this.robotActive = true
        cc.assetManager.loadBundle('viewCode', (err, bundle) => {
            if (err) {
                cc.error(err, '加载viewCode失败');
                cb()
                return;
            }
            bundle.load('shoubin', cc.Prefab, (err, prefab)=> {
                if(prefab != null){
                    if(this.robotActive == false){
                        return
                    }
                    var hasFindShoubin = cc.find('Canvas').getChildByName('shoubin')
                    if(hasFindShoubin == null){
                        var shoubin = cc.instantiate(prefab)
                        shoubin.parent = cc.find('Canvas')
                        this.shoubin = shoubin
                    }else{
                        this.shoubin = hasFindShoubin
                    }
                    this.initShoubin()
                }
                cb()
            })
        });
    }

    this.initShoubin = ()=>{
        var controllH = false
        var controllV = false

        if(this.linkDatas.outputSolt['number1'] != null){
            var number1Arr = this.linkDatas.outputSolt['number1']
            if(number1Arr.length > 0){
                controllH = true
                var controllDirLeft = this.shoubin.getChildByName('controllDirLeft')
                controllDirLeft.active = true

                var controllDirRight = this.shoubin.getChildByName('controllDirRight')
                controllDirRight.active = true
            }
        }
        if(this.linkDatas.outputSolt['number2'] != null){
            var number2Arr = this.linkDatas.outputSolt['number2']
            if(number2Arr.length > 0){
                controllV = true
                var controllDirUp = this.shoubin.getChildByName('controllDirUp')
                controllDirUp.active = true

                var controllDirDown = this.shoubin.getChildByName('controllDirDown')
                controllDirDown.active = true
            }
        }
        
        var controllCircle = this.shoubin.getChildByName('controllCircle')
        var controllhand = this.shoubin.getChildByName('controllhand')


        var controllDirUp = this.shoubin.getChildByName('controllDirUp')
        var controllDirDown = this.shoubin.getChildByName('controllDirDown')
        var controllDirLeft = this.shoubin.getChildByName('controllDirLeft')
        var controllDirRight = this.shoubin.getChildByName('controllDirRight')
        

        var controllType = this.config.otherConfig.controllType.default
        if(controllType == 0){
            

            controllCircle.targetOff(this)
            controllhand.active = true
            controllCircle.on(cc.Node.EventType.TOUCH_START, (event)=>{
                cc.Tween.stopAllByTarget(controllhand)
                // controllhand.position = controllCircle.parent.convertToNodeSpaceAR(event.getLocation())
            }, this)

            controllCircle.on(cc.Node.EventType.TOUCH_MOVE, (event)=>{
                var pos = controllCircle.parent.convertToNodeSpaceAR(event.getLocation())
                if(pos.mag() > 55){
                    //超过圆的半径了
                    pos.normalizeSelf()
                    pos.mulSelf(55)
                }
                if(controllV == true){
                    controllhand.y = pos.y
                }
                if(controllH == true){
                    controllhand.x = pos.x
                }
                this.curPos = pos.div(55)
                if(this.config.otherConfig.modal.default == 0){
                    this.outputHandle(this.curPos.mul(this.config.otherConfig.outputScale.default))
                }
            }, this)
    
            controllCircle.on(cc.Node.EventType.TOUCH_END, (event)=>{
                cc.tween(controllhand).to(0.3, {x: 0, y: 0}).start()     
                this.curPos = null       
            }, this)
    
            controllCircle.on(cc.Node.EventType.TOUCH_CANCEL, (event)=>{
                cc.tween(controllhand).to(0.3, {x: 0, y: 0}).start()   
                this.curPos = null       
            }, this)
        }else{
            controllDirUp.targetOff(this)
            controllDirDown.targetOff(this)
            controllDirLeft.targetOff(this)
            controllDirRight.targetOff(this)


            if(controllV == true){
                controllDirUp.getComponent(cc.Button).interactable = true
                controllDirDown.getComponent(cc.Button).interactable = true
                controllDirUp.opacity = 235
                controllDirDown.opacity = 235
            }
           
            if(controllH == true){
                controllDirLeft.getComponent(cc.Button).interactable = true
                controllDirRight.getComponent(cc.Button).interactable = true
                controllDirLeft.opacity = 235
                controllDirRight.opacity = 235
            }

            controllDirUp.on(cc.Node.EventType.TOUCH_START, ()=>{
                this.curPos = cc.v2(0, 1)
                if(this.config.otherConfig.modal.default == 0){
                    this.outputHandle(this.curPos.mul(this.config.otherConfig.outputScale.default))
                }
            }, this)

            controllDirUp.on(cc.Node.EventType.TOUCH_CANCEL, ()=>{
                this.curPos = null    
            }, this)

            controllDirUp.on(cc.Node.EventType.TOUCH_END, ()=>{
                this.curPos = null    
            }, this)

            controllDirDown.on(cc.Node.EventType.TOUCH_START, ()=>{
                this.curPos = cc.v2(0, -1)
                if(this.config.otherConfig.modal.default == 0){
                    this.outputHandle(this.curPos.mul(this.config.otherConfig.outputScale.default))
                }
            }, this)

            controllDirDown.on(cc.Node.EventType.TOUCH_CANCEL, ()=>{
                this.curPos = null    
            }, this)

            controllDirDown.on(cc.Node.EventType.TOUCH_END, ()=>{
                this.curPos = null    
            }, this)

            controllDirLeft.on(cc.Node.EventType.TOUCH_START, ()=>{
                this.curPos = cc.v2(-1, 0)
                if(this.config.otherConfig.modal.default == 0){
                    this.outputHandle(this.curPos.mul(this.config.otherConfig.outputScale.default))
                }
            }, this)

            controllDirLeft.on(cc.Node.EventType.TOUCH_CANCEL, ()=>{
                this.curPos = null    
            }, this)

            controllDirLeft.on(cc.Node.EventType.TOUCH_END, ()=>{
                this.curPos = null    
            }, this)

            controllDirRight.on(cc.Node.EventType.TOUCH_START, ()=>{
                this.curPos = cc.v2(1, 0)
                if(this.config.otherConfig.modal.default == 0){
                    this.outputHandle(this.curPos.mul(this.config.otherConfig.outputScale.default))
                }
            }, this)

            controllDirRight.on(cc.Node.EventType.TOUCH_CANCEL, ()=>{
                this.curPos = null    
            }, this)

            controllDirRight.on(cc.Node.EventType.TOUCH_END, ()=>{
                this.curPos = null    
            }, this)
        }
    }

    this.activeControll = ()=>{
        // this.shoubin.resumeSystemEvents(true)
        this.initShoubin()
    }
    this.pauseControll = ()=>{
        // this.shoubin.pauseSystemEvents(true)
        var controllCircle = this.shoubin.getChildByName('controllCircle')
        controllCircle.targetOff(this)
        this.curPos = null
    }

    this.inputHandle = (inputData)=>{
        if(inputData.data == 0){
            this.pauseControll()
        }else{
            this.activeControll()
        }
    }


    this.robotUpdate = (dt)=>{
        if(this.config.otherConfig.modal.default == 1 && this.curPos != null){
            this.outputHandle(this.curPos.mul(dt * this.config.otherConfig.outputScale.default))
        }
    }

    this.outputHandle = (dir)=>{
        // cc.log('输出了', dir.x, dir.y)
        // if(GlobalConfig.recordMode == true){
        //     return
        // }
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            
        }, null, 1)
        if(this.linkDatas.outputSolt['number1']){
            var onelinkDatas = this.linkDatas.outputSolt['number1']
            for(var i = 0; i < onelinkDatas.length; i++){
                var onelinkData = onelinkDatas[i]
                onelinkData.robot.inputHandle({solt:onelinkData.solt, data: Number(dir.x.toFixed(2)), targetSolt: onelinkData.otherSolt})
            }
        }
        if(this.linkDatas.outputSolt['number2']){
            var onelinkDatas = this.linkDatas.outputSolt['number2']
            for(var i = 0; i < onelinkDatas.length; i++){
                var onelinkData = onelinkDatas[i]
                onelinkData.robot.inputHandle({solt:onelinkData.solt, data: Number(dir.y.toFixed(2)), targetSolt: onelinkData.otherSolt})
            }
        }
    }

    this.robotRelease = ()=>{
        this.robotActive = false
        if(this.shoubin != null && cc.isValid(this.shoubin) == true){
            this.shoubin.destroy()
            this.shoubin = null
        }
        CodeRobot.prototype.robotRelease.call(this)
    }
}
controllRobot.prototype = new CodeRobot()


function customButtonRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)

    this.robotPreview = ()=>{
        // console.log('customButtonRobot robotPreview')
        this.robotInit(()=>{

        })
    }

    this.robotInit = (cb)=>{
        this.robotRelease()
        this.robotActive = true
        cc.assetManager.loadBundle('viewCode', (err, bundle) => {
            if (err) {
                cc.error(err, '加载viewCode失败');
                cb()
                return;
            }
            bundle.load('clickBtn', cc.Prefab, (err, prefab)=> {
                if(prefab != null){
                    if(this.robotActive == false || this.shoubin != null){
                        return
                    }

                    var shoubin = cc.instantiate(prefab)
                    shoubin.parent = cc.find('Canvas')
                    if(this.config.otherConfig.keyName.default == 0){
                        shoubin.getChildByName('label').getComponent(cc.Label).string = this.config.otherConfig.customeName.default
                    }else{
                        shoubin.getChildByName('label').getComponent(cc.Label).string = this.config.otherConfig.keyName.chooses[this.config.otherConfig.keyName.default]
                    }
                    shoubin.scale = this.config.otherConfig.scale.default * 0.1

                    var widget = shoubin.getComponent(cc.Widget)
                    widget.isAlignTop = this.config.otherConfig.paddingTop.default != 0
                    widget.isAlignBottom = this.config.otherConfig.paddingBottom.default != 0

                    widget.isAlignLeft  = this.config.otherConfig.paddingLeft.default != 0
                    widget.isAlignRight  = this.config.otherConfig.paddingRight.default != 0

                    widget.top = this.config.otherConfig.paddingTop.default
                    widget.bottom = this.config.otherConfig.paddingBottom.default

                    if(widget.isAlignBottom == true){
                        widget.isAlignTop = false
                    }

                    if(widget.isAlignRight == true){
                        widget.isAlignLeft = false
                    }

                    widget.left = this.config.otherConfig.paddingLeft.default
                    widget.right = this.config.otherConfig.paddingRight.default
                    // console.log('isAlignTop', widget.isAlignTop, widget.isAlignBottom, widget.isAlignLeft,  widget.isAlignRight)

                    this.shoubin = shoubin
                }
                cb()
            })
        });
    }

    this.robotStart = ()=>{
        this.initShoubin()
    }

    this.freshOtherConfig = (config)=>{
        if(this.shoubin != null){
            var shoubin = this.shoubin
            var widget = shoubin.getComponent(cc.Widget)
            widget.isAlignTop = config.paddingTop.default != 0
            widget.isAlignBottom = config.paddingBottom.default != 0

            widget.isAlignLeft  = config.paddingLeft.default != 0
            widget.isAlignRight  = config.paddingRight.default != 0

            widget.top = config.paddingTop.default
            widget.bottom = config.paddingBottom.default

            if(widget.isAlignBottom == true){
                widget.isAlignTop = false
            }

            if(widget.isAlignRight == true){
                widget.isAlignLeft = false
            }

            widget.left = config.paddingLeft.default
            widget.right = config.paddingRight.default
            widget.updateAlignment()
            shoubin.scale = config.scale.default * 0.1
        }else{
            this.robotInit(()=>{

            })
        }
    }

    //当刷新时
    this.inRunFreshConfig = (key)=>{
        if(this.shoubin != null){
            this.freshOtherConfig(this.config.otherConfig)
        }
    }

    this.initShoubin = ()=>{
        this.shoubin.targetOff(this)
        this.shoubin.getComponent(cc.Button).enabled = true
        this.shoubin.on(cc.Node.EventType.TOUCH_START, ()=>{
            console.log('点击了按钮')
            this.outputHandle('touchStart')
        }, this)

        this.shoubin.on(cc.Node.EventType.TOUCH_END, ()=>{
            console.log('结束点击')
            this.outputHandle('touchEnd')
        }, this)

        this.shoubin.on(cc.Node.EventType.TOUCH_CANCEL, ()=>{
            console.log('取消点击')
            this.outputHandle('touchCancel')
        }, this)
    }

    this.activeControll = ()=>{
        this.shoubin.resumeSystemEvents(true)
    }
    this.pauseControll = ()=>{
        this.shoubin.pauseSystemEvents(true)
    }

    this.inputHandle = (inputData)=>{
        if(inputData.data == 0){
            this.pauseControll()
        }else{
            this.activeControll()
        }
    }

    this.outputHandle = (targetSolt)=>{
        // if(GlobalConfig.recordMode == true){
        //     return
        // }
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            //输出内容
        }, targetSolt, 1)
        
        if(this.linkDatas.outputSolt[targetSolt]){
            var onelinkDatas = this.linkDatas.outputSolt[targetSolt]
            for(var i = 0; i < onelinkDatas.length; i++){
                var onelinkData = onelinkDatas[i]
                onelinkData.robot.inputHandle({solt:onelinkData.solt, data: 1, targetSolt: onelinkData.otherSolt})
            }
        }
    }

    this.robotRelease = (withPreview, dontDestroy)=>{
        this.robotActive = false
        if(this.shoubin != null && cc.isValid(this.shoubin) == true){
            this.shoubin.destroy()
            this.shoubin = null
        }
        // if(withPreview == true){
        //     this.robotPreview()
        // }
        CodeRobot.prototype.robotRelease.call(this)
    }
}
customButtonRobot.prototype = new CodeRobot()


function leftOrRightActRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)

    this.robotInit = ()=>{
        cc.systemEvent.setAccelerometerEnabled(true);
        this.curState = 0
        this.x = 0
        this.y = 0
        this.z = 0
        return true
    }    

    this.robotStart = ()=>{
        cc.systemEvent.on(cc.SystemEvent.EventType.DEVICEMOTION, this.onChangeEvent, this);
    }

    this.inputHandle = (inputData)=>{
        //接收输入的参数
        if(inputData.data == 0){
            this.curState = 0
        }else{
            this.curState = 1
        }
    }

    this.robotUpdate = (dt)=>{
        if(this.config.otherConfig.modal.default == 1 && this.curState == 1){
            this.outputHandle(this.x * dt, this.y * dt, this.z * dt)
        }
    }

    //当切换事件
    this.onChangeEvent = (event)=>{
        this.x = event.acc.x
        this.y = event.acc.y
        this.z = event.acc.z

        if(this.config.otherConfig.modal.default == 0 && this.curState == 1){
            this.outputHandle(this.x, this.y, this.z)
        }
    }


    this.outputHandle = (x, y, z)=>{
        // cc.log(event);
        //用户的背包数据
        // CodeRobot.prototype.outputHandle.call(this, ()=>{
       
        // }, null, result)
        // if(GlobalConfig.recordMode == true){
        //     return
        // }
        if(this.codeProgress.codeRobotConfig.pause == 1){
            return
        }
        if(this.linkDatas.outputSolt['number1']){
            var onelinkDatas = this.linkDatas.outputSolt['number1']
            for(var i = 0; i < onelinkDatas.length; i++){
                var onelinkData = onelinkDatas[i]
                onelinkData.robot.inputHandle({solt:onelinkData.solt, data: x, targetSolt: onelinkData.otherSolt})
            }
        }
        if(this.linkDatas.outputSolt['number2']){
            var onelinkDatas = this.linkDatas.outputSolt['number2']
            for(var i = 0; i < onelinkDatas.length; i++){
                var onelinkData = onelinkDatas[i]
                onelinkData.robot.inputHandle({solt:onelinkData.solt, data: y, targetSolt: onelinkData.otherSolt})
            }
        }
        if(this.linkDatas.outputSolt['number3']){
            var onelinkDatas = this.linkDatas.outputSolt['number3']
            for(var i = 0; i < onelinkDatas.length; i++){
                var onelinkData = onelinkDatas[i]
                onelinkData.robot.inputHandle({solt:onelinkData.solt, data: z, targetSolt: onelinkData.otherSolt})
            }
        }
    }


    this.robotRelease = ()=>{
        cc.systemEvent.off(cc.SystemEvent.EventType.DEVICEMOTION, this.onChangeEvent, this);
        CodeRobot.prototype.robotRelease.call(this)
    }
}
leftOrRightActRobot.prototype = new CodeRobot()

//多层输入
function inputArrRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)

    this.robotInit = ()=>{
        return true
    }   
    
    this.inputHandle = (inputData)=>{
        // cc.log('我收到了inputData', inputData)
        if(this.config.otherConfig.modal.default == 1){
            //为克隆的源对象时阻断输出
            // cc.log("为克隆的源对象时阻断输出", this)
            return
        }else{
            // cc.log("不是克隆原对象可以输出", this)
        }
        this.outputHandle(inputData.data)
    }

    this.outputHandle = (data)=>{
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            var onelinkDatas = this.linkDatas.outputSolt['number']
            for(var i = 0; i < onelinkDatas.length; i++){
                var onelinkData = onelinkDatas[i]
                if(onelinkData.robot != null){
                    onelinkData.robot.inputHandle({solt:onelinkData.solt, data: data, targetSolt: onelinkData.otherSolt})
                }
            }
        }, null, data)
    }


    this.getLinkCodeNode = ()=>{
        var findCodeNode = null
        for(var key in this.instance.linkData.inputSolt){
            if(findCodeNode != null){
                break
            }
            var dropNode = this.instance.linkData.inputSolt[key]
            cc.director.emit('getLineBySolt', {soltid: dropNode.dot.uuid, dontAutoCreate: true, cb:(line)=>{
                if(line != null){
                    var bindRobot
                    if(line.endDrop.card == this.instance){
                        bindRobot = line.startDrop.card.robot
                    }else{
                        bindRobot = line.endDrop.card.robot
                    }
                    if(bindRobot.getLinkCodeNode != null){
                        findCodeNode = bindRobot.getLinkCodeNode()
                    }
                }
             }})
        }
        return findCodeNode
    }
}
inputArrRobot.prototype = new CodeRobot()


function outputArrRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)

    this.robotInit = ()=>{
        return true
    }
    
    this.inputHandle = (inputData)=>{
        // cc.log('我收到了inputData', inputData)
        if(this.config.otherConfig.modal.default == 1){
            //为克隆的源对象时阻断输出
            return
        }
        this.outputHandle(inputData.data)
    }

    this.outputHandle = (data)=>{
        var initKey = (key)=>{
            var onelinkDatas = this.linkDatas.outputSolt[key]
            // console.log('当前outputArr执行', key, onelinkDatas)
            if(onelinkDatas.length != 0){
                CodeRobot.prototype.outputHandle.call(this, ()=>{
                    for(var i = 0; i < onelinkDatas.length; i++){
                        var onelinkData = onelinkDatas[i]
                        onelinkData.robot.inputHandle({solt:onelinkData.solt, data: data, targetSolt: onelinkData.otherSolt})
                    }
                }, key, data)
            }
        }
        //这里要根据先前输入触发的是哪个入口index，输出就要输出哪个index
        for(var key2 in this.linkDatas.outputSolt){
            initKey(key2)
        }
    }
}
outputArrRobot.prototype = new CodeRobot()



function outputLineRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)

    this.robotInit = ()=>{
        return true
    }
    
    this.inputHandle = (inputData)=>{
        // cc.log('我收到了inputData', inputData)
        this.outputHandle('output' + inputData.data, 1)
    }

    this.outputHandle = (key,data)=>{
        //这里要根据先前输入触发的是哪个入口index，输出就要输出哪个index
        var onelinkDatas = this.linkDatas.outputSolt[key]
        if(onelinkDatas == null){
            return
        }
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            for(var i = 0; i < onelinkDatas.length; i++){
                var onelinkData = onelinkDatas[i]
                onelinkData.robot.inputHandle({solt:onelinkData.solt, data: data, targetSolt: onelinkData.otherSolt})
            }
        }, key, data)
    }
}
outputLineRobot.prototype = new CodeRobot()



function linkArrRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)

    this.robotInit = ()=>{
        return true
    }
    
    this.inputHandle = (inputData)=>{
        // cc.log('我收到了inputData', inputData)
        // cc.log('this.linkDatas', this.linkDatas)
        this.outputHandle('output' + inputData.targetSolt[inputData.targetSolt.length - 1], inputData.data)
    }

    this.outputHandle = (targetSolt, data)=>{
        if(this.linkDatas.outputSolt[targetSolt] == null){
            console.warn('没有对应的输出节点')
            return
        }
        //这里要根据先前输入触发的是哪个入口index，输出就要输出哪个index
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            var onelinkDatas = this.linkDatas.outputSolt[targetSolt]
            for(var i = 0; i < onelinkDatas.length; i++){
                var onelinkData = onelinkDatas[i]
                onelinkData.robot.inputHandle({solt:onelinkData.solt, data: data, targetSolt: onelinkData.otherSolt})
            }
        }, targetSolt, data)
    }
}
linkArrRobot.prototype = new CodeRobot()


function lightingRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)

    this.robotInit = ()=>{
        return true
    }
    
    this.inputHandle = (inputData)=>{
        // cc.log('我收到了inputData', inputData)
        // cc.log('this.linkDatas', this.linkDatas)
        var linkArr = this.linkDatas.outputSolt['output0']
        if(linkArr.length > 0){
            var linkRobot = linkArr[0].robot
            if(linkRobot.config.otherConfig[inputData.targetSolt] != null){
                linkRobot.config.otherConfig[inputData.targetSolt].default = inputData.data
                if(linkRobot.inRunFreshConfig != null){
                    //调用一下动态更新配置的方法
                    linkRobot.inRunFreshConfig(inputData.targetSolt)
                }
            }
            if(linkRobot.config.key == 'exportObject'){
                if(linkRobot.codeNode != null){
                    linkRobot.codeNode[inputData.targetSolt] = inputData.data
                }
            }
        }
        // this.outputHandle('output' + inputData.targetSolt[inputData.targetSolt.length - 1], inputData.data)
    }

    this.outputHandle = (targetSolt, data)=>{
        if(this.linkDatas.outputSolt[targetSolt] == null){
            console.warn('没有对应的输出节点')
            return
        }
        //这里要根据先前输入触发的是哪个入口index，输出就要输出哪个index
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            var onelinkDatas = this.linkDatas.outputSolt[targetSolt]
            for(var i = 0; i < onelinkDatas.length; i++){
                var onelinkData = onelinkDatas[i]
                onelinkData.robot.inputHandle({solt:onelinkData.solt, data: data, targetSolt: onelinkData.otherSolt})
            }
        }, targetSolt, data)
    }


    this.onCardSelect = ()=>{
        var data = this.getLinkData()
        // console.log('我获取到了数据应该更新节点', data)
        if(data != null && data instanceof Object){
            var keys = []
            for(var key in data){
                if(data[key].type == 'config' || data[key].type == 'tipsInfo' || data[key].single == true){

                }else{
                    keys.push(key)
                }
            }
            if(this.config.otherConfig.inputSoltInfo.default.length == 0){
                this.config.otherConfig.inputSoltCount.default = keys.length
                this.config.otherConfig.inputSoltInfo.default = keys
                this.instance.freshOtherConfig()
            }
        }else{
            this.config.otherConfig.inputSoltCount.default = 0
            this.config.otherConfig.inputSoltInfo.default = []
            this.instance.freshOtherConfig()
        }
    }
    
     //获取绑定的data
    this.getLinkData = ()=>{
        var dropNode = this.instance.linkData.outputSolt['output0']
        var bindRobotConfig = null
        var robot = null

        if(dropNode != null){
            cc.director.emit('getLineBySolt', {soltid: dropNode.dot.uuid, dontAutoCreate: true, cb:(line)=>{
                if(line != null){
                    if(line.endDrop.card == this.instance){
                        robot = line.startDrop.card.robot
                    }else{
                        robot = line.endDrop.card.robot
                    }
                }
            }})
        }
        if(robot != null){
            if(robot.config.key == 'exportObject'){
                bindRobotConfig = {name: {}, src: {}, customeName: {}, premulAlpha: {}, x: {}, y:{}, realX:{}, realY:{}, scaleX:{}, scaleY:{}, width:{}, height:{}, opacity:{}, angle:{}, angleToPos:{}, radius:{}, center:{}, zIndex:{}, active:{}, parent:{}, zoomRatio:{}, fontSize:{}, string:{}, anchorX:{}, anchorY:{}, color:{}, outLineColor:{}, outLineWidth:{}, inMapMap:{}, girdX:{}, girdY:{}, widthGird:{}, heightGird:{}}
            }else{
                bindRobotConfig = robot.config.otherConfig
            }
        }
        return bindRobotConfig
    }
}
lightingRobot.prototype = new CodeRobot()


function lightingOutRobot(config, linkDatas, instance){
    CodeRobot.call(this, config, linkDatas, instance)

    this.robotInit = ()=>{
        return true
    }
    
    this.inputHandle = (inputData)=>{
        // cc.log('我收到了inputData', inputData)
        // cc.log('this.linkDatas', this.linkDatas)
        var bindRobot = this.linkDatas.cardexSolt[0]
        if(bindRobot != null){
            bindRobot = bindRobot.robot
            for(var key in this.linkDatas.outputSolt){
                var value = 0
                if(bindRobot.config.key == 'exportObject' || bindRobot.config.key == 'createObject'){
                    if(bindRobot.codeNode != null){
                        value = bindRobot.codeNode[key]
                    }
                }else{
                    value = bindRobot.config.otherConfig[key].default
                }
                this.outputHandle(key, value)
            }
        }
        // this.outputHandle('output' + inputData.targetSolt[inputData.targetSolt.length - 1], inputData.data)
    }

    this.outputHandle = (targetSolt, data)=>{
        if(this.linkDatas.outputSolt[targetSolt] == null){
            console.warn('没有对应的输出节点')
            return
        }
        //这里要根据先前输入触发的是哪个入口index，输出就要输出哪个index
        CodeRobot.prototype.outputHandle.call(this, ()=>{
            var onelinkDatas = this.linkDatas.outputSolt[targetSolt]
            for(var i = 0; i < onelinkDatas.length; i++){
                var onelinkData = onelinkDatas[i]
                onelinkData.robot.inputHandle({solt:onelinkData.solt, data: data, targetSolt: onelinkData.otherSolt})
            }
        }, targetSolt, data)
    }


    this.onCardSelect = ()=>{
        var data = this.getLinkData()
        // console.log('我获取到了数据应该更新节点', data)
        if(data != null && data instanceof Object){
            var keys = []
            for(var key in data){
                if(data[key].type == 'config' || data[key].type == 'tipsInfo' || data[key].single == true){

                }else{
                    keys.push(key)
                }
            }
            if(this.config.otherConfig.outputSoltInfo.default.length == 0){
                this.config.otherConfig.outputSoltCount.default = keys.length
                this.config.otherConfig.outputSoltInfo.default = keys
                this.instance.freshOtherConfig()
            }
        }else{
            this.config.otherConfig.outputSoltCount.default = 0
            this.config.otherConfig.outputSoltInfo.default = []
            this.instance.freshOtherConfig()
        }
    }
    
     //获取绑定的data
    this.getLinkData = ()=>{
        var dropNode = this.instance.getSoltDropNodeByKey("cardexSolt")
        var bindRobotConfig = null
        var robot = null

        if(dropNode != null){
            cc.director.emit('getLineBySolt', {soltid: dropNode.dot.uuid, dontAutoCreate: true, cb:(line)=>{
                if(line != null){
                    if(line.endDrop.card == this.instance){
                        robot = line.startDrop.card.robot
                    }else{
                        robot = line.endDrop.card.robot
                    }
                }
            }})
        }
        if(robot != null){
            if(robot.config.key == 'exportObject'){
                bindRobotConfig = {name: {}, src: {}, customeName: {}, premulAlpha: {}, x: {}, y:{}, realX:{}, realY:{}, scaleX:{}, scaleY:{}, width:{}, height:{}, opacity:{}, angle:{}, angleToPos:{}, radius:{}, center:{}, zIndex:{}, active:{}, parent:{}, zoomRatio:{}, fontSize:{}, string:{}, anchorX:{}, anchorY:{}, color:{}, outLineColor:{}, outLineWidth:{}, inMapMap:{}, girdX:{}, girdY:{}, widthGird:{}, heightGird:{}}
            }else{
                bindRobotConfig = robot.config.otherConfig
            }
        }
        return bindRobotConfig
    }
}
lightingOutRobot.prototype = new CodeRobot()


var ExportClass = {
    CodeRobot: CodeRobot,
    valueRobot: valueRobot,
    valueStringRobot: valueStringRobot,
    gameStartRobot: gameStartRobot,
    customButtonRobot: customButtonRobot,
    addRobot: addRobot,
    delRobot: delRobot,
    xRobot: xRobot,
    chuRobot: chuRobot,
    absRobot: absRobot,
    lengthRobot: lengthRobot,
    revertNegativeRobot: revertNegativeRobot,
    squareRootRobot: squareRootRobot,
    notRightRobot: notRightRobot,
    allRightRobot: allRightRobot,
    litterRobot: litterRobot,
    equireRobot: equireRobot,
    biggerRobot: biggerRobot,
    orRightRobot:orRightRobot,
    tointRobot: tointRobot,
    upCountRobot: upCountRobot,
    mappingRobot: mappingRobot,
    showTextTipRobot: showTextTipRobot,
    consoleInfoRobot: consoleInfoRobot,
    showConfirmRobot: showConfirmRobot,
    timeDownRobot: timeDownRobot,
    randomNumRobot: randomNumRobot,
    sendDataRobot: sendDataRobot,
    acceptDataRobot: acceptDataRobot,
    writeNoteRobot:writeNoteRobot,
    stopTimeRobot: stopTimeRobot,
    timeScaleRobot: timeScaleRobot,
    vibrateRobot: vibrateRobot,
    soundRobot: soundRobot,
    animateRobot: animateRobot,
    tweenRobot:tweenRobot,
    bezierCurveRobot: bezierCurveRobot,
    createObjectRobot: createObjectRobot,
    spaceRobot: spaceRobot,
    endGameRobot: endGameRobot,
    restartGameRobot: restartGameRobot,
    changeGameRobot: changeGameRobot,
    changeGameGameRobot: changeGameGameRobot,
    cameraRobot: cameraRobot,
    touchStartRobot: touchStartRobot,
    touchMoveRobot: touchMoveRobot,
    touchEndRobot: touchEndRobot,
    checkTagRobot: checkTagRobot,
    exportObjectRobot: exportObjectRobot,
    positionRobot: positionRobot,
    angleRobot: angleRobot,
    speedRobot: speedRobot,
    showHandTipRobot: showHandTipRobot,
    vectorToAngelRobot: vectorToAngelRobot,
    angleConvertVectorRobot: angleConvertVectorRobot,
    angleDifferenceRobot: angleDifferenceRobot,
    connectionRobot: connectionRobot,
    layoutExRobot: layoutExRobot,
    girdMapRobot: girdMapRobot,
    screenSizeRobot: screenSizeRobot,
    contactRobot: contactRobot,
    CaiDanComponentRobot: CaiDanComponentRobot,
    CaiDanComponent2Robot: CaiDanComponent2Robot,

    DynamicTextureRobot: DynamicTextureRobot,
    AnyMaskRobot: AnyMaskRobot,
    MotionTextRobot: MotionTextRobot,
    DrawComponentRobot: DrawComponentRobot,
    ChatComponentRobot: ChatComponentRobot,
    VoiceCheckRobot: VoiceCheckRobot,
    SpinePlusComponentRobot: SpinePlusComponentRobot,
    ProgressCompomentRobot:ProgressCompomentRobot,
    AngleCompomentRobot:AngleCompomentRobot,
    ScaleObjRobot:ScaleObjRobot,
    AutoTipsRobot: AutoTipsRobot,
    controllRobot: controllRobot,
    systemDataRobot: systemDataRobot,
    setDataRobot: setDataRobot,
    handDataRobot: handDataRobot,
    customDataRobot: customDataRobot,
    userDataRobot: userDataRobot,
    addBagGoodRobot: addBagGoodRobot,
    useBagGoodRobot: useBagGoodRobot,
    leftOrRightActRobot: leftOrRightActRobot,
    inputArrRobot: inputArrRobot,
    outputArrRobot: outputArrRobot,
    outputLineRobot: outputLineRobot,
    linkArrRobot: linkArrRobot,
    dataObjectRobot: dataObjectRobot,
    getKeyValueRobot: getKeyValueRobot,
    inRangeRobot: inRangeRobot,
    lightingRobot: lightingRobot,  
    scrollRectRobot: scrollRectRobot,
    blockTouchRobot: blockTouchRobot,
    lightingOutRobot: lightingOutRobot,
    BaseScriptRobot: BaseScriptRobot,
    InGirdMapAIRobot: InGirdMapAIRobot,
    textCodeRobot: textCodeRobot
}

export default ExportClass