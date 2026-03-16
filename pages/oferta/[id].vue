<template>
  <main class="content-grid">
    <Navigation />
    <GenericOffer class="full-width" v-bind="{...section, ...section?.meta}" />
  </main>
</template>

<script setup lang="ts">

const route = useRoute()

const { data: section } = await useAsyncData(`offerpreview-${route.path}`, () => {
  return queryCollection('oferta').path(route.path).first()
})

</script>