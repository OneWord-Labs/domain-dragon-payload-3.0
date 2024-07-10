'use server'

import {
  getSiteKpiApi,
  getTopLocationsApi,
  getTopPagesApi,
  getTopSourcesApi,
} from '@/lib/tinybird/analytics'
import { TopLocationsSorting } from '@/lib/tinybird/types/top-locations'
import { TopPagesSorting } from '@/lib/tinybird/types/top-pages'
import { AreaChart, BarList, Bold, Card, Flex, Grid, Text, Title } from '@tremor/react'

export default async function AnalyticsMockup({ siteId }: { siteId: string }) {
  const kpiData = await getSiteKpiApi(siteId ?? '')
  const topPagesData = await getTopPagesApi(siteId ?? '')
  const topLocationData = await getTopLocationsApi(siteId ?? '')
  const topSourcesData = await getTopSourcesApi(siteId ?? '')

  const chartData = (kpiData?.dates ?? []).map((date: any, index: number) => {
    const value = Math.max(
      Number(kpiData?.data[0][index]) || 0,
      Number(kpiData?.data[1][index]) || 0,
    )

    return {
      date: date.toUpperCase(),
      Visitors: value,
    }
  })

  const topPagesChartData = (topPagesData?.data ?? []).map((d: any) => ({
    name: d.pathname,
    value: d[TopPagesSorting.Pageviews],
    // href: `https://${domain}${d.pathname}`,
  }))

  const topLocationChartData = (topLocationData?.data ?? []).map((d: any) => ({
    name: d.location,
    value: d[TopLocationsSorting.Pageviews],
  }))

  const topSourcesChartData = (topSourcesData?.data ?? []).map((d: any) => ({
    name: d.referrer,
    value: d.visits,
    href: d.href,
  }))

  const categories = [
    {
      title: 'Top Pages',
      subtitle: 'Page',
      data: topPagesChartData,
    },
    {
      title: 'Top Referrers',
      subtitle: 'Source',
      data: topSourcesChartData,
    },
    {
      title: 'Countries',
      subtitle: 'Country',
      data: topLocationChartData,
    },
  ]

  console.log('KP', topSourcesData, topLocationData, topPagesData, kpiData)

  return (
    <div className="grid gap-6">
      <Card>
        <Title>Unique Visitors</Title>
        <AreaChart
          className="mt-4 h-72"
          data={chartData}
          index="date"
          categories={['Visitors']}
          colors={['indigo']}
          // valueFormatter={(number: number) =>
          //   Intl.NumberFormat("us").format(number).toString()
          // }
        />
      </Card>
      <Grid numItemsSm={2} numItemsLg={3} className="gap-6">
        {categories.map(({ title, subtitle, data }) => (
          <Card key={title} className="max-w-lg">
            <Title>{title}</Title>
            <Flex className="mt-4">
              <Text>
                <Bold>{subtitle}</Bold>
              </Text>
              <Text>
                <Bold>Visitors</Bold>
              </Text>
            </Flex>
            <BarList
              // @ts-ignore
              data={data.map(({ name, value, code }) => ({
                name,
                value,
                // icon: () => {
                //   if (title === "Top Referrers") {
                //     return (
                //       <Image
                //         src={`https://www.google.com/s2/favicons?sz=64&domain_url=${name}`}
                //         alt={name}
                //         className="mr-2.5"
                //         width={20}
                //         height={20}
                //       />
                //     );
                //   } else if (title === "Countries") {
                //     return (
                //       <Image
                //         src={`https://flag.vercel.app/m/${code}.svg`}
                //         className="mr-2.5"
                //         alt={code}
                //         width={24}
                //         height={16}
                //       />
                //     );
                //   } else {
                //     return null;
                //   }
                // },
              }))}
              className="mt-2"
            />
          </Card>
        ))}
      </Grid>
    </div>
  )
}
