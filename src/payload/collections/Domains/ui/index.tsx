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
export const DomainsLayout = () => {
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
              12,345
              <div className="flex items-center gap-1 text-sm">
                <ArrowUpIcon className="h-4 w-4" />
                <span className="text-green-500">5%</span>
                <span className="text-gray-500 dark:text-gray-400">from last month</span>
              </div>
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
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
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <GroupIcon className="h-6 w-6" />
                Traffic
              </div>
            </CardTitle>
            <CardDescription>
              5,432,000 visitors
              <div className="flex items-center gap-1 text-sm">
                <ArrowUpIcon className="h-4 w-4" />
                <span className="text-green-500">10%</span>
                <span className="text-gray-500 dark:text-gray-400">from last month</span>
              </div>
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
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
        </Card>
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
