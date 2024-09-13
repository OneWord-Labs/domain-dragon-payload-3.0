'use client'
import {
  getSiteKpiApi,
  getTopLocationsApi,
  getTopPagesApi,
  getTopSourcesApi,
} from '@/lib/tinybird/analytics'
import { TopLocationsSorting } from '@/lib/tinybird/types/top-locations'
import { TopPagesSorting } from '@/lib/tinybird/types/top-pages'
import { AreaChart, LineChart, BarList, Bold, Card, Flex, Grid, Text, Title } from '@tremor/react'

import { useDocumentInfo } from '@payloadcms/ui/providers/DocumentInfo'
import Areachart from '@/components/areachart'
import { useEffect, useState } from 'react'

export const Analytics = () => {
  const { id } = useDocumentInfo()

  const [kpiData, setKpiData] = useState<any>()
  const [topPagesData, setTopPagesData] = useState<any>()
  const [topLocationData, setTopLocationData] = useState<any>()
  const [topSourcesData, setTopSourcesData] = useState<any>()

  useEffect(() => {
    ;(async () => {
      const kpi = await getSiteKpiApi({ id: id as string })
      const topPages = await getTopPagesApi({ id: id as string })
      const topLocation = await getTopLocationsApi({ id: id as string })
      const topSources = await getTopSourcesApi({ id: id as string })

      setKpiData(kpi)
      setTopPagesData(topPages)
      setTopLocationData(topLocation)
      setTopPagesData(topSources)
    })()
  }, [])

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

  return (
    <>
      <div className="grid gap-6">
        <Card className="dark:bg-[#2f2f2f]">
          <Title>Unique Visitors</Title>

          <div className=" h-64">
            <Areachart
              labels={chartData?.map((data: any) => {
                return data?.date
              })}
              values={chartData?.map((data: any) => {
                return data?.Visitors
              })}
            />
          </div>

          {/* <LineChart
              className="h-80"
              data={chartdata}
              index="date"
              categories={['SolarPanels', 'Inverters']}
              colors={['indigo', 'rose']}
              // valueFormatter={dataFormatter}
              yAxisWidth={60}
              // onValueChange={(v) => console.log(v)}
            /> */}
          {/* <AreaChart
            className="mt-4 h-72"
            data={chartData}
            index="date"
            categories={['Visitors']}
            colors={['indigo']}
            // valueFormatter={(number: number) =>
            //   Intl.NumberFormat("us").format(number).toString()
            // }
          /> */}
        </Card>
        <Grid numItemsSm={2} numItemsLg={3} className="gap-6">
          {categories.map(({ title, subtitle, data }) => (
            <Card key={title} className="max-w-lg dark:bg-[#2f2f2f]">
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
    </>
  )
}
