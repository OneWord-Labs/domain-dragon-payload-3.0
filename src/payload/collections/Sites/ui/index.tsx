import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { DownloadButton } from '../../Domains/ui/DownloadButton'
import { UploadDomain } from '../../Domains/ui/UploadDomain'
import { SiteList } from './SiteList'
export const SiteAdmin = () => {
  return (
    <div className="flex-grow p-8">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">All Sites</h1>
        <Link href="/admin/collections/sites/create">
          <Button>Create New Site</Button>
        </Link>
        <UploadDomain />

        <DownloadButton />
      </header>
      <SiteList />
    </div>
  )
}
