// LiteGraph 蓝图编辑工具集合
// 用于 AI Agent 调用，实现智能编辑蓝图功能
// 
// 注意：使用这些工具前，确保：
// 1. 在 BookEdit 页面中使用（节点类型已注册）
// 2. 已打开一个蓝图进行编辑
// 3. RegisterNodeType 已被导入（在 BookEdit.vue 中已自动导入）
//
// 重要连线规则：
// 1. 执行模式规则：ON_EVENT 模式的节点需要连接事件类型的输入接口才能正常触发
// 2. 类型匹配：值类型的输出只能连接值类型的输入，事件类型的输出只能连接事件类型的输入
// 3. 禁止自连接：节点的输出不能连接到自身的输入
// 4. 连接限制：一个输出可以连接多个输入，但一个输入只能连接一个输出
//
// 预览窗口和坐标系说明：
// 1. 预览窗口尺寸：宽度 2560，高度 1500
// 2. 坐标系原点：位于预览窗口中心（x: 0, y: 0）
// 3. 坐标系范围：x 轴范围约为 [-1280, 1280]，y 轴范围约为 [-750, 750]
// 4. 核心节点：物体节点（objects/*）和镜头节点（objects/camera）会在预览窗口中自动生成实体
// 5. 所有涉及坐标、位置、尺寸、缩放等属性都基于此窗口尺寸和坐标系
//
// 节点属性设置方式说明：
// 某些节点的属性既可以通过 setProperty 方法直接设置，也可以通过连线接收其他节点输入的值。
// 节点内部通过 getInputOrProperty(name) 方法获取属性值，优先级：连线输入 > 属性值。
// 
// 重要限制 - 只能修改已存在的属性：
// 1. 只能修改节点上已经存在的属性字段，不能创建新的属性
// 2. 使用 get_node_properties 工具可以查看节点有哪些可修改的属性
// 3. 使用 get_node_type_details 工具可以查看节点类型的详细信息，包括所有可配置属性
// 4. 如果尝试修改不存在的属性，操作将失败并返回可用属性列表
//
// 判断规则（重要）：
// 1. 如果用户提供了明确值（具体数字、字符串、布尔值等），使用 set_node_property 工具直接赋值
// 2. 如果用户没有提供明确值，而是要求使用其他节点的输出或动态计算，则分析逻辑判断是否有合理的连线：
//    - 如果有合理的连线方案（如需要从其他节点获取值、需要动态计算等），使用 connect_nodes 工具建立连线
//    - 如果没有合理的连线方案，则忽略该属性设置
// 3. 如果属性名称与节点的某个输入接口名称相同，说明该属性支持通过连线接收值
// 4. 连线会覆盖属性值：当输入接口有连线时，getInputOrProperty 会优先返回连线的值，而不是属性值

import { LiteGraph, createBounds } from '../litegraph/litegraph';
import { z } from 'zod';
import { tool } from '@openai/agents';

/**
 * 获取当前正在编辑的 LGraph 实例
 * @returns {LGraph|null} 当前编辑的蓝图实例，如果没有则返回 null
 */
function getCurrentGraph() {
  // 尝试通过 window 对象获取
  if (typeof window !== 'undefined' && window.getCurrentEditGraph) {
    return window.getCurrentEditGraph();
  }
  
  // 备用方案：直接访问全局 graphDit（如果可用）
  if (typeof window !== 'undefined' && window.graphDit) {
    // 需要知道当前的 tabActiveKey 和 curSelectPolicy
    // 这个信息需要通过 Vue 组件获取，暂时返回 null
    console.warn('无法直接访问 graphDit，需要通过 window.getCurrentEditGraph 方法');
    return null;
  }
  
  console.warn('无法获取当前编辑的蓝图，请确保在 BookEdit 页面中调用');
  return null;
}

/**
 * 刷新画布显示
 */
function refreshCanvas() {
  if (typeof window !== 'undefined' && window.refreshLiteGraphCanvas) {
    window.refreshLiteGraphCanvas();
  }
}

/**
 * 获取当前画布实例
 * @returns {LGraphCanvas|null} 当前画布实例，如果没有则返回 null
 */
function getCurrentCanvas() {
  const graph = getCurrentGraph();
  if (!graph) {
    return null;
  }
  
  // 尝试通过 graph.list_of_graphcanvas 获取画布
  if (graph.list_of_graphcanvas && graph.list_of_graphcanvas.length > 0) {
    return graph.list_of_graphcanvas[0];
  }
  
  // 备用方案：通过 window 对象获取（如果可用）
  if (typeof window !== 'undefined' && window.getLiteGraphCanvas) {
    return window.getLiteGraphCanvas();
  }
  
  console.warn('无法获取当前画布实例');
  return null;
}

/**
 * 工具：获取所有可用的节点类型列表
 */
export const getAvailableNodeTypes = tool({
  name: 'get_available_node_types',
  description: '获取所有可注册的蓝图节点类型列表。当用户询问可以创建哪些节点时使用此工具。返回节点类型和对应的中文名称。',
  parameters: z.object({}),
  async execute() {
    try {
      const nodeTypes = LiteGraph.registered_node_types || {};
      const nodeTypeList = [];
      
      for (const [type, NodeClass] of Object.entries(nodeTypes)) {
        const title = NodeClass.title || NodeClass.name || type;
        nodeTypeList.push({
          type: type,
          title: title,
          category: type.split('/')[0] || 'other'
        });
      }
      
      // 按分类分组
      const grouped = {};
      nodeTypeList.forEach(item => {
        if (!grouped[item.category]) {
          grouped[item.category] = [];
        }
        grouped[item.category].push({
          type: item.type,
          title: item.title
        });
      });
      
      let result = '可用的节点类型列表（按分类）：\n\n';
      for (const [category, nodes] of Object.entries(grouped)) {
        result += `【${category}】\n`;
        nodes.forEach(node => {
          result += `  - ${node.type} (${node.title})\n`;
        });
        result += '\n';
      }
      
      return result || '暂无可用节点类型';
    } catch (error) {
      return `获取节点类型列表失败：${error.message}`;
    }
  },
});

/**
 * 工具：获取节点类型的详细信息
 */
export const getNodeTypeDetails = tool({
  name: 'get_node_type_details',
  description: '获取指定节点类型的详细信息，包括节点功能描述、输入输出接口、可配置属性等。当需要了解某个节点类型的具体功能、使用方法或不确定该使用哪个节点时，使用此工具。',
  parameters: z.object({
    nodeType: z.string().describe('要查询的节点类型，例如："input/value"、"objects/createObject"、"output/sound" 等'),
  }),
  async execute({ nodeType }) {
    try {
      // 检查节点类型是否存在
      const NodeClass = LiteGraph.registered_node_types[nodeType];
      if (!NodeClass) {
        const availableTypes = Object.keys(LiteGraph.registered_node_types).slice(0, 10).join(', ');
        return `错误：节点类型 "${nodeType}" 不存在。可用的节点类型示例：${availableTypes}... 使用 get_available_node_types 工具查看完整列表。`;
      }
      
      // 创建临时节点实例以获取详细信息
      let node = null;
      try {
        node = new NodeClass();
      } catch (error) {
        return `错误：无法创建节点实例 "${nodeType}"。可能该节点类型需要特殊初始化。\n错误信息：${error.message}`;
      }
      
      // 获取基本信息
      const title = node.title || NodeClass.title || nodeType;
      const desc = node.desc || NodeClass.desc || '无描述';
      const category = nodeType.split('/')[0] || 'other';
      
      let result = `节点类型详情：${nodeType}\n\n`;
      result += `【基本信息】\n`;
      result += `  名称：${title}\n`;
      result += `  分类：${category}\n`;
      result += `  描述：${desc}\n\n`;
      
      // 获取输入信息
      const inputs = node.inputs || [];
      if (inputs.length > 0) {
        result += `【输入接口】\n`;
        inputs.forEach((input, index) => {
          let inputName = input.name || `输入${index}`;
          let inputType = input.type || '任意类型';
          if(inputType === LiteGraph.EVENT) {
            inputType = 'EVENT';
          }
          const inputLabel = input.label || '';
          result += `  ${index}. ${inputName} (类型: ${inputType})`;
          if (inputLabel && inputLabel !== inputName) {
            result += ` [标签: ${inputLabel}]`;
          }
          result += '\n';
        });
        result += '\n';
      } else {
        result += `【输入接口】\n  无输入接口\n\n`;
      }
      
      // 获取输出信息
      const outputs = node.outputs || [];
      if (outputs.length > 0) {
        result += `【输出接口】\n`;
        outputs.forEach((output, index) => {
          let outputName = output.name || `输出${index}`;
          let outputType = output.type || '任意类型';
          if(outputType === LiteGraph.EVENT) {
            outputType = 'EVENT';
          }
          const outputLabel = output.label || '';
          result += `  ${index}. ${outputName} (类型: ${outputType})`;
          if (outputLabel && outputLabel !== outputName) {
            result += ` [标签: ${outputLabel}]`;
          }
          result += '\n';
        });
        result += '\n';
      } else {
        result += `【输出接口】\n  无输出接口\n\n`;
      }
      
      // 获取属性信息
      const properties = node.properties || {};
      const propertiesInfo = node.properties_info || [];
      const widgets = node.widgets || [];
      
      // 创建属性名到输入接口的映射（用于检查属性是否支持通过连线接收值）
      const propertyToInputMap = {};
      inputs.forEach(input => {
        const inputName = input.name;
        if (inputName && properties.hasOwnProperty(inputName)) {
          propertyToInputMap[inputName] = {
            index: inputs.indexOf(input),
            type: input.type === LiteGraph.EVENT ? 'EVENT' : (input.type || 'any')
          };
        }
      });
      
      // 创建属性名到 widget 信息的映射（包含名称、类型和可选值等）
      const propertyToWidgetMap = {};
      widgets.forEach(widget => {
        // widget 可能通过 property 字段或 options.property 字段关联属性
        const widgetProperty = widget.property || widget.options?.property;
        if (widgetProperty) {
          propertyToWidgetMap[widgetProperty] = {
            name: widget.name,
            type: widget.type,
            values: widget.options?.values || widget.values
          };
        }
      });
      
      if (Object.keys(properties).length > 0 || propertiesInfo.length > 0) {
        result += `【可配置属性】\n`;
        
        // 优先使用 properties_info，因为它包含更多元数据
        if (propertiesInfo.length > 0) {
          propertiesInfo.forEach(propInfo => {
            const propName = propInfo.name;
            const propValue = properties[propName];
            const propType = propInfo.type || typeof propValue || 'unknown';
            const defaultValue = propValue !== undefined ? propValue : 'undefined';
            
            // 查找是否有对应的 widget 信息
            const widgetInfo = propertyToWidgetMap[propName];
            
            // 检查是否支持通过连线接收值
            const inputInfo = propertyToInputMap[propName];
            
            // 显示属性：如果有 widget 信息，使用 "属性名 (控件名: widget名称)" 格式
            if (widgetInfo && widgetInfo.name) {
              result += `  - ${propName} (控件名: ${widgetInfo.name}) (类型: ${propType})`;
            } else {
              result += `  - ${propName} (类型: ${propType})`;
            }
            
            // 如果属性支持通过连线接收值，添加提示
            if (inputInfo) {
              result += ` [可通过连线接收值：输入接口 "${propName}" (索引 ${inputInfo.index}, 类型 ${inputInfo.type})]`;
            }
            
            if (defaultValue !== undefined && defaultValue !== null) {
              const valueDisplay = typeof defaultValue === 'string' ? `"${defaultValue}"` : String(defaultValue);
              result += ` 默认值: ${valueDisplay}`;
            }
            
            // 如果是 combo 控件，显示可选值
            if (widgetInfo && widgetInfo.type === 'combo' && widgetInfo.values) {
              try {
                let valuesDisplay = '';
                const values = typeof widgetInfo.values === 'function' 
                  ? widgetInfo.values() 
                  : widgetInfo.values;
                
                if (Array.isArray(values)) {
                  // 如果是数组，直接显示数组元素
                  valuesDisplay = values.map(v => {
                    if (typeof v === 'string') return `"${v}"`;
                    return String(v);
                  }).join(', ');
                } else if (typeof values === 'object' && values !== null) {
                  // 如果是对象，显示键值对或键列表
                  const keys = Object.keys(values);
                  if (keys.length > 0 && typeof values[keys[0]] === 'string') {
                    // 键值对格式：显示为 "key: value" 或仅显示值
                    valuesDisplay = Object.entries(values)
                      .map(([key, val]) => `${key}: "${val}"`)
                      .join(', ');
                  } else {
                    // 仅键列表
                    valuesDisplay = keys.map(k => {
                      if (typeof k === 'string') return `"${k}"`;
                      return String(k);
                    }).join(', ');
                  }
                }
                
                if (valuesDisplay) {
                  result += ` [可选值: ${valuesDisplay}]`;
                }
              } catch (error) {
                // 如果获取可选值失败，忽略错误继续
              }
            }
            
            if (propInfo.widget && !widgetInfo) {
              result += ` [控件类型: ${propInfo.widget.type || 'unknown'}]`;
            }
            result += '\n';
          });
        } else {
          // 如果没有 properties_info，使用 properties
          for (const [key, value] of Object.entries(properties)) {
            const valueType = value === null ? 'null' : typeof value;
            const valueDisplay = value === null ? 'null' :
                               value === undefined ? 'undefined' :
                               typeof value === 'string' ? `"${value}"` :
                               String(value);
            
            // 查找是否有对应的 widget 信息
            const widgetInfo = propertyToWidgetMap[key];
            
            // 检查是否支持通过连线接收值
            const inputInfo = propertyToInputMap[key];
            
            if (widgetInfo && widgetInfo.name) {
              result += `  - ${key} (控件名: ${widgetInfo.name}) (类型: ${valueType}) 默认值: ${valueDisplay}`;
            } else {
              result += `  - ${key} (类型: ${valueType}) 默认值: ${valueDisplay}`;
            }
            
            // 如果属性支持通过连线接收值，添加提示
            if (inputInfo) {
              result += ` [可通过连线接收值：输入接口 "${key}" (索引 ${inputInfo.index}, 类型 ${inputInfo.type})]`;
            }
            
            // 如果是 combo 控件，显示可选值
            if (widgetInfo && widgetInfo.type === 'combo' && widgetInfo.values) {
              try {
                let valuesDisplay = '';
                const values = typeof widgetInfo.values === 'function' 
                  ? widgetInfo.values() 
                  : widgetInfo.values;
                
                if (Array.isArray(values)) {
                  // 如果是数组，直接显示数组元素
                  valuesDisplay = values.map(v => {
                    if (typeof v === 'string') return `"${v}"`;
                    return String(v);
                  }).join(', ');
                } else if (typeof values === 'object' && values !== null) {
                  // 如果是对象，显示键值对或键列表
                  const keys = Object.keys(values);
                  if (keys.length > 0 && typeof values[keys[0]] === 'string') {
                    // 键值对格式：显示为 "key: value"
                    valuesDisplay = Object.entries(values)
                      .map(([key, val]) => `${key}: "${val}"`)
                      .join(', ');
                  } else {
                    // 仅键列表
                    valuesDisplay = keys.map(k => {
                      if (typeof k === 'string') return `"${k}"`;
                      return String(k);
                    }).join(', ');
                  }
                }
                
                if (valuesDisplay) {
                  result += ` [可选值: ${valuesDisplay}]`;
                }
              } catch (error) {
                // 如果获取可选值失败，忽略错误继续
              }
            }
            
            result += '\n';
          }
        }
        result += '\n';
      } else {
        result += `【可配置属性】\n  无可配置属性\n\n`;
      }
      
      // agent可以直接设置属性，不需要获取控件信息
      // const widgets = node.widgets || [];
      // if (widgets.length > 0) {
      //   result += `【控件】\n`;
      //   widgets.forEach((widget, index) => {
      //     const widgetType = widget.type || 'unknown';
      //     const widgetName = widget.name || `控件${index}`;
      //     result += `  ${index}. ${widgetName} (类型: ${widgetType})\n`;
      //   });
      //   result += '\n';
      // }
      
      // 获取节点模式信息
      if (node.mode !== undefined) {
        const modeNames = {
          0: 'ALWAYS (在蓝图运行时每帧执行)',
          1: 'ON_EVENT (当接收到事件输入时执行)',
          2: 'NEVER (从不执行)',
          4: 'ON_TRIGGER (通用的事件触发模式，修改为此模式后将自动创建一个事件输入接口)',
        };
        result += `【默认执行模式】\n  ${modeNames[node.mode] || `模式 ${node.mode}`}\n\n`;
      }
      
      // 检查是否是物体节点或镜头节点，添加特殊说明
      const isObjectNode = nodeType.startsWith('objects/');
      const isCameraNode = nodeType === 'objects/camera' || nodeType.includes('/camera');
      if (isObjectNode || isCameraNode) {
        result += `【预览窗口说明】\n`;
        result += `  核心节点：此节点会在预览窗口中自动生成实体，是蓝图编辑器中的核心节点。\n`;
        result += `  预览窗口尺寸：宽度 2560，高度 1500\n`;
        result += `  坐标系原点：位于预览窗口中心（x: 0, y: 0）\n`;
        result += `  坐标范围：x 轴约 [-1280, 1280]，y 轴约 [-750, 750]\n`;
        result += `  属性说明：所有涉及坐标（x, y）、位置、尺寸（width, height）、缩放（scaleX, scaleY）等属性都基于此窗口尺寸和坐标系。\n`;
        result += `     在修改相关属性时可以参考此坐标系：\n`;
        result += `     - 中心位置：(0, 0)\n`;
        result += `     - 左上角约：(-1280, 750)\n`;
        result += `     - 右下角约：(1280, -750)\n\n`;
      }
      
      // 使用建议
      result += `【使用建议】\n`;
      if (desc && desc !== '无描述') {
        result += `  功能说明：${desc}\n`;
      }
      
      if (inputs.length > 0 && outputs.length > 0) {
        result += `  1. 通过输入接口接收数据\n`;
        result += `  2. 处理数据后通过输出接口输出\n`;
      } else if (inputs.length > 0) {
        result += `  这是一个处理节点，通过输入接口接收数据并处理\n`;
      } else if (outputs.length > 0) {
        result += `  这是一个数据源节点，通过输出接口提供数据\n`;
      }
      
      if (Object.keys(properties).length > 0) {
        result += `  3. 可以通过 set_node_property 工具修改节点属性来配置节点行为\n`;
        
        // 检查是否有支持通过连线接收值的属性
        const propertiesWithInputSupport = Object.keys(properties).filter(propName => propertyToInputMap[propName]);
        if (propertiesWithInputSupport.length > 0) {
          result += `\n  📌 属性设置方式说明：\n`;
          result += `     以下属性既可以通过 set_node_property 直接赋值，也可以通过连线接收其他节点的输出值：\n`;
          propertiesWithInputSupport.forEach(propName => {
            const inputInfo = propertyToInputMap[propName];
            result += `     - ${propName}：可通过输入接口 "${propName}" (类型: ${inputInfo.type}) 接收值\n`;
          });
          result += `     \n`;
          result += `     设置规则：\n`;
          result += `     - 如果用户提供了明确值（具体数字、字符串、布尔值等），使用 set_node_property 工具直接赋值\n`;
          result += `     - 如果用户要求使用其他节点的输出或动态计算，使用 connect_nodes 工具建立连线\n`;
          result += `     - 连线会覆盖属性值：当输入接口有连线时，节点会优先使用连线的值\n`;
        }
      }
      
      // 连线规则说明
      result += `\n【连线规则说明】\n`;
      if (node.mode === LiteGraph.ON_EVENT) {
        result += `  重要：此节点的执行模式为 ON_EVENT，必须连接一个事件类型（EVENT）的输出接口到其事件输入接口才能正常触发。\n`;
        // 检查是否有事件输入
        const hasEventInput = inputs.some(inp => inp.type === LiteGraph.EVENT);
        if (hasEventInput) {
          const eventInputs = inputs.filter(inp => inp.type === LiteGraph.EVENT);
          result += `  此节点有 ${eventInputs.length} 个事件输入接口：${eventInputs.map((inp, idx) => inputs.indexOf(inp) + ':' + (inp.name || 'unnamed')).join(', ')}\n`;
        } else {
          result += `  注意：此节点当前没有事件输入接口，可能需要通过其他方式触发。\n`;
        }
      }
      result += `  1. 类型匹配：值类型的输出只能连接值类型的输入，事件类型的输出只能连接事件类型的输入\n`;
      result += `  2. 禁止自连接：节点的输出不能连接到自身的输入\n`;
      result += `  3. 连接限制：一个输出可以连接多个输入，但一个输入只能连接一个输出\n`;
      
      // 清理临时节点
      if (node && node.graph) {
        // 如果节点已被添加到图中，尝试移除（但通常不会）
        try {
          node.graph.remove(node);
        } catch (e) {
          // 忽略清理错误
        }
        node = null
      }
      
      return result;
    } catch (error) {
      return `获取节点类型详情失败：${error.message}\n堆栈：${error.stack}`;
    }
  },
});

/**
 * 工具：添加节点到蓝图（支持批量操作）
 */
export const addNodeToGraph = tool({
  name: 'add_node_to_graph',
  description: `在蓝图中添加一个或多个节点。只需要提供节点类型即可，不需要考虑坐标位置。支持批量创建多个节点，减少工具调用次数。

**批量操作优势：**
- 可以一次传入多个节点进行创建，减少工具调用次数，提高效率
- 适用于需要同时创建多个节点的场景
- 所有节点创建在同一个工具调用中完成

**工作流程说明：**
- **创建阶段**：创建节点时不需要考虑坐标，节点会被自动放置在默认位置
- **连线阶段**：先完成所有节点的创建和连线操作
- **排列阶段**：所有操作完成后，使用 set_nodes_positions 工具一次性批量排列所有节点的位置

**重要提示：**
- 物体节点（objects/*）和镜头节点（objects/camera）是核心节点，会在预览窗口中自动生成实体
- 预览窗口尺寸：宽度 2560，高度 1500，坐标系原点在窗口中心，以中心为原点，x轴向右为正，y轴向上为正
- 这些节点的坐标、位置、尺寸等属性基于预览窗口坐标系，在设置相关属性时请参考坐标系范围（x: [-1280, 1280], y: [-750, 750]），当超出范围时，实体可能不可见，或部分不可见`,
  parameters: z.object({
    nodes: z.array(z.object({
      nodeType: z.string().describe('节点类型，例如："input/value"、"objects/createObject"、"objects/camera"、"output/sound" 等。必须使用已注册的节点类型。'),
      x: z.number().nullable().optional().describe('（可选）节点在蓝图编辑画布上的 X 坐标。**注意**：通常不需要提供，节点会自动放置在默认位置，后续使用 set_nodes_positions 工具统一排列。'),
      y: z.number().nullable().optional().describe('（可选）节点在蓝图编辑画布上的 Y 坐标。**注意**：通常不需要提供，节点会自动放置在默认位置，后续使用 set_nodes_positions 工具统一排列。'),
    })).describe('要创建的节点数组。可以包含一个或多个节点定义，每个节点定义包含节点类型和可选的坐标位置。可以一次性创建多个节点。'),
  }),
  async execute({ nodes }) {
    try {
      const graph = getCurrentGraph();
      if (!graph) {
        return '错误：无法获取当前编辑的蓝图。请确保在 BookEdit 页面中。';
      }
      
      if (!nodes || nodes.length === 0) {
        return '错误：节点数组不能为空';
      }
      
      const results = [];
      const errors = [];
      const createdNodeIds = [];
      
      for (const { nodeType, x, y } of nodes) {
        try {
          // 检查节点类型是否存在
          if (!LiteGraph.registered_node_types[nodeType]) {
            const availableTypes = Object.keys(LiteGraph.registered_node_types).slice(0, 10).join(', ');
            errors.push(`节点类型 "${nodeType}" 不存在。可用类型示例：${availableTypes}...`);
            continue;
          }
          
          // 创建节点
          const node = LiteGraph.createNode(nodeType);
          if (!node) {
            errors.push(`无法创建节点类型 "${nodeType}"`);
            continue;
          }
          
          // 设置位置
          if (x !== undefined && y !== undefined && x !== null && y !== null) {
            node.pos = [x, y];
          } else {
            // 默认位置：画布中心或最后一个节点的右侧
            const existingNodes = graph._nodes || [];
            if (existingNodes.length > 0) {
              // 如果有其他节点，放在最后一个节点的右侧
              const lastNode = existingNodes[existingNodes.length - 1];
              let lastNodeSize = lastNode.size || [140, 60];
              if (!lastNodeSize || lastNodeSize[0] === 0 || lastNodeSize[1] === 0) {
                try {
                  lastNodeSize = lastNode.computeSize();
                } catch (e) {
                  lastNodeSize = [140, 60];
                }
              }
              node.pos = [lastNode.pos[0] + (lastNodeSize[0] || 140) + 100, lastNode.pos[1]];
            } else {
              // 如果没有节点，放在中心位置
              node.pos = [400, 300];
            }
          }
          
          // 添加到蓝图
          graph.add(node);
          
          const nodeTitle = node.title || nodeType;
          const nodeId = node.id;
          createdNodeIds.push(nodeId);
          
          let resultMsg = `${nodeTitle} (类型: ${nodeType}, ID: ${nodeId}, 位置: [${node.pos[0]}, ${node.pos[1]}])`;
          
          // 检查是否是物体节点或镜头节点，添加特殊提示
          const isObjectNode = nodeType.startsWith('objects/');
          const isCameraNode = nodeType === 'objects/camera' || nodeType.includes('/camera');
          if (isObjectNode || isCameraNode) {
            resultMsg += ` [核心节点：会在预览窗口中自动生成实体]`;
          }
          
          results.push(resultMsg);
        } catch (error) {
          errors.push(`创建节点类型 "${nodeType}" 失败: ${error.message}`);
        }
      }
      
      // 刷新画布（如果至少有一个成功创建）
      if (results.length > 0) {
        refreshCanvas();
      }
      
      let result = `成功添加 ${results.length} 个节点：\n\n`;
      results.forEach((msg, index) => {
        result += `${index + 1}. ${msg}\n`;
      });
      
      if (errors.length > 0) {
        result += `\n错误（${errors.length} 个）：\n`;
        errors.forEach((error, index) => {
          result += `${index + 1}. ${error}\n`;
        });
      }
      
      // 如果有核心节点，添加统一提示
      const hasCoreNodes = nodes.some(n => {
        const nodeType = n.nodeType;
        return nodeType.startsWith('objects/') || nodeType === 'objects/camera' || nodeType.includes('/camera');
      });
      
      if (hasCoreNodes && results.length > 0) {
        result += `\n📍 核心节点提示：\n`;
        result += `  - 核心节点会在预览窗口中自动生成实体\n`;
        result += `  - 预览窗口坐标系：宽度 2560，高度 1500，原点在中心 (0, 0)\n`;
        result += `  - 坐标范围：x 轴 [-1280, 1280]（左负右正），y 轴 [-750, 750]（下负上正）\n`;
        result += `  - 使用 set_node_property 工具修改坐标、位置、尺寸、缩放等属性时，请参考上述坐标系\n`;
      }
      
      return result;
    } catch (error) {
      return `添加节点失败：${error.message}`;
    }
  },
});

/**
 * 工具：连接两个节点
 */
export const connectNodes = tool({
  name: 'connect_nodes',
  description: `连接两个蓝图节点。将源节点的输出连接到目标节点的输入。需要提供源节点ID、输出索引、目标节点ID和输入索引。如果不确定索引，可以传入节点ID和插槽名称。

**重要连线规则（必须遵守）：**
1. **执行模式规则**：根据节点的执行模式进行连线。当节点的默认执行模式为 ON_EVENT 时，必须连接一个事件类型（EVENT）的输出接口到该节点的事件类型输入接口，否则节点无法正常触发。使用 get_node_type_details 工具查看节点的执行模式和接口类型。

2. **类型匹配规则**：
   - 值类型（如 number, string, boolean 等）的输出接口只能与值类型的输入接口连接
   - 事件类型（EVENT）的输出接口只能与事件类型（EVENT）的输入接口连接
   - 类型不匹配的连接将被拒绝

3. **自连接禁止**：节点的输出接口不能连接到自身的输入接口，这是无效的连接。

4. **连接数量限制**：
   - 一个输出接口可以连接多个输入接口（一对多）
   - 一个输入接口只能连接一个输出接口（多对一），如果已存在连接，需要先断开旧连接

5. **属性连线规则（重要）**：
   - 某些节点的属性既可以通过 set_node_property 直接赋值，也可以通过连线接收其他节点的输出值
   - 如果属性名称与节点的某个输入接口名称相同，说明该属性支持通过连线接收值
   - **何时使用连线**：
     * 当用户要求使用其他节点的输出值时
     * 当需要动态计算或实时更新属性值时
     * 当用户没有提供明确值，但逻辑上需要从其他节点获取值
   - **连线会覆盖属性值**：当输入接口有连线时，节点通过 getInputOrProperty 方法会优先使用连线的值，而不是属性值
   - 使用 get_node_type_details 工具可以查看哪些属性支持通过连线接收值

在连接前，建议使用 get_node_type_details 工具查看两个节点的接口类型和执行模式，确保连线符合规则。`,
  parameters: z.object({
    sourceNodeId: z.union([z.number(), z.string()]).describe('源节点的ID'),
    outputIndex: z.union([z.number(), z.string()]).nullable().optional().describe('源节点的输出索引（从0开始），或者输出插槽的名称。如果不提供，将使用第一个输出'),
    targetNodeId: z.union([z.number(), z.string()]).describe('目标节点的ID'),
    inputIndex: z.union([z.number(), z.string()]).nullable().optional().describe('目标节点的输入索引（从0开始），或者输入插槽的名称。如果不提供，将使用第一个输入'),
  }),
  async execute({ sourceNodeId, outputIndex, targetNodeId, inputIndex }) {
    try {
      const graph = getCurrentGraph();
      if (!graph) {
        return '错误：无法获取当前编辑的蓝图。请确保在 BookEdit 页面中。';
      }
      
      // 获取源节点和目标节点
      const sourceNode = graph.getNodeById(sourceNodeId);
      const targetNode = graph.getNodeById(targetNodeId);
      
      if (!sourceNode) {
        return `错误：找不到ID为 ${sourceNodeId} 的源节点`;
      }
      
      if (!targetNode) {
        return `错误：找不到ID为 ${targetNodeId} 的目标节点`;
      }
      
      // 解析输出索引
      let actualOutputIndex = 0;
      if (outputIndex !== undefined) {
        if (typeof outputIndex === 'string') {
          // 按名称查找输出插槽
          const outputSlot = sourceNode.outputs.findIndex(output => output.name === outputIndex);
          if (outputSlot === -1) {
            return `错误：源节点没有名为 "${outputIndex}" 的输出插槽。可用输出：${sourceNode.outputs.map((o, i) => `${i}:${o.name}`).join(', ')}`;
          }
          actualOutputIndex = outputSlot;
        } else {
          actualOutputIndex = outputIndex;
        }
      }
      
      // 解析输入索引
      let actualInputIndex = 0;
      if (inputIndex !== undefined) {
        if (typeof inputIndex === 'string') {
          // 按名称查找输入插槽
          const inputSlot = targetNode.inputs.findIndex(input => input.name === inputIndex);
          if (inputSlot === -1) {
            return `错误：目标节点没有名为 "${inputIndex}" 的输入插槽。可用输入：${targetNode.inputs.map((i, idx) => `${idx}:${i.name}`).join(', ')}`;
          }
          actualInputIndex = inputSlot;
        } else {
          actualInputIndex = inputIndex;
        }
      }
      
      // 检查索引有效性
      if (actualOutputIndex < 0 || actualOutputIndex >= sourceNode.outputs.length) {
        return `错误：源节点的输出索引 ${actualOutputIndex} 无效。节点有 ${sourceNode.outputs.length} 个输出。`;
      }
      
      if (actualInputIndex < 0 || actualInputIndex >= targetNode.inputs.length) {
        return `错误：目标节点的输入索引 ${actualInputIndex} 无效。节点有 ${targetNode.inputs.length} 个输入。`;
      }
      
      // 检查规则1：禁止自连接
      if (sourceNodeId === targetNodeId) {
        return `错误：不能将节点的输出连接到自身的输入。节点 ${sourceNodeId} 不能连接到自己。`;
      }
      
      // 检查规则2：类型匹配（值类型只能连值类型，事件类型只能连事件类型）
      const outputSlot = sourceNode.outputs[actualOutputIndex];
      const inputSlot = targetNode.inputs[actualInputIndex];
      const outputType = outputSlot?.type;
      const inputType = inputSlot?.type;
      
      // 判断是否为事件类型
      const isOutputEvent = outputType === LiteGraph.EVENT;
      const isInputEvent = inputType === LiteGraph.EVENT;
      
      // 类型不匹配检查
      if (isOutputEvent !== isInputEvent) {
        const outputTypeName = isOutputEvent ? 'EVENT（事件类型）' : `值类型（${outputType || '未知类型'}）`;
        const inputTypeName = isInputEvent ? 'EVENT（事件类型）' : `值类型（${inputType || '未知类型'}）`;
        return `错误：类型不匹配。输出接口类型为 ${outputTypeName}，但输入接口类型为 ${inputTypeName}。\n规则：值类型的输出只能连接值类型的输入，事件类型的输出只能连接事件类型的输入。`;
      }
      
      // 检查规则3：输入接口是否已连接（一个输入只能连接一个输出）
      const existingLink = targetNode.inputs[actualInputIndex].link;
      if (existingLink !== null && existingLink !== undefined) {
        // 尝试获取已存在的连接信息
        let existingSourceInfo = '另一个节点';
        try {
          const existingLinkObj = graph.links && graph.links[existingLink];
          if (existingLinkObj) {
            const existingSourceNode = graph.getNodeById(existingLinkObj.origin_id);
            if (existingSourceNode) {
              existingSourceInfo = `节点 ${existingLinkObj.origin_id} (${existingSourceNode.title || existingSourceNode.type})`;
            } else {
              existingSourceInfo = `节点 ${existingLinkObj.origin_id}`;
            }
          }
        } catch (e) {
          // 如果获取连接信息失败，使用默认信息
        }
        return `错误：目标节点的输入接口 "${inputSlot?.name || actualInputIndex}" 已经连接到 ${existingSourceInfo}。\n规则：一个输入接口只能连接一个输出接口。如果需要更改连接，请先删除旧连接。`;
      }
      
      // 检查规则4：执行模式提示（如果目标节点是 ON_EVENT 模式，建议连接事件输入）
      if (targetNode.mode === LiteGraph.ON_EVENT && !isInputEvent) {
        // 这是一个警告，不是错误，因为节点可能通过其他方式触发
        // 但我们会继续执行，因为在某些情况下值连接也是有效的
        console.warn(`警告：目标节点 ${targetNodeId} 的执行模式为 ON_EVENT，建议连接事件类型的输入接口以确保正常触发。`);
      }
      
      // 尝试连接
      const link = sourceNode.connect(actualOutputIndex, targetNode, actualInputIndex);
      
      if (!link) {
        // 连接可能因为类型不匹配而失败
        const outputType = sourceNode.outputs[actualOutputIndex]?.type || 'unknown';
        const inputType = targetNode.inputs[actualInputIndex]?.type || 'unknown';
        return `错误：无法连接节点。输出类型 "${outputType}" 与输入类型 "${inputType}" 不兼容。`;
      }
      
      // 刷新画布
      refreshCanvas();
      
      const outputName = sourceNode.outputs[actualOutputIndex]?.name || `输出${actualOutputIndex}`;
      const inputName = targetNode.inputs[actualInputIndex]?.name || `输入${actualInputIndex}`;
      
      return `成功连接节点：${sourceNode.title || sourceNodeId} 的 "${outputName}" -> ${targetNode.title || targetNodeId} 的 "${inputName}"`;
    } catch (error) {
      return `连接节点失败：${error.message}`;
    }
  },
});

/**
 * 工具：自动排列蓝图节点，效果不理想，暂时注释掉
 */
// export const arrangeNodes = tool({
//   name: 'arrange_nodes',
//   description: '自动排列蓝图中的所有节点，使其布局更整齐易读。可以选择排列方向（水平或垂直）和节点间距。',
//   parameters: z.object({
//     margin: z.number().nullable().optional().describe('节点之间的间距（像素），默认值为 100'),
//     layout: z.enum(['horizontal', 'vertical']).nullable().optional().describe('排列方向：horizontal（水平，从左到右）或 vertical（垂直，从上到下），默认值为 horizontal'),
//   }),
//   async execute({ margin, layout }) {
//     try {
//       const graph = getCurrentGraph();
//       if (!graph) {
//         return '错误：无法获取当前编辑的蓝图。请确保在 BookEdit 页面中。';
//       }
      
//       const nodeCount = graph._nodes?.length || 0;
//       if (nodeCount === 0) {
//         return '蓝图中没有节点需要排列。';
//       }
      
//       // 调用 LiteGraph 的 arrange 方法
//       // 排列效果不好，暂时注释掉
//       // const layoutMode = layout === 'vertical' ? LiteGraph.VERTICAL_LAYOUT : LiteGraph.HORIZONTAL_LAYOUT;
//       // graph.arrange(margin || 100, layoutMode);
//       // 刷新画布
//       // refreshCanvas();
      
//       return `成功排列了 ${nodeCount} 个节点。排列方向：${layout || 'horizontal'}，间距：${margin || 100} 像素。`;
//     } catch (error) {
//       return `排列节点失败：${error.message}`;
//     }
//   },
// });

/**
 * 工具：获取蓝图中的节点信息
 */
export const getGraphNodes = tool({
  name: 'get_graph_nodes',
  description: '获取当前蓝图中所有节点的信息，包括节点ID、类型、标题、位置等。用于了解当前蓝图的结构。',
  parameters: z.object({}),
  async execute() {
    try {
      const graph = getCurrentGraph();
      if (!graph) {
        return '错误：无法获取当前编辑的蓝图。请确保在 BookEdit 页面中。';
      }
      
      const nodes = graph._nodes || [];
      if (nodes.length === 0) {
        return '当前蓝图中没有节点。';
      }
      
      let result = `蓝图中共有 ${nodes.length} 个节点：\n\n`;
      
      nodes.forEach((node, index) => {
        result += `${index + 1}. ${node.title || node.type || '未知节点'}\n`;
        result += `   - ID: ${node.id}\n`;
        result += `   - 类型: ${node.type}\n`;
        result += `   - 位置: [${node.pos[0]}, ${node.pos[1]}]\n`;
        if (node.mode !== undefined) {
          const modeNames = {
            0: 'ALWAYS',
            1: 'ON_EVENT',
            2: 'NEVER',
            4: 'ON_TRIGGER',
          };
          const modeName = modeNames[node.mode] || `模式${node.mode}`;
          result += `   - 执行模式: ${modeName}${node.mode === LiteGraph.ON_EVENT ? ' (需要事件触发)' : ''}\n`;
        }
        result += `   - 输入数: ${node.inputs?.length || 0}\n`;
        result += `   - 输出数: ${node.outputs?.length || 0}\n`;
        if (node.inputs && node.inputs.length > 0) {
          result += `   - 输入: ${node.inputs.map((inp, i) => {
            const typeStr = inp.type === LiteGraph.EVENT ? 'EVENT' : (inp.type || 'any');
            return `${i}:${inp.name || 'unnamed'}(${typeStr})`;
          }).join(', ')}\n`;
        }
        if (node.outputs && node.outputs.length > 0) {
          result += `   - 输出: ${node.outputs.map((out, i) => {
            const typeStr = out.type === LiteGraph.EVENT ? 'EVENT' : (out.type || 'any');
            return `${i}:${out.name || 'unnamed'}(${typeStr})`;
          }).join(', ')}\n`;
        }
        result += '\n';
      });
      
      return result;
    } catch (error) {
      return `获取节点信息失败：${error.message}`;
    }
  },
});




/**
 * 工具：删除节点
 */
export const removeNode = tool({
  name: 'remove_node',
  description: '从蓝图中删除指定的节点。需要提供节点的ID。',
  parameters: z.object({
    nodeId: z.union([z.number(), z.string()]).describe('要删除的节点ID'),
  }),
  async execute({ nodeId }) {
    try {
      const graph = getCurrentGraph();
      if (!graph) {
        return '错误：无法获取当前编辑的蓝图。请确保在 BookEdit 页面中。';
      }
      
      const node = graph.getNodeById(nodeId);
      if (!node) {
        return `错误：找不到ID为 ${nodeId} 的节点`;
      }
      
      const nodeTitle = node.title || node.type || nodeId;
      
      // 删除节点
      graph.remove(node);
      
      // 刷新画布
      refreshCanvas();
      
      return `成功删除节点：${nodeTitle} (ID: ${nodeId})`;
    } catch (error) {
      return `删除节点失败：${error.message}`;
    }
  },
});

/**
 * 工具：修改节点属性（支持批量操作）
 */
export const setNodeProperty = tool({
  name: 'set_node_property',
  description: `修改蓝图节点的属性值。可以用来设置节点的各种参数，如数值、文字、布尔值等。支持单个或批量修改多个节点的属性，减少工具调用次数。

**批量操作优势：**
- 可以一次传入多个节点的属性修改，减少工具调用次数，提高效率
- 适用于需要同时修改多个节点或多个属性的场景
- 所有修改在同一个工具调用中完成，确保原子性操作

**重要限制 - 只能修改已存在的属性：**
- ⚠️ 只能修改节点上已经存在的属性字段，不能创建新的属性
- 使用 get_node_properties 工具可以查看节点有哪些可修改的属性
- 使用 get_node_type_details 工具可以查看节点类型的详细信息，包括所有可配置属性
- 如果尝试修改不存在的属性，操作将失败并返回可用属性列表

**重要提示 - 属性设置方式：**
某些节点的属性既可以通过此工具直接赋值，也可以通过 connect_nodes 工具连线接收其他节点的输出值。
节点内部通过 getInputOrProperty(name) 方法获取属性值，优先级：连线输入 > 属性值。

**使用此工具的情况：**
- 当用户提供了明确值（具体数字、字符串、布尔值等）时，使用此工具直接赋值
- 当需要设置固定的属性值时，使用此工具
- 当需要修改多个节点或多个属性时，使用批量操作减少调用次数
- 必须确保要修改的属性在节点上已经存在

**不应使用此工具的情况：**
- 当用户要求使用其他节点的输出或动态计算时，应该使用 connect_nodes 工具建立连线
- 如果属性名称与节点的某个输入接口名称相同，且用户需要动态值，应该连线而不是直接赋值
- 不要尝试修改不存在的属性，应先使用 get_node_properties 或 get_node_type_details 工具查看可用属性

**重要提示 - 坐标系相关属性：**
对于物体节点和镜头节点（objects/*），当修改坐标、位置、尺寸、缩放等相关属性时，请注意：
- 预览窗口尺寸：宽度 2560，高度 1500
- 坐标系原点：位于窗口中心（x: 0, y: 0）
- x 轴范围：约 [-1280, 1280]（左负右正）
- y 轴范围：约 [-750, 750]（下负上正）
- 常见属性包括：x, y, width, height, scaleX, scaleY, anchorX, anchorY, angle 等

例如：
- 中心位置：(0, 0)
- 左上角约：(-1280, 750)
- 右下角约：(1280, -750)`,
  parameters: z.object({
    properties: z.array(z.object({
      nodeId: z.union([z.number(), z.string()]).describe('要修改属性的节点ID'),
      propertyName: z.string().describe('要修改的属性名称，必须是节点上已经存在的属性字段。例如："value"、"text"、"loop"、"autoRun"、"x"、"y"、"width"、"height"、"scaleX"、"scaleY" 等。使用 get_node_properties 工具可以查看节点的所有可用属性。'),
      propertyValue: z.union([
        z.string(),
        z.number(),
        z.boolean(),
        z.null()
      ]).describe('新的属性值。可以是字符串、数字、布尔值或 null。对于坐标相关属性（x, y, width, height 等），请参考预览窗口坐标系（原点在中心，x 范围约 [-1280, 1280]，y 范围约 [-750, 750]）。'),
    })).describe('属性修改数组。可以包含一个或多个属性修改项，每个项包含节点ID、属性名称和新值。可以一次性修改多个节点的多个属性。'),
  }),
  async execute({ properties }) {
    try {
      const graph = getCurrentGraph();
      if (!graph) {
        return '错误：无法获取当前编辑的蓝图。请确保在 BookEdit 页面中。';
      }
      
      if (!properties || properties.length === 0) {
        return '错误：属性修改数组不能为空';
      }
      
      const results = [];
      const errors = [];
      const coordinateProperties = ['x', 'y', 'width', 'height', 'scaleX', 'scaleY', 'anchorX', 'anchorY', 'angle'];
      
      for (const { nodeId, propertyName, propertyValue } of properties) {
        try {
          const node = graph.getNodeById(nodeId);
          if (!node) {
            errors.push(`找不到ID为 ${nodeId} 的节点`);
            continue;
          }
          
          const nodeTitle = node.title || node.type || nodeId;
          
          // 检查属性是否存在（只能修改已存在的属性）
          const nodeProperties = node.properties || {};
          if (!nodeProperties.hasOwnProperty(propertyName)) {
            const availableProperties = Object.keys(nodeProperties);
            let errorMsg = `节点 "${nodeTitle}" (ID: ${nodeId}) 不存在属性 "${propertyName}"`;
            if (availableProperties.length > 0) {
              errorMsg += `。可用属性: ${availableProperties.slice(0, 5).join(', ')}${availableProperties.length > 5 ? '...' : ''}`;
            }
            errors.push(errorMsg);
            continue;
          }
          
          // 获取旧值（用于返回信息）
          const oldValue = nodeProperties[propertyName];
          
          // 设置新属性值
          node.setProperty(propertyName, propertyValue);
          
          const valueDisplay = propertyValue === null ? 'null' : 
                              typeof propertyValue === 'string' ? `"${propertyValue}"` : 
                              String(propertyValue);
          const oldValueDisplay = oldValue === undefined ? 'undefined' :
                                 oldValue === null ? 'null' :
                                 typeof oldValue === 'string' ? `"${oldValue}"` :
                                 String(oldValue);
          
          let resultMsg = `${nodeTitle} (ID: ${nodeId}): ${propertyName} = ${oldValueDisplay} -> ${valueDisplay}`;
          
          // 检查是否是物体节点或镜头节点，以及是否是坐标相关属性
          const nodeType = node.type || '';
          const isObjectNode = nodeType.startsWith('objects/');
          const isCameraNode = nodeType === 'objects/camera' || nodeType.includes('/camera');
          const isCoordinateProperty = coordinateProperties.includes(propertyName.toLowerCase());
          
          // 如果是物体节点或镜头节点的坐标相关属性，添加坐标系提示（仅在单个修改时详细显示）
          if ((isObjectNode || isCameraNode) && isCoordinateProperty && typeof propertyValue === 'number') {
            if (propertyName.toLowerCase() === 'x' || propertyName.toLowerCase() === 'y') {
              const coordInfo = propertyName.toLowerCase() === 'x' 
                ? (propertyValue === 0 ? '窗口中心' : propertyValue < 0 ? `窗口左侧（距中心 ${Math.abs(propertyValue)} 像素）` : `窗口右侧（距中心 ${propertyValue} 像素）`)
                : (propertyValue === 0 ? '窗口中心' : propertyValue < 0 ? `窗口下方（距中心 ${Math.abs(propertyValue)} 像素）` : `窗口上方（距中心 ${propertyValue} 像素）`);
              resultMsg += ` [${coordInfo}]`;
            }
          }
          
          results.push(resultMsg);
        } catch (error) {
          errors.push(`修改节点 ${nodeId} 的属性 "${propertyName}" 失败: ${error.message}`);
        }
      }
      
      // 刷新画布（如果至少有一个成功修改）
      if (results.length > 0) {
        refreshCanvas();
      }
      
      let result = `成功修改 ${results.length} 个属性：\n\n`;
      results.forEach((msg, index) => {
        result += `${index + 1}. ${msg}\n`;
      });
      
      if (errors.length > 0) {
        result += `\n错误（${errors.length} 个）：\n`;
        errors.forEach((error, index) => {
          result += `${index + 1}. ${error}\n`;
        });
      }
      
      // 如果是批量操作且包含坐标属性，添加坐标系参考说明
      // if (results.length > 0) {
      //   const hasCoordinateProps = properties.some(p => 
      //     coordinateProperties.includes(p.propertyName.toLowerCase())
      //   );
      //   if (hasCoordinateProps) {
      //     result += `\n📍 坐标系参考（预览窗口：2560×1500，原点在中心）：\n`;
      //     result += `  - x 轴范围： [-1280, 1280]（左负右正）\n`;
      //     result += `  - y 轴范围： [-750, 750]（下负上正）\n`;
      //   }
      // }
      
      return result;
    } catch (error) {
      return `修改节点属性失败：${error.message}`;
    }
  },
});

/**
 * 工具：获取节点属性信息
 */
export const getNodeProperties = tool({
  name: 'get_node_properties',
  description: `获取指定节点的所有属性信息，包括属性名称和当前值。用于了解节点的可配置属性。

**重要说明：**
- 返回的属性列表是节点上已经存在的、可以通过 set_node_property 工具修改的属性
- 只能修改这些已存在的属性字段，不能创建新的属性
- 在修改节点属性前，建议先使用此工具查看节点有哪些可用属性`,
  parameters: z.object({
    nodeId: z.union([z.number(), z.string()]).describe('要查询属性的节点ID'),
  }),
  async execute({ nodeId }) {
    try {
      const graph = getCurrentGraph();
      if (!graph) {
        return '错误：无法获取当前编辑的蓝图。请确保在 BookEdit 页面中。';
      }
      
      const node = graph.getNodeById(nodeId);
      if (!node) {
        return `错误：找不到ID为 ${nodeId} 的节点`;
      }
      
      const nodeTitle = node.title || node.type || nodeId;
      const properties = node.properties || {};
      
      if (Object.keys(properties).length === 0) {
        return `节点 ${nodeTitle} (ID: ${nodeId}) 没有可配置的属性。`;
      }
      
      let result = `节点 ${nodeTitle} (ID: ${nodeId}) 的属性（共 ${Object.keys(properties).length} 个）：\n\n`;
      result += `⚠️ 注意：只能修改以下已存在的属性字段，不能创建新的属性。\n\n`;
      
      for (const [key, value] of Object.entries(properties)) {
        const valueDisplay = value === null ? 'null' :
                            value === undefined ? 'undefined' :
                            typeof value === 'string' ? `"${value}"` :
                            typeof value === 'object' ? JSON.stringify(value) :
                            String(value);
        const valueType = value === null ? 'null' : typeof value;
        result += `  - ${key}: ${valueDisplay} (类型: ${valueType})\n`;
      }
      
      result += `\n💡 提示：使用 set_node_property 工具可以修改以上属性的值。`;
      
      return result;
    } catch (error) {
      return `获取节点属性失败：${error.message}`;
    }
  },
});

/**
 * 工具：获取节点的布局信息（坐标和尺寸）
 */
export const getNodeLayout = tool({
  name: 'get_node_layout',
  description: `获取节点的布局信息，包括节点在蓝图编辑画布上的坐标位置（x, y）以及节点的宽度和高度（width, height）。用于在排列节点时计算合适的位置，避免节点之间的遮挡。

**使用场景：**
- 在完成所有节点创建和连线后，使用此工具获取所有节点的尺寸信息
- 根据节点的尺寸信息，计算从左到右排列的合适位置，避免节点重叠遮挡
- 配合 set_nodes_positions 工具使用，用于批量排列节点位置

**返回信息说明：**
- pos[0] (x): 节点左上角的 X 坐标
- pos[1] (y): 节点左上角的 Y 坐标
- size[0] (width): 节点的宽度（像素）
- size[1] (height): 节点的高度（像素）
- rightEdge: 节点右边缘的 X 坐标 (x + width)，用于计算下一个节点的合适位置
- bottomEdge: 节点下边缘的 Y 坐标 (y + height)

**工作流程建议：**
1. 完成所有节点创建和连线
2. 使用此工具获取所有节点的尺寸信息
3. 根据逻辑顺序计算每个节点的位置（从左到右，80-100像素间距）
4. 使用 set_nodes_positions 工具一次性批量设置所有节点位置`,
  parameters: z.object({
    nodeId: z.union([z.number(), z.string()]).optional().describe('要查询布局的节点ID。如果不提供，将返回蓝图中所有节点的布局信息'),
  }),
  async execute({ nodeId }) {
    try {
      const graph = getCurrentGraph();
      if (!graph) {
        return '错误：无法获取当前编辑的蓝图。请确保在 BookEdit 页面中。';
      }
      
      const nodes = graph._nodes || [];
      if (nodes.length === 0) {
        return '当前蓝图中没有节点。';
      }
      
      // 如果指定了节点ID，只返回该节点的信息
      if (nodeId !== undefined) {
        const node = graph.getNodeById(nodeId);
        if (!node) {
          return `错误：找不到ID为 ${nodeId} 的节点`;
        }
        
        // 获取节点尺寸（如果节点有 size 属性直接使用，否则计算）
        let nodeSize = node.size;
        if (!nodeSize || nodeSize[0] === 0 || nodeSize[1] === 0) {
          // 如果没有 size，尝试计算
          try {
            nodeSize = node.computeSize();
          } catch (e) {
            // 如果计算失败，使用默认值
            nodeSize = [140, 60]; // LiteGraph 默认节点尺寸
          }
        }
        
        const x = node.pos[0];
        const y = node.pos[1];
        const width = nodeSize[0] || 140;
        const height = nodeSize[1] || 60;
        const rightEdge = x + width;
        const bottomEdge = y + height;
        
        const nodeTitle = node.title || node.type || nodeId;
        
        let result = `节点布局信息：${nodeTitle} (ID: ${nodeId})\n\n`;
        result += `  位置 (pos): [${x}, ${y}]\n`;
        result += `    - X 坐标: ${x}（节点左上角）\n`;
        result += `    - Y 坐标: ${y}（节点左上角）\n`;
        result += `  尺寸 (size): [${width}, ${height}]\n`;
        result += `    - 宽度 (width): ${width} 像素\n`;
        result += `    - 高度 (height): ${height} 像素\n`;
        result += `  边界信息:\n`;
        result += `    - 右边缘 X 坐标: ${rightEdge}（用于计算下一个节点的起始位置）\n`;
        result += `    - 下边缘 Y 坐标: ${bottomEdge}\n`;
        result += `\n💡 提示：在添加新节点时，可以设置 x 坐标大于 ${rightEdge} + 间距（建议间距 50-100 像素）来避免节点重叠。`;
        
        return result;
      }
      
      // 返回所有节点的布局信息
      let result = `蓝图中的所有节点布局信息（共 ${nodes.length} 个节点）：\n\n`;
      result += `💡 提示：这些信息可以帮助您计算新节点的合适位置，避免节点重叠遮挡。\n`;
      result += `建议：按照从左到右的逻辑顺序排列节点，新节点应放在最右侧节点的右边。\n\n`;
      
      // 按 X 坐标从左到右排序
      const sortedNodes = [...nodes].sort((a, b) => a.pos[0] - b.pos[0]);
      
      sortedNodes.forEach((node, index) => {
        const nodeTitle = node.title || node.type || node.id;
        
        // 获取节点尺寸
        let nodeSize = node.size;
        if (!nodeSize || nodeSize[0] === 0 || nodeSize[1] === 0) {
          try {
            nodeSize = node.computeSize();
          } catch (e) {
            nodeSize = [140, 60];
          }
        }
        
        const x = node.pos[0];
        const y = node.pos[1];
        const width = nodeSize[0] || 140;
        const height = nodeSize[1] || 60;
        const rightEdge = x + width;
        
        result += `${index + 1}. ${nodeTitle} (ID: ${node.id})\n`;
        result += `   位置: [${x}, ${y}]\n`;
        result += `   尺寸: [${width}, ${height}]\n`;
        result += `   右边缘: ${rightEdge}\n`;
        result += `\n`;
      });
      
      // 计算建议的下一个节点位置
      if (sortedNodes.length > 0) {
        const rightmostNode = sortedNodes[sortedNodes.length - 1];
        let rightmostSize = rightmostNode.size;
        if (!rightmostSize || rightmostSize[0] === 0 || rightmostSize[1] === 0) {
          try {
            rightmostSize = rightmostNode.computeSize();
          } catch (e) {
            rightmostSize = [140, 60];
          }
        }
        const suggestedX = rightmostNode.pos[0] + (rightmostSize[0] || 140) + 80; // 80像素间距
        const suggestedY = rightmostNode.pos[1];
        
        result += `📌 建议的下一个节点位置：\n`;
        result += `   X 坐标: ${suggestedX}（最右侧节点右边缘 + 80像素间距）\n`;
        result += `   Y 坐标: ${suggestedY}（与最右侧节点对齐）\n`;
        result += `   如果希望垂直排列，可以调整 Y 坐标以避免重叠。\n`;
      }
      
      return result;
    } catch (error) {
      return `获取节点布局信息失败：${error.message}`;
    }
  },
});

/**
 * 工具：批量设置节点位置
 */
export const setNodesPositions = tool({
  name: 'set_nodes_positions',
  description: `批量设置多个节点在蓝图编辑画布上的位置坐标。用于在创建完所有节点和连线后，按照严格的规则统一排列节点位置，避免重叠。

**使用场景：**
- 在完成所有节点的创建和连线操作后，使用此工具一次性排列所有节点的位置
- 必须严格遵守节点排列规则（见下方规则说明）
- 减少工具调用次数，提高效率

**重要提示：**
- 在调用此工具前，必须先分析所有节点的连接关系，确保位置符合严格规则
- 使用 get_graph_nodes 工具可以获取所有节点和连接信息
- 使用 get_node_layout 工具可以获取节点尺寸信息，用于计算间距

**CRITICAL - 严格节点排列规则（必须遵守）：**
- **规则1 - 输出到输入方向**：如果节点 A 的输出连接到节点 B 的输入，则节点 A 必须在节点 B 的左边（节点 A 的 X 坐标 < 节点 B 的 X 坐标）
- **规则2 - 循环连接处理**：如果两个节点相互循环连接（节点 A 连接到节点 B 且节点 B 连接到节点 A），则按照节点 ID 排序 - ID 较小的节点必须在左边
- **规则3 - 间距**：节点之间保持 80-100 像素的水平间距，避免重叠
- **规则4 - 排序算法**：
  * 首先分析所有连接，构建依赖图
  * 对于每个连接：输出节点 -> 输入节点（输出节点在左，输入节点在右）
  * 对于循环依赖，使用节点 ID 打破平局（较小的 ID = 左边）
  * 基于这些规则进行拓扑排序
  * 从左到右依次分配 X 坐标，保持间距
- 可以使用 get_node_layout 工具获取现有节点的尺寸信息，计算合适的位置
- 可以在同一个工具调用中设置多个节点的位置`,
  parameters: z.object({
    positions: z.array(z.object({
      nodeId: z.union([z.number(), z.string()]).describe('要设置位置的节点ID'),
      x: z.number().describe('节点在蓝图编辑画布上的 X 坐标（从左到右排列，建议从左到右递增）'),
      y: z.number().describe('节点在蓝图编辑画布上的 Y 坐标（可以对齐或根据逻辑层次调整）'),
    })).describe('节点位置数组，包含要设置位置的节点ID和对应的坐标。可以一次性设置多个节点的位置。'),
  }),
  async execute({ positions }) {
    try {
      const graph = getCurrentGraph();
      if (!graph) {
        return '错误：无法获取当前编辑的蓝图。请确保在 BookEdit 页面中。';
      }
      
      if (!positions || positions.length === 0) {
        return '错误：位置数组不能为空';
      }
      
      const results = [];
      const errors = [];
      
      for (const { nodeId, x, y } of positions) {
        try {
          const node = graph.getNodeById(nodeId);
          if (!node) {
            errors.push(`找不到ID为 ${nodeId} 的节点`);
            continue;
          }
          
          const oldPos = [...node.pos];
          node.pos = [x, y];
          
          const nodeTitle = node.title || node.type || nodeId;
          results.push(`${nodeTitle} (ID: ${nodeId}): [${oldPos[0]}, ${oldPos[1]}] -> [${x}, ${y}]`);
        } catch (error) {
          errors.push(`设置节点 ${nodeId} 位置失败: ${error.message}`);
        }
      }
      
      // 刷新画布
      if (results.length > 0) {
        refreshCanvas();
      }
      
      let result = `成功设置 ${results.length} 个节点的位置：\n\n`;
      results.forEach((msg, index) => {
        result += `${index + 1}. ${msg}\n`;
      });
      
      if (errors.length > 0) {
        result += `\n错误（${errors.length} 个）：\n`;
        errors.forEach((error, index) => {
          result += `${index + 1}. ${error}\n`;
        });
      }
      
      return result;
    } catch (error) {
      return `批量设置节点位置失败：${error.message}`;
    }
  },
});

/**
 * 工具：聚焦到指定节点区域
 */
export const focusOnNodes = tool({
  name: 'focus_on_nodes',
  description: `将蓝图编辑窗口聚焦到指定节点的区域，让用户能够看到修改后的蓝图内容。当完成节点创建、修改或连线操作后，使用此工具来聚焦显示相关节点。

**使用场景：**
- 在执行蓝图相关操作（创建节点、修改节点、连线等）后，记录相关节点的ID
- 当所有操作完成后，调用此工具聚焦到这些节点，让用户能够看到修改后的内容
- 可以传入一个或多个节点ID，工具会自动计算这些节点的边界区域并聚焦显示

**工作流程：**
1. 在执行蓝图操作时，记录被创建或修改的节点ID
2. 在所有操作完成后，调用此工具并传入这些节点ID
3. 蓝图窗口会自动动画聚焦到这些节点所在的区域`,
  parameters: z.object({
    nodeIds: z.array(z.union([z.number(), z.string()])).describe('要聚焦的节点ID数组。可以传入一个或多个节点ID，蓝图窗口会聚焦到这些节点所在的区域。'),
  }),
  async execute({ nodeIds }) {
    try {
      const graph = getCurrentGraph();
      if (!graph) {
        return '错误：无法获取当前编辑的蓝图。请确保在 BookEdit 页面中。';
      }
      
      if (!nodeIds || nodeIds.length === 0) {
        return '错误：节点ID数组不能为空';
      }
      
      // 获取所有节点
      const nodes = [];
      const errors = [];
      
      for (const nodeId of nodeIds) {
        const node = graph.getNodeById(nodeId);
        if (!node) {
          errors.push(`找不到ID为 ${nodeId} 的节点`);
          continue;
        }
        nodes.push(node);
      }
      
      if (nodes.length === 0) {
        return `错误：没有找到任何有效的节点。${errors.length > 0 ? `错误信息：${errors.join('; ')}` : ''}`;
      }
      
      // 使用 createBounds 创建边界区域
      // createBounds 需要节点有 boundingRect 属性
      const bounds = createBounds(nodes);
      
      if (!bounds) {
        return '错误：无法计算节点的边界区域';
      }
      
      // 获取画布实例并调用 animateToBounds
      const canvas = getCurrentCanvas();
      if (!canvas) {
        // 备用方案：尝试通过 graph.list_of_graphcanvas 获取
        const canvasList = graph.list_of_graphcanvas || [];
        if (canvasList.length === 0) {
          return '错误：无法获取画布实例，无法执行聚焦操作';
        }
        canvasList[0].animateToBounds(bounds, { zoom: 0.75 });
      } else {
        canvas.animateToBounds(bounds, { zoom: 0.75 });
      }
      
      const nodeTitles = nodes.map(n => n.title || n.type || n.id).join(', ');
      let result = `成功聚焦到节点区域：${nodeTitles}（共 ${nodes.length} 个节点）`;
      
      if (errors.length > 0) {
        result += `\n\n注意：${errors.length} 个节点ID无效：${errors.join(', ')}`;
      }
      
      return result;
    } catch (error) {
      return `聚焦节点失败：${error.message}`;
    }
  },
});

/**
 * 导出所有工具
 */
export const liteGraphTools = [
  getAvailableNodeTypes,
  getNodeTypeDetails,
  addNodeToGraph,
  connectNodes,
  // arrangeNodes,
  getGraphNodes,
  removeNode,
  setNodeProperty,
  getNodeProperties,
  getNodeLayout,
  setNodesPositions,
  focusOnNodes,
];

