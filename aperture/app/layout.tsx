import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import Image from 'next/image'
import Link from 'next/link'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon } from '@heroicons/react/20/solid'
import {
  ArrowPathIcon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
} from '@heroicons/react/24/outline'

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

const solutions = [
  { name: 'Analytics', description: 'Get a better understanding of your traffic', href: '#', icon: ChartPieIcon },
  { name: 'Engagement', description: 'Speak directly to your customers', href: '#', icon: CursorArrowRaysIcon },
  { name: 'Security', description: "Your customers' data will be safe and secure", href: '#', icon: FingerPrintIcon },
  { name: 'Integrations', description: 'Connect with third-party tools', href: '#', icon: SquaresPlusIcon },
  { name: 'Automations', description: 'Build strategic funnels that will convert', href: '#', icon: ArrowPathIcon },
]
const callsToAction = [
  { name: 'Watch demo', href: '#', icon: PlayCircleIcon },
  { name: 'Contact sales', href: '#', icon: PhoneIcon },
]

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
        <nav className="fixed top-0 left-0 right-0 z-50 w-full flex flex-row p-3 bg-black bg-opacity-80 backdrop-blur-md text-white">
          <div className="sm:pl-5 basis-22 animate__animated animate__rollIn min-w-20">
            <Link href="/" className=""><Image
              className="min-h-auto align-self-center"
              src="/aperture-logo.png"
              alt="Aperture Science Logo"
              width={55}
              height={75}
            /></Link>

          </div>
          <div className="basis-412 place-self-center">
            <p className="font-poppins font-semibold sm:pl-3 hidden sm:block">Aperture Science</p>
          </div>
          <div className="basis-200 flex flex-row font-semibold text-sm/6 gap-8 place-self-center justify-end sm:pr-5">
            <Link href="/about" className="rounded-full transition-colors hover:backdrop-blur-sm hover:bg-gray-600">About</Link>
            <Popover className="relative">
              <PopoverButton className="inline-flex items-center gap-x-1 text-white">
                <span>Tools</span>
                <ChevronDownIcon aria-hidden="true" className="size-5" />
              </PopoverButton>

              <PopoverPanel
                transition
                className="absolute flex flex-col sm:-right-80 -right-79 z-10 mt-5 flex sm:w-screen max-w-max -translate-x-1/2 bg-transparent px-4 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
              >
                <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm/6 shadow-lg ring-1 ring-gray-900/5">
                  <div className="p-4">
                    {solutions.map((item) => (
                      <div key={item.name} className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
                        <div className="mt-1 flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                          <item.icon aria-hidden="true" className="size-6 text-gray-600 group-hover:text-indigo-600" />
                        </div>
                        <div>
                          <a href={item.href} className="font-semibold text-gray-900">
                            {item.name}
                            <span className="absolute inset-0" />
                          </a>
                          <p className="mt-1 text-gray-600">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
                    {callsToAction.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-gray-100"
                      >
                        <item.icon aria-hidden="true" className="size-5 flex-none text-gray-400" />
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </PopoverPanel>
            </Popover>
            <Link href="/login" className="">Login</Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
