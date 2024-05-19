'use client'

import { Button } from '@/components/ui/button'
import axios from 'axios'

export const DownloadButton = () => {
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => {
        axios(`/api/domains/export`, {
          method: 'GET',
          responseType: 'blob', // important
        }).then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', `domain_template_${Date.now()}.xlsx`)
          document.body.appendChild(link)
          link.click()
        })
      }}
    >
      Download Template
    </Button>
  )
}
