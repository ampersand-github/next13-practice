import { getCurrentUser } from "@/lib/get-current-user";
import { Storage } from "@google-cloud/storage";
import { NextApiRequest, NextApiResponse } from "next";

const storage = new Storage({
  projectId: process.env.PROJECT_ID,
  keyFilename: "startup-template2-stagin-79af5-ssss.json",
});

// https://cloud.google.com/appengine/docs/flexible/nodejs/using-cloud-storage?hl=ja
// https://sterfield.co.jp/programmer/%E7%BD%B2%E5%90%8D%E4%BB%98%E3%81%8Durl%E3%81%A7cloud-storage-%E3%81%AB%E7%94%BB%E5%83%8F%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E3%82%92%E7%9B%B4%E6%8E%A5%E3%82%A2%E3%83%83%E3%83%97%E3%83%AD%E3%83%BC/
// https://github.com/leerob/nextjs-gcp-storage

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  // セッションの取得
  const session = await getCurrentUser();
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  // バケットの設定
  const bucketName = process.env.BUCKET_NAME as string;
  const bucket = storage.bucket(bucketName);

  // ファイルの設定
  const storageVersion = process.env.STORAGE_VERSION as string;
  const url = new URL(req.url as string);
  const fileName = url.searchParams.get("file");
  if (!fileName) return res.status(400).json({ message: "file is required" });
  const filePath = `${storageVersion}/images/${session.id}/${fileName}`;
  const file = bucket.file(filePath);
  const options = {
    expires: Date.now() + 1 * 60 * 1000,
  };

  // 署名付きURLの生成
  const [response] = await file.generateSignedPostPolicyV4(options);

  // レスポンスの返却
  return new Response(JSON.stringify(response), { status: 200 });
}
