<script setup lang="ts">
import draggable from 'vuedraggable'
import Favicon from './Favicon.vue'
import type { Group, Site } from '@/stores/site'

const modalStore = useModalStore()
const siteStore = useSiteStore()
const route = useRoute()

function handleSiteClick(url: string, groupIndex: number, siteIndex: number, e: Event) {
  if (route.name === 'setting') {
    e.preventDefault()
    modalStore.showModal('update', 'site', groupIndex, siteIndex)
  }
}

function handleGroupClick(groupIndex: number) {
  if (route.name === 'setting') {
    modalStore.showModal('update', 'group', groupIndex)
  }
}

const addGroupVisible = computed(() => route.name === 'setting' && siteStore.data.length > 0)
const { draggableOptions, handleStart, handleEnd } = useDrag()

const settingStore = useSettingStore()
const renderStore = useRenderStore()
</script>

<template>
  <section :key="renderStore.siteGroupListKey" :class="{'group__setting--all': settingStore.isSetting}" py-28 text-14 md="text-15 pt-28" lg="text-15 pt-28">
    <draggable
      :list="siteStore.data[siteStore.cateIndex].groupList"
      item-key="id"
      handle=".group__handle"
      drag-class="dragging"
      :component-data="{
        tag: 'div',
        type: 'transition-group',
      }"
      v-bind="draggableOptions"
      @start="handleStart"
      @end="handleEnd"
    >
      <template #item="{ element: group, index: i }: { element: Group, index: number }">
        <div class="group__header--mobile" flex style="align-items: center;">
          <!-- Group header -->
          <div flex class="group__header--all">
            <span class="group__handle" @click="handleGroupClick(i)" :class="{
                'cursor-pointer': settingStore.isSetting,
                'group__header--setting': settingStore.isWhiteTheme,
                'group__header--setting--colorful': !settingStore.isWhiteTheme,
                'site--setting': settingStore.isSetting,
              }" shrink-0 px-0 py-4 whitespace-nowrap text-14 md="text-15" lg="text-15" op-80 overflow-hidden>
              {{ group.name }}
            </span>
          </div>
          <!-- Group content -->
          <div flex class="group__content--all">
            <draggable
              :list="siteStore.data[siteStore.cateIndex].groupList[i].siteList"
              item-key="id"
              group="site"
              handle=".site__handle"
              drag-class="dragging"
              :component-data="{
                tag: 'div',
                type: 'transition-group',
                class: 'grid gap-8 grid-cols-3 md:gap-12 lg:gap-12 xl:gap-12 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-6',
              }"
              v-bind="draggableOptions"
              @start="handleStart"
              @end="handleEnd"
              flex
              style="flex: 0 0 100%;"
            >
              <template #item="{ element: site, index }: { element: Site, index: number }">
                <div>
                  <!-- Site item -->
                  <a
                    class="site__handle"
                    :class="{ 'site--setting': settingStore.isSetting, 'hover:bg-$site-hover-c': !settingStore.isDragging }"
                    :href="site.url" target="_blank"
                    inline-flex cursor-pointer items-center gap-x-4 px-4 py-4 max-w-100p
                    @click="e => handleSiteClick(site.url, i, index, e)"
                    style="margin: 0 2px;"
                  >
                    <Favicon class="shrink-0" :site="site" :site-index="index" :group-index="i" />
                    <span whitespace-nowrap text-14 md="text-15" lg="text-15" overflow-hidden>{{ site.name }}</span>
                  </a>
                </div>
              </template>
              <template #footer>
                <div v-if="!settingStore.isDragging && settingStore.isSetting && siteStore.data[siteStore.cateIndex].groupList[i].siteList.length < 6" min-h-32>
                  <n-button class="h-full" type="primary" secondary :focusable="false" @click="modalStore.showModal('add', 'site', i)">
                    <template #icon>
                      <div i-carbon:add />
                    </template>
                  </n-button>
                </div>
              </template>
            </draggable>
          </div>
        </div>
      </template>
    </draggable>
    <!-- Add group button -->
    <div v-if="addGroupVisible" my-12>
      <n-button type="primary" secondary w-full :focusable="false" @click="modalStore.showModal('add', 'group')">
        <template #icon>
          <div i-carbon:add />
        </template>
      </n-button>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.site--setting {
  border: 1px dashed var(--setting-border-c);
  border-radius: 2px;
}

.group__header--setting {
  background-color: var(--setting-group-bg-c);
  color: var(--text-c);
  margin: 0 2px;
  padding: 4px;
  font-size: 14px;
  border-radius: 2px;
}

.group__header--setting--colorful {
  background-color: var(--setting-group-bg-c);
  color: var(--primary-c);
  margin: 0 2px;
  padding: 4px;
  font-size: 14px;
  border-radius: 2px;
}

.group__header--all {
  max-width: 10%;
  overflow: hidden;
  align-items: center;
  flex: 0 0 10%;
}

.site--setting:hover {
  background-color: var(--site-hover-c);
}

.group__content--all {
  flex: 0 0 90%;
  max-width: 90%;
}

.group__header--mobile {
  margin-bottom: 10rem;
}

@media screen and (max-width: 767px) {
  .group__header--all {
    max-width: 15%;
    flex: 0 0 15%;
  }

  .group__content--all {
    flex: 0 0 85%;
    max-width: 85%;
  }

  .group__header--mobile {
    margin-bottom: 16px;
  }

  .group__setting--all {
    padding-top: 3.5rem;
  }
}
</style>
