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
            /* eslint-disable  @typescript-eslint/no-explicit-any */
            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier }
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

                    // if (user && await bcrypt.compare(credentials.password, user.password)) {
                    //     return user;
                    // }
                } 
                /* eslint-disable  @typescript-eslint/no-explicit-any */
                catch (error: any) {
                    throw new Error(error);
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
        // jwt: {
        //     secret: process.env.JWT_SECRET,
        //     encryption: true,
        //     maxAge: 30 * 24 * 60 * 60, // 30 days
        // },
    },
    secret: process.env.NEXTAUTH_SECRET,

}