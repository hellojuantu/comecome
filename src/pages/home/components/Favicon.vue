<script setup lang="ts">
import type { PropType } from 'vue'
import { getFaviconUrl, getRandomDarkColor } from '@/utils'
import { Site } from '@/types';

const props = defineProps({
  site: {
    type: Object as PropType<Site>,
    required: true,
  },
  siteIndex: {
    type: Number,
    required: true,
  },
  groupIndex: {
    type: Number,
    required: true,
  },
})

const siteStore = useSiteStore()

const { iconStyle } = useIconStyle()

const isGen = ref(false)
const isLoading = ref(true)

function handleFaviconError(site: Site) {
  isGen.value = true
  siteStore.setGroupIndex(props.groupIndex)
  siteStore.setSiteIndex(props.siteIndex)
  if (site.bgColor)
    return
  siteStore.updateSite({
    ...site,
    bgColor: getRandomDarkColor(),
  })
}
</script>

<template>
  <div :style="iconStyle" h-18 w-18 md="h-22 w-22" lg="h-22 w-22">
    <img
      v-if="!isGen"
      :src="site.favicon || getFaviconUrl(site.url)"
      h-full w-full
      decoding="async"
      loading=lazy
      @error="handleFaviconError(site)"
      @onload="isLoading"
    >
    <div v-else :style="{ backgroundColor: site.bgColor }" h-full w-full flex-center scale-112 rounded-full text="white sm">
      {{ site.name.length > 0 ? site.name.toLocaleUpperCase().charAt(0) : 'c'}}
    </div>
  </div>
</template>
