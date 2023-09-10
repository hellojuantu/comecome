<script setup lang="ts">
import SiteNavBar from './SiteNavBar.vue'
import SiteGroupList from './SiteGroupList.vue'
import SiteModal from './SiteModal.vue'
</script>

<template>
  <div px="md:24 lg:48" text="$text-c-1 dark:$text-dark-c-1" z-8>
    <SiteNavBar />
    <SiteGroupList />
    <SiteModal />
  </div>
</template>
