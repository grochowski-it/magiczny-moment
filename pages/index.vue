<template>
  <main class="bg-gray-900 content-grid text-accent">
    <Navigation />
    <Witamy class="full-width" v-bind="witamy" id="witamy" link="oferta" />
    <OfferCarousel :offers="offers" id="oferta" />
    <Contact :title="contact?.title" id="kontakt" class="full-width">
      <ContentRenderer v-if="contact" class="flex flex-col gap-4" :value="contact" />
    </Contact>
  </main>
</template>

<script setup lang="ts">


const { data: offers } = await useAsyncData('offers', async () => {
  const items = await queryCollection('oferta').all();
  return items.map(item => ({
    ...item,
    link: item.path
  }));
});
const { data: witamy } = await useAsyncData('witamy', async () => {
  return await queryCollection('content').path('/witamy').first();
});
const { data: contact } = await useAsyncData('contact', async () => {
  return await queryCollection('content').path('/kontakt').first();
});
</script>
