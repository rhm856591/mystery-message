import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { Message } from "@/model/user";

export async function POST(req: Request) {
  await dbConnect();
  const { username, content } = await req.json();

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User not found",
        }),
        { status: 404 }
      );
    }

    // Check if the user accepts messages
    if (!user.isAcceptingMessage) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User is not accepting messages",
        }),
        { status: 403 }
      );
    }

    // Add the new message
    const newMessage = {
      content,
      createdAt: new Date(),
    };

    user.messages.push(newMessage as Message);
    await user.save();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Message sent successfully",
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("An unexpected error occurred: ", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error while sending message",
      }),
      { status: 500 }
    );
  }
}
