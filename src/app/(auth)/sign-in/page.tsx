'use client'
import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { useToast } from "@/hooks/use-toast"
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'

const signInSchema = z.object({
    identifier: z.string().nonempty("Email or Username is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

const SignInPage = () => {
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: '',
        },
    })
    // console.log(form)

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setIsSubmitting(true)
        const result = await signIn('credentials', {
            redirect: false,
            identifier: data.identifier, // Pass identifier to backend
            password: data.password,
        })
        // console.log(result)

        if (result?.ok) {
            toast({
                title: "Success",
                description: "Logged in successfully.",
            })
            router.push('/dashboard')
        } else {
            toast({
                title: "Error",
                description: result?.error || "Invalid credentials.",
                variant: "destructive",
            })
        }

        setIsSubmitting(false)
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-black">
            <div className="w-full max-w-md bg-black text-white border border-gray-700 shadow-md rounded-lg p-8">
                <h2 className="text-6xl font-bold text-center">Welcome Back</h2>
                <p className="text-gray-400 text-sm text-center mt-2">
                    Sign in using your email or username.
                </p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="identifier"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-300">Email or Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="Enter your email or username"
                                            className="bg-black border border-gray-600 text-white"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-300">Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Enter your password"
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
                            {isSubmitting ? (
                                <div className="flex items-center justify-center">
                                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                    Signing In...
                                </div>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>
                </Form>
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-400">
                        Don't have an account?{" "}
                        <a href="/sign-up" className="text-white underline">
                            Sign Up
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignInPage
