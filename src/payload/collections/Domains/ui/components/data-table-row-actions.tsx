'use client'

import { Row } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'

import { EyeIcon, GaugeIcon, TrashIcon } from 'lucide-react'
import Link from 'next/link'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
  // const article = articleSchema.parse(article)
  const id = (row.original as any).id
  return (
    <div className="flex items-center gap-2">
      <Link href={(row.original as any)?.name ?? ''}>
        <Button size="icon" variant="ghost">
          <EyeIcon className="" />
          <span className="sr-only">View</span>
        </Button>
      </Link>

      <Link href={`/admin/collections/domains/${id}`}>
        <Button size="icon" variant="ghost">
          <GaugeIcon className="" />
          <span className="sr-only">Edit</span>
        </Button>
      </Link>
      <Button size="icon" variant="ghost">
        <TrashIcon className="h-4 w-4" />
        <span className="sr-only">Delete</span>
      </Button>
    </div>
  )
}
