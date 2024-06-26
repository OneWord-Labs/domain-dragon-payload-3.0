import React from 'react'

import { NavHamburger } from '@payloadcms/ui/elements/Nav/NavHamburger'
import { NavWrapper } from '@payloadcms/ui/elements/Nav/NavWrapper'
import { Logout } from '@payloadcms/ui/elements/Logout'
import './index.scss'
import { DefaultNavClient } from './nav.client'

const baseClass = 'nav'

export const CustomNav: React.FC = () => {
  return (
    <div className={`${baseClass}_side`}>
      <div className={`${baseClass}_side__bar`}></div>

      <NavWrapper baseClass={baseClass}>
        <nav className={`${baseClass}__wrap`}>
          <DefaultNavClient />
        </nav>
        <div className={`${baseClass}__header`}>
          <div className={`${baseClass}__header-content flex`}>
            <NavHamburger baseClass={baseClass} />
            <span className="text-3xl pb-24">
              <span className="font-bold text-4xl">Domain</span> Dragon
            </span>
          </div>
        </div>
        <div className={`${baseClass}__footer`}>
          <div className={`${baseClass}__footer-content`}>
            <div className={`${baseClass}__controls`}>
              {' '}
              <Logout />{' '}
            </div>
          </div>
        </div>
      </NavWrapper>
    </div>
  )
}
