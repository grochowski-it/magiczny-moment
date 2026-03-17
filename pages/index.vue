<template>
  <main class="bg-gray-900 text-accent">
    <ContentRenderer :value="page" class="content-grid contents" />
  </main>
</template>

<script setup lang="ts">
const { data: page } = await useAsyncData('index-page', () => {
  return queryCollection('content').path('/').first()
})
</script>
