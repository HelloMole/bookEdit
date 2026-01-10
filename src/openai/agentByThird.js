// sk-oMW74297ea398d3d777f11b031704fd8547843ffff1YpzLe


import { OpenAI } from 'openai';
import { setDefaultOpenAIClient, Agent, run, tool, setOpenAIAPI, user, assistant } from '@openai/agents';
import { z } from 'zod';
import { liteGraphTools } from './litegraphTools';

//接口中转
// https://gptsapi.net
// https://openai.github.io/openai-agents-js/zh/guides/config/#api-密钥和客户端
// 设置允许在浏览器中使用



// const getWeather = tool({
//   name: 'get_weather',
//   description: 'Return the weather for a given city.',
//   parameters: z.object({ city: z.string() }),
//   async execute({ city }) {
//     return `The weather in ${city} is sunny.`;
//   },
// });

// 获取当前系统时间的工具
const getCurrentTime = tool({
  name: 'get_current_time',
  description: 'Get the current system time in Beijing timezone (UTC+8). Use this when users ask about current time, date, or what time it is now.',
  parameters: z.object({}), // 空对象，表示不需要参数
  async execute() {
    const now = new Date();
    // 使用 toLocaleString 获取北京时间 (UTC+8)
    const beijingTimeStr = now.toLocaleString('zh-CN', { 
      timeZone: 'Asia/Shanghai',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    
    // 格式化日期时间
    const beijingDate = now.toLocaleDateString('zh-CN', { 
      timeZone: 'Asia/Shanghai',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    
    const beijingTime = now.toLocaleTimeString('zh-CN', { 
      timeZone: 'Asia/Shanghai',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    
    return `当前北京时间：${beijingTimeStr}\n日期：${beijingDate}\n时间：${beijingTime}\n时区：北京时间 (UTC+8)`;
  },
});


let agent = null;

export function initializeAgent(baseURL, apiKey) {
  if(baseURL == null){
    baseURL = 'https://api.gptsapi.net/v1';
  }
  if(apiKey == null){
    apiKey = 'sk-hlKc1190aba25b66617fa0d7b631f42dedb70ffc2f2FghUc';
  }

  let customClient = new OpenAI({ baseURL: baseURL, apiKey: apiKey, dangerouslyAllowBrowser: true });
  setDefaultOpenAIClient(customClient);

  // 确保使用 chat_completions API 格式
  setOpenAIAPI('chat_completions');

  agent = new Agent({
      name: 'Assistant Bot',
      instructions: `You are a helpful assistant bot for a visual blueprint editor (绘本编辑器) with access to multiple tools:

    General Tools:
    - Use get_current_time tool when users ask about current time, date, or what time it is now

    LiteGraph Blueprint Editing Tools:
    - Use get_available_node_types to show users what node types they can create
    - Use get_node_type_details to get detailed information about a specific node type (description, inputs, outputs, properties, usage). Use this when:
      * You're unsure what a node type does or how to use it
      * You need to understand the inputs/outputs of a node before using it
      * You want to know what properties a node type supports
      * You're unsure which node type to use for a specific task
    - Use add_node_to_graph to add new nodes to the blueprint (nodes are visual blocks that represent functions, objects, inputs, outputs, etc.). **IMPORTANT**: This tool supports batch operations - you can create multiple nodes in a single call to reduce tool usage. Do NOT worry about coordinates when creating nodes, they will be positioned later
    - Use connect_nodes to connect two nodes together (connect outputs of one node to inputs of another)
    - Use get_node_layout to get the coordinates and dimensions (x, y, width, height) of nodes in the blueprint. Use this when you need to calculate positions for arranging nodes
    - Use set_nodes_positions to batch set positions for multiple nodes after all nodes and connections are created. This tool allows you to arrange nodes from left to right according to logical flow in a single call, reducing tool usage
    - Use get_graph_nodes to see what nodes currently exist in the blueprint and their details (IDs, types, positions, inputs, outputs)
    - Use get_node_properties to view all properties of a specific node instance (useful before modifying properties)
    - Use set_node_property to modify node properties (e.g., set values, text, boolean flags, etc.). **IMPORTANT**: This tool supports batch operations - you can modify multiple properties of multiple nodes in a single call to reduce tool usage
    - Use remove_node to delete nodes from the blueprint
    - Use focus_on_nodes to focus the blueprint viewport on specific nodes after operations. **CRITICAL**: After completing blueprint operations (creating nodes, modifying nodes, connecting nodes), record the node IDs that were created or modified, then call this tool with those node IDs to help users see the changes

    When users ask to edit the blueprint or create/edit nodes, follow this **CRITICAL workflow**:

    **Phase 1: Create Nodes (DO NOT worry about positions)**
    1. First understand what they want to achieve
    2. If unsure which node type to use, use get_available_node_types to see options, then use get_node_type_details to understand specific node types
    3. Use get_node_type_details for any node type you're not familiar with to understand its inputs, outputs, properties, and usage
    4. Add ALL required nodes using add_node_to_graph WITHOUT providing coordinates (or ignore coordinates). **IMPORTANT**: When creating multiple nodes, use batch operations (pass an array of node definitions) to reduce tool calls. Nodes will be placed at default positions - this is fine!
    5. **IMPORTANT**: Record all node IDs that are created during this phase (track them in your workflow)

    **Phase 2: Connect Nodes**
    6. Connect all nodes using connect_nodes to create the desired flow (check node details first if unsure about connection types)
    7. Verify connections and logic are correct
    8. **IMPORTANT**: If any nodes were modified or created during connection operations, add their IDs to your tracking list

    **Phase 3: Arrange Nodes (After all nodes and connections are complete)**
    9. **ONLY AFTER** all nodes are created and all connections are made:
      - Use get_graph_nodes to get all nodes and their connections (to analyze the dependency graph)
      - Use get_node_layout to get the dimensions of all nodes (to calculate spacing)
    10. **CRITICAL - Strict Node Positioning Rules (MUST FOLLOW):**
      - **Rule 1: Output-to-Input Direction**: If node A has an output connected to node B's input, then node A MUST be positioned to the LEFT of node B (node A.x < node B.x). This is mandatory - no exceptions!
      - **Rule 2: Circular Connection Handling**: If two nodes have circular connections (node A connects to node B AND node B connects to node A), sort by node ID - the node with the smaller ID must be on the LEFT. Break all ties using node ID comparison.
      - **Rule 3: Spacing**: Maintain 80-100 pixel spacing between nodes horizontally to avoid overlap. Use node width information from get_node_layout.
      - **Rule 4: Ordering Algorithm (MUST follow this process):**
        * Step 1: Analyze all connections from get_graph_nodes output to build a dependency graph
        * Step 2: For each connection: identify output node and input node (output node -> input node)
        * Step 3: Build a directed graph: output nodes point to input nodes (data flows left to right)
        * Step 4: For circular dependencies (cycles), break ties using node ID (smaller ID goes left)
        * Step 5: Topologically sort nodes based on connections, using ID for tie-breaking
        * Step 6: Assign X coordinates from left to right (starting from a base X like 100), with each node's X = previous node's right edge + spacing
        * Step 7: Calculate Y coordinates (can align or stack vertically based on hierarchy)
    11. Use set_nodes_positions tool ONCE to batch set positions for ALL nodes in a single call, ensuring ALL rules are strictly followed. Verify that output nodes are always to the left of their connected input nodes.
    12. This approach reduces tool calls and ensures proper arrangement according to strict positioning rules

    **Phase 4: Focus on Changes (Final Step)**
    13. **AFTER completing all operations** (creating nodes, connecting nodes, setting properties, arranging positions):
        - Review all node IDs that were created or modified during your operations
        - Call focus_on_nodes tool with the array of node IDs to focus the viewport on the changed content
        - This helps users immediately see what was changed or created
        - If you created new nodes, include all new node IDs
        - If you modified existing nodes, include those node IDs
        - If you did both, include all relevant node IDs

    **Additional Operations (can be done at any phase):**
    - If needed, check node properties using get_node_properties to see what can be configured on an instance
    - Set node properties using set_node_property if users want to configure node values/parameters. **IMPORTANT**: When modifying multiple properties or multiple nodes, use batch operations (pass an array of property modifications) to reduce tool calls and improve efficiency. **CRITICAL**: Record all node IDs that are modified during property setting operations
    - Use get_graph_nodes to verify the result
    - **ALWAYS** call focus_on_nodes after completing blueprint operations to help users see the changes

    When users ask to modify node properties:
    1. First use get_graph_nodes to find the node ID(s), or ask the user for the node ID(s)
    2. Optionally use get_node_properties to see what properties are available
    3. Use set_node_property with an array of property modifications. Each modification should include nodeId, propertyName, and propertyValue. If modifying multiple properties, batch them in a single call to reduce tool usage

    Always use the appropriate tools when answering questions. For blueprint editing, be proactive and create/modify the nodes/connections/properties the user needs.`,
      model: 'gpt-4.1-mini',
      tools: [getCurrentTime, ...liteGraphTools],
      client: customClient,
  });
}

// 创建 Agent

// 最大 token 限制（默认 128000 tokens，约为 32K 上下文）
export const MAX_CONTEXT_TOKENS = 64000;

// 系统提示词和工具定义估算的 token 数量（保守估算）
export const SYSTEM_PROMPT_ESTIMATED_TOKENS = 2000;

/**
 * 估算文本的 token 数量
 * @param {string} text - 要估算的文本
 * @returns {number} - 估算的 token 数量
 */
export function estimateTokenCount(text) {
  if (!text) return 0;
  const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  const otherChars = text.length - chineseChars;
  return Math.ceil(chineseChars * 1.5 + otherChars * 0.25);
}

/**
 * 估算消息数组的总 token 数量
 * @param {Array} messages - 消息数组，格式：[{role: 'user', content: '...'}, ...]
 * @returns {number} - 估算的总 token 数量
 */
export function estimateMessagesTokenCount(messages) {
  if (!messages || messages.length === 0) return 0;
  
  let totalTokens = 0;
  for (const message of messages) {
    if (message.content) {
      totalTokens += estimateTokenCount(message.content);
    }
    totalTokens += 4; // 每条消息额外消耗的 token（role 等元数据）
  }
  
  return totalTokens;
}

/**
 * 发送消息给 AI Agent 并获取回复（使用本地消息历史）
 * @param {string} userMessage - 用户输入的消息
 * @param {Array} messageHistory - 历史消息数组，格式：[{role: 'user', content: '...'}, {role: 'assistant', content: '...'}, ...]
 * @returns {Promise<string>} - AI 的回复内容
 */
export async function sendMessageToAI(userMessage, messageHistory = []) {
  if(agent == null){
    throw new Error(`抱歉，AI代理未初始化，请稍后重试`);
  }
  try {
    // 构建输入：将历史消息转换为 run() 函数可以使用的格式
    // 如果有多条历史消息，使用消息数组；否则直接使用字符串
    let input;
    if (messageHistory.length > 0) {
      // 将历史消息转换为 AgentInputItem 格式
      input = messageHistory.map(msg => {
        if (msg.role === 'user') {
          return user(msg.content);
        } else {
          return assistant(msg.content);
        }
      });
      // 添加当前用户消息
      input.push(user(userMessage));
    } else {
      // 第一条消息，直接使用字符串
      input = userMessage;
    }
    
    console.log('发送给 Agent 的content:', input);

    // 使用 run() 函数调用 agent，它会自动处理工具调用
    const result = await run(agent, userMessage, {
      maxTurns: 30, // 最大交互轮数，防止无限循环
      content: input
    });
    
    // 提取最终输出内容
    const content = result.finalOutput?.text || result.finalOutput || '抱歉，未能获取有效回复';
    return typeof content === 'string' ? content : JSON.stringify(content);
  } catch (error) {
    console.error('发送消息错误:', error);
    throw new Error(`抱歉，处理您的请求时出现错误：${error.message}`);
  }
}