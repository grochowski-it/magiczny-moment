<template>
  <main class="content-grid">
    <Navigation />
    <GenericOffer class="full-width" v-bind="{...section, ...section?.meta}" />
  </main>
</template>

<script setup lang="ts">
import { defineService, defineOffer, defineBreadcrumb } from 'nuxt-schema-org/schema'

const route = useRoute()

const { data: section } = await useAsyncData(`offerpreview-${route.path}`, () => {
  return queryCollection('oferta').path(route.path).first()
})

// SEO meta from the offer's frontmatter
useSeoMeta({
  title: () => section.value?.title ? `${section.value.title} | Magiczny Moment Event` : 'Magiczny Moment Event — atrakcje na imprezy',
  description: () => section.value?.content || 'Wynajem atrakcji na imprezy: fotobudka 360, zimne ognie, ciężki dym, banki mydlane.'
})

// Schema.org - Service + Offer for this offer (data from frontmatter)
useSchemaOrg([
  defineService({
    name: section.value?.title,
    description: section.value?.content,
    image: section.value?.image,
    url: `https://mm-event.pl${route.path}`
  }),
  defineOffer({
    price: section.value?.price,
    priceCurrency: 'PLN',
    availability: 'https://schema.org/InStock',
    url: `https://mm-event.pl${route.path}`
  }),
  defineBreadcrumb({
    itemListElement: [
      { name: 'Strona główna', item: 'https://mm-event.pl/' },
      { name: 'Oferta', item: 'https://mm-event.pl/#oferta' },
      { name: section.value?.title || 'Oferta', item: `https://mm-event.pl${route.path}` }
    ]
  })
])
</script>
