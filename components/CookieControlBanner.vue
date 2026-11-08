<template>
  <div
    v-if="showBanner"
    class="fixed z-[60] bottom-4 right-4 max-w-sm rounded-xl bg-gray-900 text-accent p-4 shadow-xl border border-accent/20"
    role="region"
    aria-label="Informacja o plikach cookies"
  >
    <p class="text-sm mb-3">
      Używamy plików cookies, aby strona działała poprawnie. Więcej informacji znajdziesz w
      <NuxtLink to="/polityka-prywatnosci" class="underline">Polityce prywatności</NuxtLink>.
    </p>
    <div class="flex flex-wrap gap-2">
      <button
        type="button"
        class="px-3 py-1.5 rounded bg-accent text-gray-900 text-sm font-bold"
        @click="acceptAll"
      >
        Akceptuję wszystkie
      </button>
      <button
        type="button"
        class="px-3 py-1.5 rounded border border-accent text-sm"
        @click="acceptNecessary"
      >
        Tylko niezbędne
      </button>
      <button
        type="button"
        class="px-3 py-1.5 rounded border border-accent text-sm"
        @click="openSettings"
      >
        Ustawienia
      </button>
    </div>
  </div>

  <div
    v-if="showSettings"
    class="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4"
    role="dialog"
    aria-modal="true"
    aria-label="Ustawienia cookies"
  >
    <div class="bg-gray-900 text-accent rounded-xl p-6 max-w-md w-full">
      <h2 class="text-lg font-bold mb-3">Ustawienia cookies</h2>
      <p class="text-sm mb-4">Wybierz, które pliki cookies mogą być używane. Pliki cookies są zapisywane wyłącznie po wyrażeniu zgody.</p>
      <label class="flex items-start gap-2 mb-3 opacity-60">
        <input type="checkbox" checked disabled />
        <span class="text-sm">Wymagane (zawsze aktywne)</span>
      </label>
      <label class="flex items-start gap-2 mb-3">
        <input type="checkbox" v-model="consentAnalytics" />
        <span class="text-sm">Analityczne</span>
      </label>
      <label class="flex items-start gap-2 mb-6">
        <input type="checkbox" v-model="consentMarketing" />
        <span class="text-sm">Marketingowe</span>
      </label>
      <div class="flex gap-2">
        <button
          type="button"
          class="px-3 py-1.5 rounded bg-accent text-gray-900 text-sm font-bold"
          @click="saveSettings"
        >
          Zapisz wybór
        </button>
        <button
          type="button"
          class="px-3 py-1.5 rounded border border-accent text-sm"
          @click="showSettings = false"
        >
          Anuluj
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCookie } from '#app'

const showBanner = ref(false)
const showSettings = ref(false)
const consentAnalytics = ref(false)
const consentMarketing = ref(false)

const consentCookie = useCookie('ncc_c', { default: () => '', maxAge: 60 * 60 * 24 * 365, path: '/' })

function applyConsent() {
  consentCookie.value = JSON.stringify({ analytics: consentAnalytics.value, marketing: consentMarketing.value })
  showBanner.value = false
  showSettings.value = false
}
function acceptAll() {
  consentAnalytics.value = true
  consentMarketing.value = true
  applyConsent()
}
function acceptNecessary() {
  consentAnalytics.value = false
  consentMarketing.value = false
  applyConsent()
}
function openSettings() {
  showBanner.value = false
  showSettings.value = true
}
function saveSettings() {
  applyConsent()
}

onMounted(() => {
  if (!consentCookie.value) {
    showBanner.value = true
  }
})
</script>
