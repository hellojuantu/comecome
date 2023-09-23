export interface Settings {
  theme: string
  search: string
  iconStyle: string
  siteStyle: string
}

export interface SettingItem<T> {
  name: string
  enName: string
  value: T
}

export interface Theme {
  primaryC: string
  primaryLightC: string
  primaryDarkC: string
  siteHoverC: string
  settingBorderC: string
  settingGroupBgC: string
  bgC: string
  mainBgC: string
  buttonC: string
  categoryC: string
}

export interface Search {
  name: string
  enName: string
  url: string
  key: string
  favicon: string
  s: string
}

export interface IconStyle {
  name: string
  enName: string
  style: Partial<CSSStyleDeclaration>
}

export interface DarkMode {
  name: string
  enName: string
}