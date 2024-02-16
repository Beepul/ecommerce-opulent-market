import React from 'react'
import { useLocation } from 'react-router-dom';


type DashTitleProps = {
    title: string;
}

const DashTitle:React.FC<DashTitleProps> = ({title}) => {
  const location = useLocation()
  const path = location.pathname.split('/').filter((_item, i) => i !== 0)

  return (
    <div className='flex justify-between flex-wrap items-center py-3 px-4 rounded mr-5 ml-4 lg:ml-0 my-3 bg-bgGray'>
        <h2 className='font-semibold uppercase text-gray-500'>{title}</h2>
        <span className='flex gap-1'>
          {path.map((item,i) => (
            <span key={i} className="after:content-['/'] after:text-[14px] last:after:hidden flex gap-1 capitalize text-[12px] items-center text-gray-400 font-semibold">{item}</span>
          ))}
        </span>
    </div>
  )
}

export default DashTitle