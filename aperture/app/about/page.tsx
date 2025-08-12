// app/about/page.tsx
import Image from 'next/image';
import 'animate.css'; // Ensure you have animate.css installed for the fadeInDown animation

const AboutPage: React.FC = () => {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-cover bg-center bg-no-repeat">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-5xl font-semibold tracking-tight text-balance text-foreground sm:text-7xl animate__animated animate__fadeInDown">
          About Aperture Science
        </h1>
        <p className="text-foreground text-lg leading-relaxed">
          Founded in the 1940s by the visionary <b>Cave Johnson</b>, Aperture Science began its humble journey as a manufacturer of shower curtains. Who knew that such mundane beginnings would pave the way for groundbreaking, if occasionally explosive, scientific advancements? Our early triumphs include "Aperture Fixtures" – a full line of shower curtains designed for all occasions – and "Aperture Science Innovators," where we pioneered the art of transforming ordinary moon rocks into extraordinary (and remarkably useless) healing gels.
        </p>
        <p className="text-foreground text-lg leading-relaxed">
          Through the decades, Aperture Science has consistently pushed the boundaries of ethical and physical possibility. Our commitment to rigorous testing, often involving volunteer (and sometimes less-than-volunteer) human subjects, is unwavering. We believe that true progress can only be achieved through relentless experimentation, even if it occasionally results in minor temporal displacement or the creation of sentient, morally ambiguous AI.
        </p>
        <p className="text-foreground text-lg leading-relaxed">
          Today, Aperture Science stands as a beacon of innovation, particularly in the fields of portal technology, advanced robotics, and highly dangerous but incredibly fun testing environments. We're proud of our contributions to science, including but not limited to, the <b>Portable Aperture Science Handheld Portal Device</b>, genetic life form and disk operating systems, and a patented line of combustible lemons. Join us in shaping a brighter, more experimental, and potentially lethal future.
        </p>
        <div className="flex gap-4 items-center flex-col sm:flex-row mt-8">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://www.valvesoftware.com/en/about" // Placeholder for a more relevant "Join Us" link
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg" // Consider replacing this with an Aperture Science icon if you have one
              alt="Join Aperture Science"
              width={20}
              height={20}
            />
            Apply to Test
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://half-life.fandom.com/wiki/Aperture_Science" // A good source for "Learn More"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn More About Our History
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-foreground"
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
          className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-foreground"
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
          className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-foreground"
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
};

export default AboutPage;