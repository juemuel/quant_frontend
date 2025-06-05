<template>
  <div>
    <!-- 侧边工具栏 -->
    <div class="side-toolbar-container">
      <!-- 工具栏主体 -->
      <div class="toolbar-wrapper" :class="{ collapsed: isCollapsed }">
        <div class="toolbar-items">
          <div v-for="(item, index) in toolbarItems" :key="index" class="toolbar-item"
            :class="{ active: activeItem === item.key }" @click="handleItemClick(item)">
            <el-tooltip :content="item.tooltip" placement="left" :show-after="300">
              <div class="item-content">
                <el-badge :value="item.key === 'notification' ? unreadCount : null" :max="99" type="danger">
                  <el-icon class="item-icon">
                    <component :is="item.icon" />
                  </el-icon>
                </el-badge>
                <span class="item-label">{{ item.label }}</span>
              </div>
            </el-tooltip>
          </div>
        </div>
        <!-- 折叠按钮放到工具栏内部 -->
        <div class="collapse-btn-wrapper" @click="toggleCollapse">
          <el-button class="collapse-btn" :icon="ArrowRight" :class="{ rotated: isCollapsed }" />
        </div>
      </div>
    </div>
    <!-- 抽屉内容 -->
    <el-drawer v-model="drawerVisible" :title="activeDrawerTitle" :size="400" direction="rtl" class="toolbar-drawer"
      :before-close="handleDrawerClose" :modal="true" :append-to-body="true" :with-header="true" destroy-on-close>
      <!-- 日志面板 -->
      <div v-if="activeItem === 'logs'" class="drawer-panel">
        <el-card v-for="(log, index) in logs" :key="index" class="log-item">
          <div class="log-header">
            <span class="log-title">{{ log.title }}</span>
            <span class="log-time">{{ log.time }}</span>
          </div>
          <p class="log-content">{{ log.content }}</p>
        </el-card>
      </div>
      <!-- 通知面板 -->
      <div v-if="activeItem === 'notification'" class="drawer-panel">
        <el-card v-for="(notification, index) in notifications" :key="index" class="notification-item"
          :class="{ unread: !notification.read }">
          <div class="notification-content">
            <el-icon class="notification-icon">
              <Bell />
            </el-icon>
            <div class="notification-details">
              <h3 class="notification-title">{{ notification.title }}</h3>
              <p class="notification-text">{{ notification.content }}</p>
              <span class="notification-time">{{ notification.time }}</span>
            </div>
          </div>
        </el-card>
      </div>
      <!-- 分组管理面板 -->
      <div v-if="activeItem === 'groups'" class="drawer-panel">
        <StockGroupPanel :stock-groups-data="stockGroups"
          @add-group="onAddGroup" @delete-group="onDeleteGroup" @edit-group="onEditGroup"
          @add-stock-to-group="onAddStockToGroup" @delete-stock="onDeleteStock" @edit-stock="onEditStock"
          @search="onSearchGroupList"
        />
      </div>
    </el-drawer>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import homeApi from '@/api/homeApi';
import { useRoute } from 'vue-router';
import StockGroupPanel from './Panel/StockGroupPanel.vue';
import {
  Document,
  Bell,
  FolderOpened,
  ArrowLeft,
  ArrowRight
} from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import http from '@/api/http';

interface ToolbarItem {
  key: string;
  label: string;
  icon: any;
  tooltip: string;
}
interface StockItem {
  id: number;
  groupId: number;
  name: string;
  notes: string | null;
  customData: {
    code: string;
    market: string;
  };
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  tags: any[];
}
interface StockGroup {
  id: number;
  typeCode: string;
  name: string;
  sortOrder: number;
  ownerId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  items: StockItem[];
}
const route = useRoute()

// 自动关闭抽屉逻辑
watch(() => route.path, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    drawerVisible.value = false
  }
})
// 状态管理
const drawerVisible = ref(false);
const activeItem = ref('');
const unreadCount = ref(5);
const isCollapsed = ref(false);
// 工具栏数据
const toolbarItems: ToolbarItem[] = [
  { key: 'logs', label: '日志记录', icon: Document, tooltip: '查看系统日志' },
  { key: 'notification', label: '通知中心', icon: Bell, tooltip: '查看通知消息' },
  { key: 'groups', label: '分组管理', icon: FolderOpened, tooltip: '管理分组' }
];

// 分组数据
const stockGroups = ref<StockGroup[]>([
  {
    id: 1,
    typeCode: "stock",
    name: "我的股票",
    sortOrder: 0,
    ownerId: 1,
    isActive: true,
    createdAt: "2025-05-26T15:46:04.000+0000",
    updatedAt: "2025-05-26T15:50:07.000+0000",
    items: [
      {
        id: 1,
        groupId: 1,
        name: "阿里巴巴",
        notes: null,
        customData: {
          code: "09988",
          market: "hk"
        },
        sortOrder: 0,
        isActive: true,
        createdAt: "2025-05-26T15:53:51.000+0000",
        updatedAt: "2025-05-26T15:53:51.000+0000",
        tags: []
      }
    ]
  },
  {
    id: 2,
    typeCode: "stock",
    name: "我的指数",
    sortOrder: 0,
    ownerId: 1,
    isActive: true,
    createdAt: "2025-05-26T15:51:21.000+0000",
    updatedAt: "2025-05-26T15:51:21.000+0000",
    items: []
  }
]);
// 日志数据
const logs = ref([
  {
    title: '系统更新',
    time: '2024-01-15 14:30:25',
    content: '系统完成安全更新，新增多项安全防护功能'
  },
  {
    title: '用户登录',
    time: '2024-01-15 13:25:18',
    content: '用户 Michael Johnson 在新设备上完成登录'
  },
  {
    title: '数据备份',
    time: '2024-01-15 12:00:00',
    content: '系统自动完成数据备份，存储容量剩余 1.2TB'
  }
]);
// 通知数据
const notifications = ref([
  {
    title: '项目进度提醒',
    content: 'AI 助手功能开发已完成 85%，请及时检查确认',
    time: '10 分钟前',
    read: false
  },
  {
    title: '系统维护通知',
    content: '系统将于今晚 23:00 进行例行维护，预计持续 2 小时',
    time: '30 分钟前',
    read: true
  },
  {
    title: '团队会议提醒',
    content: '下午 15:00 将召开本周进度评审会议',
    time: '2 小时前',
    read: true
  }
]);
// 计算属性
const activeDrawerTitle = computed(() => {
  return toolbarItems.find(item => item.key === activeItem.value)?.label || '';
});
// 方法
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
  // 如果收起侧边栏，同时关闭抽屉
  if (isCollapsed.value && drawerVisible.value) {
    drawerVisible.value = false;
  }
};
const handleItemClick = (item: ToolbarItem) => {
  // 如果点击当前已激活的项，则关闭抽屉
  if (activeItem.value === item.key && drawerVisible.value) {
    drawerVisible.value = false;
    return;
  }
  activeItem.value = item.key;
  drawerVisible.value = true;
  // 如果是通知中心，点击后重置未读数
  if (item.key === 'notification') {
    unreadCount.value = 0;
    // 将所有通知标记为已读
    notifications.value.forEach(notification => {
      notification.read = true;
    });
  }
};
const handleDrawerClose = (done: () => void) => {
  activeItem.value = '';
  done();
};
// 监听抽屉关闭事件
watch(drawerVisible, (newVal) => {
  if (!newVal) {
    // 抽屉关闭时取消激活状态
    activeItem.value = '';
  }
});

// 事件处理方法 (从 StockGroupPanel 接收事件)
const onAddGroup = async (newGroup: StockGroup) => {
  try {
    const response = await homeApi.createGroup({
      typeCode: newGroup.typeCode,
      name: newGroup.name,
      ownerId: newGroup.ownerId
    });
    console.log('Group created:', response);

    if (response && response.id) {
      stockGroups.value.push(response);
    } else {
      ElMessage.error('创建分组失败');
    }
  } catch (error) {
    console.error('Error creating group:', error);
    ElMessage.error('创建分组失败');
  }
};

const onEditGroup = async (groupToEdit: StockGroup) => {
  console.log('edit')
};
const onDeleteGroup = async (groupToDelete: StockGroup) => {
  try {
    const response = await homeApi.deleteGroup({
      groupId: groupToDelete.id,
      ownerId: groupToDelete.ownerId
    });
    console.log('Group deleted:', response);

    stockGroups.value = stockGroups.value.filter(g => g.id !== groupToDelete.id);
    ElMessage.success('分组删除成功');
  } catch (error) {
    console.error('Error deleting group:', error);
    ElMessage.error('删除分组失败');
  }
};
const onAddStockToGroup = async (stockItem: StockItem) => {
  try {
    const response = await homeApi.addGroupItem({
      groupId: stockItem.groupId,
      itemName: stockItem.name,
      customData: stockItem.customData,
      ownerId: localStorage.getItem('ownerId') || '',
    });
    console.log('Stock added to group:', response);
    const group = stockGroups.value.find(g => g.id === stockItem.groupId);
    if (group && response && response.id) {
      group.items.push(response);
      ElMessage.success('股票添加成功');
    }
  } catch (error) {
    console.error('Error adding stock to group:', error);
    ElMessage.error('添加股票失败');
  }
};
const onEditStock = async (stockItem: StockItem) => {
  console.log('Event: Edit stock in GlobalSideToolbar', stockItem.name);
};
const onDeleteStock = async (stockItem: StockItem) => {
  try {
    const response = await homeApi.deleteGroupItem({
      itemId: stockItem.id,
      ownerId: localStorage.getItem('ownerId') || ''
    });
    console.log('Stock deleted:', response);

    const group = stockGroups.value.find(g => g.id === stockItem.groupId);
    if (group) {
      group.items = group.items.filter(s => s.id !== stockItem.id);
      ElMessage.success('股票删除成功');
    }
  } catch (error) {
    console.error('Error deleting stock:', error);
    ElMessage.error('删除股票失败');
  }
};
const onSearchGroupList = async (keyValue: string) => {
  try {
    const response = await homeApi.getGroupList({
      userId: parseInt(localStorage.getItem('userId') || '1'),
      typeCode: 'stock'
    });
    console.log('Group list:', response);

    if (response && response.length > 0) {
      stockGroups.value = response;
    } else {
      ElMessage.error('分组列表为空');
    }
  } catch (error) {
    console.error('Error fetching group list:', error);
  }
};

</script>
<style scoped>
/* 侧边工具栏容器 */
.side-toolbar-container {
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
}

/* 工具栏主体 */
.toolbar-wrapper {
  position: relative;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: -2px 0 12px rgba(0, 0, 0, 0.08);
  border-radius: 8px 0 0 8px;
  padding: 16px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
}

/* 工具栏折叠状态 */
.toolbar-wrapper.collapsed {
  transform: translateX(100%);
}

/* 折叠按钮容器 */
.collapse-btn-wrapper {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%) translateX(-100%);
  z-index: 1010;
}

/* 折叠按钮 */
.collapse-btn {
  height: 80px;
  width: 28px;
  padding: 0;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px 0 0 8px;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.collapse-btn:hover {
  background: #f5f7fa;
}

/* .collapse-btn.rotated i {
  transform: rotate(180deg);
}
.collapse-btn i {
  transition: transform 0.3s;
} */
:deep(.collapse-btn i) {
  transition: transform 0.2s;
}

:deep(.collapse-btn.rotated i) {
  transform: rotate(180deg);
}
/* 工具栏项目 */
.toolbar-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.toolbar-item {
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 6px;
  padding: 6px;
}

.toolbar-item:hover {
  background-color: rgba(64, 158, 255, 0.1);
}

.toolbar-item.active {
  color: #409eff;
  background-color: rgba(64, 158, 255, 0.1);
}

/* 项目内容 */
.item-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.item-icon {
  font-size: 22px;
  padding: 6px;
  border-radius: 6px;
  transition: color 0.3s;
}

.item-label {
  font-size: 12px;
  color: #606266;
  white-space: nowrap;
}

/* 抽屉面板 */
:deep(.toolbar-drawer .el-drawer__header) {
  margin-bottom: 0;
  padding: 16px 20px;
  border-bottom: 1px solid #ebeef5;
}

:deep(.toolbar-drawer .el-drawer__body) {
  padding: 0;
  /* 移除内边距，因为 StockGroupPanel 自己有 .drawer-panel */
  overflow-y: auto;
}

.drawer-panel {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 100%;
  background-color: #f5f7fa;
}

/* 日志项 */
.log-item {
  margin-bottom: 12px;
  transition: transform 0.2s;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.log-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.log-title {
  font-weight: 500;
  color: #303133;
}

.log-time {
  font-size: 12px;
  color: #909399;
}

.log-content {
  color: #606266;
  font-size: 14px;
  line-height: 1.6;
}

/* 通知项 */
.notification-item {
  margin-bottom: 12px;
  transition: all 0.2s;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.notification-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.notification-item.unread {
  border-left: 3px solid #f56c6c;
}

.notification-content {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.notification-icon {
  font-size: 18px;
  color: #409eff;
  background-color: rgba(64, 158, 255, 0.1);
  padding: 8px;
  border-radius: 50%;
}

.notification-details {
  flex: 1;
}

.notification-title {
  font-size: 14px;
  font-weight: 500;
  margin: 0 0 6px 0;
  color: #303133;
}

.notification-text {
  font-size: 13px;
  color: #606266;
  margin: 0 0 8px 0;
  line-height: 1.6;
}

.notification-time {
  font-size: 12px;
  color: #909399;
  display: block;
  text-align: right;
}

/* 响应式适配 */
@media (max-width: 640px) {
  .item-label {
    display: none;
  }

  .item-icon {
    font-size: 20px;
    padding: 4px;
  }

  .toolbar-wrapper {
    padding: 12px 6px;
  }

  .toolbar-items {
    gap: 16px;
  }

  :deep(.toolbar-drawer .el-drawer) {
    width: 85% !important;
  }

  .collapse-btn {
    height: 60px;
    width: 24px;
  }
}
</style>
