import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/get-current-user";
import { NextApiResponse } from "next";
import { ulid } from "ulid";

export async function POST(req: Request, res: NextApiResponse) {
  // ログインしていない場合はエラーを返す
  const user = await getCurrentUser();
  if (!user) return new Response("Unauthorized", { status: 403 });

  //　reqからbodyの値を取得する
  const body = await req.json();
  const { title, content, image } = body;
  console.log(title, content, image);

  const data = await db.post.create({
    data: {
      id: ulid(),
      title: title,
      content: content,
      image: image,
      published: true,
      authorId: user.id,
    },
  });
}
