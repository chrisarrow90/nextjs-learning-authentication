import { useEffect, useState } from 'react'
import { getSession, useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import AuthForm from '../components/auth/auth-form'

function AuthPage() {
  const [isLoading, setIsLoading] = useState(true)
  // const [session, loading] = useSession()

  const router = useRouter()

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        router.replace('/')
      } else {
        setIsLoading(false)
      }
    })
  }, [router])

  if (isLoading) {
    return <p>Loading...</p>
  }

  return <AuthForm />
}

export default AuthPage
