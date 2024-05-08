import React from 'react'
import { memo } from 'react'
import { cn } from '../../lib/utils'
import { LucideIcon } from 'lucide-react'

export type IconProps = {
  icon: LucideIcon
  // name: keyof typeof icons
  className?: string
  strokeWidth?: number
}

export const Icon = memo(({ icon, className, strokeWidth }: IconProps) => {
  const IconComponent = icon

  if (!IconComponent) {
    return null
  }

  return <IconComponent className={cn('w-4 h-4', className)} strokeWidth={strokeWidth || 2.5} />
})

Icon.displayName = 'Icon'
