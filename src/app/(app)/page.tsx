const Page = () => {
  return (
    <div className="bg-black min-h-screen min-w-screen">
      <pre className="text-green-500">
        admin@domaindragon.ai:~ curl -X GET https://domaindragon.ai/api/v1/status
      </pre>
      <pre className="text-green-500">
        admin@domaindragon.ai:~{' '}
        {JSON.stringify({
          status: 200,
          message: 'This software is under heavy development please check back later.',
        })}
      </pre>
      <pre className="text-green-500">
        admin@domaindragon.ai:~ echo Thank you for your patience.
      </pre>
      <pre className="text-green-500">Thank you for your patience.</pre>
      <pre className="text-green-500 flex flex-row items-center space-x-2">
        admin@domaindragon.ai:~ <div className="bg-green-500 h-3 w-1 animate-pulse"></div>
      </pre>
    </div>
  )
}

export default Page
