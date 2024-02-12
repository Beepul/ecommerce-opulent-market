import React from 'react'

const SectionTitle = ({title}: {title: string}) => {
  return (
    <h2 className='capitalize font-semibold text-3xl'>
        {title}
    </h2>
  )
}

export default SectionTitle