<template>
  <div class="drawer-panel stock-group-panel">
    <div class="panel-header">
      <el-input v-model="searchKeywordInput" placeholder="搜索分组名称或股票名称/代码" clearable prefix-icon="Search"
        class="search-input" @input="handleSearchInput" />
    </div>
    <div class="panel-content">
      <el-card v-for="group in localStockGroups" :key="group.id" class="group" shadow="never">
        <template #header>
          <div class="group-header">
            <el-icon class="action-icon">
              <FolderOpened />
            </el-icon>
            <span class="group-name">{{ group.name }}</span>
            <div class="group-actions">
              <el-tooltip content="编辑分组" placement="top">
                <el-button :icon="EditPen" type="text" size="small" @click="handleEditGroup(group)">
                </el-button>
              </el-tooltip>
              <el-tooltip content="删除分组" placement="top">
                <el-button :icon="Delete" type="text" size="small" @click="handleDeleteGroup(group)">
                </el-button>
              </el-tooltip>
              <el-tooltip content="添加股票" placement="top">
                <el-button :icon="Plus" type="text" size="small" @click="handleAddStockToGroup(group)">
                </el-button>
              </el-tooltip>
            </div>
          </div>
        </template>
        <div v-if="group.items && group.items.length > 0" class="group-list">
          <div v-for="stock in group.items" :key="stock.id" class="group-item"
            :class="{ 'is-editing-notes': editingNotesInfo.groupId === group.id && editingNotesInfo.stockId === stock.id }">
            <div class="item-info">
              <span class="item-name">{{ stock.name }}</span>
              <span class="item-code">{{ stock.customData.code }}.{{ stock.customData.market }}</span>
              <div class="item-actions">
                <el-tooltip content="编辑股票" placement="top">
                  <el-button
                    :icon="stock.isEditing ? Check : Edit"
                    type="text"
                    size="small"
                    @click.stop="handleGroupItemEdit(group, stock)"
                  >
                  </el-button>
                </el-tooltip>
                <el-tooltip content="删除股票" placement="top">
                  <el-button :icon="Delete" type="text" size="small" @click.stop="handleDeleteStock(group, stock)">
                  </el-button>
                </el-tooltip>
              </div>
            </div>
          </div>
        </div>
        <el-empty v-else description="暂无股票" :image-size="60"></el-empty>
      </el-card>
    </div>
    <div class="panel-footer">
      <el-button type="primary" @click="handleAddGroup" class="add-group-btn" :icon="Plus">添加分组</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
// ... existing code ...
import { ref, watch, toRefs, defineProps, defineEmits, nextTick } from 'vue';
import { FolderOpened, EditPen, Delete, Plus, Edit, ChatLineSquare, Check } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import homeApi from '@/api/homeApi';

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
  // 额外增加字段
  isEditing?: boolean;
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
  'search',
  'addGroup',
  'deleteGroup',
  'editGroup',

  'addStockToGroup',
  'deleteStock',
  'editStock',
  'saveStockNote'
]);

const notesInputRefs = ref<Record<string, any>>({});
const editingNotesInfo = ref<{
  groupId: number | null;
  stockId: number | null;
}>({ groupId: null, stockId: null });

const { stockGroupsData } = toRefs(props);
const localStockGroups = ref<StockGroup[]>([]);
const searchKeywordInput = ref('');

watch(stockGroupsData, (newData) => {
  localStockGroups.value = JSON.parse(JSON.stringify(newData)).map((group: StockGroup) => ({
    ...group,
    items: group.items.map((item: StockItem) => ({
      ...item,
      isEditing: item.isEditing ?? false // 保留原有状态或初始化为 false
    }))
  }));
}, { immediate: true, deep: true });
const handleGroupItemEdit = (group: StockGroup, item: StockItem) => {
  const isCurrentlyEditing = !!item.isEditing;
  // const isActiveNoteEditor = editingNotesInfo.value.groupId === group.id && editingNotesInfo.value.stockId === stock.id;
  if (isCurrentlyEditing) {
    // 当前是编辑状态，执行保存
    handleSaveStock(group, item);
  } else {
    toggleItemEditorDialog(group, item);
    nextTick(() => {
      item.isEditing = true;
    });
  }
};
const handleSearchInput = (value: string | number) => {
  emit('search', String(value));
};
const handleAddGroup = () => {
  emit('addGroup');
};
const handleDeleteGroup = (group: StockGroup) => {
  emit('deleteGroup', { groupId: group.id });
};
const handleEditGroup = (group: StockGroup) => {
  emit('editGroup', { groupId: group.id, currentName: group.name });
};

const handleAddStockToGroup = (group: StockGroup) => {
  emit('addStockToGroup', { groupId: group.id });
};

const handleSaveStock = (group: StockGroup, item: StockItem) => {
  emit('editStock', { groupId: group.id, stockId: item.id, currentStock: item });
};

const handleDeleteStock = (group: StockGroup, item: StockItem) => {
  emit('deleteStock', { groupId: group.id, stockId: item.id });
};
const toggleItemEditorDialog = async (group: StockGroup, item: StockItem, forceShow = false) => {
 console.log('open ItemEditDialog')
};
</script>

<style lang="scss" scoped>
.drawer-panel.stock-group-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f8fafc;
}

::v-deep(.el-drawer__body){
  padding-top: 0px !important;
}
.panel-header {
  padding: 10px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 10;

  .search-input {
    width: 100%;

    :deep(.el-input__wrapper) {
      border-radius: 18px;
      box-shadow: 0 0 0 1px #e4e7ed;

      &:hover {
        box-shadow: 0 0 0 1px #c0c4cc;
      }
    }
  }
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  background: linear-gradient(to bottom, #f8fafc 0%, #ffffff 100%);
}

.group {
  margin-bottom: 16px;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #e4e7ed;
  background: #fff;

  &:hover {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    border-color: #d4d9e2;
  }

  :deep(.el-card__header) {
    padding: 12px 16px;
    background: #f9fafc;
    border-bottom: 1px solid #e4e7ed;
  }

  :deep(.el-card__body) {
    padding: 0;
  }
}

.group-header {
  display: flex;
  align-items: center;
  padding-right: 8px;

  .action-icon {
    color: #409eff;
    font-size: 18px;
    margin-right: 8px;
  }

  .group-name {
    flex: 1;
    font-weight: 600;
    color: #303133;
    font-size: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .group-actions {
    display: flex;
    gap: 4px;

    .el-button {
      padding: 6px;
      color: #909399;

      &:hover {
        color: #409eff;
        background: rgba(64, 158, 255, 0.1);
      }
    }
  }
}

.group-list {
  .group-item {
    padding: 12px 16px;
    border-bottom: 1px solid #f0f2f5;
    transition: background 0.2s;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background: #f5f9ff;
    }

    &.is-editing-notes {
      background: #f0f7ff;
    }
  }
}

.item-info {
  display: flex;
  align-items: center;
  gap: 8px;

  .item-name {
    flex: 1;
    font-size: 14px;
    color: #303133;
    font-weight: 500;
  }

  .item-code {
    font-size: 12px;
    color: #909399;
    background: #f5f7fa;
    padding: 2px 6px;
    border-radius: 4px;
  }

  .item-actions {

    .el-button {
      padding: 4px;
      color: #909399;
      &:hover {
        color: #409eff;
      }
    }
  }
}

.el-empty {
  padding: 24px 0;

  :deep(.el-empty__description) {
    color: #909399;
  }
}

.panel-footer {
  padding: 12px 16px;
  background: #fff;
  border-top: 1px solid #e4e7ed;
  position: sticky;
  bottom: 0;
  z-index: 10;

  .add-group-btn {
    width: 100%;
    border-radius: 6px;
    height: 40px;
    font-weight: 500;
  }
}

/* 响应式调整 */
@media (max-width: 768px) {

  .panel-header,
  .panel-content,
  .panel-footer {
    padding: 12px;
  }

  .group-header .group-actions .el-button {
    padding: 4px;
  }

  .item-info {
    flex-wrap: wrap;

    .item-code {
      order: 1;
      width: 100%;
      margin-top: 4px;
      margin-left: 0;
    }

    .item-actions {
      opacity: 1;
    }
  }
}
</style>
