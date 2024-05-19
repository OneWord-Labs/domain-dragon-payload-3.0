import { ChatOpenAI } from '@langchain/openai'
import { PromptTemplate } from '@langchain/core/prompts'
import { Client } from '@octoai/client'
import crypto from 'crypto'
import { Payload } from 'payload'
import { generateContent } from './generateHTML'

const octoai = new Client()

const model = new ChatOpenAI({
  modelName: 'gpt-3.5-turbo',
})

const ideaPromptTemplate = PromptTemplate.fromTemplate(`
    You are idea Chatbot made for generating blog ideas based on the given keywords. You need to make sure the ideas are unique and are not repeated it should be always new based on the keyword. You only need to return 1 idea do not need to chat. Do not use quotation marks or colons or anything just return the idea.

    keywords: {keywords}
`)

export const generateIdea = async (keywords: string): Promise<string> => {
  const ideaChain = ideaPromptTemplate.pipe(model)

  const result = await ideaChain.invoke({ keywords })
  return result.content as string
}

const outlinePrompt = PromptTemplate.fromTemplate(`
    You are an outline Chatbot made for generating blog outlines based on the given idea. You only need to return the idea do not need to chat. 

    idea: {idea}
`)

export const generateOutline = async (idea: string): Promise<string> => {
  const outlineChain = outlinePrompt.pipe(model)

  const result = await outlineChain.invoke({ idea })
  return result.content as string
}

const thumbnailDescriptionPrompt = PromptTemplate.fromTemplate(`
    You are a thumbnail artist. Based on the idea given below generate a description of the image that would suit the blog. You only need to return the description do not chat. Do not use quotation marks or colons or anything just return the description.

    idea: {idea}
`)

export const generateThumbnailDescription = async (idea: string): Promise<string> => {
  const thumbnailChain = thumbnailDescriptionPrompt.pipe(model)

  const result = await thumbnailChain.invoke({ idea })
  return result.content as string
}

export const generateThumbnail = async (
  description: string,
): Promise<{
  fileName: string
  buffer: Buffer
}> => {
  const inputs = {
    prompt: description,
    width: 1344,
    height: 768,
    num_images: 1,
    sampler: 'DDIM',
    steps: 30,
    cfg_scale: 12,
    use_refiner: true,
    high_noise_frac: 0.8,
    style_preset: 'digital-art',
  }

  const outputs = await octoai.infer<any>('https://image.octoai.run/generate/sdxl', inputs)
  const buffer = Buffer.from(outputs.images[0].image_b64, 'base64')

  const fileName = crypto.randomBytes(8).toString('hex')
  const blobName = `${fileName}.png`

  //   const res = await edgestoreClient.thumbnails.upload({
  //     content: {
  //       blob: new Blob([buffer], {
  //         type: 'image/png',
  //       }),
  //       extension: 'png',
  //     },
  //     options: {
  //       manualFileName: blobName,
  //     },
  //   })

  //   return res.url
  return {
    fileName: blobName,
    buffer,
  }
}

const blogPrompt = PromptTemplate.fromTemplate(`
    You are a blog Chatbot made for generating blog based on the given outline. You only need to return the blog and do not chat. Make sure the blog is unique and not repeated. Make sure it uses simple words but make it about 700 words, you can use html tags. Only return the blog do not chat.

    outline: {outline}
`)

export const generateBlogContent = async (outline: string): Promise<string> => {
  const blogChain = blogPrompt.pipe(model)

  const result = await blogChain.invoke({ outline })
  return result.content as string
}

export const generateFinalBlog = async (keywords: string) => {
  let idea = await generateIdea(keywords)
  const outline = await generateOutline(idea)
  const blog = await generateBlogContent(outline)
  const thumbnailDescription = await generateThumbnailDescription(idea)
  const thumbnail = await generateThumbnail(thumbnailDescription)
  idea = idea.replace(/["']/g, '')

  return { idea, outline, blog, thumbnailDescription, thumbnail }
}

export const createBlog = async (site: any, payload: Payload) => {
  try {
    const keywords = site.seoKeywords.map((keyword: any) => keyword.keyword).join(', ')
    const { idea, outline, blog, thumbnailDescription, thumbnail } = await generateFinalBlog(
      keywords,
    )
    const content = generateContent(blog)

    const media = await payload.create({
      collection: 'media',
      data: {
        alt: thumbnail.fileName,
        caption: thumbnailDescription,
      },
      file: {
        data: thumbnail.buffer,
        mimetype: 'image/png',
        name: thumbnail.fileName,
        size: thumbnail.buffer.length,
      },
    })

    await payload.create({
      collection: 'blogs',
      data: {
        title: idea,
        content: content,
        user: site.user.id,
        site: site.id,
        thumbnail: media.id,
        metaTitle: idea,
        metaImage: media.id,
        metaKeywords: keywords,
        slug: idea,
      },
    })
  } catch (err: any) {
    payload.logger.error(err)
    throw err
  }
}
