import { fetchNoteById } from "@/lib/api/serverApi";
import EditNoteModal from "@/components/EditNoteModal/EditNoteModal";

type Props = {
  params: { id: string };
};

export default async function NotesIdEditModalPage({ params }: Props) {
  const note = await fetchNoteById(params.id);

  if (!note) return null;

  return <EditNoteModal note={note} />;
}
