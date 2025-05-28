<template>
  <div class="chat-window" :style="{ backgroundColor: themeStyles.chatBackground, color: themeStyles.textColor }">
    <div class="history" :style="{ backgroundColor: themeStyles.historyBackground }">
      <div
        v-for="(msg, idx) in history"
        :key="idx"
        class="message mb-2 flex"
        :class="{ 'justify-end': msg.sender === '用户', 'justify-start': msg.sender !== '用户' }">
        <div
          class="max-w-xs px-3 py-2 rounded"
          :style="{
            backgroundColor: msg.sender === '用户' ? themeStyles.userMessageBg : themeStyles.systemMessageBg,
            color: themeStyles.textColor
          }"
          :class="msg.sender === '用户' ? 'text-right' : 'text-left'">
          <div v-if="!msg.type"><strong>{{ msg.sender }}:</strong> {{ msg.text }}</div>
          <div v-if="msg.type"><strong>{{ msg.sender }}:</strong>
            <a class="text-primary text-decoration-underline" data-bs-toggle="modal" data-bs-target="#chatDataOpen" @click="chatDataOpen(msg.body, false)">{{ $t('HomeView.clickToViewData') }}</a>
            <br>
            <a class="text-primary text-decoration-underline" @click="chatDataOpen(msg.body, true)">{{ $t('HomeView.download') }}</a>
          </div>
        </div>
      </div>
    </div>
    <div class="input-container" :style="{ backgroundColor: themeStyles.inputBackground, borderTopColor: themeStyles.inputBorder }">
      <n-input
        v-model:value="input"
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4 }"
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
          <span>发送中</span>
        </div>
        <span v-else>发送</span>
      </n-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, nextTick, computed } from 'vue';
  import { useDesignSettingStore } from '@/store/modules/designSetting';
  // import { useI18n } from 'vue-i18n';

  const input = ref('');
  const history = ref<any[]>([]);
  const chatContainer = ref(null);
  const sending = ref(false);
  // const { t } = useI18n();

  // 主题设置
  const designSettingStore = useDesignSettingStore();

  // 主题相关的计算属性
  const themeStyles = computed(() => {
    const isDark = designSettingStore.darkTheme;
    return {
      chatBackground: isDark ? '#2d2d2d' : '#f9f9f9',
      historyBackground: isDark ? '#2d2d2d' : '#f9f9f9',
      inputBackground: isDark ? '#3d3d3d' : '#fff',
      inputBorder: isDark ? '#555' : '#eaeaea',
      textColor: isDark ? '#ffffff' : '#000000',
      userMessageBg: isDark ? '#4a5568' : '#e0f0ff',
      systemMessageBg: isDark ? '#2d3748' : '#f0f0f0'
    };
  });

  function loadHistory() {
    const stored = localStorage.getItem('chatHistory');
    if (stored) {
      try {
        history.value = JSON.parse(stored);
      } catch (e) {
        history.value = [];
      }
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
        scrollToBottom();
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

  function scrollToBottom() {
    nextTick(() => {
      if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
      }
    });
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
    box-sizing: border-box;
    overflow: hidden;
  }

  .history {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
  }

  .message {
    margin-bottom: 5px;
    word-break: break-all;
  }

  .input-container {
    padding: 12px;
    margin: 0;
    border-top: 1px solid;
    display: flex;
    flex-direction: row; /* 改为水平布局 */
    align-items: center; /* 垂直居中对齐 */
    gap: 8px; /* 输入框和按钮之间的间距 */
    flex-shrink: 0;
    box-sizing: border-box;
  }

  .chat-input {
    flex: 1; /* 让输入框占据剩余空间 */
    border-radius: 4px;
  }

  .send-button {
    flex-shrink: 0; /* 按钮不收缩 */
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

  /* 移除硬编码的背景色，改用动态样式 */

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
