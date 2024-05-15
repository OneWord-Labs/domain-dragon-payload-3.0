import { CollectionBeforeChangeHook } from 'payload/types'
import slugify from 'slugify'
import { addDomainFunc } from '../endpoints/addDomain'
import { populateUser } from '@/payload/hooks/populateUser'

export const addSiteToDomain: CollectionBeforeChangeHook = async ({
  data,
  operation,
  req,
  collection,
  context,
}) => {
  if (operation === 'create') {
    const slug = `${slugify(data.name, {
      lower: true,
      remove: /[*+~\/\\.()'"!?#\.,:@]/g,
    })}`

    await addDomainFunc(data.name)

    const docsWithUser = await populateUser({ data, operation, req, collection, context })

    const site = await req.payload.create({
      collection: 'sites',
      data: {
        name: data.name,
        subdomain: slug,
        user: docsWithUser.user,
      },
    })

    return {
      ...data,
      site: site?.id,
      user: docsWithUser.user,
    }
  }
  return data
}
