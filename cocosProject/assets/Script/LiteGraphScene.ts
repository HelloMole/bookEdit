import {LGraph} from './Common/litegraph/litegraph'

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    @property({ type: cc.Asset })
    public graphJson: cc.Asset = null;
    

    onLoad () {
        console.log('graphJson', this.graphJson)
        this.loadGraph()
    }

    start () {

    }

    async loadGraph(){
        let graph = new LGraph();
        let realGraphData = this.graphJson.json.policyList[0].graphJson
        graph.configure(realGraphData)
        graph.vars.rootccNode = this.node //设置根节点

        // let autoRunNodes = graph.findNodesByType('output/autoRunRecordTouch')
        // let autoRunNode = autoRunNodes[0]
        
        // this.scheduleOnce(()=>{
        //     if(autoRunNode != null){
        //         // console.log('graph rootccNode', graph.vars.rootccNode, this.btn_playMode.node.children[1].active)
        //         autoRunNode.setProperty('active', true)
        //     }
        // }, 0)

        await graph.init()  //这里只进行初始化
        graph.start()   //直接运行。不等到翻页运行
        this.graph = graph
    }


    resume(): void {
        // this.codeProgress.resume()
        console.log('LiteGraphScene resume')
        if(this.graph != null){
            this.graph.resume()
        }
        // super.resume()
    }

    pause(): void {
        // this.codeProgress.pause()
        console.log('LiteGraphScene pause')
        // super.pause()
        if(this.graph != null){
            this.graph.pause()
        }
    }

    
    stop(): void {
        // this.codeProgress.pause()
        console.log('LiteGraphScene stop')
        // super.pause()
        if(this.graph != null){
            this.graph.stop()
        }
    }

    clear(){
        // if(this.codeProgress != null){
        //     console.log('LiteGraphScene  onRelease',  this.codeProgress.jsonName)
        //     this.codeProgress.resume()  //恢复暂停后再释放，因为如果之前调用了暂停，再replay的话，直接默认是播放状态，就会出现动画等东西还是暂停状态
        //     this.codeProgress.release(false, dontDestroy)
        // }
        if(this.graph != null){
            this.graph.clear()
        }
    }

    // update (dt) {}
}
