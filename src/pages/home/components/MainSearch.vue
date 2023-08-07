<script setup lang="ts">
import { vOnClickOutside } from '@vueuse/components'
import type { Search } from '@/utils'
import { getFaviconUrl, searchList } from '@/utils'
import searchEngine from '@/utils/search-engine';
import $_ from 'lodash'

const settingStore = useSettingStore()

// TODO 搜索词联想

const keyword = ref('')
// 从settings获取初始index
const currentIndex = ref(0)

const showKeyDownSel = ref(false)

const noticeKeyList = ref<string[]>([])

const selectedIndex = ref(0)

function initCurrentIndex() {
  currentIndex.value = searchList.findIndex(search => search.enName === settingStore.settings.search) || 0
}

watch(() => settingStore.settings.search, () => {
  initCurrentIndex()
}, { immediate: true })

function search() {
  if (!keyword.value.trim()) {
    return
  }
  const currentSearch = searchList[currentIndex.value]
  window.open(`${currentSearch.value.url}?${currentSearch.value.key}=${keyword.value}`)
  clearNoticeKey()
}

function _getFavicon(search: Search) {
  return search.favicon || getFaviconUrl(search.url)
}
function changeSearch(i: number) {
  currentIndex.value = i
  toggleSelection()
}

const selectionVisible = ref(false)

// Don't use 'useClickOutside' because it will still trigger the click event when the selection is closed
function toggleSelection() {
  selectionVisible.value = !selectionVisible.value
}

const { iconStyle } = useIconStyle()

const searchInputRef = ref<HTMLInputElement>()

function handleCloseClick() {
  keyword.value = ''
  searchInputRef.value?.focus()
}

function handleKeyDown(e: KeyboardEvent) {
  // const target = keyword.value.match(/^#[a-z]+/)
  // if (target && e.key === 'Tab') {
  //   e.preventDefault()
  //   const s = target[0].replace('#', '')
  //   const index = searchList.findIndex(item => item.value.s === s)
  //   if (index === -1) {
  //     return
  //   }
  //   currentIndex.value = index
  //   keyword.value = ''
  // }
}

function handleInput(e: Event) {
  if (!keyword.value.trim()) {
    clearNoticeKey() 
    return
  }
  showKeyDownSel.value = true
  selectedIndex.value = 0
  requestEngApi()
}

interface Params {
  eng: string,
  list: string[];
  wd: string,
}

let requestEngApi = $_.debounce(() => {
  const curSearch = searchList[currentIndex.value]
  searchEngine.complete(curSearch.enName, keyword.value, (params: Params) => {
    // console.log("params", params.list)
    if (keyword.value.trim().length === 0) {
      return
    }
    noticeKeyList.value.splice(0, noticeKeyList.value.length || 0)
    noticeKeyList.value.push(keyword.value, ...params.list)
  })
}, 100)

function jumpSearch(i: number) {
  keyword.value = noticeKeyList.value[i]
  search()
  // noticeKeyList.value.push(keyword.value)
}

function clearNoticeKey() {
  showKeyDownSel.value = false
  noticeKeyList.value.splice(0, noticeKeyList.value.length || 0)
  selectedIndex.value = 0
  noticeKeyList.value.push(keyword.value)
}

function keyNext(e: Event) {
  e.preventDefault()
  selectedIndex.value = (selectedIndex.value + 1) % noticeKeyList.value.length || 0
  keyword.value = noticeKeyList.value[selectedIndex.value]
  // console.log("keyNext", selectedIndex.value)
}

function keyPrev(e: Event) {
  e.preventDefault()
  selectedIndex.value = (selectedIndex.value - 1 + noticeKeyList.value.length) % noticeKeyList.value.length || 0
  keyword.value = noticeKeyList.value[selectedIndex.value]
  // console.log("keyPrev", selectedIndex.value)
}

function handleKeyRecomend(e: Event) {
  let clickedInput = e.target == searchInputRef.value
  if (clickedInput) {
    return
  }
  clearNoticeKey()
}

function handleHover(i: number) {
  selectedIndex.value = i
}
</script>

<template>
  <div my-24 flex-center>
    <div flex bg-gray-200 h-40 class="search" dark="bg-18181a" style="position: relative;">
      <div v-show="showKeyDownSel" v-on-click-outside="handleKeyRecomend" absolute z-9 class="search-sel" style="top: 100%; width: 100%; height: 10rem;">
        <!-- keys recommend -->
        <div z-9 bg-fff l-0 t-100p dark="border-grey-8 bg-18181a">
          <div v-for="(item, i) in noticeKeyList.slice(1)" :key="i + 1" text-14 p-5
            @mouseover="handleHover(i + 1)" @click="jumpSearch(i + 1)" :class="{ 'bg-$site-hover-c': i + 1 === selectedIndex }">
            <div flex-left gap-x-8 style="margin: 0.75rem; margin-left: 2rem;">
              <div>{{ item }}</div>
            </div>
          </div>
        </div>
      </div>
      <div v-on-click-outside="() => selectionVisible = false" relative flex-center w-50 class="search-sel">
        <div class="search-img" style="width: inherit; height: inherit;" @click="toggleSelection">
          <img :src="_getFavicon(searchList[currentIndex].value)" :style="iconStyle" cursor-pointer circle h-26 w-26
            style="opacity: 0.8;filter: saturate(64%);margin: auto;position: relative;top: 50%;transform: translateY(-50%);">
        </div>
        <!-- 搜索引擎选择 -->
        <div v-show="selectionVisible" absolute z-9 border-2 bg-fff l-0 t-100p w-200
          dark="border-black-20 bg-$dark-main-bg-c">
          <div v-for="(item, i) in searchList" :key="i" flex cursor-pointer items-center justify-between text-14 p-5
            hover="bg-$site-hover-c" @click="changeSearch(i)">
            <div flex-center gap-x-8 style="margin: 0.75rem; margin-left: 2rem;">
              <img :src="_getFavicon(item.value)" :style="iconStyle" circle h-20 w-20>
              <div>{{ item.name }}</div>
            </div>
            <div v-if="currentIndex === i" i-carbon:checkmark text-18 />
          </div>
        </div>        
      </div>      
      <div flex items-center w-260>
        <input ref="searchInputRef" v-model="keyword" h-full w-full bg-inherit op-80 text="14 text-$text-c-1"
          dark="text-$text-dark-c-1" 
          @keydown.enter="search"
          @keydown="handleKeyDown"
          @input="handleInput" 
          @keydown.down.exact="keyNext"
          @keydown.up.exact="keyPrev"
          @keydown.ctrl.n.exact="keyNext"
          @keydown.ctrl.p.exact="keyPrev">
        <div v-if="keyword?.length > 0" hover="op-80 rotate-180 scale-110" i-carbon:close mx-4 cursor-pointer text-20
          op-40 transition duration-300 @click="handleCloseClick"></div>        
      </div>
      <button flex-center gap-x-4 w-50 btn @click="search">
        <span i-carbon:search inline-block text-14 />
      </button>      
    </div>    
  </div>
</template>
