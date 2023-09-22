<script setup lang="ts">
import { RouterLink } from 'vue-router'

const route = useRoute()
const settingsActived = ref(false)

function toggleSetting() {
  return settingsActived.value = (route.path === '/setting')
}

function getIconClass(routeName: string) {
  return {
    'text-$primary-c opacity-100': routeName === route.name,
  }
}
</script>

<template>
  <div flex justify-between py-24 px="12 md:24 lg:48" :class="{'logo-head': 'logo_head'}">
    <RouterLink to="/">
      <div text="$primary-c" flex-center text-16 style='font-weight: bold;' >
        <img decoding="async" loading=lazy w-16 src="/favicon.png" inline-block text-32 transition duration-300 hover="opacity-70">
      </div>
    </RouterLink>
    <div flex gap-x-8>
      <RouterLink :class="getIconClass('setting')" :to="toggleSetting() ? '/' : '/setting'" i-carbon:settings icon-btn />
    </div>
  </div>
</template>
