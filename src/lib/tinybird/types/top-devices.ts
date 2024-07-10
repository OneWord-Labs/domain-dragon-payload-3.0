export type DeviceType = 'desktop' | 'mobile-ios' | 'mobile-android' | 'bot'

export type TopDevicesData = {
  device: DeviceType
  browser: string
  visits: number
  hits: number
  user_id: string
  site_id: string
}

export type TopDevice = {
  device: string
  visits: number
}

export type TopDevices = {
  data: TopDevice[]
}
