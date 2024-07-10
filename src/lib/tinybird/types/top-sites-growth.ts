export type BrowserType = 'chrome' | 'firefox' | 'safari' | 'opera' | 'ie'

export type TopSiteGrowthData = {
  site_id: string
  current_month_visits: number
  current_month_hits: number
  previous_month_visits: number
  previous_month_hits: number
  visits_growth_percentage: number
  hits_growth_percentage: number
  user_id: string
}

export type TopSiteGrowth = {
  site_id: string
  current_month_visits: number
  current_month_hits: number
  previous_month_visits: number
  previous_month_hits: number
  visits_growth_percentage: number
  hits_growth_percentage: number
}

export type TopSiteGrowths = {
  data: TopSiteGrowth[]
}
