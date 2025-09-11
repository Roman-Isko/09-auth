"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import NoteDetails from "./NoteDetails.client";

interface NoteDetailsWrapperProps {
  noteId: string;
}

export default function NoteDetailsWrapper({
  noteId,
}: NoteDetailsWrapperProps) {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  const handleClose = () => {
    setIsOpen(false);
    router.push("/notes/filter/All");
  };

  if (!isOpen) return null;

  return <NoteDetails noteId={noteId} onClose={handleClose} />;
}
