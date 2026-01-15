<template>
  <main class="content-grid">
    <Navigation />
    <GenericOffer 
      v-if="section" 
      class="full-width" 
      v-bind="section.fields" 
    />
  </main>
</template>

<script setup lang="ts">
const route = useRoute()

// W v3 używamy queryCollection
const { data: section } = await useAsyncData('offerpreview', () => 
  queryCollection('oferta')
    .where('path', 'LIKE', `%${route.params.id}%`) // Odpowiednik { $contains: route.params.id }
    .first() // Odpowiednik findOne()
)
</script>