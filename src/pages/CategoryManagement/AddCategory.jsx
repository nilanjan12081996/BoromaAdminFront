import { Button, FileInput, Label, Modal, Select, Textarea, TextInput } from "flowbite-react"
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addCategory, getCategory } from "../../Reducer/CategorySlice";

const AddCategory=({openAddMerchantModal,
        setOpenAddMerchantModal})=>{
                const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch=useDispatch()
  const onSubmit=(data)=>{
dispatch(addCategory(data)).then((res)=>{
    console.log("Res",res);
    if(res?.payload?.status_code){
        setOpenAddMerchantModal(false)
        dispatch(getCategory())
    }
    
})
  }
    return(
        <>
         <Modal
                   show={openAddMerchantModal}
                   onClose={() => setOpenAddMerchantModal(false)}
                 >
                    <form onSubmit={handleSubmit(onSubmit)}>
                   <Modal.Header className="text-[#435971]">
                     Add New Category
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
                       onClick={() => setOpenAddMerchantModal(false)}
                     >
                       Cancel
                     </Button>
                     <Button type="submit" className="bg-[#686AF8] hover:bg-black">
                       Add
                     </Button>
                   </Modal.Footer>
                   </form>
                 </Modal>
        </>
    )
}
export default AddCategory