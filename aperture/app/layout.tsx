import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import Image from 'next/image'
import Link from 'next/link'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ['100', '200', '300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: "Aperture Science",
  description: "Tomorrow's technology, today!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased`}
      >
        <nav className="flex flex-row p-3">
          <div className="pl-5 basis-22">
            <Image 
            src="/aperture-logo.png"
            alt="Aperture Science Logo"
            width={55}
            height={75}
            />
            
          </div>
          <div className="basis-412 place-self-center">
            {/* <p className="font-poppins font-medium pl-3">Aperture Science</p> */}
          </div>
          <div className="basis-128 flex-row place-self-center text-end">
            <Link href="/about" className="p-4">About</Link>
            <Link href="/about" className="p-4">Employees</Link>
            <Link href="/about" className="p-4">Log In</Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
