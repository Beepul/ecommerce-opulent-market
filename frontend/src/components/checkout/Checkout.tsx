import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import {Country,State,City} from 'country-state-city'
import SubmitButton from '../SubmitButton'
import { addAddressInfo } from '../../redux/features/orderSlice'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

interface Country {
  code: string;
  name: string;
}

const Checkout = () => {
  const [country,setCountry] = useState({code: '', name: ''})
  const [cstate,setCstate] = useState({code: '',name: ''})
  const [city,setCity] = useState("")
  const [postalCode,setPostalCode] = useState<number | null>(null)
  const [street,setStreet] = useState("")
  const [phoneNumber,setPhoneNumber] = useState("")
  const user = useSelector((state: RootState) => state.auth.user)
  const cart = useSelector((state: RootState) => state.cart)
  const address = useSelector((state: RootState) => state.order.addressInfo)

  // console.log(address)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = (e:React.FormEvent) => {
    e.preventDefault()
    if(!country.code || !country.name || !cstate.code || !cstate.name || !city || !postalCode || !street || !phoneNumber){
      toast.error('All Fields Required!')
      return
    }
    dispatch(addAddressInfo({
      country,
      state: cstate,
      city,
      street,
      postalCode,
      phone: phoneNumber
    }))
    navigate('/payment')
  }

  const handleCountry = (e:React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountry: Country = {
      code: e.target.options[e.target.selectedIndex].getAttribute('data-countrycode') ?? '',
      name: e.target.value
    };
    setCountry(selectedCountry);
  }
  const handleState = (e:React.ChangeEvent<HTMLSelectElement>) => {
    const selectedState: Country = {
      code: e.target.options[e.target.selectedIndex].getAttribute('data-statecode') ?? '',
      name: e.target.value
    };
    setCstate(selectedState)
  }

  useEffect(() => {
    setCountry(address?.country || {code: '', name: ''})
    setCstate(address?.state || {code: '', name: ''})
    setCity(address?.city || '')
    setStreet(address?.street || '')
    setPostalCode(address?.postalCode || null)
    setPhoneNumber(address?.phone || '')
  },[address])
  return (
    <div className='flex flex-col lg:flex-row gap-16 mb-16'>
      <form className='flex-1 bg-bgGray py-8 px-8 rounded-md' onSubmit={handleSubmit}>
        <div className='flex flex-wrap gap-6 mb-6'>
          <div className='flex-1 flex flex-col '>
            <label className='mb-3 text-[15px]'>
                Full Name <span className='text-red-500'>*</span>
            </label>
            <input type="text" name='name' value={user?.name} id='name' readOnly className='py-2 px-4 text-[14px] text-gray-400 focus:outline-none border-[1px] border-[#ccc] rounded' />
          </div>
          <div className='flex-1 flex flex-col '>
            <label className='mb-3 text-[15px]'>
                Email address <span className='text-red-500'>*</span>
            </label>
            <input type="email" name='email' value={user?.email} id='email' readOnly className='py-2 px-4 text-[14px] text-gray-400 focus:outline-none border-[1px] border-[#ccc] rounded' />
          </div>
        </div>
        <div className='flex flex-wrap gap-6 mb-6'>
          <div className='flex-1 w-[calc(50%-12px)] flex flex-col'>
            <label className='mb-3 text-[15px]'>
              Country <span className='text-red-500'>*</span>
            </label>
            <select
              className=" border h-[40px] rounded-[5px] max-w-full cursor-pointer"
              value={country.name}
              onChange={handleCountry}
            >
              <option className="block pb-2" value="">
                Choose your country
              </option>
              {Country &&
                Country.getAllCountries().map((item) => (
                  <option key={item.isoCode} value={item.name} data-countrycode={item.isoCode}>
                    {item.name}
                  </option>
                ))}
            </select>

          </div>
          <div className="flex-1 w-[calc(50%-12px)] flex flex-col">
            <label className='mb-3 text-[15px]'>
              State <span className='text-red-500'>*</span>
            </label>
            <select
              className=" border h-[40px] rounded-[5px]"
              value={cstate.name}
              onChange={handleState}
            >
              <option className="block pb-2" value="">
                Choose your State
              </option>
              {State &&
                State.getStatesOfCountry(country.code).map((item) => (
                  <option key={item.isoCode} value={item.name} data-statecode={item.isoCode}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className='flex flex-wrap gap-6 mb-6'>
          <div className="flex-1 flex flex-col">
            <label htmlFor="city" className='block mb-3 text-[15px]'>
              City <span className='text-red-500'>*</span>
            </label>
            <input type="text" 
              value={city}
              onChange={(e) => setCity(e.target.value)}
              name='city' className='py-2 px-4 text-[14px] text-gray-800 focus:outline-none border-[1px] border-[#ccc] rounded' />
          </div>
          <div className="flex-1 flex flex-col">
            <label htmlFor="postalCode" className='block mb-3 text-[15px]'>
              Postal Code <span className='text-red-500'>*</span>
            </label>
            <input type="number"
              value={String(postalCode)} 
              onChange={(e) => setPostalCode(Number(e.target.value))}
              name='postalCode' className='py-2 px-4 text-[14px] text-gray-800 focus:outline-none border-[1px] border-[#ccc] rounded' />
          </div>
        </div>
        <div className='flex flex-wrap gap-6 mb-6'>
          <div className="flex-1 flex flex-col">
            <label htmlFor="street" className='block mb-3 text-[15px]'>
              Street <span className='text-red-500'>*</span>
            </label>
            <input type="text" 
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              name='street' className='py-2 px-4 text-[14px] text-gray-800 focus:outline-none border-[1px] border-[#ccc] rounded' />
          </div>
          <div className="flex-1 flex flex-col">
            <label htmlFor="phone" className='block mb-3 text-[15px]'>
              Phone Number <span className='text-red-500'>*</span>
            </label>
            <input type="text" 
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              name='phone' className='py-2 px-4 text-[14px] text-gray-800 focus:outline-none border-[1px] border-[#ccc] rounded' />
          </div>
        </div>
        <div>
          <SubmitButton title='Submit' isLoading={false}/>
        </div>
      </form>
      <div className='bg-bgGray lg:max-w-[350px] h-fit p-5 rounded-md'>
        <h5 className='font-semibold text-xl mb-4'>Cart Details</h5>
        <ul className='flex flex-col gap-4 mb-6 max-h-[250px] overflow-y-auto'>
          {
            cart.cart.map((c) => (
              <li key={c._id}>
                <div className='flex gap-4 bg-white rounded-md py-2 px-2'>
                  <img src={c.images[0].url} alt={c.name} className='w-[80px] h-[100%] object-cover rounded-md' />
                  <div>
                    <h5>{c.name}</h5>
                    <p className='text-[13px] text-gray-500 truncate max-w-[180px]'>{c.description}</p>
                    {
                      c.discountPercentage ? (
                        <span className='flex gap-2 text-[13px]'>
                          <del>${c.price}</del>
                          <p>${c.afterDiscountPrice}</p>
                        </span>
                      ) : (
                        <span className='text-[13px]'>${c.price}</span>
                      )
                    }
                  </div>
                </div>
              </li>
            ))
          }
        </ul>
        <div className='flex justify-between mb-1'>
          <h5 className='font-semibold'>Sub Total</h5>
          <span>${cart.totalPrice}</span>
        </div>
        <div className='flex justify-between mb-3 border-b border-gray-300 pb-3'>
          <h5 className='font-semibold'>Shipping Cost</h5>
          <span>$20</span>
        </div>
        <div className='flex justify-between'>
          <h5 className='font-semibold'>Total Cost</h5>
          <span>${cart.totalPrice + 20}</span>
        </div>
      </div>
    </div>
  )
}

export default Checkout