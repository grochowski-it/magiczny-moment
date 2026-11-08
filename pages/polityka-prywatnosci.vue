<template>
  <main class="bg-gray-900 text-accent min-h-screen">
    <Navigation />
    <article class="content-grid max-w-3xl mx-auto py-24 px-4 prose prose-invert">
      <ContentRenderer v-if="doc" :value="doc" />
    </article>
  </main>
</template>

<script setup lang="ts">
const { data: doc } = await useAsyncData('privacy-policy', () => {
  return queryCollection('legal').path('/legal/polityka-prywatnosci').first()
})

useSeoMeta({
  title: 'Polityka prywatności (RODO) | Magiczny Moment Event',
  description: 'Informacje o przetwarzaniu danych osobowych zgodnie z Rozporządzeniem (UE) 2016/679 (RODO).'
})
</script>
