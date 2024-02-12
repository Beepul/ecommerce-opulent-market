import React from 'react'
import { Link } from 'react-router-dom'



const ProfileSidebar = ({active}: {active: number}) => {
  return (
    <div>
      <ul className='flex flex-row md:flex-col'>
        <li><Link to={'/profile'} 
          className={`${active === 1 ? 'text-primary border-primary md:pl-2' : 'text-gray-800 border-gray-400'} transition-all duration-300  py-2 px-4 md:pl-0 inline-block border md:border-x-0 md:border-t-0 w-full hover:text-primary hover:border-primary`}>Profile</Link></li>
        <li><Link to={'/order-history'} 
          className={`${active === 2 ? 'text-primary border-primary md:pl-2' : 'text-gray-800 border-gray-400'} transition-all duration-300  py-2 px-4 md:pl-0 inline-block border md:border-x-0 md:border-t-0 w-full hover:text-primary hover:border-primary`}>Order History</Link></li>
      </ul>
    </div>
  )
}

export default ProfileSidebar