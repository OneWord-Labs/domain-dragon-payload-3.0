import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
export const CustomMarkdown = ({ markdown }: { markdown: string }) => {
  return (
    <ReactMarkdown
      components={{
        img: ({ node, ...props }) => (
          <Image
            className="rounded-lg"
            quality={100}
            src={props.src!}
            width={1024}
            height={1024}
            alt={props.alt ?? `image`}
          />
        ),
      }}
      className="max-w-screen-lg lg:mx-auto mx-4 prose prose-sm md:prose-base break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 font-medium my-10"
      remarkPlugins={[remarkGfm]}
    >
      {markdown}
    </ReactMarkdown>
  )
}
