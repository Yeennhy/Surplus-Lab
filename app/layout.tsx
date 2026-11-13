import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Xưởng giá trị – Hành trình khám phá giá trị thặng dư",
  description: "Website học tập tương tác về giá trị thặng dư",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body>{children}</body></html>;
}
