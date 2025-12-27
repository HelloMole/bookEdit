import type { LGraphCanvas } from "../LGraphCanvas"
import type { LGraphNode } from "../LGraphNode"
import type { CanvasMouseEvent } from "../types/events"
import type { IWidgetccNodeOptions, IWidget, IcurveWidget } from "../types/widgets"

import { clamp , Size } from "../litegraph"

import { BaseWidget, type DrawWidgetOptions } from "./BaseWidget"
import { Bezier } from "@/viewCode/Bezier/bezier"
//这是一个用于控制cocos node位置的组件
export class curveWidget extends BaseWidget implements IcurveWidget {
  // ISliderWidget properties
  declare type: "curve"
  declare value: object
  declare options: IWidgetccNodeOptions
  marker?: number
  selectPoint: number

  get height() {
      return this._height || 100
  }


  computeLayoutSize (node){
    var width = node.width - 30
    var radio = (this.options.viewHeight / this.options.viewWidth)
    // console.log('计算computeSize', this._width)
    // if(this.width == null){
    //   return [0, 100]
    // }
    // return [this._width, radio * this._width]
    // return [width, radio * this._width | 100]
    let height = radio * width
    // let maxHeight = radio * width
    this._height = height
    return {minHeight: height + 4, maxHeight:  height + 4, minWidth: width, maxWidth: width}
  }

  constructor(widget: curveWidget) {
    super(widget)
    this.type = "curve"
    this.value = widget.value
    this.options = widget.options
    this.selectPoint = -1
    // console.log('ccnode 创建了')
    // this.options = widget.options
    // this.marker = widget.marker
  }

  /**
   * Draws the widget
   * @param ctx The canvas context
   * @param options The options for drawing the widget
   */
  override drawWidget(ctx: CanvasRenderingContext2D, {
    y,
    width,
    show_text = true,
    margin = 15,
  }: DrawWidgetOptions) {


    const originalStrokeStyle = ctx.strokeStyle
    const originalFillStyle = ctx.fillStyle
    const originCtxfont = ctx.font 
    const originTextAlign = ctx.textAlign
    const textBaseline = ctx.textBaseline 

    // ctx.lineWidth = 1

    let ccPosArr = []
    for(var i = 0; i < this.value.length; i++){
      ccPosArr.push({x: this.value[i], y: this.value[i+1]})
      i+=1
    }



    let controlPoint = []
    for(var i = 0; i < ccPosArr.length; i++){
        controlPoint.push(ccPosArr[i].x)
        controlPoint.push(ccPosArr[i].y)
    }


    var curve = new Bezier(this.value)
    


    // ctx.strokeStyle = this.background_color
    // console.log('绘制了ccNodeWidget', margin, y, width - margin * 2, height)

    // ctx.strokeRect(margin, y, width - margin * 2, height)
    //绘制背景
    width -= margin * 2
    // this._width = width
    var radio = (this.options.viewHeight / this.options.viewWidth)
    var height = radio * width
    // const { height } = this


    ctx.fillStyle = this.background_color
    ctx.fillRect(margin, y, width , height)
    // ctx.globalCompositeOperation = 'source-atop'
    // console.log("ctx.globalCompositeOperation111", ctx.globalCompositeOperation)

    ctx.strokeStyle = this.outline_color
    ctx.beginPath()
    //只能用rect+stroke才能clip，直接strokeRect裁剪不正确
    // ctx.strokeRect(margin, y, width , height)
    ctx.rect(margin, y, width , height)
    ctx.stroke()
    ctx.save()
    ctx.clip()  //只能绘制在矩形区域

    //开始绘制物体所占位置方块
    // ctx.fillStyle = this.value.color || '#D8D8D8'

    var nodeX = this.value.x || 0
    //cocos y坐标向上为正，canvas中向下为正，需要flip
    var nodeY = this.value.y * -1 || 0

    // var viewHeightAspect = 
    var mappingX = (width / this.options.viewWidth) * nodeX
    var mappingY = (height / this.options.viewHeight) * nodeY 

    
    // var mappingWidth = (width / this.options.viewWidth) * this.value.width  * this.value.scaleX
    // var mappingHeight = (height / this.options.viewHeight) * this.value.height * this.value.scaleY

    // console.log('绘制了方块', this.value, this.options.viewWidth, this.options.viewHeight)
    //画布的原点在中间，需要转换一下
    var offsetX = (width ) * 0.5
    var offsetY = height * 0.5

    var getMappingX = (x)=>{
      return margin + (width / this.options.viewWidth) * x + offsetX
    }

    var getMappingY = (nodeY)=>{
      return y + (height / this.options.viewHeight) * nodeY * -1 + offsetY
    }
    

    // 恢复状态
    ctx.restore()

    //绘制中心点
    ctx.fillStyle = '#1568DD'
    // ctx.beginPath()
    // ctx.arc(getMappingX(nodeX), getMappingY(nodeY), 2, 0, 360)
    // ctx.fill()

    ctx.beginPath()

    //这里绘制曲线
    for(var t=0; t<=1; t+=0.01) {
      var pt = curve.get(t);
      // var nv = curve.normal(t);
      // this.drawLine(pt, { x: pt.x + d*nv.x, y: pt.y + d*nv.y} );
      if(t == 0){
          ctx.moveTo(getMappingX(pt.x) , getMappingY(pt.y) )
      }else{
          ctx.lineTo(getMappingX(pt.x) , getMappingY(pt.y) )
      }
    }
    ctx.stroke()


    ctx.strokeStyle = '#FFFFFF'
    //这里绘制控制点位
    var initControllNode = (i)=>{
      var pos = ccPosArr[i]
      if(i == 0){
        ctx.fillStyle = '#7AFF16'
      }else if(i == ccPosArr.length - 1){
        ctx.fillStyle = '#FF1616'
      }else{
        ctx.fillStyle = '#1568DD'
      }
      ctx.beginPath()
      ctx.arc(getMappingX(pos.x), getMappingY(pos.y), 4, 0, 360)
      ctx.fill()
      if(i != 0 && i != ccPosArr.length - 1 && show_text){
          ctx.fillStyle = '#FFFFFF'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.font = '8px Arial'
          ctx.fillText(i + '', getMappingX(pos.x), getMappingY(pos.y) + 1)
      }
      if(this.selectPoint == i){
        //同时绘制选中效果
        ctx.stroke()
      }
  }

    //生成控制点位
    for(var i = 0; i < ccPosArr.length; i++){
        initControllNode(i)
    }

    // ctx.strokeStyle = '#1684FF'
    // let curT = this.options.t || 0.3
    // var dv = curve.derivative(curT);
    // var pt = curve.get(curT); //0.5时候的点
    // ctx.moveTo(getMappingX(pt.x) , getMappingY(pt.y) )
    // ctx.lineTo(getMappingX(pt.x) + dv.x,  getMappingY(pt.y) + dv.y)
    // ctx.stroke()


    // Restore original context attributes
    // ctx.textAlign = originalTextAlign
    // console.log("ctx.globalCompositeOperation222", ctx.globalCompositeOperation)
    // ctx.globalCompositeOperation = 'source-over'

   
    ctx.textAlign = originTextAlign
    ctx.textBaseline  = textBaseline
    ctx.font = originCtxfont
    ctx.strokeStyle = originalStrokeStyle
    ctx.fillStyle = originalFillStyle
  }

  //移除控制点
  remonveCtrlPoint(node?){
    if(this.value.length == 6){
      console.log('至少要有3个控制点生成曲线！')
      return
    }
    if(this.selectPoint >= 0){
      var i = this.selectPoint * 2
      this.value.splice(i, 2)
      this.selectPoint = -1
      if(node != null){
        node.onWidgetChanged?.(this.name ?? "", this.value, null, this)
      }
    }
  }

  //添加控制点
  addCtrlPoint(node?){
    if(this.selectPoint > 0){
      var i = this.selectPoint * 2
      this.value.splice(this.selectPoint, 0, this.value[i] + 30, this.value[i + 1] + 30)
    }else{
      this.value.push(0)
      this.value.push(0)
    }
    
    if(node != null){
      node.onWidgetChanged?.(this.name ?? "", this.value, null, this)
    }
  }

  dealTouch(options: {
    e: CanvasMouseEvent
    node: LGraphNode
    canvas: LGraphCanvas
  }, isClick){
    if (this.options.read_only) return

    const { e, node } = options
    const width = this.width || node.size[0]
    const x = e.canvasX - node.pos[0]
    const y = e.canvasY - this.y - node.pos[1]

    // Calculate new value based on click position
    // const slideFactorX = clamp((x - 15) / (width - 30), 0, 1) //x方向上的占比
    // const slideFactorY = clamp((y) / (this.height), 0, 1)     //y方向上的占比

    //这些控制点都可以超出界面
    const slideFactorX = (x - 15) / (width - 30) //x方向上的占比
    const slideFactorY = (y) / (this.height)     //y方向上的占比

    // console.log('点击了组件', y , this.y, node.pos[1], slideFactorY)

    // const newValue = this.options.min + (this.options.max - this.options.min) * slideFactor

    //由于原点是在中间，这里得到的坐标是左上角的，还要转换一下
    let newX = (slideFactorX - 0.5) * this.options.viewWidth
    //cocos y坐标向上为正，canvas中向下为正，需要flip
    let newY = (slideFactorY - 0.5) * this.options.viewHeight * -1

    var radio = 4 / (width / this.options.viewWidth)

    // console.log('是否点击在了操控点', radio)
    let ccPosArr = []
    for(var i = 0; i < this.value.length; i++){
      ccPosArr.push({x: this.value[i], y: this.value[i+1], i: i})
      i+=1
    }



    // let controlPoint = []
    var clickIndex = -1
    for(var i = 0; i < ccPosArr.length; i++){
       var delx = ccPosArr[i].x - newX
       var dely = ccPosArr[i].y - newY
       if(Math.sqrt(delx * delx + dely * dely) < radio){
          console.log('点击了第几个点？', i)
          // 修改这个点的坐标
          clickIndex = i
          break
       }
    }

    if(clickIndex != -1 && this.selectPoint != clickIndex){
      this.selectPoint = clickIndex
    }

    if(this.selectPoint >= 0){
      ccPosArr[this.selectPoint].x = newX
      ccPosArr[this.selectPoint].y = newY
      this.value[ccPosArr[this.selectPoint].i] = newX
      this.value[ccPosArr[this.selectPoint].i + 1] = newY
      node.onWidgetChanged?.(this.name ?? "", this.value, null, this)
    }

    // if(clickIndex == -1){
    //   //当前是点击
      
    // }else{
    //   //仅仅更新坐标
    //   if(clickIndex != -1){
    //     this.selectPoint = clickIndex
    //   }
    // }

    if (node.graph) node.graph._version++

    // if (newValue !== this.value) {
      // this.setValue(newValue, options)
    // }
    // this.value.x = newX
    // this.value.y = newY
    //使用自定义的setvalue
    // if(node.properties['x'] !== undefined){
    //   node.setProperty('x', newX)
    // }
    // if(node.properties['y'] !== undefined){
    //   node.setProperty('y',  newY)
    // }
    // if(node.properties[this.options.property] !== undefined){
    //   node.setProperty(this.options.property, this.value)
    // }
   
  }

  /**
   * Handles click events for the slider widget
   */
  override onClick(options: {
    e: CanvasMouseEvent
    node: LGraphNode
    canvas: LGraphCanvas
  }) {
    this.dealTouch(options, true)
  }

  /**
   * Handles drag events for the slider widget
   */
  override onDrag(options: {
    e: CanvasMouseEvent
    node: LGraphNode
    canvas: LGraphCanvas
  }) {
     this.dealTouch(options, false)
    // if (this.options.read_only) return false

    // const { e, node } = options
    // const width = this.width || node.size[0]
    // const x = e.canvasX - node.pos[0]

    // // Calculate new value based on drag position
    // const slideFactor = clamp((x - 15) / (width - 30), 0, 1)
    // const newValue = this.options.min + (this.options.max - this.options.min) * slideFactor

    // if (newValue !== this.value) {
    //   this.setValue(newValue, options)
    // }
  }

  
}
