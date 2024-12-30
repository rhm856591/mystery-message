import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(req: NextRequest) {
    const url = new URL(req.url);
    const messageid = url.searchParams.get('messageid'); // Correctly extract messageid from query
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!session || !user) {
        return NextResponse.json(
            {
                error: "Unauthorized"
            },
            { status: 401 }
        );
    }

    try {
        const updateResult = await UserModel.updateOne(
            { _id: user._id },
            { $pull: { messages: { _id: messageid } } }
        );

        if (updateResult.modifiedCount === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Message not found or user not authorized to delete it",
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Message Deleted",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error while deleting message:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error while deleting message",
            },
            { status: 500 }
        );
    }
}
