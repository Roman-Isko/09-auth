import type { Metadata } from "next";
import css from "./not-found.module.css";

export const metadata: Metadata = {
  title: "404 – Сторінка не знайдена | NoteHub",
  description: "На жаль, сторінку, яку ви шукаєте, не знайдено.",
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "404 – Сторінка не знайдена | NoteHub",
    description: "На жаль, сторінку, яку ви шукаєте, не знайдено.",
    url: "https://notehub.app/404",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "404 – Сторінка не знайдена | NoteHub",
      },
    ],
  },
};

export default function NotFoundPage() {
  return (
    <div>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
    </div>
  );
}
