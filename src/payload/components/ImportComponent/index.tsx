'use client'
import React, { ReactNode, useState } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import * as excelJs from 'exceljs'
import { UploadCloudIcon } from 'lucide-react'
import { LoadingOverlay } from '@/components/LoadingOverlay'

type State = { type: 'IDLE' } | { type: 'ERROR'; error: string } | { type: 'UPLOADING' }

export const DataUploader: React.FC<{
  children: ReactNode
  hideImport?: boolean
}> = ({ children, hideImport }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingText, setLoadingText] = useState('Downloading Template')
  const [state, setState] = React.useState<State>({ type: 'IDLE' })

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoadingText('Importing Data. This may take a few seconds.')

    e.preventDefault()

    const file = e.currentTarget?.file?.files[0]

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
          const rowData = {}

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

        if (data.success === 'true') {
          toast.success('Successfully Processed CSV')
          setState({ type: 'IDLE' })
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
    <div className="agencyPagesUploader">
      {children}

      <p />
      <div
        style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '4px', width: '100%' }}
      >
        <h4 style={{ margin: '0 0 8px' }}>Import Data:</h4>
        <p style={{ margin: '0 0 16px' }}>Select your CSV/Excel file to be imported</p>
        <form onSubmit={onSubmit}>
          {state.type === 'ERROR' && <p style={{ color: 'red' }}>{state.error}</p>}

          <input
            name="file"
            type="file"
            accept=".csv,.txt,.xlsx"
            style={{ marginBottom: '8px' }}
            onChange={() => {
              setState({ type: 'IDLE' })
            }}
          />
          <button
            style={{
              marginBottom: '16px',
              paddingLeft: 8,
              paddingRight: 8,
              paddingTop: 4,
              paddingBottom: 4,
            }}
            disabled={state.type === 'UPLOADING'}
          >
            <span>Upload</span>
            <UploadCloudIcon style={{ marginLeft: '8px' }} />
          </button>
        </form>
      </div>

      {isLoading && <LoadingOverlay loadingText={loadingText} />}
    </div>
  )
}
