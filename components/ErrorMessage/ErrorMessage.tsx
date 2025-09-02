import css from "./ErrorMessage.module.css";

export interface ErrorMessageProps {
  message?: string;
  children?: React.ReactNode;
}

export default function ErrorMessage({ message, children }: ErrorMessageProps) {
  if (!message && !children) return null;
  return <div className={css.error}>{message || children}</div>;
}
