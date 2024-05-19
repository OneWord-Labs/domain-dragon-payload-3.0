'use client'
import { LoadingOverlay } from '@/components/LoadingOverlay'
import { Button } from '@payloadcms/ui/elements/Button'
import { useState } from 'react'
import { useDocumentInfo } from '@payloadcms/ui/providers/DocumentInfo'
import axios from 'axios'
import { toast } from 'react-toastify'
export const GenerateBlog = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { id } = useDocumentInfo()
  const handleClick = async () => {
    try {
      setIsLoading(true)
      await axios.get(`/api/sites/generate/${id}`)
      setIsLoading(false)
      toast.success('Blog Generated')
    } catch (err: unknown) {
      setIsLoading(false)
      console.log(err)
      toast.success('Error Generating Blog')
    }
  }
  return (
    <>
      <Button onClick={handleClick}>Generate Blog</Button>
      {isLoading && <LoadingOverlay loadingText="Generating Blog" />}
    </>
  )
}
