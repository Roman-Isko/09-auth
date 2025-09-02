import type { Metadata } from "next";
import "./globals.css";
import TanStackProvider from "../components/TanStackProvider/TanStackProvider";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "NoteHub – Онлайн-сервіс для нотаток",
  description:
    "NoteHub – простий і ефективний застосунок для створення, збереження та організації ваших нотаток.",
  openGraph: {
    title: "NoteHub – Онлайн-сервіс для нотаток",
    description:
      "NoteHub – простий і ефективний застосунок для створення, збереження та організації ваших нотаток.",
    url: "https://notehub.app",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub – Онлайн-сервіс для нотаток",
      },
    ],
  },
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="uk" className={roboto.variable}>
      <body>
        <TanStackProvider>
          <Header />
          <main>
            {children}
            {modal}
          </main>
          <Footer />
        </TanStackProvider>
        <div id="modal-root" />
      </body>
    </html>
  );
}
