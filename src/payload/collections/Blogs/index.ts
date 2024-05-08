import { TipTapEditor } from '@/payload/fields/TiptapEditor'
import { CollectionConfig } from 'payload/types'
import { loggedIn } from '../../access/loggedIn'
import adminOrOwner from './access/adminOrOwner'

const Blogs: CollectionConfig = {
  slug: 'blogs',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    create: loggedIn,
    update: adminOrOwner,
    delete: adminOrOwner,
    read: () => true,
    // admin: admin,
  },
  fields: [
    {
      name: 'title',
      label: 'Title',
      required: true,
      type: 'text',
    },
    {
      name: 'thumbnail',
      label: 'Thumbnail',
      required: true,
      type: 'text',
    },

    ...TipTapEditor({
      name: 'content',
    }),
    {
      name: 'user',
      label: 'User',
      required: true,
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'site',
      label: 'Site',
      required: true,
      type: 'relationship',
      relationTo: 'sites',
    },
    {
      name: 'metaTitle',
      label: 'Meta Title',
      required: true,
      type: 'text',
    },
    {
      name: 'metaImage',
      label: 'Meta Image',
      required: true,
      type: 'text',
    },
    {
      name: 'metaKeywords',
      label: 'Meta Keywords',
      required: true,
      type: 'text',
    },
    {
      name: 'slug',
      label: 'Slug',
      required: true,
      type: 'text',
      unique: true,
      hooks: {
        beforeChange: [
          ({ value, operation }) => {
            if (value.split(':').length > 1) {
              value = value.split(':')[1]
            }
            const slug = `${value
              .trim()
              .toLowerCase()
              .replace(/\s+/g, '-')
              .replace('.', '')}-${Math.floor(Math.random() * 1000000)}`
            return slug
          },
        ],
      },
    },
  ],
}

export default Blogs
