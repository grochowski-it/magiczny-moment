<template>
  <div class="flex flex-col justify-end w-full py-4 md:justify-center h-section">
    <h1 class="mb-8 text-4xl font-bold leading-snug md:text-6xl">Oferta</h1>
    <div class="relative">
      <div class="overflow-hidden" ref="emblaRef">
        <div
          class="grid auto-cols-[70%] md:auto-cols-[calc(50%-2rem)] h-[calc(var(--section-height)*0.7)] grid-flow-col gap-4 md:gap-16">
          <template v-for="(offer, index) in offers">
            <Card :image="offer.meta.image" :title="offer.title" :content="offer.meta.content" :link="offer.path"
              :class="{ 'mr-4 md:mr-16': index == offers.length - 1 }" />
          </template>
        </div>
      </div>
      <button class="hidden md:block absolute transform -translate-y-1/2 top-1/2 left-[-5ch]" @click="scrollPrev">
        <Icon name="icon-park-outline:arrow-left" />
      </button>
      <button class="hidden md:block absolute transform -translate-y-1/2 top-1/2 right-[-5ch]" @click="scrollNext">
        <Icon name="icon-park-outline:arrow-right" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import emblaCarouselVue from 'embla-carousel-vue'
const [emblaRef, emblaApi] = emblaCarouselVue({ loop: true })

const { data: offers } = await useAsyncData('offers', async () => {
  return queryCollection('oferta').all()
})

const scrollNext = () => {
  emblaApi.value?.scrollNext()
}

const scrollPrev = () => {
  emblaApi.value?.scrollPrev()
}


</script>