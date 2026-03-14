<template>
  <main class="content-grid">
    <Navigation />
    <GenericOffer v-if="section" class="full-width" :title="section.title" :image="section.meta.image" :content="section.meta.content" :price="section.meta.price" />
  </main>
</template>

<script setup lang="ts">

const route = useRoute()

const { data: section } = await useAsyncData('offerpreview', async () => {
  return queryCollection('oferta').path(route.path).first()
})

</script>
