import { EditForm } from "@/app/(root)/_components/edit-form/edit-form";

export default async function BlogEditPage() {
  return (
    <main className="flex flex-col items-center justify-between p-8 sm:p-24">
      <div className="sm:w-[600px]">
        <EditForm />
      </div>
    </main>
  );
}
