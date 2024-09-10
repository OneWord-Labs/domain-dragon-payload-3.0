import { mongooseAdapter } from '@payloadcms/db-mongodb'
// import { payloadCloud } from '@payloadcms/plugin-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
// import sharp from 'sharp'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import Blogs from './payload/collections/Blogs'
import Domains from './payload/collections/Domains'
import { Media } from './payload/collections/Media/Media'
import Sites from './payload/collections/Sites'
import Users from './payload/collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    components: {
      providers: ['src/payload/providers/ReactQueryProvider.tsx#ReactQueryProvider'],
      afterLogin: ['src/payload/components/RegisterButton.tsx#RegisterButton'],
      Nav: 'src/payload/components/CustomNav.tsx#CustomNav',

      graphics: {
        Icon: 'src/graphics/Icon/index.tsx#Icon',
        Logo: 'src/graphics/Logo/index.tsx#Logo',
      },
    },
    meta: {
      title: 'Domain Dragon',
      titleSuffix: '- Domain Dragon',
      description: 'Bringing the power of AI to top domainers worldwide.',
      icons: [
        {
          rel: 'icon',
          type: 'image/png',
          url: '/favicon.png',
          fetchPriority: 'high',
        },
        {
          type: 'image/svg+xml',
          fetchPriority: 'high',
          url: '/favicon.svg',
          sizes: '16x16',
        },
        {
          type: 'image/png',
          fetchPriority: 'high',
          url: '/favicon-16x16.png',
          sizes: '16x16',
        },
        {
          type: 'image/png',
          fetchPriority: 'high',
          url: '/favicon-32x32.png',
          sizes: '32x32',
        },
        {
          rel: 'apple-touch-icon',
          type: 'image/png',
          fetchPriority: 'high',
          url: '/apple-touch-icon.png',
        },
      ],
      openGraph: {
        description: 'Bringing the power of AI to top domainers worldwide.',
        siteName: 'Domain Dragon',
        title: 'Dashboard - Domain Dragon',
      },
      keywords: 'Domain Dragon, CMS',
    },
  },

  collections: [Users, Blogs, Sites, Domains, Media],
  editor: lexicalEditor({}),
  // plugins: [payloadCloud()], // TODO: Re-enable when cloud supports 3.0
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),

  // Sharp is now an optional dependency -
  // if you want to resize images, crop, set focal point, etc.
  // make sure to install it and pass it to the config.

  // This is temporary - we may make an adapter pattern
  // for this before reaching 3.0 stable
  // sharp,
})
