import type { Metadata } from "next";

import { getServerSession } from "next-auth";
import SessionProvider from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: "Next Auth Example",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
