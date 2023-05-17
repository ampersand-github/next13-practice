import { PostImage } from "@/components/clients";
import { db } from "@/lib/db";
import React, { Suspense } from "react";

export default async function BlogEditPage() {
  const posts = await db.post.findMany({ include: { author: true } });

  //
  return (
    <main className="flex flex-col items-center justify-between p-24 space-y-8">
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              From the blog
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              Learn how to grow your business with our expert advice.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.id}
                className="flex max-w-xl flex-col items-start justify-between "
              >
                {/* タイムスタンプ */}
                <div className="flex items-center gap-x-4 text-xs">
                  <time
                    dateTime={post.createdAt.getDate().toString()}
                    className="text-gray-500"
                  >
                    {post.createdAt.toLocaleDateString()}
                  </time>
                </div>
                {/* タイトル */}
                <h3 className="my-2 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                  <a href={"post.href"}>
                    <span className="absolute inset-0" />
                    {post.title}
                  </a>
                </h3>
                {/* イメージ */}
                <div className="grow flex items-center">
                  <Suspense fallback={<>loading...</>}>
                    {/* @ts-ignore */}
                    <PostImage
                      autherId={post.author.id}
                      imagePath={post.image}
                    />
                  </Suspense>
                </div>
                {/* コンテンツ */}
                <p className="mt-5 line-clamp-5 text-sm leading-6 text-gray-600">
                  {post.content as string}
                </p>
                {/* オーサー */}
                <div className="relative mt-4 flex items-center gap-x-2">
                  <img
                    src={post.author.image ?? undefined}
                    alt=""
                    className="h-8 w-8 rounded-full bg-gray-50"
                  />
                  <p className="text-xs font-semibold text-muted-foreground line-clamp-2">
                    <a href={"post.author.href"}>
                      <span className="absolute inset-0" />
                      {post.author.name}
                    </a>
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
