import { Globe, Image, Link, Newspaper, User } from 'lucide-react'

export const logoMap = [
  {
    href: '/collections/users',
    logo: <User className="h-6 w-6" />,
  },
  {
    href: '/collections/media',
    logo: <Image className="h-6 w-6" />,
  },
  {
    href: '/collections/sites',
    logo: <Globe className="h-6 w-6" />,
  },
  {
    href: '/collections/domains',
    logo: <Link className="h-6 w-6" />,
  },
  {
    href: '/collections/blogs',
    logo: <Newspaper className="h-6 w-6" />,
  },
]
export const navigationLogoMapper = ({ href }: { href: string }) => {
  const logo = logoMap?.find((logo) => {
    const regex = new RegExp(`${logo.href}$`, 'g')
    return regex.test(href)
  })
  return logo?.logo
}
