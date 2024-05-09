import BlogCard from './BlogCard'

const MoreStories = ({ blogs }: { blogs: any }) => {
  return (
    blogs.length > 1 && (
      <div className="mx-5 mb-20 max-w-screen-xl lg:mx-24 2xl:mx-auto">
        <h2 className="mb-10 font-title text-4xl md:text-5xl dark:text-white">More stories</h2>
        <div className="grid w-full grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 xl:grid-cols-3">
          {blogs.slice(1).map((metadata: any, index: number) => (
            <BlogCard key={index} data={metadata} />
          ))}
        </div>
      </div>
    )
  )
}

export default MoreStories
