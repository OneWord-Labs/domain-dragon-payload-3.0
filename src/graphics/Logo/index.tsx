import Image from 'next/image'
import React from 'react'

const css = `
  html[data-theme="dark"] path {
    fill: white;
  }

  .graphic-logo {
    width: 150px;
    height: auto;
  }`

export const Logo = () => {
  return <Image alt="Logo" height={200} src="/logo.png" width={150} />
}
