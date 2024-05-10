'use client'

import { Table } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Cross } from 'lucide-react'
import { useState } from 'react'
import { ArticlesFilter } from './data-table-custom-filter'
import { DataTableViewOptions } from './data-table-view-options'
interface DataTableToolbarProps<TData> {
  table: Table<TData>
  setFilters: (values: {
    owners: string[]
    editors: string[]
    status: string[]
    dateRange: [Date | null, Date | null]
  }) => void
  setQuery: (values: string) => void
}

export function DataTableToolbar<TData>({
  table,
  setFilters,
  setQuery,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const [inputValue, setInputValue] = useState('')
  return (
    <div className="flex flex-col items-start justify-between gap-8">
      <div className="field-type">
        <Input
          placeholder="Search for article..."
          value={inputValue}
          onChange={(event) => {
            setInputValue(event.target.value)
            setQuery(event.target.value)
          }}
          className=" w-[350px] lg:w-[650px] h-16 focus:outline-none focus:ring-0 focus:ring-offset-0"
        />
      </div>
      <div className="flex flex-1 items-center space-x-2 gap-6">
        {/* {table.getColumn('status') && (
          <DataTableFacetedFilter
            column={table.getColumn('status')}
            title="Status"
            options={statuses}
          />
        )}
        {table.getColumn('authors') && (
          <DataTableFacetedFilter
            column={table.getColumn('authors')}
            title="Author"
            options={statuses}
          />
        )}
        {table.getColumn('editors') && (
          <DataTableFacetedFilter
            column={table.getColumn('editors')}
            title="Editors"
            options={statuses}
          />
        )} */}
        {/* <ArticlesFilter setFilters={setFilters} /> */}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
