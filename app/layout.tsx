import "./globals.css";
import type { Metadata } from "next";
import ThemeProvider from "@/components/providers/ThemeProvider";
import TrainProvider from "@/components/providers/TrainProvider";

export const metadata: Metadata = {
  title: "Railsy – AI Railway Command Center",
  description: "AI-powered railway safety and operations platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <TrainProvider />
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
