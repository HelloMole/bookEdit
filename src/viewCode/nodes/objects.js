import {LiteGraph, LGraphNode} from '../../litegraph/litegraph'
import * as CocosMgr from '../CocosMgr';
import { SpineToImg } from '@/viewCode/SpineToImg';
import { Bezier } from '../Bezier/bezier';
import { BaseYWNode } from './BaseYwNode'

const soundFxs = ['无','popOut.mp3']



class createObject extends BaseYWNode {
    // Name to show
    title = "物体"
    desc = "在界面中创建一个物体";   //不会在显示节点中用到，仅仅在代码中的解释
    // color= '#510'
    

    constructor() {
        super()
        // this.serialize_widgets = true
        this.mode = LiteGraph.ON_EVENT;     //设置触发模式
        // this.size = [80, 20];               //设置默认节点尺寸
        // this.addInput("触发", "number")   //增加一个输入触点，  输入触点的名称， 值类型
        
        // this.addInput("scale", "number")
        // this.addProperty("scale", 0, 'number');   //增加一个变量，    变量名称， 变量名称
        // this.addWidget("number","缩放倍数", this.properties.scale ,"scale", {precision: 1});  //增加一个控件用于修改变量，  类型，显示名称，默认值，要修改的变量的名称)

        this.addInput("创建", LiteGraph.ACTION);
        // this.addInput("触发", LiteGraph.ACTION);

        this.addOutput("物体", 'codeNode')


        this.addProperty('group', false, 'boolean')
        this.addWidget('toggle', '是否作为UI', this.properties.group, 'group')

        this.addProperty('modal', '空物体', 'enum')
        this.addWidget('combo', '物体类型', this.properties.modal, {property: "modal", values: CocosMgr.objectTypes} )


        this.addProperty('customeName', '', 'string')
        this.addWidget('string', '资源', this.properties.customeName, 'customeName')


        this.addProperty('showTime', 0, 'number' )
        this.addWidget('combo', '加载时机', this.properties.showTime, {property: "showTime", values: {0:'初始化时', 1: '输入时'}} )

        this.addProperty('premulAlpha', false, 'boolean')
        this.addWidget('toggle', '是否预乘', this.properties.premulAlpha, 'premulAlpha')


        this.addProperty('zIndex', 1, 'number')
        this.addWidget('number', '层级', this.properties.zIndex, 'zIndex', {precision: 0})

        this.addProperty('dynamiczIndex', false, 'boolean')
        this.addWidget('toggle', '以y轴动态计算层级', this.properties.dynamiczIndex, 'dynamiczIndex')


        this.addProperty('x', -1280, 'number')
        this.addWidget('number', '坐标-x', this.properties.x, 'x', {precision: 2})

        this.addProperty('y', -750, 'number')
        this.addWidget('number', '坐标-y', this.properties.y, 'y', {precision: 2})


        this.addProperty('scaleX', 1, 'number')
        this.addWidget('number', '缩放-x', this.properties.scaleX, 'scaleX', {precision: 2})

        this.addProperty('scaleY', 1, 'number')
        this.addWidget('number', '缩放-y', this.properties.scaleY, 'scaleY', {precision: 2})

        this.addProperty('opacity', 255, 'number')
        this.addWidget('slider', '透明度', this.properties.opacity, 'opacity', {min: 0, max: 255, precision: 0})
        
        this.addProperty('angle', 0, 'number')
        this.addWidget('number', '角度', this.properties.angle, 'angle', {min: -360, max: 360, precision: 0})


        this.addProperty('anchorX', 0.5, 'number')
        this.addWidget('number', '锚点x', this.properties.anchorX, 'anchorX', {min: -1, max: 1, precision: 1, step2: 0.1})

        this.addProperty('anchorY', 0.5, 'number')
        this.addWidget('number', '锚点y', this.properties.anchorY, 'anchorY', {min: -1, max: 1, precision: 1, step2: 0.1})


        this.addProperty('width', 50, 'number')
        this.widthWidget = this.addWidget('number', '宽度', this.properties.width, 'width',  {precision: 0, min: 0, max: 9999})

        this.addProperty('height', 50, 'number')
        this.heightWidget = this.addWidget('number', '高度', this.properties.height, 'height',  {precision: 0, min: 0, max: 9999})

        this.addWidget('button','重置为资源尺寸', "", ()=>{
            console.log('点击了重置按钮')
            this.resetSizeConfig()
        })

        this.addProperty('color', '#ffffff', 'string')
        this.addWidget('string', '物体颜色', this.properties.color, 'color')

        this._hasToggleAssestLoad = false

        //节点配置
        this.addProperty('nodeConfig',  {
            x: this.properties.x, 
            y: this.properties.y,
            width: this.properties.width,
            height: this.properties.height,
            anchorX: this.properties.anchorX,
            anchorY: this.properties.anchorY,
            scaleX: this.properties.scaleX,
            scaleY: this.properties.scaleY,
            color: this.properties.color,
            angle:  this.properties.angle,
        }, 'object')
        this.nodeConfigWidget = this.addWidget('ccnode', '节点操控', this.properties.nodeConfig, 'nodeConfig',  { viewWidth: CocosMgr.designViewWidth, viewHeight: CocosMgr.designViewHeight })

        this.addProperty('string', '', 'string')
        this.addWidget('string', '文本', this.properties.string, 'string')


        this.addProperty('outLineWidth', 0, 'number')
        this.addWidget('slider', '描边宽度', this.properties.outLineWidth, 'outLineWidth',  {precision: 0, min: 0, max: 100})
        this.addProperty('outLineColor', '#ffffff', 'string')
        this.addWidget('string', '描边颜色', this.properties.outLineColor, 'outLineColor')

        this.addProperty('colliderValue', {}, 'object') //需要创建设置碰撞框的组件


        // this.addProperty("modal", 0, "number");
        // this.addWidget("slider", '振动强度', this.properties.modal, "modal", {min: 0, max: 1, precision: 0});

        //设置节点的进度，一般来说用于在执行的时候设置
        //  this.serialize_widgets = true; //widget的值是否也可以被序列化，weidget值和Property中的值不是绑定的，如果初始时不一致，就会出现weidget显示的不是真实的值，所以建议绑定
        // this.widgets_up = true;                                    //设置输入组件在顶部（覆盖input和output）
        // this.properties.precision = 1
        // console.log('节点构建完毕')
    }

    getExtraMenuOptions(graphcanvas) {
        // var that = this;
        return [
            {
                content: "编辑碰撞框",
                callback: ()=> {
                    if(window.onGraphMenuClick != null){
                        // console.log(' this.properties.colliderValue.pointArr',  this.properties.colliderValue)
                        if(Array.isArray(this.properties.colliderValue) == true){
                            this.properties.colliderValue = {}
                        }
                        window.onGraphMenuClick('editColider', {img: this.getPreviewImg(), scale: this.properties.colliderValue.scale || 1,  pointArr: this.properties.colliderValue.pointArr || [], onValueChange: (pointArr, scale)=>{
                            console.log('pointArr', pointArr, scale)
                            this.properties.colliderValue.pointArr = pointArr
                            this.properties.colliderValue.baseWidth = this.properties.width
                            this.properties.colliderValue.baseHeight = this.properties.height
                            this.properties.colliderValue.scale = scale
                            let offsetX = 0
                            let offsetY = 0

                            if(this._renderSpine != null){
                                if(this._renderSpine.canRender){
                                    offsetX = this._renderSpine.bounds.offset.x + 0.5 * this.properties.width
                                    offsetY = this._renderSpine.bounds.offset.y + 0.5 * this.properties.height
                                }
                            }
                            this.properties.colliderValue.offsetX = offsetX
                            this.properties.colliderValue.offsetY = offsetY
                            //这个修改了的话，就要删除节点重新创建
                            if(this.codeNode != null){
                                // console.log('碰撞框已经修改，删除节点重新创建')
                                this.codeNode.destroyNode()
                                this.codeNode = null
                                this.setOutputData(0, null)
                                this.createObj()
                            }
                        }})
                    }
                }
            }
        ];
    };

    //onAdded每次添加到蓝图中都会调用
    onAdded(){
        console.log('节点添加到蓝图中了', this.properties.customeName, this.properties.modal)
        //如果是拖拽资源的话，这里也是需要触发的
        this.updateWidght()
        this.updateRenderAssest()
        //重新计算一下默认尺寸
        this.setSize(this.computeSize())
        this.sendAddEvent()
    }

    onRemoved(){
        // console.log('我从graph中移除了', this.properties.customeName)
        if(this.codeNode != null){
            this.codeNode.destroyNode()
            this.codeNode = null
            this.setOutputData(0, null)
        }
        this._image = null
        this._renderSpine = null
        this.sendRemoveEvent()
        if(this.checkAssestTimeOut != null){
            clearInterval(this.checkAssestTimeOut)
            this.checkAssestTimeOut = null
        }
    }

    //onConfigure从json还原到蓝图中才会调用，如果从json还原，onAdded会优先触发
    onConfigure(){
        if(CocosMgr.isInApp == true){
            return
        }
        if(CocosMgr.isInImport == true){
            return
        }
        // console.log('createObject节点配置了', this.properties.customeName, this.properties.modal)
        this.updateWidght()
        this.updateRenderAssest()

        if(this.graph && CocosMgr.isSinglePreview == true){
            //在另一个网页打开的单列，不需要canvas渲染蓝图
            this.createObj()
        }else{
            if(this.graph && this.graph.list_of_graphcanvas != null && this.graph.list_of_graphcanvas.length > 0){
                //说明在编辑中，始终创建预览
                this.createObj(()=>{
                    if(this.properties.modal == 'spine'){
                        setTimeout(() => {
                            try {
                                //根据连接的animate动画自动设置首选预览图
                                let linkedNodes = this.getOutputNodes(0)
                                if(linkedNodes != null){
                                    linkedNodes = linkedNodes.filter((node)=>{
                                        return node.type == 'objects/animates/animate' && node.properties.autoRun == true
                                    })
                                    if(linkedNodes[0] != null){
                                        let firstAni = linkedNodes[0]
                                        firstAni.onSelected()
                                        let skin = firstAni.properties.skin
                                        // console.log('物体创建完成了', this.properties.customeName, this.properties.modal, skin, firstAni.properties.playAniName)
                                        this.codeNode.setSkin(skin)
                                        this.codeNode.playAnimation(firstAni.properties.playAniName, firstAni.properties.loop)
                                    }
                                }
                            } catch (error) {
                                
                            }
                        }, 1000);
                    }
                })
            }
        }
        // this.createObj()
    }

    //开始运行会初始化
    onStartBeforeLoad(){
        console.log('createObject onStart', this.properties.showTime)
        var showTime = this.properties.showTime
        if(showTime == 0){   //'初始化时'
            this.graph.config.assestTotal += 1
            this.createObj(()=>{
                this.graph.config.assestLoaded += 1
                if(this.graph.checkAssestLoadComplete != null){
                    this.graph.checkAssestLoadComplete()
                }
            })
        }
    }


    //创建一个物体
    createObj(loadCb){
        if(this.codeNode != null){
            if(cc.isValid(this.codeNode.node) == true){
                // if(CocosMgr.isInApp == true){
                    //不重复生成，仅仅重置所有参数
                    var config = {...this.properties}
                    CocosMgr.syncConfigToCodeNode(this.codeNode, config)
                    if(loadCb != null){
                        loadCb()
                    }
                    this.setOutputData(0, this.codeNode)
                    return
                // }
                // console.log('我删除了旧的codeNode', this.codeNode.node._id)
                // this.codeNode.destroyNode()
            }
            this.codeNode = null
            this.setOutputData(0, null)
        }
        var config = {...this.properties}
        // console.log('createObj config', config)  //调用一个创建物体的配置
        var rootccNode = this.graph.vars.rootccNode
        if(rootccNode != null){
            config['parent'] = rootccNode
        }
        this.codeNode = CocosMgr.createObj(config, loadCb)
        this.codeNode.graph = this.graph
        console.log('我创建了的codeNode',  this.codeNode.node._id)
        this.setOutputData(0, this.codeNode)
        return this.codeNode
    }

    updateOutputData(slot){
        console.log('我收到了更新物体的事件', slot)
        this.setOutputData(slot, this.codeNode)
    }

    //在不同的蓝图切换，需要查询是否存在预览节点，不存在的话就创建
    //当lagraph attach时此node可能还未创建，所以不能
    // onAttachCanvas(){
    //     console.log('onAttachCanvas', this.properties.customeName )
    //     this.createObj()
    // }


    // onDetachCanvas(){
    //     console.log('onDetachCanvas', this.properties.customeName )
    //     //如果当前是打开的是子蓝图，那就不要删除
    //     console.log('this.graph', this.graph)
    //     if(this.codeNode != null){
    //         this.codeNode.destroyNode()
    //         this.codeNode = null
    //     }
    // }
  
    // 当节点Toggle时调用
    onAction(action, param)
    {
       if(action == '创建'){
            this.createObj()
       }
    }

    getTitle(){
        var value = this.properties.modal

        // var customeName = this.properties.customeName
        // var firstDotIndex = customeName.indexOf('.')
        // if(firstDotIndex != -1){
        //     customeName = customeName.substring(0, firstDotIndex)
        // }
        if(value == '文本'){
            let str = this.properties.string.length < 9 ? this.properties.string : (this.properties.string.substring(0, 8) + '..')
            value += ':' + str
        }
        this.inputs
        return value //+ "  " + customeName
    }


    updateWidght(){
        var value = this.properties.modal
        this.widgets.map((widget)=>{
            // widget.name == '描边宽度'
            if(widget.name == '文本' || widget.name == '描边颜色'){
                widget.hidden = value != '文本'
                // widget.computedDisabled = value != '文本'
            }
            if(widget.name == '锚点x' || widget.name == '锚点y' || widget.name == '宽度' || widget.name == '高度'){
                widget.disabled = value == 'spine'
            }
        })
        // this.expandToFitContent()
    }

    // onSelected(){
       
    // }

    onPause(){
        if(this.codeNode != null){
            if(this.codeNode.spineCom != null){
                this.codeNode.spineCom.paused = true
            }
            cc.director.getActionManager().pauseTarget(this.codeNode);
        }
    }

    //切换时间缩放
    onChangeTimeScale(){
        if(this.codeNode != null){
            if(this.codeNode.spineCom != null && this.graph.config.timeScale != null){
                this.codeNode.spineCom.timeScale = this.graph.config.timeScale
            }
        }
    }

    onResume(){
        if(this.codeNode != null){
            if(this.codeNode.spineCom != null){
                this.codeNode.spineCom.paused = false
            }
            cc.director.getActionManager().resumeTarget(this.codeNode);
        }
    }

    onStop(){
        // this.isOutputConnected(0)
        // this.outputs.map((item)=>{
        //     return item.name
        // })
        // this.findInputSlot('播放')
        // let link = this.graph.links.get(2)
        // link.target_id
        //这里不能重制，重置了翻页会闪烁
        this.codeNode.targetOff()
        if(this.codeNode != null && CocosMgr.isInApp == false){
            var config = {...this.properties.nodeConfig}
            // console.log('更新节点配置', config, value)
            CocosMgr.syncConfigToCodeNode(this.codeNode, config)
        }
    }

    onPropertyChanged(property, value, oldValue){
        // console.log('onPropertyChanged', name, value)
        if(property != 'nodeConfig'){
            //  console.log('this.nodeConfigWidget', this.nodeConfigWidget)
            if(typeof this.nodeConfigWidget.value == 'object'){
                if(this.nodeConfigWidget.value[property] != null){
                    this.nodeConfigWidget.value[property] = value
                    this.properties.nodeConfig[property] = value
                }
            }
        }
        if(this.codeNode != null){
            if(cc.isValid(this.codeNode.node) == false){
                this.codeNode = null
                return
            }
            var config = {}
            if(property == 'nodeConfig'){
                config = {...value}
            }else{
                config[property] = this.properties[property]
            }
            // console.log('更新节点配置', config, value)
            CocosMgr.syncConfigToCodeNode(this.codeNode, config)
            if(property == 'string'){
                //修改文本重新设置尺寸
                this.resetSizeConfig()
            }
        }
        // if(property == 'modal'){
        //   this.updateRenderAssest()
        // }else if(property == 'customeName'){
        //   this.updateRenderAssest()
        // }
        this.sendPropertyChangeEvent(property, value, oldValue)
    }
    
    onWidgetChanged(name, value, oldValue, widget){
        // console.log('onWidgetChanged', name, value, oldValue, widget)
        // var property = widget.options.property
       if(name == '物体类型'){
          this.updateWidght()
          this.updateRenderAssest()
        }else if(name == '资源'){
          this.updateRenderAssest()
        }
        this.sendOtherEvent('onWidgetChanged', [name])
    }

    //更新可以显示的资源
    updateRenderAssest(){
        if(CocosMgr.isInApp == true){
            //在App中不会运行此操作
            return
        }
        // console.log('导入时不会刷新资源预览', CocosMgr.isInImport)
        if(CocosMgr.isInImport == true){
            //在App中不会运行此操作
            return
        }
        // if(CocosMgr.isSinglePreview == true){
        //     //直接创建物体就行了，不需要创建预览，如果这里不加载预览，可能会导致获取不到资源信息，所以还是应该加载？
        //     this.createObj()
        //     return
        // }
        var modal = this.properties.modal
        var customeName = this.properties.customeName
        console.log('updateRenderAssest', modal, customeName)
        if(modal != 'spine'){
            this._renderSpine = null
        }
        if(modal != '图片'){
            if(this._image != null){
                this._image.src = null
                this._image = null
            }
        }
        if(modal == '图片'){
            if(this._image == null){
                this._image = new Image()
            }
            var realSrc = CocosMgr.rootHost + '/' + customeName
            if(this._image.src != realSrc){
                this._image.src = realSrc
                this._hasToggleAssestLoad = false
                if(this.checkAssestTimeOut != null){
                    clearInterval(this.checkAssestTimeOut)
                    this.checkAssestTimeOut = null
                }
                this.checkAssestTimeOut = setInterval(() => {
                    this.checkAssestLoaded()
                }, 500)
            }
        }else if(modal == 'spine'){
            if(this._renderSpine == null){
                this._renderSpine = new SpineToImg()
            }
            var assetName = customeName + '.json'
            if(this._renderSpine.assets == null || this._renderSpine.assets.json != assetName){
                this._hasToggleAssestLoad = false
                if(this.checkAssestTimeOut != null){
                    clearInterval(this.checkAssestTimeOut)
                    this.checkAssestTimeOut = null
                }
                this.checkAssestTimeOut = setInterval(() => {
                    this.checkAssestLoaded()
                }, 500)
                // if(customeName.indexOf('Common_Click') != -1){
                //     this._renderSpine.autoSetAni = true //防止spine预览加载不出来的情况
                // }else{
                //     this._renderSpine.autoSetAni = false
                // }
                // console.log('this._renderSpine.autoSetAni', this._renderSpine.autoSetAni)
                this._renderSpine.setAssets({
                    dir: CocosMgr.rootHost,
                    json:  customeName + '.json',
                    atlas: customeName + '.atlas',
                })
            }
            
        }else if(modal == '文本'){
            this.createObj()
            this.resetSizeConfig()
        }else if(modal == '空物体'){
            //空物体也要提前创建
            this.createObj()
        }
    }

    //部分动画切换皮肤可能直接就是修改了图片，所以需要重新修改预览
    updateSpinePreview(skin){
        if(this._renderSpine != null){
            this._renderSpine.setSkin(skin)
            this._renderSpine.genPreviewImg()
        }
    }

    //重置尺寸配置信息，只有在编辑模式下会触发
    resetSizeConfig(){
        var width = this.properties.width
        var height = this.properties.height
        if(this._image != null){
            if (this._image.naturalWidth > 0 && this._image.naturalHeight > 0) {
                width = this._image.width
                height = this._image.height
            }
        }else if(this._renderSpine != null){
            if(this._renderSpine.canRender){
                width =  this._renderSpine.bounds.size.x
                height = this._renderSpine.bounds.size.y
            }
        }else if(this.properties.modal == '文本'){
            console.log('当前是否有text节点', this.codeNode)
            if(this.codeNode != null){
                width =  this.codeNode.width
                height = this.codeNode.height
            }
        }
        console.log('width', width, height)
        this.widthWidget.setValue(width, {e: null, node: this, canvas: null })
        this.heightWidget.setValue(height, {e: null, node: this, canvas: null })
        var nodeConfig = this.properties.nodeConfig
        nodeConfig.width = width
        nodeConfig.height = height
        
        if(this.properties.modal != '文本'){
            //每次都重新创建物体
            this.createObj()
        }
        // this.nodeConfigWidget.setValue(nodeConfig, )
    }

    getPreviewImg(){
        if(this._image != null){
            if(this._image.complete == false){
                //还没有完全加载完成
                return
            }
            if (this._image.naturalWidth > 0 && this._image.naturalHeight > 0) {
                
            }else{
                return
            }
            return this._image.src
        }else  if(this._renderSpine != null){
            if(this._renderSpine.canRender){
               return this._renderSpine.getImgUrlOri()
            }
        }
    }

    //检查资源是否加载成功，之前放在node渲染时加载
    //如果不传ctx就仅仅判断是否加载成功
    checkAssestLoaded(ctx){
        var modal = this.properties.modal
        if(modal == '图片'){
            if(this._image != null){
                if(this._image.complete == false){
                    //还没有完全加载完成
                    return
                }
                if (this._image.naturalWidth > 0 && this._image.naturalHeight > 0) {
                    
                }else{
                    //没有成功加载图片
                    //可以绘制加载丢失的404警告
                    if(ctx != null){
                        this.drawErrorTips(ctx)
                    }
                    return
                }
                if(this._hasToggleAssestLoad == false){
                    this.resetSizeConfig()
                    this._hasToggleAssestLoad = true
                    if(this.checkAssestTimeOut != null){
                        clearInterval(this.checkAssestTimeOut)
                        this.checkAssestTimeOut = null
                    }
                }
                if(ctx != null){
                    var rect = this.drawAssestBox(ctx, this._image.width, this._image.height)
                    ctx.drawImage(this._image, rect.x, rect.y, rect.width,  rect.height)
                }
            }
        }else if(modal == 'spine'){
            //使用spineRender渲染节点
            if(this._renderSpine != null){
                if(this._renderSpine.canRender){
                    if(ctx != null){
                        if(this._renderSpine.image != null && this._renderSpine.image.naturalWidth > 0 && this._renderSpine.image.naturalHeight > 0){
                            //根据连接的animate动画自动设置首选预览图
                            let linkedNodes = this.getOutputNodes(0)
                            if(linkedNodes != null){
                                linkedNodes = linkedNodes.filter((node)=>{
                                    return node.type == 'objects/animates/animate' && node.properties.autoRun == true
                                })
                                if(linkedNodes[0] != null){
                                    let firstAni = linkedNodes[0]
                                    let skin = firstAni.properties.skin
                                    this.updateSpinePreview(skin)
                                }
                            }
                            var rect = this.drawAssestBox(ctx, this._renderSpine.image.width, this._renderSpine.image.height)
                            ctx.drawImage(this._renderSpine.image, rect.x, rect.y, rect.width,  rect.height)
                        }
                    }
                    // this._renderSpine.render(ctx, rect)
                    if(this._hasToggleAssestLoad == false){
                        this.resetSizeConfig()
                        this._hasToggleAssestLoad = true
                        if(this.checkAssestTimeOut != null){
                            clearInterval(this.checkAssestTimeOut)
                            this.checkAssestTimeOut = null
                        }
                    }
                }else{
                    //判断是否加载出错
                    if(ctx != null){
                        this.drawErrorTips(ctx)
                    }
                    // if(this._renderSpine.isLoadingComplete()){
                       
                    // }
                    // if(this._renderSpine.isLoadIngError()){
                        
                    //     // console.log('调用了render spine')
                    // }
                }
            }
        }
    }

    onDrawForeground(ctx, lgCanvas, canvas){
        // if (this.flags.collapsed) {
        //     return;
        // }
        this.checkAssestLoaded(ctx)
    }
}

createObject.title = '物体'
createObject.showTypes = ['初始化时','输入时']
LiteGraph.registerNodeType("objects/createObject", createObject);

//字幕组
class textGroup extends BaseYWNode{
    title = "字幕组"
    desc = "用于快速创建一个绘本中浮动的字幕";

    constructor() {
        super()

        this.mode = LiteGraph.ON_EVENT
        this.addInput("物体", "codeNode")

        // this.addInput("播放", LiteGraph.ACTION)
        // this.addInput("停止", LiteGraph.ACTION)

        this.addOutput("列表", 'array');

        this.addProperty('showInPageBottom', false, 'boolean')
        this.addWidget('toggle', '用作底部字幕', this.properties.showInPageBottom, 'showInPageBottom')

        this.addProperty('vertical', false, 'boolean')
        this.addWidget('toggle', '竖向文本', this.properties.vertical, 'vertical')

        this.addProperty('layout', '居左/下', 'enum')
        this.addWidget('combo', '排列', this.properties.layout, {property: "layout", values: textGroup.layoutEnum })

        this.addProperty('firstLineOffset', 0, 'number')
        this.addWidget('number', '首行缩进', this.properties.firstLineOffset, 'firstLineOffset', {precision: 0})

        this.addProperty('lineSpace', 0, 'number')
        this.addWidget('number', '行距', this.properties.lineSpace, 'lineSpace', {precision: 0})

        this.addProperty('fontSize', 45, 'number')
        this.addWidget('number', '字号', this.properties.fontSize, 'fontSize', {precision: 0})

        this.addProperty('color', '#000000', 'string')
        this.addWidget('string', '颜色', this.properties.color, 'color')

        this.addProperty('outLineWidth', 4, 'number')
        this.addWidget('slider', '描边宽度', this.properties.outLineWidth, 'outLineWidth',  {precision: 0, min: 0, max: 100})
        this.addProperty('outLineColor', '#ffffff', 'string')
        this.addWidget('string', '描边颜色', this.properties.outLineColor, 'outLineColor')


        this.addProperty('hideBeforRun', false, 'boolean')
        this.addWidget('toggle', '运行前隐藏', this.properties.hideBeforRun, 'hideBeforRun')

        this.addProperty('hideAfterRun', false, 'boolean')
        this.addWidget('toggle', '运行结束隐藏', this.properties.hideAfterRun, 'hideAfterRun')

        this.addProperty('hideBaseLabel', false, 'boolean')
        this.addWidget('toggle', '隐藏底层文字', this.properties.hideBaseLabel, 'hideBaseLabel')

        this.addProperty('needColorAni', false, 'boolean')
        this.addWidget('toggle', '是否颜色过渡', this.properties.needColorAni, 'needColorAni')

        this.addProperty('maskColor', '#88BF3D', 'string')
        this.addWidget('string', '过渡颜色', this.properties.maskColor, 'maskColor')



        // this.properties.linesNum = 0
        this.addProperty('linesNum', 0, 'number')
        this.addWidget('button', '添加一行', '', ()=>{
            this.addLine()
        })

        this.addWidget('button', '删除一行', '', ()=>{
            this.removeLine()
        })
        // this.serialize_widgets = true
    }

    updateWidght(){
        var value = this.properties.showInPageBottom
        this.widgets.map((widget)=>{
            if(widget.name != '用作底部字幕' ){
                widget.hidden = value
            }
        })
        this.setSize(this.computeSize())
    }


    //从配置初始化时，自动创建widget
    onConfigure(){
        console.log('当前的配置信息', this.properties)
        for(var i = 0; i < this.properties.linesNum; i++){
            let key = 'text' + (i + 1)
            this.addWidget('string', '文本', this.properties[key], key)
        }

        this.freshTexts()
    }

    addLine(){
        this.properties.linesNum += 1
        let key = 'text' + this.properties.linesNum
        this.addProperty(key, '', 'string')
        this.addWidget('string', '文本', '', key)
        this.freshTexts()
    }


    removeLine(){
        if(this.properties.linesNum == 0){
            return
        }
        let key = 'text' + this.properties.linesNum
        this.properties.linesNum -= 1
        this.removeProperty(key)
        this.widgets.pop()
        this.setSize(this.computeSize())
        this.freshTexts()
    }

    //当条件修改
    onPropertyChanged(property, value, oldValue){
        var codeNode = this.getInputData(0, true)
        if(codeNode == null){
            // console.warn('textGroup 当前没有物体')
            return
        }
        if(codeNode.node == null){
            // console.warn('textGroup 关联物体没有创建node')
            return
        }
        if(property == 'showInPageBottom'){
            this.updateWidght()
            if(value == false){
                this.freshTexts()
            }else{
                var codeNode = this.getInputData(0, true)
                if(codeNode != null){
                    codeNode.clearChildren()
                }
            }
            return
        }
        if(property == 'layout'){
            for(var i = 0; i < codeNode.node.children.length; i++){
                let childCodeNode = codeNode.node.children[i].getComponent('CodeNodeLg')
                if(this.properties.vertical == true){
                    if(i == 0){
                        childCodeNode.y = this.properties.firstLineOffset
                    }else{
                        childCodeNode.y = 0
                    }
                    childCodeNode.anchorY = textGroup.anchorXDit[value]
                    childCodeNode.anchorX = 0.5
                }else{
                    if(i == 0){
                        childCodeNode.x = this.properties.firstLineOffset
                    }else{
                        childCodeNode.x = 0
                    }
                    childCodeNode.anchorY = 0.5
                    childCodeNode.anchorX = textGroup.anchorXDit[value]
                }
            }
        }else if(property == 'vertical'){
            //垂直排列
            let layout = codeNode.checkAddComponent(cc.Layout)

            if(value == false){
                layout.type = cc.Layout.Type.VERTICAL
                layout.resizeMode = cc.Layout.ResizeMode.CONTAINER
                layout.spacingY = this.properties.lineSpace
                layout.verticalDirection = cc.Layout.VerticalDirection.TOP_TO_BOTTOM
            }else{
                layout.type = cc.Layout.Type.HORIZONTAL
                layout.resizeMode = cc.Layout.ResizeMode.CONTAINER
                layout.spacingX = this.properties.lineSpace
                layout.horizontalDirection = cc.Layout.HorizontalDirection.RIGHT_TO_LEFT
            }

            for(var i = 0; i < codeNode.node.children.length; i++){
                let childCodeNode = codeNode.node.children[i].getComponent('CodeNodeLg')
                childCodeNode.overflow = value ? cc.Label.Overflow.RESIZE_HEIGHT : cc.Label.Overflow.NONE
                if(value == true){
                    if(i == 0){
                        childCodeNode.y = this.properties.firstLineOffset
                    }else{
                        childCodeNode.y = 0
                    }
                }else{
                    if(i == 0){
                        childCodeNode.x = this.properties.firstLineOffset
                    }else{
                        childCodeNode.x = 0
                    }
                }
               
                if(value == false){
                    childCodeNode.anchorX = textGroup.anchorXDit[this.properties.layout]
                    childCodeNode.anchorY = 0.5
                }else{
                    childCodeNode.anchorX = 0.5
                    childCodeNode.anchorY = textGroup.anchorXDit[this.properties.layout]
                    childCodeNode.width = this.properties.fontSize + 10
                }
            }
            // anchorX: textGroup.anchorXDit[this.properties.layout],
            // overflow: this.properties.vertical ? cc.Label.Overflow.RESIZE_HEIGHT : cc.Label.Overflow.NONE,
            // width: this.properties.fontSize + 10   
        }else if(property == 'lineSpace'){
            let layout = codeNode.checkAddComponent(cc.Layout)
            // layout.type = cc.Layout.Type.VERTICAL
            // layout.resizeMode = cc.Layout.ResizeMode.CONTAINER
            if(this.properties.vertical){
                layout.spacingX = this.properties.lineSpace
            }else{
                layout.spacingY = this.properties.lineSpace
            }
        }else if(property == 'firstLineOffset'){
            let child = codeNode.node.children[0]
            if(child != null){
                if(this.properties.vertical){
                    child.getComponent('CodeNodeLg').y = this.properties.firstLineOffset
                }else{
                    child.getComponent('CodeNodeLg').x = this.properties.firstLineOffset
                }
            }
        }else if(property == 'outLineColor'){
            for(var i = 0; i < codeNode.node.children.length; i++){
               let child = codeNode.node.children[i]
               child.getComponent('CodeNodeLg').outLineColor = this.properties.outLineColor
            }
        }else if(property == 'outLineWidth'){
            for(var i = 0; i < codeNode.node.children.length; i++){
               let child = codeNode.node.children[i]
               child.getComponent('CodeNodeLg').outLineWidth = this.properties.outLineWidth
            }
        }else if(property == 'fontSize'){
            for(var i = 0; i < codeNode.node.children.length; i++){
               let child = codeNode.node.children[i]
               child.getComponent('CodeNodeLg').fontSize = this.properties.fontSize
               if(this.properties.vertical){
                child.getComponent('CodeNodeLg').width = this.properties.fontSize + 10
               }
            }
        }else if(property == 'color'){
            for(var i = 0; i < codeNode.node.children.length; i++){
               let child = codeNode.node.children[i]
               child.getComponent('CodeNodeLg').color = this.properties.color
            }
        }else{
            let childNode = codeNode.getChildByName(property)
            if(childNode != null){
                childNode.getComponent('CodeNodeLg').string = value
            }
        }
    }

    //根据当前配置刷新界面
    freshTexts(data){
        var codeNode = this.getInputData(0, true)
        if(this.properties.showInPageBottom == true){
            //只在绘本底部通用导航栏显示
            if(codeNode != null){
                codeNode.clearChildren()
            }
            return
        }
        // console.log('textGroup freshTexts', data,  codeNode)
        if(codeNode == null){
            console.log('当前没有物体')
            if(CocosMgr.isInApp == false){
               let linkNode = this.getRealLinkNode()
               if(linkNode == null){
                console.log('当前没有关联节点')
                return
               }
               codeNode = linkNode.codeNode
               if(codeNode == null){
                console.log('当前关联节点没有codeNode')
                return
               }
            }else{
                return
            }
        }
        let layout = codeNode.checkAddComponent(cc.Layout)

        if(this.properties.vertical == false){
            layout.type = cc.Layout.Type.VERTICAL
            layout.resizeMode = cc.Layout.ResizeMode.CONTAINER
            layout.spacingY = this.properties.lineSpace
            layout.verticalDirection = cc.Layout.VerticalDirection.TOP_TO_BOTTOM
        }else{
            layout.type = cc.Layout.Type.HORIZONTAL
            layout.resizeMode = cc.Layout.ResizeMode.CONTAINER
            layout.spacingX = this.properties.lineSpace
            layout.horizontalDirection = cc.Layout.HorizontalDirection.RIGHT_TO_LEFT
        }
        
        // layout.horizontalDirection = cc.Layout.HorizontalDirection.RIGHT_TO_LEFT

        codeNode.clearChildren()
        this.motionTextArr = []
        // layout
        for(var i = 1; i <= this.properties.linesNum; i++){
            let config = {
                parent: codeNode.node, 
                modal: CocosMgr.ObjectTypeEnum.text, 
                customeName: 'text' + i, 
                string: this.properties['text' + i],
                outLineWidth: this.properties.outLineWidth,
                outLineColor: this.properties.outLineColor,
                fontSize: this.properties.fontSize,
                color: this.properties.color,
                // anchorX: textGroup.anchorXDit[this.properties.layout],
                overflow: this.properties.vertical ? cc.Label.Overflow.RESIZE_HEIGHT : cc.Label.Overflow.NONE,
                width: this.properties.fontSize + 10    //只有竖向排列时生效
            }
            
            let node = CocosMgr.createObj(config)
            if(node != null && data != null){
                console.log('生成字幕', this.properties['text' + i], node.node._id, data)
                let motionText = node.checkAddComponent('MotionText')
                motionText.hideBeforRun = this.properties.hideBeforRun
                motionText.hideAfterRun = this.properties.hideAfterRun
                motionText.hideBaseLabel = this.properties.hideBaseLabel
                motionText.dir = this.properties.vertical ? 1 : 0
                // console.log('设置了motionText hideAfterRun', this.properties.hideAfterRun)
                motionText.maskColor = this.properties.maskColor
                this.motionTextArr.push(motionText)
                let index = i - 1
                if(data[index] != null){
                    motionText.position = data[index].position.map((value)=>{
                        if(this.properties.needColorAni != true){
                           return 0
                        }
                        return value * 0.01
                    }).join(',')
                    motionText.positionTime = data[index].times.join(',')
                    console.log('设置了motionText hideAfterRun', motionText.position, motionText.positionTime)
                }
                motionText.init()
            }
            //重新对齐一下
            this.onPropertyChanged('layout', this.properties.layout)
        }
    }

    

    onAction(name){
        var codeNode = this.getInputData(0, true)
        if(codeNode == null){
            console.log('当前没有物体')
            return
        }
        console.log('textGroup onAction', name)
        if(name == '播放'){
            // for(var i = 0; i < codeNode.node.children.length; i++){
            //    let child = codeNode.node.children[i]
            //    child.getComponent('MotionText').
            // }
            var curIndex = 0
            var run = ()=>{
                let textArr = this.motionTextArr
                if(textArr[curIndex] == null){
                    return
                }
                let motionText = textArr[curIndex]
                console.log('textGroup 当前执行的motionText', curIndex, textArr[curIndex].node._id, motionText)
                if(motionText == null){
                    return
                }
                motionText.dir = this.properties.vertical ? 1 : 0
                motionText.inputHandle({data: 1})
                motionText.outputHandle = ()=>{
                    curIndex += 1
                    if(textArr[curIndex] != null && textArr[curIndex].node.active == true){
                        run()
                    }else{
                        // this.scheduleOnce(()=>{
                        //     //等待0.3秒再认为结束，因为开启录音会录制到没有说话的部分
                        //     if(this.outputHandle != null){
                        //         this.outputHandle('onend', 1)
                        //     }
                        // }, 0.3)
                    }
                }
            }
            run()
        }else if(name == '停止'){
            let textArr = this.motionTextArr
            for(var i = 0; i < textArr.length; i++){
                let motionText = textArr[i]
                if(motionText != null){
                    motionText.inputHandle({ data: 0 })
                }
            }
        }
    }
}

textGroup.layoutEnum = ['居左/下', '居中', '居右/上']
textGroup.anchorXDit = {'居左/下': 0, '居中': 0.5, '居右/上': 1}
textGroup.title = '字幕组'
LiteGraph.registerNodeType("objects/textGroup", textGroup);


class animate extends BaseYWNode {
    // Name to show
    title = "骨骼动画"
    desc = "用于控制动画播放";   //不会在显示节点中用到，仅仅在代码中的解释
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
        this.addInput("物体", "codeNode")
        this.addInput("播放", LiteGraph.ACTION);

        this.addOutput("结束", LiteGraph.EVENT);
        this.addOutput("点击", LiteGraph.EVENT);

        this._skins = []
        this._animations = []

        this.addProperty('modal', '全设置', 'enum')
        this.addWidget('combo', '更新模式', this.properties.modal, {property: "modal", values: animate.modalEnum })

        this.addProperty('skin', '', 'enum')
        this.addWidget('combo', '选择皮肤', this.properties.skin, {property: "skin", values: this._skins })

        this.addProperty('playAniName', '', 'enum')
        this.addWidget('combo', '选择动画', this.properties.playAniName, {property: "playAniName", values: this._animations })


        // this.addWidget('button','刷新皮肤和动画选项', "", ()=>{
        //     this.getEnums()
        // })

        this.addProperty('loop', false, 'boolean')
        this.addWidget('toggle', '是否循环', this.properties.loop, 'loop')

        
        this.addProperty('timeScale', 1, 'number')
        this.addWidget('slider', '播放速率', this.properties.timeScale, 'timeScale',  {precision: 1, min: 0, max: 10})

        this.addProperty('autoRun', false, 'boolean')
        this.addWidget('toggle', '是否自动播放', this.properties.autoRun, 'autoRun')

        this.addProperty('clickWait', false, 'boolean')
        this.addWidget('toggle', '点击等待动画结束', this.properties.clickWait, 'clickWait')

        this.addProperty('softChange', false, 'boolean')
        this.addWidget('toggle', '柔和过度', this.properties.softChange, 'softChange')

        this.addProperty('cancelEvent', false, 'boolean')
        this.addWidget('toggle', '取消其他触摸事件', this.properties.cancelEvent, 'cancelEvent')

        this.addProperty('aniEndCanClick', false, 'boolean')
        this.addWidget('toggle', '动画结束后响应点击', this.properties.aniEndCanClick, 'aniEndCanClick')

        this.addProperty('toggleCount', 1, 'number')
        this.addWidget('number', '结束触发次数', this.properties.toggleCount, 'toggleCount', {precision: 0, min: 0})

        this.addProperty('aniClickReplay', false, 'boolean')
        this.addWidget('toggle', '点击重播动画', this.properties.aniClickReplay, 'aniClickReplay')

        this.addProperty('aniClickTimeSpace', 0, 'number')
        this.addWidget('number', '点击时间间隔', this.properties.aniClickTimeSpace, 'aniClickTimeSpace')

        this.addProperty('canClickOutLine', false, 'boolean')
        this.addWidget('toggle', '可点击时显示描边', this.properties.canClickOutLine, 'canClickOutLine')

        this.addProperty('isCanClick', true, 'boolean')
        let canClickWidget = this.addWidget('toggle', '是否可点击', this.properties.isCanClick, 'isCanClick')
        

        let linkSolt = this.addInput("触摸提示", "lgraphNode")
        this.addProperty('linkClickTip', '', 'string')  //保存一个节点id就行

        let linkTipsWidget = this.addWidget('linknode', '添加触摸提示', this.properties.linkClickTip, ()=>{
            this.oneClickCreateTouchTip()
        })

        this.addProperty('tipsJustOnce', true, 'boolean')
        this.addWidget('toggle', '触摸提示只出现一次', this.properties.tipsJustOnce, 'tipsJustOnce')

        linkSolt.widget = linkTipsWidget
        // linkSolt.pos = [5, 100]
        // console.log("linkSolt.pos", linkSolt.pos)

      
        this.createCaidanBtn = this.addWidget('button','创建点击彩蛋交互', "", ()=>{
            // this.syncTargetValue()
            this.createClickToNextAni()
        })
        this.createCaidanBtn.disabled = true
        this.addWidget('button', '预览动画', "", ()=>{
            this.previewAni()
            this.sendBtnWidgetClickEvent('预览动画')
        })


        this.addProperty('listenAniEvent', true, 'boolean')
        let linkSoundSolt = this.addInput("关联音频", "lgraphNode")
        let linkSountWidget = this.addWidget('toggle', '关联动画音频', this.properties.listenAniEvent, 'listenAniEvent')
        linkSoundSolt.widget = linkSountWidget


        let isCanClickInput = this.addInput('isCanClick', 'boolean')
        isCanClickInput.widget = canClickWidget


        this.addProperty('soundFx', '无', 'enum')
        this.addWidget('combo', '音效', this.properties.soundFx, {property: "soundFx", values: soundFxs })

        //仅设置皮肤时，不会影响当前动画播放状态，结束和点击将不会进行输出，也不会取消原来动画绑定的点击事件结束事件
        //当多个Spine类型的物体连接到这个组件，可以实现一个此Robot控制多个物体播放相同的动画


        //将此动画存在的音频事件也显示出来
        // this.addWidget('button','', "", (btnWidget)=>{
        //     // if(btnWidget.clickeName == '删除控制点'){
              
        //     // }else if(btnWidget.clickeName == '添加控制点'){
               
        //     // }
        // }, {buttons: ['事件1', '事件2']})

        // this.widget = this.addWidget("text", "Text", "", "msg");
        // this.widgets_up = true;
        // this.size = [200, 30];


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
    
    //连接到物体时从物体上获取动画信息
    onConnectInput(inputIndex, outPutType, output, linkedNode, outputIndex){
        // console.log('onConnectInput', inputIndex, outPutType, output, linkedNode, outputIndex)
        if(outPutType == 'codeNode'){
            if(linkedNode._renderSpine != null){
                this._skins.splice(0, this._skins.length, ...linkedNode._renderSpine.skins())
                this._animations.splice(0, this._animations.length, ...linkedNode._renderSpine.animations())
            }
        }
        this.sendConnectEvent(inputIndex, linkedNode, outputIndex)
    }

    // onConfigure(){
    //     // this.getEnums()
    // }
    onSelected(){
        this.getEnums()
        this.onAction('播放')
        this.sendOtherEvent('onSelected')
    }

    onDeselected(){
        this.onAction('停止')
        this.sendOtherEvent('onDeselected')
    }

    //当所有创建物体初始化完成后触发
    onStart(){
        super.onStart()
        console.log('animate onStart', this.properties.autoRun)
        var autoRun = this.properties.autoRun
        if(autoRun == true){
            this.onAction('播放')
        }
    }

    onStop(){
        this.onAction('停止')
    }

    // onConnectInput(inputIndex, outPutType, output, linkedNode, outputIndex){
    //     console.log('onConnectInput', inputIndex, outPutType, output, linkedNode, outputIndex)
    //     if(outPutType == 'codeNode'){
            
    //     }
    //     this.sendConnectEvent(inputIndex, linkedNode, outputIndex)
    // }

    getEnums(autoSetLoop){
        var linkedNode = this.getRealLinkNode()
        if(linkedNode == null){
            return
        }
        if(linkedNode._renderSpine != null){
            let eventDit = linkedNode._renderSpine.events()
            // console.log('skeletonData events', eventDit)


            this._skins.splice(0, this._skins.length, ...linkedNode._renderSpine.skins())
            this._animations.splice(0, this._animations.length, ...linkedNode._renderSpine.animations())
            //如果只有一个选项，直接设置默认值
            if(this._skins.length == 1){
                this.setProperty('skin', this._skins[0])
            }else{
                //为适配旧版本动画，如果当前设置的playAniName是数值，查询可用的动画名称并设置
                if(Number(this.properties.skin) >= 0){
                    let realSkin = this._skins[Number(this.properties.skin)]
                    // console.log('我获取到了skin', realSkin, this._skins)
                    if(realSkin != null){
                        this.setProperty('skin', realSkin)
                    }
                }
            }
            if(this._animations.length == 1){
                this.setProperty('playAniName', this._animations[0])
                if(autoSetLoop == true){
                    this.setProperty('loop', true)
                    this.setProperty('autoRun', true)
                    this.collapse()
                }
                this.createCaidanBtn.disabled = true
            }else{
                //为适配旧版本动画，如果当前设置的playAniName是数值，查询可用的动画名称并设置
                if(Number(this.properties.playAniName) >= 0){
                    let realAni = this._animations[Number(this.properties.playAniName)]
                    if(realAni != null){
                        this.setProperty('playAniName', realAni)
                    }else{
                        console.log("我还是没有找到自己的动画", linkedNode.properties.customeName, this.properties.playAniName, this._animations)
                    }
                }
                this.createCaidanBtn.disabled = false
            }
            console.log('skeletonData eventssss', eventDit[this.properties.playAniName])
            for(let i = 0; i < this.widgets.length; i++){
                if(this.widgets[i].name.indexOf("音频") == 0){
                    this.widgets.splice(i, 1)
                    i--
                }
            }
            if(eventDit[this.properties.playAniName] != null){
                let events = eventDit[this.properties.playAniName]
                // console.log('')
                //添加button来显示事件
                // this.widgets.findIndex((item)=>{
                //     return item.name == 
                // })
                for(var i = 0; i < events.length; i++){
                    this.addWidget('button', '音频：' + events[i].name, "")
                }
            }
        }
    }

    //创建一个过渡到下一个动画的节点
    createClickToNextAni(){
        let aniNode = LiteGraph.createNode("objects/animates/animate");
        aniNode.pos = [this.pos[0] + this.width + 3, this.pos[1]]
        this.graph.add(aniNode);
        this.connect(1, aniNode, 1)
        aniNode.connect(0, this, 1)
        aniNode.setProperty('skin', this.properties.skin)
        this.setProperty('playAniName', 'std')
        this.setProperty('loop', true)
        this.setProperty('autoRun', true)

        var curIndex = this._animations.indexOf(this.properties.playAniName)
        curIndex += 1
        if(this._animations[curIndex] == null){
            curIndex = 0
        }
        var newAniName = this._animations[curIndex]
        aniNode.setProperty('playAniName', newAniName)
        var target = this.getRealLinkNode()
        if(target == null){
            return
        }
        target.connect(0, aniNode, 0)
    }

    previewAni(){
        if(this.graph == null){
            return
        }
        var target = this.getRealLinkNode()
        if(target == null){
            return
        }
        if(this.properties.playAniName == ''){
            return
        }
        if(target.codeNode != null){
            target.codeNode.playAnimation(this.properties.playAniName, this.properties.loop)
        }
    }

    onPropertyChanged(property, value, oldValue){
        if(this.graph == null){
            return
        }
        var target = this.getRealLinkNode()
        if(target == null){
            return
        }
        // console.log('curLink', curLink, target)
        if(property == 'skin'){
            if(target.updateSpinePreview != null){
                target.updateSpinePreview(value)
            }
            if(target.codeNode != null){
                console.log('修改了皮肤', value)
                target.codeNode.setSkin(value)
                // 需要通知物体重新获取动画预览
                // target.codeNode.playAnimation(value)
            }
        }else if(property == 'playAniName'){
            //动画还是直接播放cocos渲染的，在蓝图中播放太奇怪了
            if(target.codeNode != null){
                target.codeNode.playAnimation(value, this.properties.loop)
            }
        }else if(property == 'loop'){
            if(target.codeNode != null){
                target.codeNode.playAnimation(this.properties.playAniName, value)
            }
        }else if(property == 'timeScale'){
            if(target.codeNode != null){
                target.codeNode.setAnimationProb('timeScale', value)
            }
        }else if(property == 'canClickOutLine'){
            // if(target.codeNode != null){
            //     target.codeNode.setOutLine(value)
            // }
        }
        this.sendPropertyChangeEvent(property, value, oldValue)
    }

    //当扩展切换
    onWidgetChanged(name, value, oldValue, widget){
        // console.log('onWidgetChanged', name, value, oldValue, widget)
       
    }

    //动态返回卡片显示的title
    getTitle() {
       return this.title + ' ' + this.properties.skin + '-' + this.properties.playAniName 
    };

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
        // console.log("action", action, param)
        if(action == '播放'){
            this.mode = LiteGraph.ALWAYS
            var codeNode = this.getInputData(0, true)
            if(codeNode != null){
                //播放动画关联的声音
                this.playLinkSound()  
                //播放动画关联的音效
                if(this.properties.soundFx != '无' && this.properties.soundFx != ''){
                    cc.assetManager.loadRemote(CocosMgr.rootHost + '/' + this.properties.soundFx, (err, clip)=>{
                        if(err == null){
                            cc.audioEngine.play(clip, false, 1);
                        }
                    })
                }
                var modal = this.properties.modal
                var loop = this.properties.loop
                let softChange = this.properties.softChange
                let aniEndCanClick = this.properties.aniEndCanClick
                let clickWait = this.properties.clickWait
                this.waitCanClick = false
                this.hideClickTip()

                if(modal == '全设置' || modal == '仅设置皮肤'){
                    codeNode.setSkin(this.properties.skin)
                }
                this._toggleCount = 0
                if(modal == '全设置' || modal == '仅设置动画'){
                    if(this.properties.cancelEvent == true){
                        codeNode.targetOff()
                    }
                    this.clickWaitOutPut = false
                    this.aniEnd = false
                    codeNode.setAnimationProb('timeScale', this.properties.timeScale)
                    codeNode.playAnimation(this.properties.playAniName, loop, softChange, (trackEntry, event)=>{
                        console.log('我收到spine音频事件', event.data.name, event.intValue, this.properties.listenAniEvent, this.isInputConnected(3), this.graph.status)
                        if(this.properties.listenAniEvent == false){
                            return
                        }
                        if(this.isInputConnected(3) == true){
                            //当前已经关联了蓝图中的音频播放
                            return
                        }
                        // if(event.intValue < 0){
                        //     return
                        // }
                        if(this.graph.status != 2){  //STATUS_RUNNING
                            //当前没有在运行中
                            return
                        }
                        // console.log("这里应该播放spine事件声音:", event.data.name, codeNode.node.name + ':' + trackEntry.animation.name)
                        //查找是否有音频节点的资源名称为 event.data.name，如果有就可以直接播放音频了
                        //this.codeProgress.playSound(event.data.name ,spineCom.node.name + ':' + trackEntry.animation.name)
                        let sounds = this.graph.findNodesByType('output/sound')
                        let soundName = ''
                        if(event.data){
                            soundName = event.data.name
                        }
                        let soundNode = sounds.find((item)=>{
                            return item.properties.customeName.split('.')[0] == soundName
                        })
                        // console.log("找到了", sounds, soundNode)
                        if(soundNode != null){
                            soundNode.onAction('播放')
                        }else{
                            if(CocosMgr.isInApp == false){
                                CocosMgr.showAlert(codeNode.node.name + ':' + trackEntry.animation.name + '动画没有相应音频节点:' +  soundName)
                            }else{
                                console.warn('没有对应的音频事件')
                            }
                        }
                    },()=>{
                        this._toggleCount += 1
                        if(this._toggleCount <= this.properties.toggleCount){
                            this.triggerSlot(0)
                        }
                        if(this.aniEnd != true){
                            if(this.isOutputConnected(1) || this.properties.aniClickReplay){
                                if(aniEndCanClick == true){
                                if(this.getInputOrProperty('isCanClick') == true){
                                        this.showClickTip()
                                    }else{
                                        if(this.hasLinkIsCanClick() == true){
                                            this.waitCanClick = true
                                        }
                                    }
                                }
                            }
                        }
                        this.aniEnd = true
                        if(this.clickWaitOutPut == true){
                            this.triggerSlot(1, codeNode)
                        }
                    })
                    // console.log("当前是否需要显示触摸提示",aniEndCanClick, this.isOutputConnected(1) , this.properties.aniClickReplay )
                    if(this.isOutputConnected(1) || this.properties.aniClickReplay){
                        //监听点击事件
                        codeNode.checkAddComponent('SpinePlusComponent')
                        if(aniEndCanClick == false){    //如果等于true时是结束才显示
                            //看看是否需要显示提示点击
                            console.log(this.getRealLinkNode().properties.customeName, '当前是否需要等待显示点击', this.getInputOrProperty('isCanClick'), this.hasLinkIsCanClick())
                            if(this.getInputOrProperty('isCanClick') == true){
                                this.showClickTip()
                            }else{
                                if(this.hasLinkIsCanClick() == true){
                                    this.waitCanClick = true
                                }
                            }
                        }
                        //一进来就要开始等待时间才能点击
                        // if(this.properties.aniClickTimeSpace > 0){
                        //     this.curWaitTime = this.properties.aniClickTimeSpace
                        // }
                        codeNode.on(cc.Node.EventType.TOUCH_END, this.onClick.bind(this))
                    }
                }
            }else{
                console.warn('当前没有关联codeNode')
            }
        }else if(action = '停止'){
            this.mode = LiteGraph.ON_EVENT
            var codeNode = this.getInputData(0, true)
            this.waitCanClick = false
            if(codeNode != null){
                codeNode.pauseAnimation()
            }
        }
        //暂时调用网页提醒
        //提供接入cocos的提示，或者是ant的消息提示
        //需要一个统一的接入管理器
	}

    //点击事件拎出来，方便记录调用
    onClick(){
        if(CocosMgr.isInApp == false){
            if(window.onGraphNodeClick != null){
                window.onGraphNodeClick({nodeId: this.getIdWithGraph(),  time: this.graph.getTime(), funcName: 'onClick'})
            }
        }
        var codeNode = this.getInputData(0, true)
        if(codeNode == null){
            console.warn('点击的时候codeNode为空了')
            return
        }
        if(this.graph.config.pause == 1){
            return
        }
        if(this.properties.aniEndCanClick == false){
            //直接可以点击
        }else{
            //等待动画结束了才能点击
            if(this.aniEnd != true){
                console.log('点击了但动画没有播放结束')
                return
            }
        }
        
        let isCanClick = this.getInputOrProperty('isCanClick')
        // console.log(this, "isCanClick", isCanClick, this.properties.aniClickTimeSpace, this.properties.aniClickReplay)
        if(isCanClick != true){//可能为空所以不为true就不响应点击
            return
        }

        if(this.curWaitTime != null){
            //当前在等待点击
            console.log('当前需等待点击间隔', this.curWaitTime)
            return
        }

        if(this.properties.aniClickTimeSpace > 0){
            this.curWaitTime = this.properties.aniClickTimeSpace
        }
        codeNode.targetOff()
        if(this.properties.clickWait == true){
            this.clickWaitOutPut = true
        }else{
            this.triggerSlot(1, codeNode)
            this.hideClickTip()
        }
        if(this.properties.aniClickReplay == true){
            this.onAction('播放')
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
            }
        }
        //等待进入可点击状态再显示触摸提示
        if(this.waitCanClick == true){
            let isCanClick = this.getInputOrProperty('isCanClick')
            // console.log(this, "isCanClick", isCanClick, this.properties.aniClickTimeSpace, this.properties.aniClickReplay)
            if(isCanClick == true){//可能为空所以不为true就不响应点击
                this.showClickTip()
                this.waitCanClick = false
            }
        }
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

animate.title = '骨骼动画'
animate.modalEnum = ['全设置','仅设置皮肤','仅设置动画']
LiteGraph.registerNodeType("objects/animates/animate", animate);




//现在的动画编辑起来还是太复杂，下一步新增记录模式，直接记录object修改的属性并切换
class tween extends BaseYWNode {
    // Name to show
    title = "数值动画"
    desc = "用于控制节点属性变化";   //不会在显示节点中用到，仅仅在代码中的解释
    // color= '#510'

    constructor() {
        super()
        this.mode = LiteGraph.ON_EVENT;     //设置触发模式
        // this.serialize_widgets = true
        // this.size = [80, 30];               //设置默认节点尺寸
        // this.addInput("触发", "number")   //增加一个输入触点，  输入触点的名称， 值类型
    //   this.addInput("B", "number")
        // this.addOutput("bool", "boolean")   //增加一个输出触点，  输出节点的名称， 值类型
        // this.addProperty("msg", "");   //增加一个变量，    变量名称， 变量名称
        this.addInput("物体", "codeNode")
        this.addInput("播放", LiteGraph.ACTION);

        this.addOutput("结束", LiteGraph.EVENT);
        this.addOutput("点击", LiteGraph.EVENT);

        this.addProperty('duration', 1, 'number')
        this.addWidget('number', '动画时长', this.properties.duration, 'duration',  {precision: 1, min: 0, max: 60})

        this.addProperty('delay', 0, 'number')
        this.addWidget('number', '延迟播放时间', this.properties.delay, 'delay',  {precision: 1, min: 0, max: 60})

        this.addProperty('easing', '无', 'enum')
        this.addWidget('combo', '缓动效果', this.properties.easing, {property: "easing", values: tween.easingEnum })

        this.addProperty('tweenMode', '变化目标值', 'enum')
        this.addWidget('combo', '动画模式', this.properties.tweenMode, {property: "tweenMode", values: tween.tweenModeEnum })
        this.addProperty('dontTween', false, 'boolean')
        this.addWidget('toggle', '无动画直接修改值', this.properties.dontTween, 'dontTween')


        this.addProperty('cancelEvent', false, 'boolean')
        this.addWidget('toggle', '取消其他触摸事件', this.properties.cancelEvent, 'cancelEvent')

        this.addProperty('cancelOtherTween', false, 'boolean')
        this.addWidget('toggle', '打断其它数值动画', this.properties.cancelOtherTween, 'cancelOtherTween')

        this.addProperty('autoRun', false, 'boolean')
        this.addWidget('toggle', '是否自动播放', this.properties.autoRun, 'autoRun')

        this.addProperty('x', 0, 'number')
        this.addWidget('number', '坐标-x', this.properties.x, 'x',  {precision: 1})
        this.addProperty('y', 0, 'number')
        this.addWidget('number', '坐标-y', this.properties.y, 'y',  {precision: 1})

        this.addProperty('scaleX', 1, 'number')
        this.scaleXWidget = this.addWidget('number', '缩放-x', this.properties.scaleX, 'scaleX',  {precision: 1})
        this.addProperty('scaleY', 1, 'number')
        this.scaleYWidget = this.addWidget('number', '缩放-y', this.properties.scaleY, 'scaleY',  {precision: 1})

        this.addProperty('opacity', 255, 'number')
        this.addWidget('number', '透明度', this.properties.opacity, 'opacity',  {precision: 0, min: -255, max: 255})

        this.addProperty('angle', 0, 'number')
        this.addWidget('number', '角度', this.properties.angle, 'angle', {min: -360, max: 360, precision: 0})

        this.addProperty('anchorX', 0.5, 'number')
        this.addWidget('number', '锚点x', this.properties.anchorX, 'anchorX', {min: -1, max: 1, precision: 1, step2: 0.1})

        this.addProperty('anchorY', 0.5, 'number')
        this.addWidget('number', '锚点y', this.properties.anchorY, 'anchorY', {min: -1, max: 1, precision: 1, step2: 0.1})
        
        this.addProperty('width', 50, 'number')
        this.widthWidget = this.addWidget('number', '宽度', this.properties.width, 'width',     {precision: 0, min: 0, max: 9999})
        this.addProperty('height', 50, 'number')
        this.heightWidget = this.addWidget('number', '高度', this.properties.height, 'height',  {precision: 0, min: 0, max: 9999})


        this.addProperty('color', '#ffffff', 'string')
        this.addWidget('string', '物体颜色', this.properties.color, 'color')

        this.addProperty("zoomRatio", 1, 'number')
        this.addWidget("number","镜头缩放", this.properties.zoomRatio ,"zoomRatio", {precision: 1, min: 1, max: 10, step2: 0.01});  //增加一个控件用于修改变量，  类型，显示名称，默认值，要修改的变量的名称)
       

        //节点配置
        this.addProperty('nodeConfig',  {
            x: this.properties.x, 
            y: this.properties.y,
            width: this.properties.width,
            height: this.properties.height,
            anchorX: this.properties.anchorX,
            anchorY: this.properties.anchorY,
            scaleX: this.properties.scaleX,
            scaleY: this.properties.scaleY,
            color: this.properties.color,
            angle:  this.properties.angle,
        }, 'object')
        this.nodeConfigWidget = this.addWidget('ccnode', '节点操控', this.properties.nodeConfig, 'nodeConfig', { viewWidth: CocosMgr.designViewWidth, viewHeight: CocosMgr.designViewHeight })

        this.addWidget('button','同步目标物体属性', "", ()=>{
            // this.getEnums()
            this.syncTargetValue()
            this.sendBtnWidgetClickEvent('同步目标物体属性')
        })

        this.addWidget('button','重置变化多少值', "", ()=>{
            // this.getEnums()
            this.setProperty('x', 0)
            this.setProperty('y', 0)
            this.setProperty('width', 0)
            this.setProperty('height', 0)
            this.setProperty('anchorX', 0)
            this.setProperty('anchorY', 0)
            this.setProperty('scaleX', 0)
            this.setProperty('scaleY', 0)
            this.setProperty('opacity', 0)
            this.setProperty('color', '#000000')
            this.setProperty('angle', 0)
            this.setProperty('zoomRatio', 0)
        })

        this.addWidget('button','预览动画', "", ()=>{
            if(this.previewTween != null){
                this.syncTargetValue(this.previewTween)
                this.realRun(this.previewTween, '播放')
            }
        })
        //仅设置皮肤时，不会影响当前动画播放状态，结束和点击将不会进行输出，也不会取消原来动画绑定的点击事件结束事件
        //当多个Spine类型的物体连接到这个组件，可以实现一个此Robot控制多个物体播放相同的动画


        // this.widget = this.addWidget("text", "Text", "", "msg");
        // this.widgets_up = true;
        // this.size = [200, 30];


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
    
    //连接到物体时从物体上获取动画信息
    onConnectInput(inputIndex, outPutType, output, linkedNode, outputIndex){
        console.log('onConnectInput', inputIndex, outPutType, output, linkedNode, outputIndex)
        if(outPutType == 'codeNode'){
            // if(linkedNode._renderSpine != null){
            //     this._skins.splice(0, this._skins.length, ...linkedNode._renderSpine.skins())
            //     this._animations.splice(0, this._animations.length, ...linkedNode._renderSpine.animations())
            // }
            if(linkedNode.type == 'objects/camera'){
                if(linkedNode.codeNode != null){
                    setTimeout(() => {
                        this.syncTargetValue()
                    }, 100);
                }
            }
        }
        this.sendConnectEvent(inputIndex, linkedNode, outputIndex)
    }

    // onConfigure(){
    //     // this.getEnums()
    // }
    onSelected(){
        // this.getEnums()
        if(this.previewTween == null){
            let target = this.getRealLinkNode()
            if(target == null){
                return
            }
            if(target.codeNode != null && cc.isValid(target.codeNode.node)){
                // console.log('target.codeNode', target.codeNode)
                var previewNode = cc.instantiate(target.codeNode.node)
                previewNode.isClone = true
                previewNode.zIndex = 9999
                this.previewTween = previewNode.getComponent('CodeNodeLg')
                if(this.previewTween != null){
                    this.previewTween.init()
                    this.previewTween.parent = target.codeNode.parent
                    this.previewTween.nodeName += '_preview'
                    CocosMgr.syncConfigToCodeNode(this.previewTween, this.properties.nodeConfig)
                    this.previewTween.updatePreview()
                }else{
                    console.warn('获取到了无效节点', previewNode)
                }
            }
        }
        this.sendOtherEvent('onSelected')
    }

    onDeselected(){
        if(this.previewTween != null){
            this.previewTween.destroyNode()
            this.previewTween = null
        }
    }

    //当所有创建物体初始化完成后触发
    onStart(){
        console.log('animate onStart', this.properties.autoRun)
        var autoRun = this.properties.autoRun
        if(autoRun == true){
            this.onAction('播放')
        }
        super.onStart()
    }

    onStop(){
        this.onAction('停止')
    }

    //当扩展切换
    // onWidgetChanged(name, value, oldValue, widget){
    //     // console.log('onWidgetChanged', name, value, oldValue, widget)
    //     // var curLink = this.getInputLink(0)
    //     // if(curLink == null){
    //     //     return
    //     // }
    //     // var target = this.graph.getNodeById(curLink.origin_id)
    //     // if(target == null){
    //     //     return
    //     // }
    //     // // console.log('curLink', curLink, target)
    //     // if(name == '选择皮肤'){
           
    //     // }
    // }


    //全部放置在canvas下
    //在子蓝图中无法获取到连接的物体，需要多一层查找
    // getRealLinkNode(){
    //     var curLink = this.getInputLink(0)
    //     if(curLink == null){
    //         return null   
    //     }
    //     if(this.graph._is_subgraph == true){
    //         let inputNode = this.graph.getNodeById(curLink.origin_id)
    //         let inputIndex = this.graph._subgraph_node.inputs.findIndex((solt)=>{
    //         return solt.name == inputNode.properties.name
    //         })
    //     //    console.log('getRealLinkNode', inputIndex, inputNode.properties.name, this.graph._subgraph_node.inputs)
    //         if(inputIndex != -1){
    //         let exLink = this.graph._subgraph_node.getInputLink(inputIndex)
    //         if(exLink == null){
    //             return null
    //         }
    //         return this.graph._subgraph_node.graph.getNodeById(exLink.origin_id)
    //         }
    //     }else{
    //         return this.graph.getNodeById(curLink.origin_id)
    //     }
    // }

    // 获取id，如果当前是在子图下，加上子图节点的id
    // getIdWithGraph(){
    //     if(this.graph == null){
    //     return this.id
    //     }
    //     if(this.graph._subgraph_node != null){
    //     return this.id + '_' + this.graph._subgraph_node.id
    //     }
    //     return this.id
    // }



    syncTargetValue(codeNode){
        let target = this.getRealLinkNode()
        if(target == null){
            return
        }
        if(target.widgets){
            // console.log('syncTargetValue',target.widgets)
            for(var i = 0; i < target.widgets.length; i++){
                var targetWidget = target.widgets[i]
                if(targetWidget.type == 'ccnode'){
                    for(var key in targetWidget.value){
                        let index = this.widgets.findIndex((w)=>{
                            return w.options.property == key
                        })
                        if(index != -1){
                            if(codeNode != null){
                                codeNode[this.widgets[index].options.property] = targetWidget.value[key]
                            }else{
                                this.widgets[index].setValue(targetWidget.value[key], {e: null, node: this, canvas: null })
                            }
                        }
                    }
                    continue
                }
                var index = this.widgets.findIndex((w)=>{
                    return w.name == targetWidget.name
                })
                if(index != -1){
                    if(codeNode != null){
                        codeNode[this.widgets[index].options.property] = targetWidget.value
                    }else{
                        this.widgets[index].setValue(targetWidget.value, {e: null, node: this, canvas: null })
                    }
                }
            }
        }
    }

    onPropertyChanged(property, value, oldValue){
        if(property != 'nodeConfig'){
            //  console.log('this.nodeConfigWidget', this.nodeConfigWidget)
            if(typeof this.nodeConfigWidget.value == 'object'){
                if(this.nodeConfigWidget.value[property] != null){
                    this.nodeConfigWidget.value[property] = value
                    this.properties.nodeConfig[property] = value
                }
                if(property == 'zoomRatio' && value != 0){
                    if(this.nodeConfigWidget.value['scaleX'] != null){
                        this.nodeConfigWidget.value['scaleX'] = 1 /  value
                        this.properties.nodeConfig['scaleX'] = 1 / value
                        this.nodeConfigWidget.value['scaleY'] = 1 /  value
                        this.properties.nodeConfig['scaleY'] = 1 /  value
                    }
                    this.scaleXWidget.value = 1 /  value
                    this.scaleYWidget.value = 1 /  value
                    this.properties.scaleX = 1 /  value
                    this.properties.scaleY = 1 /  value
                }
            }
        }
        if(this.previewTween != null){
            var config = {}
            if(property == 'nodeConfig'){
                config = {...value}
            }else{
                config[property] = this.properties[property]
            }
            // console.log('更新节点配置', config, value)
            CocosMgr.syncConfigToCodeNode(this.previewTween, config)
        }
        this.sendPropertyChangeEvent(property, value, oldValue)
    }

    onWidgetChanged(name, value, oldValue, widget){
        // var property = widget.options.property
        // console.log('onWidgetChanged', name, value, oldValue, property)
        // if(property != 'nodeConfig'){
        //     //  console.log('this.nodeConfigWidget', this.nodeConfigWidget)
        //     if(typeof this.nodeConfigWidget.value == 'object'){
        //         if(this.nodeConfigWidget.value[property] != null){
        //             this.nodeConfigWidget.value[property] = value
        //             this.properties.nodeConfig[property] = value
        //             // console.log('修改了nodeCondig的颜色值', this.nodeConfigWidget.value)
        //         }
        //         if(property == 'zoomRatio'){
        //             if(this.nodeConfigWidget.value['scaleX'] != null){
        //                 this.nodeConfigWidget.value['scaleX'] = 1 /  value
        //                 this.properties.nodeConfig['scaleX'] = 1 / value
        //                 this.nodeConfigWidget.value['scaleY'] = 1 /  value
        //                 this.properties.nodeConfig['scaleY'] = 1 /  value
        //             }
        //             this.scaleXWidget.value = 1 /  value
        //             this.scaleYWidget.value = 1 /  value
        //             this.properties.scaleX = 1 /  value
        //             this.properties.scaleY = 1 /  value
        //         }
        //     }
        // }

        // console.log('onWidgetChanged', name, value, oldValue, widget)

        // if(this.previewTween != null){
        //     var config = {}
        //     if(property == 'nodeConfig'){
        //         config = {...value}
        //     }else{
        //         config[property] = this.properties[property]
        //     }
        //     // console.log('更新节点配置', config, value)
        //     CocosMgr.syncConfigToCodeNode(this.previewTween, config)
        // }
    }

    //动态返回卡片显示的title
    // getTitle() {
    //    return this.title
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

    realRun(codeNode){
        let delay = this.properties.delay
        let duration = this.properties.duration
        let easing = this.properties.easing
        let dontTween = this.properties.dontTween
        let cancelOtherTween = this.properties.cancelOtherTween
        let cancelEvent = this.properties.cancelEvent
        let tweenMode = this.properties.tweenMode
        let props = {...this.properties.nodeConfig}

        // console.log('当前的颜色值', props.color)
        var color = cc.Color.WHITE.fromHEX(props.color)
        props.r = color.getR()
        props.g = color.getG()
        props.b = color.getB()
        props.opacity = this.properties.opacity

        delete props['color']
        
        // let props = {x:this.properties.x, y: this.properties.y}

        //构建缓动模式
        if(easing != '无'){
            var index = tween.easingEnum.indexOf(easing)
            if(index != -1){
                easing = {easing: tween.easingConfig[index]}
            }else{
                easing = {}
            }
        }else{
            easing = {}
        }

        this.aniEnd = false
        this.inRun = true

        if(cancelOtherTween == true){ 
            cc.Tween.stopAllByTarget(codeNode)
            cc.Tween.stopAllByTarget(codeNode.node)   //有的脚本组件是直接控制node的动画的，也要取消掉
        }
        if(cancelEvent == true){ 
            codeNode.targetOff()
        }


        if(dontTween == true){
            this.aniEnd = true
            this.inRun = false
            CocosMgr.syncConfigToCodeNode(codeNode, props)
        }else{
            console.log('开始播放动画', duration, JSON.parse(JSON.stringify(props)), easing)
            this.tweenTag = 'tween_' + this.getIdWithGraph()
            console.log('当前graphid tweenTag', this.graph.id, this.tweenTag)
            cc.Tween.stopAllByTag(this.tweenTag)
            if(codeNode.camera != null){
                props['zoomRatio'] = this.properties.zoomRatio
            }
            if(tweenMode == '变化目标值'){
                //变化到目标值，剔除不需要改变的属性
                console.log('目标值', )
                CocosMgr.xorConfig(codeNode, props)
                console.log('剔除掉之后的值', props)
                this.tween = cc.tween(codeNode).tag(this.tweenTag).delay(delay).to(duration, props, easing).call(() => {
                   this.triggerSlot(0, codeNode)
                   this.aniEnd = true
                   this.inRun = false
                }).start();
            }else if(tweenMode == '变化多少值'){
                CocosMgr.xorConfigZeroValue(props)
                console.log('剔除掉0值之后的值', props)
                this.tween = cc.tween(codeNode).tag(this.tweenTag).delay(delay).by(duration, props, easing).call(() => {
                    this.triggerSlot(0, codeNode)
                    this.aniEnd = true
                    this.inRun = false
                }).start();
            }
        }

        
        if(this.isOutputConnected(1)){
            //监听点击事件
            codeNode.checkAddComponent('SpinePlusComponent')
            codeNode.on(cc.Node.EventType.TOUCH_END, this.onClick.bind(this))
        }
    }

    // 当节点Toggle时调用
    onAction(action, param)
	{
        // console.log("action", action, param)
        if(action == '播放'){
            var codeNode = this.getInputData(0, true)
            // console.log('当前tween目标物体', codeNode)
            if(codeNode != null){
               this.realRun(codeNode)
            }else{
                console.warn('当前没有关联codeNode')
            }
        }else if(action == '停止'){
            this.tweenTag = 'tween_' + this.getIdWithGraph()
            cc.Tween.stopAllByTag(this.tweenTag)
        }
        //暂时调用网页提醒
        //提供接入cocos的提示，或者是ant的消息提示
        //需要一个统一的接入管理器
	}

    onClick(){
        if(CocosMgr.isInApp == false){
            if(window.onGraphNodeClick != null){
                window.onGraphNodeClick({nodeId: this.getIdWithGraph(),  time: this.graph.getTime(), funcName: 'onClick'})
            }
        }
        var codeNode = this.getInputData(0, true)
        if(codeNode == null){
            console.warn('点击时codeNode == null')
            return
        }
        if(this.graph.config.pause == 1){
            return
        }
        if(this.aniEnd == true){
            codeNode.targetOff()
            this.triggerSlot(1, codeNode)
        }
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

tween.title = '数值动画'
tween.easingEnum = ['无','淡入','淡出','淡入淡出','回弹','弹跳']
tween.easingConfig = ['none', 'quadIn', 'quadOut', 'quadInOut', 'backOut', 'bounceOut']
tween.tweenModeEnum = ['变化目标值','变化多少值']
LiteGraph.registerNodeType("objects/animates/tween", tween);



class bezierCurve extends BaseYWNode {
    // Name to show
    title = "路径动画"
    desc = "用于控制节点进行曲线移动";   //不会在显示节点中用到，仅仅在代码中的解释
    // color= '#510'

    constructor() {
        super()
        this.mode = LiteGraph.ON_EVENT;     //设置触发模式
        // this.serialize_widgets = true

        // this.size = [80, 30];               //设置默认节点尺寸
        // this.addInput("触发", "number")   //增加一个输入触点，  输入触点的名称， 值类型
    //   this.addInput("B", "number")
        // this.addOutput("bool", "boolean")   //增加一个输出触点，  输出节点的名称， 值类型
        // this.addProperty("msg", "");   //增加一个变量，    变量名称， 变量名称
        this.addInput("物体", "codeNode")
        this.addInput("长度", 'number');

        this.addInput("播放", LiteGraph.ACTION);
        this.addInput("重置位置", LiteGraph.ACTION);


        this.addOutput("结束", LiteGraph.EVENT);
        // this.addOutput("点击", LiteGraph.EVENT);

        this.addProperty('points', [0,0 , 200,200 , 400,0], 'array')
        this.curveWidget = this.addWidget('curve', '曲线控制点', this.properties.points, 'points',  { viewWidth: CocosMgr.designViewWidth, viewHeight: CocosMgr.designViewHeight })

        // this.addProperty('selectPoint', 0, 'number')
        this.selectCtrl = this.addWidget('number', '选择控制点', -1, (value)=>{
            // console.log('选择控制点', value)
            this.properties.selectPoint = value
            this.curveWidget.selectPoint = value
        },  {precision: 0, min: -1, max: this.properties.points.length / 2 - 1 })

        this.addWidget('button','', "", (btnWidget)=>{
            if(btnWidget.clickeName == '删除控制点'){
                this.curveWidget.remonveCtrlPoint(this)
                this.selectCtrl.options.max = this.properties.points.length / 2 - 1
            }else if(btnWidget.clickeName == '添加控制点'){
                this.curveWidget.addCtrlPoint(this)
                // console.log('this.properties.points.length', this.properties.points.length)
                this.selectCtrl.options.max = this.properties.points.length / 2 - 1
            }
        }, {buttons: ['删除控制点', '添加控制点']})

        // this.addWidget('button','删除选中控制点', "", ()=>{
        //     this.curveWidget.remonveCtrlPoint(this)
        //     // console.log('this.properties.points.length', this.properties.points.length)
        //     this.selectCtrl.options.max = this.properties.points.length / 2 - 1
        // })

        // this.addWidget('button','添加控制点', "", ()=>{
            
        // })
    
        

        // this.addWidget('number', '曲线控制点', this.properties.duration, 'duration',  {precision: 1, min: 0, max: 60})

        this.addProperty('startT', 0, 'number')
        this.addWidget('slider', '起始位置', this.properties.startT, 'startT',  {precision: 2, min: 0, max: 1, step2: 0.01})
        this.addProperty('endT', 1, 'number')
        this.addWidget('slider', '终点位置', this.properties.endT, 'endT',  {precision: 2, min: 0, max: 1, step2: 0.01})

        // this.addProperty('easing', '无', 'enum')
        // this.addWidget('combo', '缓动效果', this.properties.easing, {property: "easing", values: tween.easingEnum })

        this.addProperty('aniType', '随步长', 'enum')
        this.addWidget('combo', '动画模式', this.properties.aniType, {property: "aniType", values: bezierCurve.tweenModeEnum })
        // 【随步长】输入一次根据步长增加移动位置的百分比，不停的输入直至移动到终点位置\n
        // 【随时间】输入后自动根据时间从起始位置运行到终点位置\n 
        // 【随长度】根据输入的数值移动对应长度

        this.addProperty('duration', 1, 'number')
        this.durationWidget = this.addWidget('slider', '动画时长', this.properties.duration, 'duration',  {precision: 1, min: 0, max: 60, step2: 0.1})

        this.addProperty('oneStep', 0.01, 'number')
        this.oneStepWidget = this.addWidget('slider', '动画步长', this.properties.oneStep, 'oneStep',  {precision: 2, min: 0, max: 1, step2: 0.01})


        this.addProperty('lookUp', false, 'boolean')
        this.addWidget('toggle', '角度跟随路径', this.properties.lookUp, 'lookUp')

        this.addProperty('startResetT', false, 'boolean')
        this.addWidget('toggle', '开始运行时重置', this.properties.startResetT, 'startResetT')

        this.addProperty('autoRun', false, 'boolean')
        this.addWidget('toggle', '是否自动播放', this.properties.autoRun, 'autoRun')

        this.addWidget('button','预览动画', "", ()=>{
           if(this.previewTween != null){
               this.realRun(this.previewTween, '播放')
           }
        })
        //节点配置
        // this.addProperty('nodeConfig',  {
        //     x: this.properties.x, 
        //     y: this.properties.y,
        //     width: this.properties.width,
        //     height: this.properties.height,
        //     anchorX: this.properties.anchorX,
        //     anchorY: this.properties.anchorY,
        //     scaleX: this.properties.scaleX,
        //     scaleY: this.properties.scaleY,
        //     color: this.properties.color,
        //     angle:  this.properties.angle,
        // }, 'object')
        // this.nodeConfigWidget = this.addWidget('ccnode', '节点操控', this.properties.nodeConfig, 'nodeConfig',  { viewWidth: CocosMgr.designViewWidth, viewHeight: CocosMgr.designViewHeight })

        // this.addWidget('button','同步目标物体属性', "", ()=>{
        //     // this.getEnums()
        //     this.syncTargetValue()
        // })
        //仅设置皮肤时，不会影响当前动画播放状态，结束和点击将不会进行输出，也不会取消原来动画绑定的点击事件结束事件
        //当多个Spine类型的物体连接到这个组件，可以实现一个此Robot控制多个物体播放相同的动画


        // this.widget = this.addWidget("text", "Text", "", "msg");
        // this.widgets_up = true;
        // this.size = [200, 30];


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
    
    //连接到物体时从物体上获取动画信息
    onConnectInput(inputIndex, outPutType, output, linkedNode, outputIndex){
        console.log('onConnectInput', inputIndex, outPutType, output, linkedNode, outputIndex)
        if(outPutType == 'codeNode'){
            // if(linkedNode._renderSpine != null){
            //     this._skins.splice(0, this._skins.length, ...linkedNode._renderSpine.skins())
            //     this._animations.splice(0, this._animations.length, ...linkedNode._renderSpine.animations())
            // }
        }
        this.sendConnectEvent(inputIndex, linkedNode, outputIndex)
    }

    onAdded(){
         this.updateWidght()
         this.sendAddEvent()
    }
    onConfigure(){
         this.updateWidght()
    }

    // onConfigure(){
    //     // this.getEnums()
    // }
    onSelected(){
        // this.getEnums()
        if(this.previewTween == null){
            var target = this.getRealLinkNode()
            if(target == null){
                return
            }
            if(target.codeNode != null && cc.isValid(target.codeNode.node)){
                var previewNode = cc.instantiate(target.codeNode.node)
                previewNode.isClone = true
                previewNode.zIndex = 9999
                this.previewTween = previewNode.getComponent('CodeNodeLg')
                this.previewTween.init()
                this.previewTween.parent = target.codeNode.parent
                this.previewTween.curve = new Bezier(this.properties.points)
                this.length = this.previewTween.curve.length()
                this.previewTween.t = this.properties.startT
                // CocosMgr.syncConfigToCodeNode(this.previewTween, this.properties.nodeConfig)
            }
        }
        this.sendOtherEvent('onSelected')
    }

    onDeselected(){
        if(this.previewTween != null){
            this.previewTween.destroyNode()
            this.previewTween = null
        }
    }

    //当所有创建物体初始化完成后触发
    onStart(){
        console.log('animate onStart', this.properties.autoRun)
        this.length = new Bezier(this.properties.points).length() * 2
        this.t = 0

        var autoRun = this.properties.autoRun
        if(autoRun == true){
            this.onAction('播放')
        }
        super.onStart()
    }

    onStop(){
        this.onAction('停止')
    }

    updateWidght(){
        let aniType = this.properties.aniType
        this.durationWidget.disabled = false
        this.oneStepWidget.disabled = false
        if(aniType == '随长度'){
            this.durationWidget.disabled = true
            this.oneStepWidget.disabled = true
        }else if(aniType == '随时间'){
             this.oneStepWidget.disabled = true
        }else if(aniType == '随步长'){
             this.durationWidget.disabled = true
             
        }
    }

    onWidgetChanged(name, value, oldValue, widget){
        var property = widget.options.property
        // console.log('onWidgetChanged', name, value, oldValue, property)
        if(property != 'nodeConfig'){
            //  console.log('this.nodeConfigWidget', this.nodeConfigWidget)
            // if(typeof this.nodeConfigWidget.value == 'object'){
            //     if(this.nodeConfigWidget.value[property] != null){
            //         this.nodeConfigWidget.value[property] = value
            //         this.properties.nodeConfig[property] = value
            //         // console.log('修改了nodeCondig的颜色值', this.nodeConfigWidget.value)
            //     }
            // }
        }
        if(name == '动画模式'){
            this.updateWidght()
        }

        if(name == '曲线控制点'){
            this.properties.points = value
            this.selectCtrl.value = this.curveWidget.selectPoint
            if(this.previewTween != null){
                this.previewTween.curve = new Bezier(this.properties.points)
                this.length = this.previewTween.curve.length()
                this.previewTween.t = this.properties.startT
            }else{
                console.log('当前没有previewTween')
            }
        }

        if(name == '起始位置' || name == '终点位置'){
            if(this.previewTween != null){
                this.previewTween.t = this.properties.startT
            }
        }

        // if(this.previewTween != null){
        //     var config = {}
        //     if(property == 'nodeConfig'){
        //         config = {...value}
        //     }else{
        //         config[property] = this.properties[property]
        //     }
        //     // console.log('更新节点配置', config, value)
        //     CocosMgr.syncConfigToCodeNode(this.previewTween, config)
        // }
    }

    //动态返回卡片显示的title
    // getTitle() {
    //    return this.title
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

    realRun(codeNode, action){
        if(action == '播放'){
            let duration = this.properties.duration
            let lookUp = this.properties.lookUp
            let aniType = this.properties.aniType
            let startResetT = this.properties.startResetT
            let endT = this.properties.endT

            // '随步长','随时间','随长度'
            codeNode.lookUp = lookUp
            if(codeNode.curve == null){
                var curve = new Bezier(this.properties.points)
                this.length = curve.length()
                codeNode.curve = curve 
            }
            if(aniType == '随长度'){
                var value = this.getInputData(1) || 0
                let oneStep = value / this.length
                console.log('输入的value / lenght', value, this.length, oneStep)
                codeNode.t += oneStep
            }else if(aniType == '随步长'){
                let oneStep = this.properties.oneStep
                codeNode.t += oneStep * 0.01
            }else if(aniType == '随时间'){
                if(startResetT == true){
                    codeNode.t = this.properties.startT
                }
                cc.Tween.stopAllByTag(this.tweenTag)
                this.tweenTag = 'curve_' + codeNode.node._id
                cc.tween(codeNode).tag(this.tweenTag).to(duration, {t: endT}).call(()=>{
                    // this.outputHandle('number1', codeNode)
                    this.triggerSlot(0, codeNode)
                }).start()
                // console.log('运行了动画', tween.tag, duration, this.properties.startT, endT)
            }
            this.t = codeNode.t
            if(codeNode.t == 1){
                this.triggerSlot(0, codeNode)
            }
        }else if(action == '重置位置'){
            //重置位置
            this.end = false
            var curve = new Bezier(this.properties.points)
            this.length = curve.length()
            codeNode.curve = curve 
            codeNode.t = this.properties.startT * 0.01 
        }else if(action == '停止'){
            cc.Tween.stopAllByTag(this.tweenTag)
        }
    }

    // 当节点Toggle时调用
    onAction(action, param)
	{
        // console.log("action", action, param)
        let codeNode = this.getInputData(0, true)
        if(codeNode == null){
            console.warn('当前没有关联codeNode')
            return
        }        
        this.realRun(codeNode, action)
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

bezierCurve.title = '路径动画'
// bezierCurve.easingEnum = ['无','淡入','淡出','淡入淡出','回弹','弹跳']
// bezierCurve.easingConfig = ['none', 'quadIn', 'quadOut', 'quadInOut', 'backOut', 'bounceOut']
bezierCurve.tweenModeEnum = ['随步长','随时间','随长度']
LiteGraph.registerNodeType("objects/animates/bezierCurve", bezierCurve);



//自定义脚本组件
class camera extends BaseYWNode {
    // Name to show
    title = "镜头"
    desc = "在绘本中使用镜头位移效果";   //不会在显示节点中用到，仅仅在代码中的解释
    color = '#3F42EA'
    // color= '#510'
    

    constructor() {
        super()
        // this.serialize_widgets = true
        // this.mode = LiteGraph.ON_EVENT;     //设置触发模式
        // this.size = [80, 20];               //设置默认节点尺寸
        // this.getInputData(0, true)
        // this.addInput("触发", "number")   //增加一个输入触点，  输入触点的名称， 值类型
        
        // this.addInput("scale", "number")
        // this.addProperty("scale", 0, 'number');   //增加一个变量，    变量名称， 变量名称
        // this.addWidget("number","缩放倍数", this.properties.scale ,"scale", {precision: 1});  //增加一个控件用于修改变量，  类型，显示名称，默认值，要修改的变量的名称)
        this.priority = -999 //放在最前执行
        this.widgets_up = true
        // this.addInput("启用", LiteGraph.ACTION);
        // this.addInput("隐藏", LiteGraph.ACTION);
        this.addOutput("物体", 'codeNode')
        this.addProperty('x', 0, 'number');   //增加一个变量，    变量名称， 变量名称
        this.addWidget('number', '坐标-x', this.properties.x, 'x',  {precision: 1})

        this.addProperty("y", 0, 'number');   //增加一个变量，    变量名称， 变量名称
        this.addWidget('number', '坐标-y', this.properties.y, 'y',  {precision: 1})

        this.addProperty("zoomRatio", 1, 'number');   //增加一个变量，    变量名称， 变量名称
        this.addWidget("number","镜头缩放", this.properties.zoomRatio ,"zoomRatio", {precision: 1, min: 1, max: 10, step2: 0.01});  //增加一个控件用于修改变量，  类型，显示名称，默认值，要修改的变量的名称)

         //节点配置
        this.addProperty('nodeConfig',  {
            x: 0, 
            y: 0,
            width: CocosMgr.designViewWidth,
            height: CocosMgr.designViewHeight,
            anchorX: 0.5,
            anchorY: 0.5,
            scaleX: 1,
            scaleY: 1,
            color: '#3F42EA',
            angle: 0,
        }, 'object')    ////仅仅绘制边框
        this.nodeConfigWidget = this.addWidget('ccnode', '节点操控', this.properties.nodeConfig, 'nodeConfig',  { viewWidth: CocosMgr.designViewWidth, viewHeight: CocosMgr.designViewHeight, justDrawBorder: true, borderColor: '#3F42EA' })
        this.addWidget('button', '重置到默认状态', "", ()=>{
            // console.log("点击了重置属性")
            this.setProperty('x', 0)
            this.setProperty('y', 0)
            this.setProperty('zoomRatio', 1)
        })
    }

    //创建一个物体
    createObj(loadCb){
        if(this.codeNode != null){
            // console.log('我删除了旧的codeNode', this.codeNode.node._id)
            this.codeNode.destroyNode()
            this.codeNode = null
            this.setOutputData(0, null)
            if(this.cameraUi != null){
                if(cc.isValid(this.cameraUi)){
                    this.cameraUi.destroy()
                    this.cameraUi = null
                }
            }
        }
        if(this.codeNode != null){
            if(cc.isValid(this.codeNode.node) == true){
                // if(CocosMgr.isInApp == true){
                //不重复生成，仅仅重置所有参数
                var config = {...this.properties.nodeConfig}
                config.zoomRatio = this.properties.zoomRatio
                // console.log('更新节点配置', config, value)
                CocosMgr.syncConfigToCodeNode(this.codeNode, config)

                if(loadCb != null){
                    loadCb()
                }
                this.setOutputData(0, this.codeNode)
                return
            }
            this.codeNode = null
            this.setOutputData(0, null)
        }
        var config = {...this.properties.nodeConfig}
        var rootccNode = this.graph.vars.rootccNode
        if(rootccNode != null){
            config['parent'] = rootccNode
        }
        // console.log('createObj config', config)  //调用一个创建物体的配置
        this.codeNode = CocosMgr.createObj(config, loadCb)
        this.codeNode.nodeName = 'Camera'
        // console.error("是否创建真实camera", CocosMgr.isPreviewMode, rootccNode)
        if(CocosMgr.isPreviewMode == true){
            var ctx = this.codeNode.checkAddComponent(cc.Graphics)
            this.codeNode.ctx = ctx
            this.codeNode.zIndex = 99999
            this.codeNode.updatePreview()
        }else{
            //添加摄像机组件 
            let camera = this.codeNode.checkAddComponent(cc.Camera)
            camera.cullingMask = -31 //特殊配置
            camera.clearFlags = 6
            this.codeNode.camera = camera
            this.codeNode.zoomRatio = this.properties.zoomRatio
            // camera.enabled = false
            //还要添加ui camera
            if(CocosMgr.isInApp){
                var node2 = new cc.Node()
                node2.parent = this.codeNode.node.parent
                node2.name = 'New 2D Camera'
                var cameraUi = node2.addComponent(cc.Camera)
                cameraUi.cullingMask = 24
                cameraUi.clearFlags = 6
                cameraUi.depth = 2
                // cameraUi.enabled = false
                this.cameraUi = node2
            }
        }
       
        // console.log('我创建了的codeNode',  this.codeNode.node._id)
        this.setOutputData(0, this.codeNode)
        return this.codeNode
    }

    onAdded(){
        if(this.codeNode == null && CocosMgr.isInApp == false){
            ///只在编辑器中的时候会创建
            this.createObj()
        }
        this.sendAddEvent()
    }

    onSelected(){
        if(this.codeNode == null && CocosMgr.isInApp == false){
            this.createObj()
        }
        this.sendOtherEvent('onSelected')
    }

    updateOutputData(slot){
        // console.log('我收到了更新物体的事件', slot)
        if(this.codeNode == null && CocosMgr.isInApp == false){
            this.createObj()
        }
        this.setOutputData(slot, this.codeNode)
    }


    // onSelected(){
    //     // this.getEnums()
    //     // if(this.previewTween == null){
    //     //     var config = {...this.properties.nodeConfig}
    //     //     this.previewTween = CocosMgr.createObj(config)
    //     //     this.previewTween.nodeName = '镜头预览'
    //     //     var ctx = this.previewTween.addComponent(cc.Graphics)
    //     //     this.previewTween.ctx = ctx
    //     //     this.previewTween.zIndex = 10000
    //     //     this.previewTween.updatePreview()
    //     // }
    //     if(this.codeNode != null){

    //     }
    // }

    // onDeselected(){
    //     if(this.previewTween != null){
    //         this.previewTween.destroyNode()
    //         this.previewTween = null
    //     }
    // }


    //在不同的蓝图切换，需要查询是否存在预览节点，不存在的话就创建
    //当lagraph attach时此node可能还未创建，所以不能
    // onAttachCanvas(){
    //     console.log('onAttachCanvas', this.properties.customeName )
    //     this.createObj()
    // }

    // onDetachCanvas(){
    //     console.log('onDetachCanvas', this.properties.customeName )
    //     if(this.codeNode != null){
    //         this.codeNode.destroyNode()
    //         this.codeNode = null
    //     }
    // }

    onStartBeforeLoad(){
    }

    onStart(){
        this.createObj()
    }

    onPause(){
        if(this.codeNode != null){
            cc.director.getActionManager().pauseTarget(this.codeNode);
        }
    }

    onResume(){
        if(this.codeNode != null){
            cc.director.getActionManager().resumeTarget(this.codeNode);
        }
    }

    onStop(){
        //这里不能重制，重置参数的时候截图会闪烁
        if(this.codeNode != null && CocosMgr.isInApp == false){
            var config = {...this.properties.nodeConfig}
            config.zoomRatio = this.properties.zoomRatio
            // console.log('更新节点配置', config, value)
            CocosMgr.syncConfigToCodeNode(this.codeNode, config)
        }
    }

    onRemoved(){
        // console.log('我从graph中移除了', this.properties.customeName)
        if(this.codeNode != null){
            this.codeNode.destroyNode()
            this.codeNode = null
            this.setOutputData(0, null)
        }
        if(this.cameraUi != null){
            if(cc.isValid(this.cameraUi)){
                this.cameraUi.destroy()
                this.cameraUi = null
            }
        }
        this.sendRemoveEvent()
    }

    onPropertyChanged(property, value, oldValue){
         if(property != 'nodeConfig'){
            //  console.log('this.nodeConfigWidget', this.nodeConfigWidget)
            if(typeof this.nodeConfigWidget.value == 'object'){
                if(this.nodeConfigWidget.value[property] != null){
                    this.nodeConfigWidget.value[property] = value
                    this.properties.nodeConfig[property] = value
                }
                if(property == 'zoomRatio'){
                    if(this.nodeConfigWidget.value['scaleX'] != null){
                        this.nodeConfigWidget.value['scaleX'] = 1 /  value
                        this.properties.nodeConfig['scaleX'] = 1 / value
                        this.nodeConfigWidget.value['scaleY'] = 1 /  value
                        this.properties.nodeConfig['scaleY'] = 1 /  value
                    }
                }
            }
        }
        if(this.codeNode != null){
            var config = {}
            if(property == 'nodeConfig'){
                config = {...value}
            }else{
                config[property] = this.properties[property]
            }
            // console.log('更新节点配置', config)
            CocosMgr.syncConfigToCodeNode(this.codeNode, config)
        }
        this.sendPropertyChangeEvent(property, value, oldValue)
    }

    // onWidgetChanged(name, value, oldValue, widget){
    //     // console.log('onWidgetChanged', name, value, oldValue, widget)
    //     var property = widget.options.property
    // }
    // 当节点Toggle时调用
    // onAction(action, param)
	// {
    //    if(action == '修改'){

    //    }
	// }
}

camera.title = '镜头'
LiteGraph.registerNodeType("objects/camera", camera);





class connection extends BaseYWNode {
  // Name to show
  title = "连接零件"
  desc = "将一个物体设置为另一个物体的子物体"

  constructor() {
    super()
    // this.addProperty("time_in_ms", 1000);
    // this.serialize_widgets = true;
    // this.size = [140, 30]; 
    this.mode = LiteGraph.ON_EVENT

    this.addInput("关联父物体", 'codeNode');
    this.addInput("关联子物体", 'codeNode');
    // this.addOutput("A", -1);
	// this.addProperty("customeName",'A','string');
    // this.addWidget('string','发送事件', this.properties.customeName, 'customeName')
    // this.widgets_up = true
  }

  onGetInputs() {
    return [["关联子物体", 'codeNode']];
  };

  onStart(){
    this.onAction()
    super.onStart()
  }

  onSelected(){
    // console.log('connection onSelected')
    this.onAction()
    this.sendOtherEvent('onSelected')
  }

  disconnectInput(slot, keepReroutes){
    // console.log('我准备移除输入节点', slot, keepReroutes)
    if(slot >= 1){
        let codeNode = this.getInputData(slot, true)
        // console.log("找到了目标节点，移除", slot,codeNode )
        if(codeNode != null){
            let rootccNode = this.graph.vars.rootccNode
            if(rootccNode == null){
                rootccNode = cc.director.getScene().getChildByName('Canvas')
            }
            if(rootccNode != null){
                codeNode.parent = rootccNode
            }
        }
    }
    super.disconnectInput(slot, keepReroutes)
  }

  onAction(){
    var codeNode = this.getInputData(0, true)    // this.linkDatas.cardexSolt[0]
    if(codeNode == null){
        return
    }
    let parent = codeNode.node

    if(parent != null){
        for(var i = 1; i < this.inputs.length; i++){
            let codeNode = this.getInputData(i, true)
            if(codeNode != null){
                codeNode.parent = parent
            }
        }
    }
  }

//   getTitle() {
//       if (this.flags.collapsed) {
//           return "发送事件." + this.properties.customeName;
//       }
//       return this.title;
//   };

  // onGetOutputs() {
  //   console.log('我调用了onGetOutputs')
  //   return [["number", "string"]];
  // };

//   onAction(action, param){
//     let data = this.getInputData(0)
//     this.graph.sendEventToAllNodes(this.properties.customeName, data)
//   }
}

connection.title = '连接零件'
// Register the node type
LiteGraph.registerNodeType("objects/group/connection", connection)


class groupMove extends BaseYWNode{
    title = "整体移动"
    desc = "用于在开发时整体移动所有物体"

    constructor() {
        super()
        // this.addProperty("time_in_ms", 1000);
        // this.serialize_widgets = true;
        // this.size = [140, 30]; 
        this.mode = LiteGraph.ON_EVENT

        this.addProperty('x', 0, 'number')
        this.addWidget('number', '坐标-x', this.properties.x, 'x', {precision: 2})

        this.addProperty('y', 0, 'number')
        this.addWidget('number', '坐标-y', this.properties.y, 'y', {precision: 2})
    }

    //变量切换
    onPropertyChanged(property, value, oldValue){
        console.log('当前变量切换', property, value, oldValue, value - oldValue)
        let objectNodes = this.graph.findNodesByType('objects/createObject')
        let valueChanged = value - oldValue
        
        objectNodes.forEach(element => {
            element.setProperty(property, element.properties[property] + valueChanged)
        });
        this.sendPropertyChangeEvent(property, value, oldValue)
    }
}

groupMove.title = '整体移动'
LiteGraph.registerNodeType("objects/groupMove", groupMove)


class dynimicWidget extends BaseYWNode{
    title = "动态位置"
    desc = "自动根据当前屏幕尺寸设置物体位置"

    constructor() {
        super()
        // this.addProperty("time_in_ms", 1000);
        // this.serialize_widgets = true;
        // this.size = [140, 30]; 
        this.mode = LiteGraph.ON_EVENT
    }

    //变量切换
    onPropertyChanged(property, value, oldValue){
        // console.log('当前变量切换', property, value, oldValue, value - oldValue)
        // let objectNodes = this.graph.findNodesByType('objects/createObject')
        // let valueChanged = value - oldValue
        
        // objectNodes.forEach(element => {
        //     element.setProperty(property, element.properties[property] + valueChanged)
        // });
        // this.sendPropertyChangeEvent(property, value, oldValue)
    }
}

dynimicWidget.title = '动态位置'
dynimicWidget.posEnum = ['屏幕右下','屏幕右上','屏幕左下','屏幕左上']
LiteGraph.registerNodeType("objects/dynimicWidget", dynimicWidget)



class groupScale extends BaseYWNode{
    title = "分镜预览缩放"
    desc = "用于在开发时分镜预览缩放，以便看清超出屏幕范围的物体"
    color = '#FFC082'

    constructor() {
        super()
        // this.addProperty("time_in_ms", 1000);
        // this.serialize_widgets = true;
        // this.size = [140, 30]; 
        this.mode = LiteGraph.ON_EVENT

        this.addProperty('x', 0, 'number')
        this.addWidget('number', '位移x', this.properties.x, 'x', {precision: 2})

        this.addProperty('y', 0, 'number')
        this.addWidget('number', '位移y', this.properties.y, 'y', {precision: 2})

        this.addProperty('zoomRatio', 1, 'number')
        this.addWidget('slider', '缩放', this.properties.zoomRatio, 'zoomRatio', {precision: 2, min: 0.25, max: 1})

        

        //节点配置
        this.addProperty('nodeConfig',  {
            x: 0, 
            y: 0,
            width: CocosMgr.designViewWidth,
            height: CocosMgr.designViewHeight,
            anchorX: 0.5,
            anchorY: 0.5,
            scaleX: 1,
            scaleY: 1,
            color: '#FFC082',
            angle: 0,
        }, 'object')    ////仅仅绘制边框
        this.nodeConfigWidget = this.addWidget('ccnode', '节点操控', this.properties.nodeConfig, 'nodeConfig',  { viewWidth: CocosMgr.designViewWidth, viewHeight: CocosMgr.designViewHeight, justDrawBorder: false, borderColor: '#FFC082' })

        this.addWidget('button', '重置到默认状态', "", ()=>{
            console.log("点击了重置属性")
            this.setProperty('x', 0)
            this.setProperty('y', 0)
            this.setProperty('zoomRatio', 1)
        })
    }

    //变量切换
    onPropertyChanged(property, value, oldValue){
        // console.log('修改了属性', property, value)
        if(CocosMgr.isInApp == false){
            let camera = cc.director.getScene().getChildByName('Canvas').getChildByName('Main Camera')
            // console.log('修改了属性', , property, value)
            if(property == 'x'){
                camera.x = value * -1 / this.properties.zoomRatio
            }else if(property == 'y'){
                camera.y = value * -1 / this.properties.zoomRatio
            }else if(property == 'zoomRatio'){
                // console.log('设置zoomRatio', 'zoomRatio', value)
                camera.getComponent(cc.Camera).zoomRatio = value
            }
            if(property != 'nodeConfig'){
                //  console.log('this.nodeConfigWidget', this.nodeConfigWidget)
                if(typeof this.nodeConfigWidget.value == 'object'){
                    if(this.nodeConfigWidget.value[property] != null){
                        this.nodeConfigWidget.value[property] = value
                        this.properties.nodeConfig[property] = value
                    }
                    if(property == 'zoomRatio'){
                        if(this.nodeConfigWidget.value['scaleX'] != null){
                            this.nodeConfigWidget.value['scaleX'] = value
                            this.properties.nodeConfig['scaleX'] = value
                            this.nodeConfigWidget.value['scaleY'] =  value
                            this.properties.nodeConfig['scaleY'] =  value
                        }
                    }
                }
            }
        }
        this.sendPropertyChangeEvent(property, value, oldValue)
    }

    // onWidgetChanged(name, value, oldValue, widget){
    //     // console.log('onWidgetChanged', name, value, oldValue, widget)
    //     var property = widget.options.property
        
    // }

    onStop(){
        
    }

    onAttachCanvas(){
       
    }

    onConfigure(){
        if(CocosMgr.isInApp == false){
            let camera = cc.director.getScene().getChildByName('Canvas').getChildByName('Main Camera')
            camera.x = this.properties.x * -1 / this.properties.zoomRatio
            camera.y = this.properties.y * -1 / this.properties.zoomRatio
            camera.getComponent(cc.Camera).zoomRatio = this.properties.zoomRatio
        }
    }
    
    onRemoved(){
        this.onAction('重置')
        this.sendRemoveEvent()
    }

    onAction(name){
        // console.log('调用的方案', name)
        if(name == '重置'){
            let camera = cc.director.getScene().getChildByName('Canvas').getChildByName('Main Camera')
            camera.x = 0
            camera.y = 0
            camera.getComponent(cc.Camera).zoomRatio = 1
        }
    }
}

groupScale.title = '分镜预览缩放'
LiteGraph.registerNodeType("objects/groupScale", groupScale)