"use client"
import React from 'react'
import { useSession } from 'next-auth/react'
import EarningPage from '@/components/earningpage'
import { getUsernameByEmail } from '@/actions/useractions'
import Loader from '@/components/loader'

const Earnings = () => {
    const { data: session, status } = useSession()
    const [username, setUsername] = React.useState(null)
    const [isFetchingUsername, setIsFetchingUsername] = React.useState(true)

    const email = session?.user?.email

    React.useEffect(() => {
        // Wait until next-auth finishes checking the session
        if (status === 'loading') return

        // Not logged in (or no email) -> nothing to fetch
        if (status === 'unauthenticated' || !email) {
            setIsFetchingUsername(false)
            return
        }

        let ignore = false

        const fetchUsername = async () => {
            setIsFetchingUsername(true)
            try {
                const name = await getUsernameByEmail(email)
                if (!ignore) setUsername(name)
            } catch (error) {
                console.error('Failed to fetch username:', error)
            } finally {
                if (!ignore) setIsFetchingUsername(false)
            }
        }

        fetchUsername()
        return () => { ignore = true }
    }, [status, email])

    // 1) Session is still being checked
    if (status === 'loading') {
        return <Loader text="Loading your earnings..." />
    }

    // 2) Session checked, user is not logged in
    if (status === 'unauthenticated') {
        return <div>Please log in to view your earnings.</div>
    }

    // 3) Logged in, but username is still being fetched from the database
    if (isFetchingUsername) {
        return <Loader text="Loading your earnings..." />
    }

    // 4) Everything is ready
    return (
        <>
            <EarningPage username={username} />
        </>
    )
}

export default Earnings