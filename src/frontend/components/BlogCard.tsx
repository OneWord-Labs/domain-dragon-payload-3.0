import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
interface BlogCardProps {
  data: Pick<any, 'slug' | 'thumbnail' | 'title' | 'description' | 'createdAt'>
}

export default function BlogCard({ data }: BlogCardProps) {
  return (
    <Link href={`/${data.slug}`}>
      <div className="ease overflow-hidden rounded-2xl border-2 border-stone-100 bg-white shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-xl dark:border-stone-800">
        <Image
          alt="missing post"
          src={data.thumbnail?.url ?? ''}
          width={500}
          height={400}
          className="h-64 w-full object-cover"
        />
        <div className="h-36 border-t border-stone-200 px-5 py-8 dark:border-stone-700 dark:bg-black">
          <h3 className="font-title text-xl tracking-wide dark:text-white">{data.title}</h3>
          <p className="text-md my-2 truncate italic text-stone-600 dark:text-stone-400">
            {data.description}
          </p>
          <p className="my-2 text-sm text-stone-600 dark:text-stone-400">
            Published {format(Date.parse(data.createdAt), 'MMMM dd, yyyy')}
          </p>
        </div>
      </div>
    </Link>
  )
}
