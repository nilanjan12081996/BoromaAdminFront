import { Button, Label, Modal, Select, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addLevels, getLevels } from "../../Reducer/LevelSlice";
const AddModal = ({ openAddLevelModal, setOpenAddLevelModal }) => {
  const nevigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    dispatch(addLevels(data)).then((res) => {
      console.log("Res", res);
      if (res?.payload?.status_code === 201) {
        dispatch(getLevels());
        setOpenAddLevelModal(false);
      }
    });
  };
  const handleAddClick = () => {
    handleSubmit(onSubmit)(); // Manually trigger form submission
  };
  const handleCancel = () => {
    setOpenAddLevelModal(false);
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal
          show={openAddLevelModal}
          onClose={() => setOpenAddLevelModal(false)}
        >
          <Modal.Header className="border-0 pb-0">Add New Level</Modal.Header>
          <Modal.Body>
            <div className="space-y-4">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="name" value="Level Name" />
                </div>
                <TextInput
                  id="name"
                  type="text"
                  placeholder="Enter Level"
                  {...register("level_name")}
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="border-0 pt-0">
            <Button
              onClick={handleCancel}
              className="focus:outline-none text-white bg-black hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-0.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddClick}
              // Changed from type="submit" to onClick handler
              className="focus:outline-none text-white bg-[#52b69a] hover:bg-black focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-0.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              Add
            </Button>
          </Modal.Footer>
        </Modal>
      </form>
    </>
  );
};
export default AddModal;
