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
                <el-button :icon="EditPen" link size="small" @click="handleEditGroup(group)">
                </el-button>
              </el-tooltip>
              <el-tooltip content="删除分组" placement="top">
                <el-button :icon="Delete" link size="small" @click="handleDeleteGroup(group)">
                </el-button>
              </el-tooltip>
              <!-- 加到其他地方 -->
              <!-- <el-tooltip content="添加股票" placement="top">
                <el-button :icon="Plus" link size="small" @click="handleAddGroupItem(group)">
                </el-button>
              </el-tooltip> -->
            </div>
          </div>
        </template>
        <div v-if="group.items && group.items.length > 0" class="group-list">
          <div v-for="stock in group.items" :key="stock.id" class="group-item">
            <div class="item-info">
              <!-- 新增：notes 展示按钮 -->
              <el-tooltip content="查看详情" placement="top" v-if="stock.notes">
                <el-button :icon="ArrowDown" link size="small" @click.stop="toggleNotes(stock)"></el-button>
              </el-tooltip>
              <!-- 占位符：无 notes 时保留相同空间 -->
              <div v-else class="placeholder-icon"></div>
              <span class="item-name">{{ stock.name }}</span>
              <span class="item-code">{{ stock.customData.code }}.{{ stock.customData.market }}</span>
              <div class="item-actions">
                <el-tooltip content="编辑股票" placement="top">
                  <el-button :icon="stock.isEditing ? Check : Edit" link size="small"
                    @click.stop="handleEditGroupItem(group, stock)">
                  </el-button>
                </el-tooltip>
                <el-tooltip content="删除股票" placement="top">
                  <el-button :icon="Delete" link size="small" @click.stop="handleDeleteGroupItem(group, stock)">
                  </el-button>
                </el-tooltip>
              </div>
            </div>
            <!-- 展开内容区域 -->
            <transition name="slide">
              <div v-show="stock.showDetail" class="item-notes" v-if="stock.notes">
                <strong>备注：</strong>
                <p>{{ stock.notes }}</p>
              </div>
            </transition>
          </div>
        </div>
        <el-empty v-else description="暂无股票" :image-size="60"></el-empty>
      </el-card>
    </div>
    <div class="panel-footer">
      <el-button type="primary" @click="handleAddGroup" class="add-group-btn" :icon="Plus">添加分组</el-button>
      //TODO: 批量导入
    </div>
  </div>
   <!-- 支持container/fullscreen 模式 -->
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

<script lang="ts" setup>
import { ref, watch, toRefs, defineProps, defineEmits, nextTick } from 'vue';
import { FolderOpened, EditPen, Delete, Plus, Edit, ChatLineSquare, Check, ArrowDown } from '@element-plus/icons-vue';
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

<style lang="scss" scoped>
.drawer-panel.stock-group-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f8fafc;
}

::v-deep(.el-drawer__body) {
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
    :deep(.el-input__inner){
      padding-left: 15px !important;
    }
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
      padding: 2px;
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
    //TODO: 改成紧凑型的；调整padding
    padding: 12px 5px;
    border-bottom: 1px solid #f0f2f5;
    transition: background 0.2s;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background: #f5f9ff;
    }
    .item-notes {
      margin-left: 12px;
      padding: 8px 12px;
      margin-top: 4px;
      font-size: 13px;
      color: #666;
      line-height: 1.4;
      background-color: #fff; // 白底更清爽
      border-left: 2px solid #e4e7ed; // 左侧细条表示附加信息
      border-radius: 4px;

      strong {
        display: block;
        margin-bottom: 2px;
        color: #303133;
        font-weight: 600;
      }

      p {
        margin: 0;
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
      transform: translateY(-10px);
      max-height: 0;
    }
  }
}

.item-info {
  display: flex;
  align-items: center;
  gap: 4px;
  .placeholder-icon {
    width: 24px;
    height: 24px;
    // 与 el-button 大小一致，保持视觉对齐
  }

  .el-button {
    padding: 4px;
    color: #909399;

    &:hover {
      color: #409eff;
    }
  }
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
