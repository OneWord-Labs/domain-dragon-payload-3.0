import * as excelJs from 'exceljs'
import payload from 'payload'
import type { PayloadHandler } from 'payload/config'
import type { PayloadRequest, Where } from 'payload/types'

export interface IFieldKey {
  key: string
  collection?: any
  type?: 'string' | 'textLength' | 'decimal' | 'whole' | 'list' | 'date'
  options?: string[]
  filterOptions?: Where
}
export const generateTemplate: ({ fields }: { fields: IFieldKey[] }) => PayloadHandler =
  ({ fields }) =>
  async (req: PayloadRequest) => {
    const workbook = new excelJs.Workbook()

    const ws = workbook.addWorksheet('Test Worksheet')

    // Add data to the worksheet
    const headers: any = []
    fields?.forEach((field) => {
      headers?.push(field?.key)
    })
    ws.addRow(headers)

    ws.columns.map((col, _index) => (col.width = 18))

    let index = 0
    for (const field of fields) {
      let collectionData: any
      if (field.collection) {
        collectionData =
          field?.type == 'list'
            ? await payload.find({
                collection: field.collection,
                limit: 999,
                where: {
                  ...(field?.filterOptions ? field?.filterOptions : {}),
                },
              })
            : null
      }

      const character = String.fromCharCode(index + 97).toUpperCase()

      let formula: any[] = []

      switch (field?.type) {
        case 'list':
          let options

          if (collectionData?.docs?.length > 0) {
            options = `"${collectionData?.docs
              ?.map((data: any) => {
                return data.displayName ?? data.name ?? data?.title ?? ''
              })
              .join(',')}"`
          }
          if (field?.options) {
            options = field?.options
          }

          formula = [options]
          break
      }
      // @ts-expect-error
      ws.dataValidations.add(`${character}2:${character}99999`, {
        ...(field?.type ? { type: field?.type } : {}),
        allowBlank: false,
        formulae: formula,
      })
      index += 1
    }

    const excelBlob = await workbook.xlsx.writeBuffer()

    return new Response(excelBlob, {
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
      },
    })
  }
