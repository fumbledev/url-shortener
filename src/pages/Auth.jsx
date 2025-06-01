import React, { useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNavigate, useSearchParams } from 'react-router-dom'
import Login from '../components/Login.jsx'
import Signup from '../components/Signup.jsx'
import { UrlState } from '@/Context.jsx'

const Auth = () => {
  const [searchParams] = useSearchParams()
  const longLink = searchParams.get("createNew")
  const navigate = useNavigate()

  const { isAuthenticated, loading } = UrlState()

  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`)
    }
  }, [isAuthenticated, loading, longLink, navigate])

  return (
    <div className="mt-20 flex flex-col items-center gap-12 px-4">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-center max-w-xl">
        {longLink ? "Hold On! Let's Login first.." : "Login / Signup"}
      </h1>
      <Tabs defaultValue="login" className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-2 rounded-md border bg-gray-100 dark:bg-gray-800">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Signup</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Login />
        </TabsContent>
        <TabsContent value="signup">
          <Signup />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Auth
