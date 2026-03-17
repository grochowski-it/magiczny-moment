<template>
  <div class="flex flex-col justify-end w-full py-4 md:justify-center h-section">
    <h1 class="mb-8 text-4xl font-bold leading-snug md:text-6xl">Oferta</h1>
    <div class="relative w-full embla">
        <div class="overflow-hidden w-full embla__viewport" ref="emblaRef">
          <div
            v-if="offers?.length"
            class="flex h-[calc(var(--section-height)*0.7)] gap-4 md:gap-16 embla__container">
            <template v-for="(offer, index) in offers" :key="offer.path">
              <div class="flex-[0_0_70%] md:flex-[0_0_calc(50%-2rem)] min-w-0 embla__slide">
                <Card :image="offer.image || offer.meta?.image" :title="offer.title || offer.meta?.title" :content="offer.content || offer.meta?.content" :link="offer.path"
                  :class="{ 'mr-4 md:mr-16': index == offers.length - 1 }" />
              </div>
            </template>
          </div>
        </div>
        <button class="hidden md:block absolute transform -translate-y-1/2 top-1/2 left-[-5ch] embla__prev" @click="scrollPrev">
          <Icon name="icon-park-outline:arrow-left" />
        </button>
        <button class="hidden md:block absolute transform -translate-y-1/2 top-1/2 right-[-5ch] embla__next" @click="scrollNext">
          <Icon name="icon-park-outline:arrow-right" />
        </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import emblaCarouselVue from 'embla-carousel-vue'
const [emblaRef, emblaApi] = emblaCarouselVue({ loop: true , align: 'center', watchSlides:true})

const { data: offers } = await useAsyncData('oferta', () => {
  return queryCollection('oferta').all()
})

const scrollNext = () => {
  emblaApi.value?.scrollNext()
}

const scrollPrev = () => {
  emblaApi.value?.scrollPrev()
}
</script>
<style lang="css">
.embla__container {
touch-action: pan-y pinch-zoom;
}
</style>