'use client'
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { verifySchema } from '@/schemas/verifySchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const page = () => {
    const router = useRouter();
    const params = useParams<{ username: string; }>()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),

    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            setIsLoading(true)
            const response = await axios.post(`/api/verify-code`, {
                username: params.username,
                code: data.code,
            })

            toast({
                title: "Success",
                description: response?.data.message
            })
            router.push('/sign-in')
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: "Error",
                description: axiosError.response?.data.message || "Error while sign-in account",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <div className="flex items-center justify-center min-h-screen bg-black">
            <div className="w-full max-w-md bg-black text-white border border-gray-700 shadow-md rounded-lg p-8">
                <h2 className="text-6xl font-bold text-center">Verify Your Code</h2>
                <p className="text-gray-400 text-sm text-center mt-2">
                    Enter the Verification code send to your email
                </p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-300">Verification Code</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='number'
                                            placeholder="Enter your code"
                                            className="bg-black border border-gray-600 text-white"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="w-full bg-white text-black border border-black hover:bg-gray-100"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                    Verifying Code...
                                </div>
                            ) : (
                                "Verify Code"
                            )}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default page