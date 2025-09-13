import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { editCategory, getCategory, updateCategory } from "../../Reducer/CategorySlice"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { Button, Label, Modal, TextInput } from "flowbite-react"
import { editSubCategory, getSubCategory, updateSubCategory } from "../../Reducer/SubcategorySlice"

const UpdateSubCategory=({
    openSubDetailsModal,
        setOpenSubDetailsModal,
        subcategoryId
})=>{
   
    const{subCategorySingle}=useSelector((state)=>state?.subCategory)
    const dispatch=useDispatch()

    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors },
      } = useForm();

    useEffect(()=>{
        dispatch(editSubCategory({sub_category_id:subcategoryId}))
    },[subcategoryId])

    useEffect(()=>{
setValue("sub_category_name",subCategorySingle?.res?.subcat_name)
    },[subCategorySingle,subcategoryId])

    const onSubmit=(data)=>{
        dispatch(updateSubCategory({...data,sub_category_id:subcategoryId})).then((res)=>{
            if(res?.payload?.status_code===200){
        setOpenSubDetailsModal(false)
                dispatch(getSubCategory())
            }
        })
    }
    return(
        <>
                            <Modal
                           show={openSubDetailsModal}
                           onClose={() => setOpenSubDetailsModal(false)}
                         >
                            <form 
                            
                             onSubmit={handleSubmit(onSubmit)}
                            >
                           <Modal.Header className="text-[#435971]">
                             Update Sub Category
                           </Modal.Header>
                           <Modal.Body>
                             <div className="space-y-4 h-[100px] ">
                               <div>
                                 <div className="mb-1 block">
                                   <Label value="Category Name(eg:Bus or Cab) *" />
                                 </div>
                                 <TextInput
                                   type="text"
                                   placeholder="Enter Sub Category Name"
                                   {...register("sub_category_name",{required:"Sub Category Name Required"})}
                                 />
                                      {errors.sub_category_name && (
                                        <p className="text-red-500 text-sm mt-1">{errors.sub_category_name.message}</p>
                                    )}
                               </div>
                             </div>
                           </Modal.Body>
                           <Modal.Footer className="flex justify-end">
                             <Button
                               className="bg-white text-gray-700 hover:bg-[#9b1c1c] hover:text-white border border-gray-300"
                               onClick={() => setOpenSubDetailsModal(false)}
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
export default UpdateSubCategory