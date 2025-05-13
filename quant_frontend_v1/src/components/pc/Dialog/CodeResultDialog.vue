<template>
    <el-dialog
      v-model="visible"
      title="识别结果"
      width="600px"
    >
      <el-table :data="data" height="400px">
        <el-table-column prop="code" label="代码" width="120" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="match" label="匹配方式" width="120" />
      </el-table>
      
      <template #footer>
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认导入</el-button>
      </template>
    </el-dialog>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    data: any[]
  }>()
  
  const emit = defineEmits(['update:modelValue', 'confirm'])
  const visible = useModel()
  
  const handleConfirm = () => {
    emit('confirm', data.value)
    visible.value = false
  }
  </script>