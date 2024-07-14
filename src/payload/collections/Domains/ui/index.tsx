import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BarChartIcon,
  DollarSignIcon,
  GlobeIcon,
  GroupIcon,
  MouseIcon,
} from 'lucide-react'

import Link from 'next/link'
import { UploadDomain } from './UploadDomain'
import { columns } from './components/columns'
import { DataTable } from './components/data-table'
import axios from 'axios'
import { DownloadButton } from './DownloadButton'
import { getPayload, Payload } from 'payload'
import config from '@/payload.config'
import { getTenantKpiTotalApi, getTopSitesGrowthApi } from '@/lib/tinybird/analytics'
export const DomainsLayout = async (props: any) => {
  if (!props?.user?.id) return <></>
  console.log('PROPS', props.user)
  const payload = await getPayload({ config: config })
  const isAdmin = props?.user?.roles?.includes('super-admin')
  console.log('isAdmin ', isAdmin)

  const { totalCount, previousMonthCount, currentMonthCount, growth } = await getMonthlyGrowth({
    isAdmin,
    payload,
    userId: props?.user?.id,
  })
  const kpiTotalData = await getTenantKpiTotalApi(props?.user?.id)
  const sitesGrowthData = await getTopSitesGrowthApi(props?.user?.id)

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
  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <GlobeIcon className="h-6 w-6" />
                Total Domains
              </div>
            </CardTitle>
            <CardDescription>
              {totalCount}
              <div className="flex items-center gap-1 text-sm">
                <ArrowUpIcon className="h-4 w-4" />
                <span className="text-green-500">{growth}</span>
                <span className="text-gray-500 dark:text-gray-400">from last month</span>
              </div>
            </CardDescription>
          </CardHeader>
        </Card>
        {/* <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <DollarSignIcon className="h-6 w-6" />
                Revenue
              </div>
            </CardTitle>
            <CardDescription>
              $125,678
              <div className="flex items-center gap-1 text-sm">
                <ArrowDownIcon className="h-4 w-4" />
                <span className="text-red-500">2%</span>
                <span className="text-gray-500 dark:text-gray-400">from last month</span>
              </div>
            </CardDescription>
          </CardHeader>
        </Card> */}
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <GroupIcon className="h-6 w-6" />
                Traffic
              </div>
            </CardTitle>
            <CardDescription>
              {kpiTotalData?.visits} visitors
              <div className="flex items-center gap-1 text-sm">
                <ArrowUpIcon className="h-4 w-4" />
                <span className="text-green-500">{totalGrowthPrevious}%</span>
                <span className="text-gray-500 dark:text-gray-400">from last month</span>
              </div>
            </CardDescription>
          </CardHeader>
        </Card>
        {/* <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <MouseIcon className="h-6 w-6" />
                Clicks Generated
              </div>
            </CardTitle>
            <CardDescription>
              3,210,000
              <div className="flex items-center gap-1 text-sm">
                <ArrowUpIcon className="h-4 w-4" />
                <span className="text-green-500">8%</span>
                <span className="text-gray-500 dark:text-gray-400">from last month</span>
              </div>
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <BarChartIcon className="h-6 w-6" />
                Ave Conv Rate
              </div>
            </CardTitle>
            <CardDescription>
              2.5%
              <div className="flex items-center gap-1 text-sm">
                <ArrowDownIcon className="h-4 w-4" />
                <span className="text-red-500">0.5%</span>
                <span className="text-gray-500 dark:text-gray-400">from last month</span>
              </div>
            </CardDescription>
          </CardHeader>
        </Card> */}
      </div>
      <div className="flex items-center gap-4 pt-16">
        <h1 className="font-semibold text-lg md:text-2xl">Domains</h1>
        <Link href="/admin/collections/sites/create">
          <Button size="sm">Add Domain</Button>
        </Link>
        <UploadDomain />

        <DownloadButton />
      </div>
      <div className="border shadow-sm rounded-lg pt-16">
        <DataTable data={[]} columns={columns} />
      </div>
    </div>
  )
}

const getMonthlyGrowth = async ({
  isAdmin,
  userId,
  payload,
}: {
  isAdmin: boolean
  userId: string
  payload: Payload
}) => {
  const currentDate = new Date()
  const previousMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
  const previousMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0)
  const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)

  const totalCount = (
    await payload.count({
      collection: 'domains',
      where: {
        ...(isAdmin ? {} : { user: { equals: userId } }),
      },
    })
  )?.totalDocs

  // Query to get the count for the previous month
  const previousMonthCount = (
    await payload.count({
      collection: 'domains',
      where: {
        ...(isAdmin ? {} : { user: { equals: userId } }),
        createdAt: {
          greater_than_equal: previousMonthStart.toISOString(),
          less_than_equal: previousMonthEnd.toISOString(),
        },
      },
    })
  )?.totalDocs

  // Query to get the count for the current month
  const currentMonthCount = (
    await payload.count({
      collection: 'domains',
      where: {
        ...(isAdmin ? {} : { user: { equals: userId } }),
        createdAt: {
          greater_than_equal: currentMonthStart.toISOString(),
          less_than_equal: currentDate.toISOString(),
        },
      },
    })
  )?.totalDocs
  // Calculate the growth percentage
  let growth = 0
  if (previousMonthCount > 0) {
    growth = ((currentMonthCount - previousMonthCount) / previousMonthCount) * 100
  } else if (currentMonthCount > 0) {
    growth = 100 // If there were no records in the previous month but there are in the current month, growth is 100%
  }

  console.log('Previous Month Count:', previousMonthCount)
  console.log('Current Month Count:', currentMonthCount)
  console.log('Growth:', growth.toFixed(2) + '%')

  return {
    totalCount,
    previousMonthCount,
    currentMonthCount,
    growth: growth.toFixed(2) + '%',
  }
}
