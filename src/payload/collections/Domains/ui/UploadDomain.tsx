'use client'

import { useState } from 'react'

import * as excelJs from 'exceljs'
import { UploadCloudIcon } from 'lucide-react'
import { toast } from 'react-toastify'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import Router from 'next/router'
import { Button } from '@/components/ui/button'
import { LoadingOverlay } from '@/components/LoadingOverlay'
type State = { type: 'IDLE' } | { type: 'ERROR'; error: string } | { type: 'UPLOADING' }
export const UploadDomain = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingText, setLoadingText] = useState('Downloading Template')
  const [state, setState] = useState<State>({ type: 'IDLE' })
  const [file, setFile] = useState<any>()

  const onSubmit = async (file: any) => {
    setLoadingText('Importing Data. This may take a few seconds.')

    if (!file) {
      setState({ type: 'ERROR', error: 'File not found.' })
      toast.error('File not found.')
      return
    }
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || ''

    setState({ type: 'UPLOADING' })
    const reader = new FileReader()

    if (fileExtension === 'xlsx') {
      reader.onload = () => {
        const buffer = reader.result
        xlsxJson(buffer)
      }
      reader.readAsArrayBuffer(file)
    }
  }
  const xlsxJson = (buffer: any) => {
    const wb = new excelJs.Workbook()

    wb.xlsx.load(buffer).then(async (workbook) => {
      const sheets: any = []
      workbook.eachSheet((sheet, id) => {
        const sheetData: any = []

        // Keep track of headers
        let headers: string[] = []

        // Iterate through each row in the sheet
        sheet.eachRow((row, rowIndex) => {
          const rowData: any = {}

          // If it's the first row, consider it as headers
          if (rowIndex === 1) {
            headers = (row.values as string[])?.filter(Boolean)
          } else {
            // Iterate through each cell in the row
            row.eachCell((cell, colNumber: number) => {
              // Use the headers for property names
              rowData[headers[colNumber - 1]] = cell.value
            })

            // Add the row data to the sheetData array
            sheetData.push(rowData)
          }
        })

        // Store the sheet data in the JSON object

        sheets.push(sheetData)
      })

      const formData = new FormData()
      formData.set('data', JSON.stringify(sheets?.[0]))

      try {
        setIsLoading(true)

        const response = await fetch(`/api/domains/import`, {
          method: 'POST',
          body: formData,
        })
        const data = await response.json()

        if (response.status === 200 || data === 'Successfully imported domains') {
          toast.success('Successfully Processed CSV')
          setState({ type: 'IDLE' })
          Router.reload()
        } else {
          toast.error('Error Processing CSV')

          setState({ type: 'ERROR', error: 'Error Processing.' })
        }
        setIsLoading(false)
      } catch (err) {
        toast.error('Failed Processing CSV')
        setState({ type: 'ERROR', error: 'Error Processing.' })
        setIsLoading(false)
      }
    })
  }

  const csvJSON = (csv: string) => {
    const lines = csv.split('\n')
    const result = []
    const headers = lines[0].split(',')

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i]) continue
      const obj: any = {}
      const currentline = lines[i].split(',')

      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j]
      }
      result.push(obj)
    }
    return result
  }

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger>Upload CSV</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create Content Curation List</AlertDialogTitle>
            <AlertDialogDescription>
              <input
                name="file"
                type="file"
                accept=".csv,.txt,.xlsx"
                style={{ marginBottom: '8px' }}
                onChange={(e) => {
                  setFile(e.currentTarget?.files?.[0])
                  // e.currentTarget?.files?.[0]
                  setState({ type: 'IDLE' })
                }}
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="m-0">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="m-0"
              onClick={() => {
                onSubmit(file)
              }}
            >
              <span>Upload</span>
              <UploadCloudIcon style={{ marginLeft: '8px' }} />
              {/* Continue */}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {isLoading && <LoadingOverlay loadingText={'Uploading Domains...'} />}
    </>
  )
}
