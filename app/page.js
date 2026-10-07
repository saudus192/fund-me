import Image from "next/image";
import logo from "../public/logo.png";
import Link from "next/link";
import man from "../public/man.gif";
import coin from "../public/coin.gif";
import group from "../public/group.gif";
import Reveal from "@/components/reveal";

const features = [
  { img: man, alt: "Man receiving support", title: "Make a Difference", text: "Your support helps us make a difference in the world." },
  { img: coin, alt: "Coin representing support", title: "Support a Cause", text: "Support a cause you care about and help it grow." },
  { img: group, alt: "Group representing community support", title: "Join a Community", text: "Join a community of creators to raise funds." },
];

export default function Home() {
  return (
    <>
      {/* Animations (UI only) */}
      <style>{`
        @keyframes fm-fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fm-logo-in {
          from { opacity: 0; transform: scale(0.9); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes fm-glow {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50%      { opacity: 0.6;  transform: scale(1.12); }
        }
        @keyframes fm-float {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-6px); }
        }
        .fm-logo  { animation: fm-logo-in 0.8s cubic-bezier(.2,.8,.3,1) both; }
        .fm-hero1 { animation: fm-fade-up 0.6s 0.25s ease-out both; }
        .fm-hero2 { animation: fm-fade-up 0.6s 0.4s ease-out both; }
        .fm-hero3 { animation: fm-fade-up 0.6s 0.55s ease-out both; }
        .fm-blob  { animation: fm-glow 6s ease-in-out infinite; }
        .fm-blob2 { animation: fm-glow 7s 1.5s ease-in-out infinite; }
        .fm-gif   { animation: fm-float 4s ease-in-out infinite; }

        /* Scroll reveal (used by the Reveal component) */
        .fm-reveal { opacity: 0; transform: translateY(24px); transition: opacity .7s ease-out, transform .7s ease-out; }
        .fm-reveal-in { opacity: 1; transform: translateY(0); }

        .fm-card { transition: transform .3s ease, box-shadow .3s ease, border-color .3s ease; }
        .fm-card:hover { transform: translateY(-6px); border-color: rgba(52, 211, 153, 0.4); box-shadow: 0 16px 32px -12px rgba(52, 211, 153, 0.3); }
        .fm-ring { transition: transform .4s ease, box-shadow .4s ease; }
        .fm-card:hover .fm-ring { transform: scale(1.06) rotate(3deg); box-shadow: 0 0 22px rgba(52, 211, 153, 0.45); }

        .fm-btn { transition: transform .2s ease, box-shadow .2s ease, filter .2s ease, border-color .2s ease; }
        .fm-btn:hover  { transform: translateY(-2px); box-shadow: 0 8px 20px -6px rgba(52, 211, 153, 0.5); filter: brightness(1.08); }
        .fm-btn:active { transform: translateY(0) scale(0.97); }
        .fm-btn-alt:hover { border-color: rgba(52, 211, 153, 0.7); }

        .fm-video { transition: box-shadow .4s ease; }
        .fm-video:hover { box-shadow: 0 20px 40px -16px rgba(52, 211, 153, 0.4); }

        @media (prefers-reduced-motion: reduce) {
          .fm-logo, .fm-hero1, .fm-hero2, .fm-hero3, .fm-blob, .fm-blob2, .fm-gif { animation: none !important; }
          .fm-reveal { opacity: 1; transform: none; transition: none; }
          .fm-card, .fm-ring, .fm-btn, .fm-video { transition: none !important; }
          .fm-card:hover, .fm-card:hover .fm-ring, .fm-btn:hover { transform: none; }
        }
      `}</style>

      <div className="">
        {/* Hero */}
        <div className="relative overflow-hidden">
          {/* Soft background glows */}
          <div className="fm-blob pointer-events-none absolute -top-16 left-1/4 w-72 h-72 rounded-full bg-green-500/20 blur-3xl" aria-hidden="true"></div>
          <div className="fm-blob2 pointer-events-none absolute top-10 right-1/4 w-72 h-72 rounded-full bg-blue-600/20 blur-3xl" aria-hidden="true"></div>

          <div className="relative flex justify-center items-center flex-col py-12">
            <Image className="fm-logo sm:w-md sm:h-25 w-72 h-16" width={450} height={100} src={logo} alt="Fund Me Logo" priority />
            <div className="text-center mt-6 flex flex-col gap-1 text-gray-200">
              <p className="fm-hero1 sm:text-xl text-sm">Fund-Me is a simple crowdfunding platform.</p>
              <p className="fm-hero2 sm:text-xl text-sm">Start raising funds for your projects today!</p>
            </div>
            <div className="fm-hero3 buttons flex gap-4 mt-6">
              <Link href="/login"><button type="button" className="fm-btn text-white bg-linear-to-br from-green-400 to-blue-600 hover:bg-linear-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-bold rounded-2xl text-sm px-5 py-2.5 text-center leading-5 hover:cursor-pointer">Get Started</button></Link>
              <Link href="/about"><button type="button" className="fm-btn fm-btn-alt text-white bg-gray-800 border border-gray-600 focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-bold rounded-2xl text-sm px-5 py-2.5 text-center leading-5 hover:cursor-pointer">Read More</button></Link>
            </div>
          </div>
        </div>

        <div className="h-px bg-linear-to-r from-transparent via-gray-600 to-transparent w-full m-auto my-5"></div>

        {/* Your Support Matters */}
        <div className="py-10">
          <Reveal>
            <h2 className="text-2xl sm:text-3xl text-center mb-2 font-bold bg-linear-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Your Support Matters</h2>
            <div className="mx-auto mb-10 h-1 w-20 rounded-full bg-linear-to-r from-green-400 to-blue-600"></div>
          </Reveal>
          <div className="flex sm:flex-row flex-col sm:gap-6 gap-8 justify-center items-center sm:items-stretch px-4">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.15} className="sm:w-1/3 w-[90%]">
                <div className="fm-card h-full flex flex-col items-center gap-2 bg-gray-800 border border-gray-700/60 rounded-xl p-6 shadow-md">
                  <div className="fm-ring rounded-full p-0.75 bg-linear-to-br from-green-400 to-blue-600">
                    <div className="rounded-full overflow-hidden bg-gray-700 p-2">
                      <Image className="fm-gif h-auto" src={f.img} width={150} alt={f.alt}></Image>
                    </div>
                  </div>
                  <h3 className="text-xl text-center font-bold mt-2 text-white">{f.title}</h3>
                  <p className="text-center text-gray-300 max-w-xs">{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="h-px bg-linear-to-r from-transparent via-gray-600 to-transparent w-full m-auto my-5"></div>

        {/* Introductory video */}
        <div className="py-10">
          <Reveal>
            <h2 className="text-2xl sm:text-3xl text-center mb-2 font-bold bg-linear-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Our Introductory Video</h2>
            <div className="mx-auto lg:mb-10 mb-12 h-1 w-20 rounded-full bg-linear-to-r from-green-400 to-blue-600"></div>
          </Reveal>
          <div className="flex lg:flex-row flex-col justify-center items-center gap-5 md:w-[80%] w-[90%] m-auto">
            <Reveal className="w-[90%] flex justify-center">
              <div className="fm-video rounded-2xl p-0.75 bg-linear-to-br from-green-400/70 to-blue-600/70 shadow-lg shadow-black/40">
                <video
                  className="block sm:w-140 sm:h-79 w-65 h-36 rounded-2xl bg-black object-cover"
                  src="/fund-me-intro.mp4"
                  poster="/fund-me-intro-poster.png"
                  controls
                  playsInline
                  preload="metadata"
                />
              </div>
            </Reveal>
            <Reveal delay={0.15} className="lg:w-1/2 w-[90%]">
              <p className="text-center text-gray-200 mt-4 text-xl">
                Watch our introductory video to learn more about Fund-Me and how it can help you raise funds for your projects. Join us today and start making a difference in the world!
              </p>
            </Reveal>
          </div>
        </div >
      </div >
    </>
  );
}