'use client'
import * as React from "react"
import { useState, useEffect } from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"

export default function Home() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState('')

  // Array of quotations
  const quotes = [
    "The journey of a thousand miles begins with one step. - Lao Tzu",
    "Life is what happens when you're busy making other plans. - John Lennon",
    "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
    "In the middle of every difficulty lies opportunity. - Albert Einstein",
    "You miss 100% of the shots you don't take. - Wayne Gretzky",
  ]

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  // Handle anonymous message submission
  // const handleMessageSubmit = () => {
  //   if (message.trim() === '') {
  //     alert('Please enter a message before submitting.')
  //     return
  //   }

  //   // Here, you would typically send the message to a server
  //   alert('Your anonymous message has been sent successfully!')
  //   setMessage('') // Clear the message after submission
  // }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Welcome Section */}
      <header className="bg-[#100f0f] text-white py-10 text-center">
        <h1 className="text-4xl font-bold">Welcome to Mystry Message</h1>
        <p className="text-lg mt-2">Send messages anonymously, and share your thoughts freely.</p>
      </header>

      {/* Main Content */}
      <div className="flex-grow container mx-auto px-4 py-10">
        {/* About Mystry Message Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-center mb-6">About Mystry Message</h2>
          <p className="text-lg text-gray-700 text-center">
            At Mystry Message, we allow you to send messages without revealing your identity. Whether you have a message to share, feedback to give, or simply want to express your thoughts anonymously, we've got you covered. No one will know who you are, but your voice will be heard.
          </p>
        </section>

        {/* Anonymous Message Form */}
        {/* <section className="mb-10">
          <h2 className="text-2xl font-bold text-center mb-6">Send an Anonymous Message</h2>
          <div className="mx-auto max-w-md">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message here..."
              rows={4}
              className="w-full p-4 border border-gray-300 rounded-md"
            />
            <button
              onClick={handleMessageSubmit}
              className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 w-full"
            >
              Send Message
            </button>
          </div>
        </section> */}

        {/* Features Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-center mb-6">Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 shadow-md">
              <h3 className="text-xl font-semibold">Feature One</h3>
              <p className="mt-2 text-gray-600">
                Share your thoughts with the world, anonymously.
              </p>
            </Card>
            <Card className="p-6 shadow-md">
              <h3 className="text-xl font-semibold">Feature Two</h3>
              <p className="mt-2 text-gray-600">
                Receive anonymous messages from others and express your thoughts freely.
              </p>
            </Card>
            <Card className="p-6 shadow-md">
              <h3 className="text-xl font-semibold">Feature Three</h3>
              <p className="mt-2 text-gray-600">
                No need to create an account. Send messages directly from the homepage.
              </p>
            </Card>
          </div>
        </section>

        {/* Testimonials Carousel */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-center mb-6">What Our Users Say</h2>
          <div className="mx-auto max-w-md">
            <Carousel setApi={setApi} className="w-full">
              <CarouselContent>
                {quotes.map((quote, index) => (
                  <CarouselItem key={index}>
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <p className="text-center text-lg font-semibold text-gray-700">
                          {quote}
                        </p>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
            <div className="py-2 text-center text-sm text-muted-foreground">
              Testimonial {current} of {count}
            </div>
          </div>
        </section>

        {/* Call-to-Action */}
        <section className="text-center bg-indigo-50 py-10 rounded-lg">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-6">
            Join Mystry Message today and express yourself without boundaries.
          </p>
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Get Started
          </button>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="text-center">
          <p>&copy; 2024 Mystry Message. All rights reserved.</p>
          <p>
            Made with ❤️ by{" "}
            <a href="https://rahamtullahsheikh.me" target="_blank" className="text-blue-400 hover:underline">
              Rahamtullah Sheikh
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
