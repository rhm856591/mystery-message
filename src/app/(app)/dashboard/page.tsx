'use client'
import MessageCard from '@/components/MessageCard'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { User } from 'next-auth'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSession } from 'next-auth/react'

interface MessageProps {
  content: string;
  createdAt: Date;
  _id: string;
}

const Page = () => {
  const [messages, setMessages] = useState<MessageProps[]>([])
  // const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

  const { data: session } = useSession()
  const user = session?.user as User | undefined

  const { toast } = useToast()

  // const handleDeleteMessage = (messageid: string) => {
  //   setMessages(messages.filter((message) => message._id !== messageid))
  // }


  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  })

  const { watch, setValue } = form;

  const acceptMessages = watch('acceptMessages')

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages')
      setValue('acceptMessages', response.data.isAcceptingMessage)

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Error while fetching accept messages",
        variant: "destructive",
      })
      
    } finally {
      setIsSwitchLoading(false)
    }
  }, [setValue])

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    // setIsLoading(true)
    setIsSwitchLoading(true)
    try {
      const response = await axios.get('/api/get-messages')
      setMessages(response.data.messages || [])
      if (refresh) {
        toast({
          title: "Refresh Message",
          description: "Showing latest message",
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Error while fetching messages",
        variant: "destructive",
      })

    } finally {
      // setIsLoading(false)
      setIsSwitchLoading(false)
    }
  }, [setMessages])

  useEffect(() => {
    if (!session || !session.user) return
    fetchMessages()
    fetchAcceptMessage()
  }, [session, setValue, fetchAcceptMessage, fetchMessages])

  const handleSwitchChange = async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.post('/api/accept-message', { acceptMessages: !acceptMessages })
      setValue('acceptMessages', !acceptMessages)
      toast({
        title: "Switch Accept Message",
        description: `Accept message is now ${acceptMessages ? 'Off' : 'On'}`, 
      })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Error while switching accept messages",
        variant: "destructive",
      })
    } finally {
      setIsSwitchLoading(false)
    }
  }

  const [baseURL, setBaseURL] = useState('');

  useEffect(() => {
    // Ensure window is only accessed on the client
    if (typeof window !== 'undefined') {
      const url = `${window.location.protocol}//${window.location.host}`;
      setBaseURL(url);
    }
  }, []);

  const username = user?.username;
  const profileURL = `${baseURL}/u/${username}`;

  // const { username } = session?.user as User
  // const username = user?.username
  // const baseURL = `${window.location.protocol}//${window.location.host}`
  // const profileURL = `${baseURL}/u/${username}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileURL)
    toast({
      title: "Copy URL",
      description: "URL copied to clipboard",
    })
  }

  if (!session || !session.user) {
    return <div>Please login</div>
  }





  return (
    <div>
      {/* <h1>Dashboard</h1> */}
      <div className="max-w-7xlmx-auto p-6">
        <h1 className="text-4xl font-bold mb-8">User Dashboard</h1>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-2">Copy Your Unique Link</h2>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={profileURL}
                readOnly
                className="flex-1 p-2 bg-gray-50 dark:bg-gray-900 rounded border dark:border-gray-700"
              />
              <Button onClick={copyToClipboard} variant="default">Copy</Button>
            </div>
          </div>

          <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="font-medium">Accept Messages: {acceptMessages ? 'On' : 'Off'}</div>
            <Switch
              id="accept-messages"
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
            />
          </div>

          <div className="space-y-4">
            {/* @ts-ignore */}
            <MessageCard messages={messages} />

          </div>
        </div>
      </div>
    </div>
  )
}

export default Page