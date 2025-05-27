<template>
  <div
    class="border-l text-gray-800 p-3 flex flex-col flex-shrink-0"
    style="width: 320px; height: 100%; resize: horizontal; overflow: auto; min-width: 200px; max-width: 500px;"
  >
    <div class="font-bold mb-2">Chat</div>
    <div
      ref="chatContainer"
      class="flex-grow overflow-auto mb-2"
      style="border: 1px solid #ccc; padding: 10px; background-color: white"
    >
      <div
        v-for="(msg, i) in chatMessages"
        :key="i"
        class="mb-2 flex"
        :class="{ 'justify-end': msg.sender === '用户', 'justify-start': msg.sender !== '用户' }"
      >
        <div
          class="max-w-xs px-3 py-2 rounded"
          :class="msg.sender === '用户' ? 'bg-blue-100 text-right' : 'bg-gray-200 text-left'"
        >
          <div v-if="!msg.type">
            <strong>{{ msg.sender }}:</strong> {{ msg.text }}
          </div>
          <div v-else>
            <strong>{{ msg.sender }}:</strong>
            <a class="text-primary underline cursor-pointer" @click="chatDataOpen(msg.body, false)">查看数据</a>
            <br />
            <a class="text-primary underline cursor-pointer" @click="chatDataOpen(msg.body, true)">下载</a>
          </div>
        </div>
      </div>
    </div>
    <div class="flex">
      <div class="flex-grow mr-2">
        <n-input
          v-model:value="newMessage"
          type="textarea"
          :autosize="{ minRows: 4 }"
          placeholder="输入消息"
          @keydown.enter.prevent="sendMessage"
        />
      </div>
      <n-button type="primary" :disabled="demandIsUploading" @click="sendMessage">
        <template #default>
          <n-spin size="small" v-if="sending" class="mr-1" />
          {{ sending ? '发送中...' : '发送' }}
        </template>
      </n-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, nextTick } from 'vue';

  interface ChatMessage {
    sender: string;
    text?: string;
    type?: unknown;
    body?: string;
  }

  const chatMessages = ref<ChatMessage[]>([]);
  const newMessage = ref('');
  const sending = ref(false);
  const demandIsUploading = ref(false);
  const chatContainer = ref<HTMLElement | null>(null);

  function loadHistory() {
    const stored = localStorage.getItem('chatMessages');
    if (stored) {
      try {
        chatMessages.value = JSON.parse(stored);
      } catch {
        chatMessages.value = [];
      }
    }
  }

  function saveHistory() {
    localStorage.setItem('chatMessages', JSON.stringify(chatMessages.value));
  }

  function scrollToBottom() {
    nextTick(() => {
      if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
      }
    });
  }

  function sendMessage() {
    if (!newMessage.value.trim()) return;
    sending.value = true;
    chatMessages.value.push({ sender: '用户', text: newMessage.value });
    newMessage.value = '';
    saveHistory();
    scrollToBottom();
    sending.value = false;
  }

  function chatDataOpen(_body: string, _download: boolean) {
    // TODO: implement preview or download feature
  }

  onMounted(() => {
    loadHistory();
    scrollToBottom();
  });
</script>

<style scoped></style>
