import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import { TransactionProvider } from "@/context/transaction-context";
import { Toaster } from "@/components/atoms/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Finance Tracker",
  description: "Track your finances with ease",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <TransactionProvider>
              <ToastProvider>
                {children}
              </ToastProvider>
              <Toaster />
            </TransactionProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
} 