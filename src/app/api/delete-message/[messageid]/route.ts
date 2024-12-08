import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(req: Request, { params }: { params: { messageid: string } }) {
    const messageId = params.messageid; // Extract the messageId from params
    // console.log("Message ID to delete:", messageId);
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user = session?.user;
    if (!session || !user) {
        return new Response(JSON.stringify({
            success: false,
            message: "User not authenticated",
        }), { status: 401 });
    }

    try {
        const updateResult = await UserModel.updateOne(
            { _id: user._id },
            { $pull: { messages: { _id: messageId } } }
        );

        if (updateResult.modifiedCount === 0) {
            return new Response(JSON.stringify({
                success: false,
                message: "Message not found or user not authorized to delete it",
            }), { status: 404 });
        }

        return new Response(JSON.stringify({
            success: true,
            message: "Message Deleted",
        }), { status: 200 });
    } catch (error) {
        console.error("Error while deleting message", error);
        return new Response(JSON.stringify({
            success: false,
            message: "Error while deleting message",
        }), { status: 500 });
    }
}
