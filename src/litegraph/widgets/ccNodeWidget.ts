import type { LGraphCanvas } from "../LGraphCanvas"
import type { LGraphNode } from "../LGraphNode"
import type { CanvasMouseEvent } from "../types/events"
import type { IccNodeWidget, IWidgetccNodeOptions, IWidget } from "../types/widgets"

import { clamp , Size } from "../litegraph"

import { BaseWidget, type DrawWidgetOptions } from "./BaseWidget"
//这是一个用于控制cocos node位置的组件
export class ccNodeWidget extends BaseWidget implements IccNodeWidget {
  // ISliderWidget properties
  declare type: "ccnode"
  declare value: object
  declare options: IWidgetccNodeOptions
  marker?: number

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

  constructor(widget: IccNodeWidget) {
    super(widget)
    this.type = "ccnode"
    this.value = widget.value
    this.options = widget.options
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
    ctx.fillStyle = this.value.color || '#D8D8D8'
    ctx.strokeStyle = this.options.borderColor || '#D8D8D8'

    var nodeX = this.value.x
    //cocos y坐标向上为正，canvas中向下为正，需要flip
    var nodeY = this.value.y * -1

    // var viewHeightAspect = 
    var mappingX = (width / this.options.viewWidth) * nodeX
    var mappingY = (height / this.options.viewHeight) * nodeY 
    var mappingWidth = (width / this.options.viewWidth) * this.value.width  * this.value.scaleX
    var mappingHeight = (height / this.options.viewHeight) * this.value.height * this.value.scaleY

    // console.log('绘制了方块', this.value, this.options.viewWidth, this.options.viewHeight)
    //画布的原点在中间，需要转换一下
    var offsetX = (width ) * 0.5
    var offsetY = height * 0.5
    
    var objectOffsetX = this.value.anchorX * mappingWidth * -1
    var objectOffsetY = (1 - this.value.anchorY) * mappingHeight * -1

    //真正绘制的地方
    // 转换为弧度

    var radians = this.value.angle * Math.PI / 180 * -1 //角度和cocos中也是相反的 所以* -1
    // console.log('this.value.angle', this.value.angle, radians)
    // // 保存当前状态
    // ctx.save();
    // // 平移到矩形中心点
    ctx.translate(margin + mappingX + offsetX,  y + mappingY + offsetY);
    // // 旋转
    ctx.rotate(radians);
    // ctx.beginPath();
    // console.log('this.options.justDrawBorder', this.options.justDrawBorder)
    if(this.options.justDrawBorder){
      ctx.strokeRect(objectOffsetX,objectOffsetY,mappingWidth, mappingHeight)
    }else{
      ctx.fillRect(objectOffsetX,objectOffsetY,mappingWidth, mappingHeight)
    }


    // 恢复状态
    ctx.restore()

    //绘制中心点
    ctx.fillStyle = '#1568DD'
    ctx.beginPath()
    ctx.arc(margin + mappingX + offsetX , y + mappingY + offsetY, 2, 0, 360)
    ctx.fill()
    // Restore original context attributes
    // ctx.textAlign = originalTextAlign
    // console.log("ctx.globalCompositeOperation222", ctx.globalCompositeOperation)
    // ctx.globalCompositeOperation = 'source-over'
    ctx.strokeStyle = originalStrokeStyle
    ctx.fillStyle = originalFillStyle
  }

  dealTouch(options: {
    e: CanvasMouseEvent
    node: LGraphNode
    canvas: LGraphCanvas
  }){
    if (this.options.read_only) return

    const { e, node } = options
    const width = this.width || node.size[0]
    const x = e.canvasX - node.pos[0]
    const y = e.canvasY - this.y - node.pos[1]

    // Calculate new value based on click position
    const slideFactorX = clamp((x - 15) / (width - 30), 0, 1) //x方向上的占比
    const slideFactorY = clamp((y) / (this.height), 0, 1)     //y方向上的占比

    // console.log('点击了组件', y , this.y, node.pos[1], slideFactorY)

    // const newValue = this.options.min + (this.options.max - this.options.min) * slideFactor

    //由于原点是在中间，这里得到的坐标是左上角的，还要转换一下
    let newX = (slideFactorX - 0.5) * this.options.viewWidth
    //cocos y坐标向上为正，canvas中向下为正，需要flip
    let newY = (slideFactorY - 0.5) * this.options.viewHeight * -1

    // if (newValue !== this.value) {
      // this.setValue(newValue, options)
    // }
    this.value.x = newX
    this.value.y = newY
    //使用自定义的setvalue
    if(node.properties['x'] !== undefined){
      node.setProperty('x', newX)
    }
    if(node.properties['y'] !== undefined){
      node.setProperty('y',  newY)
    }
    if(node.properties[this.options.property] !== undefined){
      node.setProperty(this.options.property, this.value)
    }
    node.onWidgetChanged?.(this.name ?? "", this.value, null, this)
    if (node.graph) node.graph._version++
  }

  /**
   * Handles click events for the slider widget
   */
  override onClick(options: {
    e: CanvasMouseEvent
    node: LGraphNode
    canvas: LGraphCanvas
  }) {
    this.dealTouch(options)
  }

  /**
   * Handles drag events for the slider widget
   */
  override onDrag(options: {
    e: CanvasMouseEvent
    node: LGraphNode
    canvas: LGraphCanvas
  }) {
     this.dealTouch(options)
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
