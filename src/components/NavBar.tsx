"use client"
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from './ui/button'
import { User } from 'next-auth'

const NavBar = () => {
    const { data: session } = useSession()
    const user = session?.user as User | undefined

    return (
        <>
            <nav className="bg-black p-4 shadow-md">
                <div className="container mx-auto flex justify-between items-center">
                    <Link href="/" className="text-white text-xl font-bold">
                        Mystery Message
                    </Link>
                    <div className="flex items-center space-x-4">
                        {session ? (
                            <>
                                <span className="text-gray-300 text-sm">
                                    Welcome, {user?.username || user?.email || "User"}
                                </span>
                                <Button 
                                    onClick={() => signOut()} 
                                    className="bg-white text-black px-4 py-2 rounded-lg shadow hover:bg-gray-200"
                                >
                                    Logout
                                </Button>
                                <Link
                                    href="/dashboard"
                                    className="bg-white text-black px-4 py-2 rounded-lg shadow hover:bg-gray-200"
                                > Dashboard </Link>
                            </>
                        ) : (
                            <Link
                                href="/sign-in"
                                className="bg-white text-black px-4 py-2 rounded-lg shadow hover:bg-gray-200"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </nav>
        </>
    )
}

export default NavBar
