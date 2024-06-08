import React from 'react'

import { CMSLink } from '../../components/Link'
import RichText from '@/components/RichText'
import { cn } from '@/lib/utils'

type Props = Extract<any['layout'][0], { blockType: 'content' }>

export const ContentBlock: React.FC<
  Props & {
    id?: string
  }
> = (props) => {
  const { columns } = props

  const colsSpanClasses = {
    full: '12',
    half: '6',
    oneThird: '4',
    twoThirds: '8',
  }

  return (
    <div className="container my-16">
      <div className="grid grid-cols-4 lg:grid-cols-12 gap-y-8 gap-x-16">
        {columns &&
          columns.length > 0 &&
          columns.map((col: any, index: number) => {
            const { enableLink, link, richText, size } = col

            return (
              <div
                className={cn(`col-span-4 lg:col-span-${colsSpanClasses[size as 'full']}`, {
                  'md:col-span-2': size !== 'full',
                })}
                key={index}
              >
                <RichText content={richText} enableGutter={false} />
                {enableLink && <CMSLink className="classes.link" {...link} />}
              </div>
            )
          })}
      </div>
    </div>
  )
}
