<template>
  <main class="bg-gray-900 text-accent">
    <ContentRenderer :value="page" class="content-grid contents" />
  </main>
</template>

<script setup lang="ts">
const { data: page } = await useAsyncData('index-page', () => {
  return queryCollection('content').path('/').first()
})

useSeoMeta({
  title: 'Magiczny Moment Event — atrakcje na imprezy',
  description: 'Wynajem atrakcji na imprezy: fotobudka 360, zimne ognie, ciężki dym, banki mydlane i inne efekty, które sprawią, że Twoje wydarzenie będzie niezapomniane.'
})
</script>
