<script setup lang="ts">
import MainLayout from './components/MainLayout.vue'
</script>

<template>
  <MainLayout>
    <RouterView />
  </MainLayout>
</template>

<style>
.layout-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

@media (max-width: 768px) {
  .layout-container {
    padding: 0 1rem;
  }
}
</style>
