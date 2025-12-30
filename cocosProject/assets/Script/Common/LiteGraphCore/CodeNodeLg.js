import * as CocosMgr from './CocosMgr';


export var CodeNodeLg = cc.Class({
    extends: cc.Component,
    properties: {
        // x: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        //贝塞尔曲线变量t
        curve: null,
        onAssstLoadCb: null,
        bezierScale: 1,
        assestLoaded: true,
        t:{
            get(){
                return this._t
            },
            set(value){
                //不能超过曲线设置
                if(value > 1){
                    value = 1
                }
                if(value < 0){
                    value = 0
                }
                this._t = value
                if(this.curve != null){
                    var pt = this.curve.get(value);
                    this.x = pt.x * this.bezierScale   //因为基础数据是0.5倍，所以在常规未缩放页面需要X2
                    this.y = pt.y * this.bezierScale
                    if(this.lookUp == 1){
                        //跟随当前运行的方向
                        //当角度为0度时，图片素材中的箭头朝向为 ->
                        var dv = this.curve.derivative(value);
                        // var xdir = dv.x - pt.x
                        // var ydir = dv.y - pt.y
                        var radian = Math.atan2(dv.y, dv.x)
                        var angle = radian * (180 / Math.PI)
                        // console.log('节点旋转角度angle', angle, pt, dv)
                        this.angle = angle
                    }
                }
            }
        },
        _t: 0,
        nodeName:{
            get(){
                return this.node.name
            },
            set(value){
                this.node.name = value
            }
        },

        src:{
            get(){
                if(this.modal == 4){
                    return this.string
                }else{
                    return this.customeName
                }
            },
            set(value){
                this.node.name = value
            }
        },
        _modal: '',
        modal: {
            get(){
                return this._modal
            },
            set(value){
                //spine，label，sprite，Graph，这几种渲染组件同时只能存在一个
                if(this._modal != value){
                    this._modal = value
                    if(this.sprite != null){
                        this.node.removeComponent(cc.Sprite)
                        this.sprite = null
                    }else if(this.spineCom != null){
                        this.node.removeComponent(sp.Skeleton)
                        this.spineCom = null
                    }else if(this.label != null){
                        this.node.removeComponent(cc.Label)
                        this.label = null
                    }
                    if(value == CocosMgr.ObjectTypeEnum.spine){
                        this.spineCom = this.node.addComponent(sp.Skeleton)
                    }else if(value == CocosMgr.ObjectTypeEnum.text){
                        this.label = this.node.addComponent(cc.Label)
                        if(CocosMgr.isInApp){
                            cc.resources.load('app/font/wowfont', cc.Font, (err, asset) => {
                                if (err) {
                                    cc.error(`wowfont[资源加载] 错误 ${err}`);
                                } else {
                                    if(cc.isValid(this.node) == true && this.label != null){
                                        this.label.font = asset
                                    }
                                }
                            });
                        }
                    }else if(value == CocosMgr.ObjectTypeEnum.sprite){
                        this.sprite = this.node.addComponent(cc.Sprite)
                    }
                    // console.log('设置了modal', this.modal, this.spineCom, this.label, this.sprite)
                }
            }
        },

        customeName:{
            get(){
                return this._customeName
            },
            set(value){
                // if(this._customeName == ''){
                //     //首次赋值，不触发自动切换资源
                //     this._customeName = value
                //     return
                // }
                if(this._customeName != value){
                    let name = value
                    if(name.indexOf('/') != -1){
                        name = name.split('/')
                        name = name[name.length - 1] 
                    }
                    if(name.indexOf('.') != -1){
                        name = name.split('.')[0]
                    }
                    this.node.name = name
                    // console.log('设置了customeName', value, this.modal, this.sprite)
                    if(this.modal == CocosMgr.ObjectTypeEnum.sprite){
                        if(this.sprite != null){
                            this.assestLoaded = false
                            cc.assetManager.loadRemote(CocosMgr.rootHost + '/' + value, (err, texture)=>{
                                if(cc.isValid(this.node) == true && texture != null && this.sprite != null){
                                    this.sprite.spriteFrame = new cc.SpriteFrame(texture)
                                   
                                }
                                this.assestLoaded = true
                                if(this.onAssstLoadCb != null){
                                    this.onAssstLoadCb()
                                }
                            })
                        }
                    }else if(this.modal == CocosMgr.ObjectTypeEnum.spine){
                        // var curAnimation = 'std'
                        // var isLoop = false
                        if(this.spineCom != null){
                            this.assestLoaded = false
                            CocosMgr.loadNetSpine(value, (data)=>{
                                if(data != null && cc.isValid(this.node) && this.spineCom != null){
                                    this.spineCom.skeletonData = data
                                    this.checkAddComponent('SpinePlusComponent')
                                }
                                this.assestLoaded = true
                                //spine加载成功后spinplusComponent才能获取到碰撞框
                                if(this.onAssstLoadCb != null){
                                    this.onAssstLoadCb()
                                }
                            })
                        }
                        // this.codeProgress.codeRobotConfig.loadResHandle(value, sp.SkeletonData, (res)=>{
                        //     if(res != null && this.spineCom != null){
                        //         this.spineCom.skeletonData = res
                        //         this.spineCom.setAnimation(0, curAnimation, isLoop)
                        //     }
                        // })
                    }else if(this.modal == CocosMgr.ObjectTypeEnum.text){
                        if(this.onAssstLoadCb != null){
                            this.onAssstLoadCb()
                        }
                    }else{
                        if(this.onAssstLoadCb != null){
                            this.onAssstLoadCb()
                        }
                    }
                    this._customeName = value
                }
                if(value == ''){
                    //没有设置值，那也直接返回吧
                    if(this.onAssstLoadCb != null){
                        this.onAssstLoadCb()
                    }
                }
            }
        },

        premulAlpha:{
            get(){
                if(this.spineCom != null){
                    return this.spineCom.premultipliedAlpha == true ? 1 : 0
                }
                if(this.sprite != null){
                    return this.sprite.srcBlendFactor ==  cc.macro.BlendFactor.ONE ? 1 : 0
                }
                return 0
            },
            set(value){
                if(this.spineCom != null){
                    return this.spineCom.premultipliedAlpha = value == 0 ? false : true
                }
                if(this.sprite != null){
                    return this.sprite.srcBlendFactor = value == true ? cc.macro.BlendFactor.ONE : cc.macro.BlendFactor.SRC_ALPHA
                }
            }
        },
        x: {
            get () {
                return this.node.x + this.offsetx;
            },
            set (value) {
                this.node.x = value - this.offsetx;
                this.dispatchListener('x', this.node.x)
            }
        },
        y: {
            get () {
                 return this.node.y + this.offsety
            },
            set (value) {
                this.node.y = value - this.offsety;
                if(this.dynamiczIndex){
                    this.zIndex = 6000 - Math.round(this.node.y + 1500) * 2
                    // console.log('this。zindex', this.zIndex)
                }
                this.dispatchListener('y', this.node.y)
            }
        },
        realX:{
            get(){
                return this.node.x
            },
            set(value){
                this.node.x = value
                this.dispatchListener('x', this.node.x)
            }
        },
        realY:{
            get(){
                return this.node.y
            },
            set(value){
                this.node.y = value
                if(this.dynamiczIndex){
                    this.zIndex = 6000 - Math.round(this.node.y + 1500) * 2
                    // console.log('this。zindex', this.zIndex)
                }
                this.dispatchListener('y', this.node.y)
            }
        },
        scaleX: {
            get () {
                return this.node.scaleX;
            },
            set (value) {
                this.node.scaleX = value;
                this.dispatchListener('scaleX', value)
            }
        },
        scaleY: {
            get () {
                return this.node.scaleY;
            },
            set (value) {
                this.node.scaleY = value;
                this.dispatchListener('scaleY', value)
            }
        },
        width:{
            get () {
                return this.node.width;
            },
            set (value) {
                this.node.width = value;
                this.dispatchListener('width', value)
                this.updatePreview()
            }
        },
        height:{
            get () {
                return this.node.height;
            },
            set (value) {
                this.node.height = value;
                this.dispatchListener('height', value)
                this.updatePreview()
            }
        },
        opacity: {
            get () {
                return this.node.opacity;
            },
            set (value) {
                this.node.opacity = value;
                this.dispatchListener('opacity',value)
            }
        },
        angle: {
            get () {
                return this.node.angle;
            },
            set (value) {
                this.node.angle = value;
                this.dispatchListener('angle', value)
            }
        },
        angleToPos: {
            get () {
                return this._angleToPos;
            },
            set (value) {
                this._angleToPos = value;

                this.realX = this.center[0] + Math.sin(this._angleToPos * (Math.PI / 180)) * this.radius
                this.realY = this.center[1] + Math.cos(this._angleToPos * (Math.PI / 180)) * this.radius
            }
        },
        //当设置angleToPos时，以此值为半径计算位置
        radius: {
            get () {
                return this._radius;
            },
            set (value) {
                this._radius = value;

                this.realX = this.center[0] + Math.sin(this._angleToPos * (Math.PI / 180)) * this.radius
                this.realY = this.center[1] + Math.cos(this._angleToPos * (Math.PI / 180)) * this.radius
            }
        },
        //当设置angleToPos时，以此值为圆心计算位置[0,0]
        center: {
            get () {
                return this._center;
            },
            set (value) {
                this._center = value
                this.realX = this.center[0] + Math.sin(this._angleToPos * (Math.PI / 180)) * this.radius
                this.realY = this.center[1] + Math.cos(this._angleToPos * (Math.PI / 180)) * this.radius
            }
        },
        zIndex: {
            get () {
                return this.node.zIndex;
            },
            set (value) {
                this.node.zIndex = value;
                this.dispatchListener('zIndex', value)
            }
        },
        active:{
            get () {
                return this.node.active == true ? 1 : 0;
            },
            set (value) {
                this.node.active = value != 0;
                this.dispatchListener('active', value)
            }
        },
        parent:{
            get(){
                return this.node.parent
            },
            set (value) {
                this.node.parent = value;
            }
        },
        group:{
            get(){
                return this.node.group
            },
            set (value) {
                if(CocosMgr.isInApp){
                    this.node.group = value == true ? 'storyui' : 'default';
                }
            }
        },
        zoomRatio: {
            get () {
               if(this.camera != null){
                    return this.camera.zoomRatio
               }
               return 0
            },
            set (value) {
                // console.log('codenode 更新了zoomRatio', value ,this.camera)
               if(this.camera != null){
                    this.camera.zoomRatio = value;
               }else{
                    this.scaleX = 1 / value
                    this.scaleY = 1 / value
                    this.updatePreview()
               }
            }
        },
        fontSize:{
            get(){
                if(this.label == null){
                    return 0
                }
                return this.label.fontSize
            },
            set (value) {
                if(this.label != null){
                     this.label.fontSize = value;
                     this.label.lineHeight = value + 10
                }
            }
        },
        overflow:{
            get(){
                if(this.label == null){
                    return -1
                }
                return this.label.overflow
            },
            set (value) {
                if(this.label != null){
                     this.label.overflow = value;
                }
            }
        },
        string:{
            get(){
                if(this.label == null){
                    return ''
                }
                return this.label.string
            },
            set (value) {
                if(this.label != null){
                     this.label.string = value;
                     this.dispatchListener('string', value)
                }
            }
        },
        anchorX:{
            get(){
                return this.node.anchorX
            },
            set (value) {
                this.node.anchorX = value
                this.updatePreview()
            }
        },
        anchorY:{
            get(){
                return this.node.anchorY
            },
            set (value) {
                this.node.anchorY = value
                this.updatePreview()
            }
        },
        color:{
            get(){
                return this.node.color.toHEX("#rrggbb")
            },
            set (value) {
                if(this._color != value){
                    this._color = value
                }
                this.node.color = cc.Color.WHITE.fromHEX(value)
            }
        },
        ccColor:{
            get(){
                return this.node.color
            },
            set(value){

            }
        },
        r:{
            get(){
                return this.node.color.r
            },
            set(value){
                this.node.color = this.node.color.setR(value)
            }
        },
        g:{
            get(){
                return this.node.color.r
            },
            set(value){
                this.node.color = this.node.color.setG(value)
                // console.log("设置了节点的g值", value, this.node.color.getG())
            }
        },
        b:{
            get(){
                return this.node.color.b
            },
            set(value){
                this.node.color =  this.node.color.setB(value)
            }
        },
        outLineColor:{
            get(){
                return this._outLineColor
            },
            set (value) {
                if(this._outLineColor != value){
                    this._outLineColor = value
                }
                if(this.outLineComp != null){
                    this.outLineComp.color = cc.Color.WHITE.fromHEX(value)
                }
            }
        },

        outLineWidth:{
            get(){
                return this._outLineWidth
            },
            set (value) {
                let oldValue = this._outLineWidth
                if(this._outLineWidth != value){
                    this._outLineWidth = value
                }
                if(this._outLineWidth < 0){
                    this._outLineWidth = 0
                }
                
                if(this._outLineWidth > 0){
                    if(this.modal == CocosMgr.ObjectTypeEnum.text){
                        if(this.outLineComp == null){
                            this.outLineComp = this.addComponent(cc.LabelOutline)
                            this.outLineComp.color = cc.Color.WHITE.fromHEX(this.outLineColor)
                        }
                        this.outLineComp.width = value
                    }else if(this.spineCom != null || this.sprite != null){
                        if(oldValue == 0){
                            this.setOutLine(true)
                        }
                    }
                }else{
                    if(this.outLineComp != null){
                        this.outLineComp.width = 0
                    }else if(this.spineCom != null || this.sprite != null){
                        if(oldValue > 0){
                            this.setOutLine(false)
                        }
                    }
                }
            }
        },

        //设置碰撞框
        _colliderValue: null,
        colliderValue:{
            get(){
                return this._colliderValue
            },
            set (value){
                //暂时碰撞框一旦生成不能再变动
                // console.log('设置碰撞框', this.node.name, value)
                if(Object.keys(value).length != 0 && value.pointArr != null && value.pointArr.length != 0 && this._colliderValue == null){
                    // console.log('我显示了碰撞框', this.node.name,  value)
                    let comp = this.checkAddComponent('SpinePlusComponent')
                    this._colliderValue = value
                    comp.customCollider = true
                    let scale = value.scale || 1
                    var colliderArr = []
                    for(var z = 0; z < value.pointArr.length; z++){
                        var collider = this.addComponent(cc.PolygonCollider)
                        colliderArr.push(collider)
                        // let offset = value[z].offset
                        var points = value.pointArr[z]
                        // collider.offset = cc.v2(value.offsetX, value.offsetY)    //不可以使用offset，无法影响点击触碰判断
                        for(var i = 0; i < points.length; i++){
                            var v2 = collider.points[i];
                            if (!v2) collider.points.push(cc.v2());
                            collider.points[i].x = (points[i].x - this.anchorX) * value.baseWidth / scale + value.offsetX  //+  value.offsetX //- colliderValue.offsetX) / colliderValue.scale 
                            collider.points[i].y = (points[i].y - this.anchorY) * value.baseHeight / scale * -1 + value.offsetY//+ value.offsetY //* colliderValue.baseWidth - colliderValue.offsetY) / colliderValue.scale 
                        }
                    }
                    comp.polygonColliderArr = colliderArr
                }else{
                    //不能修改，会影响spine动画自带的碰撞框
                    // let comp = this.checkAddComponent('SpinePlusComponent')
                    // comp.customCollider = false
                    // comp.polygonColliderArr = []
                    // this._colliderValue = null
                    // while(this.getComponent(cc.PolygonCollider) != null){
                    //     let collider = this.getComponent(cc.PolygonCollider)
                    //     this.removeComponent(collider)
                    // }
                }
            }
        },
        
        _outLineWidth: 0,
        _outLineColor: 'ffffff',
        _color:'ffffff',
        offsetx : 0,
        offsety : 0,
        _radius: 0,
        _angleToPos: 0,
        _center: [0,0],
        _customeName: '',
        useCenterMode: false,
        
        inMapMap: 0,//是否在地图中
        girdX: 0,   //x坐标，如果该物品尺寸大于1格子，以最小的x作为起点
        girdY: 0,   //y坐标，如果该物品尺寸大于1格子，以最小的y作为起点
        widthGird: 1,   //作为格子，占用几个格子宽
        heightGird: 1,  //作为格子物品，占用几个格子高
        girdTypeArr: [], //可以放置的格子类型
        dynamiczIndex: false,
    },

    //设置描边
    setOutLine(isOutLine){
        if(isOutLine == true){
            cc.resources.load('sharder/RenderOutLine', cc.Material, (err, mat)=>{
                if(mat != null){
                    // console.log('mat', mat)
                    if(this.spineCom != null){
                        this.spineCom.setMaterial(0, mat);
                    }else if(this.sprite != null){
                        this.sprite.setMaterial(0, mat);
                    }
                }
            })
        }else{
            if(this.spineCom != null){
                this.spineCom.setMaterial(0, cc.Material.getBuiltinMaterial('2d-spine'));
            }else if(this.sprite != null){
                this.sprite.setMaterial(0, cc.Material.getBuiltinMaterial('2d-sprite'));
            }
        }
    },

    onLoad(){
        // console.log('所有节点的通用脚本加载了')
        this.init()
    },
   

    // LIFE-CYCLE CALLBACKS:

    init(){
         if(cc.isValid(this.node) == false){
            return
        }
        this.robotListenerCount = {}
        this.camera = this.node.getComponent(cc.Camera)
        this.sprite = this.node.getComponent(cc.Sprite)
        this.spineCom = this.node.getComponent(sp.Skeleton)
        this.label = this.node.getComponent(cc.Label)
        this.outLineComp = this.node.getComponent(cc.LabelOutline)
        this.ctx = this.node.getComponent(cc.Graphics)
        // if(this.ctx != null){
            // this.updatePreview()
        // }
        // if(this.node.isClone == true){
        //     if(this.spineCom && this.spineCom.skeletonData != null){
        //         this.spineCom.skeletonData.addRef()
        //     }
        //     if(this.sprite && this.sprite.spriteFrame != null){
        //         this.sprite.spriteFrame.addRef()
        //     }
        // }
        // console.log("codeNode.init")
    },

    addComponent(com){
        if(typeof com == 'string'){
            if(cc.js.getClassByName(com) == null){
                console.warn('组件' + com + '不存在')
                return
            }
        }
        var comPonent = this.node.addComponent(com)
        return comPonent
    },

    //删除所有子节点
    clearChildren(){
        if(cc.isValid(this.node)){
            for(var i = 0; i < this.node.children.length; i++){
                this.node.children[i].destroy()
                // i--
            }
        }
    },

    checkAddComponent(com){
        if(typeof com == 'string'){
            if(cc.js.getClassByName(com) == null){
                console.warn('组件' + com + '不存在')
                return
            }
        }
        let comPonent = this.node.getComponent(com)
        if(comPonent == null){
            comPonent = this.addComponent(com)
        }
        this.scheduleOnce(()=>{
            // if(com == 'SpinePlusComponent'){
            //     console.log('添加了SpinePlusComponent，此时是否有graph', this.graph)
            // }
            if(com == 'SpinePlusComponent' && this.graph != null){
                var rootccNode = this.graph.vars.rootccNode
                if(rootccNode == null){
                    rootccNode = cc.director.getScene().getChildByName('Canvas')
                }
                var cameraNode = rootccNode.getChildByName('Camera')
                // console.log('添加SpinePlusComponent的时候是否有cameraa', cameraNode)
                if(cameraNode != null){
                    comPonent.camera = cameraNode.getComponent(cc.Camera)
                    if(comPonent.camera == null){
                        if(CocosMgr.isInApp == false){
                            cameraNode = rootccNode.getChildByName('Main Camera')
                            comPonent.camera = cameraNode.getComponent(cc.Camera)
                        }
                    }
                }else{
                    if(CocosMgr.isInApp == false){
                       cameraNode = rootccNode.getChildByName('Main Camera')
                       comPonent.camera = cameraNode.getComponent(cc.Camera)
                    }
                }
            }
        }, 0)
        return comPonent
    },

    removeComponent(com){
        if(cc.isValid(this.node)){
            this.node.removeComponent(com)
        }
    },

    //更新视图
    updatePreview(){
        // console.log('updatePreview', this.ctx)
        if(this.ctx == null){
            return
        }
        if(this.disableUpdatePreview == true){return}
        this.ctx.clear()
        let camera = cc.director.getScene().getChildByName('Canvas').getChildByName('Main Camera')
        let zoomRatio = 1
        if(camera != null){
            zoomRatio = camera.getComponent(cc.Camera).zoomRatio
        }
        this.ctx.lineWidth = 4 * (1 / this.scaleX) * (1 / cc.view.getScaleX()) * (1 / zoomRatio)
        console.log('绘制了preview '+  this.nodeName, this.scaleX)
        this.ctx.strokeColor = cc.Color.BLUE.fromHEX('#3F42EA');
        this.ctx.rect(-this.width * this.anchorX, -this.height * this.anchorY , this.width, this.height)
        this.ctx.stroke();
    },

    getComponent(com){
        return this.node.getComponent(com)
    },

    getChildByName(name){
        return this.node.getChildByName(name)
    },

    on(event, func, target){
        if(cc.isValid(this.node)){
            if(target != null){
                this.node.on(event, func, target)
            }else{
                this.node.on(event, func, this)
            }
        }
    },
    
    targetOff(target){
        if(cc.isValid(this.node)){
            if(target != null){
                this.node.targetOff(target)
            }else{
                this.node.targetOff(this)
                this.node.off(cc.Node.EventType.TOUCH_START)
                this.node.off(cc.Node.EventType.TOUCH_MOVE)
                this.node.off(cc.Node.EventType.TOUCH_END)
                this.node.off(cc.Node.EventType.TOUCH_CANCEL)
            }
        }
    },

    destroyNode(){
        if(cc.isValid(this.node)){
            this.node.destroy()
        }
        this.robotListener = {}
    },

    // destroy(){
    //     console.log('code node destroy')
    //     super.destroy()
    // },

    onDestroy(){
        //在这里释放掉引用的资源吗？
        if(this.spineCom && this.spineCom.skeletonData != null){
            // console.log('释放引用资源', this.spineCom.skeletonData)
            // cc.assetManager.releaseAsset(this.spineCom.skeletonData)
            // this.spineCom.skeletonData.decRef()
            this.spineCom.skeletonData = null
        }
        if(this.sprite && this.sprite.spriteFrame != null){
            // cc.assetManager.releaseAsset(this.sprite.spriteFrame)
            // this.sprite.spriteFrame.decRef()
            this.sprite.spriteFrame = null
        }
        this.graph = null
        cc.Tween.stopAllByTarget(this.codeNode);
    },

    addRobotListener(key, bindId, func){
        if(this.robotListener == null){
            this.robotListener = {}
        }
        if(this.robotListener[key] == null){
           this.robotListener[key] = {}
        }
        this.robotListener[key][bindId] = func
    },

    removeRobotListener(key, bindId){
        if(this.robotListener == null){
            this.robotListener = {}
        }
        if(this.robotListener[key] != null){
            delete this.robotListener[key][bindId]
        }
    },

    dispatchListener(key, data){
        if(this.robotListener == null){return}
        // if(cc.codeJsonDevConfig.curIsdebugMode == true){
        //     if(this.robotListenerCount[key] == null){
        //         this.robotListenerCount[key] = 0
        //     }
        //     if(this.robotListenerCount[key] < 5){
        //         this.robotListenerCount[key] += 1
        //         return
        //     }
        //     this.robotListenerCount[key] = 0
        // }
        if(this.robotListener[key] != null){
            for(var keyid in this.robotListener[key]){
                this.robotListener[key][keyid](data)
            }
        }
    },

    onCollisionEnter(other, self){
        var codeNode = other.node.getComponent('CodeNodeLg')
        // console.log('onCollisionEnter', other, self, codeNode,  other.node.getComponent('CodeNode'))
        this.dispatchListener('contact', codeNode)
    },

    onCollisionExit(other, self){
        var codeNode = other.node.getComponent('CodeNodeLg')
        this.dispatchListener('uncontact', codeNode)
    },

    getWorldPos(){
        return this.node.parent.convertToWorldSpaceAR(this.node.position)
    },

    //设置皮肤
    setSkin(skin){
        if(cc.isValid(this.node) == false){
            return
        }
        if(this.spineCom == null){
            this.spineCom = this.node.getComponent(sp.Skeleton)
        }
        if(this.spineCom == null){
            return
        }
        try {
            this.spineCom.setSkin(skin)
        } catch (error) {
            
        }
    },

    //设置播放动画
    playAnimation(aniName, loop, softChange, onEvent, onEnd){
        if(cc.isValid(this.node) == false){
            return
        }
        if(this.spineCom == null){
            this.spineCom = this.node.getComponent(sp.Skeleton)
        }
        if(this.spineCom == null){
            return
        }
        if(aniName == ''){
            console.warn('输入了无效的aniName')
            // return
        }
        this.spineCom.paused = false
        if(onEvent != null){
            this.spineCom.setEventListener(onEvent)
        }
        // this.spineCom.setEventListener((trackEntry, event)=>{
        //     // cc.log('spineCom event.data', event.data)
        //     if(event.intValue < 0){
        //         return
        //     }
        //     console.log("TODO: 这里应该播放spine事件声音", event.data.name, this.node.name + ':' + trackEntry.animation.name)
        //     //查找是否有音频节点的资源名称为 event.data.name，如果有就可以直接播放音频了
        //     //this.codeProgress.playSound(event.data.name ,spineCom.node.name + ':' + trackEntry.animation.name)
        // });
        if(onEnd != null){
            this.spineCom.setCompleteListener((trackEntry)=>{
                let ccompleteName = trackEntry.animation.name;
                if(ccompleteName == aniName){
                    if(onEnd != null){
                        onEnd()
                    }
                }
            })
        }
        if(softChange == true){
            this.spineCom.loop = false
            this.spineCom.addAnimation(0, aniName, loop)
        }else{
            this.spineCom.setAnimation(0, aniName, loop)
        }
        // if(onClick != null){
        //     this.on(cc.Node.EventType.TOUCH_END, ()=>{

        //     })
        // }
    },


    pauseAnimation(isPause){
        if(cc.isValid(this.node) == false){
            return
        }
        if(this.spineCom == null){
            this.spineCom = this.node.getComponent(sp.Skeleton)
        }
        if(this.spineCom == null){
            return
        }
        if(isPause == null){
            isPause = true
        }
        this.spineCom.paused = isPause
    },

    //设置spine组件的相关属性
    setAnimationProb(key, value){
         if(cc.isValid(this.node) == false){
            return
        }
        if(this.spineCom == null){
            this.spineCom = this.node.getComponent(sp.Skeleton)
        }
        if(this.spineCom == null){
            return
        }
        this.spineCom[key] = value
    }



    // start () {

    // },

    // update (dt) {},
});
