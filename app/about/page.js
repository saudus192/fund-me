import React from 'react'
import Link from 'next/link'
import Reveal from '@/components/reveal'

const Page = () => {
  return (

    <>
      {/* Animations (UI only) */}
      <style>{`
        @keyframes fm-fade-up {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fm-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .fm-card  { animation: fm-fade-up 0.6s ease-out both; }
        .fm-title { animation: fm-fade-up 0.6s 0.15s ease-out both; }
        .fm-line  { animation: fm-fade-in 0.8s 0.35s ease-out both; }

        /* Scroll reveal (used by the Reveal component) */
        .fm-reveal { opacity: 0; transform: translateY(24px); transition: opacity .7s ease-out, transform .7s ease-out; }
        .fm-reveal-in { opacity: 1; transform: translateY(0); }

        .fm-hover { transition: border-color .3s ease, box-shadow .3s ease; }
        .fm-hover:hover { border-color: rgba(52, 211, 153, 0.4); box-shadow: 0 10px 30px -12px rgba(52, 211, 153, 0.3); }
        .fm-btn { transition: transform .2s ease, box-shadow .2s ease, filter .2s ease; }
        .fm-btn:hover  { transform: translateY(-2px); box-shadow: 0 8px 20px -6px rgba(52, 211, 153, 0.5); filter: brightness(1.08); }
        .fm-btn:active { transform: translateY(0) scale(0.97); }

        @media (prefers-reduced-motion: reduce) {
          .fm-card, .fm-title, .fm-line { animation: none !important; }
          .fm-reveal { opacity: 1; transform: none; transition: none; }
          .fm-hover, .fm-btn { transition: none !important; }
          .fm-btn:hover { transform: none; }
        }
      `}</style>

      <div className='fm-card container mx-auto px-5 sm:px-10 py-10 lg:w-[70%] w-[90%] my-16 bg-gray-800 rounded-xl border border-gray-700/60 shadow-lg shadow-black/30'>
        <h1 className='fm-title text-3xl sm:text-4xl font-extrabold mb-3 text-center bg-linear-to-r from-green-400 to-blue-500 bg-clip-text text-transparent'>About Us</h1>
        <div className='fm-line mx-auto mb-10 h-1 w-20 rounded-full bg-linear-to-r from-green-400 to-blue-600'></div>

        <div className='space-y-6'>
          <Reveal>
            <div className='text-lg text-gray-300 leading-relaxed'>
              Our platform was created to make receiving and giving donations simple, transparent, and accessible for everyone. We believe that many people have meaningful goals, creative ideas, personal needs, or community projects but often lack an easy way to connect with supporters. This website exists to bridge that gap.
            </div>
          </Reveal>

          <Reveal>
            <div className='text-lg text-gray-300 leading-relaxed'>
              The idea behind this platform came from a simple question:
            </div>
            <div className='my-4 border-l-4 border-green-400 bg-gray-700/40 rounded-r-lg px-4 py-3 text-lg font-semibold text-white'>
              What if anyone could build a donation profile and start receiving support without complicated steps?
            </div>
            <div className='text-lg text-gray-300 leading-relaxed'>
              With that goal in mind, our founders designed a system where users can quickly create their presence and share their story with people who want to help.
            </div>
          </Reveal>

          <Reveal>
            <div className='text-lg text-gray-300 leading-relaxed'>
              Registered users can create an account and build their personal donation profile. After setting up their profile, it becomes visible on the platform so supporters can visit and contribute easily. Donors do not need to create an account. They can simply open a profile, fill in the donation details, and send support directly. This keeps the process fast and convenient for everyone.
            </div>
          </Reveal>

          <Reveal>
            <div className='text-lg text-gray-300 leading-relaxed'>
              Each registered user also gets access to an earnings section where they can track their donations. This helps users stay informed about how much support they have received and when contributions were made. Transparency and clarity are important parts of how this platform works.
            </div>
          </Reveal>

          {/* Mission highlight */}
          <Reveal>
            <div className='fm-hover rounded-xl p-0.75 bg-linear-to-br from-green-400/60 to-blue-600/60'>
              <div className='rounded-[calc(0.75rem-3px)] bg-gray-800 px-5 py-5 text-lg text-gray-100 leading-relaxed text-center'>
                Our mission is to create a space where support flows easily, trust grows naturally, and opportunities become reachable for people who need them.
              </div>
            </div>
          </Reveal>

          {/* Contact */}
          <Reveal>
            <div className='fm-hover rounded-xl bg-gray-700/40 border border-gray-600/40 px-5 py-5 text-lg text-gray-300 leading-relaxed'>
              If you have any questions, suggestions, or need assistance, feel free to contact us anytime: <br /> <strong className='text-white'>Email:</strong> <Link className='fm-btn inline-block mt-2 text-sm font-semibold text-green-300 bg-green-500/10 border border-green-500/30 rounded-full px-3 py-1 hover:underline' href="mailto:support@fundme.com">support@fundme.com</Link> 📩
            </div>
          </Reveal>

          <Reveal>
            <div className='text-lg text-gray-300 leading-relaxed text-center'>
              We are always happy to help and improve the experience for our community.
            </div>
          </Reveal>
        </div>
      </div>
    </>
  )
}

export default Page

// Title and description for the page
export const metadata = {
  title: 'About Us - Learn More About FundMe',
  description: 'Learn more about FundMe, our mission, and how we connect supporters with those in need. Discover how our platform works and how you can get involved.',
}