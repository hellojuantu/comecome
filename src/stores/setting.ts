import { iconStyleList, searchList, themeList, siteStyleList } from '@/utils'
import preset from '@/preset.json'
import type { Settings, SettingItem } from '@/types'

export type SettingKey = keyof Settings

export function loadSettings(): Settings | undefined {
  const settings = localStorage.getItem('settings')
  return settings ? JSON.parse(settings) : undefined
}

export const settingData: { [K in SettingKey]: SettingItem<any>[] } = {
  theme: themeList,
  search: searchList,
  iconStyle: iconStyleList,
  siteStyle: siteStyleList
}

export const useSettingStore = defineStore('theme', () => {
  const route = useRoute()
  const isSetting = ref(false)

  watch(route, () => {
    if (route.name === 'setting')
      isSetting.value = true
    else
      isSetting.value = false
  }, { immediate: true })

  const settingCache = loadSettings()
  const presetSetting = preset.settings
  const settings = reactive<Settings>((() => {
    if (settingCache) {
      for (const key in presetSetting) {
        if (!settingCache[key as SettingKey])
          return Object.assign(presetSetting, settingCache)
      }
      return settingCache
    }
    return presetSetting
  })())

  function getSettingItem(key: SettingKey) {
    return settingData[key].find(item => item.enName === settings[key])!
  }

  function setSettings(newSettings: Partial<Settings>) {
    Object.assign(settings, newSettings)
  }

  watch(settings, () => {
    localStorage.setItem('settings', JSON.stringify(toRaw(settings)))
  }, { deep: true })

  const isDragging = ref(false)
  function setIsDragging(status: boolean) {
    isDragging.value = status
  }

  const isWhiteTheme = computed(() => settings.theme === 'MoonWhite')

  return {
    isWhiteTheme,
    isSetting,
    settings,
    isDragging,
    setSettings,
    setIsDragging,
    getSettingItem,
  }
})
