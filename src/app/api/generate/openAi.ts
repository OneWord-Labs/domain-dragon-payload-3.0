import OpenAI from 'openai'
import { AssistantResponse, OpenAIStream, StreamingTextResponse } from 'ai'
import { match } from 'ts-pattern'
import type { ChatCompletionMessageParam } from 'openai/resources/index.mjs'

export const generateOpenAi = async ({
  prompt,
  option,
  command,
  apiKey,
  language = 'Arabic',
}: {
  prompt: string
  option: string
  command: string
  apiKey: string
  language?: string
}) => {
  // Check if the OPENAI_API_KEY is set, if not return 400
  if (!apiKey || apiKey === '') {
    return new Response('Missing OPENAI_API_KEY', {
      status: 400,
    })
  }

  const openai = new OpenAI({
    apiKey: apiKey,
    baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
  })

  if (option === 'translate') {
    const threadId = (await openai.beta.threads.create({})).id

    // Add a message to the thread
    const createdMessage = await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: `Using your guidelines, translate the following text into ${language} language.
          Once translated, then enhance the readibility of it and only return the translated text
          without any comments: ${prompt}`,
    })

    const res = AssistantResponse(
      { threadId, messageId: createdMessage.id },
      async ({ forwardStream, sendDataMessage }) => {
        // Run the assistant on the thread
        const runStream = openai.beta.threads.runs.createAndStream(threadId, {
          assistant_id:
            'asst_j7hNBtKra0f7uQvyvYRzpuvq' ??
            (() => {
              throw new Error('ASSISTANT_ID is not set')
            })(),
        })

        // forward run status would stream message deltas
        let runResult = await forwardStream(runStream)

        // status can be: queued, in_progress, requires_action, cancelling, cancelled, failed, completed, or expired
        while (
          runResult?.status === 'requires_action' &&
          runResult.required_action?.type === 'submit_tool_outputs'
        ) {
          const tool_outputs = runResult.required_action.submit_tool_outputs.tool_calls.map(
            (toolCall: any) => {
              const parameters = JSON.parse(toolCall.function.arguments)

              if (toolCall.function.type === 'translate') {
                return {
                  ...toolCall,
                  output: {
                    text: 'Translated text',
                  },
                }
              }
            },
          )

          runResult = await forwardStream(
            openai.beta.threads.runs.submitToolOutputsStream(threadId, runResult.id, {
              tool_outputs,
            }),
          )
        }
      },
    )

    return res
  } else {
    const messages = match(option)
      .with('continue', () => [
        {
          role: 'system',
          content:
            'You are an AI writing assistant that continues existing text based on context from prior text. ' +
            'Give more weight/priority to the later characters than the beginning ones. ' +
            'Limit your response to no more than 200 characters, but make sure to construct complete sentences.' +
            'Use Markdown formatting when appropriate.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ])
      .with('improve', () => [
        {
          role: 'system',
          content:
            'You are an AI writing assistant that improves existing text. ' +
            'Limit your response to no more than 200 characters, but make sure to construct complete sentences.' +
            'Use Markdown formatting when appropriate.',
        },
        {
          role: 'user',
          content: `The existing text is: ${prompt}`,
        },
      ])
      .with('summarize', () => [
        {
          role: 'system',
          content:
            'Your role is to summarize, and enahnce texts or articles, leveraging our knowledge base files: ' +
            'the editorial policy and style guide. These documents are essential for ensuring that your summarization ' +
            "not only maintain the original message's integrity but also align with our standards of clarity, " +
            'excellence, and distinct voice. With precision and creativity, craft versions that resonate ' +
            'in the new summary, all while upholding our editorial standards. Your deep understanding of these guidelines ' +
            'and your expertise in language are crucial for delivering content that meets our quality expectations.',
        },
        {
          role: 'user',
          content: `Using your guidelines, summarize the following article in its origianl language.
            Once summarized, then enhance the readibility of it and only return the summarized text
            without any comments: ${prompt}`,
        },
      ])
      .with('rewrite', () => [
        {
          role: 'system',
          content: `Your role as an editor, rewrite the given article into Axios article style.
            Your rewrite should be clear, concise, and engaging. Use the given structure below as a style guide reference:
    
            Provide a detailed narrative in markdown format, including subsections like 'why it matters', 'big picture', and 'between the lines'.
    
    ### High-Level Summary\\n- Overview of the story using single quotes where necessary.\\n\\n#### Why It Matters\\n- Explanation of the story's significance, using single quotes for quotes or specific terms.\\n\\n#### Big Picture\\n- Context and broader implications, detailed with single quotes in text. Escape any double quotes with a backslash (\\").\\n\\n#### Between the Lines\\n- In-depth analysis, using single quotes to highlight specific points or quotes. Escape any double quotes with a backslash (\\").\\n\\n#### Bullet Points\\n- Key facts or highlights, listed using single quotes for emphasis. Escape any double quotes with a backslash (\\").\\n\\n#### Additional Insights\\n- Further analysis or comments, incorporating single quotes for direct references or quotations. Escape any double quotes with a backslash (\\").
            `,
        },
        {
          role: 'user',
          content: `"Using your guidelines, rewrite the following article into Axios style.
            Return the text without any comments: ${prompt};`,
        },
      ])
      .with('shorter', () => [
        {
          role: 'system',
          content:
            'You are an AI writing assistant that shortens existing text. ' +
            'Use Markdown formatting when appropriate.',
        },
        {
          role: 'user',
          content: `The existing text is: ${prompt}`,
        },
      ])
      .with('longer', () => [
        {
          role: 'system',
          content:
            'You are an AI writing assistant that lengthens existing text. ' +
            'Use Markdown formatting when appropriate.',
        },
        {
          role: 'user',
          content: `The existing text is: ${prompt}`,
        },
      ])
      .with('fix', () => [
        {
          role: 'system',
          content:
            'You are an AI writing assistant that fixes grammar and spelling errors in existing text. ' +
            'Limit your response to no more than 200 characters, but make sure to construct complete sentences.' +
            'Use Markdown formatting when appropriate.',
        },
        {
          role: 'user',
          content: `The existing text is: ${prompt}`,
        },
      ])
      .with('zap', () => [
        {
          role: 'system',
          content:
            'You area an AI writing assistant that generates text based on a prompt. ' +
            'You take an input from the user and a command for manipulating the text' +
            'Use Markdown formatting when appropriate.',
        },
        {
          role: 'user',
          content: `For this text: ${prompt}. You have to respect the command: ${command}`,
        },
      ])
      .run() as ChatCompletionMessageParam[]

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      n: 1,
    })

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response)

    // Respond with the stream
    return new StreamingTextResponse(stream)
  }
}
