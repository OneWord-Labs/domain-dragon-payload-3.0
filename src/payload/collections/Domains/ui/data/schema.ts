import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const domainSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.string(),
  aiEnabled: z.boolean(),
  traffic: z.string(),
  revenue: z.string(),
  conversion: z.string(),
  record: z.object({
    CNAME: z.string(),
    A: z.string(),
  }),
  user: z.any(),
  createdAt: z.string(),
  updatedAt: z.string(),
  contentCurationList: z.any(),
})

export type Domain = z.infer<typeof domainSchema>
