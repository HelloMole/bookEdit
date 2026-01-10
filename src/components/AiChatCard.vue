<!-- AI聊天卡片组件 -->
<template>
  <div v-if="open" class="ai-chat-card-wrapper">
    <a-card class="ai-chat-card" title="AI助手" :hoverable="true" :bordered="true">
      <!-- <template #title>
        <div class="ai-chat-header">
          <span class="ai-chat-title">AI助手</span>
        </div>
      </template> -->
      <template #extra>
        <a-space>
          
          <a-tooltip placement="bottom">
            <template #title>新建对话</template>
            <a-button type="text" size="small" @click="handleNewConversation">
              <template #icon><PlusOutlined /></template>
            </a-button>
          </a-tooltip>

          <a-popover
            v-model:open="historyPopoverVisible"
            trigger="click"
            placement="bottomRight"
            :overlay-style="{ width: '300px', maxHeight: '400px' }"
          >
            <template #content>
              <div class="ai-chat-history-list">
                <div v-if="conversationHistory.length === 0" class="ai-chat-history-empty">
                  暂无历史对话
                </div>
                <div
                  v-for="conversation in conversationHistory"
                  :key="conversation.id"
                  :class="'ai-chat-history-item ' + (currentConversationId === conversation.id ? 'enableDarkActiveBg' : '')"
                >
                  <div class="ai-chat-history-title"  size="middle" type="text" @click="loadConversation(conversation.id)">{{ conversation.title }}</div>
                  <a-button
                    type="link"
                    size="small"
                    danger
                    class="ai-chat-history-delete"
                    @click.stop="deleteConversation(conversation.id)"
                  >
                    <template #icon><DeleteOutlined /></template>
                  </a-button>
                </div>
              </div>
            </template>
            <template #title>
              <span>历史对话</span>
            </template>

            <a-button type="text" size="small">
                <template #icon><HistoryOutlined /></template>
            </a-button>
          </a-popover>

          <a-tooltip placement="bottom">
            <template #title>收起</template>
            <a-button type="text" shape="circle" @click="handleClose">
              <template #icon><CloseOutlined /></template>
            </a-button>
          </a-tooltip>
          
        </a-space>
      </template>
      <div class="ai-chat-body">
        <div class="ai-chat-content">
          <div v-if="messages.length === 0" class="ai-chat-empty">
            <a-flex vertical justify="center" align="flex-start" direction="column" gap="8">
              <RobotOutlined style="font-size: xx-large;"/>
              <div class="empty-text">开始与AI助手对话吧~</div>
            </a-flex>
          </div>
          <div v-else class="ai-chat-messages">
            <div
              v-for="(message, index) in messages"
              :key="index"
              :class="['ai-chat-message', message.type === 'user' ? 'ai-chat-message-user' : 'ai-chat-message-ai']"
            >
              <div class="ai-chat-message-content">
                <div v-if="message.type === 'user'" class="ai-chat-message-text">
                  <template v-for="(part, partIndex) in parseMessageContent(message.content)" :key="partIndex">
                    <template v-if="part.type === 'text'">{{ part.content }}</template>
                    <a-popover v-else-if="part.type === 'tag'" trigger="hover" placement="top">
                      <template #content>
                        <div>节点类型: {{ part.nodeType }}</div>
                      </template>
                      <template #title>
                        <span>节点信息</span>
                      </template>
                      <a-tag :closable="false" color="green" style="margin: 0 2px; cursor: pointer;">
                        节点:{{ part.id }}
                      </a-tag>
                    </a-popover>
                  </template>
                </div>
                <div v-else class="ai-chat-message-text">
                  <template v-for="(part, partIndex) in parseMessageContent(message.content)" :key="partIndex">
                    <template v-if="part.type === 'text'">{{ part.content }}</template>
                    <a-popover v-else-if="part.type === 'tag'" trigger="hover" placement="top">
                      <template #content>
                        <div>节点类型: {{ part.nodeType }}</div>
                      </template>
                      <template #title>
                        <span>节点信息</span>
                      </template>
                      <a-tag :closable="false" color="green" style="margin: 0 2px; cursor: pointer;">
                        节点{{ part.id }}
                      </a-tag>
                    </a-popover>
                  </template>
                </div>
                <div v-if="message.loading" class="ai-chat-message-loading">
                  <a-spin size="small" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="ai-chat-footer">
          <div class="ai-chat-input-container enableDarkBorder" >
            <div class="ai-chat-input-wrapper">
              <div
                ref="editableInputRef"
                contenteditable="true"
                class="ai-chat-editable-input"
                :class="{ 'ai-chat-input-disabled': isLoading || isTokenLimitReached() }"
                :placeholder="isTokenLimitReached() ? '已达到最大 Token 限制，请新建对话' : '请输入你的设计需求'"
                :disabled="isLoading || isTokenLimitReached()"
                @input="handleInput"
                @keydown.enter.exact.prevent="handleSend"
                @keydown.delete="handleDelete"
                @paste="handlePaste"
              ></div>
            </div>
            <!-- Popover for tag hover (using teleport) -->
            <teleport to="body">
              <div
                v-if="tagPopoverVisible"
                class="ai-chat-tag-popover"
                :style="tagPopoverStyle"
              >
                <div class="ai-chat-tag-popover-title">节点信息</div>
                <div class="ai-chat-tag-popover-content">节点类型: {{ currentHoverTagType }}</div>
              </div>
            </teleport>
            <div class="ai-chat-toolbar">
              <a-progress 
                    type="circle" 
                    :percent="getTokenUsagePercent()" 
                    :size="18"
                    :showInfo="true"
                    :format="(percent) => `Token 使用量: ${currentTokenCount} / ${maxContextTokens} (${percent}%)`"
                    :stroke-color="getTokenUsagePercent() >= 100 ? '#ff4d4f' : (getTokenUsagePercent() >= 90 ? '#faad14' : '#1890ff')"
                  />
              <a-button type="text" shape="circle" class="ai-chat-tool-btn">
                <template #icon><PaperClipOutlined /></template>
              </a-button>
              <!-- <a-button type="text" shape="circle" class="ai-chat-tool-btn">
                <template #icon><BulbOutlined /></template>
              </a-button>
              <a-button type="text" shape="circle" class="ai-chat-tool-btn">
                <template #icon><ThunderboltOutlined /></template>
              </a-button> -->
              <a-button type="text" shape="circle" class="ai-chat-tool-btn">
                <template #icon><GlobalOutlined /></template>
              </a-button>
              <!-- Token 使用量进度圆圈 -->
              <!-- <div v-if="messages.length > 0" class="ai-chat-token-progress">
                 
              </div> -->
              
              <a-button
                type="primary"
                shape="circle"
                class="ai-chat-send-btn"
                :loading="isLoading"
                :disabled="isLoading || isTokenLimitReached() || ((!getTextContent() || !getTextContent().trim()) && inputContent.filter(item => item.type === 'tag').length === 0)"
                @click="handleSend"
              >
              <template #icon><ArrowUpOutlined /></template>
              </a-button>
            </div>
          </div>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script>
import { CloseOutlined, SendOutlined, ArrowUpOutlined, PaperClipOutlined, RobotOutlined, BulbOutlined, ThunderboltOutlined, GlobalOutlined, BoxPlotOutlined, PlusOutlined, HistoryOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { sendMessageToAI, estimateMessagesTokenCount, estimateTokenCount, MAX_CONTEXT_TOKENS, SYSTEM_PROMPT_ESTIMATED_TOKENS } from '@/openai/agentByThird.js';
import { get, set, del } from 'idb-keyval';
import { h, createApp } from 'vue';
import { Tag } from 'ant-design-vue';

export default {
  name: 'AiChatCard',
  components: {
    CloseOutlined,
    SendOutlined,
    PaperClipOutlined,
    RobotOutlined,
    BulbOutlined,
    ThunderboltOutlined,
    GlobalOutlined,
    BoxPlotOutlined,
    PlusOutlined,
    HistoryOutlined,
    DeleteOutlined
  },
  props: {
    open: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  data() {
    return {
      inputValue: '',
      messages: [],
      isLoading: false,
      conversationHistory: [], // 历史对话列表（只包含id和title）
      currentConversationId: null, // 当前对话ID（本地标识）
      historyPopoverVisible: false, // 历史对话弹窗显示状态
      isNewConversation: true, // 是否为新建对话，用于判断是否需要保存标题
      conversationHistoryListKey: 'ai-chat-conversation-history-list', // 对话列表的key
      inputContent: [], // 存储输入内容，格式: [{type: 'text', content: 'xxx'}, {type: 'tag', id: 'xxx', type: 'xxx'}]
      editableInputRef: null,
      tagPopoverVisible: false,
      currentHoverTagType: '',
      tagPopoverStyle: {},
      hoveredTagElement: null,
      currentTokenCount: 0, // 当前对话的 token 数量
      maxContextTokens: MAX_CONTEXT_TOKENS, // 最大上下文 token 限制
    };
  },
  mounted() {
    // 组件挂载时加载历史对话列表
    this.loadConversationHistory();
    // 初始化输入更新定时器
    this.inputUpdateTimer = null;
  },
  beforeUnmount() {
    // 清理定时器
    if (this.inputUpdateTimer) {
      clearTimeout(this.inputUpdateTimer);
    }
  },
  watch: {
    open(newVal) {
      if (newVal) {
        // 当卡片打开时，滚动到底部
        this.$nextTick(() => {
          this.scrollToBottom();
          // 更新 token 计数
          this.updateTokenCount();
        });
      }
    }
  },
  methods: {
    // 解析消息内容，将 tag 标记转换为可渲染的对象
    parseMessageContent(content) {
      if (!content) return [];
      
      const parts = [];
      // 正则表达式匹配 [节点ID: xxx, 类型: xxx] 格式
      const tagRegex = /\[节点ID:\s*([^,]+),\s*类型:\s*([^\]]+)\]/g;
      
      let lastIndex = 0;
      let match;
      
      while ((match = tagRegex.exec(content)) !== null) {
        // 添加 tag 之前的文本
        if (match.index > lastIndex) {
          const textContent = content.substring(lastIndex, match.index);
          if (textContent) {
            parts.push({
              type: 'text',
              content: textContent
            });
          }
        }
        
        // 添加 tag
        parts.push({
          type: 'tag',
          id: match[1].trim(),
          nodeType: match[2].trim()
        });
        
        lastIndex = tagRegex.lastIndex;
      }
      
      // 添加最后剩余的文本
      if (lastIndex < content.length) {
        const textContent = content.substring(lastIndex);
        if (textContent) {
          parts.push({
            type: 'text',
            content: textContent
          });
        }
      }
      
      // 如果没有匹配到任何 tag，返回原始文本
      if (parts.length === 0) {
        parts.push({
          type: 'text',
          content: content
        });
      }
      
      return parts;
    },
    
    handleClose() {
      this.$emit('close');
    },
    async handleSend() {
      // 先更新内容数组，确保数据是最新的
      this.updateContentFromDOM();
      
      // 检查是否有内容可发送
      const hasContent = this.inputContent.some(item => {
        if (item.type === 'text') {
          return item.content && item.content.trim();
        }
        return item.type === 'tag';
      });
      
      if (!hasContent || this.isLoading) {
        return;
      }
      
      // 按照内容在输入框中的顺序构建消息，保持 tag 的原始位置
      let userMessage = '';
      console.log('inputContent', this.inputContent);
      this.inputContent.forEach(item => {
        if (item.type === 'text') {
          userMessage += item.content;
        } else if (item.type === 'tag') {
          // 将 tag 转换为文本标记，保持在同一位置
          userMessage += `[节点ID: ${item.id}, 类型: ${item.nodeType}]`;
        }
      });
      
      userMessage = userMessage.trim();
      
      // 清空输入框
      this.clearInput();
      
      // 如果是新建对话且这是第一条消息，创建新对话并生成标题
      if (this.isNewConversation && this.messages.length === 0) {
        const conversationId = Date.now().toString();
        this.currentConversationId = conversationId;
        this.isNewConversation = false;
        
        // 生成标题（取前10个字符）
        const title = userMessage.length > 10 ? userMessage.substring(0, 10) + '...' : userMessage;
        
        // 创建对话列表项（只包含id和title）
        const conversationListItem = {
          id: conversationId,
          title: title,
          createdAt: new Date().toISOString()
        };
        
        // 添加到历史列表并立即保存列表
        this.conversationHistory.unshift(conversationListItem);
        await this.saveConversationHistory();
        
        // 保存对话内容到单独的key
        const contentKey = this.getConversationContentKey(conversationId);
        const conversationContent = {
          id: conversationId,
          messages: [],
          createdAt: new Date().toISOString()
        };
        await set(contentKey, JSON.stringify(conversationContent));
      }
      
      // 检查 token 使用量（在添加消息之前检查，包含新消息）
      const messageHistory = this.messages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));
      const newMessageTokens = estimateTokenCount(userMessage);
      const historyTokens = estimateMessagesTokenCount(messageHistory);
      const estimatedTokens = SYSTEM_PROMPT_ESTIMATED_TOKENS + historyTokens + newMessageTokens;
      
      // 如果超过限制，提示用户（不添加消息）
      if (estimatedTokens > this.maxContextTokens) {
        // 添加用户消息用于显示错误提示
        const userMsg = {
          type: 'user',
          content: userMessage
        };
        this.messages.push(userMsg);
        
        // 添加错误提示消息
        this.messages.push({
          type: 'ai',
          content: '抱歉，当前对话已达到最大 token 限制，无法继续对话。请新建对话或删除部分历史消息。',
          loading: false
        });
        
        if (this.currentConversationId) {
          await this.saveCurrentConversation();
        }
        this.updateTokenCount();
        return;
      }
      
      // 添加用户消息
      const userMsg = {
        type: 'user',
        content: userMessage
      };
      this.messages.push(userMsg);
      
      // 保存当前对话（更新消息内容）
      if (this.currentConversationId) {
        await this.saveCurrentConversation();
      }
      
      // 添加AI回复占位（加载中）
      const aiMessageIndex = this.messages.length;
      this.messages.push({
        type: 'ai',
        content: '',
        loading: true
      });
      
      this.isLoading = true;
      
      try {
        // 将本地消息历史转换为 API 格式（包含新添加的用户消息）
        const messageHistoryForAPI = this.messages.slice(0, -1).map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        }));
        
        // 调用AI接口获取回复（使用本地消息历史）
        const content = await sendMessageToAI(userMessage, messageHistoryForAPI);
        
        // 更新AI消息
        const aiMsg = {
          type: 'ai',
          content: content,
          loading: false
        };
        this.messages[aiMessageIndex] = aiMsg;
        
        // 更新 token 使用量
        this.updateTokenCount();
        
        // 如果有当前对话，保存AI回复
        if (this.currentConversationId) {
          await this.saveCurrentConversation();
        }
      } catch (error) {
        console.error('AI回复错误:', error);
        // 更新为错误消息
        const errorMsg = {
          type: 'ai',
          content: `抱歉，处理您的请求时出现错误：${error.message || '未知错误'}`,
          loading: false
        };
        this.messages[aiMessageIndex] = errorMsg;
        
        // 如果有当前对话，保存错误消息
        if (this.currentConversationId) {
          await this.saveCurrentConversation();
        }
      } finally {
        this.isLoading = false;
      }
      
      // 触发发送事件，将消息内容传递给父组件（如果需要）
      this.$emit('send', userMessage);
    },
    scrollToBottom() {
      const contentEl = this.$el.querySelector('.ai-chat-content');
      if (contentEl) {
        contentEl.scrollTop = contentEl.scrollHeight;
      }
    },
    
    // 新建对话
    handleNewConversation() {
      this.messages = [];
      this.clearInput();
      this.currentConversationId = null;
      this.isNewConversation = true;
      this.historyPopoverVisible = false;
      this.updateTokenCount(); // 重置 token 计数
    },
    
    // 获取对话内容的key
    getConversationContentKey(conversationId) {
      return `ai-chat-conversation-${conversationId}`;
    },
    
    // 加载历史对话列表（只加载列表，不加载内容）
    async loadConversationHistory() {
      try {
        // 先从本地 IndexedDB 加载
        const historyStr = await get(this.conversationHistoryListKey);
        if (historyStr) {
          const history = JSON.parse(historyStr);
          if (history && Array.isArray(history)) {
            // 按创建时间倒序排列
            this.conversationHistory = history.sort((a, b) => {
              return new Date(b.createdAt) - new Date(a.createdAt);
            });
          }
        }
        
      } catch (error) {
        console.error('加载历史对话列表失败:', error);
      }
    },
    
    // 保存历史对话列表（只保存列表信息）
    async saveConversationHistory() {
      try {
        await set(this.conversationHistoryListKey, JSON.stringify(this.conversationHistory));
      } catch (error) {
        console.error('保存历史对话列表失败:', error);
      }
    },
    
    // 保存当前对话内容（单独存储）
    async saveCurrentConversation() {
      if (!this.currentConversationId) return;
      
      try {
        // 保存对话内容到单独的key
        const contentKey = this.getConversationContentKey(this.currentConversationId);
        const conversationContent = {
          id: this.currentConversationId,
          messages: [...this.messages],
          updatedAt: new Date().toISOString()
        };
        await set(contentKey, JSON.stringify(conversationContent));
      } catch (error) {
        console.error('保存当前对话内容失败:', error);
      }
    },
    
    // 加载对话内容（通过ID加载详细内容）
    async loadConversation(conversationId) {
      try {
        // 从列表中找到对话基本信息
        const conversation = this.conversationHistory.find(c => c.id === conversationId);
        if (!conversation) {
          console.error('对话不存在:', conversationId);
          return;
        }
        
        // 通过ID加载对话详细内容
        const contentKey = this.getConversationContentKey(conversationId);
        const contentStr = await get(contentKey);
        
        if (contentStr) {
          const conversationContent = JSON.parse(contentStr);
          this.currentConversationId = conversationContent.id;
          this.messages = conversationContent.messages ? [...conversationContent.messages] : [];
        } else {
          // 如果没有找到内容，可能是旧数据，尝试兼容
          this.currentConversationId = conversation.id;
          this.messages = [];
        }
        
        this.isNewConversation = false;
        this.historyPopoverVisible = false;
        
        // 更新 token 计数
        this.updateTokenCount();
        
        // 滚动到底部
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      } catch (error) {
        console.error('加载对话内容失败:', error);
      }
    },
    
    // 删除对话（同时删除列表和内容）
    async deleteConversation(conversationId) {
      try {
        // 如果删除的是当前对话，清空当前对话状态
        if (this.currentConversationId === conversationId) {
          this.handleNewConversation();
        }
        
        // 从历史列表中删除
        this.conversationHistory = this.conversationHistory.filter(c => c.id !== conversationId);
        
        // 保存更新后的列表
        await this.saveConversationHistory();
        
        // 删除对话内容
        const contentKey = this.getConversationContentKey(conversationId);
        await del(contentKey);
      } catch (error) {
        console.error('删除对话失败:', error);
      }
    },
    
    // 添加节点标签
    addNodeTag(nodeId, nodeType) {
      // 检查是否已存在相同的 node id
      const exists = this.inputContent.some(item => item.type === 'tag' && item.id === nodeId);
      if (!exists) {
        // 在光标位置插入 tag
        this.insertTagAtCursor(nodeId, nodeType || 'unknown');
      }
    },
    
    // 在光标位置插入 tag
    insertTagAtCursor(nodeId, nodeType) {
      // 确保输入框引用存在
      if (!this.$refs.editableInputRef) {
        console.warn('输入框引用不存在，无法插入tag');
        return;
      }
      
      const inputElement = this.$refs.editableInputRef;
      const selection = window.getSelection();
      
      // 检查selection是否在输入框内
      let range;
      let isSelectionInInput = false;
      
      if (selection.rangeCount > 0) {
        range = selection.getRangeAt(0);
        // 检查range的commonAncestorContainer是否在输入框内
        let container = range.commonAncestorContainer;
        if (container.nodeType === Node.TEXT_NODE) {
          container = container.parentElement;
        }
        // 检查是否是输入框本身或其子元素
        isSelectionInInput = inputElement.contains(container) || inputElement === container;
      }
      
      // 如果selection不在输入框内，需要聚焦输入框并移动到末尾
      if (!isSelectionInInput || !selection.rangeCount) {
        // 聚焦输入框
        inputElement.focus();
        
        // 创建新的range，定位到输入框末尾
        range = document.createRange();
        const walker = document.createTreeWalker(
          inputElement,
          NodeFilter.SHOW_TEXT,
          null
        );
        
        let lastTextNode = null;
        let node;
        while (node = walker.nextNode()) {
          lastTextNode = node;
        }
        
        if (lastTextNode) {
          range.setStart(lastTextNode, lastTextNode.textContent.length);
          range.setEnd(lastTextNode, lastTextNode.textContent.length);
        } else {
          // 如果没有文本节点，在输入框末尾创建
          range.selectNodeContents(inputElement);
          range.collapse(false);
        }
        
        // 更新selection
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        // selection在输入框内，使用现有的range
        range = selection.getRangeAt(0);
      }
      
      // 确保range在输入框内（再次检查）
      let container = range.commonAncestorContainer;
      if (container.nodeType === Node.TEXT_NODE) {
        container = container.parentElement;
      }
      if (!inputElement.contains(container) && inputElement !== container) {
        // 如果还是不在输入框内，强制移动到末尾
        inputElement.focus();
        range = document.createRange();
        range.selectNodeContents(inputElement);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      
      const tagElement = this.createTagElement(nodeId, nodeType);
      
      // 删除选中的内容
      range.deleteContents();
      
      // 插入 tag 元素
      range.insertNode(tagElement);
      
      // 在 tag 后插入一个文本节点（用于继续输入）
      const textNode = document.createTextNode('\u200B'); // 零宽度空格
      range.setStartAfter(tagElement);
      range.setEndAfter(tagElement);
      range.insertNode(textNode);
      
      // 移动光标到 tag 后面
      range.setStartAfter(textNode);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      
      // 更新内容数组
      this.updateContentFromDOM();
    },
    
    // 创建 tag 元素（使用 a-tag 组件）
    createTagElement(nodeId, nodeType) {
      const container = document.createElement('span');
      container.className = 'ai-chat-inline-tag-wrapper';
      container.setAttribute('data-tag-id', nodeId);
      container.setAttribute('data-tag-type', nodeType);
      container.setAttribute('contenteditable', 'false');
      container.style.display = 'inline-block';
      container.style.verticalAlign = 'middle';
      container.style.margin = '0 2px';
      
      // 使用 Vue 创建 a-tag 组件
      const tagComponent = h(Tag, {
        closable: true,
        color: 'green',
        onClose: (e) => {
          e.preventDefault();
          e.stopPropagation();
          // 关闭 popover（修复 bug）
          if (this.hoveredTagElement === container) {
            this.tagPopoverVisible = false;
            this.hoveredTagElement = null;
          }
          this.removeInlineTag(nodeId);
        },
        style: {
          margin: 0,
          marginBottom: '3px',
          userSelect: 'none',
          // display: 'inline-block'
        }
      }, {
        default: () => '节点:' + nodeId
      });
      
      // 创建 Vue 应用实例并挂载
      const app = createApp({
        render: () => tagComponent
      });
      
      // 挂载到容器中
      app.mount(container);
      
      // 保存 app 实例以便后续清理
      container._vueApp = app;
      
      // 添加鼠标移入移出事件
      container.addEventListener('mouseenter', (e) => {
        this.currentHoverTagType = nodeType;
        this.hoveredTagElement = container;
        this.tagPopoverVisible = true;
        this.$nextTick(() => {
          this.updateTagPopoverPosition();
        });
      });
      
      container.addEventListener('mousemove', () => {
        if (this.hoveredTagElement === container) {
          this.updateTagPopoverPosition();
        }
      });
      
      container.addEventListener('mouseleave', () => {
        // 延迟隐藏，避免快速移动时闪烁
        const currentElement = this.hoveredTagElement;
        this.hoveredTagElement = null;
        setTimeout(() => {
          // 只有当鼠标移出的元素仍然是当前悬停的元素时才关闭
          if (!this.hoveredTagElement && currentElement === container) {
            this.tagPopoverVisible = false;
          }
        }, 200);
      });
      
      return container;
    },
    
    // 从 DOM 更新内容数组
    updateContentFromDOM() {
      if (!this.$refs.editableInputRef) return;
      
      const element = this.$refs.editableInputRef;
      this.inputContent = [];
      
      // 检查节点是否在 tag wrapper 内部
      const isInsideTagWrapper = (node) => {
        let parent = node.parentElement;
        while (parent && parent !== element) {
          if (parent.classList && parent.classList.contains('ai-chat-inline-tag-wrapper')) {
            return true;
          }
          parent = parent.parentElement;
        }
        return false;
      };
      
      const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
        {
          acceptNode: (node) => {
            // 如果是 tag wrapper 本身，接受它
            if (node.nodeType === Node.ELEMENT_NODE && node.classList && node.classList.contains('ai-chat-inline-tag-wrapper')) {
              return NodeFilter.FILTER_ACCEPT;
            }
            // 如果节点在 tag wrapper 内部，拒绝它（忽略 tag 的 label 文本）
            if (isInsideTagWrapper(node)) {
              return NodeFilter.FILTER_REJECT;
            }
            // 其他节点接受
            return NodeFilter.FILTER_ACCEPT;
          }
        }
      );
      
      let node;
      while (node = walker.nextNode()) {
        if (node.nodeType === Node.TEXT_NODE) {
          // 保留所有文本内容，包括空格，以保持原始位置和格式
          const textContent = node.textContent;
          if (textContent) {
            // 检查是否已有文本内容，如果是则合并
            const lastItem = this.inputContent[this.inputContent.length - 1];
            if (lastItem && lastItem.type === 'text') {
              lastItem.content += textContent;
            } else {
              this.inputContent.push({
                type: 'text',
                content: textContent
              });
            }
          }
        } else if (node.nodeType === Node.ELEMENT_NODE && node.classList && node.classList.contains('ai-chat-inline-tag-wrapper')) {
          const tagId = node.getAttribute('data-tag-id');
          const tagType = node.getAttribute('data-tag-type');
          this.inputContent.push({
            type: 'tag',
            id: tagId,
            nodeType: tagType
          });
        }
      }
    },
    
    // 处理输入事件
    handleInput(event) {
      // 延迟更新，避免在输入过程中频繁更新
      clearTimeout(this.inputUpdateTimer);
      this.inputUpdateTimer = setTimeout(() => {
        this.updateContentFromDOM();
      }, 100);
    },
    
    // 处理删除事件
    handleDelete(event) {
      const selection = window.getSelection();
      if (!selection.rangeCount) return;
      
      const range = selection.getRangeAt(0);
      
      // 如果选中了内容，检查是否包含 tag
      if (!range.collapsed) {
        const container = range.commonAncestorContainer;
        let tagWrapper = container.nodeType === Node.ELEMENT_NODE 
          ? container 
          : container.parentElement;
        
        while (tagWrapper && !tagWrapper.classList.contains('ai-chat-inline-tag-wrapper')) {
          tagWrapper = tagWrapper.parentElement;
        }
        
        if (tagWrapper) {
          event.preventDefault();
          const tagId = tagWrapper.getAttribute('data-tag-id');
          this.removeInlineTag(tagId);
          return;
        }
      } else {
        // 检查光标前是否是 tag
        const container = range.startContainer;
        let node = container.nodeType === Node.TEXT_NODE ? container : container.childNodes[range.startOffset - 1];
        
        if (node && node.nodeType === Node.ELEMENT_NODE && node.classList.contains('ai-chat-inline-tag-wrapper')) {
          event.preventDefault();
          const tagId = node.getAttribute('data-tag-id');
          this.removeInlineTag(tagId);
          return;
        }
      }
    },
    
    // 处理粘贴事件
    handlePaste(event) {
      event.preventDefault();
      const text = (event.clipboardData || window.clipboardData).getData('text');
      
      const selection = window.getSelection();
      if (!selection.rangeCount) return;
      
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(text));
      range.collapse(false);
      
      this.updateContentFromDOM();
    },
    
    // 移除内联 tag
    removeInlineTag(nodeId) {
      if (!this.$refs.editableInputRef) return;
      
      const element = this.$refs.editableInputRef;
      const tagWrapper = element.querySelector(`[data-tag-id="${nodeId}"]`);
      
      if (tagWrapper) {
        // 关闭 popover（修复 bug）
        if (this.hoveredTagElement === tagWrapper) {
          this.tagPopoverVisible = false;
          this.hoveredTagElement = null;
        }
        
        // 清理 Vue 应用实例
        if (tagWrapper._vueApp) {
          tagWrapper._vueApp.unmount();
          tagWrapper._vueApp = null;
        }
        
        // 在 tag 前后添加空格，保持文本连续性
        const textNode = document.createTextNode(' ');
        tagWrapper.parentNode.insertBefore(textNode, tagWrapper);
        tagWrapper.remove();
        
        // 移动光标到删除位置
        const selection = window.getSelection();
        const range = document.createRange();
        range.setStartBefore(textNode);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        
        this.updateContentFromDOM();
      }
    },
    
    // 获取文本内容
    getTextContent() {
      if (!this.$refs.editableInputRef) return '';
      return this.$refs.editableInputRef.textContent || '';
    },
    
    // 清空输入框
    clearInput() {
      if (this.$refs.editableInputRef) {
        this.$refs.editableInputRef.innerHTML = '';
        this.inputContent = [];
      }
    },
    
    // 更新 tag popover 位置
    updateTagPopoverPosition() {
      if (!this.hoveredTagElement || !this.$refs.editableInputRef) return;
      
      this.$nextTick(() => {
        const rect = this.hoveredTagElement.getBoundingClientRect();
        const inputRect = this.$refs.editableInputRef.getBoundingClientRect();
        
        // 计算 popover 位置，显示在 tag 上方
        this.tagPopoverStyle = {
          position: 'fixed',
          left: rect.left + rect.width / 2 + 'px',
          bottom: window.innerHeight - rect.top + 8 + 'px',
          transform: 'translateX(-50%)',
          zIndex: 1050
        };
      });
    },
    
    // 更新 token 使用量
    updateTokenCount() {
      const messageHistory = this.messages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));
      
      // 计算当前消息历史的 token 数量
      const historyTokens = estimateMessagesTokenCount(messageHistory);
      // 加上系统提示词的 token 数量
      this.currentTokenCount = SYSTEM_PROMPT_ESTIMATED_TOKENS + historyTokens;
    },
    
    // 检查是否达到 token 限制
    isTokenLimitReached() {
      // 检查当前消息历史是否已接近限制
      const currentInputText = this.getTextContent();
      const inputTokens = estimateTokenCount(currentInputText);
      const estimatedTotal = this.currentTokenCount + inputTokens;
      
      return estimatedTotal >= this.maxContextTokens;
    },
    
    // 获取 token 使用百分比
    getTokenUsagePercent() {
      if (this.maxContextTokens === 0) return 0;
      return Math.min(100, Math.round((this.currentTokenCount / this.maxContextTokens) * 100));
    },
    
  },
  
  watch: {
    messages: {
      handler() {
        // 当消息更新时，滚动到底部
        this.$nextTick(() => {
          this.scrollToBottom();
          // 更新 token 计数
          this.updateTokenCount();
        });
      },
      deep: true
    }
  }
};
</script>

<style scoped>
.ai-chat-card-wrapper {
  position: fixed;
  right: 16px;
  top: 90px;
  bottom: 16px;
  width: 480px;
  z-index: 1000;
}

.ai-chat-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 18px;
}

.ai-chat-card :deep(.ant-card-body) {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0;
}


.ai-chat-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.ai-chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.ai-chat-title {
  font-size: 16px;
  font-weight: 600;
  /* color: #262626; */
}


.ai-chat-close-btn:hover {
  color: #262626;
  /* background-color: #f5f5f5; */
}

.ai-chat-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  /* background: #fafafa; */
  display: flex;
  flex-direction: column;
}

.ai-chat-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-text {
  /* color: #8c8c8c; */
  font-size: 14px;
}

.ai-chat-messages {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ai-chat-message {
  display: flex;
  flex-direction: column;
}

.ai-chat-message-user {
  align-items: flex-end;
}

.ai-chat-message-ai {
  align-items: flex-start;
}

.ai-chat-message-content {
  max-width: 75%;
  padding: 12px 16px;
  border-radius: 8px;
  word-wrap: break-word;
  white-space: pre-wrap;
  line-height: 1.6;
  font-size: 14px;
  position: relative;
}

.ai-chat-message-user .ai-chat-message-content {
  background: #1890ff;
  color: #ffffff;
  border-bottom-right-radius: 2px;
}

.ai-chat-message-ai .ai-chat-message-content {
  background: #ffffff;
  color: #262626;
  border: 1px solid #e8e8e8;
  border-bottom-left-radius: 2px;
}

.ai-chat-message-text {
  word-break: break-word;
}

.ai-chat-message-loading {
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.ai-chat-message-status {
  color: #8c8c8c;
  font-size: 12px;
  font-style: italic;
}

.ai-chat-footer {
  padding: 12px 12px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ai-chat-token-progress {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 4px;
}

.ai-chat-token-warning {
  font-size: 12px;
  color: #ff4d4f;
  white-space: nowrap;
}

.ai-chat-input-container {
  border-width: 1px;
  border-style: solid;
  border-radius: 12px;
  transition: all 0.3s;
  /* background: #ffffff; */
  display: flex;
  flex-direction: column;
}

.ai-chat-input-container:hover {
  border-color: #40a9ff;
}

.ai-chat-input-container:focus-within {
  border-color: #40a9ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.ai-chat-input-wrapper {
  padding: 12px 12px 2px 12px;
  position: relative;
}

.ai-chat-editable-input {
  min-height: 22px;
  max-height: 150px;
  overflow-y: auto;
  outline: none;
  word-wrap: break-word;
  white-space: pre-wrap;
  font-size: 14px;
  line-height: 1.5;;
  padding: 0;
  color: inherit;
}

.ai-chat-editable-input:empty::before {
  content: attr(placeholder);
  color: #bfbfbf;
  pointer-events: none;
}

.ai-chat-editable-input.ai-chat-input-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.ai-chat-inline-tag-wrapper {
  display: inline-block;
  vertical-align: middle;
  margin: 0 2px;
}

.ai-chat-tag-popover {
  position: fixed;
  background: #ffffff;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
  padding: 8px 12px;
  min-width: 150px;
  max-width: 300px;
  pointer-events: none;
}

.ai-chat-tag-popover-title {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
  color: rgba(0, 0, 0, 0.88);
}

.ai-chat-tag-popover-content {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
}

.darkmode--activated .ai-chat-tag-popover {
  background: #1f1f1f;
  border-color: #434343;
}

.darkmode--activated .ai-chat-tag-popover-title {
  color: rgba(255, 255, 255, 0.88);
}

.darkmode--activated .ai-chat-tag-popover-content {
  color: rgba(255, 255, 255, 0.65);
}

.ai-chat-input {
  width: 100%;
  resize: none;
  border: none !important;
  border-radius: 0;
  padding: 0;
  font-size: 14px;
  line-height: 1.5;
  box-shadow: none !important;
}

.ai-chat-input:hover {
  border: none !important;
  box-shadow: none !important;
}

.ai-chat-input:focus {
  border: none !important;
  box-shadow: none !important;
}

.ai-chat-input :deep(textarea) {
  border: none !important;
  box-shadow: none !important;
}

.ai-chat-input :deep(textarea:hover) {
  border: none !important;
  box-shadow: none !important;
}

.ai-chat-input :deep(textarea:focus) {
  border: none !important;
  box-shadow: none !important;
  outline: none;
}

.ai-chat-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
}

.ai-chat-tool-btn {
  color: #8c8c8c;
  border: none;
}

.ai-chat-tool-btn:hover {
  color: #262626;
  background-color: #f5f5f5;
}

.ai-chat-send-btn {
  margin-left: auto;
  background-color: #1890ff;
  border-color: #1890ff;
}

.ai-chat-send-btn:hover:not(:disabled) {
  background-color: #40a9ff;
  border-color: #40a9ff;
}

/* 历史对话列表样式 */
.ai-chat-history-list {
  max-height: 400px;
  overflow-y: auto;
}

.ai-chat-history-empty {
  padding: 16px;
  text-align: center;
  color: #8c8c8c;
  font-size: 14px;
}

.ai-chat-history-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* padding: 8px 12px; */
  /* border-bottom: 1px solid #f0f0f0; */
  cursor: pointer;
  transition: background-color 0.2s;
  border-radius: 6px;
  margin: 2px 0;
}

.ai-chat-history-item:last-child {
  border-bottom: none;
}

.ai-chat-history-item:hover {
  background-color: #f0f0f0;
}

.darkmode--activated  .ai-chat-history-item:hover {
  background-color: #303030;
}


/* .ai-chat-history-item:hover {
  background-color: #f5f5f5;
} */

.ai-chat-history-title {
  flex: 1;
  font-size: 15px;
  text-align: left;
  /* color: #262626; */
  overflow: hidden;
  /* text-overflow: ellipsis; */
  white-space: nowrap;
  padding: 2px 8px;
  /* padding-right: 8px; */
}

.ai-chat-history-delete {
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 0.2s;
}

.ai-chat-history-item:hover .ai-chat-history-delete {
  opacity: 1;
}
</style>

