// import { useSession } from 'next-auth/client'
// import { useRouter } from 'next/router'

import ProfileForm from './profile-form'
import classes from './user-profile.module.css'

function UserProfile() {
  // Redirect away if NOT auth
  // const [session, loading] = useSession()
  // const router = useRouter()

  // if (!loading && !session) {
  //   router.push('/auth')
  // }

  // if (loading) {
  //   return <p className={classes.profile}>Loading...</p>
  // }

  async function handleChangePassword(passwordData) {
    const response = await fetch('/api/auth/change-password', {
      method: 'PATCH',
      body: JSON.stringify(passwordData),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()
  }

  return (
    <section className={classes.profile}>
      <h1>Your User Profile</h1>
      <ProfileForm onChangePassword={handleChangePassword} />
    </section>
  )
}

export default UserProfile
