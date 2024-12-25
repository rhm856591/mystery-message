import {z} from "zod";
import UserModel from "@/model/user";
import dbConnect from "@/lib/dbConnect";
import {usernameValidation} from "@/schemas/signUpSchema"

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(req: Request) {
    await dbConnect();

    try {
        const {searchParams } = new URL(req.url)
        const queryParams = {
            username: searchParams.get("username")
        }
        // validate with zod
        const result = UsernameQuerySchema.safeParse(queryParams);
        if (!result.success) {
            const usernameError = result.error.format().username?._errors || [];
            return Response.json({
                success: false,
                message: usernameError?.length >0 ? usernameError.join(' ') : "Invalid query parameters"
            },{
                status: 400
            })
        }

        const {username} = result.data;

        const existingVerifiedUser = await UserModel.findOne({
            username,
            isVerified: true
        })
        
        if(existingVerifiedUser){
            return Response.json({
                success: false,
                message: "Username is already taken",
            },{
                status: 400
            })
        }

        return Response.json({
            success: true,
            message: "Username is unique",
        },{
            status: 200
        })


    } catch (error) {
        console.error(error);
        return Response.json({
            succeess: false,
            message: "Error validating username",
        },{
            status: 500
        })
    }
}