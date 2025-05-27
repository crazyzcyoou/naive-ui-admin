<template>
  <div class="chat-window">
    <div class="history">
      <div v-for="(msg, idx) in history" :key="idx" class="message">
        {{ msg }}
      </div>
    </div>
    <div class="input-row">
      <n-input
        v-model:value="input"
        type="textarea"
        autosize
        placeholder="\u8f93\u5165\u6d88\u606f"
        @keydown.enter.prevent="sendMessage"
      />
      <n-button type="primary" class="mt-2" @click="sendMessage">\u53d1\u9001</n-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';

  const input = ref('');
  const history = ref<string[]>([]);

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

  function sendMessage() {
    if (!input.value) return;
    history.value.push(input.value);
    input.value = '';
    saveHistory();
  }

  onMounted(() => {
    loadHistory();
  });
</script>

<style scoped>
  .chat-window {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .history {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
  }
  .message {
    margin-bottom: 5px;
    word-break: break-all;
  }
  .input-row {
    padding: 0 10px 10px;
  }
</style>
