import Image from 'next/image'
import { format } from 'date-fns'
const BlogHeader = ({ blog }: { blog: any }) => {
  return (
    <>
      <div className="relative m-auto mb-10 h-80 w-full max-w-screen-lg overflow-hidden md:mb-20 md:h-150 md:w-5/6 md:rounded-2xl lg:w-2/3">
        <Image
          quality={100}
          src={blog.thumbnail?.url ?? ''}
          width={1200}
          height={630}
          className="h-full w-full object-cover"
          alt={blog.title ?? 'blog image'}
        />
      </div>
      <div className="flex flex-col items-start justify-center">
        <div className="m-auto w-full  md:w-7/12">
          <div className="flex">
            <Image src={blog?.user?.image ?? ''} alt={'User'} className="rounded-lg" />

            <div className="flex w-full items-center justify-center">
              <div className="h-6 border-l border-stone-600 dark:border-stone-400" />
              <p className="my-5 w-10/12 pl-4 text-sm font-light text-stone-500 md:text-base dark:text-stone-400">
                {format(Date.parse(blog.createdAt), 'MMMM dd, yyyy')}
              </p>
            </div>
          </div>
          <h1 className="mb-10 font-title text-3xl font-bold text-stone-800 md:text-6xl dark:text-white">
            {blog.title}
          </h1>
          <p className="text-md  w-10/12 text-stone-600 md:text-lg dark:text-stone-400">
            {blog.description}
          </p>
        </div>
      </div>
    </>
  )
}

export default BlogHeader
