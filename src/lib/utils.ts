import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export async function fetcher<JSON = any>(input: RequestInfo, init?: RequestInit): Promise<JSON> {
  const response = await fetch(input, { ...init, cache: 'no-store' })

  return response.json()
}

export const capitalize = (s: string) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export const truncate = (str: string, num: number) => {
  if (!str) return ''
  if (str.length <= num) {
    return str
  }
  return str.slice(0, num) + '...'
}

export const getBlurDataURL = async (url: string | null) => {
  if (!url) {
    return 'data:image/webp;base64,AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='
  }
  try {
    const response = await fetch(`https://wsrv.nl/?url=${url}&w=50&h=50&blur=5`)
    const buffer = await response.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')

    return `data:image/png;base64,${base64}`
  } catch (error) {
    return 'data:image/webp;base64,AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='
  }
}

export const placeholderBlurhash =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAoJJREFUWEfFl4lu4zAMRO3cx/9/au6reMaOdkxTTl0grQFCRoqaT+SQotq2bV9N8rRt28xms87m83l553eZ/9vr9Wpkz+ezkT0ej+6dv1X81AFw7M4FBACPVn2c1Z3zLgDeJwHgeLFYdAARYioAEAKJEG2WAjl3gCwNYymQQ9b7/V4spmIAwO6Wy2VnAMikBWlDURBELf8CuN1uHQSrPwMAHK5WqwFELQ01AIXdAa7XawfAb3p6AOwK5+v1ugAoEq4FRSFLgavfQ49jAGQpAE5wjgGCeRrGdBArwHOPcwFcLpcGU1X0IsBuN5tNgYhaiFFwHTiAwq8I+O5xfj6fOz38K+X/fYAdb7fbAgFAjIJ6Aav3AYlQ6nfnDoDz0+lUxNiLALvf7XaDNGQ6GANQBKR85V27B4D3QQRw7hGIYlQKWGM79hSweyCUe1blXhEAogfABwHAXAcqSYkxCtHLUK3XBajSc4Dj8dilAeiSAgD2+30BAEKV4GKcAuDqB4TdYwBgPQByCgApUBoE4EJUGvxUjF3Q69/zLw3g/HA45ABKgdIQu+JPIyDnisCfAxAFNFM0EFNQ64gfS0EUoQP8ighrZSjn3oziZEQpauyKbfjbZchHUL/3AS/Dd30gAkxuRACgfO+EWQW8qwI1o+wseNuKcQiESjALvwNoMI0TcRzD4lFcPYwIM+JTF5x6HOs8yI7jeB5oKhpMRFH9UwaSCDB2Jmg4rc6E2TT0biIaG0rQhNqyhpHBcayTTSXH6vcDL7/sdqRK8LkwTsU499E8vRcAojHcZ4AxABdilgrp4lsXk8oVqgwh7+6H3phqd8J0Kk4vbx/+sZqCD/vNLya/5dT9fAH8g1WdNGgwbQAAAABJRU5ErkJggg=='

export const toDateString = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export const random = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export const cx = (...args: (string | undefined | false)[]) => args.filter(Boolean).join(' ')

export const formatNumber = (num: number) => Intl.NumberFormat().format(+num)

export function kFormatter(value: number): string {
  return value > 999 ? `${(value / 1000).toFixed(1)}K` : String(value)
}

export function formatMinSec(totalSeconds: number) {
  if (isNaN(totalSeconds)) return '0s'

  const minutes = Math.floor(totalSeconds / 60)
  const seconds = Math.floor(totalSeconds % 60)
  const padTo2Digits = (value: number) => value.toString().padStart(2, '0')
  return `${minutes ? `${minutes}m` : ''} ${padTo2Digits(seconds)}s`
}

export function formatPercentage(value: number) {
  return `${value ? (value * 100).toFixed(2) : '0'}%`
}

export const data: Array<Array<string | number>> = [
  [
    'Domain Name',
    'Short Description',
    'Long Description',
    'Keyword 1',
    'Keyword 2',
    'Keyword 3',
    'Keyword 4',
    'GPT Prompt for content generation',
  ],
]

export const generateSlug = (title: string) => {
  // Convert to lowercase and replace spaces with hyphens
  let slug = title.toLowerCase().replace(/\s+/g, '-')

  // Remove special characters
  slug = slug.replace(/[^\w-]/g, '')

  return slug
}

export const extractImagesFromMarkdown = (markdownContent: string) => {
  // Regular expression to find image tags
  const imageRegex = /!\[.*?\]\((.*?)\)/g
  // Array to store extracted image URLs
  const images = []
  // Match all occurrences of image tags in the Markdown content
  let match
  while ((match = imageRegex.exec(markdownContent)) !== null) {
    // match[1] contains the URL of the image
    images.push(match[1])
  }
  // Log or use the extracted image URLs
  console.log(images)
  return images
}
