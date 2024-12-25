"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import axios, { AxiosError } from "axios";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Page() {
  const { toast } = useToast();
  const suggestedMessages = [
    "What's your favorite movie?",
    "Do you have any pets?",
    "What's your dream job?",
  ];

  const [username, setUsername] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    // Extract the username from the URL
    const url = new URL(window.location.href);
    const username = url.pathname.split("/")[2];
    setUsername(username);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/send-message", { username, content });

      if (res.status === 201) {
        toast({
          title: "Message sent",
          description: "Your message has been sent successfully",
        });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 403) {
          toast({
            title: "Error",
            description: "This user is not accepting messages.",
          });
        } else if (error.response?.status === 404) {
          toast({
            title: "Error",
            description: "User not found.",
          });
        } else {
          toast({
            title: "Error",
            description: "An error occurred while sending your message.",
          });
        }
      }
    } finally {
      setContent("");
    }
  };

  const { data: session } = useSession();
  session?.user as User | undefined; // You can remove this if unused

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">Public Profile Link</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="message"
            className="text-sm text-gray-600 dark:text-gray-400"
          >
            Send Anonymous Message to @{username}:
          </label>
          <Textarea
            id="message"
            placeholder="Write your anonymous message here"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit">Send it</Button>
        </div>
      </form>

      <div className="space-y-4">
        <Card className="p-4">
          <h2 className="font-semibold mb-2">Suggest Messages</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Click on any message below to select it.
          </p>
          <div className="space-y-2">
            {suggestedMessages.map((msg, index) => (
              <button
                key={index}
                onClick={() => setContent(msg)}
                className="w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {msg}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
