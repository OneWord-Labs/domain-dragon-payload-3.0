import Image from 'next/image'
import React from 'react'

const css = `
  html[data-theme="dark"] .text {
    fill: #0C0C0C;
  }

  html[data-theme="dark"] .bg {
    fill: white;
  }

  .graphic-icon {
    width: 50px;
    height: 50px;
  }
`

export const Icon = () => {
  return <Image alt="Icon" height={50} src="/logo.png" width={50} />
}
