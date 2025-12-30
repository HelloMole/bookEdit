import {LiteGraph, LGraphNode, LGraph} from '../../litegraph/litegraph'


//将viewCode中的robot创建映射到litegraph
class AddRobot extends LGraphNode {
    // Name to show
    title = "加"
  
    constructor() {
      super()
      this.addInput("A", "number")
      this.addInput("B", "number")
      this.addOutput("A + B", "number")
      // this.properties.precision = 1
    }
  
    // Function to call when the node is executed
    onExecute() {
      var A = this.getInputData(0)
      if (A === undefined) A = 0
      var B = this.getInputData(1)
      if (B === undefined) B = 0
      this.setOutputData(0, A + B)
      // console.log('AddRobot onExecute', A + B)
    }
}
  
AddRobot.title = '加'
// Register the node type
LiteGraph.registerNodeType("middle/calculate/add", AddRobot)


class delRobot extends LGraphNode {
    // Name to show
    title = "减"
  
    constructor() {
      super()
      this.addInput("A", "number")
      this.addInput("B", "number")
      this.addOutput("A - B", "number")
      // this.properties.precision = 1
    }
  
    // Function to call when the node is executed
    onExecute() {
      var A = this.getInputData(0)
      if (A === undefined) A = 0
      var B = this.getInputData(1)
      if (B === undefined) B = 0
      this.setOutputData(0, A - B)
      // console.log('AddRobot onExecute', A - B)
    }
}
  
delRobot.title = '减'
// Register the node type
LiteGraph.registerNodeType("middle/calculate/del", delRobot)



class xRobot extends LGraphNode {
    // Name to show
    title = "乘"
  
    constructor() {
      super()
      this.addInput("A", "number")
      this.addInput("B", "number")
      this.addOutput("A x B", "number")
      // this.properties.precision = 1
    }
  
    // Function to call when the node is executed
    onExecute() {
      var A = this.getInputData(0)
      if (A === undefined) A = 0
      var B = this.getInputData(1)
      if (B === undefined) B = 0
      this.setOutputData(0, A * B)
      // console.log('xRobot onExecute', A * B)
    }
}
  
xRobot.title = '乘'
// Register the node type
LiteGraph.registerNodeType("middle/calculate/x", xRobot)


class chuRobot extends LGraphNode {
    // Name to show
    title = "除"
  
    constructor() {
      super()
      this.addInput("A", "number")
      this.addInput("B", "number")
      this.addOutput("A ÷ B", "number")
      // this.properties.precision = 1
    }
  
    // Function to call when the node is executed
    onExecute() {
      var A = this.getInputData(0)
      if (A === undefined) A = 0
      var B = this.getInputData(1)
      if (B === undefined) B = 0
      this.setOutputData(0, A / B)
      // console.log('chuRobot onExecute', A / B)
    }
}
  
chuRobot.title = '除'
// Register the node type
LiteGraph.registerNodeType("middle/calculate/chu", chuRobot)


class lengthRobot extends LGraphNode {
    // Name to show
    title = "向量长度"
  
    constructor() {
      super()
      this.addInput("x", "number")
      this.addInput("y", "number")
      this.addOutput("长度", "number")
      // this.properties.precision = 1
    }
  
    // Function to call when the node is executed
    onExecute() {
      var A = this.getInputData(0)
      if (A === undefined) A = 0
      var B = this.getInputData(1)
      if (B === undefined) B = 0
      var result = Math.sqrt(A * A + B * B)
      this.setOutputData(0, result)
      // console.log('lengthRobot onExecute', result)
    }
}
  
lengthRobot.title = '长度'
// Register the node type
LiteGraph.registerNodeType("middle/calculate/length", lengthRobot)



///covert 系列的方法
// 没有任何地方用到，暂时关闭
// class mappingRobot extends LGraphNode {
//     // Name to show
//     title = "映射"
  
//     constructor() {
//       super()
//       this.addInput("目标数值", "number")
//       this.addInput("范围左", "number")
//       this.addInput("范围右", "number")
//       this.addOutput("结果", "number")
//       // this.properties.precision = 1
//     }
  
//     // Function to call when the node is executed
//     onExecute() {
//       var A = this.getInputData(0)
//       if (A === undefined) A = 0
//       var B = this.getInputData(1)
//       if (B === undefined) B = 0
//       var C = this.getInputData(2)
//       if (C === undefined) C = 0
//       var result = C - (A) % (C - B)
//       this.setOutputData(0, result)
//       // console.log('mappingRobot onExecute', result)
//     }
// }
  
// mappingRobot.title = '映射'
// // Register the node type
// LiteGraph.registerNodeType("middle/covert/mapping", mappingRobot)


class tointRobot extends LGraphNode {
    // Name to show
    title = "取整数"
  
    constructor() {
      super()
      this.addInput("向下取整", "number")
      this.addInput("向上取整", "number")
      this.addInput("四舍五入", "number")
      this.addOutput("输出", "number")
      // this.properties.precision = 1
    }
  
    // Function to call when the node is executed
    onExecute() {
      var A = this.getInputData(0)
      var B = this.getInputData(1)
      var C = this.getInputData(2)

      if (A !== undefined){
        this.setOutputData(0, Math.floor(A))
      }else if(B !== undefined){
        this.setOutputData(0, Math.ceil(B))
      }else if(C !== undefined){
        this.setOutputData(0, Math.round(C))
      }
      // console.log('tointRobot onExecute', A, B, C)
    }
}
  
tointRobot.title = '取整数'
// Register the node type
LiteGraph.registerNodeType("middle/covert/toint", tointRobot)




class squareRootRobot extends LGraphNode {
    // Name to show
    title = "平方根"
  
    constructor() {
      super()
      this.addInput("输入", "number")
      this.addOutput("开平方", "number")
      // this.properties.precision = 1
    }
  
    // Function to call when the node is executed
    onExecute() {
      var A = this.getInputData(0)
      if (A !== undefined){
        this.setOutputData(0, Math.sqrt(A))
        // console.log('squareRootRobot onExecute', Math.sqrt(A))
      }
    }
}
  
squareRootRobot.title = '平方根'
// Register the node type
LiteGraph.registerNodeType("middle/covert/squareRoot", squareRootRobot)




class absRobot extends LGraphNode {
    // Name to show
    title = "绝对值"
  
    constructor() {
      super()
      this.addInput("输入", "number")
      this.addOutput("绝对值", "number")
      // this.properties.precision = 1
    }
  
    // Function to call when the node is executed
    onExecute() {
      var A = this.getInputData(0)
      if (A !== undefined){
        this.setOutputData(0, Math.abs(A))
        // console.log('absRobot onExecute', Math.abs(A))
      }
    }
}
  
absRobot.title = '绝对值'
// Register the node type
LiteGraph.registerNodeType("middle/covert/abs", absRobot)




class revertNegativeRobot extends LGraphNode {
    // Name to show
    title = "正负反转"
  
    constructor() {
      super()
      this.addInput("输入", "number")
      this.addOutput("输出", "number")
      // this.properties.precision = 1
    }
  
    // Function to call when the node is executed
    onExecute() {
      var A = this.getInputData(0)
      if (A !== undefined){
        this.setOutputData(0, A * -1)
        // console.log('revertNegativeRobot onExecute', A * -1)
      }
    }
}
  
revertNegativeRobot.title = '正负反转'
// Register the node type
LiteGraph.registerNodeType("middle/covert/revertNegative", revertNegativeRobot)



///angleCalculate
class angleDifferenceRobot extends LGraphNode {
    // Name to show
    title = "角度差"
  
    constructor() {
      super()
      this.addInput("角度A", "number")
      this.addInput("角度B", "number")
      this.addOutput("输出", "number")

      this.addProperty("inputType", '角度', 'enum', {values: ['角度', '向量']});   //增加一个变量，    变量名称， 变量名称
    //   this.progress = 0.5               //设置节点的进度，一般来说用于在执行的时候设置
		  this.addWidget("combo","输入的类型",this.properties.inputType,{ property: "inputType", values:['角度', '向量'] } );
      // this.properties.precision = 1
    }
  
    // Function to call when the node is executed
    onExecute() {
      var number1 = this.getInputData(0)
      var number2 = this.getInputData(1)

      if (number1 !== undefined && number2 !== undefined){
        var result = 0
        if(this.properties.inputType == 0 || this.properties.inputType == '角度'){
            var number = Math.max(number1 , number2) - Math.min(number1 , number2)
            result = Math.min(360 - number, number)
        }else{
            //输入向量求夹角
            var x1 = number1.x
            var y1 = number1.y

            var x2 = number2.x
            var y2 = number2.y

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
        this.setOutputData(0, result)
        // console.log('angleDifferenceRobot onExecute', result)
      }
    }
}
  
angleDifferenceRobot.title = '角度差'
// Register the node type
LiteGraph.registerNodeType("middle/angleCalculate/angleDifference", angleDifferenceRobot)




class vectorToAngelRobot extends LGraphNode {
    // Name to show
    title = "将位置转换为角度"
  
    constructor() {
      super()
      this.addInput("x坐标", "number")
      this.addInput("y坐标", "number")
      this.addOutput("角度", "number")

    //   this.addProperty("inputType", '角度', 'enum', {values: ['角度', '向量']});   //增加一个变量，    变量名称， 变量名称
    // //   this.progress = 0.5               //设置节点的进度，一般来说用于在执行的时候设置
		//   this.addWidget("combo","输入的类型",this.properties.inputType,{ property: "inputType", values:['角度', '向量'] } );
      // this.properties.precision = 1
    }
  
    // Function to call when the node is executed
    onExecute() {
      var number1 = this.getInputData(0)
      var number2 = this.getInputData(1)

      if (number1 !== undefined && number2 !== undefined){
        var result = Math.atan2(this.number2 , this.number1) * (180 / Math.PI)
        this.setOutputData(0, result)
        // console.log('vectorToAngelRobot onExecute', result)
      }
    }
}
  
vectorToAngelRobot.title = '将位置转换为角度'
// Register the node type
LiteGraph.registerNodeType("middle/angleCalculate/vectorToAngel", vectorToAngelRobot)




class angleConvertVectorRobot extends LGraphNode {
    // Name to show
    title = "将角度转换为位置"
  
    constructor() {
      super()
      this.addInput("角度", "number")
      this.addInput("斜边长", "number")

      this.addOutput("x长", "number")
      this.addOutput("y长", "number")

    //   this.addProperty("inputType", '角度', 'enum', {values: ['角度', '向量']});   //增加一个变量，    变量名称， 变量名称
    // //   this.progress = 0.5               //设置节点的进度，一般来说用于在执行的时候设置
		//   this.addWidget("combo","输入的类型",this.properties.inputType,{ property: "inputType", values:['角度', '向量'] } );
      // this.properties.precision = 1
    }
  
    // Function to call when the node is executed
    onExecute() {
      var number1 = this.getInputData(0)
      var number2 = this.getInputData(1)

      if (number1 !== undefined && number2 !== undefined){
        var angle = 180 / Math.PI * number1
        var x = Math.cos(angle) * number2
        var y = Math.sin(angle) * number2

        this.setOutputData(0, x)
        this.setOutputData(1, y)

        // console.log('angleConvertVectorRobot onExecute', x, y)
      }
    }
}
  
angleConvertVectorRobot.title = '将角度转换为位置'
// Register the node type
LiteGraph.registerNodeType("middle/angleCalculate/angleConvertVector", angleConvertVectorRobot)



///compare
class equireRobot extends LGraphNode {
    // Name to show
    title = "等于"
  
    constructor() {
      super()
      this.addInput("A", "number")
      this.addInput("B", "number")

      this.addOutput("A == B?", "number")
    //   this.addProperty("inputType", '角度', 'enum', {values: ['角度', '向量']});   //增加一个变量，    变量名称， 变量名称
    // //   this.progress = 0.5               //设置节点的进度，一般来说用于在执行的时候设置
		//   this.addWidget("combo","输入的类型",this.properties.inputType,{ property: "inputType", values:['角度', '向量'] } );
      // this.properties.precision = 1
    }
  
    // Function to call when the node is executed
    onExecute() {
      var number1 = this.getInputData(0)
      var number2 = this.getInputData(1)
      var result = 0
      if(number1 == number2){ 
        result = 1
      }
      this.setOutputData(0, result)
      // console.log('equireRobot onExecute', result)
    }
}
  
equireRobot.title = '等于'
// Register the node type
LiteGraph.registerNodeType("middle/compare/equire", equireRobot)





class litterRobot extends LGraphNode {
    // Name to show
    title = "小于"
  
    constructor() {
      super()
      this.addInput("A", "number")
      this.addInput("B", "number")

      this.addOutput("A < B?", "number")
    //   this.addProperty("inputType", '角度', 'enum', {values: ['角度', '向量']});   //增加一个变量，    变量名称， 变量名称
    // //   this.progress = 0.5               //设置节点的进度，一般来说用于在执行的时候设置
		//   this.addWidget("combo","输入的类型",this.properties.inputType,{ property: "inputType", values:['角度', '向量'] } );
      // this.properties.precision = 1
    }
  
    // Function to call when the node is executed
    onExecute() {
      var number1 = this.getInputData(0)
      var number2 = this.getInputData(1)
      var result = 0
      if(number1 < number2){
        result = 1
      }
      this.setOutputData(0, result)
      // console.log('litterRobot onExecute', result)
    }
}
  
litterRobot.title = '小于'
// Register the node type
LiteGraph.registerNodeType("middle/compare/litter", litterRobot)




class biggerRobot extends LGraphNode {
    // Name to show
    title = "大于"
  
    constructor() {
      super()
      this.addInput("A", "number")
      this.addInput("B", "number")

      this.addOutput("A > B?", "number")
    //   this.addProperty("inputType", '角度', 'enum', {values: ['角度', '向量']});   //增加一个变量，    变量名称， 变量名称
    // //   this.progress = 0.5               //设置节点的进度，一般来说用于在执行的时候设置
		//   this.addWidget("combo","输入的类型",this.properties.inputType,{ property: "inputType", values:['角度', '向量'] } );
      // this.properties.precision = 1
    }
  
    // Function to call when the node is executed
    onExecute() {
      var number1 = this.getInputData(0)
      var number2 = this.getInputData(1)
      var result = 0
      if(number1 > number2){
        result = 1
      }
      this.setOutputData(0, result)
      // console.log('biggerRobot onExecute', result)
    }
}
  
biggerRobot.title = '大于'
// Register the node type
LiteGraph.registerNodeType("middle/compare/bigger", biggerRobot)



class inRangeRobot extends LGraphNode {
    // Name to show
    title = "范围内"
  
    constructor() {
      super()
      this.addInput("A", "number")
      this.addInput("B", "number")
      this.addInput("C", "number")

      this.addOutput("结果", "number")

      this.addProperty("A", 0,  'number');   //增加一个变量，    变量名称， 变量名称
      this.addProperty("C", 10, 'number');   //增加一个变量，    变量名称， 变量名称


      this.addProperty("firstCompire", '<', 'enum', {values: ['<', '<=']});   //增加一个变量，    变量名称， 变量名称
      this.addProperty("secCompire", '<', 'enum', {values: ['<', '<=']});

      this.addWidget("number", '最小值A', 0, 'A', {precision: 0})
      // this.addWidget("number", '比较值', 5, 'B')
      this.addWidget("number", '最大值C', 10, 'C', {precision: 0})

    //   this.addProperty("inputType", '角度', 'enum', {values: ['角度', '向量']});   //增加一个变量，    变量名称， 变量名称
    // //   this.progress = 0.5               //设置节点的进度，一般来说用于在执行的时候设置
		  this.addWidget("combo", "A和B比较", this.properties.firstCompire, { property: "firstCompire", values: inRangeRobot.compireType } );
      this.addWidget("combo", "B和C比较", this.properties.secCompire, { property: "secCompire", values: inRangeRobot.compireType } );

      // this.serialize_widgets = true;
      // this.properties.precision = 1
    }

    getTitle(){
      var firstCompire = this.properties['firstCompire']
      var secCompire = this.properties['secCompire']
      return 'A' + firstCompire + 'B' + secCompire + 'C'
    }
  
    // Function to call when the node is executed
    onExecute() {
      var number1 = this.getInputOrProperty('A')
      var number2 = this.getInputData(1)
      var number3 = this.getInputOrProperty('C')

      var result = 0

      var firstCompire = this.properties['firstCompire']
      var secCompire = this.properties['secCompire']

      if(firstCompire == '<'){
        result = number1 < number2
      }
      if(firstCompire == '<='){
        result = number1 <= number2
      }
      if(secCompire == '<'){
        result = number2 < number3
      }
      if(secCompire == '<='){
        result = number2 <= number3
      }

      if(result == true){
        result = 1
      }
      this.setOutputData(0, result)
      // console.log('inRangeRobot onExecute', result)
    }
}
  
inRangeRobot.title = '范围内'
inRangeRobot.compireType = ['<', '<=']
// Register the node type
LiteGraph.registerNodeType("middle/compare/inRange", inRangeRobot)


//和上面的功能重复，暂时屏蔽
// class inRangeEquireRobot extends LGraphNode {
//     // Name to show
//     title = "闭区间范围内"
  
//     constructor() {
//       super()
//       this.addInput("A", "number")
//       this.addInput("B", "number")
//       this.addInput("C", "number")

//       this.addOutput("A <= B <= C?", "number")
      
//       this.addProperty("A和B对比", '<', 'enum', {values: ['<', '<=']});   //增加一个变量，    变量名称， 变量名称
//       this.addProperty("B和C对比", '<', 'enum', {values: ['<', '<=']});   //增加一个变量，    变量名称， 变量名称

//     //   this.addProperty("inputType", '角度', 'enum', {values: ['角度', '向量']});   //增加一个变量，    变量名称， 变量名称
//     // //   this.progress = 0.5               //设置节点的进度，一般来说用于在执行的时候设置
// 		//   this.addWidget("combo","输入的类型",this.properties.inputType,{ property: "inputType", values:['角度', '向量'] } );
//       // this.properties.precision = 1
//     }
  
//     // Function to call when the node is executed
//     onExecute() {
//       var number1 = this.getInputData(0)
//       var number2 = this.getInputData(1)
//       var number3 = this.getInputData(2)

//       var result = 0
//       if(number2 >= number1 && number2 <= number3){
//         result = 1
//       }
//       this.setOutputData(0, result)
//       // console.log('inRangeEquireRobot onExecute', result)
//     }
// }
  
// inRangeEquireRobot.title = '闭区间范围内'
// // Register the node type
// LiteGraph.registerNodeType("middle/compare/inRangeEquire", inRangeEquireRobot)




//logic
class allRightRobot extends LGraphNode {
    // Name to show
    title = "全部正确"
  
    constructor() {
      super()
      this.addInput("A", "number")
      this.addInput("B", "number")

      this.addOutput("结果", "number")
    //   this.addProperty("inputType", '角度', 'enum', {values: ['角度', '向量']});   //增加一个变量，    变量名称， 变量名称
    // //   this.progress = 0.5               //设置节点的进度，一般来说用于在执行的时候设置
		//   this.addWidget("combo","输入的类型",this.properties.inputType,{ property: "inputType", values:['角度', '向量'] } );
      // this.properties.precision = 1
    }
  
    // Function to call when the node is executed
    onExecute() {
      var number1 = this.getInputData(0)
      var number2 = this.getInputData(1)

      var result = 0
      if(number1 == 0 || number1 === undefined){
          result = 0
      }
      if(number2 == 0 || number2 === undefined){
          result = 0
      }
      this.setOutputData(0, result)
      // console.log('allRightRobot onExecute', result)
    }
}
  
allRightRobot.title = '全部正确'
// Register the node type
LiteGraph.registerNodeType("middle/logic/allRight", allRightRobot)


class orRightRobot extends LGraphNode {
    // Name to show
    title = "任意一个正确"
  
    constructor() {
      super()
      this.addInput("A", "number")
      this.addInput("B", "number")
      this.addInput("C", "number")

      this.addOutput("结果", "number")
    //   this.addProperty("inputType", '角度', 'enum', {values: ['角度', '向量']});   //增加一个变量，    变量名称， 变量名称
    // //   this.progress = 0.5               //设置节点的进度，一般来说用于在执行的时候设置
		//   this.addWidget("combo","输入的类型",this.properties.inputType,{ property: "inputType", values:['角度', '向量'] } );
      // this.properties.precision = 1
    }
  
    // Function to call when the node is executed
    onExecute() {
      var number1 = this.getInputData(0)
      var number2 = this.getInputData(1)
      var number3 = this.getInputData(2)

      var result = 0
      if(number1 !== undefined){
          if(number1 != 0){
              result = 1
          }
      }
      if(number2 !== undefined){
          if(number2 != 0){
              result = 1
          }
      }
      if(number3 !== undefined){
          if(number3 != 0){
              result = 1
          }
      }
      this.setOutputData(0, result)
      // console.log('orRightRobot onExecute', result)
    }
}
  
orRightRobot.title = '任意一个正确'
// Register the node type
LiteGraph.registerNodeType("middle/logic/orRight", orRightRobot)


class allToggle extends LGraphNode {
  // Name to show
  title = "全部触发"

  constructor() {
    super()
    this.mode = LiteGraph.ON_EVENT; 
    this.addInput("触发_0", LiteGraph.ACTION)
    this.addInput("触发_1", LiteGraph.ACTION)

    this.addOutput("触发", LiteGraph.EVENT)
    this.addProperty('resetWhenToggle', false, 'boolean')
    this.addWidget('toggle', '触发后重置', this.properties.resetWhenToggle, 'resetWhenToggle')

    // this.addProperty("inputType", '角度', 'enum', {values: ['角度', '向量']});   //增加一个变量，    变量名称， 变量名称
  // //   this.progress = 0.5               //设置节点的进度，一般来说用于在执行的时候设置
  //   this.addWidget("combo","输入的类型",this.properties.inputType,{ property: "inputType", values:['角度', '向量'] } );
    // this.properties.precision = 1
    this.toggleFlag = {}
  }

  onStop(){
    this.toggleFlag = {}
  }

  onGetInputs() {
		return [["触发_" + this.inputs.length, LiteGraph.ACTION]];
	};

  onAction(action, param, options) {
    // console.log('allToggle', action, param, options)
    this.toggleFlag[action] = 1
    if(Object.keys(this.toggleFlag).length == this.inputs.length){
        this.triggerSlot(0)
        if(this.properties.resetWhenToggle == true){
          this.toggleFlag = {}
        }
    }
  }

  // Function to call when the node is executed
  // onExecute() {
  //   var number1 = this.getInputData(0)
  //   var number2 = this.getInputData(1)

  //   var result = 0
  //   if(number1 == 0 || number1 === undefined){
  //       result = 0
  //   }
  //   if(number2 == 0 || number2 === undefined){
  //       result = 0
  //   }
  //   this.setOutputData(0, result)
  //   // console.log('allToggle onExecute', result)
  // }
}

allToggle.title = '全部触发'
// Register the node type
LiteGraph.registerNodeType("middle/logic/allToggle", allToggle)


class orToggle extends LGraphNode {
  // Name to show
  title = "任意触发"

  constructor() {
    super()
    this.mode = LiteGraph.ON_EVENT; 
    this.addInput("触发_0", LiteGraph.ACTION)
    this.addInput("触发_1", LiteGraph.ACTION)

    this.addOutput("触发", LiteGraph.EVENT)
    //   this.addProperty("inputType", '角度', 'enum', {values: ['角度', '向量']});   //增加一个变量，    变量名称， 变量名称
    // //   this.progress = 0.5               //设置节点的进度，一般来说用于在执行的时候设置
    //   this.addWidget("combo","输入的类型",this.properties.inputType,{ property: "inputType", values:['角度', '向量'] } );
    // this.properties.precision = 1
    // this.findInputSlotFree({typesNotAccepted: []})
    // this.findInputByType(LiteGraph.ACTION)
    // this.getInputNode()
    // this.getInputNode()
    // this.findSlotByType(true, LiteGraph.ACTION, false, true, true)
    // let oldLink = this.getInputLink(0)
    // oldLink.origin_slot
    
  }

  getFreeSoltIndex(){
      let soltIndex = this.findSlotByType(true, LiteGraph.ACTION, false, true, true)
      if(soltIndex == -1){
        this.addInput('触发_' + this.inputs.length, LiteGraph.ACTION)
        soltIndex = this.inputs.length - 1
      }
      return soltIndex
  }

  //检查一个节点是否已经连接我的node了
  checkHasConnectMyInput(node){
    let hasConnect = false
    for(var i = 0; i < this.inputs.length; i++){
      let connectNode = this.getInputNode(i)
      if(connectNode != null){
        if(connectNode.id == node.id){
          hasConnect = true
          break
        }
      }
    }
    return hasConnect
  }

  findConnectSoltIndex(nodeId){
    let index = -1
    for(var i = 0; i < this.inputs.length; i++){
      let connectNode = this.getInputNode(i)
      if(connectNode != null){
        if(connectNode.id == nodeId){
          index = i
          break
        }
      }
    }
    return index
  }

  // onConnectInput(inputIndex, outPutType, output, linkedNode, outputIndex){
  //     // console.log('onConnectInput', inputIndex, outPutType, output, linkedNode, outputIndex)
  // }

  onGetInputs() {
		return [["触发_" + this.inputs.length, LiteGraph.ACTION]];
	};

  onAction(action, param, options) {
    // console.log('allToggle', action, param, options)
    this.triggerSlot(0)
  }
}

orToggle.title = '任意触发'
// Register the node type
LiteGraph.registerNodeType("middle/logic/orToggle", orToggle)



class notRightRobot extends LGraphNode {
    // Name to show
    title = "反转结果"
  
    constructor() {
      super()
      this.addInput("A", "number")

      this.addOutput("结果", "number")
    //   this.addProperty("inputType", '角度', 'enum', {values: ['角度', '向量']});   //增加一个变量，    变量名称， 变量名称
    // //   this.progress = 0.5               //设置节点的进度，一般来说用于在执行的时候设置
		//   this.addWidget("combo","输入的类型",this.properties.inputType,{ property: "inputType", values:['角度', '向量'] } );
      // this.properties.precision = 1
    }
  
    // Function to call when the node is executed
    onExecute() {
      var number1 = this.getInputData(0)
      var result = !number1 ? 1 : 0
    
      this.setOutputData(0, result)
      // console.log('notRightRobot onExecute', result)
    }
}
  
notRightRobot.title = '反转结果'
// Register the node type
LiteGraph.registerNodeType("middle/logic/notRight", notRightRobot)


// change randomNum
class randomNumRobot extends LGraphNode {
    // Name to show
    title = "随机整数"
    des = '如果没有输入值，返回一个大于0的随机整数'
  
    constructor() {
      super()
      this.addInput("随机范围", "number")
      this.addOutput("结果", "number")

      this.addProperty("modal", '每次随机', 'enum', {values: ['仅一次', '每次随机']});   //增加一个变量，    变量名称， 变量名称
    //   this.progress = 0.5               //设置节点的进度，一般来说用于在执行的时候设置
		  this.addWidget("combo","",this.properties.modal,{ property: "modal", values:['仅一次', '每次随机'] } );
      // this.serialize_widgets = true;
    //   this.addProperty("inputType", '角度', 'enum', {values: ['角度', '向量']});   //增加一个变量，    变量名称， 变量名称
    // //   this.progress = 0.5               //设置节点的进度，一般来说用于在执行的时候设置
		//   this.addWidget("combo","输入的类型",this.properties.inputType,{ property: "inputType", values:['角度', '向量'] } );
      // this.properties.precision = 1
    }
  
    // Function to call when the node is executed
    onExecute() {
      var number1 = this.getInputData(0)
      if(number1 === undefined){
        number1 = 10000000
      }
      if(this.properties.modal == '每次随机'){
        var random = Math.floor(Math.random() * number1) // [0,输入值-1]
        this.setOutputData(0, random)
      }else{
        if(this.random == null){
          this.random = Math.floor(Math.random() * number1)
          this.setOutputData(0, this.random)
        }
      }
      // console.log('randomNumRobot onExecute', random)
    }
}
  
randomNumRobot.title = '随机整数'
// Register the node type
LiteGraph.registerNodeType("middle/change/randomNum", randomNumRobot)



class timeDownRobot extends LGraphNode {
    // Name to show
    title = "延迟触发"
    desc = "等待时间如果为0的话表示等待1帧。输入的值不为0时即执行倒计时，输入值为0时停止倒计时，输出的值为当前输出帧和上一帧的时间差"
  
    constructor() {
      super()
      this.addProperty("time_in_s", 1);
      this.widget = this.addWidget("number","秒", 1, "time_in_s", {precision: 2, min: 0, step: 0.1});
      // this.serialize_widgets = true;
      this.addInput("开始",  LiteGraph.ACTION)
      this.addOutput("结束时", LiteGraph.EVENT) 
      this._pending = [];
    //   this.addProperty("inputType", '角度', 'enum', {values: ['角度', '向量']});   //增加一个变量，    变量名称， 变量名称
    // //   this.progress = 0.5               //设置节点的进度，一般来说用于在执行的时候设置
		//   this.addWidget("combo","输入的类型",this.properties.inputType,{ property: "inputType", values:['角度', '向量'] } );
      // this.properties.precision = 1
    }
  
    // Function to call when the node is executed
    onAction(action, param, options) {
        var time = this.properties.time_in_s;
        if (time <= 0) {
            // this.trigger(null, param, options);
            this.triggerSlot(0)
        } else {
            this._pending.push([time, param]);
        }
    };

    onExecute() {
       var dt = this.graph.elapsed_time; //in ms

        if (this.isInputConnected(1)) {
            this.properties.time_in_s = this.getInputData(1);
        }

        for (var i = 0; i < this._pending.length; ++i) {
            var actionPass = this._pending[i];
            actionPass[0] -= dt;
            if (actionPass[0] > 0) {
                continue;
            }

            //remove
            this._pending.splice(i, 1);
            --i;

            //trigger
            // this.trigger(null, actionPass[1], options);
            this.triggerSlot(0)
        }
    }

    onGetInputs() {
        return [["time_in_s", "number"]];
    };

    onStop(){
      //清空等待延迟触发的列队
      this._pending = []
    }
}
  
timeDownRobot.title = '延迟触发'
// Register the node type
LiteGraph.registerNodeType("middle/change/timeDown", timeDownRobot)



class timerRobot extends LGraphNode {
    // Name to show
    title = "间隔触发"
    desc = "等待时间如果为0的话表示等待1帧。输入的值不为0时即执行倒计时，输入值为0时停止倒计时，输出的值为当前输出帧和上一帧的时间差"
  
    constructor() {
      super()
      this.addProperty("interval", 1000);
      this.addProperty("event", "tick");
      this.widget = this.addWidget("number","毫秒",1000,"interval", {precision: 0});
      // this.serialize_widgets = true;
      this.addOutput("触发", LiteGraph.EVENT);
      this.time = 0;
      this.last_interval = 1000;
      this.triggered = false;
    //   this.addProperty("inputType", '角度', 'enum', {values: ['角度', '向量']});   //增加一个变量，    变量名称， 变量名称
    // //   this.progress = 0.5               //设置节点的进度，一般来说用于在执行的时候设置
		//   this.addWidget("combo","输入的类型",this.properties.inputType,{ property: "inputType", values:['角度', '向量'] } );
      // this.properties.precision = 1
    }
  
    getTitle() {
        if(this.graph.state == LGraph.STATUS_RUNNING){
          return "每隔" + this.last_interval.toString() + "ms";
        }else{
          return timerRobot.title
        }
    };

    //node也是有开始事件的
    onStart() {
        this.time = 0;
    };

    // Function to call when the node is executed
    onAction(action, param, options) {
        var time = this.properties.interval;
        if (time <= 0) {
            this.trigger(null, param, options);
        } else {
            this._pending.push([time, param]);
        }
    };

    onExecute() {
      var dt = this.graph.elapsed_time * 1000; //in ms

      var trigger = this.time == 0;

      this.time += dt;
      this.last_interval = Math.max(
          1,
          this.getInputOrProperty("interval") | 0
      );

      if (
          !trigger &&
          (this.time < this.last_interval || isNaN(this.last_interval))
      ) {
          if (this.inputs && this.inputs.length > 1 && this.inputs[1]) {
              this.setOutputData(1, false);
          }
          return;
      }

      this.triggered = true;
      this.time = this.time % this.last_interval;
      // this.trigger("on_tick", this.properties.event);
      this.triggerSlot(0, this.properties.event)
      if (this.inputs && this.inputs.length > 1 && this.inputs[1]) {
          this.setOutputData(1, true);
      }
    }

    onDrawBackground() {
        this.boxcolor = this.triggered
            ? timerRobot.on_color
            : timerRobot.off_color;
        this.triggered = false;
    };

    onGetInputs() {
        return [["interval", "number"]];
    };

    // onGetOutputs() {
    //     return [["tick", "boolean"]];
    // };
}

timerRobot.on_color = "#AAA";
timerRobot.off_color = "#222";
timerRobot.title = '间隔触发'
// Register the node type
LiteGraph.registerNodeType("middle/change/timeDownCycle", timerRobot)




class upCountRobot extends LGraphNode {
    // Name to show
    title = "计数"
    desc = "等待时间如果为0的话表示等待1帧。输入的值不为0时即执行倒计时，输入值为0时停止倒计时，输出的值为当前输出帧和上一帧的时间差"
  
    constructor() {
      super()
      // this.serialize_widgets = true;
      this.mode = LiteGraph.ON_EVENT

      this.addInput("开始值", 'number')
      this.addInput("增加",  LiteGraph.ACTION)
      this.addInput("减少",  LiteGraph.ACTION)
      this.addInput("重置",  LiteGraph.ACTION)

      this.addOutput("数值", 'number') 
      this.addOutput("变化", LiteGraph.EVENT) 

      
      this.addProperty("开始值", 0, 'number');   //增加一个变量，    变量名称， 变量名称
      this.addWidget("number","开始值", 0, "开始值", {precision: 0});

      this.addProperty("modal", '无限制', 'enum', {values: ['无限制', '范围限制', '循环', '来回']});   //增加一个变量，    变量名称， 变量名称
      this.addWidget("combo","模式",this.properties.modal,{ property: "modal", values:['无限制', '范围限制', '循环', '来回'] } );

      this.addProperty("min", 1,  'number')
      this.addWidget("number","最小值", 1, "min", {precision: 0});

      this.addProperty("max", 10,  'number')
      this.addWidget("number","最大值", 10, "max", {precision: 0});

      this.addProperty("upStepmodal", '不乘以时间', 'enum', {values: ['乘以时间', '不乘以时间']});   //增加一个变量，    变量名称， 变量名称
      this.addWidget("combo","步进模式",this.properties.upStepmodal,{ property: "upStepmodal", values:['乘以时间', '不乘以时间'] } );

      this.addProperty("stepValue", 1,  'number')
      this.addWidget("number","步进数值", 1, "stepValue", {precision: 0});
      
      this.updateWidght()
    // //   this.progress = 0.5               //设置节点的进度，一般来说用于在执行的时候设置
		  // 
      // this.properties.precision = 1
    }

    onStart(){
      this.repetDir = 1
      this.value = this.getInputOrProperty("开始值") | 0
    }

    updateWidght(){
      var value = this.properties.modal
      if(value != '无限制'){
          this.widgets.map((widget)=>{
            if(widget.name == '最大值' || widget.name == '最小值'){
                widget.disabled = false
            }
          })
        }else{
          this.widgets.map((widget)=>{
            if(widget.name == '最大值' || widget.name == '最小值'){
                widget.disabled = true
            }
          })
        }
    }

    onWidgetChanged(name, value, old_value, widget){
      // console.log('onWidgetChanged', node, name, value, old_value)
      // this.isWidgetVisible
      if(name == '模式'){
          this.updateWidght()
      }
    }
  
    // Function to call when the node is executed
    onAction(action, param, options) {
      var startValue = this.getInputOrProperty("开始值") || 0
      if(this.value == null){
        this.value = startValue
      }
      // var stepValue = this.properties.stepValue
      // console.log('action', action, param)  
        if (action == "增加") {
          this.upCount(1)
        }else if(action == '减少'){
          this.upCount(-1)
        }else if(action == '重置'){
          this.value = startValue
          this.setOutputData(0, this.value)
        }
    };

    upCount(baseDir){
      var stepValue = this.properties.stepValue
      var min = this.properties.min
      var max = this.properties.max
      // var dt = this.graph.elapsed_time * 1000; //in ms
      var time = this.properties.upStepmodal == '不乘以时间' ? 1 : this.graph.elapsed_time * 1000; //in ms

      var modal = this.properties.modal
      // console.log('增加的值', this.repetDir * time * stepValue * baseDir)
      // console.log('增加前的值', this.value)
      this.value += (this.repetDir * time * stepValue * baseDir)
      // console.log('增加后的值', this.value, modal, max, min)

      // ['无限制', '范围限制', '循环', '来回']
      if(modal == '范围限制'){
        if(this.value > max){
          this.value = max
        }
      }else if(modal == '循环'){
        if(this.value > max){
          this.value = min
        }
      }else if(modal == '来回'){
        if(this.number >= max){
          this.repetDir = -1
        }else if(this.number <= min){
          this.repetDir = 1
        }
      }
      // console.log('当前技数值', this.value)
      this.setOutputData(0, this.value)
      this.triggerSlot(1)
    }

    onExecute() {
      this.upCount(1)
    }
}
  
upCountRobot.title = '计数'
// Register the node type
LiteGraph.registerNodeType("middle/change/upCount", upCountRobot)




class checkTagRobot extends LGraphNode {
    // Name to show
    title = "标记状态"
    des = '用于标记一个执行中的状态'
  
    constructor() {
      super()
      this.addInput("值", 'number')
      this.addInput("修改", LiteGraph.ACTION)


      this.addOutput("输出", "number")

      this.addProperty("customeName", "", 'string')
      this.addWidget('text', '状态名称', "", 'customeName')

      this.addProperty("customeValue", "", 'string')
      this.addWidget('text', '初始值', "", 'customeValue')

      this.addProperty("container", checkTagRobot.GRAPH, 'enum', {values: checkTagRobot.containerEnum});   //增加一个变量，    变量名称， 变量名称
    	this.addWidget("combo","状态权限",this.properties.container,{ property: "container", values: checkTagRobot.containerEnum } );

      this.addProperty("modal", '自定义', 'enum', {values: checkTagRobot.modalEnum});   //增加一个变量，    变量名称， 变量名称
		  this.addWidget("combo","",this.properties.modal,{ property: "modal", values: checkTagRobot.modalEnum } );
      
      this.addProperty('initWithValue', false, 'boolean')
      this.addWidget('toggle', '初始化时将自定义状态值赋值', this.properties.initWithValue, 'initWithValue')

    //   this.progress = 0.5               //设置节点的进度，一般来说用于在执行的时候设置
      // this.serialize_widgets = true;
      this.updateWidght()
    //   this.addProperty("inputType", '角度', 'enum', {values: ['角度', '向量']});   //增加一个变量，    变量名称， 变量名称
    // //   this.progress = 0.5               //设置节点的进度，一般来说用于在执行的时候设置
		//   this.addWidget("combo","输入的类型",this.properties.inputType,{ property: "inputType", values:['角度', '向量'] } );
      // this.properties.precision = 1
    }

    updateWidght(){
      var value = this.properties.modal
      if(value == '自定义'){
          this.widgets.map((widget)=>{
            if(widget.name == '状态名称'){
                widget.disabled = false
            }
          })
        }else{
          this.widgets.map((widget)=>{
            if(widget.name == '状态名称'){
                widget.disabled = true
            }
          })
        }
    }

    onWidgetChanged(name, value, old_value, widget){
      console.log('onWidgetChanged', name, value, old_value)
      // this.isWidgetVisible
      if(name == ''){
          this.updateWidght()
      }
    }

    //获取存放变量的位置，
    getContainer()
    {
      switch(this.properties.container)
      {
        case checkTagRobot.GRAPH:
          if(this.graph)
            return this.graph.vars;
          return {};
          break;
        case checkTagRobot.GLOBALSCOPE:
          return window;
          break;
        case checkTagRobot.LITEGRAPH:
        default:
          return LiteGraph.Globals;
          break;
      }
    }

    getVarName(){
      if(this.properties.modal != '自定义'){
        return this.properties.modal
      }else{
        return this.properties.customeName
      }
    }

    getTitle(){
      return this.getVarName()
    }

    onStart(){
      var container = this.getContainer();
      var varName = this.getVarName()
      if(this.properties.customeValue != ''){
        //如果设置了初始值，就会在启动的时候设置初始化值
        this.value = this.properties.customeValue
        container[varName] = this.value;
        this.setOutputData(0, this.value );
      }
    }

    onAction(action, param, options) {
      if(action == '修改'){
        var container = this.getContainer();
        var varName = this.getVarName()
        //将状态修改为输入值，如果没有连接输入值，将状态修改为初始值(即使初始值为空)
        if(this.isInputConnected(0))
        {
          this.value = this.getInputData(0);
        }else{
          this.value = this.properties.customeValue
        }
        container[varName] = this.value;
        this.setOutputData(0, this.value );
      }
    }
  
    // Function to call when the node is executed
    onExecute(){
      var container = this.getContainer();
      var varName = this.getVarName()

      //只有Action会修改值。普通执行仅仅返回值
      // if(this.isInputConnected(0))
      // {
      //   this.value = this.getInputData(0);
      //   container[varName] = this.value;
      //   this.setOutputData(0, this.value );
      //   return;
      // }

      this.setOutputData(0, container[varName]);
    }
}
 
checkTagRobot.modalEnum = ['自定义','动画是否播放中', '是否不可交互', '游戏是否开始', '游戏是否结束', '引导是否显示','当前执行逻辑','逻辑A是否触发','逻辑B是否触发','逻辑C是否触发','逻辑D是否触发']
checkTagRobot.LITEGRAPH = '所有分镜'; //between all graphs
checkTagRobot.GRAPH = '仅当前分镜'	//only inside this graph
checkTagRobot.GLOBALSCOPE = 'Window';	//attached to Window
checkTagRobot.containerEnum = [checkTagRobot.GRAPH, checkTagRobot.LITEGRAPH, checkTagRobot.GLOBALSCOPE]

checkTagRobot.title = '标记状态'
// Register the node type
LiteGraph.registerNodeType("middle/change/checkTag", checkTagRobot)




class dataObjectRobot extends LGraphNode {
  // Name to show
  title = "数据结构"
  desc = "输出对象的key和values，如果挂载的是对象，循环对象中每个key，如果是数组，循环数组每个i，每每次循环都会触发toggle事件"

  constructor() {
    super()
    // this.serialize_widgets = true;
    // this.serialize_widgets = true;

    this.addInput("挂载", 'object')
    // this.addInput("触发",  LiteGraph.ACTION)
    // this.addInput("减少",  LiteGraph.ACTION)
    // this.addInput("重置",  LiteGraph.ACTION)

    this.addOutput("key", 0)  
    // this.addOutput("index", 'number') 
    this.addOutput("value", 0)
    this.addOutput("触发", LiteGraph.EVENT)

    
    // this.addProperty("开始值", 0, 'number');   //增加一个变量，    变量名称， 变量名称
    // this.addWidget("number","开始值", 0, "开始值", {precision: 0});

    // this.addProperty("modal", '无限制', 'enum', {values: ['无限制', '范围限制', '循环', '来回']});   //增加一个变量，    变量名称， 变量名称
    // this.addWidget("combo","模式",this.properties.modal,{ property: "modal", values:['无限制', '范围限制', '循环', '来回'] } );

    // this.addProperty("min", 1,  'number')
    // this.addWidget("number","最小值", 1, "min", {precision: 0});

    // this.addProperty("max", 10,  'number')
    // this.addWidget("number","最大值", 10, "max", {precision: 0});

    // this.addProperty("upStepmodal", '不乘以时间', 'enum', {values: ['乘以时间', '不乘以时间']});   //增加一个变量，    变量名称， 变量名称
    // this.addWidget("combo","步进模式",this.properties.upStepmodal,{ property: "upStepmodal", values:['乘以时间', '不乘以时间'] } );

    // this.addProperty("stepValue", 1,  'number')
    // this.addWidget("number","步进数值", 1, "stepValue", {precision: 0});
    
    // this.updateWidght()
  // //   this.progress = 0.5               //设置节点的进度，一般来说用于在执行的时候设置
    // 
    // this.properties.precision = 1
  }

  onGetOutputs() {
    console.log('我调用了onGetOutputs')
    return [["number", "string"],  ['被引用', 'lgraphNode']];
  };

  onStart(){
    // this.repetDir = 1
    // this.value = this.getInputOrProperty("开始值") | 0
  }

  // updateWidght(){
  //   var value = this.properties.modal
  //   if(value != '无限制'){
  //       this.widgets.map((widget)=>{
  //         if(widget.name == '最大值' || widget.name == '最小值'){
  //             widget.disabled = false
  //         }
  //       })
  //     }else{
  //       this.widgets.map((widget)=>{
  //         if(widget.name == '最大值' || widget.name == '最小值'){
  //             widget.disabled = true
  //         }
  //       })
  //     }
  // }

  // onWidgetChanged(name, value, old_value, widget){
  //   // console.log('onWidgetChanged', node, name, value, old_value)
  //   // this.isWidgetVisible
  //   if(name == '模式'){
  //       this.updateWidght()
  //   }
  // }

  // Function to call when the node is executed
  // onAction(action, param, options) {
    
  // };

  onExecute() {
    var data = this.getInputData(0)
    if(data !== undefined){
      if(data instanceof Array){
        for(var i = 0; i < data.length; i++){
          this.setOutputData(0, i)
          this.setOutputData(1, data[i])
          this.triggerSlot(2)
        }
      }else if(data instanceof Object){
        for(var key in data){
          this.setOutputData(0, key)
          this.setOutputData(1, data[key])
          this.triggerSlot(2)
        }
      }
    }
  }
}

dataObjectRobot.title = '数据结构'
// Register the node type
LiteGraph.registerNodeType("middle/change/dataObject", dataObjectRobot)




class getKeyValueRobot extends LGraphNode {
  // Name to show
  title = "对象取值"
  desc = "和数据结构不同的是，这里取出特定的某个值"

  constructor() {
    super()
    // this.serialize_widgets = true;

    this.addInput("obj", "object");
        // this.addInput("key", 'string')

    // this.addOutput("触发", LiteGraph.EVENT)
    // this.addOutput("value", 0)
    this.addOutput("property", 0);
    this.addProperty("value", 0);
    this.addWidget("text","输入key","", 'value');
    this.widgets_up = true;
    this.size = [140, 30];
    this._value = null;

  }

  getTitle() {
      if (this.flags.collapsed) {
          return "获取." + this.properties.value;
      }
      return this.title;
  };

  onGetOutputs() {
    console.log('我调用了onGetOutputs')
    return [["number", "string"], ['被引用', 'lgraphNode']];
  };

  onExecute() {
    var data = this.getInputData(0);
    if (data != null) {
        this.setOutputData(0, data[this.properties.value]);
    }
  }
}

getKeyValueRobot.title = '对象取值'
// Register the node type
LiteGraph.registerNodeType("middle/change/getKeyValue", getKeyValueRobot)



class getArrayValueRobot extends LGraphNode {
  // Name to show
  title = "数组取值"
  desc = "和数据结构不同的是，这里取出特定的某个值"

  constructor() {
    super()
    // this.serialize_widgets = true;

    this.addInput("array", "array,table,string");
    this.addInput("index", "number");
    this.addOutput("value", "");
		this.addProperty("index",0);
    this.addWidget('number','index',0, 'index', {precision: 0})
  }

  getTitle() {
      if (this.flags.collapsed) {
          return "获取." + this.properties.index;
      }
      return this.title;
      // this.getOutputNodes()
      // this.isInputConnected()
      // this.outputs[0].links
      // this.disconnectInput()
      // this.onGetOutputs()
      // this.addInput()
      // this.removeInput()
  };

  onGetOutputs() {
    console.log('我调用了onGetOutputs')
    return [["number", "string"], ['被引用', 'lgraphNode']];
  };

  onExecute() {
    var array = this.getInputData(0);
    var index = this.getInputData(1);
    if(index == null){
      index = this.properties.index;
    }
    if(array == null || index == null){
      return;
    }
    this.setOutputData(0, array[Math.floor(Number(index))] );
  }
}

getArrayValueRobot.title = '数组取值'
// Register the node type
LiteGraph.registerNodeType("middle/change/getArrayValue", getArrayValueRobot)



class sendData extends LGraphNode {
  // Name to show
  title = "无线传送发射"
  desc = "用于无线连接节点"

  constructor() {
    super()
    // this.serialize_widgets = true;
    // this.size = [140, 30]; 

    this.addInput("附带值", 0);
    this.addInput("发送", LiteGraph.ACTION);
    // this.addOutput("A", -1);
		this.addProperty("customeName",'A','string');
    this.addWidget('string','发送事件', this.properties.customeName, 'customeName')
    // this.widgets_up = true
  }

  getTitle() {
      if (this.flags.collapsed) {
          return "发送事件." + this.properties.customeName;
      }
      return this.title;
  };

  // onGetOutputs() {
  //   console.log('我调用了onGetOutputs')
  //   return [["number", "string"]];
  // };

  onAction(action, param){
    let data = this.getInputData(0)
    this.graph.sendEventToAllNodes(this.properties.customeName, data)
  }
}

sendData.title = '无线传送发射'
// Register the node type
LiteGraph.registerNodeType("middle/tool/sendData", sendData)




class acceptData extends LGraphNode {
  // Name to show
  title = "无线传送接收"
  desc = "用于无线连接节点"

  constructor() {
    super()
    // this.widgets_up = true
    // this.serialize_widgets = true;
    // this.height = 
    this.size = [140, 30]; 
    // this.addInput("输入", -1);
    // this.addInput("index", "number");
    this.addOutput("接收值", 0);
    this.addOutput("接收", LiteGraph.EVENT);
    
		this.addProperty("customeName",'A','string');
    this.addWidget('string','接收事件', this.properties.customeName, 'customeName')
  }

  onStart(){
    this[this.properties.customeName] = this.onEvent
  }

  getTitle() {
      if (this.flags.collapsed) {
          return "接收事件." + this.properties.customeName;
      }
      return this.title;
  };

  // onGetOutputs() {
  //   console.log('我调用了onGetOutputs')
  //   return [["number", "string"]];
  // };

  onEvent(param){
    console.log('我接收到了事件', param)
    this.setOutputData(0, param)
    this.triggerSlot(1, param)
  }

  // onAction(action, param){
  //   console.log('我接收到了事件', action)
  //   this.setOutputData(0, param)
  //   this.triggerSlot(0, param)
  // }
}

acceptData.title = '无线传送接收'
// Register the node type
LiteGraph.registerNodeType("middle/tool/acceptData", acceptData)



class outputLine extends LGraphNode {
  // Name to show
  title = "输出逻辑线"
  desc = "根据输入值，触发不同的输出"

  constructor() {
    super()
    // this.serialize_widgets = true;
    // this.size = [140, 30]; 

    this.addInput("输入值", 'number');
    this.addInput("触发", LiteGraph.ACTION);
    this.addOutput("output_0", LiteGraph.EVENT);
    this.addOutput("output_1", LiteGraph.EVENT);
		// this.addProperty("customeName",'A','string');
    // this.addWidget('string','发送事件', this.properties.customeName, 'customeName')
    // this.widgets_up = true
  }

  

  // getTitle() {
  //     if (this.flags.collapsed) {
  //         return "发送事件." + this.properties.customeName;
  //     }
  //     return this.title;
  // };

  onGetOutputs() {
    // console.log('我调用了onGetOutputs')
    return [
      ["output_" + this.outputs.length, LiteGraph.EVENT],
      ['被引用', 'lgraphNode']
    ];
  };

  onAction(action, param){
    let data = Number(this.getInputData(0))
    // let soltName = 'output_' + data
    // this.graph.sendEventToAllNodes(this.properties.customeName, data)
    console.log('当前outputLine输入的值', data)
    if(this.outputs[data] != null){
      this.triggerSlot(data)
    }
  }
}

outputLine.title = '输出逻辑线'
// Register the node type
LiteGraph.registerNodeType("middle/tool/outputLine", outputLine)




class lightingOut extends LGraphNode {
  // Name to show
  title = "动态取值"
  desc = "动态输出需要的值"

  constructor() {
    super()
    // this.serialize_widgets = true;
    // this.size = [140, 30]; 

    this.addInput("引用节点", 'lgraphNode');
		// this.addProperty("customeName",'A','string');
    // this.addWidget('string','发送事件', this.properties.customeName, 'customeName')
    // this.widgets_up = true
  }

  

  // getTitle() {
  //     if (this.flags.collapsed) {
  //         return "发送事件." + this.properties.customeName;
  //     }
  //     return this.title;
  // };

  onGetOutputs() {
    // console.log('我调用了onGetOutputs')
    let inputNode = this.getInputNode(0)
    if(inputNode == null){
      return []
    }else{
      let alreadyAddDit = {}
      for(var i = 0; i < this.outputs.length; i++){
        let output = this.outputs[i]
        alreadyAddDit[output.name] = 1
      }
      let arr = []
      for(var key in inputNode.properties){
        if(alreadyAddDit[key] == null){
          arr.push([key, 0])
        }
      }
      return arr
    }
  };

  onExecute(){
    let inputNode = this.getInputNode(0)
    for(var i = 0; i < this.outputs.length; i++){
      let output = this.outputs[i]
      this.setOutputData(i, inputNode.properties[output.name])
    }
  }

  // onAction(action, param){
  //   let data = this.getInputData(0)
  //   // this.graph.sendEventToAllNodes(this.properties.customeName, data)
  //   if(this.outputs[data] != null){
  //     this.triggerSlot(data)
  //   }
  // }
}

lightingOut.title = '动态取值'
// Register the node type
LiteGraph.registerNodeType("middle/tool/lightingOut", lightingOut)




class lighting extends LGraphNode {
  // Name to show
  title = "动态赋值"
  desc = "动态设置引用节点的值"

  constructor() {
    super()
    // this.serialize_widgets = true;
    // this.size = [140, 30]; 

    this.addInput("引用节点", 'lgraphNode');
    this.addInput("触发赋值", LiteGraph.ACTION);
		// this.addProperty("customeName",'A','string');
    // this.addWidget('string','发送事件', this.properties.customeName, 'customeName')
    // this.widgets_up = true
  }

  

  // getTitle() {
  //     if (this.flags.collapsed) {
  //         return "发送事件." + this.properties.customeName;
  //     }
  //     return this.title;
  // };

  onGetInputs() {
    // console.log('我调用了onGetOutputs')
    let inputNode = this.getInputNode(0)
    if(inputNode == null){
      return []
    }else{
      let alreadyAddDit = {}
      for(var i = 0; i < this.inputs.length; i++){
        let output = this.inputs[i]
        alreadyAddDit[output.name] = 1
      }
      let arr = []
      for(var key in inputNode.properties){
        if(alreadyAddDit[key] == null){
          arr.push([key, 0])
        }
      }
      return arr
    }
  };

  // onExecute(){
  //   let inputNode = this.getInputNode(0)
  //   for(var i = 0; i < this.outputs.length; i++){
  //     let output = this.outputs[i]
  //     this.setOutputData(i, inputNode.properties[output.name])
  //   }
  // }

  onAction(action, param){
    let inputNode = this.getInputNode(0)
    if(inputNode == null){
      return
    }    
    if(this.inputs.length < 2){
      return
    }
    for(var i = 2; i < this.inputs.length; i++){
      let input = this.inputs[i]
      let value = this.getInputData(i)
      if(inputNode.properties[input.name] != null && value != null){
        inputNode.setProperty(input.name, value)
      }
    }
  }
}

lighting.title = '动态赋值'
// Register the node type
LiteGraph.registerNodeType("middle/tool/lighting", lighting)





class textCode extends LGraphNode {
  // Name to show
  title = "js文本"
  desc = "直接运行代码片段"

  constructor() {
    super()
    this.mode = LiteGraph.ON_TRIGGER
    // this.serialize_widgets = true;
    // this.size = [140, 30]; 

    this.addInput("输入参数", 0);
    // this.addInput("触发赋值", LiteGraph.ACTION);

    this.addOutput('输出结果', 0)

		this.addProperty("codeString",'','string');
    this.addWidget("text",'执行代码片段', this.properties.codeString, 'codeString', {multiline: true})
    // this.widgets_up = true
  }

  // getTitle() {
  //     if (this.flags.collapsed) {
  //         return "发送事件." + this.properties.customeName;
  //     }
  //     return this.title;
  // };

  // onExecute(){
  //   let inputNode = this.getInputNode(0)
  //   for(var i = 0; i < this.outputs.length; i++){
  //     let output = this.outputs[i]
  //     this.setOutputData(i, inputNode.properties[output.name])
  //   }
  // }

  onExecute(){
    var valueA = this.getInputData(0)
    var valueB = 0
    let codeString = this.properties.codeString
    try {
         eval(codeString)
    } catch (error) {
        console.warn('文本代码执行失败', error)            
    }
    this.setOutputData(0, valueB)
  }
}

textCode.title = 'js文本'
// Register the node type
LiteGraph.registerNodeType("middle/tool/textCode", textCode)
