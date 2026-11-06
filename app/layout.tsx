import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Surplus Lab – The Factory of Value",
  description: "Website học tập tương tác về giá trị thặng dư",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body>{children}</body></html>;
}
