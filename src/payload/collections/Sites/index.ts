import { CollectionConfig, PayloadRequest } from 'payload/types'
import { loggedIn } from '../../access/loggedIn'
import adminOrOwner from './access/adminOrOwner'

const Sites: CollectionConfig = {
  slug: 'sites',
  admin: {
    useAsTitle: 'name',
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
      required: true,
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
  ],
}

export default Sites
