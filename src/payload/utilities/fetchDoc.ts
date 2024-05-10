import qs from 'qs'
import axios from 'axios'
export const fetchDocs = async <T>(
  slug: string,
  where: any,
  limit = 10,
  signalController?: AbortSignal,
): Promise<T[]> => {
  const stringifiedQuery = qs.stringify(
    {
      limit: limit,

      ...where,
      // name: {
      //   equals: theme,
      // },
    },
    { addQueryPrefix: true },
  )
  const doc = await fetch(`/api/${slug}${stringifiedQuery}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    signal: signalController,
  })
    ?.then((res) => res.json())
    ?.then((res) => {
      if (res.errors) throw new Error(res?.errors?.[0]?.message ?? 'Error fetching doc')
      return res?.docs
    })
  return doc
}
export const fetchPaginatedDocs = async <T>(
  slug: string,
  where: any,
  filter?: {
    excludeContentIds: any[]
    isPublished: boolean
  },
  signalController?: AbortSignal,
): Promise<{
  data: T[]
  meta: {
    totalRowCount: number
    hasNextPage: boolean
  }
}> => {
  const stringifiedQuery = qs.stringify(
    {
      limit: 10,

      ...where,
      // name: {
      //   equals: theme,
      // },
    },
    { addQueryPrefix: true },
  )
  const doc = await axios.post(`/api/${slug}${stringifiedQuery}`, { ...filter })

  return {
    data: doc?.data?.docs ?? [],
    meta: {
      hasNextPage: doc?.data?.hasNextPage,
      totalRowCount: doc?.data?.totalDocs,
    },
  }
}

export const GETPaginatedDocs = async <T>(
  slug: string,
  where: any,
  filter?: {
    excludeContentIds: any[]
    isPublished: boolean
  },
  signalController?: AbortSignal,
): Promise<{
  data: T[]
  meta: {
    totalRowCount: number
    hasNextPage: boolean
  }
}> => {
  const stringifiedQuery = qs.stringify(
    {
      limit: 10,

      ...where,
      // name: {
      //   equals: theme,
      // },
    },
    { addQueryPrefix: true },
  )
  const doc = await axios.get(`/api/${slug}${stringifiedQuery}`)

  return {
    data: doc?.data?.docs ?? [],
    meta: {
      hasNextPage: doc?.data?.hasNextPage,
      totalRowCount: doc?.data?.totalDocs,
    },
  }
}
export const fetchDoc = async <T>(
  slug: string,
  where: any,
  signalController?: AbortSignal,
): Promise<T> => {
  const stringifiedQuery = qs.stringify(
    {
      limit: 1,

      ...where,
      // name: {
      //   equals: theme,
      // },
    },
    { addQueryPrefix: true },
  )
  const doc = await fetch(`/api/${slug}${stringifiedQuery}`, {
    method: 'GET',
    signal: signalController,
    headers: {
      'Content-Type': 'application/json',
    },
  })
    ?.then((res) => res.json())
    ?.then((res) => {
      if (res.errors) throw new Error(res?.errors?.[0]?.message ?? 'Error fetching doc')
      return res?.docs?.[0]
    })
  return doc
}

export const getIdFromCollection = (data: any) => {
  return typeof data === 'object' ? data?.id ?? data?._id : data
}

export const getObjectFromCollection = <T>(data: any): T => {
  return data
}
