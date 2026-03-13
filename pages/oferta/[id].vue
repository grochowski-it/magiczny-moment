<template>
  <main class="content-grid">
    <Navigation />
    <GenericOffer v-if="section" class="full-width" :title="section.title" :image="section.image" :content="section.content" :price="section.price" />
  </main>
</template>

<script setup lang="ts">

const route = useRoute()

const { data: section } = await useAsyncData('offerpreview', async () => {
  return queryCollection('oferta').path(route.path).first()
})

</script>