<template>
  <main class="bg-gray-900 content-grid text-accent">
    <Navigation />
    <ContentRenderer v-if="page" :value="page" />
  </main>
</template>

<script setup lang="ts">
const { data: page } = await useAsyncData('page', () => queryCollection('content').path('/').first())
</script>
