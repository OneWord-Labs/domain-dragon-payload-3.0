import { CollectionConfig } from 'payload/types'
import { loggedIn } from '../../access/loggedIn'
import adminOrOwner from './access/adminOrOwner'
import { populateUser } from '@/payload/hooks/populateUser'

const Sites: CollectionConfig = {
  slug: 'sites',
  admin: {
    useAsTitle: 'name',
  },
  hooks: {
    beforeChange: [populateUser],
  },
  fields: [
    {
      name: 'event',
      type: 'json',
      required: true,
    },
    { name: 'message', type: 'text' },
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
  ],

  access: {
    read: () => true,
    create: loggedIn,
    delete: adminOrOwner,
    update: adminOrOwner,
    // admin: admin,
  },
}

export default Sites
