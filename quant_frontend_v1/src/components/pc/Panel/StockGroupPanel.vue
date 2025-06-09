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
            <div class="group-left">
              <el-icon class="group-icon">
                <FolderOpened />
              </el-icon>
              <div class="group-info">
                <span class="group-name">{{ group.name }}</span>
                <span class="group-count">{{ group.items?.length || 0 }}项</span>
              </div>
            </div>
            <div class="group-actions">
              <el-tooltip content="编辑" placement="top">
                <el-button :icon="EditPen" link size="small" @click="handleEditGroup(group)">
                </el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button :icon="Delete" link size="small" @click="handleDeleteGroup(group)">
                </el-button>
              </el-tooltip>
            </div>
          </div>
        </template>
        <div v-if="group.items && group.items.length > 0" class="group-list">
          <div v-for="stock in group.items" :key="stock.id" class="group-item">
            <div class="item-info">
              <div class="item-left">
                <el-tooltip content="查看详情" placement="top" v-if="stock.notes">
                  <el-button :icon="ArrowDown" link size="small" @click.stop="toggleNotes(stock)"
                    :class="{ 'expanded': stock.showDetail }"></el-button>
                </el-tooltip>
                <div v-else class="placeholder-icon"></div>
                <div class="item-content">
                  <div class="item-name">{{ stock.name }}</div>
                  <div class="item-code">{{ stock.customData.code }}.{{ stock.customData.market }}</div>
                </div>
              </div>
              <div class="item-actions">
                <el-tooltip content="编辑" placement="top">
                  <el-button :icon="stock.isEditing ? Check : Edit" link size="small"
                    @click.stop="handleEditGroupItem(group, stock)">
                  </el-button>
                </el-tooltip>
                <el-tooltip content="删除" placement="top">
                  <el-button :icon="Delete" link size="small" @click.stop="handleDeleteGroupItem(group, stock)">
                  </el-button>
                </el-tooltip>
              </div>
            </div>
            <transition name="slide">
              <div v-show="stock.showDetail" class="item-notes" v-if="stock.notes">
                <div class="notes-label">备注</div>
                <div class="notes-text">{{ stock.notes }}</div>
              </div>
            </transition>
          </div>
        </div>
        <div v-else class="empty-state">
          <el-icon class="empty-icon"><DocumentRemove /></el-icon>
          <div class="empty-text">暂无股票</div>
        </div>
      </el-card>
    </div>
    <div class="panel-footer">
      <el-button type="primary" @click="handleAddGroup" class="add-group-btn" :icon="Plus">
        添加分组
      </el-button>
    </div>
  </div>
   <CustomPanelDialog
      v-if="showPanelDialog"
      v-model="showPanelDialog"
      :form-type="panelFormType"
      :form-data="panelFormData"
      :form-fields="panelFormFields"
      :container-mode="'container'"
      @submit="handleFormSubmit"
    />
</template>

<style lang="scss" scoped>
.drawer-panel.stock-group-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #fff;
}

::v-deep(.el-drawer__body) {
  padding-top: 0px !important;
}

.panel-header {
  padding: 16px 12px;
  background: #ffffff;
  position: sticky;
  top: 0;
  z-index: 10;

  .search-input {
    width: 100%;

    :deep(.el-input__wrapper) {
      border-radius: 8px;
      border: 1px solid #dcdfe6;
      transition: border-color 0.2s;

      &:hover {
        border-color: #c0c4cc;
      }

      &.is-focus {
        border-color: #409eff;
      }
    }

    :deep(.el-input__inner) {
      padding-left: 12px !important;
      font-size: 14px;

      &::placeholder {
        color: #a8abb2;
        font-size: 13px;
      }
    }
  }
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: #f5f7fa;
  }

  &::-webkit-scrollbar-thumb {
    background: #c0c4cc;
    border-radius: 2px;

    &:hover {
      background: #909399;
    }
  }
}

.group {
  margin-bottom: 12px;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  background: #ffffff;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  :deep(.el-card__header) {
    padding: 12px;
    background: #f8f9fa;
    border-bottom: 1px solid #e4e7ed;
  }

  :deep(.el-card__body) {
    padding: 0;
  }
}

.group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  .group-left {
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;
    gap: 8px;
  }

  .group-icon {
    color: #409eff;
    font-size: 16px;
    flex-shrink: 0;
  }

  .group-info {
    flex: 1;
    min-width: 0;
  }

  .group-name {
    display: block;
    font-weight: 600;
    color: #303133;
    font-size: 14px;
    line-height: 1.2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .group-count {
    display: block;
    font-size: 11px;
    color: #909399;
    margin-top: 2px;
  }

  .group-actions {
    display: flex;
    gap: 2px;
    flex-shrink: 0;

    .el-button {
      padding: 2px;
      color: #909399;

      &:hover {
        color: #409eff;
      }
    }
  }
}

.group-list {
  .group-item {
    padding: 8px 12px;
    border-bottom: 1px solid #f0f2f5;
    transition: background-color 0.2s;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background: #f5f9ff;
    }
  }
}

.item-info {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;

  .item-left {
    display: flex;
    align-items: flex-start;
    flex: 1;
    min-width: 0;
    gap: 4px;
  }

  .placeholder-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }

  .el-button {
    padding: 2px;
    color: #909399;
    flex-shrink: 0;
    margin-top: 1px;

    &:hover {
      color: #409eff;
    }

    &.expanded {
      transform: rotate(180deg);
      color: #409eff;
    }
  }

  .item-content {
    flex: 1;
    min-width: 0;
  }

  .item-name {
    font-size: 13px;
    color: #303133;
    font-weight: 500;
    line-height: 1.3;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 2px;
  }

  .item-code {
    font-size: 11px;
    color: #909399;
    background: #f5f7fa;
    padding: 1px 4px;
    border-radius: 3px;
    display: inline-block;
    line-height: 1.2;
  }

  .item-actions {
    display: flex;
    gap: 2px;
    flex-shrink: 0;

    .el-button {
      padding: 2px;
      margin-top: 0;
    }
  }
}

.item-notes {
  margin-top: 8px;
  padding: 0 24px 0 24px;

  .notes-label {
    font-size: 11px;
    color: #409eff;
    font-weight: 600;
    margin-bottom: 4px;
  }

  .notes-text {
    font-size: 12px;
    color: #606266;
    line-height: 1.4;
    background: #f8f9fa;
    padding: 8px 10px;
    border-radius: 6px;
    border-left: 3px solid #409eff;
    word-break: break-word;
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  max-height: 120px;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 12px;
  text-align: center;

  .empty-icon {
    font-size: 32px;
    color: #c0c4cc;
    margin-bottom: 8px;
  }

  .empty-text {
    color: #909399;
    font-size: 13px;
  }
}

.panel-footer {
  padding: 12px;
  background: #ffffff;
  // border-top: 1px solid #e4e7ed;
  position: sticky;
  bottom: 0;
  z-index: 10;

  .add-group-btn {
    width: 100%;
    height: 36px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
  }
}

/* 窄屏优化 */
@media (max-width: 320px) {
  .panel-header {
    padding: 12px 8px;
  }

  .panel-content {
    padding: 8px;
  }

  .panel-footer {
    padding: 8px;
  }

  .group {
    margin-bottom: 8px;

    :deep(.el-card__header) {
      padding: 8px;
    }
  }

  .group-list .group-item {
    padding: 6px 8px;
  }

  .item-name {
    font-size: 12px !important;
  }

  .item-code {
    font-size: 10px !important;
  }

  .item-notes {
    padding: 0 20px 0 20px;

    .notes-text {
      padding: 6px 8px;
      font-size: 11px;
    }
  }
}

/* 极窄屏优化 */
@media (max-width: 280px) {
  .group-header {
    .group-name {
      font-size: 13px;
    }

    .group-count {
      font-size: 10px;
    }
  }

  .item-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;

    .item-left {
      width: 100%;
    }

    .item-actions {
      align-self: flex-end;
    }
  }
}
</style>
<script lang="ts" setup>
import { ref, watch, toRefs, defineProps, defineEmits, nextTick } from 'vue';
import { FolderOpened, EditPen, Delete, Plus, Edit, ChatLineSquare, Check, ArrowDown, DocumentRemove } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import homeApi from '@/api/homeApi';
import CustomPanelDialog from "./CustomPanelDialog.vue";
const showPanelDialog = ref(false)
const panelFormType = ref('editGroup')
const panelFormData = ref({});
const panelFormFields = ref([]);
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
  showDetail?: boolean;
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
  'addGroupItem',
  'deleteStock',
  'editStock',
  'saveStockNote'
]);
const { stockGroupsData } = toRefs(props);
const localStockGroups = ref<StockGroup[]>([]);
const searchKeywordInput = ref('');

watch(stockGroupsData, (newData) => {
  localStockGroups.value = JSON.parse(JSON.stringify(newData)).map((group: StockGroup) => ({
    ...group,
    items: group.items.map((item: StockItem) => ({
      ...item,
      isEditing: item.isEditing ?? false, // 保留原有状态或初始化为 false
      showDetail: item.showDetail ?? false // 保留原有状态或初始化为 false
    }))
  }));
}, { immediate: true, deep: true });
const handleSearchInput = (keyword: string | number) => {
  emit('search', { keyword: keyword });
};
const toggleNotes = (stock: StockItem) => {
  if (!stock.showDetail) {
    // 第一次访问初始化 showDetail
    stock.showDetail = true;
  } else {
    stock.showDetail = !stock.showDetail;
  }
};
// 添加分组（打开弹窗）
const handleAddGroup = () => {
  openPanelDialog(
    'addGroup',
    { groupName: '新分组' },
    [{ key: 'groupName', label: '分组名称', type: 'input' }]
  );
};
// 删除分组
const handleDeleteGroup = (group: StockGroup) => {
  emit('deleteGroup', { groupId: group.id });
};
// 编辑分组（打开弹窗）
const handleEditGroup = (group: StockGroup) => {
  openPanelDialog(
    'editGroup',
    { groupId: group.id, groupName: group.name },
    [{ key: 'groupName', label: '分组名称', type: 'input' }]
  );
};
// 添加分组项（打开弹窗）
const handleAddGroupItem = (group: StockGroup) => {
  emit('addGroupItem', { groupId: group.id });
};
// 删除分组项
const handleDeleteGroupItem = (group: StockGroup, item: StockItem) => {
  emit('deleteStock', { groupId: group.id, stockId: item.id });
};
// 编辑分组项（打开弹窗）
const handleEditGroupItem = (group: StockGroup, item: StockItem) => {
  openPanelDialog(
    'editItem',
    { groupId: group.id, itemId: item.id, itemName: item.name, notes: item.notes },
    [
      { key: 'itemName', label: '股票名称', type: 'input' },
      { key: 'notes', label: '备注', type: 'textarea' }
    ]
  );
};

// 打开弹窗
const openPanelDialog = (formType: string, data: any, fields: any) => {
  panelFormType.value = formType;
  panelFormData.value = { ...data };
  panelFormFields.value = fields;
  showPanelDialog.value = true;
};
// 提交处理
const handleFormSubmit = (obj: {formType: string; data: any }) => {
  console.log('handleFormSubmit', obj.formType, obj.data)
  if (obj.formType === 'editGroup') {
    emit('editGroup', obj.data);
  } else if (obj.formType === 'editItem') {
    emit('editStock', obj.data);
  } else if (obj.formType === 'addGroup') {
    emit('addGroup', obj.data);
  } else if (obj.formType === 'addItem') {
    emit('addGroupItem', obj.data);
  }
  showPanelDialog.value = false;
};
</script>
