import type { Metadata } from "next";

import SessionProvider from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: "Next Auth Example",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SessionProvider>{children}</SessionProvider>;
}
