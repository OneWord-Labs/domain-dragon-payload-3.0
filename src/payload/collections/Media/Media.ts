import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { UploadApiResponse } from 'cloudinary'
import type { CollectionConfig } from 'payload'
import {
  GROUP_NAME,
  afterDeleteHook,
  afterReadHook,
  beforeChangeHook,
  mapRequiredFields,
} from './Cloudinary'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [beforeChangeHook],
    afterDelete: [afterDeleteHook],
    afterRead: [afterReadHook],
  },

  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
    {
      name: GROUP_NAME,
      type: 'group',
      fields: [...mapRequiredFields()],
      admin: { readOnly: true },
    },
  ],
  upload: {
    disableLocalStorage: true,
    adminThumbnail: ({ doc }) => {
      return (doc[GROUP_NAME] as UploadApiResponse)?.secure_url
    },
  },
}
