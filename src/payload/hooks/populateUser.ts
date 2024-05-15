import { CollectionBeforeChangeHook } from 'payload/types'

export const populateUser: CollectionBeforeChangeHook = async ({ data, req }) => {
  if (req?.user) {
    const userDoc = await req.payload.findByID({
      collection: 'users',
      id: typeof req.user === 'object' ? (req?.user?.id as any) : (req?.user as any),
      depth: 0,
    })

    return {
      ...data,
      user: userDoc?.id,
    }
  }

  return data
}
