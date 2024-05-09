import { getBlogFromSlug, getPostsForSite, getSiteFromDomain } from '@/frontend/actions'
import BlogHeader from '@/frontend/components/BlogHeader'
import MoreStories from '@/frontend/components/MoreStories'
import { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export async function generateMetadata({
  params,
}: {
  params: { domain: string; slug: string }
}): Promise<Metadata> {
  let domain = decodeURIComponent(params.domain)

  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'localhost:3000'}`)
  domain = subdomain ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, '') : domain

  const site = await getSiteFromDomain(domain, !subdomain)

  if (!site.id) return {}

  const blog = await getBlogFromSlug(site.id, params.slug)

  if (!blog) return {}

  return {
    title: blog.metaTitle,
    openGraph: {
      type: 'article',
      title: blog.metaTitle,
      images: {
        url: blog.thumbnail?.url ?? '',
      },
      tags: blog.metaKeywords,
    },
    keywords: blog.metaKeywords,
  }
}

const Page = async ({ params }: { params: { domain: string; slug: string } }) => {
  let domain = decodeURIComponent(params.domain)

  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'localhost:3000'}`)
  domain = subdomain ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, '') : domain

  const site = await getSiteFromDomain(domain, !subdomain)
  if (!site.id) {
    return notFound()
  }

  const blog = await getBlogFromSlug(site.id, params.slug)
  if (!blog) {
    return notFound()
  }

  const blogs = await getPostsForSite(site.id)

  const adjacentBlogs = blogs.filter((b) => b.id !== blog.id)
  let blogMarkdown = blog.content.markdown

  return (
    <div className="max-w-screen-xl xl:mx-auto mx-4 min-w-screen">
      <BlogHeader blog={blog} />
      <ReactMarkdown
        components={{
          img: ({ node, ...props }) => (
            <Image
              className="rounded-lg"
              quality={100}
              src={props.src!}
              width={1024}
              height={1024}
              alt={props.alt ?? `${blog.slug}-image`}
            />
          ),
        }}
        className="max-w-screen-lg lg:mx-auto mx-4 prose prose-sm md:prose-base break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 font-medium my-10"
        remarkPlugins={[remarkGfm]}
      >
        {blogMarkdown}
      </ReactMarkdown>

      <MoreStories blogs={adjacentBlogs} />
    </div>
  )
}

export default Page
