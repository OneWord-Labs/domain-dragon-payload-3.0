import { sanitizeData } from '@/payload/utilities/sanitizeData'
import type { PayloadHandler } from 'payload/config'
import { PayloadRequest } from 'payload/types'

export const importDomains: PayloadHandler = async (req: PayloadRequest) => {
  if (!req.formData) return new Response('', { status: 400 })
  const data = await req.formData()

  if (!data) {
    return new Response('CSV is missing', { status: 400 })
  }
  const dataJSON = JSON.parse(data.get('data') as any)

  try {
    const sanitizedData = sanitizeData(dataJSON)

    for (const row of sanitizedData) {
      const sites = await req.payload.find({
        collection: 'sites',
        where: {
          customdomain: {
            equals: (row.domain ?? '')?.trim(),
          },
        },
      })

      if (sites?.docs?.length === 0) {
        const newSite = await req.payload.create({
          collection: 'sites',
          data: {
            name: row.domain,
            customdomain: row.domain,
            description: row.short_description,
            longDescription: row.long_description,

            seoKeywords: [
              { keyword: row.keyword_1 ?? '' },
              { keyword: row.keyword_2 ?? '' },
              { keyword: row.keyword_3 ?? '' },
            ],
            user: typeof req.user === 'object' ? req?.user?.id : req.user,
          },
        })
      }
    }
  } catch (err: unknown) {
    console.log(err)
    return new Response('Error uploading domain', { status: 500 })
  }

  return new Response('Successfully imported domains', { status: 200 })
  //   return new Response(JSON.stringify(response), { status: 200 })
}
