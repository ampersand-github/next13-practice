import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/get-current-user";
import { randomUUID } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  console.log(1);
  const user = await getCurrentUser();
  console.log("GET", user);
  if (!user) return new Response("Unauthorized", { status: 403 });
  console.log(2);
  const data = await db.post.findMany();
  console.log(3);
  return new Response(JSON.stringify(data), { status: 200 });
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const user = await getCurrentUser();
  if (!user) return new Response("Unauthorized", { status: 403 });
  console.log("session", user);
  const data = await db.post.create({
    data: {
      id: randomUUID(),
      title: "test",
      content: "test",
      published: true,
      authorId: user.id,
    },
  });
}
