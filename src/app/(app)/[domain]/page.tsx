import { Card } from '@/components/ui/card'
import { getPostsForSite, getSiteFromDomain } from '@/frontend/actions'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

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
    <div className="max-w-screen-xl xl:mx-auto mx-4">
      <h2 className="text-lg md:text-xl xl:text-2xl text-white font-semibold my-8">{site.name}</h2>
      <div className="flex flex-col items-center space-y-5 w-full my-10 justify-items-stretch">
        {blogs.map((blog, i) => {
          let blogMarkdown = blog.content.markdown

          return (
            <Link href={`/${blog?.slug}`} key={blog?.id}>
              <Card
                className="flex flex-row items-start justify-between py-4 px-4 space-x-4"
                key={i}
              >
                {/* <Image
              src={blog.thumbnail}
              alt={blog.title}
              width={200}
              height={200}
              className="rounded-lg"
            /> */}
                <div className="flex flex-col items-start max-w-xl">
                  <h2 className="text-lg text-white font-semibold">{blog.title}</h2>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {blogMarkdown.length > 200
                      ? `${blogMarkdown.substring(0, 200)}...`
                      : blogMarkdown}
                  </ReactMarkdown>
                </div>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default Page
