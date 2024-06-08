// /**
//  * This module runs bloggpt as a recurrent RAG (retrieval augmented generation) chain.
//  * It utilizes Pinecone as a vector database to store and retrieve documents and
//  * the OpenAI API to generate the blog.
//  */

// import { createOpenAI } from '@ai-sdk/openai'
// import { ChatPromptTemplate } from '@langchain/core/prompts'
// import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai'
// import { PineconeStore } from '@langchain/pinecone'
// import { TokenTextSplitter } from '@langchain/textsplitters'
// import pinecone from '@pinecone-database/pinecone'
// import dotenv from 'dotenv'
// import fs from 'fs'
// import path from 'path'

// import { OUTLINE_PROMPT, RECURRENT_RQNA_SYSTEM_PROMPT, TOPIC_PROMPT } from '../prompts'
// import { generateFinalBlog } from '../utils'
// import { searchAndExtractWebUrl } from '../utils/web'

// // Load environment variables from .env file
// dotenv.config()

// // Use the environment variables
// const OPENAI_API_KEY = process.env.OPENAI_API_KEY
// const PINECONE_API_KEY = process.env.PINECONE_API_KEY
// const PINECONE_ENV = process.env.PINECONE_ENV

// // Initialize OpenAI API
// const openai = createOpenAI({
//   apiKey: OPENAI_API_KEY,
//   // custom settings, e.g.
//   compatibility: 'strict', // strict mode, enable when using the OpenAI API
// })
// // Utility functions
// function saveDocListToFile(lst, filename) {
//   const fileStream = fs.createWriteStream(filename)
//   lst.forEach((item) => {
//     fileStream.write(`${item[0].page_content}\n`)
//   })
//   fileStream.end()
// }

// function splitOutlinePrompt(OUTLINE_PROMPT) {
//   const headers = []
//   OUTLINE_PROMPT.split('\n').forEach((text) => {
//     if (text.startsWith('#')) {
//       headers.push(text.split('#')[1].trim())
//     }
//   })

//   const blogSections = OUTLINE_PROMPT.split('\n\n')
//   return [headers, blogSections]
// }

// async function generateBlogSection(
//   blogSection,
//   namespace,
//   docsearch: PineconeStore,
//   draftLLMChain,
//   topic,
// ) {
//   //   const docs = await docsearch.similaritySearchWithScore(topic, { k: 10, namespace })
//   const docs = await docsearch.similaritySearchWithScore(topic)
//   const fullContext = docs
//     .filter((doc) => doc[1] > 0.85)
//     .map((doc) => doc[0].pageContent)
//     .join('\n')
//   const inputs = { blog_section: blogSection, context: fullContext, topic }

//   const draftLLMOutput = await draftLLMChain(inputs)
//   return [draftLLMOutput, docs]
// }

// async function setupPineconeIndex(indexName) {
//   const pineconeClient = new pinecone.Pinecone({
//     apiKey: PINECONE_API_KEY,
//   })

//   const index = pineconeClient.index(indexName)

//   // Delete existing index if it exists
//   const indexExists = await pineconeClient.describeIndex(indexName).catch(() => false)
//   if (indexExists) {
//     await pineconeClient.deleteIndex(indexName)
//   }

//   // Create a new index
//   await pineconeClient.createIndex({
//     name: indexName,
//     dimension: 1536,
//     metric: 'cosine',
//     spec: null,
//   })

//   // Wait for the index to become active
//   // eslint-disable-next-line no-constant-condition
//   while (true) {
//     const indexDescription = await pineconeClient.describeIndex(indexName)
//     if (indexDescription.status.state === 'Ready') {
//       console.log(`The index ${indexName} is active and ready.`)
//       break
//     } else {
//       console.log(
//         `The index ${indexName} is not active. Current state: ${indexDescription.status.state}`,
//       )
//       console.log('Waiting for the index to become active...')
//       await new Promise((resolve) => setTimeout(resolve, 5000))
//     }
//   }

//   return index
// }

// function combineDrafts(directory) {
//   const outputFile = path.join(directory, 'complete_draft.md')

//   const draftFiles = fs
//     .readdirSync(directory)
//     .filter((file) => file.startsWith('draft_') && file.endsWith('.md'))
//     .sort((a, b) => parseInt(a.split('_')[1]) - parseInt(b.split('_')[1]))

//   let entireDraft = ''

//   const outputStream = fs.createWriteStream(outputFile)
//   draftFiles.forEach((filename) => {
//     const contents = fs.readFileSync(path.join(directory, filename), 'utf-8')
//     outputStream.write(contents + '\n\n')
//     entireDraft += contents + '\n\n'
//   })
//   outputStream.end()

//   console.log(`All drafts have been combined into ${outputFile}.`)
//   return entireDraft
// }

// async function main() {
//   const topic = TOPIC_PROMPT.split(':')[1].trim()
//   console.log('topic: ', topic)

//   const [headers, blogSections] = splitOutlinePrompt(OUTLINE_PROMPT)

//   // Initialize Pinecone
//   //    new pinecone.Pinecone({ apiKey: PINECONE_API_KEY })

//   console.log('Creating VectorDB')
//   const indexName = 'bloggpt'
//   const embeddings = new OpenAIEmbeddings()

//   const pineconeIndex = await setupPineconeIndex(indexName)

//   let numGenerated = 0
//   await Promise.all(
//     headers?.map(async (header: string, index: number) => {
//       const blogSection = blogSections[index]
//       console.log(`Searching Google for ${topic}, ${header}`)
//       await searchAndExtractWebUrl(`${topic}, ${header}`)

//       const webSearchTexts = fs.readFileSync('outputs/web_search_texts.txt', 'utf-8')

//       const textSplitter = new TokenTextSplitter({ chunkOverlap: 100, chunkSize: 300 })
//       const texts = textSplitter.splitText(webSearchTexts)

//       const docsearch = new PineconeStore(embeddings, {
//         pineconeIndex: pineconeIndex,
//       })
//       // const docsearch = await getVectorStore(texts, embeddings, pineconeIndex, header)

//       const prompt = ChatPromptTemplate.fromTemplate(RECURRENT_RQNA_SYSTEM_PROMPT)
//       const llm = new ChatOpenAI({
//         apiKey: OPENAI_API_KEY,
//       })
//       const draftLLMChain = prompt.pipe(llm)

//       // Generate the blog with the agent
//       console.log('Generating First Draft')
//       const [draftLLMOutput, retrievedDocs] = await generateBlogSection(
//         blogSection,
//         header,
//         docsearch,
//         draftLLMChain,
//         topic,
//       )
//       console.log(draftLLMOutput.text)

//       const generatedBlog = draftLLMOutput.text

//       saveDocListToFile(retrievedDocs, `outputs/retrieved_docs_${numGenerated}.txt`)

//       // Save the blog in a markdown file
//       fs.writeFileSync(`outputs/draft_${numGenerated}.md`, generatedBlog)

//       numGenerated += 1
//     }),
//   )

//   // Combine the markdown generated blogs into one
//   console.log('Combining the markdown generated blogs into one')
//   const entireDraft = combineDrafts('outputs/')

//   // Refine the generated blog
//   console.log('Generating Final Blog')
//   await generateFinalBlog(entireDraft, TOPIC_PROMPT)
// }

// main().catch(console.error)
