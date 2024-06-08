import { createOpenAI } from '@ai-sdk/openai'
import { generateText } from 'ai'
import axios from 'axios'
import cheerio from 'cheerio'
import dotenv from 'dotenv'
import fs from 'fs'
import { google } from 'googleapis'
// import pdfParse from 'pdf-parse'

// Load environment variables from .env file
dotenv.config()

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
export function cleanText(text: string): string {
  return text.trim().replace(/\s+/g, ' ').replace(/\n+/g, '\n')
}

// export async function getPdfText(url: string): Promise<null | string> {
//   try {
//     console.log(`Fetching content from ${url}`)
//     const response = await axios.get(url, { responseType: 'arraybuffer' })
//     const data = await pdfParse(response.data)
//     return data.text
//   } catch (err) {
//     console.warn(`Error occurred for ${url}: ${err}`)
//     return null
//   }
// }

export async function getWebsiteText(url: string): Promise<null | string> {
  try {
    console.log(`Fetching content from ${url}`)
    const response = await axios.get(url)

    // if (response.headers['content-type'].includes('application/pdf')) {
    //   return await getPdfText(url)
    // }

    const encoding = response.headers['content-encoding'] || 'utf-8'
    const decodedContent = response.data.toString(encoding)

    const $ = cheerio.load(decodedContent)
    const text = $('body').text()
    const cleanedText = cleanText(text)

    return cleanedText
  } catch (err) {
    console.warn(`Error occurred for ${url}: ${err}`)
    return null
  }
}

export async function getWebsiteSummary(url: string): Promise<null | string> {
  try {
    console.log(`Fetching content from ${url}`)
    const response = await axios.get(url)

    // if (response.headers['content-type'].includes('application/pdf')) {
    //   const text = await getPdfText(url)
    //   const cleanedText = cleanText(text)
    //   return await summarizeText(cleanedText)
    // }

    const encoding = response.headers['content-encoding'] || 'utf-8'
    const decodedContent = response.data.toString(encoding)

    const $ = cheerio.load(decodedContent)
    const text = $('body').text()
    const cleanedText = cleanText(text)

    return await summarizeText(cleanedText)
  } catch (err) {
    console.error(`Error occurred for ${url}: ${err}`)
    return null
  }
}

export async function summarizeText(text: string): Promise<null | string> {
  try {
    const { text: textOut } = await generateText({
      maxTokens: 150,
      model: openai.chat('gpt-3.5-turbo-0125'),
      prompt: text,
      temperature: 0,
    })
    return text.trim()
  } catch (err) {
    console.error(`Error during text summarization: ${err}`)
    return null
  }
}

export async function searchGoogle(
  query: string,
  apiKey: string,
  cxId: string,
  startIndex = 1,
  numResults = 10,
): Promise<string[]> {
  const service = google.customsearch('v1')
  const res = await service.cse.list({
    cx: cxId,
    key: apiKey,
    num: numResults,
    q: query,
    start: startIndex,
  })

  return res.data.items?.map((item) => item.link ?? '') || []
}

export async function searchAndExtractWebUrl(query: string): Promise<string> {
  const numResults = 10
  let successfulExtractions = 0
  let startIndex = 1
  let webExtractedTexts = ''

  const outputFilePath = 'outputs/web_search_texts.txt'
  fs.writeFileSync(outputFilePath, '')

  while (successfulExtractions < numResults) {
    const urls = await searchGoogle(
      query,
      GOOGLE_API_KEY || '',
      GOOGLE_CONTEXT_ID || '',
      startIndex,
      numResults,
    )
    for (const url of urls) {
      console.log(`Processing URL ${successfulExtractions + 1} of ${numResults}`)
      const text = await getWebsiteText(url)
      if (text) {
        fs.appendFileSync(outputFilePath, text + '\n\n')
        webExtractedTexts += text + '\n\n'
        console.log(`Saved content of URL ${successfulExtractions + 1}`)
        successfulExtractions += 1
        if (successfulExtractions >= numResults) break
      }
    }
    startIndex += 10
  }

  console.log('Finished processing all URLs')
  return webExtractedTexts
}

export async function searchAndSummarizeWebUrl(query: string): Promise<string> {
  const numResults = 4
  let successfulExtractions = 0
  let startIndex = 1
  let webExtractedSummaries = ''

  while (successfulExtractions < numResults) {
    const urls = await searchGoogle(
      query,
      GOOGLE_API_KEY || '',
      GOOGLE_CONTEXT_ID || '',
      startIndex,
      numResults,
    )
    for (const url of urls) {
      console.log(`Processing URL ${successfulExtractions + 1} of ${numResults}`)
      const summary = await getWebsiteSummary(url)
      if (summary) {
        webExtractedSummaries += summary + '\n\n'
        console.log('-'.repeat(134))
        successfulExtractions += 1
        if (successfulExtractions >= numResults) break
      }
    }
    startIndex += 10
  }

  console.log('Finished processing all URLs')
  return webExtractedSummaries
}
