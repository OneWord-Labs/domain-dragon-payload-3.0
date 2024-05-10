import { Button } from '@/components/ui/button'
import { SiteList } from './SiteList'
import Link from 'next/link'
export const SiteAdmin = () => {
  return (
    <div className="flex-grow p-8">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">All Sites</h1>
        <Link href="/admin/collections/sites/create">
          <Button>Create New Site</Button>
        </Link>
      </header>
      <SiteList />
    </div>
  )
}
