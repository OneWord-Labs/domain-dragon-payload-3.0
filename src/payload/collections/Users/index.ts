import { CollectionConfig } from 'payload/types'
import { adminsOrSelf, adminsOrSelfFieldLevel } from './access/adminsOrSelf'
import admin from '../../access/admin'

const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 60 * 60 * 24 * 7,
    verify: false,
    lockTime: 600 * 1000,
    cookies: {
      // sameSite: 'none',
      secure: true,
    },
  },
  access: {
    create: () => true,
    read: adminsOrSelf,
    update: adminsOrSelf,
    delete: adminsOrSelf,
    // admin: admin,
  },
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      label: 'Last Name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'User',
          value: 'user',
        },
      ],
      access: {
        read: adminsOrSelfFieldLevel,
        create: admin,
        update: admin,
      },
      defaultValue: 'user',
      required: true,
    },
  ],
}

export default Users
