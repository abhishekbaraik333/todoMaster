import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 400 });
  }

  // capture payment

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const subscriptionEnds = new Date();
    subscriptionEnds.setMonth(subscriptionEnds.getMonth() + 1);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        isSubscribed: true,
        subscriptionEnds: subscriptionEnds,
      },
    });

    return NextResponse.json({
      message: "Subscribed Successfully",
      updatedUser,
    });
  } catch (error) {
    console.log("Error updating subscription", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        isSubscribed: true,
        subscriptionEnds: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const now = new Date()

    if(user.subscriptionEnds && user.subscriptionEnds < now){
        await prisma.user.update({
            where:{id:userId},
            data:{
                subscriptionEnds:null,
                isSubscribed:false
            }
        })
        return NextResponse.json({
            isSubscribed:false,
            subscriptionEnds:null
        })
    }

      return NextResponse.json({
            isSubscribed:user.isSubscribed,
            subscriptionEnds:user.subscriptionEnds
        })

  } catch (error) {
     console.log("Error updating subscription", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
