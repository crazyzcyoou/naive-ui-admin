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
      :class="{
        'docked': isDocked,
        'docked-left': dockedPosition === 'left',
        'docked-right': dockedPosition === 'right'
      }"
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
          <!-- 停靠选项 -->
          <n-dropdown :options="dockOptions" @select="handleDockSelect">
            <n-button text size="small">
              <n-icon size="16">
                <SettingOutlined />
              </n-icon>
            </n-button>
          </n-dropdown>
          <!-- 关闭/最小化按钮 -->
          <n-button text size="small" @click="handleClose">
            <n-icon size="16">
              <CloseOutlined />
            </n-icon>
          </n-button>
        </div>
      </div>

      <!-- 聊天内容区域 -->
      <div class="chat-content">
        <ChatWindow :is-floating="dockedPosition === 'float'" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { NIcon, NButton, NDropdown } from 'naive-ui';
import { MessageOutlined, CloseOutlined, SettingOutlined } from '@vicons/antd';
import ChatWindow from './index.vue';
import { useDesignSettingStore } from '@/store/modules/designSetting';

/**
 * ==============================
 *  CONSTANTS & CONFIG
 * ==============================
 */
// 导航栏高度（可根据实际布局修改，或在主布局中通过 CSS 变量 --navbar-height 动态覆盖）
const NAVBAR_HEIGHT = 60; // 单位：px

// 状态管理
const isMinimized = ref(true); // 默认最小化状态
const isDocked = ref(false);
const dockedPosition = ref<'left' | 'right' | 'float'>('float');
const unreadCount = ref(0);

// 主题设置
const designSettingStore = useDesignSettingStore();
const themeColor = computed(() => designSettingStore.appTheme);

// 定义事件发射器
const emit = defineEmits<{
  'dock-change': [{ isDocked: boolean; position: string; width: number }]
}>();

// 位置和拖拽相关
const getInitialPosition = () => {
  const x = Math.min(window.innerWidth - 80, Math.max(20, window.innerWidth - 80));
  const y = Math.min(window.innerHeight - 80, Math.max(20, window.innerHeight - 80));
  return { x, y };
};

const position = ref(getInitialPosition());
const isDragging = ref(false);
const dragOffset = ref({ x: 0, y: 0 });

// 停靠选项
const dockOptions = [
  { label: '悬浮', key: 'float' },
  { label: '停靠左侧', key: 'left' },
  { label: '停靠右侧', key: 'right' }
];

// 计算样式
const iconStyle = computed(() => ({
  left: `${position.value.x}px`,
  top: `${position.value.y}px`,
  background: `linear-gradient(135deg, ${themeColor.value} 0%, ${themeColor.value}dd 100%)`
}));

const headerStyle = computed(() => ({
  background: `linear-gradient(135deg, ${themeColor.value} 0%, ${themeColor.value}dd 100%)`
}));

/**
 * 关键修改：在停靠模式下(左右)让聊天窗口出现在导航栏下方，
 * 并且自适应减去导航栏高度，防止遮挡。
 */
const windowStyle = computed(() => {
  const baseStyle: Record<string, string> = {
    border: `2px solid ${themeColor.value}`,
    zIndex: '1000'
  };

  // 停靠模式
  if (isDocked.value) {
    const dockedBase = {
      ...baseStyle,
      position: 'fixed',
      top: `${NAVBAR_HEIGHT + 10}px`, // 导航栏高度 + 10px 外边距
      bottom: '10px',
      width: '350px',
      display: 'flex',
      flexDirection: 'column',
      height: `calc(100vh - ${NAVBAR_HEIGHT}px - 20px)` // 10px 顶部间距 + 10px 底部间距
    } as const;

    switch (dockedPosition.value) {
      case 'left':
        return {
          ...dockedBase,
          left: '0',
          borderRadius: '0 6px 6px 0',
          borderLeft: 'none'
        } as const;
      case 'right':
        return {
          ...dockedBase,
          right: '0',
          borderRadius: '6px 0 0 6px',
          borderRight: 'none'
        } as const;
      default:
        // 'float' 情况下不会进入此分支，但为了类型完整性保留
        break;
    }
  }

  // 悬浮模式
  return {
    ...baseStyle,
    position: 'fixed',
    left: `${position.value.x}px`,
    top: `${position.value.y}px`,
    width: '280px',
    height: '380px',
    borderRadius: '6px'
  } as const;
});

// ==============================
//        其余逻辑保持不变
// ==============================
const toggleMinimize = () => {
  isMinimized.value = !isMinimized.value;
  saveSettings();
};

const handleClose = () => {
  if (isDocked.value) {
    isDocked.value = false;
    dockedPosition.value = 'float';
    emit('dock-change', { isDocked: false, position: 'float', width: 0 });
    nextTick(() => {
      const currentX = position.value.x;
      position.value.x = currentX + 1;
      nextTick(() => (position.value.x = currentX));
    });
  } else {
    isMinimized.value = !isMinimized.value;
  }
  saveSettings();
};

const handleDockSelect = (key: string) => {
  dockedPosition.value = key as any;
  isDocked.value = key !== 'float';
  emit('dock-change', {
    isDocked: isDocked.value,
    position: dockedPosition.value,
    width: isDocked.value ? 350 : 0
  });
  saveSettings();
};

const startDrag = (e: MouseEvent) => {
  if (isDocked.value) return;
  const startTime = Date.now();
  const startX = e.clientX;
  const startY = e.clientY;

  const handleMouseMove = (moveEvent: MouseEvent) => {
    const timeDiff = Date.now() - startTime;
    const distanceMoved = Math.hypot(moveEvent.clientX - startX, moveEvent.clientY - startY);
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
    if (isDragging.value) stopDrag();
  };

  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
  e.preventDefault();
};

const onDrag = (e: MouseEvent) => {
  if (!isDragging.value) return;
  const elementWidth = isMinimized.value ? 60 : 280;
  const elementHeight = isMinimized.value ? 60 : 380;
  const minX = -elementWidth + 50;
  const maxX = window.innerWidth - 50;
  const minY = 0;
  const maxY = window.innerHeight - 50;
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
    isDocked: isDocked.value,
    dockedPosition: dockedPosition.value,
    position: position.value
  };
  localStorage.setItem('chatWindowSettings', JSON.stringify(settings));
};

const loadSettings = () => {
  const saved = localStorage.getItem('chatWindowSettings');
  if (!saved) return;
  try {
    const settings = JSON.parse(saved);
    isMinimized.value = settings.isMinimized ?? true;
    isDocked.value = settings.isDocked ?? false;
    dockedPosition.value = settings.dockedPosition || 'float';

    if (settings.position) {
      const elementWidth = settings.isMinimized ? 60 : 280;
      const elementHeight = settings.isMinimized ? 60 : 380;
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

    if (isDocked.value) {
      emit('dock-change', {
        isDocked: true,
        position: dockedPosition.value,
        width: 350
      });
    }
  } catch (e) {
    console.error('Failed to load chat window settings:', e);
    position.value = getInitialPosition();
  }
};

// 窗口大小变化处理
const handleResize = () => {
  if (isDocked.value) return; // 停靠状态下高度自适应，无需调整
  const elementWidth = isMinimized.value ? 60 : 280;
  const elementHeight = isMinimized.value ? 60 : 380;
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

/* 基础聊天窗口样式 */
.chat-window {
  position: fixed;
  width: 280px;
  height: 380px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  pointer-events: auto;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

/* 停靠模式：高度自适应，考虑导航栏 */
.chat-window.docked {
  width: 350px;
  /* 顶部高度留出导航栏空间（CSS 变量，可在主布局覆盖）*/
  top: calc(var(--navbar-height, 60px) + 10px);
  height: calc(100vh - var(--navbar-height, 60px) - 20px);
  margin: 0;
  padding: 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
}

.chat-window.docked-left {
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
}

.chat-window.docked-right {
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
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
  position: relative;
}

.chat-content > * {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.mr-2 {
  margin-right: 8px;
}
</style>
