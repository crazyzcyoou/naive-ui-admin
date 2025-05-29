<template>
  <div class="chat-window" :class="{ 'floating-mode': isFloating }">
    <div class="history" ref="historyRef">
      <div class="history-content">
        <div
          v-for="(msg, idx) in history"
          :key="idx"
          class="message mb-2 flex"
          :class="{ 'justify-end': msg.sender === '用户', 'justify-start': msg.sender !== '用户' }">
          <div class="max-w-xs px-3 py-2 rounded" :class="msg.sender === '用户' ? 'bg-blue-100 text-right' : 'bg-gray-200 text-left'">
            <div v-if="!msg.type"><strong>{{ msg.sender }}:</strong> {{ msg.text }}</div>
            <div v-if="msg.type"><strong>{{ msg.sender }}:</strong>
              <a class="text-primary text-decoration-underline" data-bs-toggle="modal" data-bs-target="#chatDataOpen" @click="chatDataOpen(msg.body, false)">{{ $t('HomeView.clickToViewData') }}</a>
              <br>
              <a class="text-primary text-decoration-underline" @click="chatDataOpen(msg.body, true)">{{ $t('HomeView.download') }}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="input-container">
      <n-input
        v-model:value="input"
        type="textarea"
        :autosize="{ minRows: 1, maxRows: isFloating ? 1 : 4 }"
        class="no-focus-effect chat-input"
        placeholder="输入消息..."
        @keydown.enter.prevent="sendMessage"
      />
      <n-button
        type="primary"
        class="send-button"
        :disabled="sending"
        @click="sendMessage">
        <div v-if="sending" class="status-processing">
          <div class="custom-spinner"></div>
          <span>发送中...</span>
        </div>
        <span v-else>发送</span>
      </n-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, nextTick, watch } from 'vue';
  // import { useI18n } from 'vue-i18n';

  // 定义props
  interface Props {
    isFloating?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    isFloating: false
  });

  const input = ref('');
  const history = ref<any[]>([]);
  const historyRef = ref<HTMLElement>();
  const sending = ref(false);
  // const { t } = useI18n();

  // 自动滚动到底部
  const scrollToBottom = () => {
    nextTick(() => {
      if (historyRef.value) {
        // 滚动到底部
        historyRef.value.scrollTop = historyRef.value.scrollHeight;
      }
    });
  };

  // 监听历史记录变化，自动滚动到底部
  watch(history, () => {
    scrollToBottom();
  }, { deep: true });

  function loadHistory() {
    const stored = localStorage.getItem('chatHistory');
    if (stored) {
      try {
        history.value = JSON.parse(stored);
      } catch (e) {
        history.value = [];
      }
    }

    // 如果没有历史记录，添加一条欢迎消息
    if (history.value.length === 0) {
      history.value = [
        { sender: '系统', text: '欢迎使用聊天助手！请输入消息开始对话。', type: null }
      ];
    }
  }

  function saveHistory() {
    localStorage.setItem('chatHistory', JSON.stringify(history.value));
  }

  async function sendMessage() {
    if (!input.value) return;

    // 添加用户消息
    history.value.push({
      sender: '用户',
      text: input.value,
      type: null
    });

    const userMessage = input.value;
    input.value = '';

    // 模拟发送中状态
    sending.value = true;

    try {
      // 这里可以添加实际的API调用
      // const response = await yourApiCall(userMessage);

      // 模拟服务器响应
      setTimeout(() => {
        history.value.push({
          sender: '系统',
          text: `回复: ${userMessage}`,
          type: null
        });

        sending.value = false;
        saveHistory();
      }, 1000);
    } catch (error) {
      console.error('发送消息失败', error);
      sending.value = false;
    }
  }

  function chatDataOpen(data, isDownload) {
    if (isDownload) {
      // 下载逻辑
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'chat-data.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      // 查看数据逻辑
      console.log('查看数据', data);
      // 这里可以实现打开模态框显示数据
    }
  }



  onMounted(() => {
    loadHistory();
    scrollToBottom();
  });
</script>

<style scoped>
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    overflow: hidden;
  }

  .chat-window {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 100%;
    max-height: 100%;
    padding: 0;
    margin: 0;
    background-color: white;
    box-sizing: border-box;
    overflow: hidden;
    border-radius: inherit; /* 继承父容器的圆角 */
  }

  /* 悬浮模式下的特殊样式 */
  .chat-window.floating-mode {
    height: 100%;
  }

  .chat-window.floating-mode .history {
    /* 悬浮模式下聊天记录区域调整 - 让它占据更多空间 */
    flex: 1 1 0; /* 改为flex: 1 1 0，让它尽可能占据剩余空间 */
    min-height: 0; /* 允许收缩到最小 */
    overflow-y: auto !important; /* 强制显示垂直滚动条 */
    overflow-x: hidden !important; /* 隐藏水平滚动条 */
    /* 悬浮模式下的滚动条样式 - 更明显 */
    scrollbar-width: thin;
    scrollbar-color: #888 #f1f1f1;
  }

  .chat-window.floating-mode .history-content {
    padding: 8px;
  }

  /* 确保悬浮模式下也使用 margin-top: auto */
  .chat-window.floating-mode .history-content > .message:first-child {
    margin-top: auto;
  }

  .chat-window.floating-mode .input-container {
    /* 悬浮模式下输入容器调整 - 设置合理的固定高度 */
    flex: 0 0 70px !important; /* 固定高度为70px，确保按钮可见 */
    min-height: 70px !important; /* 最小高度70px */
    max-height: 70px !important; /* 最大高度70px */
    height: 70px !important; /* 强制高度70px */
    padding: 6px 8px !important; /* 适中的padding */
    gap: 6px !important; /* 适中的gap */
    border-bottom-left-radius: inherit;
    border-bottom-right-radius: inherit;
    display: flex !important;
    flex-direction: column !important;
  }

  /* 悬浮模式下输入框的特殊样式 */
  .chat-window.floating-mode .chat-input {
    margin-bottom: 4px !important; /* 适中的底部边距 */
    margin-top: 0 !important; /* 移除顶部边距 */
    flex: 1 !important; /* 让输入框占据可用空间 */
  }

  /* 悬浮模式下发送按钮区域也要减少间距 */
  .chat-window.floating-mode .send-button {
    margin: 0 !important; /* 移除所有边距 */
    height: 28px !important; /* 设置按钮高度 */
    padding: 0 12px !important; /* 减少按钮内边距 */
    font-size: 13px !important; /* 适中的字体大小 */
    flex: 0 0 auto !important; /* 按钮不伸缩 */
  }

  /* 停靠模式下也要确保发送按钮可见 */
  .chat-window:not(.floating-mode) .history {
    max-height: calc(100% - 150px);
    min-height: 180px;
    flex: 1 1 auto;
  }

  .chat-window:not(.floating-mode) .history-content {
    padding: 8px;
  }

  .chat-window:not(.floating-mode) .input-container {
    min-height: 100px;
    flex: 0 0 auto;
    padding: 12px 16px 16px 16px;
    gap: 12px;
    border-bottom-left-radius: inherit;
    border-bottom-right-radius: inherit;
  }

  .history {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0;
    margin: 0;
    background-color: #f9f9f9;
    /* 添加滚动条样式 */
    scrollbar-width: thin;
    scrollbar-color: #c1c1c1 transparent;
    /* 确保内容能够填充整个可用空间 */
    display: flex;
    flex-direction: column;
    border-top-left-radius: inherit;
    border-top-right-radius: inherit;
    /* 确保滚动条紧贴边框 */
    box-sizing: border-box;
    /* 确保没有边距导致的间隙 */
    position: relative;
  }

  /* 消息容器，让消息从底部开始排列 */
  .history-content {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    padding: 12px 16px;
  }

  /* 使用 margin-top: auto 让第一个消息推到底部，避免滚动问题 */
  .history-content > .message:first-child {
    margin-top: auto;
  }

  /* Webkit浏览器滚动条样式 */
  .history::-webkit-scrollbar {
    width: 6px;
  }

  .history::-webkit-scrollbar-track {
    background: transparent;
  }

  .history::-webkit-scrollbar-thumb {
    background-color: #c1c1c1;
    border-radius: 3px;
  }

  .history::-webkit-scrollbar-thumb:hover {
    background-color: #a8a8a8;
  }

  /* 悬浮模式下的滚动条样式 - 更明显 */
  .chat-window.floating-mode .history::-webkit-scrollbar {
    width: 8px; /* 比默认的6px稍宽 */
  }

  .chat-window.floating-mode .history::-webkit-scrollbar-track {
    background: #f1f1f1; /* 浅灰色背景，更明显 */
    border-radius: 4px;
  }

  .chat-window.floating-mode .history::-webkit-scrollbar-thumb {
    background-color: #888; /* 更深的颜色 */
    border-radius: 4px;
    border: 1px solid #f1f1f1; /* 添加边框 */
  }

  .chat-window.floating-mode .history::-webkit-scrollbar-thumb:hover {
    background-color: #555; /* 悬停时更深 */
  }

  .message {
    margin-bottom: 5px;
    word-break: break-all;
  }

  .input-container {
    padding: 12px 12px 6px 12px; /* 进一步减少底部padding到6px */
    margin: 0;
    background-color: #fff;
    border-top: 1px solid #eaeaea;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    box-sizing: border-box;
    border-bottom-left-radius: inherit;
    border-bottom-right-radius: inherit;
    /* 确保完全填充到边框 */
    position: relative;
    /* 默认的flex设置 */
    flex: 0 0 auto;
    min-height: 80px; /* 设置一个基础的最小高度 */
  }

  .chat-input {
    margin-bottom: 6px; /* 从8px减少到6px */
    border-radius: 4px;
  }

  .send-button {
    align-self: flex-end;
  }

  .justify-end {
    display: flex;
    justify-content: flex-end;
  }

  .justify-start {
    display: flex;
    justify-content: flex-start;
  }

  .max-w-xs {
    max-width: 20rem;
  }

  .bg-blue-100 {
    background-color: #e0f0ff;
  }

  .bg-gray-200 {
    background-color: #f0f0f0;
  }

  .text-right {
    text-align: right;
  }

  .text-left {
    text-align: left;
  }

  .text-primary {
    color: #0d6efd;
  }

  .text-decoration-underline {
    text-decoration: underline;
  }

  .custom-spinner {
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255, 193, 7, 0.3);
    border-top: 3px solid #ffc107;
    border-radius: 50%;
    animation: spin 0.8s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
    box-shadow: 0 0 6px rgba(255, 193, 7, 0.6);
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .status-processing {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-weight: bold;
    color: #fdbe01;
  }

  .badge {
    display: inline-block;
    padding: 0.25em 0.5em;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: #fff;
  }

  .badge-success {
    background-color: #28a745;
  }

  .badge-danger {
    background-color: #dc3545;
  }

  .badge-secondary {
    background-color: #6c757d;
  }

  .no-arrow {
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    background-image: none !important;
    padding-right: 10px;
  }

  .no-focus-effect:focus {
    outline: none !important;
    box-shadow: none !important;
  }

  .checkbox-no-outline {
    outline: none;
    box-shadow: none;
  }

  .checkbox-no-outline:focus {
    outline: none !important;
    box-shadow: none !important;
  }
</style>
