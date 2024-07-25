import { getBlogFromSlug, getPostsForSite, getSiteFromDomain } from '@/frontend/actions'
import BlogHeader from '@/frontend/components/BlogHeader'
import { CustomMarkdown } from '@/frontend/components/Markdown'
import MoreStories from '@/frontend/components/MoreStories'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import RichText from '@/components/RichText'
import SiteAnalytics from '../analytics/page'

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

  if (params?.slug === 'analytics') return <SiteAnalytics params={params} />
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

      <RichText content={blog.content as any} enableGutter={false} />
      {/* <CustomMarkdown markdown={blogMarkdown} /> */}

      <MoreStories blogs={adjacentBlogs} />
    </div>
  )
}

export default Page
