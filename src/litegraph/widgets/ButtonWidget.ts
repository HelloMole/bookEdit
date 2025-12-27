import type { LGraphCanvas } from "../LGraphCanvas"
import type { LGraphNode } from "../LGraphNode"
import type { CanvasMouseEvent } from "../types/events"
import type { IButtonWidget, IWidgetOptions } from "../types/widgets"

import { BaseWidget, type DrawWidgetOptions } from "./BaseWidget"

export class ButtonWidget extends BaseWidget implements IButtonWidget {
  // IButtonWidget properties
  declare type: "button"
  declare options: IWidgetOptions<boolean>
  declare clicked: boolean
  declare clickeName: string
  declare value: undefined

  constructor(widget: IButtonWidget) {
    super(widget)
    this.type = "button"
    this.clicked = widget.clicked ?? false
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
    // Store original context attributes
    const originalTextAlign = ctx.textAlign
    const originalStrokeStyle = ctx.strokeStyle
    const originalFillStyle = ctx.fillStyle

    const { height } = this
    let btnWidth = width - margin * 2
    let offsetX = 0
    var drawOneBtn = (name)=>{
      // Draw button background
      ctx.fillStyle = this.background_color
      if (this.clickeName == name) {
        ctx.fillStyle = "#AAA"
        this.clickeName = ''
      }
      ctx.fillRect(margin + offsetX, y, btnWidth, height)

      // Draw button outline if not disabled
      if (show_text && !this.computedDisabled) {
        ctx.strokeStyle = this.outline_color
        ctx.strokeRect(margin + offsetX, y, btnWidth, height)
      }

      // Draw button text
      if (show_text) {
        ctx.textAlign = "center"
        ctx.fillStyle = this.text_color
        ctx.fillText(
          name,
          btnWidth * 0.5 + offsetX + margin,
          y + height * 0.7,
        )
      }
      offsetX += btnWidth + 2
    }

    if(this.options.buttons != null){
      btnWidth = btnWidth / this.options.buttons.length
      btnWidth -= 2  //margin-right
      for(var i = 0; i < this.options.buttons.length; i++){
        drawOneBtn(this.options.buttons[i])
      }
    }else{
       drawOneBtn(this.label || this.name || "")
    }

    

    // Restore original context attributes
    ctx.textAlign = originalTextAlign
    ctx.strokeStyle = originalStrokeStyle
    ctx.fillStyle = originalFillStyle
  }

  override onClick(options: {
    e: CanvasMouseEvent
    node: LGraphNode
    canvas: LGraphCanvas
  }) {
    const { e, node, canvas } = options
    const pos = canvas.graph_mouse

    const x = e.canvasX - node.pos[0]
    const y = e.canvasY - this.y - node.pos[1]
    // console.log('点击的坐标', x, y)
    //判断点击了第几个按钮
    const { height } = this
    const width = this.width || node.size[0]

    let margin = 15
    let btnWidth = width - margin * 2
    if(this.options.buttons != null){
      btnWidth = btnWidth / this.options.buttons.length - 2
      this.clickeName = ''
      for(var i = 0; i < this.options.buttons.length; i++){
        let leftx = btnWidth * i + margin + (i * 2)
        let rightx = btnWidth * (i + 1) + margin + (i * 2)
        // console.log('按钮' + i + '的左右范围', leftx, rightx)
        if(leftx < x && x < rightx){
          // console.log('点击了按钮', i)
          this.clickeName = this.options.buttons[i]
          break
        }
      }
    }else{
      this.clickeName = this.label || this.name || ""
    }

    // Set clicked state and mark canvas as dirty
    this.clicked = true
    canvas.setDirty(true)

    // Call the callback with widget instance and other context
    this.callback?.(this, canvas, node, pos, e)
  }
}
