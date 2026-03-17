<template>
  <figure class="relative h-section md:!h-screen overflow-hidden bg-gray-800 bg-cover">
    <video autoplay muted loop
      class="absolute top-0 left-0 object-cover object-center w-screen h-screen md:object-t30 full-width">
      <source src="/public/filmik_glowna.mp4" type="video/mp4">
      Your browser does not support the video tag.
    </video>
    <!-- Background Image -->


    <!-- Centered Text Content -->
    <div class="relative z-10 flex flex-col items-center justify-center h-full px-4 md:pb-0 text-shadow-lg">
      <!-- <NuxtImg src=" /LOGO.png" alt="Logo" class="size-[400px] mx-auto mb-4 object-contain" /> -->
      <h1 v-if="h1?.length > 0"
        class="text-center text-6xl md:text-[100px] leading-[1em] text-accent font-[eternals-universe]">
        {{ h1 }}
      </h1>
      <div class="text-center text-2xl md:text-4xl text-accent font-[eternals-universe]">{{ sub }}</div>
      <NuxtLink :to="`#${link}`"
        class="self-center px-6 py-3 mt-24 font-semibold text-gray-900 rounded-full shadow-[0px_0px_20px_rgba(0,0,0,0.7)] bg-accent hover:bg-accent-600">
        Zobacz więcej
      </NuxtLink>
    </div>
  </figure>
</template>

<script setup lang="ts">
defineProps({
  image: String,
  h1: String,
  sub: String,
  link: String
})
</script>