"use client"
import React from 'react'
import Image from 'next/image'
import { getAllUsers } from '@/actions/useractions'
import { useRouter } from 'next/navigation'
import Loader from '@/components/loader'

const TopFundraisers = () => {
    const [users, setUsers] = React.useState([])
    const [isLoading, setIsLoading] = React.useState(true)
    const router = useRouter()

    React.useEffect(() => {
        let ignore = false

        const fetchUsers = async () => {
            try {
                const data = await getAllUsers()
                if (!ignore) setUsers(data || [])
            } catch (error) {
                console.error('Failed to fetch fundraisers:', error)
            } finally {
                if (!ignore) setIsLoading(false)
            }
        }

        fetchUsers()
        return () => { ignore = true }
    }, [])

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
                .fm-head { animation: fm-fade-up 0.6s ease-out both; }
                .fm-sub  { animation: fm-fade-up 0.6s 0.12s ease-out both; }
                .fm-line { animation: fm-fade-in 0.8s 0.3s ease-out both; }
                .fm-card {
                    animation: fm-fade-up 0.55s ease-out both;
                    transition: transform .3s ease, box-shadow .3s ease, border-color .3s ease;
                }
                .fm-card:hover {
                    transform: translateY(-6px);
                    border-color: rgba(52, 211, 153, 0.4);
                    box-shadow: 0 16px 32px -12px rgba(52, 211, 153, 0.3);
                }
                .fm-ring { transition: transform .4s ease, box-shadow .4s ease; }
                .fm-card:hover .fm-ring { transform: scale(1.08) rotate(3deg); box-shadow: 0 0 20px rgba(52, 211, 153, 0.45); }
                .fm-arrow { transition: transform .25s ease; }
                .fm-btn:hover .fm-arrow { transform: translateX(4px); }
                .fm-btn { transition: transform .2s ease, box-shadow .2s ease, filter .2s ease; }
                .fm-btn:hover  { box-shadow: 0 8px 20px -6px rgba(52, 211, 153, 0.5); filter: brightness(1.08); }
                .fm-btn:active { transform: scale(0.97); }
                @media (prefers-reduced-motion: reduce) {
                    .fm-head, .fm-sub, .fm-line, .fm-card { animation: none !important; }
                    .fm-card, .fm-ring, .fm-arrow, .fm-btn { transition: none !important; }
                    .fm-card:hover, .fm-card:hover .fm-ring { transform: none; }
                }
            `}</style>

            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
                <h1 className='fm-head text-3xl sm:text-4xl font-extrabold mb-3 text-center bg-linear-to-r from-green-400 to-blue-500 bg-clip-text text-transparent'>
                    <span className='mr-2' aria-hidden="true">🏆</span>Top Fundraisers
                </h1>
                <p className='fm-sub text-gray-400 text-center'>Discover the most successful fundraisers and their impact.</p>
                <div className='fm-line mx-auto mt-4 mb-10 h-1 w-24 rounded-full bg-linear-to-r from-green-400 to-blue-600'></div>

                {isLoading ? (
                    // 1) Still fetching from the database
                    <Loader text="Loading top fundraisers..." />
                ) : users.length === 0 ? (
                    // 2) Fetch finished, nothing returned
                    <p className='text-gray-400 text-center'>No fundraisers found.</p>
                ) : (
                    // 3) Fetch finished, fundraisers available
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                        {/* Fundraiser cards */}
                        {users.map((user, index) => (
                            <div
                                className='fm-card bg-gray-800 border border-gray-700/60 shadow-md rounded-xl p-6 flex flex-col items-center text-center'
                                key={user._id}
                                style={{ animationDelay: `${Math.min(index, 11) * 0.07}s` }}
                            >
                                {/* Profile picture with gradient ring */}
                                <div className='fm-ring rounded-full p-0.75 bg-linear-to-br from-green-400 to-blue-600 mb-4'>
                                    <div className='w-18 h-18 bg-gray-700 rounded-full overflow-hidden border-2 border-gray-800'>
                                        <Image src={user.profilePicture || '/avatar.gif'} alt="Profile Picture" width={72} height={72} className='w-full h-full object-cover' />
                                    </div>
                                </div>
                                <h2 className='text-xl font-semibold mb-0.5 text-white wrap-break-word max-w-full'>{user.name}</h2>
                                <p className='text-gray-400 mb-3 max-w-full truncate'>@{user.username}</p>
                                {user.topSkill && (
                                    <span className='text-xs font-semibold text-green-300 bg-green-500/10 border border-green-500/30 rounded-full px-3 py-1 mb-5 max-w-full truncate'>
                                        {user.topSkill}
                                    </span>
                                )}
                                <button className='fm-btn mt-auto w-full inline-flex items-center justify-center gap-2 text-white bg-linear-to-br from-green-400 to-blue-600 hover:bg-linear-to-bl font-semibold py-2 px-4 rounded-lg text-sm hover:cursor-pointer' onClick={() => router.push(`/${user.username}`)}>
                                    View Profile
                                    <svg className='fm-arrow w-4 h-4' fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 12h14M13 6l6 6-6 6"></path>
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}

export default TopFundraisers