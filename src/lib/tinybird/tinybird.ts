import moment from 'moment'
import { ChartValue } from '@/lib/tinybird/types/charts'
import { KpiTotals, KpiType, KpisData } from '@/lib/tinybird/types/kpis'
import { queryPipe } from './api'
import { Trend, TrendData } from '@/lib/tinybird/types/trend'
import { TopSource, TopSources } from '@/lib/tinybird/types/top-sources'
import { TopPagesData, TopPagesSorting } from '@/lib/tinybird/types/top-pages'
import { TopLocation, TopLocationsData, TopLocationsSorting } from './types/top-locations'
import { TopDevices, TopDevicesData } from './types/top-devices'
import devices from './constants/devices'
import { TopBrowsers, TopBrowsersData } from './types/top-browsers'
import browsers from './constants/browsers'
import { TopSiteGrowthData, TopSiteGrowths } from './types/top-sites-growth'

const arrayHasCurrentDate = (dates: string[], isHourlyGranularity: boolean) => {
  const now = moment()
    .utc()
    .format(isHourlyGranularity ? 'HH:00' : 'MMM DD, YYYY')
  return dates[dates.length - 1] === now
}

export async function getKpis(
  kpi: KpiType,
  user_id?: string,
  site_id?: string,
  date_from?: string,
  date_to?: string,
) {
  const { data: queryData } = await queryPipe<KpisData>('kpis', {
    user_id,
    site_id,
    date_from,
    date_to,
  })
  const isHourlyGranularity = !!date_from && !!date_to && date_from === date_to
  const dates = queryData.map(({ date }) =>
    moment(date).format(isHourlyGranularity ? 'HH:mm' : 'MMM DD, YYYY'),
  )
  const isCurrentData = arrayHasCurrentDate(dates, isHourlyGranularity)

  const data = isCurrentData
    ? queryData.reduce(
        (acc, record, index) => {
          const value = record[kpi] ?? 0

          const pastValue = index < queryData.length - 1 ? value : ''
          const currentValue = index > queryData.length - 3 ? value : ''

          const [pastPart, currentPart] = acc

          return [
            [...pastPart, pastValue],
            [...currentPart, currentValue],
          ]
        },
        [[], []] as ChartValue[][],
      )
    : [queryData.map((value) => value[kpi] ?? 0), ['']]

  return {
    dates,
    data,
  }
}

export async function getKpiTotals(
  user_id: string,
  site_id?: string,
  date_from?: string,
  date_to?: string,
): Promise<KpiTotals> {
  /**
   * If we sent the same value for date_from and date_to, the result is one row per hour.
   *
   * But we actually need one row per date, so we're sending one extra day in the filter,
   * and removing ir afterwards.
   *
   * Not the best approach, it'd be better to modify the kpis endpoint. But we don't want
   * to break the backwards compatibility (breaking the dashboard for alreayd active users).
   *
   */
  let date_to_aux = date_to ? new Date(date_to) : new Date()
  date_to_aux.setDate(date_to_aux.getDate() + 1)
  const date_to_aux_str = date_to_aux.toISOString().substring(0, 10)

  const { data } = await queryPipe<KpisData>('kpis', {
    user_id,
    site_id,
    date_from,
    date_to: date_to_aux_str,
  })

  const queryData = data.filter((record) => record['date'] != date_to_aux_str)

  // Sum total KPI value from the trend
  const _KPITotal = (kpi: KpiType) => queryData.reduce((prev, curr) => (curr[kpi] ?? 0) + prev, 0)

  // Get total number of sessions
  const totalVisits = _KPITotal('visits')

  // Sum total KPI value from the trend, ponderating using sessions
  const _ponderatedKPIsTotal = (kpi: KpiType) =>
    queryData.reduce((prev, curr) => prev + ((curr[kpi] ?? 0) * curr['visits']) / totalVisits, 0)

  return {
    avg_session_sec: _ponderatedKPIsTotal('avg_session_sec'),
    pageviews: _KPITotal('pageviews'),
    visits: totalVisits,
    bounce_rate: _ponderatedKPIsTotal('bounce_rate'),
  }
}

export async function getTopDevices(
  user_id: string,
  site_id: string,
  date_from?: string,
  date_to?: string,
): Promise<TopDevices> {
  const { data: queryData } = await queryPipe<TopDevicesData>('top_devices', {
    user_id,
    site_id,
    date_from,
    date_to,
    limit: 4,
  })
  const data = [...queryData]
    .sort((a, b) => b.visits - a.visits)
    .map(({ device, visits }) => ({
      device: devices[device] ?? device,
      visits,
    }))

  return { data }
}

function getFlagEmoji(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

export async function getTopLocations(
  sorting: TopLocationsSorting,
  user_id: string,
  site_id: string,
  date_from?: string,
  date_to?: string,
) {
  const { data: queryData } = await queryPipe<TopLocationsData>('top_locations', {
    user_id,
    site_id,
    limit: 8,
    date_from,
    date_to,
  })
  const regionNames = new Intl.DisplayNames(['en'], { type: 'region' })

  const data: TopLocation[] = [...queryData]
    .sort((a, b) => b[sorting] - a[sorting])
    .map(({ location, ...rest }) => {
      const unknownLocation = '🌎  Unknown'
      return {
        location: location
          ? `${getFlagEmoji(location)} ${regionNames.of(location)}`
          : unknownLocation,
        shortLocation: location ? `${getFlagEmoji(location)} ${location}` : unknownLocation,
        ...rest,
      }
    })

  const locations = data.map(({ location }) => location)
  const labels = data.map((record) => record[sorting])

  return {
    data,
    locations,
    labels,
  }
}

export async function getTopPages(
  sorting: TopPagesSorting,
  user_id: string,
  site_id: string,
  date_from?: string,
  date_to?: string,
) {
  const { data: queryData, meta } = await queryPipe<TopPagesData>('top_pages', {
    user_id,
    site_id,
    limit: 8,
    date_from,
    date_to,
  })
  const data = [...queryData].sort((a, b) => b[sorting] - a[sorting])

  const columnLabels = {
    pathname: 'content',
    visits: 'visitors',
    hits: 'pageviews',
    user_id: 'user_id',
    site_id: 'site_id',
  }
  const columns = meta.map(({ name }) => ({
    label: columnLabels[name],
    value: name,
  }))
  const pages = data.map(({ pathname }) => pathname)
  const labels = data.map((record) => record[sorting])

  return {
    data,
    columns,
    pages,
    labels,
  }
}

export async function getTopSources(
  user_id: string,
  site_id: string,
  date_from?: string,
  date_to?: string,
): Promise<TopSources> {
  const { data: queryData } = await queryPipe<TopSource>('top_sources', {
    user_id,
    site_id,
    limit: 8,
    date_from,
    date_to,
  })

  const data: TopSource[] = [...queryData]
    .sort((a, b) => b.visits - a.visits)
    .map(({ referrer, visits, user_id, site_id }) => ({
      referrer: referrer || 'Direct',
      href: referrer ? `https://${referrer}` : undefined,
      visits,
      user_id,
      site_id,
    }))
  const refs = data.map(({ referrer }) => referrer)
  const visits = data.map(({ visits }) => visits)

  return {
    data,
    refs,
    visits,
  }
}

export async function getTrend(
  user_id: string,
  site_id: string,
  date_from?: string,
  date_to?: string,
): Promise<Trend> {
  const { data } = await queryPipe<TrendData>('trend', {
    user_id,
    site_id,
    date_from,
    date_to,
  })
  const visits = data.map(({ visits }) => visits)
  const dates = data.map(({ t }) => {
    return moment(t).format('HH:mm')
  })
  const totalVisits = visits.reduce((a, b) => a + b, 0)

  return {
    visits,
    dates,
    totalVisits,
    data,
  }
}

export async function getTopBrowsers(
  user_id: string,
  site_id: string,
  date_from?: string,
  date_to?: string,
): Promise<TopBrowsers> {
  const { data: queryData } = await queryPipe<TopBrowsersData>('top_browsers', {
    user_id,
    site_id,
    date_from,
    date_to,
    limit: 4,
  })
  const data = [...queryData]
    .sort((a, b) => b.visits - a.visits)
    .map(({ browser, visits }) => ({
      browser: browsers[browser] ?? browser,
      visits,
    }))

  return { data }
}

export async function getTopSitesGrowth(
  user_id: string,
  date_from?: string,
  date_to?: string,
): Promise<TopSiteGrowths> {
  const { data: queryData } = await queryPipe<TopSiteGrowthData>('top_sites_growth', {
    user_id,
    date_from,
    date_to,
    limit: 4,
  })

  return { data: queryData }
}
