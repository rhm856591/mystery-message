'use client'
import React, { useState } from 'react'
import {
    Card,
    CardContent,
    CardFooter,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from './ui/button'
import { X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import axios from 'axios'

interface MessageProps {
    content: string;
    createdAt: Date;
    _id: string;
}
//@ts-ignore
const MessageCard: React.FC<MessageProps[]> = ({ messages }) => {
    const { toast } = useToast()
    // console.log(messages[0]?._id)
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    // const onDelete = async (index: number) => {
    //     setIsDeleting(true)
    //     const messageId = messages[index]?._id
    //     try {
    //         await axios.delete(`/api/delete-message/{messageId}`, {
    //             params: {messageId}
    //         })
    //         toast({
    //             title: "Message Deleted",
    //             description: "Message deleted successfully",
    //         })
    //     } catch (error) {
    //         console.log(error)
    //     }
    //     finally {
    //         setIsDeleting(false)
    //     }
    // }
    const onDelete = async (index: number) => {
        setIsDeleting(true);
        const messageId = messages[index]?._id;
        try {
            await axios.delete(`/api/delete-message/${messageId}`); // Correct URL structure
            toast({
                title: "Message Deleted",
                description: "Message deleted successfully",
            });
            window.location.reload();
        } catch (error) {
            // console.log(error);
            toast({
                title: "Error",
                description: "Failed to delete the message. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsDeleting(false);
        }
    };

    if (messages.length === 0) {
        return (
          <div>
            <p>There are no messages</p>
          </div>
        );
      }
    


    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {messages.map((message: MessageProps, index: number) => (
                <Card key={index} className="overflow-hidden transition-all hover:shadow-lg">

                    <CardContent className='flex items-center justify-between pt-4'>
                        <p className="text-2xl font-semibold leading-relaxed">{message.content || 'No Content'}</p>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="destructive"
                                    aria-label="Delete message"
                                    disabled={isDeleting}
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. The message will be permanently deleted.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => onDelete(index)}
                                        disabled={isDeleting}
                                    >
                                        {isDeleting ? 'Deleting...' : 'Continue'}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardContent>
                    <CardFooter className="text-xs text-muted-foreground">
                        Posted at: {new Date(message.createdAt).toLocaleString()}
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}

export default MessageCard;