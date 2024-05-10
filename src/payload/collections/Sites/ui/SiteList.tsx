'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { GETPaginatedDocs } from '@/payload/utilities/fetchDoc'
import { useInfiniteQuery } from '@tanstack/react-query'
import {
  BotIcon,
  CameraIcon,
  DollarSignIcon,
  GlobeIcon,
  TargetIcon,
  ToggleRightIcon,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef } from 'react'
const fetchSize = 10
export const SiteList = () => {
  const tableContainerRef = useRef<any>(null)

  //react-query has a useInfiniteQuery hook that is perfect for this use case
  const { data, fetchNextPage, isFetching, isLoading } = useInfiniteQuery<any>({
    queryKey: [
      'sites',
      // sorting, //refetch when sorting changes
    ],
    staleTime: 5000,

    queryFn: async ({ pageParam }) => {
      // const fetchedData = await fetchData(start, fetchSize, sorting) //pretend api call

      const fetchedData = await GETPaginatedDocs<any>('sites', {
        // ...(query ? { search: query } : {}),
        limit: fetchSize ? fetchSize : 10,
        page: pageParam,
        // where: {
        //   ...(query ? { name: { contains: query } } : {}),
        // },
      })
      return fetchedData
    },
    initialPageParam: 1,
    getNextPageParam: (_lastGroup, groups) => groups.length,
    refetchOnWindowFocus: false,
  })

  //flatten the array of arrays from the useInfiniteQuery hook
  const flatData = useMemo(() => data?.pages?.flatMap((page) => page.data) ?? [], [data])
  const totalDBRowCount = data?.pages?.[0]?.meta?.totalRowCount ?? 0
  const totalFetched = flatData.length

  //called on scroll and possibly on mount to fetch more data as the user scrolls and reaches bottom of table
  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement
        //once the user has scrolled within 500px of the bottom of the table, fetch more data if we can
        if (
          scrollHeight - scrollTop - clientHeight < 500 &&
          !isFetching &&
          totalFetched < totalDBRowCount
        ) {
          fetchNextPage()
        }
      }
    },
    [fetchNextPage, isFetching, totalFetched, totalDBRowCount],
  )

  //a check on mount and after a fetch to see if the table is already scrolled to the bottom and immediately needs to fetch more data
  useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current)
  }, [fetchMoreOnBottomReached])
  return (
    <div
      onScroll={(e) => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
      ref={tableContainerRef}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {flatData?.map((data: any, index: number) => {
        return (
          <Card className="shadow-md" key={index}>
            <CardHeader className="flex flex-col items-center justify-center p-6">
              {data?.logo?.url ? (
                <img src={data?.logo?.url} width={200} height={200} alt="LOGO" />
              ) : (
                <>
                  <CameraIcon className="h-8 w-8 mb-2" />
                  <CardDescription>Upload your own image under /settings</CardDescription>
                </>
              )}
            </CardHeader>
            <CardContent className="p-4">
              <Link href={`/admin/collections/sites/${data.id}`}>
                <h2 className="font-semibold mb-1">{data?.customdomain}</h2>
                <p className="text-sm text-muted-foreground mb-2">{data?.subdomain}</p>
              </Link>
              <Progress className="w-full mb-4" value={0} />
              <div className="flex justify-between gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button className="rounded-full flex-1" size="sm" variant="outline">
                        <GlobeIcon className="h-4 w-4" />
                        <span className="sr-only">DNS</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>DNS</p>
                      <p className="text-xs">View DNS settings</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button className="rounded-full flex-1" size="sm" variant="outline">
                        <BotIcon className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete</p>
                      <p className="text-xs">Delete this site</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button className="rounded-full flex-1" size="sm" variant="outline">
                        <DollarSignIcon className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Preview</p>
                      <p className="text-xs">Preview this site</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button className="rounded-full flex-1" size="sm" variant="outline">
                        <TargetIcon className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Share</p>
                      <p className="text-xs">Share this site</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex justify-between gap-2 mt-2">
                <Button size="sm" variant="outline">
                  Edit Site
                </Button>
                <Button size="sm" variant="outline">
                  <ToggleRightIcon className="h-4 w-4" />
                  <span className="sr-only">Toggle Live/Coming Soon</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
