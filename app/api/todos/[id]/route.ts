import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 400 });
  }

  try {
     const awaitedParams = await params;
    const todoId = awaitedParams.id;
    const todo = await prisma.todo.findUnique({
      where: { id: todoId },
    });

    if (!todo) {
      return NextResponse.json({ error: "todo not found" }, { status: 400 });
    }

    if (todo.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const deletedTodo = await prisma.todo.delete({
        where:{id:todoId}
    })

    return NextResponse.json({message:"Todo deleted Successfully"},{status:200})
  } catch (error) {
      console.log("Error deleting todo", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 400 });
  }

  try {
     const awaitedParams = await params;
    const todoId = awaitedParams.id;
    const todo = await prisma.todo.findUnique({
      where: { id: todoId },
    });

    if (!todo) {
      return NextResponse.json({ error: "todo not found" }, { status: 400 });
    }

    if (todo.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedTodo = await prisma.todo.update({
        where:{id:todoId},
        data:{completed:!todo.completed}
    })

    return NextResponse.json({message:"Todo updated Successfully"},{status:200})
  } catch (error) {
      console.log("Error updating todo", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
