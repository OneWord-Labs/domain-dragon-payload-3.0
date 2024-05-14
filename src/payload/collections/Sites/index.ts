import { CollectionConfig, PayloadRequest } from 'payload/types'
import { loggedIn } from '../../access/loggedIn'
import adminOrOwner from './access/adminOrOwner'
import { createBlog } from '@/payload/utilities/generate'
import { SiteAdmin } from './ui'

const Sites: CollectionConfig = {
  slug: 'sites',
  admin: {
    useAsTitle: 'name',
    components: {
      views: {
        List: SiteAdmin,
      },
    },
  },
  fields: [
    {
      name: 'name',
      label: 'Name',
      required: true,
      type: 'text',
    },
    {
      name: 'subdomain',
      label: 'Subdomain',
      type: 'text',
      required: false,
      unique: true,
    },
    {
      name: 'customdomain',
      label: 'Custom Domain',
      type: 'text',
      required: false,
      unique: true,
    },
    {
      name: 'seoKeywords',
      label: 'SEO Keywords',
      required: true,
      type: 'array',
      fields: [
        {
          name: 'keyword',
          label: 'Keyword',
          type: 'text',
        },
      ],
    },
    {
      name: 'user',
      label: 'User',
      required: true,
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'logo',
      label: 'Logo',
      type: 'upload',
      relationTo: 'media',
    },
  ],
  access: {
    read: () => true,
    create: loggedIn,
    delete: adminOrOwner,
    update: adminOrOwner,
    // admin: admin,
  },
  endpoints: [
    {
      path: '/:id/blogs',
      method: 'get',
      handler: async (req: PayloadRequest) => {
        const siteId = req.routeParams?.id
        const blogs = await req.payload.find({
          collection: 'blogs',
          where: {
            site: {
              equals: siteId,
            },
          },
        })

        return new Response(JSON.stringify({ blogs: blogs.docs }), {
          status: 200,
        })
      },
    },

    {
      path: '/:id/blogs/:slug',
      method: 'get',
      handler: async (req: PayloadRequest) => {
        const siteId = req.routeParams?.id

        const blog = await req.payload.find({
          collection: 'blogs',
          where: {
            and: [
              {
                site: {
                  equals: siteId,
                },
              },
              {
                slug: {
                  equals: decodeURIComponent((req.routeParams?.slug as string) ?? ''),
                },
              },
            ],
          },
        })
        return new Response(JSON.stringify({ blog: blog.docs[0] }), {
          status: 200,
        })
      },
    },

    {
      method: 'get',
      path: '/generate/:id',
      handler: async (req: PayloadRequest) => {
        const siteId = req.routeParams?.id
        if (!siteId) return new Response('Bad Request', { status: 400 })

        const site = await req.payload.findByID({
          collection: 'sites',
          id: siteId as string,
        })
        if (!site) return new Response('Site not found', { status: 404 })

        await createBlog(site, req.payload)
        return new Response(JSON.stringify({ message: 'Blog generated' }), {
          status: 200,
        })
      },
    },
  ],
}

export default Sites
