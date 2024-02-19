import React, { useState } from 'react'
import logo from '../../assets/ss-logo-white.svg'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import {MdExitToApp} from 'react-icons/md'
import { logOutUser } from '../../redux/features/authSlice'
import { toast } from 'react-toastify'
import { ResponseError } from '../../type/error'
import { useLogoutUserMutation } from '../../redux/services/authApi'
import { GiHamburgerMenu } from "react-icons/gi";
import SideDrawer from '../../components/SideDrawer'
import { Anchor } from '../../type/SideDrawer'
import { Box, List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import { IoIosCloseCircleOutline } from 'react-icons/io'
import { dashboardMenu } from '../../static/menu'




const DashHeader = () => {
  const [drawerState, setDrawerState] = useState({
    top: false,
    left: false,
    right: false
  })
  const user = useSelector((state: RootState) => state.auth.user)

  const [logoutUser] = useLogoutUserMutation()

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const getFirstChar = (name: string) => {
    const arr = name.split('')
    return arr[0].toUpperCase()
  }

  const logout = async () => {
    try {
      const result = await logoutUser('').unwrap()
      console.log({result})
      dispatch(logOutUser())
      navigate('/')
      toast.success('Logged Out Successfully', {
				position: "top-right"
			});
    } catch (error) {
      console.log({error})
      const resErr = error as ResponseError
      toast.error(resErr?.data?.message || 'Failed to logout', {
          position: "top-right"
      });
    }
  }

  const toggleDrawer = (anchor: Anchor, open: boolean) => (e: React.MouseEvent) => {
    if(e.target instanceof HTMLInputElement){
      return 
    }
    setDrawerState({ ...drawerState, [anchor]: open });
  };

  const menuList = (
    <Box sx={{ width: 250, height: 'calc(100% - 60px)' }} role="presentation" onClick={toggleDrawer('left', false)}>
			<header className='bg-primary flex justify-between items-center py-4 px-4'>
				<p className='text-white'>Menu</p>
				<button className='text-white sidebar__close-btn'>
				  <IoIosCloseCircleOutline className="text-white text-lg" />
				</button>
			</header>
			<div className='flex flex-col justify-between h-full'>
				<List>
					{dashboardMenu.map((item, index) => (
						<ListItem disablePadding key={`menu-${index}`} className='border-b-[1px] border-[#ccc]'>
							<ListItemButton>
							<ListItemText >
								<Link to={item.link} className={`${item.link === location.pathname ? 'text-primary' : 'text-textPrimary'} flex items-center gap-2`}>{item.icon} {item.label}</Link>
							</ListItemText>
							</ListItemButton>
						</ListItem>
					))}
					
				</List>
				<div>
					{
						user && (
							<div className=' border-t-[1px] border-[#ccc]'>
								<button className='w-full p-4 text-start hover:bg-bgGray transition-all duration-300'
								onClick={logout}
								>Logout</button>
							</div>
						)
					}

				</div>
			</div>
		</Box>
  )
  return (
    <header className='bg-[#071421] py-4'>
      <div className="px-4 flex justify-between items-center">
        <Link to="/">
          <img src={logo} alt="" className='w-[180px]' />
        </Link>
        <div className='hidden gap-2 items-center lg:flex'>
          {
            user?.pic ? (
              <img src={user?.pic} alt={user?.name} className='max-w-[38px] max-h-[38px] rounded-full'/>
            ) : (
              <span className='flex items-center justify-center h-8 w-8 bg-bgGray rounded-full text-primary font-semibold text-xl'>
                { user && getFirstChar(user.name) }
              </span>
            )
          }
          <div className='flex flex-col'>
            <span className='text-bgGray text-[13px]'>{user?.name}</span>
            <span className='text-bgGray text-[13px]'>{user?.email}</span>
          </div>
          {user && (
            <button onClick={logout} className="flex text-[13px] items-center gap-1 py-1 px-3 rounded transition-all text-bgGray duration-300 bg-[#c5c5c56a]"><MdExitToApp className='text-base fill-white' /> Logout</button>
          )}
        </div>
        <button className='lg:hidden' onClick={toggleDrawer('left', true)}>
          <GiHamburgerMenu className=" fill-bgGray text-2xl"/>
        </button>
        <SideDrawer anchor={'left'} open={drawerState.left} toggleDrawer={toggleDrawer} list={menuList} />
      </div>
    </header>
  )
}

export default DashHeader