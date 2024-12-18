'use server'
import AnalyticsMockup from '@/components/analytics'
import { getSiteFromDomain } from '@/frontend/actions'
import dynamic, { LoaderComponent } from 'next/dynamic'
import { notFound, redirect } from 'next/navigation'

export default async function SiteAnalytics({
  params,
}: {
  params: { slug: string; domain: string }
}) {
  // const session = await getSession();
  // if (!session) {
  //   redirect("/login");
  // }

  let domain = decodeURIComponent(params.domain)

  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'localhost:3000'}`)
  domain = subdomain ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, '') : domain

  const site = await getSiteFromDomain(domain, !subdomain)

  if (!site) {
    notFound()
  }

  const url = `${site.subdomain}.${'domaindragon.ai'}`

  return (
    <>
      <div className="flex items-center justify-center sm:justify-start">
        <div className="flex flex-col items-center space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
          <h1 className="font-cal text-xl font-bold dark:text-white sm:text-3xl">
            Analytics for {site.name}
          </h1>
          <a
            href={`https://${url}`}
            target="_blank"
            rel="noreferrer"
            className="truncate rounded-md bg-stone-100 px-2 py-1 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700"
          >
            {url} ↗
          </a>
        </div>
      </div>
      <AnalyticsMockup siteId={site.id} />
    </>
  )
}
