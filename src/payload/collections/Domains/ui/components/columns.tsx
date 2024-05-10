'use client'

import { ColumnDef } from '@tanstack/react-table'

import { Badge } from '@/components/ui/badge'
import { Domain } from '../data/schema'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import ConfiguredSection from '@/payload/components/ConfiguredSection'

export const columns: ColumnDef<Domain>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Domain" />,
    cell: ({ row }) => {
      const name: string = row.getValue('name')

      return <div className="flex space-x-2 gap-8">{name}</div>
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="DNS Status" />,
    cell: ({ row }) => {
      const status: string = row.getValue('status')
      const record: { CNAME: string; A: string } = row.getValue('record')

      return (
        <div className="flex space-x-2 gap-8">
          <Badge className="text-red-500" variant="default">
            {status === 'notActive' ? 'Not Active' : 'Active'}
          </Badge>
          <ConfiguredSection domainInfo={{}} />
          {record?.CNAME || record?.A ? (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              A Record: 1.2.3.4
              <div>C Name: example.com</div>
            </div>
          ) : null}

          <div className="text-sm text-gray-500 dark:text-gray-400" />
        </div>
      )
    },
  },

  {
    accessorKey: 'traffic',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Traffic" />,
    cell: ({ row }) => {
      const traffic: string = row.getValue('traffic')

      return <div className="flex space-x-2 gap-8">{traffic}</div>
    },
  },

  {
    accessorKey: 'revenue',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Revenue" />,
    cell: ({ row }) => {
      const revenue: string = row.getValue('revenue')

      return <div className="flex space-x-2 gap-8">${revenue}</div>
    },
  },

  {
    accessorKey: 'conversion',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Conversion" />,
    cell: ({ row }) => {
      const conversion: string = row.getValue('conversion')

      return <div className="flex space-x-2 gap-8">{conversion}</div>
    },
  },

  {
    id: 'actions',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Actions" />,

    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
