// import BaseStoryScene from "../../../script/story/BaseStoryScene";
// import { EventCenter } from "../../../script/UIFrame/EventCenter";
// import { EventConst } from "../../../script/logic/EventConst";

// const {ccclass, property, menu} = cc._decorator;

//使用方式
//该脚本挂载到页面prefab根结点上

//为0时关闭
//this.node.getComponent('AutoTips').inputHandle({data: 0})

//为1时开启
//this.node.getComponent('AutoTips').inputHandle({data: 1})

//重置计时等待
//this.node.getComponent('AutoTips').inputHandle({data: 1, targetSolt: 'resetTime'})

// @ccclass
// @menu('自定义组件/AutoTips')
export default class AutoTips extends cc.Component {

    // @property({ type: String })
    public quesionYuyin = ''

    // @property({ type: Number })
    public waitTime = 10

    // @property({ type: Number })
    public yuyinTime = 0

    // @property({ type: Number })
    public curWaitTime = 0

    // @property({ type: Boolean })
    public isActive = false

    // @property({ type: Boolean })
    public pause = false

    public curPlayAudioId = -1

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // this.inputHandle({data: 1})
        // if(this.node.getComponent('CodeNode') == null){
        //     this.addEventListener()
        // }
    }

    start () {

    }

    addEventListener(){
        cc.game.targetOff(this)
        // EventCenter.targetOff(this)

        cc.game.on('clickCaidan', this.robotPause, this);
        // EventCenter.on(EventConst.HIDDEN_BUTTON, (type)=>{
        //     if(type == 4){
        //         this.robotResume()
        //     }
        // }, this);
    }

    //关闭提示
    // this.node.getComponent('AutoTips').inputHandle({data: 0})

    //开启提示
    // this.node.getComponent('AutoTips').inputHandle({data: 1})

    //重置时间
    // this.node.getComponent('AutoTips').inputHandle({data: 1, targetSolt: 'resetTime'})
    public inputHandle = (inputData)=>{
        //接收输入的参数，输入0时关闭，不为0时开启
        if(inputData.targetSolt == 'resetTime'){
            
            if(inputData.data == 1){
                console.log("重置提示")
                this.curWaitTime = this.waitTime
                cc.audioEngine.stop(this.curPlayAudioId)
            }
        }else{
            if(inputData.data == 0){
                console.log("关闭提示")
                this.curWaitTime = -1
                this.isActive = false
    
                if(this.curPlayAudioId != -1 && this.curPlayAudioId != null){
                    cc.audioEngine.stop(this.curPlayAudioId)
                }
    
                // if(this.codeProgress != null){
                //     var curYingui = this.codeProgress.codeRobotConfig.audioArray[2]
                //     if(curYingui != null){
                //         curYingui.robotRelease()
                //     }
                // }
                return
            }
            console.log("开启提示")
            if(this.waitTime < 1){
                this.waitTime = 1
            }
            this.isActive = true
            this.curWaitTime = this.waitTime
        }
    }

    async playTips (){
        // var storyScene =  this.node.getComponent(BaseStoryScene)
        
        // var codeProgress = this.codeProgress 
        // if(storyScene != null){
        //     var audioid = await storyScene.playAudio(this.quesionYuyin, false, true)
        //     this.curPlayAudioId = audioid
        //     this.curWaitTime = this.waitTime
        // }else if(codeProgress != null){
        //     codeProgress.playSounds([this.quesionYuyin], ()=>{
        //     }, 2)
        //     this.curWaitTime = this.waitTime
        // }


        //网页编辑模式专用
        this.codeProgress.playSounds([this.quesionYuyin], ()=>{
            
        }, 2)
        this.curWaitTime = this.waitTime
    }

    // public outputHandle = (key , data)=>{
    //     // this.outputHandle('onclick', 1)
    // } 
    robotStart(){
        this.curWaitTime = -1
        this.isActive = false
        this.pause =false
        // this.addEventListener()
    }

    robotRelease(){
        this.curWaitTime = -1
        this.isActive = false
        this.pause =false
        cc.game.targetOff(this)
        // EventCenter.targetOff(this)
    }

    robotPause(){
        this.pause = true
    }
    robotResume(){
        this.pause = false
    }

    update (dt) {
        if(this.pause == true){
            return
        }
        if(this.isActive == false){
            return
        }
        if(this.curWaitTime > 0){
            this.curWaitTime -= dt
            //console.log('当前等时间', this.curWaitTime.toFixed(2))
            if(this.curWaitTime < 0){
                //触发语音提示
                this.playTips()
            }
        }
       
    }

    protected onDestroy(): void {
        cc.game.targetOff(this)
        // EventCenter.targetOff(this);
    }
}
