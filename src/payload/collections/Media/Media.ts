import path from 'path'
import type { CollectionConfig } from 'payload/types'
import {
  GROUP_NAME,
  afterDeleteHook,
  afterReadHook,
  beforeChangeHook,
  mapRequiredFields,
} from './Cloudinary'
import { UploadApiResponse } from 'cloudinary'

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
      type: 'text',
    },

    {
      name: GROUP_NAME,
      type: 'group',
      fields: [...mapRequiredFields()],
      admin: { readOnly: true },
    },
  ],
  upload: {
    adminThumbnail: ({ doc }) => {
      return (doc[GROUP_NAME] as UploadApiResponse)?.secure_url
    },
  },
}
