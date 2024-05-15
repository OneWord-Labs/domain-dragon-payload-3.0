'use client'
import { useState, useEffect } from 'react'
import ConfiguredSection from './ConfiguredSection'
import LoadingDots from './LoadingDots'
import { Card, CardContent } from '@/components/ui/card'

const DomainCard = ({ domain }: { domain: string }) => {
  const [domainInfo, setDomainInfo] = useState()

  useEffect(() => {
    ;(async () => {
      const res = await fetch(`/api/domains/check-domain?domain=${domain}`, {
        cache: 'no-cache',
      })
      const data = await res.json()

      setDomainInfo(data)
    })()
  }, [])

  // const [removing, setRemoving] = useState(false)
  return (
    <Card>
      <CardContent>
        <div className="flex justify-between space-x-4 px-2 sm:px-10">
          <div className="text-xl text-left font-semibold flex items-center"></div>
          <div className="flex space-x-3">
            <button
              onClick={async () => {
                const res = await fetch(`/api/domains/check-domain?domain=${domain}`, {
                  cache: 'no-cache',
                })
                const data = await res.json()

                setDomainInfo(data)
              }}
              // disabled={isValidating}
              className={`${
                // isValidating
                //   ? 'cursor-not-allowed bg-gray-100'
                //   :
                'bg-white hover:text-black hover:border-black pt-2'
              } text-gray-500 border-gray-200 py-1.5 w-24 text-sm border-solid border rounded-md focus:outline-none transition-all ease-in-out duration-150`}
            >
              {false ? <LoadingDots /> : 'Refresh'}
            </button>
            {/* <button
            onClick={async () => {
              setRemoving(true)
              try {
                await fetch(`/api/remove-domain?domain=${domain}`)
                // await revalidateDomains()
              } catch (error) {
                alert(`Error removing domain`)
              } finally {
                setRemoving(false)
              }
            }}
            disabled={removing}
            className={`${
              removing ? 'cursor-not-allowed bg-gray-100' : ''
            }bg-red-500 text-white border-red-500 hover:text-red-500 hover:bg-white py-1.5 w-24 text-sm border-solid border rounded-md focus:outline-none transition-all ease-in-out duration-150`}
          >
            {removing ? <LoadingDots /> : 'Remove'}
          </button> */}
          </div>
        </div>

        <ConfiguredSection domainInfo={domainInfo} />
      </CardContent>
    </Card>
  )
}

export default DomainCard
