import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { User } from "next-auth";

export async function GET() {
    await dbConnect();
    // console.log("inside get messages")
    const session = await getServerSession(authOptions);
    const user: User = session?.user
    // const { username } = await req.json();
    // console.log(username)

    // console.log(user)


    if (!user) {
        return Response.json({
            success: false,
            message: "User not authenticated",
        }, { status: 401, })
    }

    const userWithId = await UserModel.findOne({
        username: user?.username
    })

    // const userId = new mongoose.Types.ObjectId(user._id);
    const userId = userWithId?._id

    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } }, // Match by the correct `_id`
            { $unwind: "$messages" }, // Unwind the messages array
            { $sort: { "messages.createdAt": -1 } }, // Sort messages by `createdAt` descending
            {
                $group: {
                    _id: "$_id",
                    messages: { $push: "$messages" }, // Reassemble messages array
                },
            },
        ]);

        // console.log(user)

        return Response.json({
            success: true,
            messages: user[0].messages,
        }, { status: 200 })
    } catch (error) {
        console.log("Error while getting message from user", error);

        return Response.json({
            success: false,
            message: "Error while getting message from user",
        }, { status: 500 })
    }
}