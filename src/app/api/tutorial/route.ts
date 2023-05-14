import { authOptions } from "@/lib/auth-option";
import { db } from "@/lib/db";
import { randomUUID } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(authOptions);
  console.log("GET", session);
  if (!session) return new Response("Unauthorized", { status: 403 });
  const data = await db.post.findMany();
  return new Response(JSON.stringify(data), { status: 200 });
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(authOptions);
  console.log("session", session);
  const data = await db.post.create({
    data: {
      id: randomUUID(),
      title: "test",
      content: "test",
      published: true,
      authorId: session?.user.id as string,
    },
  });
}
