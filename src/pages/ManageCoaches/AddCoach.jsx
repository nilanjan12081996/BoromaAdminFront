import {
  Button,
  FileInput,
  Label,
  Select,
  Textarea,
  TextInput,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { BiSolidFile } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  addCoach,
  checkCoachBreakTimeDiff,
  checkCoachTimes,
  getCounrtyForCoach,
  getDays,
  getLevel,
  getRMForCoach,
} from "../../Reducer/CoachSlice";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { CiCirclePlus } from "react-icons/ci";
import { AiOutlineMinusCircle } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";

const AddCoach = () => {
  const dispatch = useDispatch();
  const nevigate = useNavigate();
  const baseUrl = window.location.origin;
  const { coachCountryData, rmData, levelData, daysData } = useSelector(
    (state) => state?.coach
  );

  useEffect(() => {
    dispatch(getCounrtyForCoach());
    dispatch(getRMForCoach());
    dispatch(getLevel());
    dispatch(getDays());
  }, []);

  const countryDocuments = {
    IN: ["Aadhar", "PAN", "Voter ID", "Driving License"],
    US: ["SSN", "Passport", "Driver License", "Green Card"],
  };
  const [selectedCountry, setSelectedCountry] = useState("");
  const [documentOptions, setDocumentOptions] = useState([]);
  const [documentType, setDocumentType] = useState("");
  const [documentFile, setDocumentFile] = useState(null);
  const [certificateFiles, setCertificateFiles] = useState([]);

  const [shifts, setShifts] = useState([
    { day: "", startTime: "", endTime: "" },
  ]);

  const [breaks, setBreaks] = useState([
    { day: "", startTime: "", endTime: "" },
  ]);
  console.log("breaks", breaks);

  const handleAddShift = () => {
    setShifts([...shifts, { day: "", startTime: "", endTime: "" }]);
  };

  const handleRemoveShift = (index) => {
    const updatedShifts = [...shifts];
    updatedShifts.splice(index, 1);
    setShifts(updatedShifts);
  };

  const handleChange = (index, field, value) => {
    const updatedShifts = [...shifts];
    updatedShifts[index][field] = value;
    setShifts(updatedShifts);
  };

  // const handleBreakChange = (index, field, value) => {
  //   const updated = [...breaks];
  //   updated[index][field] = value;
  //   setBreaks(updated);
  // };

  const handleBreakChange = async (index, field, value) => {
    const updated = [...breaks];
    updated[index][field] = value;

    const { startTime, endTime } = updated[index];

    setBreaks(updated);

    const newStartTime = field === "startTime" ? value : startTime;
    const newEndTime = field === "endTime" ? value : endTime;

    if (newStartTime && newEndTime) {
      dispatch(checkCoachBreakTimeDiff({ start_time: newStartTime, end_time: newEndTime })).then((res) => {
        console.log("check break time res", res)
        if (res?.payload?.status_code === 200) {
          setBreaks(updated);
        } else {
          toast.error(res?.payload?.response?.data?.message);
          const rollback = [...breaks];
          rollback[index][field] = "";
          setBreaks(rollback);
        }
      })
    }
  };

  const handleAddBreak = () => {
    setBreaks([...breaks, { day: "", startTime: "", endTime: "" }]);
  };

  const handleRemoveBreak = (index) => {
    const updated = [...breaks];
    updated.splice(index, 1);
    setBreaks(updated);
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const handleCancel = () => {
    nevigate("/manage-coaches");
  };

  const handleDocumentFileChange = (e) => {
    setDocumentFile(e.target.files[0]);
  };

  const handleCertificateFileChange = (e) => {
    console.log("e.target.files", e.target.files);
    console.log("Hello");

    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.error("You can upload a maximum of 5 certificates");
      return;
    }
    setCertificateFiles(files);
  };

  const handleDocumentTypeChange = (e) => {
    const selectedDocType = e.target.value;
    setDocumentType(selectedDocType);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();

    // Basic fields
    formData.append("country_id", data.country_id || 97);
    formData.append("rm_id", data.rm_id || 8);
    formData.append("coach_level_id", data.coach_level_id || 2);
    formData.append("f_name", data.f_name || "Madan");
    formData.append("l_name", data.l_name || "Mitra");
    formData.append("mobile", data.mobile || "98566332211");
    formData.append("email", data.email || "madan@yopmail.com");
    formData.append("fid_reating", data.fid_reating || "132321");
    formData.append("doc_type", documentType || "pan");
    formData.append("first_line", data.first_line || "Test");
    formData.append("base_url", baseUrl);
    formData.append("lat", 44.88);
    formData.append("longitude", 54.66);
    formData.append("time_zone_id", 2);

    // Shift timings
    const formattedShifts = shifts.map((shift) => ({
      day_id: Number(shift.day),
      start_time: shift.startTime,
      end_time: shift.endTime,
    }));
    formData.append("shift_timings", JSON.stringify(formattedShifts));

    // Break timings
    const formattedBreaks = breaks.map((brk) => ({
      day_id: Number(brk.day),
      start_time: brk.startTime,
      end_time: brk.endTime,
    }));
    formData.append("break_timings", JSON.stringify(formattedBreaks));

    // Files
    if (documentFile) formData.append("document_file", documentFile);

    certificateFiles.forEach((file) => {
      formData.append("certificate_files", file);
    });

    dispatch(checkCoachTimes({ shift_timings: formattedShifts, break_timings: formattedBreaks })).then((res) => {
      console.log("check coach time", res)
      const data = res?.payload?.res;

      if (!Array.isArray(data)) {
        toast.error("Invalid response format");
        return;
      }

      const invalidItems = data.filter(item => item.isValid === false);
      if (invalidItems.length > 0) {
        const errorMessages = invalidItems.map(item => {
          const breakInfo = `Break on ${item.break.day} (${item.break.start_time} - ${item.break.end_time})`;
          const shiftInfo = item.shifts.map(shift =>
            `Shift on ${shift.day} (${shift.start_time} - ${shift.end_time})`
          ).join(", ");
          return `${breakInfo} conflicts with ${shiftInfo}`;
        });

        toast.error("Invalid Timings:\n" + errorMessages.join("\n"), { autoClose: false });
      } else {
        dispatch(addCoach(formData)).then((res) => {
          console.log("Res", res);
          if (res?.payload?.status_code === 201) {
            toast.success(res?.payload?.message);
            nevigate("/manage-coaches");
          } else if (res?.payload?.response?.data?.status_code === 422) {
            const errors = res?.payload?.response?.data?.errors;

            if (Array.isArray(errors)) {
              toast.error(
                <div>
                  <strong>Shift timing conflicts:</strong>
                  <ul className="list-disc pl-5">
                    {errors.map((err, index) => (
                      <li key={index}>
                        <strong>{err.day_name}:</strong> {err.overlapping_slot}{" "}
                        overlapping with {err.overlapped_with}
                      </li>
                    ))}
                  </ul>
                </div>,
                { autoClose: false }
              );
            }
          } else (
            toast.error(res?.payload?.response?.data?.message)
          )
        });
      }

    })

    // dispatch(addCoach(formData)).then((res) => {
    //   console.log("Res", res);
    //   if (res?.payload?.status_code === 201) {
    //     toast.success(res?.payload?.message);
    //     nevigate("/manage-coaches");
    //   } else if (res?.payload?.response?.data?.status_code === 422) {
    //     const errors = res?.payload?.response?.data?.errors;

    //     if (Array.isArray(errors)) {
    //       toast.error(
    //         <div>
    //           <strong>Shift timing conflicts:</strong>
    //           <ul className="list-disc pl-5">
    //             {errors.map((err, index) => (
    //               <li key={index}>
    //                 <strong>{err.day_name}:</strong> {err.overlapping_slot}{" "}
    //                 overlapping with {err.overlapped_with}
    //               </li>
    //             ))}
    //           </ul>
    //         </div>,
    //         { autoClose: false }
    //       );
    //     }
    //   }
    // });
  };

  return (
    <>
      <ToastContainer />
      <div className="mb-4 ml-0 bg-white">
        <h2 className="text-2xl font-semibold p-6">Coach Details</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white ">
            <div className="h-full">
              {/* coach Details */}
              <div className="flex justify-between items-center mb-4 gap-4">
                <div className="w-4/12">
                  <div className="mb-2 block">
                    <Label htmlFor="name" value="First Name" />
                  </div>
                  <TextInput
                    id="name"
                    type="text"
                    placeholder="Enter First Name"
                    {...register("f_name", { required: true })}
                  />
                </div>
                <div className="w-4/12">
                  <div className="mb-2 block">
                    <Label htmlFor="name" value="Last Name" />
                  </div>
                  <TextInput
                    id="name"
                    type="text"
                    placeholder="Enter Last Name"
                    {...register("l_name", { required: true })}
                  />
                </div>
                <div className="w-4/12">
                  <div className="mb-2 block">
                    <Label htmlFor="name" value="Email Address" />
                  </div>
                  <TextInput
                    id="name"
                    type="email"
                    width="full"
                    placeholder="Enter Email Address"
                    {...register("email", { required: true })}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center mb-4 gap-4">
                <div className="w-4/12">
                  <div className="mb-2 block">
                    <Label htmlFor="name" value="Mobile Number" />
                  </div>
                  <TextInput
                    id="name"
                    type="text"
                    placeholder="Enter Mobile Number"
                    {...register("mobile", { required: true })}
                  />
                </div>
                <div className="w-4/12">
                  <div className="mb-2 block">
                    <Label htmlFor="name" value="Country" />
                  </div>
                  <Select
                    {...register("country_id", { required: true })}
                    onChange={(e) => {
                      const countryId = e.target.value;
                      const countryName = coachCountryData?.results?.find(
                        (c) => c.id === Number(countryId)
                      )?.country_short_name;
                      setSelectedCountry(countryId);
                      setDocumentOptions(countryDocuments[countryName] || []);
                      setValue("doc_type", "");
                      setDocumentType("");
                    }}
                  >
                    <option value="">Select</option>
                    {coachCountryData?.results?.map((coun) => {
                      return (
                        <>
                          <option key={coun?.id} value={coun?.id}>
                            {coun?.country_name}
                          </option>
                        </>
                      );
                    })}
                  </Select>
                </div>
                <div className="w-4/12">
                  <div className="mb-2 block">
                    <Label htmlFor="name" value="Relationship Manager" />
                  </div>
                  <Select {...register("rm_id")}>
                    <option>Select Relationship Manager</option>
                    {rmData?.results?.map((rm) => {
                      return (
                        <>
                          <option key={rm?.id} value={rm?.id}>
                            {rm?.f_name} {rm?.l_name}
                          </option>
                        </>
                      );
                    })}
                  </Select>
                </div>
              </div>

              <div className="flex justify-between items-center mb-4 gap-4">
                <div className="w-4/12">
                  <div className="mb-2 block">
                    <Label htmlFor="name" value="FIDE Rating" />
                  </div>
                  <TextInput
                    id="name"
                    type="text"
                    placeholder="Enter FIDE Rating"
                    {...register("fid_reating", { required: true })}
                  />
                </div>
                <div className="w-4/12">
                  <div className="mb-2 block">
                    <Label htmlFor="name" value="Coach Level" />
                  </div>
                  <Select {...register("coach_level_id", { required: true })}>
                    <option value="">Select Coach Level</option>
                    {levelData?.results?.map((level) => {
                      return (
                        <>
                          <option key={level?.id} value={level?.id}>
                            {level?.level_name}
                          </option>
                        </>
                      );
                    })}
                  </Select>
                </div>
                <div className="w-4/12">
                  <div className="mb-2 block">
                    <Label htmlFor="name" value="Address" />
                  </div>
                  <TextInput
                    id="name"
                    type="text"
                    width="full"
                    placeholder="Enter Address"
                    {...register("first_line")}
                  />
                </div>
              </div>

              {/* Shift Time */}
              <div className="mb-8">
                <div className="flex justify-between">
                  <h2 className="text-2xl font-semibold py-6">Shift Timing</h2>
                  <div>
                    <Button
                      className=" px-6 py-2 text-black text-base font-semibold flex justify-center items-center "
                      title="add more"
                      onClick={handleAddShift}
                    >
                      <CiCirclePlus size={30} />
                    </Button>
                  </div>
                </div>
                {shifts.map((shift, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center mb-4 gap-4"
                  >
                    <div className="w-4/12">
                      <div className="mb-2 block">
                        <Label htmlFor={`day-${index}`} value="Select Days" />
                      </div>
                      <Select
                        id={`day-${index}`}
                        value={shift.day}
                        onChange={(e) =>
                          handleChange(index, "day", e.target.value)
                        }
                      >
                        <option value="">Select days</option>
                        {daysData?.results?.map((days) => (
                          <option key={days?.id} value={days?.id}>
                            {days?.day}
                          </option>
                        ))}
                      </Select>
                    </div>

                    <div className="w-4/12">
                      <div className="mb-2 block">
                        <Label htmlFor={`start-${index}`} value="Start Time" />
                      </div>
                      <TextInput
                        id={`start-${index}`}
                        type="text"
                        placeholder="Enter Start Time"
                        value={shift.startTime}
                        onChange={(e) =>
                          handleChange(index, "startTime", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="w-4/12 relative">
                      <div className="mb-2 block">
                        <Label htmlFor={`end-${index}`} value="End Time" />
                      </div>
                      <TextInput
                        id={`end-${index}`}
                        type="text"
                        placeholder="Enter End Time"
                        value={shift.endTime}
                        onChange={(e) =>
                          handleChange(index, "endTime", e.target.value)
                        }
                        required
                      />

                      {shifts.length > 1 && (
                        <button
                          type="button"
                          className="absolute top-8 right-2 text-red-600"
                          onClick={() => handleRemoveShift(index)}
                        >
                          <AiOutlineMinusCircle size={24} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Break Time */}
              {/* <div className="mb-8">
                <div className="flex justify-between">
                  <h2 className="text-2xl font-semibold py-6">Break Timing</h2>
                  <div>
                    <Button
                      className=" px-6 py-2 text-black text-base font-semibold flex justify-center items-center "
                      title="add more"
                      onClick={handleAddShift}
                    >
                      <CiCirclePlus size={30} />
                    </Button>
                  </div>
                </div>

                {shifts.map((shift, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center mb-4 gap-4"
                  >
                    <div className="w-4/12">
                      <div className="mb-2 block">
                        <Label htmlFor={`day-${index}`} value="Select Days" />
                      </div>
                      <Select
                        id={`day-${index}`}
                        value={shift.day}
                        onChange={(e) =>
                          handleChange(index, "day", e.target.value)
                        }
                      >
                        <option value="">Select days</option>
                        {daysData?.results?.map((days) => (
                          <option key={days?.id} value={days?.id}>
                            {days?.day}
                          </option>
                        ))}
                      </Select>
                    </div>

                    <div className="w-4/12">
                      <div className="mb-2 block">
                        <Label htmlFor={`start-${index}`} value="Start Time" />
                      </div>
                      <TextInput
                        id={`start-${index}`}
                        type="text"
                        placeholder="Enter Start Time"
                        value={shift.startTime}
                        onChange={(e) =>
                          handleChange(index, "startTime", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="w-4/12 relative">
                      <div className="mb-2 block">
                        <Label htmlFor={`end-${index}`} value="End Time" />
                      </div>
                      <TextInput
                        id={`end-${index}`}
                        type="text"
                        placeholder="Enter End Time"
                        value={shift.endTime}
                        onChange={(e) =>
                          handleChange(index, "endTime", e.target.value)
                        }
                        required
                      />

                      {shifts.length > 1 && (
                        <button
                          type="button"
                          className="absolute top-8 right-2 text-red-600"
                          onClick={() => handleRemoveShift(index)}
                        >
                          <AiOutlineMinusCircle size={24} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div> */}

              <div className="mb-8">
                <div className="flex justify-between">
                  <h2 className="text-2xl font-semibold py-6">Break Timing</h2>
                  <div>
                    <Button
                      className="px-6 py-2 text-black text-base font-semibold flex justify-center items-center"
                      title="add break"
                      onClick={handleAddBreak}
                    >
                      <CiCirclePlus size={30} />
                    </Button>
                  </div>
                </div>

                {breaks.map((brk, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center mb-4 gap-4"
                  >
                    <div className="w-4/12">
                      <div className="mb-2 block">
                        <Label
                          htmlFor={`break-day-${index}`}
                          value="Select Days"
                        />
                      </div>
                      <Select
                        id={`break-day-${index}`}
                        value={brk.day}
                        onChange={(e) =>
                          handleBreakChange(index, "day", e.target.value)
                        }
                      >
                        <option value="">Select days</option>
                        {daysData?.results?.map((days) => (
                          <option key={days?.id} value={days?.id}>
                            {days?.day}
                          </option>
                        ))}
                      </Select>
                    </div>

                    <div className="w-4/12">
                      <div className="mb-2 block">
                        <Label
                          htmlFor={`break-start-${index}`}
                          value="Start Time"
                        />
                      </div>
                      <TextInput
                        id={`break-start-${index}`}
                        type="text"
                        placeholder="Enter Start Time"
                        value={brk.startTime}
                        onChange={(e) =>
                          handleBreakChange(index, "startTime", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="w-4/12 relative">
                      <div className="mb-2 block">
                        <Label
                          htmlFor={`break-end-${index}`}
                          value="End Time"
                        />
                      </div>
                      <TextInput
                        id={`break-end-${index}`}
                        type="text"
                        placeholder="Enter End Time"
                        value={brk.endTime}
                        onChange={(e) =>
                          handleBreakChange(index, "endTime", e.target.value)
                        }
                        required
                      />

                      {breaks.length > 1 && (
                        <button
                          type="button"
                          className="absolute top-8 right-2 text-red-600"
                          onClick={() => handleRemoveBreak(index)}
                        >
                          <AiOutlineMinusCircle size={24} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* document type */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold py-6">Documents</h2>
                <div className="flex justify-around items-center mb-4 gap-2">
                  <div className="w-4/12">
                    <div className="mb-2 block">
                      <Label htmlFor="name" value="Document Type" />
                    </div>
                    <Select
                      {...register("doc_type")}
                      value={documentType}
                      onChange={handleDocumentTypeChange}
                    >
                      <option value="">Select Document Type</option>
                      {documentOptions.map((doc, idx) => (
                        <option key={idx} value={doc}>
                          {doc}
                        </option>
                      ))}
                    </Select>
                    <div className="mt-2">
                      <Label
                        htmlFor="document-dropzone-file"
                        className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                      >
                        <div className="flex flex-col items-center justify-center pb-6 pt-5">
                          <BiSolidFile className="text-[#5a5a5a] text-5xl mb-3" />
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            Choose a file to upload
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Pdf file formats
                          </p>
                        </div>
                        <FileInput
                          id="document-dropzone-file"
                          className="hidden"
                          accept=".pdf"
                          onChange={handleDocumentFileChange}
                        />
                      </Label>
                      {documentFile && (
                        <p className="mt-2 text-sm text-green-600 font-medium">
                          Uploaded file: {documentFile.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="w-4/12">
                    <div className="mb-2 block">
                      <Label
                        htmlFor="certificate-dropzone-file"
                        value="Upload Certificate"
                      />
                    </div>
                    <Label
                      htmlFor="certificate-dropzone-file"
                      className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                      <div className="flex flex-col items-center justify-center pb-6 pt-5">
                        <BiSolidFile className="text-[#5a5a5a] text-5xl mb-3" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          Choose a file to upload
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Pdf file formats
                        </p>
                      </div>
                      <FileInput
                        id="certificate-dropzone-file"
                        className="hidden"
                        type="file"
                        multiple
                        accept=".pdf"
                        onChange={handleCertificateFileChange}
                      />
                    </Label>
                    {certificateFiles.length > 0 && (
                      <ul className="mt-2 text-sm text-green-600 font-medium list-disc pl-4">
                        {certificateFiles.map((file, idx) => (
                          <li key={idx}>{file.name}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="float-right">
                  <div className="flex gap-3">
                    <div>
                      <Button
                        onClick={handleCancel}
                        className="bg-[#e3e3ea] hover:bg-[#1a1a33] px-6 py-2 text-black text-base font-semibold flex justify-center items-center rounded-md border border-[#090722]"
                      >
                        Cancel
                      </Button>
                    </div>
                    <div className="mb-4">
                      <Button
                        type="submit"
                        className="bg-[#090722] hover:bg-black px-6 py-2 text-white text-base font-semibold flex justify-center items-center rounded-md"
                      >
                        Register Account
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
export default AddCoach;
