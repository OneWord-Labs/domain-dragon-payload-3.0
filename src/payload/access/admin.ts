import { Access, PayloadRequestWithData } from 'payload/types'

const admin: ({ req }: { req: PayloadRequestWithData }) => Promise<boolean> | boolean = async ({
  req,
}) => {
  if (req.user) {
    return req.user.role === 'admin'
  }
  return false
}

export default admin
