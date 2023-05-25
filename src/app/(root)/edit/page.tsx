import { EditForm } from "@/app/(root)/_components/edit-form/edit-form";

export default async function BlogEditPage() {
  return (
    <main className="flex flex-col items-center justify-between space-y-8 p-24">
      <h1>記事を投稿する</h1>
      {/* <ContentEditForm /> */}
      <EditForm />
    </main>
  );
}
