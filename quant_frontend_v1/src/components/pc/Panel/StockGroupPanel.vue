<template>
    <div class="drawer-panel stock-group-panel">
    <el-button type="primary" @click="handleAddGroup" class="add-group-btn">添加分组</el-button>
    <el-card
      v-for="(group, groupIndex) in localStockGroups"
      :key="group.id"
      class="group-item"
      shadow="never"
    >
      <template #header>
        <div class="group-header">
          <el-icon class="group-icon"><FolderOpened /></el-icon>
          <span class="group-name">{{ group.name }}</span>
          <div class="group-actions">
            <el-tooltip content="编辑分组" placement="top"><el-button icon="EditPen" type="text" size="small" @click="handleEditGroup(groupIndex)"></el-button></el-tooltip>
            <el-tooltip content="删除分组" placement="top"><el-button icon="Delete" type="text" size="small" @click="handleDeleteGroup(groupIndex)"></el-button></el-tooltip>
            <el-tooltip content="添加股票" placement="top"><el-button icon="Plus" type="text" size="small" @click="handleAddStockToGroup(groupIndex)"></el-button></el-tooltip>
          </div>
        </div>
      </template>
      <div v-if="group.items && group.items.length > 0" class="stock-list">
        <div
          v-for="(stock, stockIndex) in group.items"
          :key="stock.id"
          class="stock-item"
          :class="{ 'is-editing-notes': editingNotesInfo.groupIndex === groupIndex && editingNotesInfo.stockIndex === stockIndex }"
          @click="toggleNotesEditor(groupIndex, stockIndex)"
        >
          <div class="stock-info">
            <span class="stock-name">{{ stock.name }}</span>
            <span class="stock-code">{{ stock.customData.code }}.{{ stock.customData.market }}</span>
            <div class="stock-item-actions">
                <el-tooltip content="编辑股票" placement="top"><el-button icon="Edit" type="text" size="small" @click.stop="handleEditStock(groupIndex, stockIndex)"></el-button></el-tooltip>
                <el-tooltip content="删除股票" placement="top"><el-button icon="Delete" type="text" size="small" @click.stop="handleDeleteStock(groupIndex, stockIndex)"></el-button></el-tooltip>
            </div>
          </div>
          <div v-if="editingNotesInfo.groupIndex === groupIndex && editingNotesInfo.stockIndex === stockIndex" class="stock-notes-editor" @click.stop>
            <el-input
              type="textarea"
              :rows="3"
              placeholder="添加或编辑笔记..."
              v-model="stock.notes"
              @blur="saveStockNoteOnBlur(groupIndex, stockIndex)"
              ref="notesInputRef"
            />
            <!-- <el-button size="small" type="primary" @click.stop="handleSaveNote(groupIndex, stockIndex)" class="save-note-btn">保存笔记</el-button> -->
          </div>
          <div v-else-if="stock.notes" class="stock-notes-preview" @click.stop="toggleNotesEditor(groupIndex, stockIndex, true)">
            <el-icon ><ChatLineSquare /></el-icon> {{truncateNotes(stock.notes)}}
          </div>
        </div>
      </div>
      <el-empty v-else description="暂无股票" :image-size="60"></el-empty>
    </el-card>
  </div>
  </template>
  <script lang="ts" setup>
  import { ref, watch, toRefs, defineProps, defineEmits, nextTick } from 'vue';
  import { FolderOpened, EditPen, Delete, Plus, Edit, ChatLineSquare } from '@element-plus/icons-vue'; // 引入所需图标
  // Interfaces (与 GlobalSideToolbar.vue 中的定义一致)
  interface StockItem {
    id: number;
    groupId: number;
    name: string;
    notes: string | null;
    customData: {
      code: string;
      market: string;
    };
    sortOrder?: number;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
    tags?: any[];
  }
  interface StockGroup {
    id: number;
    typeCode: string;
    name: string;
    sortOrder?: number;
    ownerId?: number;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
    items: StockItem[];
  }
  // Props
  const props = defineProps<{
    stockGroupsData: StockGroup[];
  }>();
  // Emits
  const emit = defineEmits([
    'addGroup',
    'editGroup',
    'deleteGroup',
    'addStockToGroup',
    'editStock',
    'deleteStock',
    'saveStockNote'
  ]);
  // 使用 ref 来创建 props 的本地副本，以便在组件内部修改（如果需要）
  // 或者直接使用 props.stockGroupsData，但要注意 props 是单向数据流
  // 为了简单起见，并且考虑到增删改查会直接修改数据源，这里创建一个本地可响应的副本
  const { stockGroupsData } = toRefs(props);
  const localStockGroups = ref<StockGroup[]>([]);
  watch(stockGroupsData, (newData) => {
    // 深拷贝以避免直接修改 prop
    localStockGroups.value = JSON.parse(JSON.stringify(newData));
  }, { immediate: true, deep: true });
// 笔记编辑状态管理
const editingNotesInfo = ref<{ groupIndex: number | null; stockIndex: number | null }>({ groupIndex: null, stockIndex: null });
const notesInputRef = ref<any>(null); // 用于聚焦笔记输入框
const toggleNotesEditor = async (groupIndex: number, stockIndex: number, forceOpen = false) => {
  if (editingNotesInfo.value.groupIndex === groupIndex && editingNotesInfo.value.stockIndex === stockIndex && !forceOpen) {
    // 如果当前编辑器已打开且不是强制打开，则关闭它 (保存逻辑在blur事件中)
    editingNotesInfo.value = { groupIndex: null, stockIndex: null };
  } else {
    // 打开新的或切换到另一个编辑器
    editingNotesInfo.value = { groupIndex, stockIndex };
    await nextTick(); // 等待DOM更新
    if (notesInputRef.value && notesInputRef.value[0]) { // ElInput 包裹了原生input, ref可能是数组
        notesInputRef.value[0].focus();
    }
  }
};

const saveStockNoteOnBlur = (groupIndex: number, stockIndex: number) => {
    // 延迟关闭，以便其他点击事件（如保存按钮，如果添加的话）可以触发
    // setTimeout(() => {
        if (editingNotesInfo.value.groupIndex === groupIndex && editingNotesInfo.value.stockIndex === stockIndex) {
            handleSaveNote(groupIndex, stockIndex);
            // editingNotesInfo.value = { groupIndex: null, stockIndex: null }; // 不在此处关闭，让toggleNotesEditor控制或保留打开状态直到用户点击别处
        }
    // }, 100); // 延迟时间可以调整
};

const truncateNotes = (notes: string | null, maxLength = 30) => {
  if (!notes) return '';
  return notes.length > maxLength ? notes.substring(0, maxLength) + '...' : notes;
};

// Methods (handleAddGroup, handleEditGroup, etc. 保持不变，但emit参数可能需要调整以传递ID而非索引)
const handleAddGroup = () => {
  const newGroup: StockGroup = {
    id: Date.now(),
    typeCode: 'stock',
    name: '新分组',
    items: []
  };
  localStockGroups.value.push(newGroup);
  emit('addGroup', newGroup);
};

const handleEditGroup = (groupIndex: number) => {
  emit('editGroup', localStockGroups.value[groupIndex]);
};

const handleDeleteGroup = (groupIndex: number) => {
  const groupToDelete = localStockGroups.value[groupIndex];
  localStockGroups.value.splice(groupIndex, 1);
  emit('deleteGroup', groupToDelete);
};

const handleAddStockToGroup = (groupIndex: number) => {
  const newStock: StockItem = {
    id: Date.now(),
    groupId: localStockGroups.value[groupIndex].id,
    name: '新股票',
    notes: '',
    customData: { code: '00000', market: 'sz' }
  };
  localStockGroups.value[groupIndex].items.push(newStock);
  emit('addStockToGroup', { groupId: localStockGroups.value[groupIndex].id, stockItem: newStock }); // 传递groupId
};

const handleEditStock = (groupIndex: number, stockIndex: number) => {
  emit('editStock', { stockItem: localStockGroups.value[groupIndex].items[stockIndex] }); // 只传递stockItem，父组件通过ID查找
};

const handleDeleteStock = (groupIndex: number, stockIndex: number) => {
  const stockToDelete = localStockGroups.value[groupIndex].items[stockIndex];
  localStockGroups.value[groupIndex].items.splice(stockIndex, 1);
  emit('deleteStock', { stockItem: stockToDelete }); // 只传递stockItem
};

const handleSaveNote = (groupIndex: number, stockIndex: number) => {
  const stock = localStockGroups.value[groupIndex].items[stockIndex];
  emit('saveStockNote', { stockItem: stock }); // 只传递stockItem
  // editingNotesInfo.value = { groupIndex: null, stockIndex: null }; // 保存后关闭编辑器
};
  </script>
  <style scoped>
  :deep(.el-icon) {
      font-size: 16px;
  }
  /* 抽屉面板 */
  .stock-group-panel {
  padding: 12px;
  gap: 10px;
}

.add-group-btn {
  margin-bottom: 10px;
  width: 100%;
}

.group-item {
  margin-bottom: 10px;
  border-radius: 4px;
  /* border: 1px solid #e0e0e0; */ /* 更轻的边框 */
}

:deep(.el-card__header) {
  padding: 8px 12px; /* 减小卡片头部内边距 */
  background-color: #f9f9f9;
  border-bottom: 1px solid #eee;
}

:deep(.el-card__body) {
  padding: 8px; /* 减小卡片主体内边距 */
}

.group-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.group-icon {
  font-size: 16px;
  color: #409eff;
}

.group-name {
  font-weight: 500;
  color: #303133;
  flex-grow: 1;
  font-size: 14px;
}

.group-actions .el-button {
  padding: 4px;
  font-size: 14px;
}

.stock-list {
  display: flex;
  flex-direction: column;
  gap: 6px; /* 减小股票项之间的间距 */
}

.stock-item {
  padding: 6px 8px;
  border: 1px solid #f0f0f0;
  border-radius: 3px;
  background-color: #fff;
  cursor: pointer;
  transition: background-color 0.2s, box-shadow 0.2s;
}

.stock-item:hover {
  background-color: #f7faff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.stock-item.is-editing-notes {
  background-color: #eef5ff; /* 编辑时高亮 */
  /* border-left: 3px solid #409eff; */
}

.stock-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  margin-bottom: 4px; /* 为可能的笔记预览留出空间 */
}

.stock-name {
  font-weight: 500;
  flex-grow: 1;
  color: #333;
}

.stock-code {
  font-size: 12px;
  color: #888;
  background-color: #f5f5f5;
  padding: 1px 4px;
  border-radius: 3px;
}

.stock-item-actions {
  display: flex;
}

.stock-item-actions .el-button {
  padding: 2px;
  font-size: 13px;
  margin-left: 4px;
}

.stock-notes-editor {
  margin-top: 6px;
}

.stock-notes-editor .el-textarea__inner {
  font-size: 12px;
  padding: 4px 6px;
}

.save-note-btn {
  margin-top: 4px;
  float: right;
}

.stock-notes-preview {
  font-size: 12px;
  color: #666;
  padding: 2px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.stock-notes-preview .el-icon {
  font-size: 12px;
}

.stock-notes-preview:hover {
  color: #409eff;
}

:deep(.el-empty__description) {
    font-size: 13px;
    margin-top: 8px;
}
  </style>
