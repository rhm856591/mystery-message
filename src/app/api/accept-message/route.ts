import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { User } from "next-auth";

export async function POST(req: Request, res: Response){
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user
    if(!session && !user){
        return Response.json({
            success: false,
            message: "User not authenticated",
        },{status: 401,})
    }

    const userId = user._id;
    const {acceptMessages} = await req.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, {isAcceptingMessage: acceptMessages}, {new: true})
        if(!updatedUser){
            return Response.json({
                success: false,
                message: "Failed to update user status to accept messages",
            }, {status: 401 })
        }

        return Response.json({
            success: true,
            message: "User status updated successfully",
            updatedUser
        }, {status: 200,})
        
    } catch (error) {
        console.log("failed to update user status to accept messages");
        
        return Response.json({
            success: false,
            message: "Failed to update user status to accept messages",
        }, {status: 401,})
    }

}

export async function GET(req: Request, res: Response){
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user
    if(!session &&!user){
        return Response.json({
            success: false,
            message: "User not authenticated",
        },{status: 401,})
    }

    const userId = user._id;
    try {
        const foundUser = await UserModel.findById(userId);
        if(!foundUser) {
            return Response.json({
                success: false,
                message: "User not found",
            }, {status: 404,})
        }
        return Response.json({
            success: true,
            isAcceptingMessage: foundUser.isAcceptingMessage,
        }, {status: 200})
    } catch (error) {
        console.log("failed to update user status to accept messages");
        
        return Response.json({
            success: false,
            message: "Failed to update user status to accept messages",
        }, {status: 401,})
    }
}