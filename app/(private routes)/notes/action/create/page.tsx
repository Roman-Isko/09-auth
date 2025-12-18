"use client";

import CreateNoteModal from "@/components/CreateNoteModal/CreateNoteModal";

export default function NotesActionCreatePage() {
  // Використовуємо той самий компонент, але він просто займе всю сторінку
  return <CreateNoteModal from="/notes" />;
}
