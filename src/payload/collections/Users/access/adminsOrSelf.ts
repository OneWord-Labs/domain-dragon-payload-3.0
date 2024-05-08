import type { Access } from 'payload/config'
import { FieldAccess } from 'payload/types'

export const adminsOrSelf: Access = ({ req: { user } }) => {
  if (user) {
    if (user.role === 'admin') return true

    return {
      id: {
        equals: user.id,
      },
    }
  }
  return false
}

export const adminsOrSelfFieldLevel: FieldAccess = ({ req: { user } }) => {
  if (user) {
    if (user.role === 'admin') return true

    // return {
    //   id: {
    //     equals: user.id,
    //   },
    // }
  }
  return false
}
