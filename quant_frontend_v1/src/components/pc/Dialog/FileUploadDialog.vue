<template>
    <el-dialog
      v-model="visible"
      title="文件导入"
      width="500px"
    >
      <el-upload
        drag
        action="#"
        :auto-upload="false"
        :on-change="handleChange"
        accept=".xlsx,.csv"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            支持扩展名：.xlsx / .csv
          </div>
        </template>
      </el-upload>
    </el-dialog>
  </template>
  
  <script setup lang="ts">
  // 类似实现上传逻辑...
  </script>