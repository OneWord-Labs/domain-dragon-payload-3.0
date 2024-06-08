import { mongooseAdapter } from '@payloadcms/db-mongodb'
// import { payloadCloud } from '@payloadcms/plugin-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload/config'
// import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { Logo } from './graphics/Logo'
import Blogs from './payload/collections/Blogs'
import Domains from './payload/collections/Domains'
import { Media } from './payload/collections/Media/Media'
import Sites from './payload/collections/Sites'
import Users from './payload/collections/Users'
import { CustomNav } from './payload/components/CustomNav'
import { RegisterButton } from './payload/components/RegisterButton'
import { ReactQueryProvider } from './payload/providers/ReactQueryProvider'
import { Icon } from './graphics/Icon'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const payloadConfig = {
  admin: {
    user: Users.slug,
    components: {
      providers: [ReactQueryProvider],
      afterLogin: [RegisterButton],
      Nav: CustomNav,
      graphics: {
        Logo: Logo,
        Icon: Icon,
      },
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
}

export default buildConfig(payloadConfig)
