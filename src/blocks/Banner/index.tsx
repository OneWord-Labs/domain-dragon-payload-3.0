import RichText from '@/components/RichText'
import { cn } from '@/lib/utils'
import React from 'react'

type Props = any & {
  className?: string
}

export const BannerBlock: React.FC<Props> = ({ className, content, style }) => {
  return (
    <div className={cn('mx-auto w-full', className)}>
      <div
        className={cn('border py-3 px-6 flex items-center rounded', {
          'border-border bg-card': style === 'info',
          'border-error bg-error/30': style === 'error',
          'border-success bg-success/30': style === 'success',
          'border-warning bg-warning/30': style === 'warning',
        })}
      >
        <RichText
          className="classes.richText"
          content={content}
          enableGutter={false}
          enableProse={false}
        />
      </div>
    </div>
  )
}
