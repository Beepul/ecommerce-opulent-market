import { Box, Modal } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Order } from '../../../type/order';
import SubmitButton from '../../../components/SubmitButton';
import { Country, State } from 'country-state-city';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { RxCross2 } from "react-icons/rx";
import { useUpdateAddressMutation } from '../../../redux/services/addressApi';
import { ResponseError } from '../../../type/error';
import { toast } from 'react-toastify';
import { useUpdateOrderMutation } from '../../../redux/services/orderApi';


const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    borderRadius: '4px',
    boxShadow: 24,
    p: 4,
};

type EditOrderProps = {
    open: boolean;
    handleClose: () => void;
    order: Order;
}

interface Country {
  code: string;
  name: string;
}

const availableOrderStatus = ['pending', 'processing', 'shipped', 'delivered']

const EditOrder:React.FC<EditOrderProps> = ({open,handleClose,order}) => {
  const [country,setCountry] = useState({code: '', name: ''})
  const [cstate,setCstate] = useState({code: '',name: ''})
  const [city,setCity] = useState("")
  const [postalCode,setPostalCode] = useState<number | null>(null)
  const [street,setStreet] = useState("")
  
  const [orderStatus, setOrderStatus] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [date,setDate] = useState('')

  const [updateAddress, {isLoading:addressLoading}] = useUpdateAddressMutation()
  const [updateOrder, {isLoading: orderLoading}] = useUpdateOrderMutation()




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

  const handleAddressSubmit = async (e:React.FormEvent) => {
    e.preventDefault()
    const addressData = {
      userId:order.user._id,
      addressId:order.shippingAddress?._id ,
      street,
      city,
      state:{
        code:cstate.code,
        name:cstate.name
      },
      postalCode,
      country
    }
    try {
      const result = await updateAddress(addressData).unwrap()
      console.log("Address",result)
      if('error' in result) {
        toast.error(result.data.error.message || 'Failed to update user address')
        return
      }
      toast.success('Address Updated!')
    } catch (error) {
      const resError = error as ResponseError
      toast.error(resError.data?.message || 'Failed to update user address')
    }
  }

  const handleEditOrder = async (e:React.FormEvent) => {
    e.preventDefault()
    const orderData = {
      _id:order._id ,
      user:order.user._id,
      status: orderStatus,
      paymentDetails:{
        paymentMethod,
        paymentStatus
      },
      deliveredAt: orderStatus === 'delivered' ? date : null
    }

    try {
      const result = await updateOrder(orderData).unwrap()
      console.log("Order",result)
      if('error' in result) {
        toast.error(result.data.error.message || 'Failed to update order')
        return
      }
      toast.success('Order Updated!')
    } catch (error) {
      const resError = error as ResponseError
      toast.error(resError.data?.message || 'Failed to update order')
    }
  }

  useEffect(() => {
    setStreet(order?.shippingAddress?.street || '')
    setPostalCode(order?.shippingAddress?.postalCode || null)
    setCity(order?.shippingAddress?.city || '')
    setCountry(order?.shippingAddress?.country || {code: '',name: ''})
    setCstate(order?.shippingAddress?.state || {code: '',name: ''})

    setOrderStatus(order?.status || '')
    setPaymentMethod(order?.paymentDetails?.paymentMethod || '')
    setPaymentStatus(order?.paymentDetails?.paymentStatus || '')
    setDate(order?.deliveredAt || '')
  },[order])

  return (
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className='relative flex lg:flex-row flex-col gap-6 max-w-[100vw] max-h-[70vh] overflow-x-auto'>
            {/* address */}
            <div className='max-w-full'>
              <h2 className='text-center mb-4 text-xl'>Update Address</h2>
              <form className='bg-bgGray py-8 px-8 rounded-md' onSubmit={handleAddressSubmit}>
                <div className='flex flex-col'>
                  <div className='flex-1 flex flex-col mb-3'>
                    <label className='mb-3 text-[15px]'>
                      Country <span className='text-red-500'>*</span>
                    </label>
                    <select
                      className="focus:outline-none border h-[40px] rounded-[5px] cursor-pointer"
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
                  <div className="flex-1 flex flex-col mb-3">
                    <label className='mb-3 text-[15px]'>
                      State <span className='text-red-500'>*</span>
                    </label>
                    <select
                      className="focus:outline-none border h-[40px] rounded-[5px]"
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
                <div className='flex gap-6 md:flex-row flex-col'>
                  <div className="flex-1 flex flex-col mb-3">
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
                <div className='flex gap-6 mb-4'>
                  <div className="flex-1 flex flex-col mb-3">
                    <label htmlFor="street" className='block mb-3 text-[15px]'>
                      Street <span className='text-red-500'>*</span>
                    </label>
                    <input type="text" 
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      name='street' className='py-2 px-4 text-[14px] text-gray-800 focus:outline-none border-[1px] border-[#ccc] rounded' />
                  </div>
                </div>
                <div>
                  <SubmitButton title='Update Address' isLoading={addressLoading}/>
                </div>
              </form>
            </div>
            {/* order */}
            <div className='max-w-[100%]'>
              <h2 className='text-center mb-4 text-xl'>Update Order</h2>
              <form onSubmit={handleEditOrder} className='bg-bgGray py-8 px-8 rounded-md min-w-[240px] w-[450px] max-w-full'> 
                <div className="flex flex-col  mb-5">
                  <p className='block mb-1 text-[15px]'>
                    Order Status:
                  </p>
                  <select name="" id="" value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)} className='capitalize py-4 rounded-md focus:outline-none px-4'>
                    <option value="">Select Order Status</option>
                    {
                      availableOrderStatus.map((o,i) => (
                        <option value={o} key={i} className='capitalize'>{o}</option>
                      ))
                    }
                  </select>
                </div>
                <div className="flex flex-col mb-4">
                  <p className='block mb-1 text-[15px]'>
                    Payment Method:
                  </p>
                  <div className='flex items-center justify-between gap-3'>
                      <div className='flex flex-1 items-center gap-1'>
                        <input type="radio" id='cash' name='pm' checked={paymentMethod === 'cash' && true} onChange={() => setPaymentMethod('cash')} />
                        <label htmlFor="cash" className='text-[15px]'>Cash</label>
                      </div>
                      <div className='flex flex-1 items-center gap-1 '>
                        <input type="radio" id='online' name='pm' checked={paymentMethod === 'online' && true} onChange={() => setPaymentMethod('online')} />
                        <label htmlFor="online" className='text-[15px]'>Online</label>
                      </div>
                  </div>
                </div>
                <div className="flex flex-col mb-4">
                  <p className='block mb-1 text-[15px]'>
                    Payment Status:
                  </p>
                  <div className='flex items-center justify-between gap-3'>
                      <div className='flex flex-1 items-center gap-1'>
                        <input type="radio" id='due' name='ps' checked={paymentStatus === 'due' && true} onChange={() => setPaymentStatus('due')}/>
                        <label htmlFor="due" className='text-[15px]'>Due</label>
                      </div>
                      <div className='flex flex-1 items-center gap-1 '>
                        <input type="radio" id='paid' name='ps' checked={paymentStatus === 'paid' && true} onChange={() => setPaymentStatus('paid')}/>
                        <label htmlFor="paid" className='text-[15px]'>Paid</label>
                      </div>
                  </div>
                </div>
                {
                  orderStatus === 'delivered' && (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <div className='bg-white rounded-md mb-4'>
                        <DateTimePicker
                          disableFuture
                          value={dayjs(date)}
                          onChange={(newValue) => {
                            if(newValue !== null) {
                              const dateTime = dayjs(newValue).toISOString()
                              setDate(dateTime)
                            }
                          }}
                        />
                      </div>
                    </LocalizationProvider>
                  )
                }
                <div>
                  <SubmitButton title='Update Order Info' isLoading={orderLoading}/>
                </div>
              </form>
            </div>
            <button onClick={handleClose}  className='absolute top-0 right-8 h-[32px] w-[32px] lg:hidden flex items-center justify-center rounded-full border border-primary bg-primary group'><RxCross2 className="group-hover:scale-125 transition-all duration-500" /></button>
          </div>
        </Box>
    </Modal>
  )
}

export default EditOrder