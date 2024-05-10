import { Input } from '@/components/ui/input'
import { Relationship } from '@payloadcms/ui/fields/Relationship'
import { Select } from '@payloadcms/ui/fields/Select'
import { Form } from '@payloadcms/ui/forms/Form'
import { useField } from '@payloadcms/ui/forms/useField'
import { FC, forwardRef, useEffect, useState } from 'react'

export const ArticlesFilter: FC<{
  setFilters: (values: {
    owners: string[]
    editors: string[]
    status: string[]
    dateRange: [Date | null, Date | null]
  }) => void
}> = ({ setFilters }) => {
  const [internalFilters, setInternalFilters] = useState({ owners: [], editors: [], status: [] })
  return (
    <Form
      fields={[
        { name: 'owners', type: 'relationship', relationTo: 'authors' },
        { name: 'editors', type: 'relationship', relationTo: 'users' },
        {
          name: 'status',
          type: 'select',
          options: [
            {
              label: 'Draft',
              value: 'draft',
            },
            {
              label: 'Pending Review',
              value: 'pending',
            },
            {
              label: 'Published',
              value: 'published',
            },
            {
              label: 'Archived',
              value: 'archived',
            },
          ],
        },
      ]}
      initialState={{
        editors: {
          initialValue: [],
          value: internalFilters?.editors,
          valid: true,
        },
        owners: {
          initialValue: [],
          value: internalFilters?.owners,
          valid: true,
        },
        status: {
          initialValue: [],
          value: internalFilters?.status,
          valid: true,
        },
      }}
    >
      <RenderFieldValues
        setFilters={(values: any) => {
          setFilters(values)
          setInternalFilters(values)
        }}
      />
    </Form>
  )
}

const RenderFieldValues = ({
  setFilters,
}: {
  setFilters: (values: {
    owners: string[]
    editors: string[]
    status: string[]
    dateRange: [Date | null, Date | null]
  }) => void
}) => {
  const { value: ownerValue } = useField<string[]>({
    path: 'owners',
  })

  const { value: editorValue } = useField<string[]>({
    path: 'editors',
  })

  const { value: statusValue } = useField<string[]>({
    path: 'status',
  })

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null])

  const [startDate, endDate] = dateRange
  useEffect(() => {
    setFilters({
      owners: ownerValue,
      editors: editorValue,
      status: statusValue,
      dateRange,
    })
  }, [ownerValue, editorValue, statusValue])

  useEffect(() => {
    if (dateRange?.[0] && dateRange?.[1])
      setFilters({
        owners: ownerValue,
        editors: editorValue,
        status: statusValue,
        dateRange,
      })
  }, [dateRange])
  return (
    <div style={{ width: '100%' }} className="flex justify-between gap-8">
      <Relationship
        name="owners"
        relationTo="authors"
        allowCreate={false}
        hasMany={true}
        width="200px"
        label="Select Owners/Authors"
      />
      <Relationship
        name="editors"
        relationTo="users"
        allowCreate={false}
        hasMany={true}
        label="Select Editors"
        width="200px"
      />
      <Select
        name="status"
        options={[
          {
            label: 'Draft',
            value: 'draft',
          },
          {
            label: 'Pending Review',
            value: 'pending',
          },
          {
            label: 'Published',
            value: 'published',
          },
          {
            label: 'Archived',
            value: 'archived',
          },
        ]}
        width="200px"
        hasMany={true}
        label="Select Status"
      />
    </div>
  )
}
const ExampleCustomInput = forwardRef<any>(({ value, onClick }: any, ref) => (
  <Input
    className=" w-[150px] lg:w-[250px] h-16 focus:outline-none focus:ring-0 focus:ring-offset-0"
    onClick={onClick}
    ref={ref}
    value={value}
  />
))
