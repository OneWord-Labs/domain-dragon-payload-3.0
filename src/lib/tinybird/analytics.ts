import {
  getKpiTotals,
  getKpis,
  getTopBrowsers,
  getTopDevices,
  getTopLocations,
  getTopPages,
  getTopSitesGrowth,
  getTopSources,
  getTrend,
} from './tinybird'
import { TopLocationsSorting } from './types/top-locations'
import { TopPagesSorting } from './types/top-pages'
export const getTopSitesGrowthApi = async (userId: string) => {
  const { data } = await getTopSitesGrowth(userId ?? '')
  return { data }
}

export const getTenantKpiApi = async (userId: string) => {
  const { data, dates } = await getKpis('visits', userId ?? '')
  return { data, dates }
}

export const getTenantKpiTotalApi = async (userId: string) => {
  const { avg_session_sec, pageviews, visits, bounce_rate } = await getKpiTotals(userId ?? '')

  return { avg_session_sec, pageviews, visits, bounce_rate }
}

export const getSiteKpiApi = async (site: any) => {
  const { data, dates } = await getKpis('visits', site?.userId ?? '', site?.id)
  return { data, dates }
}

export const getSiteKpiTotalApi = async (site: any) => {
  const { avg_session_sec, pageviews, visits, bounce_rate } = await getKpiTotals(
    site?.userId ?? '',
    site?.id,
  )

  return { avg_session_sec, pageviews, visits, bounce_rate }
}

export const getTopBrowserApi = async (site: any) => {
  const { data } = await getTopBrowsers(site?.userId ?? '', site?.id)

  return { data }
}

export const getTrendApi = async (site: any) => {
  const { visits, dates, totalVisits, data } = await getTrend(site?.userId ?? '', site?.id)

  return { visits, dates, totalVisits, data }
}

export const getTopSourcesApi = async (site: any) => {
  const { data, refs, visits } = await getTopSources(site?.userId ?? '', site?.id)

  return { data, refs, visits }
}

export const getTopPagesApi = async (site: any) => {
  const { data, columns, pages, labels } = await getTopPages(
    TopPagesSorting.Pageviews,
    site?.userId ?? '',
    site?.id,
  )

  return { data, columns, pages, labels }
}

export const getTopLocationsApi = async (site: any) => {
  const { data, locations, labels } = await getTopLocations(
    TopLocationsSorting.Pageviews,
    site?.userId ?? '',
    site?.id,
  )

  return { data, locations, labels }
}

export const getTopDevicesApi = async (site: any) => {
  const { data } = await getTopDevices(site?.userId ?? '', site?.id)

  return { data }
}
