import { PayloadHandler } from 'payload/config'
import { PayloadRequest } from 'payload/types'

export const removeDomain: PayloadHandler = async (req: PayloadRequest) => {
  const { domain } = req.query

  // not required –> only for this demo to prevent removal of a few restricted domains
  if (restrictedDomains.includes(domain as string)) {
    return new Response('', { status: 403 })
  }

  const response = await fetch(
    `https://api.vercel.com/v9/projects/${process.env.PROJECT_ID_VERCEL}/domains/${domain}?teamId=${process.env.TEAM_ID_VERCEL}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
      },
      method: 'DELETE',
    },
  )

  const json = await response.json()
  return new Response(JSON.stringify(json), { status: 200 })
}

const restrictedDomains = ['portfolio.steventey.com', 'cat.vercel.pub']
