import notFound from '../assets/images/notFound.jpg'
import { LazyLoadImage } from 'react-lazy-load-image-component'

const NotFound = () => {
  return (
    <div className='container flex items-center justify-center py-12'>
      <LazyLoadImage src={notFound} alt='Page Not Found' effect='blur'  className='max-w-[500px]' />
    </div>
  )
}

export default NotFound