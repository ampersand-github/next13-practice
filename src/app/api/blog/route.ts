import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/get-current-user";
import { NextApiResponse } from "next";
import { ulid } from "ulid";

// プレゼンテーション層と同義と考える
export async function POST(req: Request, res: NextApiResponse) {
  try {
    console.log("aaa");
    // ログインしていない場合はエラーを返す
    const user = await getCurrentUser();
    if (!user) return new Response("Unauthorized", { status: 403 });

    // ユースケース -> todo コントローラーにまわしてもいいかも
    const body = await req.json();
    const { title, content, image } = body;
    console.log(body);
    const useCase = new createPostUseCase(user.id, title, content, image);
    const result = await useCase.execute();

    // todo ユースケースの値に応じて返り値を変える

    return result
      ? new Response("OK", { status: 200 })
      : new Response("Error", { status: 500 });
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
}

// ユースケースに移行する
class createPostUseCase {
  constructor(
    private readonly id: string,
    private readonly title: string,
    private readonly content: string,
    private readonly imageName: string
  ) {}
  public async execute(): Promise<boolean> {
    try {
      // todo 引数からドメインオブジェクトを生成する
      // todo ドメインオブジェクトのバリデーションにzodを使いたい。部分的に同じコードを使いたい

      // todo リポジトリに移行する
      const data = await db.post.create({
        data: {
          id: ulid(),
          title: this.title,
          content: this.content,
          image: this.imageName,
          published: true,
          authorId: this.id,
        },
      });
      console.log("prisma", data);
      // todo 返り値の検討
      return true;
    } catch (error) {
      // todo エラーハンドリング
      console.error(error);
      // todo 返り値の検討
      return false;
    }
  }
}
