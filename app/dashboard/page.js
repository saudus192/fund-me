"use client"
import React from 'react'
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { getUser, saveUser, getUserByUsername } from '@/actions/useractions'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify';
import Loader from '@/components/loader'
import Image from 'next/image'

const Dashboard = () => {
    const { data: session, status } = useSession()
    const router = useRouter()
    const userEmail = session?.user?.email
    const [userData, setUserData] = React.useState(null)
    const [error, setError] = React.useState('')
    const [isUpdating, setIsUpdating] = React.useState(false)
    const [formData, setFormData] = React.useState({
        name: session?.user?.name || '',
        username: session?.user?.name?.replace(/\s+/g, '').toLowerCase() || '',
        email: session?.user?.email || '',
        topSkill: 'Digital Marketer',
        profilePicture: session?.user?.image || '',
        coverPicture: "https://img.freepik.com/free-psd/digital-marketing-agency-corporate-facebook-cover-template_106176-2262.jpg?t=st=1772826219~exp=1772829819~hmac=db9290a9843685880887a47b7027f37a4a02c4c9692052348cac8ad3f6fdcd67&w=1480"
    })

    // Fetch user data when the component mounts
    React.useEffect(() => {
        if (userEmail) {
            getUser(userEmail).then((data) => {
                setUserData(data)
                setFormData({
                    name: data?.name || '',
                    username: data?.username || '',
                    email: data?.email || '',
                    topSkill: data?.topSkill || 'Digital Marketer',
                    profilePicture: data?.profilePicture || '',
                    coverPicture: data?.coverPicture || "https://img.freepik.com/free-psd/digital-marketing-agency-corporate-facebook-cover-template_106176-2262.jpg?t=st=1772826219~exp=1772829819~hmac=db9290a9843685880887a47b7027f37a4a02c4c9692052348cac8ad3f6fdcd67&w=1480"
                })
            })
        }
    }, [userEmail])

    // Fetch user data if user not found in database
    React.useEffect(() => {
        if (userEmail && !userData) {
            getUser(userEmail).then(async (data) => {
                if (!data) {
                    // User not found, initialize with session data and save to database
                    const initialData = {
                        name: session?.user?.name || '',
                        username: session?.user?.name?.replace(/\s+/g, '').toLowerCase() || '',
                        email: session?.user?.email || '',
                        topSkill: 'Digital Marketer',
                        profilePicture: session?.user?.image || '',
                        coverPicture: "https://img.freepik.com/free-psd/digital-marketing-agency-corporate-facebook-cover-template_106176-2262.jpg?t=st=1772826219~exp=1772829819~hmac=db9290a9843685880887a47b7027f37a4a02c4c9692052348cac8ad3f6fdcd67&w=1480"
                    }
                    const savedUser = await saveUser(initialData)
                    setUserData(savedUser)
                    setFormData(initialData)
                } else {
                    setUserData(data)
                    setFormData({
                        name: data?.name || '',
                        username: data?.username || '',
                        email: data?.email || '',
                        topSkill: data?.topSkill || 'Digital Marketer',
                        profilePicture: data?.profilePicture || '',
                        coverPicture: data?.coverPicture || "https://img.freepik.com/free-psd/digital-marketing-agency-corporate-facebook-cover-template_106176-2262.jpg?t=st=1772826219~exp=1772829819~hmac=db9290a9843685880887a47b7027f37a4a02c4c9692052348cac8ad3f6fdcd67&w=1480"
                    })

                }
            })
        }
    }, [userEmail, userData, session])

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (isUpdating) return // ignore double clicks while an update is running
        setError('')
        setIsUpdating(true)

        try { // outer try/finally only makes sure the loading state is always reset
        // Check if username is unique if it has changed
        if (formData.username !== userData?.username) {
            const existingUser = await getUserByUsername(formData.username)
            if (existingUser && existingUser.email !== userData?.email) {
                setError('Username is already taken. Please choose a different one.')
                return
            }
        }

        try {
            await saveUser(formData);
            // Refresh user data after update
            const updatedUser = await getUser(userEmail)
            setUserData(updatedUser)
            setFormData({
                name: updatedUser?.name || '',
                username: updatedUser?.username || '',
                email: updatedUser?.email || '',
                topSkill: updatedUser?.topSkill || 'Digital Marketer',
                profilePicture: updatedUser?.profilePicture || '',
                coverPicture: updatedUser?.coverPicture || "https://img.freepik.com/free-psd/digital-marketing-agency-corporate-facebook-cover-template_106176-2262.jpg?t=st=1772826219~exp=1772829819~hmac=db9290a9843685880887a47b7027f37a4a02c4c9692052348cac8ad3f6fdcd67&w=1480"
            })
            toast.success('Information updated successfully!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
        } catch (err) {
            setError('An error occurred while updating. Please try again.')
        }
        } finally {
            setIsUpdating(false)
        }
    }

    useEffect(() => {
        if (status !== "loading" && !session) {
            router.push('/login')
        }
    }, [session, status, router])

    // Guard against session being undefined during initial render
    if (status === "loading") {
        return < Loader text="Loading dashboard..." />
    }

    if (!session) {
        return <p className='text-gray-300 text-center mt-16 animate-pulse'>You must be logged in to view the dashboard.</p>
    }

    const { name, email, image } = session.user

    // UI only: shared input style
    const inputCls = 'fm-input w-full bg-gray-700 text-white placeholder:text-gray-400 border border-gray-600 p-2.5 rounded-lg'

    return (
        <>
            {/* Animations (UI only) */}
            <style>{`
                @keyframes fm-fade-up {
                    from { opacity: 0; transform: translateY(18px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes fm-pop {
                    0%   { transform: scale(0.6); opacity: 0; }
                    70%  { transform: scale(1.12); }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes fm-shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .fm-card   { animation: fm-fade-up 0.6s ease-out both; }
                .fm-avatar { animation: fm-pop 0.7s 0.2s cubic-bezier(.2,.9,.3,1.2) both; }
                .fm-field  { animation: fm-fade-up 0.5s ease-out both; }
                .fm-error  { animation: fm-shake 0.35s ease-out both; }
                .fm-input  { transition: box-shadow .2s ease, background-color .2s ease, border-color .2s ease; }
                .fm-input:hover:not(:disabled) { border-color: rgba(52, 211, 153, 0.5); }
                .fm-input:focus { outline: none; border-color: rgba(52, 211, 153, 0.8); box-shadow: 0 0 0 2px rgba(52, 211, 153, 0.45); background-color: #4b5563; }
                .fm-btn    { transition: transform .2s ease, box-shadow .2s ease, filter .2s ease; }
                .fm-btn:hover:not(:disabled)  { transform: translateY(-2px); box-shadow: 0 8px 20px -6px rgba(52, 211, 153, 0.5); filter: brightness(1.08); }
                .fm-btn:active:not(:disabled) { transform: translateY(0) scale(0.98); }
                @media (prefers-reduced-motion: reduce) {
                    .fm-card, .fm-avatar, .fm-field, .fm-error { animation: none !important; }
                    .fm-input, .fm-btn { transition: none !important; }
                }
            `}</style>

            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark" />
            {/* Dashboard form for store and update information */}
            <div className='fm-card bg-gray-800 text-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-700/60 max-w-2xl md:mx-auto mx-4 my-10'>
                {/* Header with live profile picture preview */}
                <div className='flex flex-col items-center text-center mb-8'>
                    <div className='fm-avatar rounded-full p-0.75 bg-linear-to-br from-green-400 to-blue-600 shadow-lg shadow-black/40'>
                        <Image
                            width={80}
                            height={80}
                            src={formData.profilePicture || image || '/avatar.gif'}
                            alt="Profile preview"
                            className='w-20 h-20 rounded-full object-cover bg-gray-700 border-2 border-gray-800'
                            onError={(e) => { e.currentTarget.src = '/avatar.gif' }}
                        />
                    </div>
                    <h1 className='sm:text-2xl text-xl font-bold mt-4'>Welcome to the Dashboard, <span className='bg-linear-to-r from-green-400 to-blue-500 bg-clip-text text-transparent'>{name}</span>!</h1>
                    <p className='text-sm text-gray-400 mt-1'>Update your public profile information below.</p>
                </div>

                <form className='flex flex-col gap-5' onSubmit={handleUpdate}>
                    <div className='fm-field flex flex-col gap-1.5' style={{ animationDelay: '0.15s' }}>
                        <label className='text-sm font-semibold text-gray-300' htmlFor="name">Name</label>
                        <input className={inputCls} type="text" id="name" name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    </div>

                    {/* Name to username which removes the space between characters */}
                    <div className='fm-field flex flex-col gap-1.5' style={{ animationDelay: '0.22s' }}>
                        <label className='text-sm font-semibold text-gray-300' htmlFor="username">Username</label>
                        <div className='relative'>
                            <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none'>@</span>
                            <input className={`${inputCls} pl-7`} type="text" id="username" name="username" value={formData.username} onChange={(e) => { setFormData({ ...formData, username: e.target.value }); setError('') }} />
                        </div>
                        {error && (
                            <p className='fm-error flex items-center gap-1.5 text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2'>
                                <svg className='w-4 h-4 shrink-0' fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                {error}
                            </p>
                        )}
                    </div>

                    <div className='fm-field flex flex-col gap-1.5' style={{ animationDelay: '0.29s' }}>
                        <label className='text-sm font-semibold text-gray-300' htmlFor="email">Email <span className='font-normal text-gray-500'>(cannot be changed)</span></label>
                        {/* Email not editable */}
                        <input disabled className={`${inputCls} disabled:cursor-not-allowed disabled:opacity-60`} type="email" id="email" name="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    </div>

                    <div className='fm-field flex flex-col gap-1.5' style={{ animationDelay: '0.36s' }}>
                        <label className='text-sm font-semibold text-gray-300' htmlFor="topSkill">Top Skill</label>
                        <input className={inputCls} type="text" id="topSkill" name="topSkill" value={formData.topSkill} onChange={(e) => setFormData({ ...formData, topSkill: e.target.value })} />
                    </div>

                    <div className='fm-field flex flex-col gap-1.5' style={{ animationDelay: '0.43s' }}>
                        <label className='text-sm font-semibold text-gray-300' htmlFor="profilePicture">Profile Picture <span className='font-normal text-gray-500'>(image URL)</span></label>
                        <input className={inputCls} type="text" id="profilePicture" name="profilePicture" value={formData.profilePicture} onChange={(e) => setFormData({ ...formData, profilePicture: e.target.value })} />
                    </div>

                    <div className='fm-field flex flex-col gap-1.5' style={{ animationDelay: '0.5s' }}>
                        <label className='text-sm font-semibold text-gray-300' htmlFor="coverPicture">Cover Picture <span className='font-normal text-gray-500'>(image URL)</span></label>
                        <input className={inputCls} type="text" id="coverPicture" name="coverPicture" value={formData.coverPicture} onChange={(e) => setFormData({ ...formData, coverPicture: e.target.value })} />
                    </div>

                    <button
                        className='fm-btn fm-field mt-2 inline-flex items-center justify-center gap-2 cursor-pointer disabled:cursor-wait disabled:opacity-70 text-white bg-linear-to-br from-green-400 to-blue-600 hover:bg-linear-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-bold rounded-2xl text-sm px-4 py-3 text-center leading-5'
                        style={{ animationDelay: '0.57s' }}
                        type="submit"
                        disabled={isUpdating}
                        aria-busy={isUpdating}
                    >
                        {isUpdating && (
                            <svg className='w-4 h-4 animate-spin' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                                <circle className='opacity-25' cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className='opacity-90' fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                            </svg>
                        )}
                        {isUpdating ? 'Updating...' : 'Update Information'}
                    </button>
                </form>
            </div>
        </>
    )
}

export default Dashboard