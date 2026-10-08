"use client"
import { useSession, signIn } from "next-auth/react"
import React, { useEffect } from 'react'
import Image from 'next/image'
import google from '../../public/google.png'
import facebook from '../../public/facebook.png'
import twitter from '../../public/twitter.png'
import github from '../../public/github.png'
import email from '../../public/email.png'
import { useRouter } from 'next/navigation'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Login = () => {
    const router = useRouter()
    const { data: session } = useSession()

    const handleLoginGitHub = () => {
        signIn("github")
    }

    const handleLoginGoogle = () => {
        signIn("google")
    }

    // Shown when a user taps a button that isn't available yet (works on touch devices too)
    const handleUnavailable = (platform) => {
        toast.info(`${platform} login is coming soon. Please use Google or GitHub for now.`, {
            toastId: 'login-unavailable', // prevents stacking if the user keeps tapping
            position: 'top-center',
            autoClose: 3500,
            theme: 'dark',
        })
    }

    useEffect(() => {
        if (session) {
            router.push('/dashboard')
        }
    }, [session, router])

    if (!session) {
        return (
            <>
                {/* Remove this ToastContainer if one already exists in your layout/another parent */}
                <ToastContainer />

                {/* Animations (UI only) */}
                <style>{`
                    @keyframes fm-fade-up {
                        from { opacity: 0; transform: translateY(18px); }
                        to   { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes fm-fade-up-dim {
                        from { opacity: 0; transform: translateY(18px); }
                        to   { opacity: 0.5; transform: translateY(0); }
                    }
                    @keyframes fm-card-in {
                        from { opacity: 0; transform: translateY(24px) scale(0.97); }
                        to   { opacity: 1; transform: translateY(0) scale(1); }
                    }
                    @keyframes fm-fade-in {
                        from { opacity: 0; }
                        to   { opacity: 1; }
                    }
                    .fm-card  { animation: fm-card-in 0.6s cubic-bezier(.2,.8,.3,1) both; }
                    .fm-title { animation: fm-fade-up 0.5s 0.2s ease-out both; }
                    .fm-line  { animation: fm-fade-in 0.8s 0.35s ease-out both; }
                    .fm-login {
                        animation: fm-fade-up 0.5s ease-out both;
                        transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease, background-color .25s ease;
                    }
                    /* Not-yet-available buttons: dimmed from the moment they appear */
                    .fm-login-disabled {
                        opacity: 0.5;
                        cursor: not-allowed;
                        animation-name: fm-fade-up-dim;
                    }
                    .fm-login:hover:not([aria-disabled="true"]) {
                        transform: translateY(-3px);
                        border-color: rgba(52, 211, 153, 0.6);
                        background-color: #4b5563;
                        box-shadow: 0 10px 24px -10px rgba(52, 211, 153, 0.45);
                    }
                    .fm-login:active:not([aria-disabled="true"]) { transform: translateY(0) scale(0.97); }
                    .fm-login-disabled:active { transform: translateX(0); animation: fm-shake 0.3s ease; }
                    @keyframes fm-shake {
                        0%, 100% { transform: translateX(0); }
                        25% { transform: translateX(-4px); }
                        75% { transform: translateX(4px); }
                    }
                    .fm-login:focus-visible { outline: none; box-shadow: 0 0 0 2px rgba(52, 211, 153, 0.6); }
                    .fm-login-icon { transition: transform .25s ease; }
                    .fm-login:hover:not([aria-disabled="true"]) .fm-login-icon { transform: scale(1.18) rotate(-6deg); }
                    @media (prefers-reduced-motion: reduce) {
                        .fm-card, .fm-title, .fm-line, .fm-login { animation: none !important; }
                        .fm-login, .fm-login-icon { transition: none !important; }
                        .fm-login:hover:not([aria-disabled="true"]), .fm-login:hover:not([aria-disabled="true"]) .fm-login-icon { transform: none; }
                    }
                `}</style>

                <div className='fm-card flex flex-col items-center justify-center h-max sm:w-max w-[90%] mx-auto my-10 bg-gray-800 text-white p-8 py-16 rounded-xl border border-gray-700/60 shadow-lg shadow-black/30'>
                    <h1 className='fm-title text-2xl font-bold mb-3 text-center bg-linear-to-r from-green-400 to-blue-500 bg-clip-text text-transparent'>Login with different platforms</h1>
                    <div className='fm-line mb-6 h-1 w-20 rounded-full bg-linear-to-r from-green-400 to-blue-600'></div>

                    <button onClick={handleLoginGoogle} style={{ animationDelay: '0.4s' }} className='fm-login bg-gray-700 border border-gray-600 text-white font-bold py-2.5 px-4 rounded-lg mb-3 sm:w-64 w-56 cursor-pointer flex justify-center items-center gap-2'><Image src={google} alt='Google' className='fm-login-icon w-5 h-5 object-contain'></Image> Login with Google</button>
                    <button onClick={handleLoginGitHub} style={{ animationDelay: '0.64s' }} className='fm-login bg-gray-700 border border-gray-600 text-white font-bold py-2.5 px-4 rounded-lg mb-3 sm:w-64 w-56 cursor-pointer flex justify-center items-center gap-2'><Image src={github} alt='GitHub' className='fm-login-icon w-5 h-5 object-contain'></Image> Login with GitHub</button>

                    <button aria-disabled="true" onClick={() => handleUnavailable('Facebook')} style={{ animationDelay: '0.48s' }} className='fm-login fm-login-disabled bg-gray-700 border border-gray-600 text-white font-bold py-2.5 px-4 rounded-lg mb-3 sm:w-64 w-56 flex justify-center items-center gap-2'><Image src={facebook} alt='Facebook' className='fm-login-icon w-5 h-5 object-contain'></Image> Login with Facebook </button>
                    <button aria-disabled="true" onClick={() => handleUnavailable('Twitter')} style={{ animationDelay: '0.56s' }} className='fm-login fm-login-disabled bg-gray-700 border border-gray-600 text-white font-bold py-2.5 px-4 rounded-lg mb-3 sm:w-64 w-56 flex justify-center items-center gap-2'><Image src={twitter} alt='Twitter' className='fm-login-icon w-5 h-5 object-contain'></Image> Login with Twitter </button>
                    <button aria-disabled="true" onClick={() => handleUnavailable('Email')} style={{ animationDelay: '0.72s' }} className='fm-login fm-login-disabled bg-gray-700 border border-gray-600 text-white font-bold py-2.5 px-4 rounded-lg sm:w-64 w-56 flex justify-center items-center gap-2'><Image src={email} alt='Email' className='fm-login-icon w-5 h-5 object-contain'></Image> Login with Email </button>
                </div>
            </>

        )
    }

    // If session exists, useEffect will handle the redirect
    return null
}

export default Login