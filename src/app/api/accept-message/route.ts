import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// POST handler
export async function POST(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!session || !user) {
    return NextResponse.json(
      {
        success: false,
        message: "User not authenticated",
      },
      { status: 401 }
    );
  }

  const userId = user._id;
  const { acceptMessages } = await req.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update user status to accept messages",
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User status updated successfully",
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("failed to update user status to accept messages: ", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update user status to accept messages",
      },
      { status: 401 }
    );
  }
}

// GET handler
export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!session || !user) {
    return NextResponse.json(
      {
        success: false,
        message: "User not authenticated",
      },
      { status: 401 }
    );
  }

  const userId = user._id;

  try {
    const foundUser = await UserModel.findById(userId);

    if (!foundUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        isAcceptingMessage: foundUser.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("failed to fetch user data: ", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch user data",
      },
      { status: 401 }
    );
  }
}
