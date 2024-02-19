import logo from '../../assets/ss-logo.svg';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { primaryMenu } from '../../static/menu';
import {
	Badge,
	Box,
	Drawer,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
} from '@mui/material';
import { GrCart } from 'react-icons/gr';
import { IoSearch } from 'react-icons/io5';
import { RxHamburgerMenu } from 'react-icons/rx';
import { useState } from 'react';
import SideDrawer from '../SideDrawer';
import { Anchor } from '../../type/SideDrawer';
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useLogoutUserMutation } from '../../redux/services/authApi';
import { useDispatch, useSelector } from 'react-redux';
import { logOutUser } from '../../redux/features/authSlice';
import { ResponseError } from '../../type/error';
import { toast } from 'react-toastify';
import { RootState } from '../../redux/store';
import { RxCross2 } from "react-icons/rx";
import { addToCart, decreaseQnty, removeFromCart } from '../../redux/features/cartSlice';





const HeaderBottom = () => {
  const [drawerState, setDrawerState] = useState({
    top: false,
    left: false,
    right: false
  })
  const [search,setSearch] = useState('')

  const cartState = useSelector((state: RootState) => state.cart)

	const location = useLocation();

	const user = useSelector((state:RootState) => state.auth.user)

	const [logoutUser] = useLogoutUserMutation()
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const logout = async () => {
		try {
		  	await logoutUser('').unwrap()
		  	dispatch(logOutUser())
		  	toast.success('Logged Out Successfully', {
				position: "top-right"
			});
		} catch (error) {
		  const resErr = error as ResponseError
		  toast.error(resErr?.data?.message || 'Failed to logout', {
			  position: "top-right"
		  });
		}
	  }

	  const handleSearch = (e:React.FormEvent) => {
		e.preventDefault()
		navigate(`/shop?search=${search}`)
		setSearch('')
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
					{primaryMenu.map((item, index) => (
						<ListItem disablePadding key={`menu-${index}`} className='border-b-[1px] border-[#ccc]'>
							<ListItemButton>
							<ListItemText >
								<Link to={item.link} className={`${item.link === location.pathname ? 'text-primary' : 'text-textPrimary'} w-full inline-block`}>{item.label}</Link>
							</ListItemText>
							</ListItemButton>
						</ListItem>
					))}
					
					{
						user && (
							<ListItem disablePadding className='border-b-[1px] border-[#ccc]'>
								<ListItemButton>
									<ListItemText >
										<Link to='/profile'>Profile</Link>
									</ListItemText>
								</ListItemButton>
							</ListItem>
						)
					}
					{
						(user && user?.role === 'admin') && (
							<ListItem disablePadding className='border-b-[1px] border-[#ccc]'>
								<ListItemButton>
									<ListItemText >
										<Link to='/dashboard'>Dashboard</Link>
									</ListItemText>
								</ListItemButton>
							</ListItem>
						)
					}
				</List>
				<div>
					{!user && (
						<div className='border-t-[1px] border-[#ccc]'>
							<Link to='/login-register' className='p-4 inline-block w-full text-start hover:bg-bgGray transition-all duration-300'>Login/Register</Link>
						</div>
					)}
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
	);
  const cartList = (
		<Box sx={{ minHeight: "90%" }} className="sm:w-[450px] w-[280px]" role="presentation" >
			<header className='bg-primary flex justify-between items-center py-4 px-4'>
				<p className='text-white'>Your Cart</p>
				<button className='text-white sidebar__close-btn' onClick={toggleDrawer('right', false)} >
					<IoIosCloseCircleOutline className="text-white text-lg" />
				</button>
			</header>
			<div className='h-full'>
				{cartState.cart.length <= 0 ? (
					<div className='h-full flex flex-col items-center gap-4 py-16'>
						<p className='font-semibold text-gray-500'>Your cart is empty</p>
						<button 
						onClick={toggleDrawer('right', false)}
						className='border py-3 px-6'
						>Continue Shopping</button>
					</div>
				): (
					<div className='flex flex-col justify-between h-full'>
						<ul className='max-h-[450px] overflow-y-auto'>
							{
								cartState.cart.map((c,i) =>(
									<li key={i}>
										<div className='flex p-4'>
											<img src={c.images[c.images.length - 1].url} alt={c.name} className='h-[110px] w-[90px] object-cover' />
											<div className='pl-4 pr-4 w-full relative'>
												<h4 className='font-semibold mb-1'>{c.name}</h4>
												<p className='flex items-center gap-1 '><span className='text-gray-500 text-[14px]'>{c.quantity}</span><RxCross2 className="text-[14px] stroke-gray-500 pt-[2px]" /><span className='font-semibold text-[14px]'>{c.afterDiscountPrice}</span></p>
												<div className='flex items-center mt-2'>
													<button 
													onClick={() => dispatch(decreaseQnty(c._id))}
													className='min-h-[24px] min-w-[24px] w-[24px] font-semibold flex items-center justify-center rounded-full bg-bgGray'>-</button>
													<span className='px-2'>{c.quantity}</span>
													<button 
													onClick={() => dispatch(addToCart(c))}
													className='min-h-[24px] min-w-[24px] w-[24px] font-semibold flex items-center justify-center rounded-full bg-bgGray'>+</button>
												</div>
												<button className='absolute top-2 right-0' onClick={() => dispatch(removeFromCart(c._id))}><RxCross2 className="text-[16px] stroke-gray-500 pt-[2px]" /></button>
											</div>
										</div>
									</li>
								) )
							}
						</ul>
						<div className='p-4'>
							<div className='flex justify-between mb-4'>
								<h4 className='text-lg font-semibold text-textPrimary'>Subtotal:</h4>
								<h4 className='text-lg font-semibold text-primary'>${cartState.totalPrice}</h4>
							</div>
							<Link to={'/checkout'} className='btn-primary w-full cursor-pointer' onClick={toggleDrawer('right', false)}>Checkout</Link>
						</div>
					</div>
				)}
			</div>
			
		</Box>
	);

  const searchList = (
    <Box sx={{ width: 'auto' }} role="presentation">
		<form onSubmit={handleSearch} className="border-[2px] border-bgGray flex items-center gap-8 justify-between pr-6 my-8 mx-2 rounded-[32px]">
			<input
			type="search"
			placeholder="Search..."
			onChange={(e) => setSearch(e.target.value)}
			value={search}
			className="text-[15px] flex-1  px-6 py-2 focus:outline-none rounded-[32px]"
			/>
			<button type="submit">
				<IoSearch className="text-textSecondary" />
			</button>
      	</form>
	</Box>
  )

 
  
	return (
		<section className='border-b-[1px] border-bgGray'>
			<div className="container flex items-center justify-between gap-3 md:gap-8 py-8">
				<button onClick={toggleDrawer('left', true)} className="lg:hidden">
					<RxHamburgerMenu className="text-xl" />
				</button>
        <SideDrawer anchor={'left'} open={drawerState.left} toggleDrawer={toggleDrawer} list={menuList} />
				<Link to="/">
					<img src={logo} alt="" className="w-[170px] min-w-[120px]" />
				</Link>
				<ul className="lg:flex gap-5 items-center hidden">
					{primaryMenu.map((item, index) => (
            <li key={`menu-${index}`}>
              <Link
                to={item.link}
                className={`text-[15px] menu-item ${item.link === location.pathname
                  ? 'current-menu-item'
                  : ''}`}
              >
                {item.label}
              </Link>
            </li>
					))}
				</ul>
				<div className="flex-1 flex justify-end items-center gap-3 md:gap-8">
					<div className="flex-1 max-w-[90%] hidden lg:block">
						<form onSubmit={handleSearch} className="border-[2px] border-bgGray flex items-center gap-8 justify-between pr-6 rounded-[32px]">
							<input
								type="search"
								placeholder="Search..."
								onChange={(e) => setSearch(e.target.value)}
								value={search}
								className="text-[15px] flex-1  px-6 py-2 focus:outline-none rounded-[32px]"
							/>
							<button type="submit">
								<IoSearch className="text-textSecondary" />
							</button>
						</form>
					</div>

          <button onClick={toggleDrawer('top', true)} className='lg:hidden'>
						<IoSearch className="text-textSecondary text-lg" />
					</button>

          	<SideDrawer anchor={'top'} open={drawerState.top} toggleDrawer={toggleDrawer} list={searchList} />
			<div className='flex flex-col max-w-fit items-center'>
					<Badge badgeContent={cartState.cart.length} color={'primary'} className="cart__badge cursor-pointer" onClick={toggleDrawer('right', true)}>
						<GrCart color="action" />
					</Badge>
					{
						cartState.totalPrice > 0 && (
							<span className='text-sm mt-2'>${cartState.totalPrice}</span>
						)
					}
			</div>
			<Drawer anchor={'right'} open={drawerState.right}>
				{cartList}
			</Drawer>
				</div>
			</div>
		</section>
	);
};

export default HeaderBottom;
