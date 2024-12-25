import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import UserModel from "@/model/user"
import dbConnect from "@/lib/dbConnect";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { type: "text", label: "email", placeholder: "Enter your email" },
                password: { type: "password", label: "Password" },
            },
            // @typescript-eslint/no-explicit-any
            async authorize(credentials: Record<"email" | "password", string> | undefined): Promise<any> {
                if (!credentials) {
                    throw new Error("No credentials provided");
                }
                
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.email },
                            { username: credentials.email }
                        ]
                    }).select("+password");

                    if (!user) {
                        throw new Error("No user found with this email address");
                    }

                    if (!user.isVerified) {
                        throw new Error("Please verify your email address before login");
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
                    if (isPasswordCorrect) {
                        return user;
                    } else {
                        throw new Error("Invalid password");
                    }
                    // @typescript-eslint/no-explicit-any
                } catch (error) {
                    const message = error instanceof Error ? error.message : "Authentication failed";
                    throw new Error(message);
                }
            },

        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessage = user.isAcceptingMessage;
                token.username = user.username;
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessage = token.isAcceptingMessage;
                session.user.username = token.username;
            }
            return session
        },
    },
    pages: {
        signIn: '/sign-in',
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,

}