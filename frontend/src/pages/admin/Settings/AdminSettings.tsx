import React from 'react'
import DashTitle from '../DashTitle'
import AccountSetting from '../../AccountSetting'

const AdminSettings = () => {
  return (
    <section>
        <DashTitle title='Account Settings' />
        <main className='pb-16 pt-8 pr-5 lg:pl-0 pl-5'>
            <AccountSetting />
        </main>
    </section>
  )
}

export default AdminSettings