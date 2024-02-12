import { Link, useLocation } from 'react-router-dom'
import { dashboardMenu } from '../../static/menu';



const DashSidebar = () => {
  const location = useLocation()

  return (
    <div className='bg-bgGray  w-[200px] h-[100%] min-h-[100vh]'>
      <ul className='py-2'>
        {
          dashboardMenu.map((menu,i) => (
            <li key={`menu-${i}`}>
              <Link to={menu.link} className={`${menu.link === location.pathname ? 'text-primary' : ''} flex items-center gap-2 w-full py-2 px-5 text-[15px] hover:gap-4 group hover:text-primary`}>
                {menu.icon}
                {menu.label}
              </Link>
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default DashSidebar