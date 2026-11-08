<template>
  <nav
    class="fixed bottom-0 z-50 w-full h-[--menu-height] bg-gray-900 
    bg-gradient-to-l md:bg-transparent md:bg-gradient-to-b from-gray-900/80 to-transparent md:top-0 backdrop-blur-md md:backdrop-blur-0  md:shadow-none shadow-[0px_0px_10px_rgba(0,0,0,0.5)] content-grid">
    <ul
      class="flex items-center justify-center w-full gap-8 p-4 overflow-x-auto truncate md:p-0 md:justify-start whitespace-nowrap hide-scroll-bar"
      ref="menuContainer">
      <li class="inline-block" v-for="(section, index) in visibleArray" :key="section.id"
        :class="{ 'md:mr-auto': index === 0 }">
        <a :href="'/#' + section.id" class="link" :class="{ 'link-active': isActive(section.id) }"
          @click.prevent="scrollToElement(section.id)">
          <span v-if="index === 0">
            <span class="hidden md:inline-block font-[eternals-universe] text-4xl">
              Magiczny Moment Event
            </span>
            <span class="inline-block md:hidden">Początek</span>
          </span>
          <span v-else>{{ section.title }}</span>
        </a>
      </li>
      <li v-if="showDrawer" class="inline-block">
        <button type="button" class="h-full pointer-events-auto link" :aria-expanded="drawerVisiblity" aria-controls="drawer" @click="drawerVisiblity = !drawerVisiblity">
          Więcej
        </button>
      </li>
    </ul>
  </nav>

  <template v-if="showDrawer">
    <Transition enter-active-class="transition-transform duration-500"
      leave-active-class="transition-transform duration-500" enter-from-class="translate-x-full"
      enter-to-class="translate-x-0" leave-from-class="translate-x-0" leave-to-class="translate-x-full">
      <div v-if="drawerVisiblity"
        class="fixed z-[51] gap-8 right-0 top-0 flex flex-col justify-end flex-wrap whitespace-pre-line w-[300px] h-screen bg-gradient-to-b bg-gradient-to-b from-gray-900/80 to-gray-600/80 backdrop-blur-md p-8 shadow-drawer">
        <div v-for="(element) in asideArray" :key="element.id">
          <a :href="'/#' + element.id" class="self-start link" :class="{ 'link-active': isActive(element.id) }"
            @click.prevent="() => { scrollToElement(element.id); drawerVisiblity = !drawerVisiblity }">
            {{ element.title }}
          </a>
        </div>
        <div class="self-center inline link" @click="drawerVisiblity = !drawerVisiblity">
          <Icon name="icon-park-outline:close" class="inline-block text-xl size-6" />
        </div>
      </div>
    </Transition>
  </template>
</template>
<script setup lang="ts">
import { useRoute, useNuxtApp } from '#app';

const viewport = useViewport()
const route = useRoute();
const router = useRouter()

const props = defineProps({
  sections: {
    type: Array,
    default: () => [
      { id: 'witamy', title: 'Witamy' },
      { id: 'oferta', title: 'Oferta' },
      /*  { id: 'media', title: 'Media społecznościowe' }, */
      { id: 'kontakt', title: 'Kontakt' },
    ]
  }
});
const { sections } = toRefs(props);

const drawerVisiblity = ref(false);
const menuContainer = ref(null);

const visibleArray = ref([]);
const asideArray = ref([]);

watch(viewport.breakpoint, (newBreakpoint) => {
  let pointOfSplit
  if (['desktopWide', 'desktopMedium', 'desktop', 'tablet'].includes(newBreakpoint)) {
    pointOfSplit = sections.value.length
  } else if (['mobileWide', 'mobileMedium'].includes(newBreakpoint)) {
    pointOfSplit = 2
  }
  else {
    pointOfSplit = 1
  }

  visibleArray.value = sections.value.slice(0, pointOfSplit)
  asideArray.value = sections.value.slice(pointOfSplit, sections.value.length)
}, { immediate: true })


const showDrawer = computed(() => {
  return asideArray.value.length > 0
})

const isActive = (section) => {
  return route.hash === `#${section}`
}

const scrollToElement = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}
</script>

<style scoped>
.link {
  @apply inline-block font-bold cursor-pointer text-accent hover:text-accent-600 text-shadow-sm shadow-gray-500;
}

.link-active {
  @apply border-b-2 border-accent;

}

.shadow-drawer {
  box-shadow: 0px 0px 50px rgba(0, 0, 0, 0.8);
}

.hide-scroll-bar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.hide-scroll-bar::-webkit-scrollbar {
  display: none;
}
</style>