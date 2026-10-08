"use client"
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import logo from '../public/logo.png'
import { useSession, signOut } from "next-auth/react"
import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getUsernameByEmail } from '@/actions/useractions'

const Navbar = () => {
    const { data: session } = useSession()
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const pathname = usePathname()
    const dropdownRef = useRef(null)

    // UI-only state: scroll transparency + mobile top menu
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [mobileAccountOpen, setMobileAccountOpen] = useState(false)
    const navRef = useRef(null)

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    // Make the navbar translucent once the user scrolls down
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10)
        onScroll()
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    // Close the mobile menu when clicking outside the navbar
    useEffect(() => {
        function handleOutsideNav(event) {
            if (navRef.current && !navRef.current.contains(event.target)) {
                setMenuOpen(false)
                setMobileAccountOpen(false)
            }
        }
        document.addEventListener("mousedown", handleOutsideNav)
        return () => document.removeEventListener("mousedown", handleOutsideNav)
    }, [])

    const closeMenu = () => {
        setMenuOpen(false)
        setMobileAccountOpen(false)
    }

    const handleSignOut = () => {
        signOut()
        router.push('/login')
    }

    const handleSearch = (e) => {
        e.preventDefault()
        const username = e.target[0].value.trim()?.replace(/\s+/g, '').toLowerCase()
        // Perform search logic here
        if (username) {
            router.push(`/${username}`)
        }
    }

    const HandleRedirect = async () => {
        if (session) {
            const email = session.user.email
            const username = await getUsernameByEmail(email)
            if (username) {
                router.push(`/${username}`)
            }
        }
    }

    // Styles (UI only) - same language as the rest of the site:
    // gradient = primary action, dark outlined = secondary action
    const gradientBtn = "text-white bg-linear-to-br from-green-400 to-blue-600 hover:bg-linear-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-bold rounded-2xl text-sm px-4 py-2.5 text-center leading-5 hover:cursor-pointer"
    const secondaryBase = "text-white bg-gray-700/50 border hover:bg-gray-700 transition-colors focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-bold rounded-2xl text-sm px-4 py-2.5 text-center leading-5 hover:cursor-pointer"
    const secondaryBtn = `${secondaryBase} border-gray-600 hover:border-green-400/70`
    // Highlight "Fundraisers" while the user is on that page
    const fundraisersBtn = pathname === "/top-fundraisers"
        ? `${secondaryBase} border-green-500/70 text-green-300`
        : secondaryBtn
    const menuItem = "inline-flex items-center w-full p-2 rounded-lg text-gray-200 hover:text-white hover:bg-gray-700 transition-colors"
    const menuItemDanger = "inline-flex items-center w-full p-2 rounded-lg text-gray-200 hover:text-red-400 hover:bg-red-500/10 transition-colors"

    // Shared pieces (rendered in the desktop row and in the mobile menu)
    const renderSearch = (formCls, inputCls) => (
        <form className={formCls} onSubmit={(e) => { handleSearch(e); closeMenu() }}>
            <input className={`bg-gray-700 text-white placeholder:text-gray-400 border border-gray-600 rounded-lg hover:border-green-400/50 focus:outline-none focus:border-green-400/80 focus:ring-2 focus:ring-green-500/50 transition-colors p-2 ${inputCls}`} type="search" placeholder="Search user by username " />
            <button className='text-white bg-linear-to-br from-green-400 to-blue-600 hover:bg-linear-to-bl focus:outline-none focus:ring-2 focus:ring-green-500/50 font-bold py-2 px-3 rounded-xl hover:cursor-pointer' type="submit">Search</button>
        </form>
    )

    const renderLogin = (full) => (
        pathname === "/login" ? (
            <button type="button" className={`${gradientBtn} disabled:hover:cursor-not-allowed disabled:opacity-60 ${full ? 'flex-1' : ''}`} disabled>
                Login
            </button>
        ) : (
            <Link href="/login" className={full ? 'flex-1 flex' : ''} onClick={closeMenu}>
                <button type="button" className={`${gradientBtn} ${full ? 'w-full' : ''}`}>
                    Login
                </button>
            </Link>
        )
    )

    return (
        <>
            <style>{`
                @keyframes fm-menu-down {
                    from { opacity: 0; transform: translateY(-10px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .fm-menu { animation: fm-menu-down 0.25s ease-out both; }
                @media (prefers-reduced-motion: reduce) {
                    .fm-menu { animation: none !important; }
                }
            `}</style>

            {/* Sticky navbar: becomes translucent + blurred after scrolling */}
            <nav
                ref={navRef}
                className={`sticky top-0 z-50 flex items-center justify-between px-5 py-3 w-full h-16 transition-all duration-300 border-b ${scrolled ? 'bg-gray-800/70 backdrop-blur-md border-gray-700/50 shadow-lg shadow-black/20' : 'bg-gray-800 border-gray-700/60'}`}
            >
                <div className='text-2xl font-bold'>
                    <Link href="/"><Image width={200} height={50} src={logo} alt="Fund Me Logo" className='w-40 sm:w-50 h-auto' /></Link>
                </div>

                {/* Desktop (sm and up): search */}
                {renderSearch('hidden sm:flex items-center gap-3', 'md:w-56.5 sm:w-31.5')}

                {/* Desktop (sm and up): buttons */}
                <div className='hidden sm:flex items-center gap-3.5'>
                    <Link href="/top-fundraisers">
                        <button type="button" className={fundraisersBtn}>Fundraisers</button>
                    </Link>
                    {session && <>

                        <div ref={dropdownRef} className="relative inline-block">

                            <button
                                onClick={() => setOpen(!open)}
                                className={`${secondaryBtn} inline-flex items-center justify-center`}
                            >
                                Account
                                {open ? (
                                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                                    </svg>
                                ) : (
                                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                )}
                            </button>

                            {open && (
                                <div className="fm-menu absolute right-0 mt-3 z-10 bg-gray-800 border border-gray-700/60 rounded-xl shadow-xl shadow-black/40 w-36">
                                    <ul className="p-2 text-sm font-medium space-y-0.5">
                                        <li>
                                            <Link href="/dashboard" className={menuItem}>
                                                Dashboard
                                            </Link>
                                        </li>
                                        <li>
                                            {/* Disabled */}
                                            <button onClick={HandleRedirect} className={`${menuItem} hover:cursor-pointer`}>
                                                View profile
                                            </button>
                                        </li>
                                        <li>
                                            <Link href="/earnings" className={menuItem}>
                                                Earnings
                                            </Link>
                                        </li>
                                        <li className="pt-1 mt-1 border-t border-gray-700/60">
                                            <Link onClick={handleSignOut} href="#" className={menuItemDanger}>
                                                Sign out
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            )}

                        </div>
                    </>}

                    {!session && <>
                        {/* If user is in login page, disable the login button */}
                        {renderLogin(false)}
                    </>}
                </div>

                {/* Mobile (below sm): hamburger icon */}
                <button
                    type="button"
                    className='sm:hidden p-2 rounded-lg text-gray-200 bg-gray-700/50 border border-gray-600 hover:text-white hover:border-green-400/70 hover:bg-gray-700 transition-colors hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500'
                    aria-label={menuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={menuOpen}
                    onClick={() => { setMenuOpen(!menuOpen); setMobileAccountOpen(false) }}
                >
                    {menuOpen ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 6l12 12M18 6L6 18"></path>
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    )}
                </button>

                {/* Mobile top menu: drops down slightly below the navbar */}
                {menuOpen && (
                    <div className='fm-menu sm:hidden absolute top-full left-3 right-3 mt-2 p-4 rounded-xl bg-gray-800/95 backdrop-blur-md border border-gray-700/60 shadow-xl shadow-black/40 space-y-4'>
                        {/* Row 1: search */}
                        {renderSearch('flex items-center gap-3', 'flex-1 min-w-0')}

                        {/* Row 2: buttons */}
                        <div className='flex items-center gap-3'>
                            <Link href="/top-fundraisers" className='flex-1 flex' onClick={closeMenu}>
                                <button type="button" className={`${fundraisersBtn} w-full`}>Fundraisers</button>
                            </Link>
                            {session ? (
                                <button
                                    type="button"
                                    onClick={() => setMobileAccountOpen(!mobileAccountOpen)}
                                    className={`${secondaryBtn} flex-1 inline-flex items-center justify-center`}
                                >
                                    Account
                                    <svg className={`ml-2 w-4 h-4 transition-transform duration-200 ${mobileAccountOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                            ) : (
                                renderLogin(true)
                            )}
                        </div>

                        {/* Account options (same links as the desktop dropdown) */}
                        {session && mobileAccountOpen && (
                            <ul className="fm-menu rounded-xl bg-gray-700/50 border border-gray-600/40 p-2 text-sm font-medium space-y-0.5">
                                <li>
                                    <Link href="/dashboard" onClick={closeMenu} className={menuItem}>
                                        Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <button onClick={() => { HandleRedirect(); closeMenu() }} className={`${menuItem} hover:cursor-pointer`}>
                                        View profile
                                    </button>
                                </li>
                                <li>
                                    <Link href="/earnings" onClick={closeMenu} className={menuItem}>
                                        Earnings
                                    </Link>
                                </li>
                                <li className="pt-1 mt-1 border-t border-gray-600/40">
                                    <Link onClick={() => { handleSignOut(); closeMenu() }} href="#" className={menuItemDanger}>
                                        Sign out
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </div>
                )}
            </nav>
        </>
    )
}

export default Navbar