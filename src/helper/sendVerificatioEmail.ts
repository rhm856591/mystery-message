import { resend } from "@/lib/resend";
import verificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    username: string,
    email: string,
    otp: string
): Promise<ApiResponse> {
    try {
        // console.log(email);
        
        await resend.emails.send({
            from: 'mystery@rahamtullahsheikh.me',
            to: email,
            subject: 'Mystry messgae | Verification code',
            react: verificationEmail({username,otp}),
        });
        return {
            success: true,
            message: "Verification email sent successfully",
        };
    } catch (error) {
        console.error("Error sending verification email:", error);
        return {
            success: false,
            message: "Error sending verification email",
        };
    }
}