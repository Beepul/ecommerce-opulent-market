import { FormEvent, useEffect, useRef, useState } from 'react';
import DashTitle from '../DashTitle'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { useAddProductMutation, useGetProductsQuery, useUpdateProductMutation } from '../../../redux/services/productApi';
import { ResponseError } from '../../../type/error';
import { useGetAllCategoryQuery } from '../../../redux/services/categoryApi';
import { Category } from '../../../type/category';
import SubmitButton from '../../../components/SubmitButton';
import { useParams } from 'react-router-dom';
import { Image, Product } from '../../../type/product';


const allowedImageTypes = ['image/png',"image/jpg","image/jpeg"]

const maxImageSize = 3000 * 1240

const CreateProduct = () => {
  const [name,setName] = useState('')
  const [description,setDescription] = useState('')
  const [stock,setStock] = useState('')
  const [price,setPrice] = useState('')
  const [discount,setDiscount] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isFeatured,setIsFeatured] = useState(false)
  const [showOffer,setShowOffer] = useState(false)
  const [selectedCategories,setSelectedCategories] = useState<Category[]>([])
  const [images, setImages] = useState<Array<Image | string | ArrayBuffer>>([]);

  const [addProduct,{isLoading}] = useAddProductMutation()
  const {isLoading:_catLoading ,data: catData} = useGetAllCategoryQuery('')

  const {id} = useParams()
  const {productToEdit}:{productToEdit: Product} = useGetProductsQuery({},{
    selectFromResult: ({data}) => ({
      productToEdit:data?.products?.find((p: Product) => p._id === id)
    })
  })


  const [updateProduct, {isLoading: updateLoading}] = useUpdateProductMutation()


  const totalAmtRef:React.RefObject<HTMLInputElement> = useRef(null)

  const handleCategorySelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategoryId = e.target.options[e.target.selectedIndex].getAttribute("data-id") || '';
    const selectedCategoryName = e.target.value;
    const newCategory = {name: selectedCategoryName, _id: selectedCategoryId}

    if(!selectedCategoryId || !selectedCategoryName){
      return
    }

    const existingCat = selectedCategories.find((cat) => selectedCategoryId === cat._id)

    if(existingCat){
      return
    }

    setSelectedCategories([...selectedCategories, newCategory])
    
  }

  const removeCategory = (id: string) => {
    const newSelectedCategories = selectedCategories.filter((c) => c._id !== id)

    return setSelectedCategories(newSelectedCategories)
  }

  const addTotalAmt = () => {
    if(!price || !discount){
      if(totalAmtRef.current){
        totalAmtRef.current.value = ''
      }
      return 
    }
    
    const discountDecimal = Number(discount) / 100;
    const discountedPrice = Number(price) * discountDecimal;

    if(totalAmtRef.current){
      totalAmtRef.current.value = String(discountedPrice)
    }
  }
  useEffect(() => {
    addTotalAmt()
  },[price,discount])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    setImages([]);

    if(files.length >4 ){
      toast.warning('Maximum 4 Photos for a Product!')
      return
    }

    const totalSize = files.reduce((acc,file) => acc + file.size, 0)
    
    if(totalSize >= maxImageSize){
      toast.warning('Total image size must be less than 100kb')
      return
    }

    files.forEach((file) => {

      if(!allowedImageTypes.includes(file.type)){
        toast.warning('Please Choose Valid Image Types!')
        return
      }

      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImages((old) => [...old, reader.result!]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if(!name || !description || !price || selectedCategories.length <= 0 || !stock || images.length <= 0){
      toast.error('All Feilds Required!')
      return
    }

    if(Number(price) <=0){
      toast.error('Price should be positive number!')
      return
    }

    if( Number(stock) <= 0){
      toast.error('Stock should be positive number!')
      return
    }

    if(showOffer){
      if(!startDate || !endDate){
        toast.error('To Make Product As Offer, Start and End Date is Required!')
        return
      }
      if(dayjs(endDate).isBefore(startDate)){
        toast.error('End Date Should Be Greater Than Start Date')
        return
      }
      if(dayjs(endDate).isSame(startDate)){
        toast.error('Same End Date And Start Date Is Not Valid')
        return
      }
    }

    const categoryIds = []

    for(let i = 0; i < selectedCategories.length; i++){
      categoryIds.push(selectedCategories[i]._id)
    }

    const product = {
      name,
      description,
      price,
      discountPercentage: discount,
      images,
      stockQuantity: stock,
      category: categoryIds,
      isFeatured,
      offer: {
        isOffered: showOffer,
        offerStartDate: startDate,
        offerEndDate: endDate
      },
      oldImages: [] as Image[]
    }
    
    try {
      
      if(id && productToEdit){
        product.oldImages = productToEdit.images as Image []
        await updateProduct({id:id,data:product})
        toast.success('Product Updated Successfully')

      }else{
        await addProduct(product).unwrap()
        toast.success('Product Created Successfully')
      }
      setName('')
      setDescription('')
      setPrice('')
      setDiscount('')
      setStock('')
      setStartDate('')
      setEndDate('')
      setIsFeatured(false)
      setShowOffer(false)
      setSelectedCategories([])
      setImages([])
    } catch (error) {
      const resError = error as ResponseError
      toast.error(resError?.data?.message || ( id ? 'Error Occured While Updating Product' : 'Error Occured While Adding Product'))
    }
  }

  useEffect(() => {
    setName(productToEdit?.name || '')
    setDescription(productToEdit?.description || '')
    setStock(productToEdit?.stockQuantity?.toString() || '')
    setPrice(productToEdit?.price?.toString() || '')
    setDiscount(productToEdit?.discountPercentage?.toString() || '')
    setSelectedCategories(productToEdit?.category || [])
    setIsFeatured(productToEdit?.isFeatured || false)
    setShowOffer(productToEdit?.offer?.isOffered || false)
    setStartDate(productToEdit?.offer?.offerStartDate?.toString() || '')
    setEndDate(productToEdit?.offer?.offerEndDate?.toString() || '')
    setImages(productToEdit?.images || [])
  },[id,productToEdit])

  return (
    <section>
      <DashTitle  title={id ? 'Edit Product' : 'Add New Product'}/>
      <main className='mr-5 my-8 pl-4 lg:pl-0'>
        <form className='bg-bgGray px-8 py-10 rounded-md max-w-[850px] mx-auto' onSubmit={handleSubmit}>
          <div className='mb-8'>
            <label htmlFor="name">Name <span className='text-red-500'>*</span></label>
            <br/>
            <input type="text" id='name' value={name} onChange={(e)=> setName(e.target.value)} required className='mt-4 py-2 px-4 focus:outline-none border-[1px] border-[#ccc] rounded w-full' />
          </div>
          <div className='mb-8'>
            <label htmlFor="description">Description <span className='text-red-500'>*</span></label>
            <br/>
            <textarea id='description' value={description}  onChange={(e)=> setDescription(e.target.value)} required className='mt-4 py-2 px-4 focus:outline-none border-[1px] border-[#ccc] rounded w-full' />
          </div>
          <div className='flex gap-8 mb-8 flex-wrap'>
            <div className='flex-1 min-w-[150px]'>
              <label htmlFor="stock">Stock <span className='text-red-500'>*</span></label>
              <br/>
              <input type="number" id='stock' value={stock} 
                 onChange={(e)=> {
                  if(Number(e.target.value) < 0){
                    return
                  }else{
                    setStock(e.target.value)
                  }
                }}
                required className='mt-4 py-2 px-4 focus:outline-none border-[1px] border-[#ccc] rounded w-full' />
            </div>
            <div className='flex-1 min-w-[150px]'>
              <label htmlFor="price">Price <span className='text-red-500'>*</span></label>
              <br/>
              <input type="number" id='price' value={price} 
                onChange={(e)=> {
                  if(Number(e.target.value) < 0){
                    return
                  }else{
                    setPrice(e.target.value)
                  }
                }} required className='mt-4 py-2 px-4 focus:outline-none border-[1px] border-[#ccc] rounded w-full' />
            </div>
            <div className='flex-1 min-w-[150px]'>
              <label htmlFor="discount">Discount (%)</label>
              <br/>
              <input type="number" id='discount' value={discount} 
                 onChange={(e)=> {
                  if(Number(e.target.value) < 0){
                    return
                  }else{
                    setDiscount(e.target.value)
                  }
                }} 
                className='mt-4 py-2 px-4 focus:outline-none border-[1px] border-[#ccc] rounded w-full' />
            </div>
            <div className='flex-1 min-w-[150px]'>
              <label htmlFor="amount">Discounted Price</label>
              <br/>
              <input type="number" id='amount' ref={totalAmtRef} readOnly className='mt-4 py-2 px-4 focus:outline-none border-[1px] border-[#ccc] rounded w-full' />
            </div>
          </div>
          <div className='flex flex-wrap gap-8 mb-8'>
            <div className='flex-1 min-w-[calc(50%-32px)]'>
              <label className=''>Category <span className='text-red-500'>*</span></label>
              <br />
              <select onChange={handleCategorySelection} className='w-full p-4 mt-4 focus:outline-none focus:border-0'>
                <option value="">Select Category</option>
                {catData?.categories.map((cat: Category,i: number) => (
                  <option value={cat.name} data-id={cat._id} key={i} className='capitalize'>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className='flex-1 min-w-[250px] bg-white p-4 rounded-md'>
              <h2 className='font-semibold mb-4'>Selected Categories: </h2>
              <ul className='flex flex-wrap gap-4'>
                {
                  selectedCategories.map((cat,i) => (
                    <li className='py-1 px-2 bg-bgGray rounded-md text-[13px] relative group' key={i}>
                      {cat.name}
                      <span className='bg-primary cursor-pointer invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 h-4 w-4 rounded-full text-white text-[10px] flex items-center justify-center absolute -top-[4px] -right-[8px]'
                      onClick={() => removeCategory(cat._id)}
                      >x</span>
                    </li>
                  ))
                }
              </ul>
            </div>
          </div>
          <div className='flex gap-2 mb-8'>
              <label htmlFor="feature">Featured:</label>
              <br/>
              <input type="checkbox" id='feature' checked={isFeatured} onChange={() => setIsFeatured(!isFeatured)} />
          </div>
          <div className='flex gap-2 mb-8'>
              <label htmlFor="offer">Offer:</label>
              <br/>
              <input type="checkbox" id='offer' checked={showOffer}
                onChange={() => setShowOffer(!showOffer)}
              />
          </div>
          <div className={`${showOffer ? 'block mb-8' : 'hidden'}`}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className='flex'>
              <div className='flex-1'>
                <h2 className='font-semibold mb-2'>Offter Start Date:</h2>
                <DateTimePicker
                  disablePast
                  value={dayjs(startDate)}
                  onChange={(newValue) => {
                    if(newValue !== null) {
                      const dateTime = dayjs(newValue).toISOString()
                      setStartDate(dateTime)
                    }
                  }}
                />
              </div>
              <div className='flex-1'>
                <h2 className='font-semibold mb-2'>Offter End Date:</h2>
                <DateTimePicker
                  disablePast
                  value={dayjs(endDate)}
                  onChange={(newValue) => {
                    if(newValue !== null) {
                      const dateTime = dayjs(newValue).toISOString()
                      setEndDate(dateTime)
                    }
                  }}
                />
              </div>
            </div>
          </LocalizationProvider>
          </div>


          <div className='mb-8 '>
            <label>Upload Images <span className="text-red-500">*</span></label>
            <input
              type="file"
              name=""
              id="upload"
              className="hidden"
              multiple
              onChange={handleImageChange}
            />
          <div className="w-full flex-wrap flex flex-col">
            <label htmlFor="upload">
              <AiOutlinePlusCircle size={30} className="mt-3" color="#555" />
            </label>
            <div className='flex mt-4 flex-wrap'>
              {images && images.map((img,i) => (
                  <img src={img && typeof img !== 'string' ? (img as Image).url : (img as string).toString()} key={i} alt=""
                    className="h-[120px] w-[120px] object-contain m-2"
                  />
                ))}
            </div>
          </div>
          </div>


          <div>
            <SubmitButton isLoading={id ? updateLoading : isLoading} title={id ? 'Edit Now' : 'Submit'} />
          </div>
        </form>
      </main>
    </section>
  )
}

export default CreateProduct