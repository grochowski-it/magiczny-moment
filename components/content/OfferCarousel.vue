<template>
  <div class="flex flex-col justify-end w-full py-4 md:justify-center h-section md:!h-screen full-width content-grid" id="oferta">
    <div class="col-span-full md:col-auto md:col-start-2">
      <h1 class="mb-8 text-4xl font-bold leading-snug md:text-6xl px-4 md:px-0">Oferta</h1>
      <div class="relative w-full px-4 md:px-0">
        <div class="overflow-hidden w-full" ref="emblaRef" v-if="offers && offers.length">
          <div class="flex h-[calc(var(--section-height)*0.7)] gap-4 md:gap-16">
            <template v-for="(offer, index) in offers" :key="offer.path">
              <div class="flex-[0_0_70%] md:flex-[0_0_calc(50%-2rem)] min-w-0">
                <Card :image="offer.meta.image" :title="offer.title" :content="offer.meta.content" :link="offer.path"
                  :class="{ 'mr-4 md:mr-16': index == offers?.length - 1 }" />
              </div>
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