import { FormEvent, useEffect, useState } from 'react'
import DashTitle from '../DashTitle'
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { FaArrowUpFromBracket } from "react-icons/fa6";
import { useAddCategoryMutation, useGetAllCategoryQuery, useUpdateCategoryMutation } from '../../../redux/services/categoryApi';
import { ResponseError } from '../../../type/error';
import Lottie from 'lottie-react';
import animationData from '../../../assets/animations/loading.json'
import { useParams } from 'react-router-dom';
import { Category } from '../../../type/category';


const allowedImageTypes = ['image/png',"image/jpg","image/jpeg","image/svg+xml","image/svg"]
const maxFileSize = 100 * 1024 ;

type Image = {
  public_id: string;
  url: string;
}

const CreateCategory = () => {
  const [name,setName] = useState('')
  const [image, setImage] = useState<Image | string | ArrayBuffer | null>();

  const [addCategory,{isLoading}] = useAddCategoryMutation()
  const [updateCategory,{isLoading:updateLoading}] = useUpdateCategoryMutation()

  const {id:editId} = useParams()

  const {category} = useGetAllCategoryQuery('getAllCategory', {
    selectFromResult: ({data}) => ({
      category: data?.categories?.find((cat: Category) => cat._id === editId )
    })
  }) 


  const {getRootProps, getInputProps, open, acceptedFiles} = useDropzone({
    // Disable click and keydown behavior
    noClick: true,
    noKeyboard: true
  });

  const handleAcceptedFiles = () => {
    if(acceptedFiles.length > 1){
      toast.warning('Only One Image Can Be Selected!')
      return
    }
    
    acceptedFiles.forEach((file) => {

      if(!allowedImageTypes.includes(file.type)){
        toast.warning('Please Choose Valid Image Types!')
        return
      }

      if (file.size > maxFileSize) {
        toast.warning('File size exceeds the limit (100kb)!');
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImage(reader.result!);
        }
      };
      reader.readAsDataURL(file);
    })
  }

  const handleSubmit =async (e:FormEvent) => {
    e.preventDefault()
    if(!image || !name){
      toast.error('All Feilds Required')
      return
    }

    try {

      let data = {
        name,
        image,
        oldImageId: null
      }
      
      if(editId && category){
        data.oldImageId = category.image.public_id
        await updateCategory({id: editId, data}).unwrap()
        toast.success('Updated Successfully')
      }else{
        await addCategory(data).unwrap()
        toast.success('Successfully Created')
      }
      setImage(null)
      setName('')
    } catch (error) {
      const resErr = error as ResponseError
      toast.error(resErr?.data?.message || (editId ? "Failed to edit category" : 'Failed to create category'))
    }
  } 

  useEffect(() => {
    handleAcceptedFiles()
  },[acceptedFiles])

  useEffect(() => {
   if(editId && category){
    setName(category.name)
    setImage(category.image)
   }else{
    setName('')
    setImage('')
   }
  },[editId,category])



  return (
    <section>
      <DashTitle title={editId ? 'Edit Category' :'Add Category'} />
      <main className='flex flex-wrap-reverse lg:mr-5 mr-4 gap-8 py-6 pl-4 lg:pl-0'>
        <form className='flex-1 min-w-[250px] bg-bgGray p-6 rounded-md' onSubmit={handleSubmit}>
          <div className='mb-8'>
            <label htmlFor="name">Category Name <span className='text-red-500'>*</span></label>
            <br/>
            <input type="text" id='name' onChange={(e) => setName(e.target.value)} value={name} required className='mt-4 py-2 px-4 focus:outline-none border-[1px] border-[#ccc] rounded w-full' />
          </div>
          <div>
            <button type='submit' disabled={isLoading || updateLoading} className='btn-primary  w-full px-4 md:w-auto disabled:cursor-not-allowed disabled:opacity-[1]'>
              {(isLoading || updateLoading) ? (
                <Lottie
                  animationData={animationData}
                  loop={true}
                  autoplay={true}
                  rendererSettings={{
                    preserveAspectRatio: "xMidYMid slice",
                  }}
                  width={50}
                  height={50}
                  style={{maxHeight:'40px', maxWidth: '40px'}}
                />
              ): (
                editId ? 'Submit Edit' : 'Submit'
              )}
            </button>
          </div>
        </form>
        <div className='flex-1 min-w-[250px] p-6 border-[1px] border-gray-300 rounded-md'>
          <div {...getRootProps()} className='bg-bgGray px-4 py-10 rounded-md border-[1px] border-gray-300 border-dashed flex flex-col items-center justify-center gap-6'>
            <input {...getInputProps()} />
            <p className='text-gray-500 capitalize'>Drag 'n' drop some files here</p>
            <span className='border-[1px] border-gray-400 inline-block p-6 rounded-full'>
              <FaArrowUpFromBracket className="fill-[#6B7280] text-2xl" />
            </span>
            <button type="button" onClick={open} className='btn-primary px-4'>
              Browse Icon
            </button>
          </div>
          {image && (
            <aside className='flex gap-4 mt-6'>
              <h4 className='mb-4 font-semibold'>Category Icon:</h4>
              <img src={image && typeof image !== 'string' ? (image as Image).url : (image as string).toString()} alt="cat-icon" className='max-h-[250px] max-w-[180px]' />
            </aside>
          )}
        </div>

      </main>
    </section>
  )
}

export default CreateCategory