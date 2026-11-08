<template>
  <div>
    <div class="fixed z-[52] bottom-8 right-8" id="animation-close"></div>
    <div id="popover"></div>
    <NuxtPage />
    <CookieControlBanner />
  </div>
</template>

<script setup lang="ts">
import CookieControlBanner from '~/components/CookieControlBanner.vue'
</script>

<style lang="css">
@import "./assets/styles/global.css";
</style>
