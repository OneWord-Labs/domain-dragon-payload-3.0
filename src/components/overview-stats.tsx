'use server'

import {
  getTenantKpiApi,
  getTenantKpiTotalApi,
  getTopSitesGrowthApi,
} from '@/lib/tinybird/analytics'
import { BadgeDelta, Card, Flex, Metric, Text } from '@tremor/react'
import Areachart from './areachart'

export default async function OverviewStats({ userId }: { userId: string }) {
  const kpiData = await getTenantKpiApi(userId)
  const kpiTotalData = await getTenantKpiTotalApi(userId)
  const sitesGrowthData = await getTopSitesGrowthApi(userId)

  const chartData = (kpiData?.dates ?? []).map((date: any, index: number) => {
    const value = Math.max(
      Number(kpiData?.data?.[0][index]) || 0,
      Number(kpiData?.data?.[1][index]) || 0,
    )

    return {
      date: date.toUpperCase(),
      'Total Visitors': value,
    }
  })

  const totalGrowth = Math.abs(
    sitesGrowthData?.data?.reduce((acc, site) => {
      return acc + (site.previous_month_visits - site.current_month_visits)
    }, 0) ?? 0,
  )
  const totalGrowthPrevious = Math.abs(
    sitesGrowthData?.data?.reduce((acc, site) => {
      return acc + site.previous_month_visits
    }, 0) ?? 0,
  )
  // const data = useMemo(() => {
  //   const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  //   return [
  //     ...months.map((month) => ({
  //       Month: `${month} 23`,
  //       "Total Visitors": random(20000, 170418),
  //     })),
  //     {
  //       Month: "Jul 23",
  //       "Total Visitors": 170418,
  //     },
  //   ];
  // }, []);

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <Card className="dark:!bg-stone-900">
        <Text>Total Visitors</Text>
        <Flex className="space-x-3 truncate" justifyContent="start" alignItems="baseline">
          <Metric className="font-cal">{kpiTotalData?.visits}</Metric>
          <BadgeDelta
            deltaType="moderateIncrease"
            className="dark:bg-green-900 dark:bg-opacity-50 dark:text-green-400"
          >
            {((totalGrowth ?? 0) / (totalGrowthPrevious || 1)) * 100}%
          </BadgeDelta>
        </Flex>
        <Areachart
          labels={chartData?.map((d: any) => d.date)}
          values={chartData?.map((d: any) => d['Total Visitors'])}
          // className="mt-6 h-28"
          // data={chartData}
          // index="date"
          // // valueFormatter={(number: number) =>
          // //   `${Intl.NumberFormat("us").format(number).toString()}`
          // // }
          // categories={['Total Visitors']}
          // colors={['blue']}
          // showXAxis={true}
          // showGridLines={false}
          // startEndOnly={true}
          // showYAxis={false}
          // showLegend={false}
        />
      </Card>
    </div>
  )
}
