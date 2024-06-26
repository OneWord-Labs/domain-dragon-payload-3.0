import type { Access } from 'payload/config'

const adminOrOwner: Access = ({ req: { user } }) => {
  if (user) {
    if (user.role === 'admin') return true

    return {
      user: {
        equals: user?.id,
      },
    }
  }
  return true
}

export default adminOrOwner
