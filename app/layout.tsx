import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CodeHub Foundation — Learn. Build. Innovate.",
    template: "%s | CodeHub Foundation",
  },
  description:
    "Empowering students through free coding education, technology mentorship, and real-world projects.",
  keywords: [
    "coding education",
    "nonprofit",
    "student mentorship",
    "hackathons",
    "STEM",
  ],
  openGraph: {
    title: "CodeHub Foundation — Learn. Build. Innovate.",
    description:
      "Free coding education, technology mentorship, and real-world projects for students.",
    siteName: "CodeHub Foundation",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeHub Foundation — Learn. Build. Innovate.",
    description:
      "Free coding education, technology mentorship, and real-world projects for students.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
