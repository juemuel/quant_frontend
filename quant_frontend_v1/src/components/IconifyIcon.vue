<template>
  <Icon :icon="icon" :width="width" :height="height" />
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { Icon } from "@iconify/vue";

defineProps<{
  icon: string;
  width?: number;
  height?: number;
}>();
</script>

<style scoped>
/* 可以在这里添加自定义样式 */
</style>
