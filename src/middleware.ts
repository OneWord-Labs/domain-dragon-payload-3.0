import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)',
  ],
}

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl

  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  let hostname = req.headers
    .get('host')!
    .replace('.localhost:3000', `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)

  const searchParams = req.nextUrl.searchParams.toString()
  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ''}`
  if (path?.startsWith('/api')) {
    console.log(
      hostname,
      `Rewriting ${req.url} to ${new URL(`${process.env.NEXT_PAYLOAD_API_URL}${path}`).toString()}`,
    )
    return NextResponse.rewrite(new URL(`${process.env.NEXT_PAYLOAD_API_URL}${path}`))
  }
  if (path?.startsWith('/admin') && hostname !== `app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
    console.log(
      hostname,
      `Rewriting ${req.url} to ${new URL(`${process.env.NEXT_PAYLOAD_API_URL}${path}`).toString()}`,
    )
    return NextResponse.redirect(new URL(`${process.env.NEXT_PAYLOAD_API_URL}${path}`))
  }
  if (!path?.startsWith('/admin') && hostname === `app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
    console.log(
      hostname,
      `Rewriting ${req.url} to ${new URL(`${process.env.NEXT_PAYLOAD_API_URL}/admin`).toString()}`,
    )
    return NextResponse.redirect(new URL(`${process.env.NEXT_PAYLOAD_API_URL}/admin`))
  }
  if (
    path === '/' &&
    (hostname === 'localhost:3000' || hostname === `${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
  ) {
    return NextResponse.rewrite(new URL('https://domaindragon.framer.website/'))
  }

  if (
    hostname === 'localhost:3000' ||
    hostname === process.env.NEXT_PAYLOAD_API_URL ||
    hostname === `app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
  ) {
    return NextResponse.rewrite(new URL(req.url))
  }

  console.log(
    hostname,
    `Rewriting ${req.url} to ${new URL(`/${hostname}${path}`, req.url).toString()}`,
  )
  // rewrite everything else to `/[domain]/[slug] dynamic route
  return NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url))
}
