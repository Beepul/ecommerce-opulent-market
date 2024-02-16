import notFound from '../assets/images/notFound.jpg'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/opacity.css'

const NotFound = () => {
  return (
    <div className='container flex items-center justify-center py-12'>
      <LazyLoadImage src={notFound} alt='Page Not Found' effect='opacity' height={'100%'}  className='md:max-w-[500px] sm:max-w-[350px] max-w-[250px]' />
    </div>
  )
}

export default NotFound