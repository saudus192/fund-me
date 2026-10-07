import React from 'react'
import Link from 'next/link'

const Footer = () => {
    const year = new Date().getFullYear();
  return (
    <div>
        <footer className="relative bg-gray-800 text-white py-5 text-center border-t border-gray-700/60">
            {/* Gradient accent line on the top edge */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-1/2 bg-linear-to-r from-transparent via-green-400/70 to-transparent" aria-hidden="true"></div>

            {/* Quick links */}
            <nav className="flex justify-center gap-5 mb-3 text-sm text-gray-400" aria-label="Footer">
                <Link href="/" className="hover:text-green-300 transition-colors">Home</Link>
                <Link href="/about" className="hover:text-green-300 transition-colors">About</Link>
                <Link href="/top-fundraisers" className="hover:text-green-300 transition-colors">Fundraisers</Link>
            </nav>

            <p className="text-sm text-gray-300">&copy; {year} <strong className="bg-linear-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Fund-Me</strong>. All rights reserved.</p>
        </footer>
    </div>
  )
}

export default Footer