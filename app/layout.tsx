import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/Header";
import {ClerkProvider} from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { Toaster } from "sonner";

const inter=Inter({subsets:["latin"]})

export const metadata: Metadata = {
  title: "Sensi- AI Career Coach",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{baseTheme:dark}}>
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className}`}
      >
         <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {/*header*/}
            <Header/>
            <main className="min-h-screen">
               {children}
            </main>
            <Toaster richColors/>
          </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
