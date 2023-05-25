import { Storage } from "@google-cloud/storage";

const storage = new Storage({
  projectId: process.env.PROJECT_ID,
  keyFilename: "startup-template2-stagin-79af5-ssss.json",
});
export async function GET(req: Request, res: Response) {
  const url = new URL(req.url as string);
  const fileName = url.searchParams.get("path") as string;
  console.log("req", fileName);

  const bucketName = process.env.BUCKET_NAME as string;
  const bucket = storage.bucket(bucketName);
  const _url = await bucket.file(fileName).getSignedUrl({
    action: "read",
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
  });
  console.log("url", _url[0]);

  const __url = "ssss";
  // レスポンスの返却
  return new Response(JSON.stringify(_url[0]), { status: 200 });
}
