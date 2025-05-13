<template>
    <el-dialog
      v-model="visible"
      title="图片识别"
      width="500px"
    >
      <el-upload
        drag
        action="#"
        :auto-upload="false"
        :on-change="handleChange"
        accept="image/*"
      >
        <img v-if="preview" :src="preview" class="preview-image">
        <template v-else>
          <el-icon class="el-icon--upload"><picture /></el-icon>
          <div class="el-upload__text">
            将图片拖到此处，或<em>点击上传</em>
          </div>
        </template>
      </el-upload>
    </el-dialog>
  </template>
  
  <script setup lang="ts">
  // 类似实现图片上传预览逻辑...
  </script>