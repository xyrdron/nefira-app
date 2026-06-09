import { NextRequest, NextResponse } from "next/server";
import Pusher from "pusher";

import { auth } from "@/lib/auth";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

export async function POST(req: NextRequest) {
  const bodyText = await req.text();

  const params = new URLSearchParams(bodyText);
  const socket_id = params.get("socket_id")!;
  const channel_name = params.get("channel_name")!;

  // Authenticate user
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const authorisation = pusher.authorizeChannel(socket_id, channel_name);

  return NextResponse.json(authorisation);
}
