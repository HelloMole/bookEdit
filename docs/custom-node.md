---
outline: deep
---

# 自定义节点

蓝图功能基于开源项目[litegraph](https://github.com/jagenjo/litegraph.js)开发，如果需要更详细的了解和定制蓝图功能，可前往了解该项目。

下面是一个自定义节点的示例
```js
import {LiteGraph, LGraphNode} from '../../litegraph/litegraph'

class customNode extends LGraphNode {
    name = '数值' //卡片标题

    //在此方法中注册节点属性，输入solt和输出solt
    constructor() {
        //增加一个输入触点，  输入触点的名称， 值类型
        this.addInput("触发", "number")   
        //增加一个输出触点，  输出触点的名称， 值类型
        this.addOutput("输出", "number")
        //增加一个变量
        this.addProperty("value", 1.0);
        //如果需要在卡片中可以修改这个变量，就添加一个控件
        //增加一个控件用于修改变量，类型，显示名称，默认值，要修改的变量的名称
        this.widget = this.addWidget("number","value",1,"value");
        //设置输入组件在顶部
        this.widgets_up = true;                                    
    }

    //当蓝图运行时此方法会调用
    onStart(){

    }

    //当蓝图停止运行时调用
    onStop(){

    }

    //执行时的方法，如果节点设置为每帧运行，就会不停执行此方案
    onExecute() {
      //设置输出触点的值
      this.setOutputData(0, parseFloat(this.properties["value"]))
    }

    // 当addInput的触点收到出发事件时，将会调用此方法，其中action是input的名称
    onAction(action, param){
        
    }

    //动态返回卡片显示的title
    getTitle() {
        if (this.flags.collapsed) {
            return this.properties.value;
        }
        return this.title;
    };

    //自定义触点显示的文字
    onDrawBackground(ctx) {
        //show the current value
        this.outputs[0].label = this.properties["value"].toFixed(3);
    };

    //自定义ctx卡片的绘制
    // onDrawForeground(ctx){
       
    // }
}

//设置中文名称标题
customNode.title = '数值' 
//将自定义节点注册到蓝图，第一个是唯一key，同时也是菜单选项路径
LiteGraph.registerNodeType("input/customNode", customNode) 

```

注册好的节点将会出现在对应的菜单栏中

目前所有预置的节点脚本都放在src/viewCode/nodes文件夹下，并通过RegisterNodeType.js进行引用。当添加新的自定义节点时，请按照上述方式引用。