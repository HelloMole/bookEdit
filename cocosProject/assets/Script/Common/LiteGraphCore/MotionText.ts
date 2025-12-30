// import BaseStoryScene from "../../../script/story/BaseStoryScene";
// import { EventCenter } from "../../../script/UIFrame/EventCenter";
// import { EventConst } from "../../../script/logic/EventConst";

// import GlobalConfig from "../../../script/logic/GlobalConfig";

// const {ccclass, property, menu} = cc._decorator;

//使用方式
//该脚本挂载到页面prefab根结点上，并且物体类型设置为Label，或者Node节点需要添加Label

//为0时关闭并恢复到motionText
//this.node.getComponent('MotionText').inputHandle({data: 0})

//为1时播放（如果已经在播放状态则为重新播放）
//this.node.getComponent('MotionText').inputHandle({data: 1})

// @ccclass
// @menu('自定义组件/MotionText')
export default class MotionText extends cc.Component {
    // LIFE-CYCLE CALLBACKS:

    //初始化完成后自动bof
    // @property({ type: Boolean })
    public autoRun = false

    // @property({ type: Boolean })
    public pause = false

    // @property({ type: Number })
    public curTime = 0

    // @property({ type: Boolean })
    public isActive = false

    // @property({ type: String })
    public position = '0,0.6,1'

    // @property({ type: String })
    public positionTime = '0,1.4,2'

    // @property({ type: Boolean })
    public hideBaseLabel = false

    // @property({ type: Boolean })
    public hideBeforRun = false

    // @property({ type: Boolean })
    public hideAfterRun = false

    private positionTimeArr = []
    private positionArr = []

    // @property({ type: Number })
    public dotIndex = 1

    // @property({ type: Number })
    public delay = 0

    // @property({ type: String })
    public maskColor = '88BF3D'

    // @property({ type: Boolean })
    public stopIsPlayEnd = false

    //方向
    // @property({ type: Number })
    public dir = 0

    private oriOpacity = 255
    private hasInit = false

    onLoad () {
        // console.log('motionText onLoad')
        // if(GlobalConfig.recordMode == true){
        //     //录音模式不开启字幕
        //     this.node.active = false
        // }
        if(this.node.getComponent('CodeNode') == null && this.node.getComponent('CodeNodeLg') == null){
            //常规脚本OnLoad时候即可初始化
            // console.log('motionText在onload就初始化了')
            this.init()
            this.addEventListener()
        }
    }

    

    protected init(): void {
        if(this.hasInit == true){
            // console.log('motionText 已经初始化，不重复init')
            return
        }
        // console.log('motionText init', this.node.name + ':' + this.node.opacity)
        this.oriOpacity = this.node.opacity

        this.node.anchorX = 0
        
        var childLabel = new cc.Node()
        var childLabelCom = childLabel.addComponent(cc.Label)

        var selfLabel = this.node.getComponent(cc.Label)
        childLabelCom.font = selfLabel.font
        childLabelCom.fontSize = selfLabel.fontSize
        // childLabel.anchorX = selfLabel.node.anchorX
        // childLabel.anchorY = selfLabel.node.anchorY
        childLabelCom.string = selfLabel.string
        childLabelCom.lineHeight = selfLabel.lineHeight
        childLabelCom.overflow = selfLabel.overflow
        childLabelCom.enableBold = selfLabel.enableBold
        childLabelCom.enableItalic = selfLabel.enableItalic
        childLabelCom.enableUnderline = selfLabel.enableUnderline
        childLabelCom.horizontalAlign = selfLabel.horizontalAlign
        childLabelCom.verticalAlign = selfLabel.verticalAlign

        if(this.hideBaseLabel == true){
            this.scheduleOnce(()=>{
                selfLabel.enabled = false
            }, 0)
        }
        
        var selfLabelOutLine = this.node.getComponent(cc.LabelOutline)
        if(selfLabelOutLine != null){
            var labelOutLine = childLabel.addComponent(cc.LabelOutline)
            labelOutLine.width = selfLabelOutLine.width
            labelOutLine.color = selfLabelOutLine.color
        }

        var maskNode = new cc.Node()
        // maskNode.anchorX = this.node.anchorX
        // maskNode.anchorY = this.node.anchorY
        //maskNode是颜色过渡方向，
        //横向文本固定从左到右
        //竖线文本固定从上到下
        if(this.dir == 0){
            maskNode.anchorX = 0
            maskNode.anchorY = 0.5
        }else{
            maskNode.anchorX = 0.5
            maskNode.anchorY = 1
        }
        var mask = maskNode.addComponent(cc.Mask)

        maskNode.parent = this.node
        childLabel.parent = maskNode

        // maskNode.x = 0
        // maskNode.y = 0
        maskNode.width = this.node.width
        maskNode.height = this.node.height
        //有时候高度不会立马更新
        this.scheduleOnce(()=>{
            childLabel.width = this.node.width
            childLabel.height = this.node.height
            //mask节点根据上一个节点的anchor设置位置
            if(this.dir == 0){
                maskNode.width = 0
                maskNode.height = this.node.height
                //如果出现左右没对齐，大概率是这里的问题
                maskNode.x = -1 * this.node.width * this.node.anchorX
                 //如果出现上下没对齐，大概率是这里的问题
                maskNode.y = this.node.height * (0.5 - this.node.anchorY)
            }else{
                maskNode.y = this.node.height * (1 - this.node.anchorY)
                //如果出现上下没对齐，大概率是这里的问题
                maskNode.x = 0
                maskNode.width = this.node.width
                maskNode.height = 0
            }
        }, 0)


        childLabel.anchorX = maskNode.anchorX
        childLabel.anchorY = maskNode.anchorY

        childLabel.y = 0
        childLabel.x = 0

        this.positionTimeArr = this.positionTime.split(',')
        this.positionArr = this.position.split(',')

        // console.log('positionTimeArr', this.positionTimeArr, this.positionArr)

        if(this.dir == 0)
        {
            this.node.children[0].width = Number(this.positionArr[0])
        }else
        {
            this.node.children[0].height = Number(this.positionArr[0])
        }

        if(this.hideBeforRun == true){
            this.node.opacity = 1
        }

        childLabel.color = cc.Color.WHITE.fromHEX(this.maskColor)

        // setTimeout(() => {
        //     console.log('当前label尺寸', this.node.width, this.node.height)
        //     console.log('生成的蒙皮尺寸', maskNode.width, maskNode.height)
        //     console.log('生成的过渡label尺寸', childLabel.width, childLabel.height)
        // }, 1000);
        if(this.autoRun == true){
            this.inputHandle({data: 1})
        }
        this.hasInit = true
    }


    //重置时间
    // this.node.getComponent('AutoTips').inputHandle({data: 1, targetSolt: 'resetTime'})
    public inputHandle(inputData){
        //接收输入的参数，输入0时关闭，不为0时开启
        // console.log('motionText inputHandle', inputData)
        if(inputData.targetSolt == 'hide'){
            this.hide()
            return
        }
        if(inputData.data == 0){
            // console.log("关闭字幕")
            this.isActive = false
            this.stopRun()
            return
        }
        // console.log("激活字幕", this.positionTime, this.positionTimeArr, this.position, this.positionArr)
       
        this.isActive = true
        this.curTime = 0
        this.dotIndex = 1
        if(this.dir == 0)
        {
            this.node.children[0].width = Number(this.positionArr[0])
        }else
        {
            this.node.children[0].height = Number(this.positionArr[0])
        }

        cc.Tween.stopAllByTarget(this.node)

        if(this.hideBeforRun == true){
            this.node.opacity = 1
            cc.tween(this.node).to(0.4, {opacity: this.oriOpacity}).start()
        }
        this.scheduleOnce(()=>{
            // console.log('开始播放字幕', this.node.getComponent(cc.Label).string)
            this.startRun()
        }, 0)
    }

    // public outputHandle = (key , data)=>{
    //     // this.outputHandle('onclick', 1)
    // }
    
    stopRun(){
        // console.log('motionText this.hasInit', this.hasInit, this.oriOpacity)
        if(this.hasInit == false){
            // console.log("motionText 都没有初始化，不要继续执行了 stopRun")
            return
        }
        cc.Tween.stopAllByTarget(this.node.children[0])
        if(this.dir == 0)
        {
            // if(this.stopIsPlayEnd != true){
            // }else{
            //     this.node.children[0].width = this.node.width
            // }
            this.node.children[0].width = Number(this.positionArr[0])
        }else
        {
            this.node.children[0].height = Number(this.positionArr[0])
            // if(this.stopIsPlayEnd != true){
                
            // }else{
            //     this.node.children[0].height = this.node.height
            // }
        }
        if(this.stopIsPlayEnd == true){
            if(this.node.oriColor == null){
                this.node.oriColor = this.node.color.toHEX("#rrggbb")
            }
            this.node.color = cc.Color.WHITE.fromHEX(this.maskColor);
        }
        // console.log('motionText this.stopIsPlayEnd', this.stopIsPlayEnd, this.positionArr)

        if(this.hideBeforRun == true){
           cc.Tween.stopAllByTarget(this.node)
           this.node.opacity = 1
        }
        // console.log('字幕stopRun', this.node.getComponent(cc.Label).string)
    }

    hide(){
        cc.Tween.stopAllByTarget(this.node)
        cc.tween(this.node).to(0.4, {opacity: 0}).start()
    }

    startRun(){
        if(this.node.oriColor != null){
            this.node.color = cc.Color.WHITE.fromHEX(this.node.oriColor);
        }

        var width = this.positionArr[this.dotIndex]
        var obj = {}
        if(this.dir == 0)
        {
            obj = {width: width * this.node.width}
        }else
        {
            obj = {height: width * this.node.height}
        }
        var time = this.positionTimeArr[this.dotIndex] - this.positionTimeArr[this.dotIndex - 1]

        console.log('motionText startRun', this.dotIndex, this.node.width ,this.delay, this.positionArr.join(','), obj)
        if(time < 0){
            //时间不应该为0了吧
            time = 0.1
            console.warn('时间点错误，后面的时间点小于前面的，自动设置为0.1', time)
        }
        cc.Tween.stopAllByTarget(this.node.children[0])
        cc.tween(this.node.children[0]).delay(this.delay).to(time, obj).call(()=>{
            if(this.positionArr[this.dotIndex + 1] != null){
                this.dotIndex += 1
                this.startRun()
            }else{
                //正常播放结束的话
                if(this.outputHandle != null){
                    this.outputHandle('onend', 1)
                }
                // console.log('是否播放结束了', this.node.getComponent(cc.Label).string, this.hideAfterRun)
                if(this.hideAfterRun == true){
                    cc.tween(this.node).to(0.4, {opacity: 0}).start()
                }
            }
        }).start()
    }


    addEventListener(){
        cc.game.targetOff(this)
        cc.game.on('replayPage', ()=>{
            if(this.dir == 0)
            {
                this.node.children[0].width = Number(this.positionArr[0])
            }else
            {
                this.node.children[0].height = Number(this.positionArr[0])
            }

            if(this.hideBeforRun == true){
                this.node.opacity = 1
            }else{
                this.node.opacity = this.oriOpacity
            }
            if(this.autoRun == true){
                this.inputHandle({data: 1})
            }
        }, this)

        cc.game.on('pause', ()=>{
            this.robotPause()
        }, this)

        cc.game.on('resume', ()=>{
            this.robotResume()
        }, this)
    }

    robotStart(){
        if(this.node == null){
            console.warn('当前没有node', this)
            return
        }
        if(this.node.children[0] == null){
            this.init()
        }else{
            this.stopRun()
            if(this.autoRun == true){
                this.inputHandle({data: 1})
            }
        }
        this.addEventListener()
    }

    robotRelease(){
        this.pause =false
        cc.game.targetOff(this)
        if(cc.isValid(this.node)){
            cc.Tween.stopAllByTarget(this.node.children[0])
            cc.Tween.stopAllByTarget(this.node)
        }
    }

    robotPause(){
        this.pause = true
        cc.director.getActionManager().pauseTarget(this.node.children[0]);
    }
    robotResume(){
        this.pause = false
        cc.director.getActionManager().resumeTarget(this.node.children[0]);
    }

    // update (dt) {
    //     if(this.pause == true){
    //         return
    //     }
    //     if(this.isActive == false){
    //         return
    //     }
    // }

    protected onDestroy(): void {
        cc.game.targetOff(this)
        // EventCenter.targetOff(this);
    }
}
