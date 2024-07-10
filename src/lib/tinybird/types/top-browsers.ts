export type BrowserType = 'chrome' | 'firefox' | 'safari' | 'opera' | 'ie'

export type TopBrowsersData = {
  browser: BrowserType
  visits: number
  hits: number
  user_id: string
  site_id: string
}

export type TopBrowser = {
  browser: string
  visits: number
}

export type TopBrowsers = {
  data: TopBrowser[]
}
