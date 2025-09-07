import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { editCategory, getCategory, updateCategory } from "../../Reducer/CategorySlice"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { Button, Label, Modal, TextInput } from "flowbite-react"

const UpdateCategory=({
    openMerchantDetailsModal,
        setOpenMerchantDetailsModal,
        categoryId
})=>{
    const{categorySingle}=useSelector((state)=>state?.category)
    const dispatch=useDispatch()

    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors },
      } = useForm();

    useEffect(()=>{
        dispatch(editCategory({category_id:categoryId}))
    },[categoryId])

    useEffect(()=>{
setValue("category_name",categorySingle?.res?.category_name)
    },[categorySingle,categoryId])

    const onSubmit=(data)=>{
        dispatch(updateCategory({...data,category_id:categoryId})).then((res)=>{
            if(res?.payload?.status_code===200){
        setOpenMerchantDetailsModal(false)
                dispatch(getCategory())
            }
        })
    }
    return(
        <>
                            <Modal
                           show={openMerchantDetailsModal}
                           onClose={() => setOpenMerchantDetailsModal(false)}
                         >
                            <form 
                            
                             onSubmit={handleSubmit(onSubmit)}
                            >
                           <Modal.Header className="text-[#435971]">
                             Update Category
                           </Modal.Header>
                           <Modal.Body>
                             <div className="space-y-4 h-[100px] ">
                               <div>
                                 <div className="mb-1 block">
                                   <Label value="Category Name(eg:Bus or Cab) *" />
                                 </div>
                                 <TextInput
                                   type="text"
                                   placeholder="Enter Category Name"
                                   {...register("category_name",{required:"Category Name Required"})}
                                 />
                                      {errors.category_name && (
                                        <p className="text-red-500 text-sm mt-1">{errors.category_name.message}</p>
                                    )}
                               </div>
                             </div>
                           </Modal.Body>
                           <Modal.Footer className="flex justify-end">
                             <Button
                               className="bg-white text-gray-700 hover:bg-[#9b1c1c] hover:text-white border border-gray-300"
                               onClick={() => setOpenMerchantDetailsModal(false)}
                             >
                               Cancel
                             </Button>
                             <Button type="submit" className="bg-[#686AF8] hover:bg-black">
                               Update
                             </Button>
                           </Modal.Footer>
                           </form>
                         </Modal>
        </>
    )
}
export default UpdateCategory