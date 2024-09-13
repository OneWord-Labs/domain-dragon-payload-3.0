import { createOpenAI } from '@ai-sdk/openai'
import { generateText } from 'ai'
import fs from 'fs'
import path from 'path'

import { BLOG_SECTION_AGENT_SYSTEM_PROMPT } from '../prompts'
import { generateFinalBlog, splitOutlinePrompt } from '../utils'
import { searchGoogle } from '../utils/web'

// Use the environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY
const GOOGLE_CONTEXT_ID = process.env.GOOGLE_CSE_ID
const PINECONE_ENV = process.env.PINECONE_ENV

// Initialize OpenAI API
const openai = createOpenAI({
  apiKey: OPENAI_API_KEY,
  // custom settings, e.g.
  compatibility: 'strict', // strict mode, enable when using the OpenAI API
})

export async function getTopicContext(topic: string) {
  try {
    const context = await searchGoogle(topic, GOOGLE_API_KEY ?? '', GOOGLE_CONTEXT_ID ?? '')
    return context.join('\n')
  } catch (e) {
    console.error(`Error occurred while searching for ${topic}: ${e}`)
    throw e
  }
}

export async function generateBlogSection(header: string, blogSection: string, context: string) {
  const GENERATE_BLOG_SECTION_PROMPT = BLOG_SECTION_AGENT_SYSTEM_PROMPT.replace(
    '{TOPIC_PROMPT}',
    header,
  )
    .replace('{BLOG_SECTION_OUTLINE_PROMPT}', blogSection)
    .replace('{CONTEXT}', context)

  try {
    const { text } = await generateText({
      maxTokens: 1500,
      model: openai.chat('gpt-3.5-turbo-0125'),
      prompt: GENERATE_BLOG_SECTION_PROMPT,
      temperature: 0.7,
    })

    return text.trim()
  } catch (e) {
    console.error(`Error occurred while generating blog section ${header}: ${e}`)
    return null
  }
}

export function saveBlogSection(generatedBlog: string, header: string, numGenerated: number) {
  const filePath = path.join('outputs', `draft_${numGenerated}.md`)
  try {
    fs.writeFileSync(filePath, generatedBlog)
  } catch (e) {
    console.error(`Error occurred while saving blog section ${header}: ${e}`)
  }
}

export async function combineAndFinalizeDraft(generatedBlogs: string[], topic: string) {
  try {
    const entireDraft = generatedBlogs.join('\n\n')

    const finalBlog = await generateFinalBlog(entireDraft, topic)
    return finalBlog ?? ''
  } catch (e) {
    console.error(`Error occurred while finalizing blog: ${e}`)
    return ''
  }
}

export async function runBloggpt(topicStr: string, blogOutline: string) {
  const topic = topicStr.trim()
  const context = await getTopicContext(topic)
  const { blogSections, headers } = splitOutlinePrompt(blogOutline)

  const generatedBlogs = []
  for (let numGenerated = 0; numGenerated < headers.length; numGenerated++) {
    const header = headers[numGenerated]
    const blogSection = blogSections[numGenerated]

    const generatedBlog = await generateBlogSection(header, blogSection, context)

    if (generatedBlog) {
      generatedBlogs.push(generatedBlog)
      // saveBlogSection(generatedBlog, header, numGenerated)
    }
  }

  return await combineAndFinalizeDraft(generatedBlogs, topic)
}
