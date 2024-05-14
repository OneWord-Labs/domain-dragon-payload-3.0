import { PayloadHandler } from 'payload/config'
import { PayloadRequest } from 'payload/types'

export const verifyDomain: PayloadHandler = async (req: PayloadRequest) => {
  const { domain } = req.query

  const response = await fetch(
    `https://api.vercel.com/v9/projects/${process.env.PROJECT_ID_VERCEL}/domains/${domain}/verify?teamId=${process.env.TEAM_ID_VERCEL}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    },
  )

  const data = await response.json()
  return new Response(JSON.stringify(data), { status: response.status })
}
