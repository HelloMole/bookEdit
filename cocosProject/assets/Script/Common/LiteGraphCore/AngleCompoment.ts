
// const {ccclass, property} = cc._decorator;

// @ccclass
export default class AngleCompoment extends cc.Component {


    private pointA = {
        X: 0,
        Y: 0
    }
    private pointB = {X:0,Y:0};
    private pointC = {X:0,Y:0};               // A,B,C分别代表中心点，起始点，结束点坐标
    private typeMouse = false;
    private allA = 0;  // 存放鼠标旋转总共的度数

    onLoad () {}

    start () {

        
    }


    public inputHandle = (inputData)=>{

        console.log("进入了开启监听")
        //判断是否开启监听
        if(inputData.targetSolt == 'number1')
        {
            if(inputData.data == 0){
            //关闭监听
            console.log("关闭了监听")
            this.node.targetOff(this)
            }
            else{
                //开启监听
                this.kaiqijiantin()
            }

        }
        else if (inputData.targetSolt == 'reset')
        {

            console.log("进入了重置")
            this.allA = 0
        }




    }

    public kaiqijiantin ()
    {

        this.node.on(cc.Node.EventType.TOUCH_START, (e)=>{
            // startX = e.getLocation().x

            var nodePos = this.node.convertToNodeSpaceAR(e.getLocation())
            this.pointB.X = nodePos.x
            this.pointB.Y = nodePos.y
            // console.log('this.pointB.X',this.pointB.X, 'this.pointB.Y', this.pointB.Y)
            this.typeMouse = true;          //获取起始点坐标
        }, this)



        this.node.on(cc.Node.EventType.TOUCH_MOVE, (e)=>{
            if(this.typeMouse) {
                var nodePos = this.node.convertToNodeSpaceAR(e.getLocation())
                this.pointC.X = nodePos.x
                this.pointC.Y = nodePos.y         // 获取结束点坐标
                var AB = {};
                var AC= {};
                AB.X = (this.pointB.X - this.pointA.X);
                AB.Y = (this.pointB.Y - this.pointA.Y);
                AC.X = (this.pointC.X - this.pointA.X);
                AC.Y = (this.pointC.Y - this.pointA.Y);                   // 分别求出AB,AC的向量坐标表示
                var direct = (AB.X * AC.Y) - (AB.Y * AC.X);           // AB与AC叉乘求出逆时针还是顺时针旋转
                var lengthAB = Math.sqrt( Math.pow(this.pointA.X - this.pointB.X, 2) +
                Math.pow(this.pointA.Y - this.pointB.Y, 2)),
                lengthAC = Math.sqrt(Math.pow(this.pointA.X - this.pointC.X, 2) +
                Math.pow(this.pointA.Y - this.pointC.Y, 2)),
                lengthBC = Math.sqrt( Math.pow(this.pointB.X - this.pointC.X, 2) +
                Math.pow(this.pointB.Y - this.pointC.Y, 2));
                var cosA = (Math.pow(lengthAB, 2) + Math.pow(lengthAC, 2) - Math.pow(lengthBC, 2)) /
                (2 * lengthAB * lengthAC);                 //   余弦定理求出旋转角
                var angleA = Math.round( Math.acos(cosA) * 180 / Math.PI );
                if (direct < 0){
                    this.allA -= angleA;                       //叉乘结果为负表示逆时针旋转， 逆时针旋转减度数
                } else {
                    this.allA += angleA;                       //叉乘结果为正表示顺时针旋转，顺时针旋转加度数
                }
                this.pointB.X = this.pointC.X;
                this.pointB.Y = this.pointC.Y;                   //运算结束后将起始点重新赋值为结束点，作为下一次的起始点

                this.outputHandle('number1',this.allA)
                // console.log("输出")
            }
        },this)

        this.node.on(cc.Node.EventType.TOUCH_END, (e)=>{
            this.typeMouse = false;

        }, this)

        this.node.on(cc.Node.EventType.TOUCH_CANCEL, (e)=>{
             this.typeMouse = false;
        }, this)



    }


    //这个方法会在robot初始化该脚本时被覆盖
    public outputHandle = (key , data)=>{
        // this.outputHandle('onclick', 1)
    }
    // update (dt) {}
}
