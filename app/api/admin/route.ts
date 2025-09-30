import prisma from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

async function isAdmin(userId: string){
    const user = (await clerkClient()).users.getUser(userId)
    return (await user).privateMetadata.role === 'admin'
}
