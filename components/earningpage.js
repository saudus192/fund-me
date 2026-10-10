"use client"
import React from 'react'
import Image from 'next/image'
import { getPaymentsReceived } from '@/actions/useractions'

// UI only: rank badge styles (gold / silver / bronze / rest) - same as Profile page
const rankStyles = [
    'from-yellow-300 to-amber-500 text-gray-900 ring-yellow-400/60',
    'from-gray-200 to-gray-400 text-gray-900 ring-gray-300/60',
    'from-orange-300 to-orange-600 text-gray-900 ring-orange-400/60',
    'from-gray-600 to-gray-700 text-gray-200 ring-gray-500/40',
    'from-gray-600 to-gray-700 text-gray-200 ring-gray-500/40',
]

const EarningPage = ({ username }) => {
    const [payments, setPayments] = React.useState([])
    const [isLoading, setIsLoading] = React.useState(true)
    const [hasError, setHasError] = React.useState(false)

    React.useEffect(() => {
        // No username -> nothing to fetch
        if (!username) {
            setPayments([])
            setHasError(false)
            setIsLoading(false)
            return
        }

        let ignore = false

        const fetchPayments = async () => {
            setIsLoading(true)
            setHasError(false)
            try {
                const data = await getPaymentsReceived(username)
                if (!ignore) {
                    const safeData = Array.isArray(data)
                        ? data.map((p) => ({ ...p, amount: Number(p.amount) || 0 }))
                        : []
                    setPayments(safeData)
                }
            } catch (error) {
                console.error('Failed to fetch payments:', error)
                if (!ignore) {
                    setPayments([])
                    setHasError(true)
                }
            } finally {
                if (!ignore) setIsLoading(false)
            }
        }

        fetchPayments()
        return () => { ignore = true }
    }, [username])

    // Derived values (read-only, no state changes)
    const totalEarnings = payments.reduce((sum, payment) => sum + payment.amount, 0)
    const highestDonation = payments.reduce((max, payment) => Math.max(max, payment.amount), 0)
    const topSupporters = [...payments].sort((a, b) => b.amount - a.amount).slice(0, 5)

    // Username could not be resolved (e.g. user not found in database)
    if (!username) {
        return (
            <div className='container mx-auto p-5 lg:w-[45%] md:w-[60%] sm:w-[75%] w-[90%] my-8'>
                <p className='text-gray-300 text-center'>We couldn&apos;t find your profile, so there are no earnings to show.</p>
            </div>
        )
    }

    return (
        <>
            {/* Animations (UI only) */}
            <style>{`
                @keyframes fm-fade-up {
                    from { opacity: 0; transform: translateY(18px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes fm-slide-in {
                    from { opacity: 0; transform: translateX(-16px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                @keyframes fm-float {
                    0%, 100% { transform: translateY(0); }
                    50%      { transform: translateY(-4px); }
                }
                .fm-head   { animation: fm-fade-up 0.6s ease-out both; }
                .fm-card   { animation: fm-fade-up 0.6s ease-out both; transition: box-shadow .3s ease, border-color .3s ease; }
                .fm-card:hover { box-shadow: 0 10px 30px -10px rgba(52, 211, 153, 0.25); border-color: rgba(52, 211, 153, 0.35); }
                .fm-item   { animation: fm-slide-in 0.5s ease-out both; transition: transform .25s ease, background-color .25s ease; }
                .fm-item:hover { transform: translateX(4px) scale(1.01); background-color: rgba(55, 65, 81, 0.9); }
                .fm-crown  { animation: fm-float 2.2s ease-in-out infinite; }
                @media (prefers-reduced-motion: reduce) {
                    .fm-head, .fm-card, .fm-item, .fm-crown { animation: none !important; }
                    .fm-item { transition: none !important; }
                }
            `}</style>

            <div className='container mx-auto p-5 lg:w-[45%] md:w-[60%] sm:w-[75%] w-[90%] my-8 space-y-6'>
                <h1 className='fm-head text-2xl font-bold text-center text-white'>Earnings for @{username}</h1>

                {/* Total Earnings */}
                <div className='fm-card bg-gray-800 p-5 rounded-xl border border-gray-700/60' style={{ animationDelay: '0.1s' }}>
                    <p className='text-sm text-gray-400 text-center'>Total Earnings</p>
                    <p className='text-4xl font-extrabold text-center mt-1 bg-linear-to-r from-green-400 to-blue-500 bg-clip-text text-transparent'>
                        {isLoading ? '—' : `$${totalEarnings.toFixed(2)}`}
                    </p>
                    <div className='mt-4 grid grid-cols-2 gap-3'>
                        <div className='rounded-lg bg-gray-900/60 border border-gray-700/60 px-4 py-3 text-center'>
                            <p className='text-xs text-gray-400'>Payments</p>
                            <p className='text-lg font-bold text-white'>{isLoading ? '—' : payments.length}</p>
                        </div>
                        <div className='rounded-lg bg-gray-900/60 border border-gray-700/60 px-4 py-3 text-center'>
                            <p className='text-xs text-gray-400'>Highest donation</p>
                            <p className='text-lg font-bold text-green-300'>{isLoading ? '—' : `$${highestDonation.toFixed(2)}`}</p>
                        </div>
                    </div>
                </div>

                {/* Top 5 Supporters */}
                {!isLoading && payments.length > 0 && (
                    <div className='fm-card bg-gray-800 p-5 rounded-xl border border-gray-700/60' style={{ animationDelay: '0.2s' }}>
                        <div className='flex items-center gap-2'>
                            <span className='fm-crown text-2xl' aria-hidden="true">🏆</span>
                            <h2 className='text-xl font-bold text-white'>Top 5 Supporters</h2>
                        </div>
                        <ul className='mt-4 space-y-3'>
                            {topSupporters.map((payment, index) => (
                                <li
                                    key={payment._id}
                                    className='fm-item flex items-center gap-3 rounded-lg bg-gray-700/50 border border-gray-600/40 p-3'
                                    style={{ animationDelay: `${0.35 + index * 0.12}s` }}
                                >
                                    <span className={`shrink-0 w-7 h-7 rounded-full bg-linear-to-br ${rankStyles[index]} ring-2 flex items-center justify-center text-xs font-bold`}>
                                        {index + 1}
                                    </span>
                                    <Image src="/avatar.gif" alt="Avatar" width={40} height={40} className='rounded-full shrink-0 ring-2 ring-gray-600' />
                                    <div className='min-w-0 flex-1 flex items-center justify-between gap-2'>
                                        <span className='font-semibold text-white truncate'>{payment.fromPerson}</span>
                                        <span className='shrink-0 text-sm font-bold text-green-300 bg-green-500/10 border border-green-500/30 rounded-full px-2.5 py-0.5'>
                                            ${payment.amount.toFixed(2)}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* All payments */}
                <div className='fm-card bg-gray-800 p-5 rounded-xl border border-gray-700/60' style={{ animationDelay: '0.3s' }}>
                    <h2 className='text-xl font-bold text-white'>All Payments</h2>
                    {isLoading ? (
                        <p className='mt-3 text-gray-300 animate-pulse'>Loading earnings...</p>
                    ) : hasError ? (
                        <p className='mt-3 text-red-400'>Something went wrong while loading your earnings. Please try again.</p>
                    ) : payments.length === 0 ? (
                        <p className='mt-3 text-gray-300'>No payments received.</p>
                    ) : (
                        <div className='mt-4 flex flex-col gap-3'>
                            {payments.map((payment, index) => (
                                <div
                                    key={payment._id}
                                    className='fm-item flex items-center gap-3 rounded-lg bg-gray-700/50 border border-gray-600/40 p-3'
                                    style={{ animationDelay: `${0.45 + Math.min(index, 10) * 0.07}s` }}
                                >
                                    <Image src="/avatar.gif" alt="Avatar" width={40} height={40} className='rounded-full shrink-0 ring-2 ring-gray-600' />
                                    <div className='min-w-0 flex-1'>
                                        <div className='flex items-center justify-between gap-2'>
                                            <span className='font-semibold text-white truncate'>{payment.fromPerson}</span>
                                            <span className='shrink-0 text-sm font-bold text-green-300 bg-green-500/10 border border-green-500/30 rounded-full px-2.5 py-0.5'>
                                                ${payment.amount.toFixed(2)}
                                            </span>
                                        </div>
                                        <p className='text-xs text-gray-400 mt-0.5'>{new Date(payment.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default EarningPage