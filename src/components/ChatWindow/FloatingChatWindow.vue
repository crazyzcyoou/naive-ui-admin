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
      <n-icon size="24" :color="textColor">
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
import { NIcon, NButton, NDropdown, useThemeVars } from 'naive-ui';
import { MessageOutlined, CloseOutlined, SettingOutlined } from '@vicons/antd';
import ChatWindow from './index.vue';
import { useDesignSettingStore } from '@/store/modules/designSetting';

// 状态管理
const isMinimized = ref(false); // 默认展开状态，不再最小化
const isDocked = ref(true); // 默认停靠状态
const dockedPosition = ref<'left' | 'right' | 'float'>('left'); // 默认停靠在左侧
const unreadCount = ref(0);

// 主题设置
const designSettingStore = useDesignSettingStore();
const themeVars = useThemeVars();

// 获取边框颜色 - 根据主题模式动态设置
const borderColor = computed(() => {
  // 在深色模式下使用黑色边框，浅色模式下使用白色边框
  return designSettingStore.darkTheme
    ? '#000000' // 夜晚模式：黑色边框
    : '#ffffff'; // 白天模式：白色边框
});

// 获取聊天助手背景颜色 - 根据主题模式动态设置
const chatBackgroundColor = computed(() => {
  return designSettingStore.darkTheme
    ? '#333333' // 夜晚模式：深灰色背景
    : '#f0f0f0'; // 白天模式：浅灰色背景
});

// 获取文字颜色 - 根据主题模式动态设置
const textColor = computed(() => {
  return designSettingStore.darkTheme
    ? '#ffffff' // 夜晚模式：白色文字
    : '#000000'; // 白天模式：黑色文字
});

// 定义事件发射器
const emit = defineEmits<{
  'dock-change': [{ isDocked: boolean; position: string; width: number }]
}>();

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

// 停靠选项
const dockOptions = [
  { label: '悬浮', key: 'float' },
  { label: '停靠左侧', key: 'left' },
  { label: '停靠右侧', key: 'right' },
];


// 计算样式
const iconStyle = computed(() => {
  return {
    left: `${position.value.x}px`,
    top: `${position.value.y}px`,
    background: chatBackgroundColor.value,
    color: textColor.value
  };
});

const headerStyle = computed(() => {
  return {
    background: chatBackgroundColor.value,
    color: textColor.value
  };
});



const windowStyle = computed(() => {
  const baseStyle = {
    border: `3px solid ${borderColor.value}`,
    zIndex: '1000'
  };

  if (isDocked.value) {
    // 计算可用的窗口高度，停靠模式下使用完整高度与供求关系界面对齐
    const availableHeight = window.innerHeight; // 使用完整窗口高度，与供求关系界面对齐

    switch (dockedPosition.value) {
      case 'left':
        return {
          ...baseStyle,
          position: 'fixed',
          left: '0',
          top: '0', // 移除顶部边距，让聊天框贴顶
          height: `${availableHeight}px`,
          width: '350px',
          borderRadius: '0 6px 6px 0', /* 从12px改为6px */
          borderLeft: 'none',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        };
      case 'right':
        return {
          ...baseStyle,
          position: 'fixed',
          right: '0',
          top: '0', // 移除顶部边距，让聊天框贴顶
          height: `${availableHeight}px`,
          width: '350px',
          borderRadius: '6px 0 0 6px', /* 从12px改为6px */
          borderRight: 'none',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        };
      default:
        return {
          ...baseStyle,
          position: 'fixed',
          left: `${position.value.x}px`,
          top: `${position.value.y}px`,
          width: '280px',
          height: '380px',
          borderRadius: '6px' /* 从12px改为6px */
        };
    }
  }
  return {
    ...baseStyle,
    position: 'fixed',
    left: `${position.value.x}px`,
    top: `${position.value.y}px`,
    width: '280px',
    height: '380px',
    borderRadius: '6px' /* 从12px改为6px */
  };
});

// 方法
const toggleMinimize = () => {
  isMinimized.value = !isMinimized.value;
  saveSettings();
};

const handleClose = () => {
  if (isDocked.value) {
    // 如果是停靠状态，点击X回到悬浮状态
    isDocked.value = false;
    dockedPosition.value = 'float';

    // 设置悬浮窗位置为屏幕中间
    const centerX = (window.innerWidth - 280) / 2; // 280是悬浮窗宽度
    const centerY = (window.innerHeight - 380) / 2; // 380是悬浮窗高度
    position.value = {
      x: Math.max(20, Math.min(window.innerWidth - 300, centerX)), // 确保不超出边界
      y: Math.max(20, Math.min(window.innerHeight - 400, centerY)) // 确保不超出边界
    };

    // 发射停靠状态变化事件
    emit('dock-change', {
      isDocked: false,
      position: 'float',
      width: 0
    });

    // 强制触发重新渲染，确保悬浮状态下的按钮可见
    nextTick(() => {
      // 触发一个小的位置调整来强制重新渲染
      const currentX = position.value.x;
      position.value.x = currentX + 1;
      nextTick(() => {
        position.value.x = currentX;
      });
    });
  } else {
    // 如果是悬浮状态，最小化
    isMinimized.value = !isMinimized.value;
  }
  saveSettings();
};

const handleDockSelect = (key: string) => {
  dockedPosition.value = key as any;
  isDocked.value = key !== 'float';

  // 发射停靠状态变化事件
  emit('dock-change', {
    isDocked: isDocked.value,
    position: dockedPosition.value,
    width: isDocked.value ? 350 : 0
  });

  saveSettings();
};



const startDrag = (e: MouseEvent) => {
  if (isDocked.value) return;

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
  const elementWidth = isMinimized.value ? 60 : 280;
  const elementHeight = isMinimized.value ? 60 : 380;

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
    isDocked: isDocked.value,
    dockedPosition: dockedPosition.value,
    position: position.value
  };
  localStorage.setItem('chatWindowSettings', JSON.stringify(settings));
};

const loadSettings = () => {
  const saved = localStorage.getItem('chatWindowSettings');
  if (saved) {
    try {
      const settings = JSON.parse(saved);
      isMinimized.value = settings.isMinimized !== undefined ? settings.isMinimized : false; // 默认展开
      isDocked.value = settings.isDocked !== undefined ? settings.isDocked : true; // 默认停靠
      dockedPosition.value = settings.dockedPosition || 'left'; // 默认左侧

      // 验证保存的位置是否在当前屏幕范围内
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

      // 如果加载时是停靠状态，发射事件通知父组件
      if (isDocked.value) {
        emit('dock-change', {
          isDocked: true,
          position: dockedPosition.value,
          width: 350
        });
      }
    } catch (e) {
      console.error('Failed to load chat window settings:', e);
      // 出错时也使用默认的停靠左侧状态
      isMinimized.value = false;
      isDocked.value = true;
      dockedPosition.value = 'left';
      position.value = getInitialPosition();

      emit('dock-change', {
        isDocked: true,
        position: 'left',
        width: 350
      });
    }
  } else {
    // 没有保存的设置时，使用默认的停靠左侧状态
    // 确保状态正确设置
    isMinimized.value = false;
    isDocked.value = true;
    dockedPosition.value = 'left';

    emit('dock-change', {
      isDocked: true,
      position: 'left',
      width: 350
    });
  }
};

// 窗口大小变化处理
const handleResize = () => {
  if (!isDocked.value) {
    // 确保窗口仍在可见范围内
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
  }
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
  width: 280px;
  height: 380px;
  background: white;
  border-radius: 6px; /* 从12px改为6px，更锋利 */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  pointer-events: auto;
  transition: all 0.3s ease;
  /* 确保边框内容完全对齐 */
  box-sizing: border-box;
}

.chat-window.docked {
  border-radius: 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  margin: 0 !important;
  padding: 0 !important;
  box-sizing: border-box !important;
  display: flex !important;
  flex-direction: column !important;
}

.chat-window.docked-left {
  border-top-right-radius: 6px; /* 从12px改为6px */
  border-bottom-right-radius: 6px; /* 从12px改为6px */
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
}

.chat-window.docked-right {
  border-top-left-radius: 6px; /* 从12px改为6px */
  border-bottom-left-radius: 6px; /* 从12px改为6px */
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
}



.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 17px 16px; /* 增加2px高度：从16px改为17px */
  color: white;
  cursor: move;
  user-select: none;
  min-height: 58px; /* 增加2px高度：从56px改为58px */
  box-sizing: border-box;
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
  min-height: 0; /* 确保flex子元素能够正确收缩 */
  border-bottom-left-radius: inherit;
  border-bottom-right-radius: inherit;
  margin: 0;
  padding: 0;
  background: transparent;
  position: relative;
}

/* 确保内部的 ChatWindow 组件完全填充，没有间隙 */
.chat-content > * {
  height: 100%;
  width: 100%;
  border-radius: inherit;
  margin: 0;
  padding: 0;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

/* 停靠模式下的聊天内容区域 */
.chat-window.docked .chat-content {
  flex: 1;
  overflow: hidden;
  height: auto;
}

/* 确保停靠模式下没有多余的边距和填充 */
.chat-window.docked {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 确保聊天窗口内容完全填充 */
.chat-window.docked > * {
  box-sizing: border-box !important;
}

/* 强制移除任何可能的边距和填充 */
.chat-window.docked,
.chat-window.docked * {
  margin: 0 !important;
  box-sizing: border-box !important;
}

/* 确保聊天窗口组件本身填充整个容器 */
.chat-window.docked .chat-window {
  height: 100% !important;
  min-height: 100% !important;
  max-height: 100% !important;
}

/* 专门针对停靠模式的强制样式重置 */
.floating-chat-window.docked {
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
  outline: none !important;
  box-sizing: border-box !important;
  overflow: hidden !important;
}

.floating-chat-window.docked-left {
  left: 0 !important;
  right: auto !important;
  border-right: 2px solid v-bind(borderColor) !important;
}

.floating-chat-window.docked-right {
  right: 0 !important;
  left: auto !important;
  border-left: 2px solid v-bind(borderColor) !important;
}

.mr-2 {
  margin-right: 8px;
}
</style>
