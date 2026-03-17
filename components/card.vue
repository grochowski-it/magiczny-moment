<template>
  <figure class="card">
    <NuxtImg width="500" class="object-cover w-full h-full object-t30" :src="image" />
    <div
      class="absolute bottom-0 flex flex-row items-start justify-center w-full gap-2 p-4 md:justify-end md:flex-col h-fit md:h-2/6 bg-gray-900/80 md:bg-gradient-to-t md:from-gray-900/90 md:to-transparent">
      <h2 class="text-2xl font-bold">{{ title }}</h2>
      <div class="hidden md:inline-block line-clamp-4">{{ content }}</div>
      <NuxtLink :to="link"
        class="inline-flex items-center self-end gap-2 px-4 py-2 text-gray-900 rounded-full cursor-pointer w-content bg-accent">
        <span class="hidden md:block">Zobacz więcej</span>
        <Icon class="inline-block" name="icon-park-outline:arrow-right" />
      </NuxtLink>
    </div>
  </figure>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'

const props = defineProps({
  title: String,
  content: String,
  image: {
    type: String,
    default: 'https://place-hold.it/500x500'
  },
  link: String
})

const { title, content, image, link } = toRefs(props)
</script>

<style scoped>
.shine {
  @apply mix-blend-lighten bg-gradient-to-br from-[#d5cfbd] via-transparent to-transparent absolute top-0 left-0 w-full h-full opacity-50;
}

.card {
  @apply overflow-hidden relative select-none bg-gradient-to-br from-[#424249] via-gray-800 to-gray-800 rounded-xl;
}
</style>