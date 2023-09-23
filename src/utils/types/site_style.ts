import type { SettingItem, DarkMode } from '@/types'

export type DarkModeSetting = SettingItem<DarkMode>

export const siteStyleList: DarkModeSetting[] = [
  {
      name: '系统自动',
      enName: 'auto',
      value: { name: '系统自动', enName: 'auto' }
  },
  {
      name: '夜晚模式',
      enName: 'dark',
      value: { name: '夜晚模式', enName: 'dark' }
  },
  {
      name: '白天模式',
      enName: 'light',
      value: { name: '白天模式', enName: 'light' }
  },
]
