'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
// import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { ToastContainer } from 'react-toastify'
import { TextInput } from '@payloadcms/ui/fields/Text'
import axios from 'axios'
/* 
  TODO: Use zod to validate the form
*/
const Page = () => {
  const router = useRouter()

  const [registering, setRegistering] = useState(false)

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [firstname, setFirstname] = useState<string>('')
  const [lastname, setLastname] = useState<string>('')
  const [confPassword, setConfPassword] = useState<string>('')

  const register = async ({
    email,
    password,
    firstname,
    lastname,
  }: {
    email: string
    password: string
    firstname: string
    lastname: string
  }) => {
    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', password)
    formData.append('firstName', firstname)
    formData.append('lastName', lastname)
    const req = await axios.post('/api/users/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    if (req.status === 200) {
      toast.success('Registered successfully.')

      router.push('/admin/login')
      return req.data
    }
    throw new Error(req.data?.message ?? 'Something went wrong')
  }

  const handleSubmit = async () => {
    if (registering) return
    if (password !== confPassword) {
      return toast.error('Passwords do not match.')
    }

    if (!email || !password || !firstname || !lastname)
      return toast.error('Please fill in all fields.')

    setRegistering(true)
    const loader = toast.loading('Registering...')

    try {
      const res = await register({
        email: email,
        password: password,
        firstname: firstname,
        lastname: lastname,
      })
    } catch (err: any) {
      // toast.dismiss(loader)
      toast.error(err.message)
    } finally {
      setRegistering(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center">
      <Card className="min-w-[50%]">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>
            Register an account to start generating blogs for parked domains
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="firstname">Firstname</Label>
                <TextInput
                  required
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  placeholder="John"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="lastname">Lastname</Label>
                <TextInput
                  value={lastname}
                  required
                  onChange={(e) => setLastname(e.target.value)}
                  placeholder="Black"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <TextInput
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="lorem.ipsum@example.com"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <TextInput
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="conf-password">Confirm Password</Label>
                <TextInput
                  required
                  value={confPassword}
                  onChange={(e) => setConfPassword(e.target.value)}
                  placeholder="Confirm Password"
                />
              </div>
              <Link href="/admin/login" className=" -mt-2 text-muted-foreground">
                Already have an account? Login here.
              </Link>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button disabled={registering} onClick={handleSubmit}>
            Register
          </Button>
        </CardFooter>
      </Card>
      <ToastContainer position="bottom-center" icon={false} />
    </div>
  )
}

export default Page
