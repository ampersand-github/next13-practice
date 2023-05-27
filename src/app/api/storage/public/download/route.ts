import { storage } from "@/app/api/storage";
import { NextApiResponse } from "next";

export async function GET(req: Request, res: NextApiResponse) {
  // バケット名
  // todo t3envやる
  // const bucketName = process.env.BUCKET_NAME as string;
  const bucketName = "public_startup-template";

  // バージョン
  // todo t3envやる
  // const version = process.env.STORAGE_VERSION as string;
  const version = "v1";

  // パス
  const pathName = new URL(req.url as string).searchParams.get("path");
  if (!pathName) return res.status(400).json({ message: "path is required" });

  // 画像のダウンロード
  const url = await storage
    .bucket(bucketName)
    .file(`${version}/${pathName}`)
    .getSignedUrl({
      action: "read",
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    });

  // レスポンスの返却
  return new Response(JSON.stringify(url[0]), { status: 200 });
}
