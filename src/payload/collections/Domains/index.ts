import { CollectionConfig } from 'payload/types'
import { loggedIn } from '../../access/loggedIn'
import adminOrOwner from './access/adminOrOwner'
import { DomainsLayout } from './ui'

const Domains: CollectionConfig = {
  slug: 'domains',
  admin: {
    useAsTitle: 'name',
    components: {
      views: {
        List: DomainsLayout,
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
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        {
          label: 'Active',
          value: 'active',
        },
        {
          label: 'Not Active',
          value: 'notActive',
        },
      ],
      defaultValue: 'notActive',
    },
    {
      name: 'aiEnabled',
      label: 'AI Content',
      type: 'checkbox',
      defaultValue: false,
    },

    {
      name: 'traffic',
      label: 'Traffic',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'revenue',
      label: 'Revenue',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'conversion',
      label: 'Conversion',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'record',
      type: 'group',
      fields: [
        {
          name: 'CNAME',
          type: 'text',
        },
        {
          name: 'A',
          type: 'text',
          required: true,
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
  ],
  access: {
    read: () => true,
    create: loggedIn,
    delete: adminOrOwner,
    update: adminOrOwner,
    // admin: admin,
  },
}

export default Domains
