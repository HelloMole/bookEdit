// const { ccclass, property, menu } = cc._decorator;
export default class SpinePlusComponent extends cc.Component {

    private _spine: sp.Skeleton;

    public get spine(): sp.Skeleton {
        return this._spine;
    }

    public set spine(spine: sp.Skeleton) {
        this._spine = spine;
    }

    customCollider:boolean = false;

    actions: string = '';

    camera: cc.Camera = null;


    clickEvent: Array<cc.Component.EventHandler> = [];

    completeEvent: Array<cc.Component.EventHandler> = [];

    private _endActName: string;
    private _actionList: Array<string>;

    private _attachment: sp.spine.BoundingBoxAttachment;
    private _polygonCollider: cc.PolygonCollider;
    private _colliderSlot: sp.spine.Slot;

    public polygonColliderArr = []

    // @property({
    //     tooltip: CC_DEV && '是否为动态区域'
    // })
    isDynamic: boolean = false;

    onLoad() {
        this._spine = this.node.getComponent(sp.Skeleton);
        if(this._spine != null){
            this._colliderSlot = this._spine.findSlot('Collider');
        }else{
            this.customCollider = true
        }
    }

    update() {
        if (!this._polygonCollider || !this._colliderSlot || !this.isDynamic) return;
        //console.log('this._colliderSlot.bone.worldX', this._colliderSlot.bone.worldX)
        this._polygonCollider.offset.x = this._colliderSlot.bone.worldX;
        this._polygonCollider.offset.y = this._colliderSlot.bone.worldY;
        this._polygonCollider.points = [];
        for (let index = 0; index < this._colliderSlot.deform.length / 2; index++) {
            let v2: cc.Vec2 = this._polygonCollider.points[index];
            if (!v2) this._polygonCollider.points.push(cc.v2());
            this._polygonCollider.points[index].x = this._colliderSlot.deform[index * 2];
            this._polygonCollider.points[index].y = this._colliderSlot.deform[index * 2 + 1];
        }
    }

    refreshCollider() {
        this._colliderSlot = this._spine.findSlot('Collider');
        let attachement = this._colliderSlot.getAttachment();//this._spine.getAttachment('Collider', 'Collider');

        //console.log(this._spine, attachement);

        // if (!this._attachment) {
        //     console.log('未获取碰撞边界组件', this.node.name);
        //     return;
        // }
        // this._polygonCollider.points = [];
        // for (let index = 0; index < this._attachment.vertices.length / 2; index++) {
        //     let v2: cc.Vec2 = this._polygonCollider.points[index];
        //     if (!v2) this._polygonCollider.points.push(cc.v2());
        //     this._polygonCollider.points[index].x = this._attachment.vertices[index * 2];
        //     this._polygonCollider.points[index].y = this._attachment.vertices[index * 2 + 1];
        // }

    }

    start() {
        // console.log('spinePlusComponent start')
        if(this.customCollider == true){
            this.polygonColliderArr = this.node.getComponents(cc.PolygonCollider);
            if(this.polygonColliderArr.length > 0){
                this.node['_hitTest'] = this.hitTest.bind(this);
            }
            this.addTouchEvent();
            // console.log('使用了spinePlusComponent customCollider')
            return
        }

        this._attachment = this._spine.getAttachment('Collider', 'Collider');
        // console.log(this.node.name, this._spine);
        if (!this._attachment) {
            // console.log('spinePlusComponent 未获取碰撞边界组件', this.node.name);
            return;
        }
        this._polygonCollider = this.node.addComponent(cc.PolygonCollider);
        for (let index = 0; index < this._attachment.vertices.length / 2; index++) {
            let v2: cc.Vec2 = this._polygonCollider.points[index];
            if (!v2) this._polygonCollider.points.push(cc.v2());
            this._polygonCollider.points[index].x = this._attachment.vertices[index * 2];
            this._polygonCollider.points[index].y = this._attachment.vertices[index * 2 + 1];
        }
        // console.log('spinePlusComponent _polygonCollider_' + this.node.name, this._polygonCollider)
        this.node['_hitTest'] = this.hitTest.bind(this);
        this.addTouchEvent();
        if (this.actions.length > 0) {
            this.actionList = this.actions.split(',');
        }
        // this._spine.setEventListener((trackEntry: sp.spine.TrackEntry, event: sp.spine.Event) => {
        //     //待优化
        //     this.node.emit('SpineEvent', event.data.name);
        // });
    }

    public get actionList(): Array<string> {
        return this._actionList;
    }

    public set actionList(actionList: Array<string>) {
        this._actionList = actionList;
    }
    //添加触摸事件
    public addTouchEvent() {

        if (this.node.hasEventListener(cc.Node.EventType.TOUCH_END)) {
            return;
        }

        this.node.on(cc.Node.EventType.TOUCH_END, this.spineClick.bind(this), this);
    }

    //移除触摸事件
    public removeTouchEvent() {
        this.actionList = [];
        this.clickEvent = [];
        this.node.off(cc.Node.EventType.TOUCH_END, this.spineClick.bind(this), this);
    }

    private playSpineAnimation() {
        if (!this._actionList) return;
        this.node.pauseSystemEvents(true);
        let aList = this._actionList.concat();
        let actName = this._endActName = aList.shift();
        let loopName = aList.pop();

        this._spine.setAnimation(0, actName, false);
        for (let index = 0; index < aList.length; index++) {
            const element = this._endActName = aList[index];
            this._spine.addAnimation(0, element, false);
        }
        this._spine.addAnimation(0, loopName, true);

        this._spine.setCompleteListener((trackEntry: sp.spine.TrackEntry, loopCount: number) => {
            let cAct = trackEntry.animation.name;
            //console.log(cAct, this._endActName);
            if (cAct == this._endActName) {
                this.node.resumeSystemEvents(true);
                this._spine.setCompleteListener(null);
                cc.Component.EventHandler.emitEvents(this.completeEvent, this._spine);
            }
        });
    }

    private spineClick() {
        this.playSpineAnimation();
        //console.log('click spine');
        cc.Component.EventHandler.emitEvents(this.clickEvent, this._spine);
    }



    private hitTest(point) {
        // 坐标转换 //convertToNodeSpaceAR
        // let hitPos: cc.Vec2 = this.node.convertToNodeSpaceAR(point);
        let hitPos: cc.Vec3;
        if (this.camera) {
            let cpoint = this.camera.getScreenToWorldPoint(point);
            hitPos = this.node.convertToNodeSpaceAR(cpoint);
        }else{
            hitPos = this.node.convertToNodeSpaceAR(point);
        }

        
        if(this.polygonColliderArr != null && this.polygonColliderArr.length > 0){
            var hasHit = false
            for(var i = 0; i < this.polygonColliderArr.length; i++){
                hasHit = cc.Intersection.pointInPolygon(cc.v2(hitPos), this.polygonColliderArr[i].points);
                if(hasHit == true){
                    break
                }
            }
            // console.log('碰撞组件的点击测试1', this.node.name, hasHit, this.polygonColliderArr, hitPos, '当前是否有camera：' + this.camera)
            return hasHit
        }else{
            if (this._polygonCollider) {
                let bhit = cc.Intersection.pointInPolygon(cc.v2(hitPos), this._polygonCollider.points);
                // console.log("碰撞组件的点击测试2",  this.node.name, bhit)
                return bhit;
            }
        }
    }
}
cc.js.setClassName('SpinePlusComponent', SpinePlusComponent)