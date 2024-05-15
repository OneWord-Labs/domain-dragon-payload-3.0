import { PayloadHandler } from 'payload/config'
import { PayloadRequest } from 'payload/types'

export const addDomain: PayloadHandler = async (req: PayloadRequest) => {
  const { domain } = req.query

  const data = await addDomainFunc((domain as string) ?? '')

  if (data.error?.code == 'forbidden') {
    return new Response('Forbidden', { status: 403 })
  } else if (data.error?.code == 'domain_taken') {
    return new Response('', { status: 409 })
  } else {
    return new Response('', { status: 200 })
  }
}

export const addDomainFunc = async (domain: string) => {
  const response = await fetch(
    `https://api.vercel.com/v9/projects/${process.env.PROJECT_ID_VERCEL}/domains?teamId=${process.env.TEAM_ID_VERCEL}`,
    {
      body: `{\n  "name": "${domain}"\n}`,
      headers: {
        Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    },
  )

  const data = await response.json()

  return data
}
