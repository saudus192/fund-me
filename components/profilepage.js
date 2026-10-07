/* eslint-disable @next/next/no-img-element */
"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { savePayment, getPaymentsReceived } from '@/actions/useractions'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify';
import PaymentForm from "@/components/paymentform";

// UI only: styles for rank badges (gold / silver / bronze / rest)
const rankStyles = [
    'from-yellow-300 to-amber-500 text-gray-900 ring-yellow-400/60',
    'from-gray-200 to-gray-400 text-gray-900 ring-gray-300/60',
    'from-orange-300 to-orange-600 text-gray-900 ring-orange-400/60',
    'from-gray-600 to-gray-700 text-gray-200 ring-gray-500/40',
    'from-gray-600 to-gray-700 text-gray-200 ring-gray-500/40',
]

const ProfilePage = ({ uname, userData }) => {
    const [showGateway, setShowGateway] = React.useState(false)
    const [pendingPaymentData, setPendingPaymentData] = React.useState(null)
    const router = useRouter()
    const Name = userData?.name
    const TopSkill = userData?.topSkill
    const ProfilePicture = userData?.profilePicture
    const CoverPicture = userData?.coverPicture

    const [payments, setPayments] = React.useState([])

    // Copy profile link: `copied` drives the icon (copy -> checkmark)
    const [copied, setCopied] = React.useState(false)
    const copyTimeoutRef = React.useRef(null)

    React.useEffect(() => {
        // Clear the reset timer if the component unmounts
        return () => {
            if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
        }
    }, [])

    const handleCopyLink = async () => {
        const link = `${window.location.origin}${window.location.pathname}`
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(link)
            } else {
                // Fallback for browsers / non-HTTPS contexts without the Clipboard API
                const textarea = document.createElement('textarea')
                textarea.value = link
                textarea.style.position = 'fixed'
                textarea.style.opacity = '0'
                document.body.appendChild(textarea)
                textarea.select()
                const ok = document.execCommand('copy')
                document.body.removeChild(textarea)
                if (!ok) throw new Error('Copy command failed')
            }

            setCopied(true)
            if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
            copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000)
        } catch (error) {
            console.error('Failed to copy link:', error)
            toast.error("Couldn't copy the link. Please copy it from the address bar.", { theme: "dark" })
        }
    }

    React.useEffect(() => {
        const fetchPayments = async () => {
            try {
                const receivedPayments = await getPaymentsReceived(uname)
                setPayments(receivedPayments)
            } catch (error) {
                console.error('Failed to fetch payments:', error)
            }
        }
        if (uname) {
            fetchPayments()
        }
    }, [uname])

    const handleGatewaySuccess = async () => {
        try {
            await savePayment(pendingPaymentData)

            toast.success("Thank you for your support!", {
                position: "top-right",
                autoClose: 5000,
                theme: "dark",
                transition: Bounce,
            })

            const receivedPayments = await getPaymentsReceived(uname)
            setPayments(receivedPayments)

        } catch (error) {
            toast.error("There was an error saving your donation.")
        }

        setShowGateway(false)
    }

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
                @keyframes fm-slide-in {
                    from { opacity: 0; transform: translateX(-16px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                @keyframes fm-pop {
                    0%   { transform: scale(0.6); opacity: 0; }
                    70%  { transform: scale(1.12); }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes fm-float {
                    0%, 100% { transform: translateY(0); }
                    50%      { transform: translateY(-4px); }
                }
                .fm-check   { animation: fm-pop 0.35s cubic-bezier(.2,.9,.3,1.2) both; }
                .fm-cover   { animation: fm-fade-in 0.9s ease-out both; }
                .fm-avatar  { animation: fm-pop 0.7s 0.2s cubic-bezier(.2,.9,.3,1.2) both; }
                .fm-head    { animation: fm-fade-up 0.6s 0.35s ease-out both; }
                .fm-card    { animation: fm-fade-up 0.6s ease-out both; transition: box-shadow .3s ease, border-color .3s ease; }
                .fm-card:hover { box-shadow: 0 10px 30px -10px rgba(52, 211, 153, 0.25); border-color: rgba(52, 211, 153, 0.35); }
                .fm-item    { animation: fm-slide-in 0.5s ease-out both; transition: transform .25s ease, background-color .25s ease; }
                .fm-item:hover { transform: translateX(4px) scale(1.01); background-color: rgba(55, 65, 81, 0.9); }
                .fm-crown   { animation: fm-float 2.2s ease-in-out infinite; }
                .fm-input   { transition: box-shadow .2s ease, background-color .2s ease; }
                .fm-input:focus { outline: none; box-shadow: 0 0 0 2px rgba(52, 211, 153, 0.55); background-color: #4b5563; }
                .fm-btn     { transition: transform .2s ease, box-shadow .2s ease, filter .2s ease; }
                .fm-btn:hover  { transform: translateY(-2px); box-shadow: 0 8px 20px -6px rgba(52, 211, 153, 0.5); filter: brightness(1.08); }
                .fm-btn:active { transform: translateY(0) scale(0.98); }
                @media (prefers-reduced-motion: reduce) {
                    .fm-cover, .fm-avatar, .fm-head, .fm-card, .fm-item, .fm-crown, .fm-check { animation: none !important; }
                    .fm-item, .fm-btn { transition: none !important; }
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
            {/* Checks */}
            {!userData ? (
                <div className='flex flex-col items-center justify-center h-screen gap-4'>
                    <p className='text-gray-300 text-lg animate-pulse'>Loading profile...</p>
                </div>
            ) : (
                <div>
                    <div>
                        <div className='relative flex flex-col items-center'>
                            <img src={CoverPicture || '/placeholder.png'} alt="Cover Image" className='fm-cover w-full sm:h-96 h-60 object-fill' />
                            <div className='fm-avatar w-26 h-26 rounded-full absolute sm:top-79 top-43 border-2 border-white shadow-lg shadow-black/50' >
                                <Image src={ProfilePicture || '/avatar.gif'} alt="Profile Image" width={104} height={104} className='w-full h-full object-cover rounded-full' />
                            </div>
                        </div>
                        <div className='fm-head flex flex-col items-center gap-0.5'>
                            <div className='flex items-center justify-center gap-2 pt-10'>
                                <h3 className='text-center text-xl font-bold text-white'>@{uname}</h3>
                                <button
                                    type="button"
                                    onClick={handleCopyLink}
                                    aria-label={copied ? "Profile link copied" : "Copy profile link"}
                                    title={copied ? "Copied!" : "Copy profile link"}
                                    className={`fm-btn p-1.5 rounded-md border hover:cursor-pointer ${copied ? 'text-green-400 border-green-500/40 bg-green-500/10' : 'text-gray-300 border-gray-600 bg-gray-800 hover:text-white'}`}
                                >
                                    {copied ? (
                                        <svg key="check" className='fm-check' xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    ) : (
                                        <svg key="copy" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                        </svg>
                                    )}
                                </button>
                                <span className='sr-only' role="status" aria-live="polite">{copied ? 'Profile link copied' : ''}</span>
                            </div>
                            <p className='text-center text-sm text-gray-300'>{TopSkill}</p>
                            <p className='text-center text-gray-300'>{Name} is waiting for you!</p>
                        </div>

                    </div>
                    <div className='flex sm:flex-row sm:items-stretch items-center flex-col md:w-[85%] w-full gap-10 mx-auto mt-5 my-13'>
                        <div className='fm-card sm:w-[50%] w-[90%] bg-gray-800 p-5 rounded-xl min-h-80 border border-gray-700/60' style={{ animationDelay: '0.45s' }}>
                            {/* Top 5 supporters */}
                            <div className='flex items-center gap-2'>
                                <span className='fm-crown text-2xl' aria-hidden="true">🏆</span>
                                <h4 className='text-xl font-bold text-white'>Top 5 Supporters</h4>
                            </div>
                            {/* Total amount raised */}
                            {payments.length > 0 && (
                                <div className='mt-3 flex items-center justify-between rounded-lg bg-gray-900/60 border border-gray-700/60 px-4 py-3'>
                                    <span className='text-sm text-gray-400'>Total amount raised</span>
                                    <strong className='text-lg bg-linear-to-r from-green-400 to-blue-500 bg-clip-text text-transparent'>
                                        ${payments.reduce((sum, payment) => sum + payment.amount, 0).toFixed(2)}
                                    </strong>
                                </div>
                            )}
                            {payments.length === 0 ? (
                                <p className='mt-3 text-gray-300'>No supporters yet. Be the first to donate!</p>
                            ) : (
                                <ul className='mt-4 space-y-3'>
                                    {/* List of top supporters with highest donations */}
                                    {payments
                                        .sort((a, b) => b.amount - a.amount)
                                        .slice(0, 5)
                                        .map((payment, index) => (
                                            <li
                                                key={payment._id}
                                                className='fm-item flex items-center gap-3 rounded-lg bg-gray-700/50 border border-gray-600/40 p-3'
                                                style={{ animationDelay: `${0.6 + index * 0.12}s` }}
                                            >
                                                {/* Rank badge */}
                                                <span className={`shrink-0 w-7 h-7 rounded-full bg-linear-to-br ${rankStyles[index]} ring-2 flex items-center justify-center text-xs font-bold`}>
                                                    {index + 1}
                                                </span>
                                                <Image src="/avatar.gif" alt="Avatar" width={40} height={40} className='rounded-full shrink-0 ring-2 ring-gray-600' />
                                                <div className='min-w-0 flex-1'>
                                                    <div className='flex items-center justify-between gap-2'>
                                                        <span className='font-semibold text-white truncate'>{payment.fromPerson}</span>
                                                        <span className='shrink-0 text-sm font-bold text-green-300 bg-green-500/10 border border-green-500/30 rounded-full px-2.5 py-0.5'>
                                                            ${payment.amount.toFixed(2)}
                                                        </span>
                                                    </div>
                                                    {payment.message && (
                                                        <p className='text-sm text-gray-400 italic wrap-break-word'>&quot;{payment.message}&quot;</p>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                </ul>
                            )}
                        </div>
                        <div className='fm-card sm:w-[50%] w-[90%] bg-gray-800 p-5 rounded-xl border border-gray-700/60' style={{ animationDelay: '0.6s' }}>
                            {/* Payment form */}
                            <h4 className='text-xl font-bold text-white'>Support the Creator</h4>
                            <form className='mt-3 space-y-4' onSubmit={async (e) => {
                                e.preventDefault()

                                const formData = new FormData(e.target)
                                const amount = parseFloat(formData.get("amount"))

                                if (!userData?._id) {
                                    alert("Unable to process donation: user ID not loaded.")
                                    return
                                }

                                const paymentData = {
                                    fromPerson: formData.get("name") || "Anonymous",
                                    toPerson: uname,
                                    amount: Number.isFinite(amount) ? amount : 0,
                                    message: formData.get("message"),
                                }

                                setPendingPaymentData(paymentData)
                                setShowGateway(true)
                            }}>
                                {/* Donor name */}
                                <div>
                                    <label className='block text-sm font-medium text-gray-300'>Your Name</label>
                                    <input name='name' type="text" className='fm-input w-full mt-1 p-2 rounded-md bg-gray-700 text-white' placeholder='Enter your name' />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-300'>Amount (USD)</label>
                                    <input required min="1" max="100000" step="1" name='amount' type="number" className='fm-input w-full mt-1 p-2 rounded-md bg-gray-700 text-white' placeholder='Enter amount to support' />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-300'>Message</label>
                                    <input name='message' className='fm-input w-full mt-1 p-2 rounded-md bg-gray-700 text-white' placeholder='Write a message for the creator'></input>
                                </div>
                                <button type="submit" className="fm-btn text-white bg-linear-to-br from-green-400 to-blue-600 hover:bg-linear-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-semibold w-full rounded-md hover:cursor-pointer text-sm px-4 py-2.5 text-center leading-5 ">Donate</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            {
                showGateway && (
                    <PaymentForm
                        amount={pendingPaymentData?.amount}
                        onSuccess={handleGatewaySuccess}
                        onCancel={() => setShowGateway(false)}
                    />
                )
            }
        </>
    )
}

export default ProfilePage