import { Button, Label, Modal, Select, TextInput } from "flowbite-react"
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { getCategory } from "../../Reducer/CategorySlice";
import { addVehicle, getCategoryVeh, getVehiclesInfo } from "../../Reducer/VehicleSlice";
import { useSelector } from "react-redux";

const AddVehicle=({openAddVehicleModal,setOpenAddVehicleModal})=>{
    const{categ}=useSelector((state)=>state?.vehicles)
    const dispatch=useDispatch()
        const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
      } = useForm();
      useEffect(()=>{
        dispatch(getCategoryVeh())
      },[])
      console.log("categ",categ);
        const onSubmit=(data)=>{
      dispatch(addVehicle(data)).then((res)=>{
          console.log("Res",res);
          if(res?.payload?.status_code){
              setOpenAddVehicleModal(false)
              dispatch(getVehiclesInfo())
          }
          
      })
        }
const vType=watch('vehicle_type')
    return(
        <>
        <Modal
        show={openAddVehicleModal}
        onClose={() => setOpenAddVehicleModal(false)}
        >
        <form 
         onSubmit={handleSubmit(onSubmit)}
        >
        <Modal.Header className="text-[#435971]">
            Add New Vehicle
        </Modal.Header>
        <Modal.Body>
            <div className="space-y-4 h-[300px] ">
                <div>
                <div className="mb-1 block">
                <Label value="Vehicle Number *" />
                </div>
                <TextInput
                type="text"
                placeholder="Enter Vehicle Number"
                {...register("vehicle_no",{required:"Vehicle Number is Required"})}
                />
                    {errors.vehicle_no && (
                    <p className="text-red-500 text-sm mt-1">{errors.vehicle_no.message}</p>
                )}
            </div>
            <div>
                <div className="mb-1 block">
                <Label value="Category*" />
                </div>
                <Select
                {...register("category_id",{required:"Category is Required"})}
                >
                    <option>Select</option>
                    {categ?.res?.map((cat)=>(
                        <option value={cat?.id}>{cat?.category_name}</option>
                    ))}

                </Select>
                    {errors.category_id && (
                    <p className="text-red-500 text-sm mt-1">{errors.category_id.message}</p>
                )}
            </div>
            <div>
                <div className="mb-1 block">
                <Label value="Vehicle Type*" />
                </div>
                <Select
                {...register("vehicle_type",{required:"Vehicle type is Required"})}
                >
                    <option>Select</option>
                    <option value="single">Single</option>
                    <option value="share">Share</option>
                

                </Select>
                    {errors.vehicle_type && (
                    <p className="text-red-500 text-sm mt-1">{errors.vehicle_type.message}</p>
                )}
            </div>
            {
                vType==="share"&&(
                    <>
                     <div>
                <div className="mb-1 block">
                <Label value="Number of Seats*" />
                </div>
                <TextInput
                type="text"
                placeholder="Enter Number of seats"
                {...register("number_of_seats",{required:"Number of Seats is Required"})}
                />
                    {errors.number_of_seats && (
                    <p className="text-red-500 text-sm mt-1">{errors.number_of_seats.message}</p>
                )}
            </div>
                    </>
                )
            }
               
             
            </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
            <Button
            className="bg-white text-gray-700 hover:bg-[#9b1c1c] hover:text-white border border-gray-300"
            onClick={() => setOpenAddVehicleModal(false)}
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
export default AddVehicle