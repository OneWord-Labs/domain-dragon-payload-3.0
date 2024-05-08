'use server'

export const getSiteFromDomain = async (
  domain: string,
  customdomain: boolean,
): Promise<any | null> => {
  try {
    const res = await fetch(
      customdomain
        ? `${process.env.NEXT_PAYLOAD_API_URL}/api/sites?where[customdomain][equals]=${domain}`
        : `${process.env.NEXT_PAYLOAD_API_URL}/api/sites?where[subdomain][equals]=${domain}`,
      {
        cache: 'no-cache',
      },
    )
    const data = await res.json()

    return data.docs.length > 0 ? data.docs[0] : null
  } catch (err) {
    console.error(err)
    return null
  }
}

export const getPostsForSite = async (id: number): Promise<any[]> => {
  try {
    const res = await fetch(`${process.env.NEXT_PAYLOAD_API_URL}/api/sites/${id}/blogs`, {
      cache: 'no-cache',
    })

    const data = await res.json()

    return data.blogs ? data.blogs : []
  } catch (err) {
    console.error(err)
    return []
  }
}

export const getBlogFromSlug = async (siteId: number, slug: string): Promise<any | null> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PAYLOAD_API_URL}/api/sites/${siteId}/blogs/${slug}`,
      {
        cache: 'no-cache',
      },
    )

    const data = await res.json()

    return data.blog ? data.blog : null
  } catch (err) {
    console.error(err)
    return null
  }
}
