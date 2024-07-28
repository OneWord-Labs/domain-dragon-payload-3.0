import { getSiteFromDomain } from '@/frontend/actions'
import CTA from '@/frontend/components/CTA'
import config from '@/lib/tinybird/config'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import { ReactNode } from 'react'
import { ToastContainer } from 'react-toastify'

// export async function generateMetadata({
//   params,
// }: {
//   params: { domain: string };
// }): Promise<Metadata | null> {
//   const domain = decodeURIComponent(params.domain);
//   const data = await getSiteData(domain);
//   if (!data) {
//     return null;
//   }
//   const {
//     name: title,
//     description,
//     image,
//     logo,
//   } = data as {
//     name: string;
//     description: string;
//     image: string;
//     logo: string;
//   };

//   return {
//     title,
//     description,
//     openGraph: {
//       title,
//       description,
//       images: [image],
//     },
//     // twitter: {
//     //   card: "summary_large_image",
//     //   title,
//     //   description,
//     //   images: [image],
//     //   creator: "@vercel",
//     // },
//     icons: [logo],
//     metadataBase: new URL(`https://${domain}`),
//     // Optional: Set canonical URL to custom domain if it exists
//     // ...(params.domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
//     //   data.customDomain && {
//     //     alternates: {
//     //       canonical: `https://${data.customDomain}`,
//     //     },
//     //   }),
//   };
// }

export default async function SiteLayout({
  params,
  children,
}: {
  params: { domain: string }
  children: ReactNode
}) {
  let domain = decodeURIComponent(params.domain)

  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'localhost:3000'}`)
  domain = subdomain ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, '') : domain

  const site = await getSiteFromDomain(domain, !subdomain)

  console.log('Domain', domain, subdomain)

  if (!site) {
    notFound()
  }

  // // Optional: Redirect to custom domain if it exists
  // if (
  //   domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
  //   site.customDomain &&
  //   process.env.REDIRECT_TO_CUSTOM_DOMAIN_IF_EXISTS === 'true'
  // ) {
  //   return redirect(`https://${site.customDomain}`)
  // }

  return (
    <>
      <div>
        <div className="ease left-0 right-0 top-0 z-30 flex h-16 bg-white transition-all duration-150 dark:bg-black dark:text-white">
          <div className="mx-auto flex h-full max-w-screen-xl items-center justify-center space-x-5 px-10 sm:px-20">
            <Link href="/" className="flex items-center justify-center">
              <div className="inline-block h-8 w-8 overflow-hidden rounded-full align-middle">
                <Image
                  alt={site.name || ''}
                  height={40}
                  src={site.logo?.url || '/logo.png'}
                  width={40}
                />
              </div>
              <span className="ml-3 inline-block truncate font-title font-medium">{site.name}</span>
            </Link>
          </div>
        </div>

        <div className="mt-20">{children}</div>

        <CTA />
      </div>
      <Script
        id="tinybird_tracker"
        dangerouslySetInnerHTML={{
          __html: `
            var script = document.createElement('script');
            script.defer = true;
            script.src = 'https://unpkg.com/@tinybirdco/flock.js';
            script.setAttribute('data-host', '${config.host ?? 'https://api.us-east.tinybird.co'}');
            script.setAttribute('data-token', '${config.trackerToken ?? ''}');
            script.setAttribute("tb_user_id", '${site?.userId ?? ''}'); // User ID to track tenants
            script.setAttribute("tb_site_id", '${
              site?.id ?? ''
            }'); // Site ID to track site relevant informations
            script.setAttribute("tb_sub_domain", '${
              site?.subdomain ?? ''
            }'); // Subdomain to track relevant redirections
            script.setAttribute("tb_custom_domain", '${
              site?.customDomain ?? ''
            }'); // Custom Domain to track relevant redirections
        
            document.body.appendChild(script);
          `,
        }}
      />
      <script
        defer
        src="https://unpkg.com/@tinybirdco/flock.js"
        data-host="https://api.tinybird.co"
        data-token="p.eyJ1IjogImEzZTgwNDI5LWI3MTUtNDZiZC1hZDViLWFiYTljOTM4Y2E2YSIsICJpZCI6ICJiNTFmNjdhNy0xMjkyLTRjZWQtYTFjYi1hYTQ5ZDZkZDliODkiLCAiaG9zdCI6ICJldV9zaGFyZWQifQ.UdybUQdVWzF6uY55aBr2Y5o8A0RrhfetrQ8njLrFSbo"
      />
      <ToastContainer position="bottom-center" icon={false} />
    </>
  )
}
