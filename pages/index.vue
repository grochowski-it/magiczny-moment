<template>
  <main class="bg-gray-900 content-grid text-accent">
    <Navigation />
    <ContentRenderer v-if="page" :value="page" />
  </main>
</template>

<script setup lang="ts">
const { data: page } = await useAsyncData('index-page', () => {
  return queryCollection('content').path('/').first()
})
</script>
