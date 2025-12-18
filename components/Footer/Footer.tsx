import css from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={css.footer}>
      <div className={css.inner}>© {new Date().getFullYear()} NoteHub</div>
    </footer>
  );
}
