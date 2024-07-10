import { Card } from '@/components/ui/card'
import { getPostsForSite, getSiteFromDomain } from '@/frontend/actions'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { format } from 'date-fns'
import MoreStories from '@/frontend/components/MoreStories'
import AnalyticsMockup from '@/components/analytics'

const Page = async ({ params }: { params: { domain: string } }) => {
  let domain = decodeURIComponent(params.domain)

  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'localhost:3000'}`)
  domain = subdomain ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, '') : domain

  const site = await getSiteFromDomain(domain, !subdomain)

  if (!site?.id) {
    return notFound()
  }

  const blogs = await getPostsForSite(site.id)

  return (
    <>
      <head>
        <script
          defer
          src="https://unpkg.com/@tinybirdco/flock.js"
          data-host="https://api.tinybird.co"
          data-token="p.eyJ1IjogImEzZTgwNDI5LWI3MTUtNDZiZC1hZDViLWFiYTljOTM4Y2E2YSIsICJpZCI6ICJiNTFmNjdhNy0xMjkyLTRjZWQtYTFjYi1hYTQ5ZDZkZDliODkiLCAiaG9zdCI6ICJldV9zaGFyZWQifQ.UdybUQdVWzF6uY55aBr2Y5o8A0RrhfetrQ8njLrFSbo"
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8167785661418158"
          cross-origin="anonymous"
        ></script>
      </head>
      <div className="mb-20 w-full">
        {blogs.length > 0 ? (
          <div className="mx-auto w-full max-w-screen-xl md:mb-28 lg:w-5/6">
            <Link href={`/${blogs[0].slug}`}>
              <div className="group relative mx-auto h-80 w-full overflow-hidden sm:h-150 lg:rounded-xl">
                <Image
                  src={blogs[0].thumbnail?.url ?? ''}
                  alt={blogs[0].title}
                  width={1300}
                  height={630}
                  className="rounded-lg"
                />
              </div>
              <div className="mx-auto mt-10 w-5/6 lg:w-full">
                <h2 className="my-10 font-title text-4xl md:text-6xl dark:text-white">
                  {blogs[0].title}
                </h2>
                <p className="w-full text-base md:text-lg lg:w-2/3 dark:text-white">
                  {blogs[0].description}
                </p>
                <div className="flex w-full items-center justify-start space-x-4">
                  <div className="relative h-8 w-8 flex-none overflow-hidden rounded-full">
                    {site.user?.image ? (
                      <Image src={site.user?.image ?? ''} alt={'User'} className="rounded-lg" />
                    ) : (
                      <div className="absolute flex h-full w-full select-none items-center justify-center bg-stone-100 text-4xl text-stone-500">
                        ?
                      </div>
                    )}
                  </div>
                  <p className="ml-3 inline-block whitespace-nowrap align-middle text-sm font-semibold md:text-base dark:text-white">
                    {site.user?.name}
                  </p>
                  <div className="h-6 border-l border-stone-600 dark:border-stone-400" />
                  <p className="m-auto my-5 w-10/12 text-sm font-light text-stone-500 md:text-base dark:text-stone-400">
                    {format(Date.parse(blogs[0].createdAt), 'MMMM dd, yyyy')}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <Image
              alt="missing post"
              src="https://illustrations.popsy.co/gray/success.svg"
              width={400}
              height={400}
              className="dark:hidden"
            />
            <Image
              alt="missing post"
              src="https://illustrations.popsy.co/white/success.svg"
              width={400}
              height={400}
              className="hidden dark:block"
            />
            <p className="font-title text-2xl text-stone-600 dark:text-stone-400">No posts yet.</p>
          </div>
        )}
      </div>

      <MoreStories blogs={blogs} />
    </>
  )
}

// <div className="max-w-screen-xl xl:mx-auto mx-4">
//   <h2 className="text-lg md:text-xl xl:text-2xl text-white font-semibold my-8">{site.name}</h2>
//   <div className="flex flex-col items-center space-y-5 w-full my-10 justify-items-stretch">
//     {blogs.map((blog, i) => {
//       let blogMarkdown = blog.content.markdown

//       return (
//         <Link href={`/${blog?.slug}`} key={blog?.id}>
//           <Card
//             className="flex flex-row items-start justify-between py-4 px-4 space-x-4"
//             key={i}
//           >
//             <Image
//               src={blog.thumbnail?.url ?? ''}
//               alt={blog.title}
//               width={200}
//               height={200}
//               className="rounded-lg"
//             />
//             <div className="flex flex-col items-start max-w-xl">
//               <h2 className="text-lg text-white font-semibold">{blog.title}</h2>
//               <ReactMarkdown remarkPlugins={[remarkGfm]}>
//                 {blogMarkdown.length > 200
//                   ? `${blogMarkdown.substring(0, 200)}...`
//                   : blogMarkdown}
//               </ReactMarkdown>
//             </div>
//           </Card>
//         </Link>
//       )
//     })}
//   </div>
// </div>
export default Page
