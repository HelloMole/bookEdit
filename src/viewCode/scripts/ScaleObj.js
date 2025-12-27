export var ScaleObj = cc.Class({
    extends: cc.Component,

    properties: {
        //debugLabel:cc.Label
        scaleMin: 0.5,
        scaleMax: 2,
        dynimicCenter: 0
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        this.addTouchEvent()
    },

    addTouchEvent: function(){
        this.node.targetOff(this)
        this.touchIds = {}
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this)
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.moveFun, this)
        this.node.on(cc.Node.EventType.TOUCH_END, this.cancelFun, this)
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.cancelFun, this)

        this.node.on(cc.Node.EventType.MOUSE_WHEEL, this.mouseWheel, this)

        console.log('我开启了缩放监听')
    },

    mouseWheel: function(event){
        if(this.dynimicCenter == 1){
            this.startScale = this.node.scale
            this.startPos = this.node.convertToNodeSpaceAR(cc.v2(this.node.width * 0.5, this.node.height * 0.5))
        }

        var scaleDel = event.getScrollY() / 2000
        this.node.scale += scaleDel
        if(this.node.scale > this.scaleMax){
            this.node.scale = this.scaleMax
        }
        if(this.node.scale < this.scaleMin){
            this.node.scale = this.scaleMin
        }

        if(this.dynimicCenter == 1){
            this.node.x += this.startPos.x * this.startScale - this.node.scale * this.startPos.x 
            this.node.y += this.startPos.y * this.startScale - this.node.scale * this.startPos.y
        }

        if(this.outputHandle != null){
            this.outputHandle('onScale', this.node.scale)
        }
    },

    inputHandle: function(inputData){
        if(inputData.data == 0){
            this.touchIds = {}
            this.node.targetOff(this)
        }else{
            this.addTouchEvent()
        }
    },

    
    touchStart: function(event){
        var eventid = event.getID()
        if(Object.keys(this.touchIds).length >= 2){
            return
        }
        this.touchIds[eventid] = {start: event.getLocation(), move: event.getLocation()}
        if(Object.keys(this.touchIds).length == 2){
            this.scaleNow = this.node.scale
            // if(this.dynimicCenter == 1){
            //     this.startScale = this.node.scale
            //     this.startPos = this.node.convertToNodeSpaceAR(cc.v2(this.node.width * 0.5, this.node.height * 0.5))
            // }
        }
    },

    moveFun :function(event) {
        var eventid = event.getID()
        var touchKeys = Object.keys(this.touchIds)
        if(touchKeys.length < 2){
            //在开始缩放之前，先记录第一个触摸到屏幕的手指的位置
            this.touchIds[eventid].start = event.getLocation()
            this.touchIds[eventid].move = event.getLocation()
            return
        }

        if(this.dynimicCenter == 1){
            this.startScale = this.node.scale
            this.startPos = this.node.convertToNodeSpaceAR(cc.v2(this.node.width * 0.5, this.node.height * 0.5))
        }

        this.touchIds[eventid].move = event.getLocation()
        var key1 = touchKeys[0]
        var key2 = touchKeys[1]

        var lengthStart = this.touchIds[key1].start.sub(this.touchIds[key2].start).mag()
        var lengthNow = this.touchIds[key1].move.sub(this.touchIds[key2].move).mag()
        var scale = lengthNow / lengthStart

        this.node.scale = this.scaleNow * scale
        if(this.node.scale > this.scaleMax){
            this.node.scale = this.scaleMax
        }
        if(this.node.scale < this.scaleMin){
            this.node.scale = this.scaleMin
        }
       
        if(this.dynimicCenter == 1 && this.startPos != null){
            this.node.x += this.startPos.x * this.startScale - this.node.scale * this.startPos.x 
            this.node.y += this.startPos.y * this.startScale - this.node.scale * this.startPos.y
        }

        if(this.outputHandle != null){
            this.outputHandle('onScale', this.node.scale)
        }
        // if(this.debugLabel != null){
        //     this.debugLabel.string = lengthNow + ',' + lengthStart + ',' + this.scaleNow
        // }
    },

    cancelFun: function(event){
        var eventid = event.getID()
        delete this.touchIds[eventid]
        
        var self = this
        self.startTouch = false
        if(self.canMove == false){return}
        // if(self.gameCtrl.inEnterDoor == true){return}
        // chectPlayerMove()
        if(self.touchEndHandle != null){
            self.touchEndHandle()
        }
    },

    //删除要取消监听事件
    onDestroy(){
        if(cc.isValid(this.node)){
            this.node.targetOff(this)
        }
        // this.node.off(cc.Node.EventType.TOUCH_START, this.touchStart, this)
        // this.node.off(cc.Node.EventType.TOUCH_MOVE, this.moveFun, this)
        // this.node.off(cc.Node.EventType.TOUCH_END, this.cancelFun, this)
        // this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.cancelFun, this)
    },

    robotRelease(){
        this.touchIds = {}
        if(cc.isValid(this.node)){
            this.node.targetOff(this)
        }
    }

    // start () {},

    // update (dt) {},
});
