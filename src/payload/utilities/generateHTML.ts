import TurndownService from 'turndown'

import { generateJSON } from '@tiptap/html'
import StarterKit from '@tiptap/starter-kit'

export const generateContent = (html: string): { html: string; json: any; markdown: string } => {
  const turndownService = new TurndownService()

  const markdown = turndownService.turndown(html ?? '')
  const json = generateJSON(html, [
    StarterKit,
    // other extensions …
  ])

  return {
    json: json,
    markdown: markdown,
    html: html,
  }
}
