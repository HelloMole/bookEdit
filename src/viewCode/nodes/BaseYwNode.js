import {LiteGraph, LGraphNode} from '../../litegraph/litegraph'
import * as CocosMgr from '../CocosMgr';

export class BaseYWNode extends LGraphNode{
    title = "自定义LGraphNode基础类"
    desc = "其余LGraphNode继承于此"

    constructor() {
        super()
    }

    onAdded(){
        this.sendAddEvent()
    }

    onRemoved(){
        this.sendRemoveEvent()
    }

    onSelected(){
        this.sendOtherEvent('onSelected')
    }

    onDeselected(){
        this.sendOtherEvent('onDeselected')
    }

    onConnectInput(inputIndex, outPutType, output, linkedNode, outputIndex){
        this.sendConnectEvent(inputIndex, linkedNode, outputIndex)
    }

    disconnectInput(slot, keepReroutes){
        this.sendDisConnectEvent(slot, keepReroutes)
        super.disconnectInput(slot, keepReroutes)
    }

    onPropertyChanged(property, value, oldValue){
        this.sendPropertyChangeEvent(property, value, oldValue)
    }

    //graph每次直接发布就好了，现在的操作是对cocos节点的操作进行同步
    sendPropertyChangeEvent(property, value, oldValue){
        if(this.graph == null){
            return
        }
        if(CocosMgr.isSinglePreview != true){
            // 发送数据变化事件
            if(window.channel != null){
                let datas = JSON.parse(JSON.stringify({id: this.id, property: property, value: value}))
                window.channel.postMessage({type: 'nodeEvent', func: 'onPropertyChanged', datas: datas })
            }
        }
    }

    //组件的按钮点击时同步事件
    sendBtnWidgetClickEvent(buttonName){
        if(this.graph == null){
            return
        }
        if(CocosMgr.isSinglePreview != true){
            // 发送数据变化事件
            if(window.channel != null){
                let datas = JSON.parse(JSON.stringify({id: this.id, buttonName: buttonName}))
                window.channel.postMessage({type: 'nodeEvent', func: 'onBtnWidgetClick', datas: datas})
            }
        }
    }

    //发送移除事件
    sendRemoveEvent(){
        if(this.graph == null){
            return
        }
        if(CocosMgr.isSinglePreview != true){
            // 发送数据变化事件
            if(window.channel != null){
                let datas = JSON.parse(JSON.stringify({id: this.id}))
                window.channel.postMessage({type: 'nodeEvent', func: 'onRemove', datas:datas })
            }
        }
    }

    //发送开始连接
    sendConnectEvent(inputIndex, linkedNode, outputIndex){
        if(this.graph == null){
            return
        }
        if(CocosMgr.isSinglePreview != true){
            // 发送数据变化事件
            if(window.channel != null){
                let datas = JSON.parse(JSON.stringify({id: this.id, inputIndex: inputIndex, linkedNodeId: linkedNode.id, outputIndex: outputIndex}))
                window.channel.postMessage({type: 'nodeEvent', func: 'onConnect', datas: datas })
            }
        }
    }

    //发送断开连接
    sendDisConnectEvent(slot, keepReroutes){
        if(this.graph == null){
            return
        }
        if(CocosMgr.isSinglePreview != true){
            // 发送数据变化事件
            if(window.channel != null){
                let datas = JSON.parse(JSON.stringify({ id: this.id, slot: slot , keepReroutes: keepReroutes}))
                window.channel.postMessage({type: 'nodeEvent', func: 'onDisConnect', datas: datas })
            }
        }
    }


    //发送添加事件
    sendAddEvent(){
        if(this.graph == null){
            return
        }
        if(CocosMgr.isSinglePreview != true){
            // this.widgets
            // 发送数据变化事件
            if(window.channel != null){
                let datas = JSON.parse(JSON.stringify({ id: this.id,  type: this.type, params: this.properties }))
                window.channel.postMessage({type: 'nodeEvent', func: 'onAdd', datas: datas})
            }
        }
    }

    //发送其它的事件
    sendOtherEvent(funcName, params){
        if(this.graph == null){
            return
        }
        if(CocosMgr.isSinglePreview != true){
            // 发送其它事件
            if(window.channel != null){
                let datas = JSON.parse(JSON.stringify( {id: this.id, funcName: funcName, params: params }))
                window.channel.postMessage({type: 'nodeEvent', func: 'justRunFunc', datas: datas})
            }
        }
    }

    onStart(){
        this._hasShowTips = false
    }


    oneClickCreateTouchTip(){
        // console.log('点击了关联触摸提示')
        //直接创建触摸提示节点，并且自动链接
        let tipsNode = LiteGraph.createNode('objects/createObject')
        tipsNode.setProperty('modal', 'spine')
        // tipsNode.setProperty('customeName', '1f09b34a/Common_Click')
        tipsNode.setProperty('customeName', 'c7007391/Common_Click')
        tipsNode.setProperty('x', 0)
        tipsNode.setProperty('y', 0)
        tipsNode.setProperty('zIndex', 99)
        tipsNode.setProperty('premulAlpha', false)
        tipsNode.onWidgetChanged('物体类型')
        tipsNode.pos = [this.pos[0], this.pos[1] + this.height + 130]
        this.graph.add(tipsNode)
        let outputs = tipsNode.onGetOutputs()
        let lgraphNodeIndex = outputs.findIndex((item)=>{
            return item[1] == 'lgraphNode'
        })
        if(lgraphNodeIndex != -1){
            tipsNode.addOutput(outputs[lgraphNodeIndex][0], outputs[lgraphNodeIndex][1])
        }
        // this.connect(2, tipsNode, )
        tipsNode.connect(tipsNode.outputs.length - 1, this, 2)

        //同时创建动画节点
        let animateNode = LiteGraph.createNode('objects/animates/animate')
        animateNode.pos = [tipsNode.pos[0] + tipsNode.width + 3, tipsNode.pos[1]]
        animateNode.setProperty('loop', true)
        animateNode.setProperty('autoRun', true)
        this.graph.add(animateNode)
        tipsNode.connect(0, animateNode, 0)
        setTimeout(() => {
            animateNode.getEnums()
        }, 1000);
    }

    showClickTip(){
        if(this._hasShowTips == true){
            return
        }
        if(this.properties.tipsJustOnce == true){
            this._hasShowTips = true
        } 
        if(this.properties.canClickOutLine == true){
            //可触摸时显示描边
            let codeNode = this.getInputData(0)
            if(codeNode != null){
                codeNode.outLineWidth = 5
            }
        }
        let soltIndex = this.findInputSlot('触摸提示')
        console.log('showClickTip', soltIndex)
        if(soltIndex == -1){
            return
        }
        let linkTip = this.getInputNode(soltIndex)
        // console.log('linkTip', linkTip)
        if(linkTip != null){
            if(linkTip.codeNode != null){
                linkTip.codeNode.playAnimation('1Open', true)
            }
        }
    }

    hideClickTip(){
        if(this.properties.canClickOutLine == true){
            //可触摸时显示描边
            let codeNode = this.getInputData(0)
            if(codeNode != null){
                codeNode.outLineWidth = 0
            }
        }

        let soltIndex = this.findInputSlot('触摸提示')
        if(soltIndex == -1){
            return
        }
        let linkTip = this.getInputNode(soltIndex)
        if(linkTip != null){
            // console.log('hideClickTip', linkTip.codeNode)
            if(linkTip.codeNode != null){
                linkTip.codeNode.playAnimation('2Close', false)
            }
        }
    }

    playLinkSound(){
        let soltIndex = this.findInputSlot('关联音频')
        if(soltIndex == -1){
            return
        }
        let linkTip = this.getInputNode(soltIndex)
        if(linkTip != null){
            if(linkTip.onAction != null){
                linkTip.onAction('播放')
            }
        }
    }

    //当前是否关联音频
    hasLinkSound(){
        let soltIndex = this.findInputSlot('关联音频')
        if(soltIndex == -1){
            return false
        }
        return this.getInputLink(soltIndex) != null
    }

    //当前是否关联音频是否播放结束
    hasLinkIsCanClick(){
        let soltIndex = this.findInputSlot('isCanClick')
        if(soltIndex == -1){
            return false
        }
        return this.getInputLink(soltIndex) != null
    }


    //移除一个propaty
    removeProperty(key){
        // console.log('removeProperty key', key)
        if(this.properties_info == null){
            this.properties_info = []
        }
        let index = this.properties_info.findIndex((item)=>{
            return item.name == key
        })
        this.properties_info.splice(index, 1)
        if(this.properties == null){
            this.properties = {}
        }
        delete this.properties[key]
    }
}