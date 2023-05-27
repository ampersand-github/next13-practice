import { Storage } from "@google-cloud/storage";

export const storage = new Storage({
  projectId: process.env.PROJECT_ID,
  keyFilename: "startup-template2-stagin-79af5-ssss.json",
});
