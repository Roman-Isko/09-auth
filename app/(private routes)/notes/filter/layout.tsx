// app/(private routes)/notes/filter/layout.tsx
import type { ReactNode } from "react";

type FilterLayoutProps = {
  children: ReactNode;
  sidebar: ReactNode; // для @sidebar
};

export default function NotesFilterLayout({
  children,
  sidebar,
}: FilterLayoutProps) {
  return (
    <div style={{ display: "flex" }}>
      <aside>{sidebar}</aside>
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
}
