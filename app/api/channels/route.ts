import { NextRequest } from "next/server";

import { prisma } from "@/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const serverId = searchParams.get("server");
  const cursor = searchParams.get("cursor");
  const count = searchParams.get("limit");

  // Authenticate user
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!serverId) {
    return Response.json(
      { success: false, error: "Server ID is required" },
      { status: 400 }
    );
  }

  // Check if server exists
  const server = await prisma.server.findUnique({
    where: { id: serverId },
  });

  if (!server) {
    return Response.json(
      { success: false, error: "Server not found" },
      { status: 400 }
    );
  }

  const channels = await prisma.channel.findMany({
    where: { serverId },
    orderBy: { createdAt: "asc" }, // usually channels are ordered oldest → newest
    take: count ? parseInt(count) : 10,
    ...(cursor
      ? {
          skip: 1,
          cursor: { id: cursor },
        }
      : {}),
  });

  return Response.json(channels);
}