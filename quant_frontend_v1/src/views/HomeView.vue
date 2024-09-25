<template>
  <div class="page">
    <img alt="Vue logo" src="../assets/logo.png">
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HomeView'
})
</script>

<style scoped lang="scss">
.page {
  height: calc(100vh - 45px);
}
</style>
