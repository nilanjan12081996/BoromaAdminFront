import { Button, FileInput, Label, Modal, Select, Textarea, TextInput } from "flowbite-react"
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addCategory, getCategory } from "../../Reducer/CategorySlice";
import { addSubCategory, getSubCategory } from "../../Reducer/SubcategorySlice";

const AddSubCategory=({openAddSubModal,
        setOpenAddSubModal})=>{
                const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch=useDispatch()
  const onSubmit=(data)=>{
dispatch(addSubCategory(data)).then((res)=>{
    console.log("Res",res);
    if(res?.payload?.status_code){
        setOpenAddSubModal(false)
        dispatch(getSubCategory())
    }
    
})
  }
    return(
        <>
         <Modal
                   show={openAddSubModal}
                   onClose={() => setOpenAddSubModal(false)}
                 >
                    <form onSubmit={handleSubmit(onSubmit)}>
                   <Modal.Header className="text-[#435971]">
                     Add New Sub Category
                   </Modal.Header>
                   <Modal.Body>
                     <div className="space-y-4 h-[100px] ">
                       <div>
                         <div className="mb-1 block">
                           <Label value="Sub Category Name(eg:AC, Non-AC,Sleeper) *" />
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
                       onClick={() => setOpenAddSubModal(false)}
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
export default AddSubCategory