<template>
  <div class="floating-chat-container">
    <!-- 最小化状态的聊天图标 -->
    <div
      v-if="isMinimized"
      class="chat-icon"
      :style="iconStyle"
      @click="toggleMinimize"
      @mousedown="startDrag"
    >
      <n-icon size="24" color="#fff">
        <MessageOutlined />
      </n-icon>
      <div v-if="unreadCount > 0" class="unread-badge">{{ unreadCount }}</div>
    </div>

    <!-- 展开状态的聊天窗口 -->
    <div
      v-else
      class="chat-window"
      :style="windowStyle"
    >
      <!-- 聊天窗口头部 -->
      <div class="chat-header" :style="headerStyle" @mousedown="startDrag">
        <div class="chat-title">
          <n-icon size="18" class="mr-2">
            <MessageOutlined />
          </n-icon>
          <span>聊天助手</span>
          <small style="opacity: 0.7; margin-left: 8px;">(Ctrl+Shift+C)</small>
        </div>
        <div class="chat-controls">
          <!-- 最小化按钮 -->
          <n-button text size="small" @click="toggleMinimize">
            <n-icon size="16">
              <CloseOutlined />
            </n-icon>
          </n-button>
        </div>
      </div>

      <!-- 聊天内容区域 -->
      <div class="chat-content">
        <ChatWindow />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { NIcon, NButton } from 'naive-ui';
import { MessageOutlined, CloseOutlined } from '@vicons/antd';
import ChatWindow from './index.vue';
import { useDesignSettingStore } from '@/store/modules/designSetting';

// 状态管理
const isMinimized = ref(true); // 默认最小化状态
const unreadCount = ref(0);

// 主题设置
const designSettingStore = useDesignSettingStore();
const themeColor = computed(() => designSettingStore.appTheme);

// 位置和拖拽相关
const getInitialPosition = () => {
  // 确保初始位置在屏幕范围内
  const x = Math.min(window.innerWidth - 80, Math.max(20, window.innerWidth - 80));
  const y = Math.min(window.innerHeight - 80, Math.max(20, window.innerHeight - 80));
  return { x, y };
};

const position = ref(getInitialPosition());
const isDragging = ref(false);
const dragOffset = ref({ x: 0, y: 0 });



// 计算样式
const iconStyle = computed(() => {
  return {
    left: `${position.value.x}px`,
    top: `${position.value.y}px`,
    background: `linear-gradient(135deg, ${themeColor.value} 0%, ${themeColor.value}dd 100%)`
  };
});

const headerStyle = computed(() => {
  return {
    background: `linear-gradient(135deg, ${themeColor.value} 0%, ${themeColor.value}dd 100%)`
  };
});



const windowStyle = computed(() => {
  return {
    position: 'fixed',
    left: `${position.value.x}px`,
    top: `${position.value.y}px`,
    width: '350px',
    height: '500px',
    border: `2px solid ${themeColor.value}`,
    borderRadius: '12px',
    zIndex: '1000'
  };
});

// 方法
const toggleMinimize = () => {
  isMinimized.value = !isMinimized.value;
  saveSettings();
};



const startDrag = (e: MouseEvent) => {

  // 防止点击时立即触发拖拽
  const startTime = Date.now();
  const startX = e.clientX;
  const startY = e.clientY;

  const handleMouseMove = (moveEvent: MouseEvent) => {
    const timeDiff = Date.now() - startTime;
    const distanceMoved = Math.sqrt(
      Math.pow(moveEvent.clientX - startX, 2) + Math.pow(moveEvent.clientY - startY, 2)
    );

    // 只有在移动了一定距离或时间后才开始拖拽
    if (timeDiff > 50 || distanceMoved > 3) {
      isDragging.value = true;
      dragOffset.value = {
        x: moveEvent.clientX - position.value.x,
        y: moveEvent.clientY - position.value.y
      };

      document.removeEventListener('mousemove', handleMouseMove);
      document.addEventListener('mousemove', onDrag);
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    if (isDragging.value) {
      stopDrag();
    }
  };

  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
  e.preventDefault();
};

const onDrag = (e: MouseEvent) => {
  if (!isDragging.value) return;

  // 对于聊天图标，使用更宽松的边界限制
  const elementWidth = isMinimized.value ? 60 : 350;
  const elementHeight = isMinimized.value ? 60 : 500;

  // 允许拖拽到屏幕边缘，只要元素还有一部分可见
  const minX = -elementWidth + 50; // 允许大部分拖出屏幕，但保留50px可见
  const maxX = window.innerWidth - 50; // 右边界也保留50px可见
  const minY = 0; // 顶部不能超出
  const maxY = window.innerHeight - 50; // 底部保留50px可见

  position.value = {
    x: Math.max(minX, Math.min(maxX, e.clientX - dragOffset.value.x)),
    y: Math.max(minY, Math.min(maxY, e.clientY - dragOffset.value.y))
  };
};

const stopDrag = () => {
  isDragging.value = false;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
  saveSettings();
};

// 保存和加载设置
const saveSettings = () => {
  const settings = {
    isMinimized: isMinimized.value,
    position: position.value
  };
  localStorage.setItem('chatWindowSettings', JSON.stringify(settings));
};

const loadSettings = () => {
  const saved = localStorage.getItem('chatWindowSettings');
  if (saved) {
    try {
      const settings = JSON.parse(saved);
      isMinimized.value = settings.isMinimized !== undefined ? settings.isMinimized : true;

      // 验证保存的位置是否在当前屏幕范围内
      if (settings.position) {
        const elementWidth = settings.isMinimized ? 60 : 350;
        const elementHeight = settings.isMinimized ? 60 : 500;
        const minX = -elementWidth + 50;
        const maxX = window.innerWidth - 50;
        const minY = 0;
        const maxY = window.innerHeight - 50;

        position.value = {
          x: Math.max(minX, Math.min(maxX, settings.position.x)),
          y: Math.max(minY, Math.min(maxY, settings.position.y))
        };
      } else {
        position.value = getInitialPosition();
      }
    } catch (e) {
      console.error('Failed to load chat window settings:', e);
      position.value = getInitialPosition();
    }
  }
};

// 窗口大小变化处理
const handleResize = () => {
  // 确保窗口仍在可见范围内
  const elementWidth = isMinimized.value ? 60 : 350;
  const elementHeight = isMinimized.value ? 60 : 500;
  const minX = -elementWidth + 50;
  const maxX = window.innerWidth - 50;
  const minY = 0;
  const maxY = window.innerHeight - 50;

  position.value = {
    x: Math.max(minX, Math.min(maxX, position.value.x)),
    y: Math.max(minY, Math.min(maxY, position.value.y))
  };
  saveSettings();
};

// 键盘快捷键处理
const handleKeydown = (e: KeyboardEvent) => {
  // Ctrl + Shift + C 切换聊天窗口
  if (e.ctrlKey && e.shiftKey && e.key === 'C') {
    e.preventDefault();
    toggleMinimize();
  }
};

onMounted(() => {
  loadSettings();
  document.addEventListener('keydown', handleKeydown);
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
  document.removeEventListener('keydown', handleKeydown);
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.floating-chat-container {
  position: fixed;
  z-index: 1000;
  pointer-events: none;
}

.chat-icon {
  position: fixed;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
  pointer-events: auto;
}

.chat-icon:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}



.unread-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff4757;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.chat-window {
  position: fixed;
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  pointer-events: auto;
  transition: all 0.3s ease;
}



.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  color: white;
  cursor: move;
  user-select: none;
}

.chat-title {
  display: flex;
  align-items: center;
  font-weight: 600;
}

.chat-controls {
  display: flex;
  gap: 8px;
}

.chat-content {
  flex: 1;
  overflow: hidden;
}

.mr-2 {
  margin-right: 8px;
}
</style>
