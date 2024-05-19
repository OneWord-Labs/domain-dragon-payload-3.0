import { generateTemplate } from '@/payload/utilities/generateTemplate'
import { PayloadHandler } from 'payload/config'

export const exportDomainTemplate: PayloadHandler = generateTemplate({
  fields: [
    {
      key: 'domain',
      type: 'string',
    },
    {
      key: 'short_description',
      type: 'string',
    },
    {
      key: 'long_description',
      type: 'string',
    },
    {
      key: 'keyword_1',
      type: 'string',
    },
    {
      key: 'keyword_2',
      type: 'string',
    },
    {
      key: 'keyword_3',
      type: 'string',
    },
  ],
})
