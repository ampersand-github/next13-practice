import { PostImage } from "@/app/_components/clients";

import { db } from "@/lib/db";
import Image from "next/image";

export default async function BlogEditPage() {
  const posts = await db.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: true },
    take: 4,
  });

  return (
    <main className="flex flex-col items-center justify-between space-y-8 p-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <PostPageHeader
          title={"From the blog"}
          description={
            "Learn how to grow your business with our expert advice."
          }
        />

        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16  lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.id}
              className="flex max-w-xl flex-col items-start justify-between"
            >
              <PostTimeStamp date={post.createdAt as Date} />
              <PostTitle id={post.id} title={post.title} />
              <a href={`/${post.id}`}>
                <PostImage autherId={post.author.id} imagePath={post.image} />
              </a>
              <PostContent id={post.id} content={post.content as string} />
              <PostAuthor
                image={post.author.image}
                autherName={post.author.name}
              />
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

type PostPageHeaderProps = {
  title: string;
  description: string;
};
const PostPageHeader = ({ title, description }: PostPageHeaderProps) => {
  return (
    <>
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        {title}
      </h2>
      <p className="mt-2 text-lg leading-8 text-gray-600">{description}</p>
    </>
  );
};

type PostTimeStampProps = {
  date: Date;
};
const PostTimeStamp = ({ date }: PostTimeStampProps) => {
  return (
    <div className="flex items-center gap-x-4 text-xs">
      <time dateTime={date.toString()} className="text-gray-500">
        {date.toLocaleDateString()}
      </time>
    </div>
  );
};

type PostTitleProps = {
  id: string;
  title: string;
};
const PostTitle = ({ id, title }: PostTitleProps) => {
  return (
    <h3 className="my-2 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
      <a href={`/${id}`}>{title}</a>
    </h3>
  );
};

type PostContentProps = {
  id: string;
  content: string;
};
const PostContent = ({ id, content }: PostContentProps) => {
  return (
    <a href={`/${id}`}>
      <p className="mt-5 line-clamp-5 text-sm leading-6 text-gray-600">
        {content}
      </p>
    </a>
  );
};

type PostAuthorProps = {
  image: string | null;
  autherName: string | null;
};

const PostAuthor = ({ image, autherName }: PostAuthorProps) => {
  return (
    <div className="relative mt-4 flex items-center gap-x-2">
      {image && (
        <Image
          width={32}
          height={32}
          src={image}
          alt="avatar"
          className="h-8 w-8 rounded-full bg-gray-50"
        />
      )}
      {autherName && (
        <p className="line-clamp-2 text-xs font-semibold text-muted-foreground">
          <span className="absolute inset-0" />
          {autherName}
        </p>
      )}
    </div>
  );
};
