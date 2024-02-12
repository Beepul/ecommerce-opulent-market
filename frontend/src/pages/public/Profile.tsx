import React from 'react'
import ProfileSidebar from '../../components/profile/ProfileSidebar'
import AccountSetting from '../AccountSetting'

const Profile = () => {
  return (
    <section className='container flex gap-9 py-12 flex-col md:flex-row'>
      <aside className='min-w-[250px]'>
        <ProfileSidebar active={1} />
      </aside>
      <main className='flex-1'>
        <AccountSetting />
      </main>
    </section>
  )
}

export default Profile