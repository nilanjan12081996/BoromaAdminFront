import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaRegImage } from "react-icons/fa";
import Select from "react-select";
import { Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import {
  addCourseStep1,
  courseLevelDropdown,
  courseTagsDropdown,
} from "../../Reducer/CourseSlice";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";

const AddCourseStep1 = ({ onNext, setLevelId, setCourseId }) => {
  const dispatch = useDispatch();
  const [learningOutcomes, setLearningOutcomes] = useState(["", ""]);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(100);
  const [nextStepData, setNextStepData] = useState();

  const {
    courseTagsDropdownData,
    courseLevelDropdownData,
    addCourseStep1loading,
  } = useSelector((state) => state?.courses);

  const tagOptions =
    courseTagsDropdownData?.list?.map((tag) => ({
      value: tag?.id,
      label: tag?.title,
    })) || [];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    dispatch(courseTagsDropdown());
    dispatch(courseLevelDropdown());
  }, [dispatch]);

  const handleAddOutcome = () => {
    setLearningOutcomes([...learningOutcomes, ""]);
  };

  const handleChangeOutcome = (index, value) => {
    const updated = [...learningOutcomes];
    updated[index] = value;
    setLearningOutcomes(updated);
  };

  const handleRemoveOutcome = (index) => {
    const updated = [...learningOutcomes];
    updated.splice(index, 1);
    setLearningOutcomes(updated);
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setProgress(100);
    }
  };

  const removeFile = () => {
    setFile(null);
    setProgress(0);
  };

  const onSubmit = (data) => {
    console.log("add course data", data);

    // const input = data.course_duration_input.trim();
    // const match = input.match(/^(\d+)\s*([a-zA-Z]+)$/);

    // if (!match) {
    //   toast.error(
    //     "Invalid duration format. Use something like '3 months' or '2weeks'."
    //   );
    //   return;
    // }

    // const [, number, unit] = match;

    const tagIds = data?.course_tags?.map((tag) => tag.value);

    const formData = new FormData();
    formData.append("course_title", data?.course_title);
    formData.append("course_sub_title", data?.course_sub_title);
    formData.append("course_tags", JSON.stringify(tagIds));
    formData.append("course_level_id", data?.course_level_id);
    formData.append("course_duration", data?.course_duration);
    formData.append("course_duration_str", data?.course_duration_str);
    formData.append("course_description", data?.course_description);
    formData.append(
      "student_will_learn",
      JSON.stringify(
        learningOutcomes
          ?.filter((outcome) => outcome?.trim() !== "")
          ?.map((outcome) => ({ name: outcome?.trim() }))
      )
    );
    formData.append("cover_photo", file);

    dispatch(addCourseStep1(formData)).then((res) => {
      console.log("add course step 1 res", res);
      if (res?.payload?.status_code === 201) {
        // setNextStepData({"course_level_id":res?.payload?.level_id})
        setLevelId(res?.payload?.level_id);
        setCourseId(res?.payload?.course_id);
        toast.success(res?.payload?.message);
        onNext();
      } else {
        toast.error(res?.payload?.response?.data?.message);
      }
    });
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 field_area">
        <div className="max-w-full mx-auto p-6 bg-white shadow rounded-xl">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Create New Course</h2>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Course Title
              </label>
              <input
                type="text"
                placeholder="Enter Course Title"
                className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("course_title", {
                  required: "Course Title is required",
                })}
              />
              {errors?.course_title && (
                <p className="text-red-500 text-sm">
                  {errors.course_title.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Course Subtitle
              </label>
              <input
                type="text"
                placeholder="Enter Course Subtitle"
                className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("course_sub_title", {
                  required: "Course Sub Title is required",
                })}
              />
              {errors?.course_sub_title && (
                <p className="text-red-500 text-sm">
                  {errors.course_sub_title.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Course Tags
                </label>
                <Controller
                  name="course_tags"
                  control={control}
                  rules={{ required: "At least one course tag is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={tagOptions}
                      isMulti
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                  )}
                />
                {errors?.course_tags && (
                  <p className="text-red-500 text-sm">
                    {errors.course_tags.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Course Level
                </label>
                <select
                  className="w-full border rounded px-4 py-2"
                  {...register("course_level_id", {
                    required: "Course Level is required",
                  })}
                >
                  <option>Select...</option>
                  {courseLevelDropdownData?.list?.map((level) => (
                    <option key={level?.id} value={level?.id}>
                      {level?.level_name}
                    </option>
                  ))}
                </select>
                {errors?.course_level_id && (
                  <p className="text-red-500 text-sm">
                    {errors.course_level_id.message}
                  </p>
                )}
              </div>
              {/* <div>
                <label className="block text-sm font-medium mb-1">
                  Course Duration
                </label>
                <input
                  type="text"
                  placeholder="Enter Course Duration (e.g. 3 week)"
                  className="w-full border rounded px-4 py-2"
                  {...register("course_duration_input", {
                    required: "Course Sub Title is required",
                  })}
                />
                {errors?.course_duration_input && (
                  <p className="text-red-500 text-sm">
                    {errors.course_duration_input.message}
                  </p>
                )}
              </div>
              <input type="hidden" {...register("course_duration")} />
              <input type="hidden" {...register("course_duration_str")} /> */}

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Course Duration
                </label>

                <div className="flex gap-2">
                  {/* Numeric input for duration */}
                  <input
                    type="text"
                    placeholder="Enter Course Duration"
                    className="w-full border rounded px-4 py-2"
                    {...register("course_duration", {
                      required: "Course Sub Title is required",
                    })}
                  />

                  {/* Dropdown for duration type */}
                  <select
                    className="w-1/2 border rounded px-4 py-2"
                    {...register("course_duration_str", {
                      required: "Please select a duration type",
                    })}
                  >
                    <option value="">Select</option>
                    <option value="week">Week(s)</option>
                    <option value="month">Month(s)</option>
                    <option value="year">Year(s)</option>
                  </select>
                </div>

                {/* Error display */}
                {/* {errors?.course_duration_input && (
                  <p className="text-red-500 text-sm">
                    {errors.course_duration_input.message}
                  </p>
                )} */}
                {errors?.course_duration_type && (
                  <p className="text-red-500 text-sm">
                    {errors.course_duration_type.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Course Description
              </label>
              <textarea
                rows="4"
                placeholder="Enter Course Description"
                className="w-full border rounded px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("course_description", {
                  required: "Course Sub Title is required",
                })}
              ></textarea>
              {errors?.course_description && (
                <p className="text-red-500 text-sm">
                  {errors.course_description.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                What Students Will Learn?
              </label>

              {learningOutcomes?.map((outcome, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={outcome}
                    onChange={(e) => handleChangeOutcome(index, e.target.value)}
                    placeholder="Enter what student will learn"
                    className="w-full border rounded px-4 py-2"
                  />
                  {learningOutcomes?.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOutcome(index)}
                      className="text-red-500 hover:text-red-700 text-xl font-bold"
                      title="Remove"
                    >
                      &times;
                    </button>
                  )}
                </div>
              ))}

              <button
                onClick={handleAddOutcome}
                type="button"
                className="text-[#52b69a] text-sm mt-2 hover:underline"
              >
                + Add More
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Cover Photo
              </label>

              <div className="flex flex-col md:flex-row gap-4">
                <label className="w-full md:w-1/2 border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center bg-[#f9fafb] cursor-pointer hover:border-[#52b69a]">
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <FaRegImage size={36} className="text-[#52b69a] mb-2" />
                  <span className="text-sm text-gray-600">
                    Drag and Drop Image or{" "}
                    <span className="text-[#52b69a] font-medium">Browse</span>
                    <br />
                    <span className="text-xs text-gray-400">
                      SVG, PNG, JPG or JPEG (max 18 MB)
                    </span>
                  </span>
                </label>

                {file && (
                  <div className="relative flex-1 border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <p className="font-medium text-sm">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(1)} MB
                        </p>
                      </div>
                      <button
                        onClick={removeFile}
                        className="text-gray-500 hover:text-red-600 text-lg"
                      >
                        ×
                      </button>
                    </div>

                    <div className="w-full bg-gray-200 h-2 rounded">
                      <div
                        className="h-2 bg-blue-800 rounded"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <p className="text-right text-xs text-gray-600 mt-1">
                      {progress}%
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-4 mb-6">
                <button className="bg-black text-white px-5 py-2 rounded hover:bg-[#8f8f8f]">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#52b69a] text-white px-6 py-2 rounded hover:bg-black"
                >
                  {addCourseStep1loading
                    ? "Saving please wait..."
                    : "Save and Continue →"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddCourseStep1;
