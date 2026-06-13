// app/api/messages/route.ts
import { NextRequest, NextResponse } from "next/server";
import Pusher from "pusher";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

export async function POST(req: NextRequest) {
  //return NextResponse.json({ message: "Message sending is temporarily disabled", status: 403 }, { status: 403 });
  const body = await req.json();
  const { channelId, content, authorId } = body;

  // Validate basic input
  if (!channelId || !content?.trim()) {
    return NextResponse.json(
      { success: false, error: "Missing channelId or content" },
      { status: 400 },
    );
  }

  // Authenticate user
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Check if channel exists
  const channel = await prisma.channel.findUnique({
    where: { id: channelId },
  });

  if (!channel) {
    return NextResponse.json(
      { success: false, error: "Channel not found" },
      { status: 400 },
    );
  }

  // Create message
  const msg = await prisma.message.create({
    data: {
      content,
      channelId,
      authorId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const rtmsg = {
    content,
    channelId,
    authorId,
    author: {
      username: session.user.username,
      displayUsername: session.user.displayUsername,
    },
    createdAt: msg.createdAt,
    updatedAt: msg.updatedAt,
  };

  // Push via Pusher
  try {
    await pusher.trigger(`private-${channelId}`, "new-message", rtmsg);
  } catch {
    //tbd
  }

  return NextResponse.json({ success: true, message: msg }, { status: 200 });
}

export async function GET(req: NextRequest) {
  //return NextResponse.json({ message: "Message fetching is temporarily disabled", status: 403 }, { status: 403 });
  const { searchParams } = new URL(req.url);
  const channelId = searchParams.get("channel");
  const cursor = searchParams.get("cursor");
  const count = searchParams.get("limit");

  // Authenticate user
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Check if channel exists
  const channel = await prisma.channel.findUnique({
    where: { id: channelId! },
  });

  if (!channel) {
    return NextResponse.json(
      { success: false, error: "Channel not found" },
      { status: 400 },
    );
  }

  const messages = await prisma.message.findMany({
    where: { channelId: channelId! },
    orderBy: { createdAt: "desc" },
    take: count ? parseInt(count) : 10,
    ...(cursor
      ? {
          skip: 1, // skip the cursor itself
          cursor: { id: cursor },
        }
      : {}),
    include: {
      author: {
        select: {
          id: true,
          username: true,
          displayUsername: true,
          image: true,
        },
      },
    },
  });

  return Response.json(messages);
}
