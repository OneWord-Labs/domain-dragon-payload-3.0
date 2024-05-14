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
      await req.payload.create({
        collection: 'domains',
        data: {
          name: row.name,
        },
      })
    }
  } catch (err: unknown) {
    console.log(err)
  }

  return new Response()
  //   return new Response(JSON.stringify(response), { status: 200 })
}
