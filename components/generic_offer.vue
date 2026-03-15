<template>
  <section class="relative overflow-y-auto bg-gray-800 bg-cover isolate h-section md:!h-screen"
    :class="{ '!h-screen': isAnimation }">
    <NuxtImg :src="image" class="absolute top-0 left-0 z-10 object-cover object-left w-full h-full full-width" />

    <div class="z-20 flex flex-row items-center justify-center h-full p-4 text-center text-accent md:p-0 "
      :class="{ 'hidden': isAnimation }">

      <div
        class="flex flex-col gap-4 max-w-2xl p-8 mx-auto mb-8 text-lg text-left md:text-xl bg-gray-900/70 backdrop-blur-md rounded-xl shadow-[0px_0px_20px_rgba(0,0,0,0.7)]">
        <h2 class="mb-8 text-4xl font-bold !leading-snug md:text-6xl">
          {{ title }}
        </h2>
        <span>{{ content }}</span>
        <span class="text-xl font-bold">{{ price }}</span>

        <div class="flex flex-col items-end justify-end w-full gap-4 mt-6 md:items-center md:flex-row">
          <div class="inline-flex justify-between w-full ">
            <a href="/#oferta"
              class="flex items-center gap-2 px-6 py-3 font-semibold text-white rounded-full h-14 bg-accent hover:bg-accent-600 whitespace-nowrap">
              <Icon name="icon-park-outline:back" class="size-6" />
            </a>
            <a href="/#kontakt"
              class="flex items-center gap-2 px-6 py-3 font-semibold text-white rounded-full h-14 bg-accent hover:bg-accent-600 whitespace-nowrap">
              <Icon name="icon-park-outline:phone-outgoing" class="size-6" /> Skontaktuj się
            </a>
          </div>

        </div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps({
  image: String,
  title: String,
  content: String,
  price: String,
  isAnimation: Boolean
})
</script>