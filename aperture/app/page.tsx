import Image from "next/image";
import 'animate.css';
import { Button } from '@headlessui/react'

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-cover bg-center bg-no-repeat bg-[url(/wheatley.jpg)]">
      <video autoPlay loop muted playsInline className="min-h-screen min-w-screen absolute inset-0 object-cover z-0 hidden sm:block"><source src="/menu.webm" type="video/webm"></source></video>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-5xl font-semibold tracking-tight text-balance text-white sm:text-7xl animate__animated animate__fadeInDown">Doing what we must, because we can...</h1>
        <p className="text-white text-shadow-lg z-10">Innovating the future, one test subject at a time. Experience the cutting edge of scientific advancement.</p>
        <div className="flex gap-4 items-center sm:flex-row z-10">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-background text-foreground gap-2 hover:bg-foreground hover:text-background dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="/block-page"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>

            Get blocked
          </a>
          <a
            className="rounded-full transition-colors backdrop-blur-sm flex items-center text-background justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent hover:text-foreground font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center z-10">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-white"
          href="https://www.thinkwithportals.com/" // Official Portal game site or similar
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg" // Consider replacing with an Aperture-themed icon
            alt="Think with Portals"
            width={16}
            height={16}
          />
          Think With Portals
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-white"
          href="https://store.steampowered.com/app/620/Portal_2/" // Link to Portal 2 on Steam
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg" // Consider replacing with an Aperture-themed icon
            alt="Play Portal 2"
            width={16}
            height={16}
          />
          Experience Our Work
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-white"
          href="https://valvesoftware.com/" // Valve's main site
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg" // Consider replacing with an Aperture-themed icon
            alt="Visit Valve Software"
            width={16}
            height={16}
          />
          Go to Valve Software →
        </a>
      </footer>
    </div>
  );
}
