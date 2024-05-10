'use client'

import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table'
import * as React from 'react'

import { LoadingOverlay } from '@/components/LoadingOverlay'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useDebounce } from '@payloadcms/ui/hooks/useDebounce'
import { useInfiniteQuery } from '@tanstack/react-query'
import { DataTableToolbar } from './data-table-toolbar'
import { GETPaginatedDocs } from '@/payload/utilities/fetchDoc'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}
const fetchSize = 10
export function DataTable<TData, TValue>({ columns }: DataTableProps<TData, TValue>) {
  const tableContainerRef = React.useRef<HTMLTableSectionElement>(null)
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  const [filters, setFilters] = React.useState<{
    owners: string[]
    editors: string[]
    status: string[]
    dateRange: [Date | null, Date | null]
  }>({ owners: [], editors: [], status: [], dateRange: [null, null] })
  const [queryFilter, setQueryFilter] = React.useState('')
  const query = useDebounce(queryFilter, 250)
  // const [sorting, setSorting] = React.useState<SortingState>([])

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  //react-query has a useInfiniteQuery hook that is perfect for this use case
  const { data, fetchNextPage, isFetching, isLoading } = useInfiniteQuery<any>({
    queryKey: [
      'domains',
      filters,
      query,
      // sorting, //refetch when sorting changes
    ],
    staleTime: 5000,

    queryFn: async ({ pageParam }) => {
      // const fetchedData = await fetchData(start, fetchSize, sorting) //pretend api call

      const fetchedData = await GETPaginatedDocs<any>('domains', {
        // ...(query ? { search: query } : {}),
        limit: fetchSize ? fetchSize : 10,
        page: pageParam,
        where: {
          ...(query ? { name: { contains: query } } : {}),
        },
      })
      return fetchedData
    },
    initialPageParam: 1,
    getNextPageParam: (_lastGroup, groups) => groups.length,
    refetchOnWindowFocus: false,
  })

  //flatten the array of arrays from the useInfiniteQuery hook
  const flatData = React.useMemo(() => data?.pages?.flatMap((page) => page.data) ?? [], [data])
  const totalDBRowCount = data?.pages?.[0]?.meta?.totalRowCount ?? 0
  const totalFetched = flatData.length

  //called on scroll and possibly on mount to fetch more data as the user scrolls and reaches bottom of table
  const fetchMoreOnBottomReached = React.useCallback(
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
  React.useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current)
  }, [fetchMoreOnBottomReached])

  const table = useReactTable({
    data: flatData,
    columns,
    state: {
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    // onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    // getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <div className="space-y-4">
      {/* <DataTableToolbar
        table={table}
        setFilters={(values: {
          owners: string[]
          editors: string[]
          status: string[]
          dateRange: [Date | null, Date | null]
        }) => {
          setFilters(values)
        }}
        setQuery={(value) => {
          setQueryFilter(value)
        }}
      /> */}
      <div
        onScroll={(e) => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
        ref={tableContainerRef}
        className="rounded-md  overflow-auto relative max-h-[600px] w-full"
      >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="bg-slate-50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <LoadingOverlay show={isLoading} loadingText="Loading Articles" />
      {/* <DataTablePagination table={table} /> */}
    </div>
  )
}
