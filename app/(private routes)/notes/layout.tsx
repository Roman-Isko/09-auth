import type { ReactNode } from "react";
import SidebarNotes from "@/components/SidebarNotes/SidebarNotes";
import css from "./Layout.module.css";

type NotesLayoutProps = {
  children: ReactNode;
  modal?: ReactNode;
};

export default function NotesLayout({ children, modal }: NotesLayoutProps) {
  return (
    <>
      <div className={css.wrapper}>
        <aside className={css.sidebar}>
          <SidebarNotes />
        </aside>

        <main className={css.main}>{children}</main>
      </div>

      {modal}
    </>
  );
}
