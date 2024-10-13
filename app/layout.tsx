import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Outlook - Check your Email",
  description: "This is for test",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">      
       <body className={`${nunito.className} bg-[#F4F5F9] text-[#717171] m-0 p-3 sm:p-5 md:p-8 lg:p-10`}>
        {children}
      </body>
    </html>
  );
}
