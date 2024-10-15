import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { GoogleOAuthProvider } from "@react-oauth/google";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Next Auth",
    default: "Home | Next Auth",
  },
  icons: "@/favicon.ico",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}
        >
          <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
