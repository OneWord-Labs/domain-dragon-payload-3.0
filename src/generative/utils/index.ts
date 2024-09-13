// Import required modules
import { createOpenAI } from '@ai-sdk/openai'
import { generateText } from 'ai'
import fs from 'fs'
import path from 'path'

import { REWRITE_PROMPT, SUMMARIZE_PROMPT } from '../prompts'

// Use the environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

// Initialize OpenAI API
const openai = createOpenAI({
  apiKey: OPENAI_API_KEY,
  // custom settings, e.g.
  compatibility: 'strict', // strict mode, enable when using the OpenAI API
})

export async function generateFinalBlog(
  entireDraft: string,
  TOPIC_PROMPT: string,
): Promise<null | string> {
  try {
    const { text } = await generateText({
      maxTokens: 3000,
      model: openai.chat('gpt-4o'),
      prompt: `${REWRITE_PROMPT}\n\n${entireDraft}\n\n${TOPIC_PROMPT}`,
      temperature: 0.5,
    })
    const finalBlog = text

    // Save the blog in a markdown file
    // fs.writeFileSync('bloggpt/outputs/blog.md', finalBlog)

    return finalBlog
  } catch (error) {
    console.error(error)
    return null
  }
}

export function splitOutlinePrompt(OUTLINE_PROMPT: string): {
  blogSections: string[]
  headers: string[]
} {
  console.debug('OUTLINE_PROMPT:', OUTLINE_PROMPT)

  const headers = OUTLINE_PROMPT.split('\n')
    .filter((text) => text.startsWith('#'))
    .map((text) => text.split('#')[1].trim())
  console.debug(' headers:', headers)

  const blogSections = OUTLINE_PROMPT.split('\n\n')
  console.debug('blogSections:')

  return { blogSections, headers }
}

export function combineDrafts(directory: string): string {
  const outputFile = path.join(directory, 'complete_draft.md')
  const draftFiles = fs
    .readdirSync(directory)
    .filter((file) => file.startsWith('draft_') && file.endsWith('.md'))

  draftFiles.sort(
    (a, b) => parseInt(a.split('_')[1].split('.')[0]) - parseInt(b.split('_')[1].split('.')[0]),
  )

  let entireDraft = ''

  const output = fs.createWriteStream(outputFile, { flags: 'w' })

  draftFiles.forEach((filename) => {
    const contents = fs.readFileSync(path.join(directory, filename), 'utf-8')
    output.write(contents + '\n\n')
    entireDraft += contents + '\n\n'
  })

  output.end()
  console.log(`All drafts have been combined into ${outputFile}.`)
  return entireDraft
}

export async function summarizeText(text: string): Promise<null | string> {
  const PROMPT = `${SUMMARIZE_PROMPT}\n\n${text}`

  // Truncate text if larger than 12500 words
  if (text.split(' ').length > 12000) {
    console.log('Truncating text to 12500 words')
    text = text.split(' ').slice(0, 12000).join(' ')
  }

  try {
    const { text: summaryText } = await generateText({
      maxTokens: 300,
      model: openai.chat('gpt-3.5-turbo-0125'),
      prompt: PROMPT,
      temperature: 0,
    })

    return summaryText
  } catch (error) {
    console.error(error)
    return null
  }
}

// // Example usage
// async function main() {
//   const { blogSections, headers } = splitOutlinePrompt(OUTLINE_PROMPT)

//   // Example: Combine drafts from a directory
//   const directory = 'path/to/your/drafts'
//   const entireDraft = combineDrafts(directory)

//   // Example: Generate final blog
//   const finalBlog = await generateFinalBlog(entireDraft, TOPIC_PROMPT)
//   console.log('Final Blog:', finalBlog)

//   // Example: Summarize text
//   const summary = await summarizeText(entireDraft)
//   console.log('Summary:', summary)
// }

// main().catch(console.error)
