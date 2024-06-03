import { CollectionBeforeChangeHook } from 'payload/types'
import slugify from 'slugify'
// import { addDomainFunc } from '../endpoints/addDomain'
import { populateUser } from '@/payload/hooks/populateUser'
import { addDomainFunc } from '../../Domains/endpoints/addDomain'

export const addDomainToSite: CollectionBeforeChangeHook = async ({
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

    const docsWithUser = await populateUser({ data, operation, req, collection, context })

    const domain = await req.payload.create({
      collection: 'domains',
      data: {
        name: data.name,
        user: docsWithUser.user,
      },
    })
    console.log('Created Domain', data.name, domain.id)
    await addDomainFunc(data.name)

    return {
      ...data,
      domain: domain?.id,
      subdomain: slug,
      customdomain: data?.customdomain ?? data.name,
      user: docsWithUser.user,
    }
  }
  return data
}
