import { storage } from "@/app/api/storage";
import { getCurrentUser } from "@/lib/get-current-user";
import { NextApiRequest, NextApiResponse } from "next";

// https://cloud.google.com/appengine/docs/flexible/nodejs/using-cloud-storage?hl=ja
// https://sterfield.co.jp/programmer/%E7%BD%B2%E5%90%8D%E4%BB%98%E3%81%8Durl%E3%81%A7cloud-storage-%E3%81%AB%E7%94%BB%E5%83%8F%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E3%82%92%E7%9B%B4%E6%8E%A5%E3%82%A2%E3%83%83%E3%83%97%E3%83%AD%E3%83%BC/
// https://github.com/leerob/nextjs-gcp-storage

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  // セッションの取得
  const session = await getCurrentUser();

  // 画像をアップロードするために認証は必須
  if (!session) return res.status(401).json({ message: "Unauthorized" });

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

  // ファイル名
  const fileName = new URL(req.url as string).searchParams.get("file");
  if (!fileName) return res.status(400).json({ message: "file is required" });

  // uidの取得
  const uid = session.id;

  // 署名付きURLの取得
  const options = {
    expires: Date.now() + 1 * 60 * 1000,
    fields: { "x-goog-meta-test": "data" },
  };

  // バケット名(public | private) + version(v1 | v2) + pathName + uid + fileName
  const [response] = await storage
    .bucket(bucketName)
    .file(`${version}/${pathName}/${uid}/${fileName}`)
    .generateSignedPostPolicyV4(options);

  // レスポンスの返却
  return new Response(JSON.stringify(response), { status: 200 });
}
