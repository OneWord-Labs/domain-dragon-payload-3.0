import { TipTapEditor } from '@/payload/fields/TiptapEditor'
import { CollectionConfig } from 'payload/types'
import { loggedIn } from '../../access/loggedIn'
import adminOrOwner from './access/adminOrOwner'
import slugify from 'slugify'
import { populateUser } from '@/payload/hooks/populateUser'

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
  hooks: {
    beforeChange: [populateUser],
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

      type: 'upload',
      relationTo: 'media',
      required: true,
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
      admin: {
        position: 'sidebar',
        condition: (data) => {
          return !!data?.id
        },
        readOnly: true,
      },
    },
    {
      name: 'site',
      label: 'Site',
      required: true,
      type: 'relationship',
      relationTo: 'sites',
      admin: {
        position: 'sidebar',
        condition: (data) => {
          return !!data?.id
        },
        readOnly: true,
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'metaTitle',
          label: 'Meta Title',
          required: true,
          type: 'text',
        },
        {
          name: 'metaKeywords',
          label: 'Meta Keywords',
          required: true,
          type: 'text',
        },
      ],
    },
    {
      name: 'metaImage',
      label: 'Meta Image',
      required: true,
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'slug',
      label: 'Slug',
      required: true,
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
        condition: (data) => {
          return !!data?.id
        },
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ value, operation }) => {
            if (operation === 'create') {
              if (value.split(':').length > 1) {
                value = value.split(':')[1]
              }

              const slug = `${slugify(value, {
                lower: true,
                remove: /[*+~\/\\.()'"!?#\.,:@]/g,
              })}-${Math.floor(Math.random() * 1000000)}`
              return slug
            }
            return value
          },
        ],
      },
    },
  ],
}

export default Blogs
