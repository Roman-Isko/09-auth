import type { ReactNode } from "react";

type PrivateLayoutProps = {
  children: ReactNode;
};

export default function PrivateLayout({ children }: PrivateLayoutProps) {
  // Header / Footer / Providers вже підключені в RootLayout
  return <>{children}</>;
}
