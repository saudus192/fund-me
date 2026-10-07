"use client"
import React from 'react'
import { useSession } from 'next-auth/react'
import EarningPage from '@/components/earningpage'
import { getUsernameByEmail } from '@/actions/useractions'
import Loader from '@/components/loader'

const Earnings = () => {
    const session = useSession()
    const [username, setUsername] = React.useState(null)

    React.useEffect(() => {
        const fetchUsername = async () => {
            if (session && session.data && session.data.user && session.data.user.email) {
                const email = session.data.user.email
                const username = await getUsernameByEmail(email)
                setUsername(username)
            }
        }

        fetchUsername()
    }, [session])


    if (!session || session.status === 'unauthenticated') {
        return <div>Please log in to view your earnings.</div>
    }
    // Loader if session is still loading
    if (session.status === 'loading') {
        return <Loader text="Loading your earnings..." />
    }

    return (
        <>
            < EarningPage username={username} />
        </>
    )
}

export default Earnings