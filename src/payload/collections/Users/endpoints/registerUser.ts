import { PayloadHandler } from 'payload/config'
import { PayloadRequest } from 'payload/types'

export const registerUser: PayloadHandler = async (req: PayloadRequest) => {
  if (!req.formData)
    return new Response(JSON.stringify({ message: 'Missing Data' }), { status: 400 })

  const formdata = await req?.formData()
  const firstName = formdata.get('firstName')
  const lastName = formdata.get('lastName')
  const email = formdata.get('email')
  const password = formdata.get('password')

  console.log('E', firstName, lastName, email, password)

  if (!firstName || !lastName || !email || !password) {
    return new Response(JSON.stringify({ message: 'Missing Data' }), { status: 400 })
  }

  const user = await req.payload.create({
    collection: 'users',

    data: {
      firstName,
      lastName,
      email,
      password,
    },
  })

  return new Response(JSON.stringify(user), { status: 200 })
}
