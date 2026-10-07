import React from 'react'
import ProfilePage from '@/components/profilepage'
import { getUserByUsername } from '@/actions/useractions'

const Username = async ({ params }) => {
  const { uname } = await params
  const userData = await getUserByUsername(uname)
  if (!userData) {
    return <div>User not found</div>
  } else {
    return (
      <>
        <ProfilePage uname={uname} userData={userData} />
      </>
    )
  }
}

export default Username

// Title & description
export const metadata = {
  title: 'User Profile - Fund-Me',
  description: 'View the profile of a user by their username.',
}