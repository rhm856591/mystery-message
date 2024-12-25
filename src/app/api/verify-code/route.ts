import UserModel from "@/model/user";
import dbConnect from "@/lib/dbConnect";


export async function POST(req: Request) {
    await dbConnect();

    try {
        const { username, code } = await req.json();
        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({
            username: decodedUsername
        })

        if(!user){
            return Response.json({
                success: false,
                message: "User not found",
            }, {status: 500})
        }

        const isUserValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if(isUserValid && isCodeNotExpired){
            user.isVerified = true;
            await user.save()

            return Response.json({
                success: true,
                message: "Account verified successfully",
            },{status: 200,})
        } else if(!isCodeNotExpired){
            return Response.json({
                success: false,
                message: "Verification code is not expired",
            },{status: 400,})
        } else{
            return Response.json({
                success: false,
                message: "Invalid verification code",
            },{status: 400,})
        }
        
    } catch (error) {
        console.error("Error verifying username");
        console.log(error);
        
        return Response.json({
            success: false,
            message: "Error verifying username",
        },{status: 500})
        
    }
}