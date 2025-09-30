import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {

  const {emailAddress, clerkId} = await req.json();

  if(!clerkId){
    return NextResponse.json({ error: "Clerk id is required" }, { status: 400 });
  }

  try{
    const newUser = await prisma.user.create({
        data: {
          id:clerkId,
          email: emailAddress,
          isSubscribed: false,
        },
      });

      console.log("New user created", newUser);
    } catch (error) {
      return new Response("Error creating user", { status: 500 });
    }

  return new Response("User created successfully", { status: 200 });
}
