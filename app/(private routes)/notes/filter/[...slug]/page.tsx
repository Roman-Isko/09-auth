import { redirect } from "next/navigation";

type Props = {
  params: { slug?: string[] };
};

export default function NotesFilterSlugPage({ params }: Props) {
  const slug = params.slug || [];
  // очікуємо /notes/filter/<tag>, беремо перший елемент як тег
  const tag = slug[0] || "All";

  if (!tag || tag === "all") {
    redirect("/notes");
  }

  redirect(`/notes?tag=${encodeURIComponent(tag)}`);
}
