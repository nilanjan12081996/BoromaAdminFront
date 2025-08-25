import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaRegImage } from "react-icons/fa";
import Select from "react-select";
import { Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  addCourseStep1,
  addCourseStep2,
  courseLevelDropdown,
  courseTagsDropdown,
  searchLession,
  searchModule,
} from "../../Reducer/CourseSlice";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";


const AddCourseStep2 = ({ onBack, levelId, course_id }) => {

    const dispatch = useDispatch();
    const navigate=useNavigate();
    const { loading, addCourseStep2loading, searchModulesData, searchLessionData } = useSelector((state) => state?.courses);

    // Store multiple module forms
    const [moduleForms, setModuleForms] = useState([
        {
            moduleSearchTerm: "",
            lessionSearchTerm: "",
            moduleId: "",
            selectedModule: null,
            selectedLession: null,
            files: [],
            module_duration_n: '',
            module_duration: 'week',
            moduleOptions: [],
            lessionOptions: [],
        },
    ]);

    // Error state for each module form
    const [formErrors, setFormErrors] = useState([]);

    // Helper to update a form by index
    const updateForm = (idx, changes) => {
        setModuleForms((prev) => prev.map((f, i) => (i === idx ? { ...f, ...changes } : f)));
    };

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm();

    // Search handlers
    const handleModuleSearch = (idx, searchTerm) => {
        if (!searchTerm) {
            updateForm(idx, { moduleOptions: [] });
            return;
        }
        dispatch(searchModule({ course_level_id: levelId, module_search: searchTerm })).then((res) => {
            const options = res?.payload?.res?.map((mod) => ({ value: mod.id, label: mod.topic_name })) || [];
            updateForm(idx, { moduleOptions: options });
        });
    };
    const handleLessionSearch = (idx, moduleId, searchTerm) => {
        if (!searchTerm || !moduleId) {
            updateForm(idx, { lessionOptions: [] });
            return;
        }
        dispatch(searchLession({ module_id: moduleId, lession_search: searchTerm })).then((res) => {
            const options = res?.payload?.res?.map((les) => ({ value: les.id, label: les.module_name })) || [];
            updateForm(idx, { lessionOptions: options });
        });
    };

    // Add new module form
    const handleAddModuleForm = () => {
        setModuleForms((prev) => [
            ...prev,
            {
                moduleSearchTerm: "",
                lessionSearchTerm: "",
                moduleId: "",
                selectedModule: null,
                selectedLession: null,
                files: [],
                module_duration_n: '',
                module_duration: 'week',
                moduleOptions: [],
                lessionOptions: [],
            },
        ]);
    };

    // File handlers per form
    const handleFileChange = (idx, e) => {
        const files = Array.from(e.target.files).filter(f => f.type === 'application/pdf');
        if (files.length > 0) {
            updateForm(idx, { files });
        } else {
            updateForm(idx, { files: [] });
        }
    };
    const removeFile = (idx, fileIdx) => {
        setModuleForms(prev => prev.map((form, i) => {
            if (i !== idx) return form;
            const newFiles = (form.files || []).filter((_, j) => j !== fileIdx);
            return { ...form, files: newFiles };
        }));
    };

    const onSubmit = (data) => {
        // Validate all fields for each module form
        const errors = moduleForms.map((form) => {
            const err = {};
            if (!form.selectedModule) err.module = 'Module is required';
            if (!form.selectedLession) err.lession = 'Lession is required';
            if (!form.module_duration_n || !form.module_duration) err.duration = 'Module duration is required';
            if (!form.files || form.files.length === 0) err.files = 'At least one PDF file is required';
            return err;
        });
        setFormErrors(errors);
        // If any errors exist, prevent submission
        if (errors.some(e => Object.keys(e).length > 0)) return;
        // Gather all module form data
        const modulesData = moduleForms.map((form) => ({
            moduleId: form.selectedModule?.value || '',
            lessionId: form.selectedLession?.value || '',
            module_duration: `${form.module_duration_n} ${form.module_duration}`.trim(),
            files: form.files || [],
        }));
        console.log('All modules data:', modulesData);
        // Here you can dispatch or send this array as needed

        const formData = new FormData();

        formData.append('course_id', course_id);
        modulesData.forEach((mod) => {
            formData.append('module_id', mod.moduleId);
            formData.append('lession_id', mod.lessionId);
            formData.append('module_duration', mod.module_duration);

            mod.files.forEach((file) => {
                formData.append('homework', file); 
            });
        });

        dispatch(addCourseStep2(formData))
            .then((res) => {
                console.log("res", res)
                if (res?.payload?.status_code === 200) {
                toast.success(res?.payload?.message);
            } else {
                toast.error(res?.payload?.response?.data?.message);
            }
                // navigate('/manage-courses')
            })

    };

    return (
        <>
            <div className="min-h-screen bg-gray-100">
                <div className="max-w-full mx-auto p-6 bg-white shadow rounded-xl">
                    <div className="flex justify-between items-center">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold">Create New Course</h2>
                        </div>
                        <button type="button" className="border border-blue-800 text-blue-800 w-[15rem] px-3 py-1 rounded hover:bg-gray-100 mb-6" onClick={handleAddModuleForm}>
                            + Add Module
                        </button>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {moduleForms.map((form, idx) => (
                            <div key={idx} className="mb-8">
                                <label className="block text-sm font-medium mb-1">Module Name</label>
                                <div className="flex justify-between gap-3 mb-4">
                                    <div className="w-full">
                                        <Select
                                            isClearable
                                            placeholder="Search module..."
                                            value={form.selectedModule}
                                            onInputChange={(inputValue, { action }) => {
                                                if (action === 'input-change') {
                                                    updateForm(idx, { moduleSearchTerm: inputValue });
                                                    if (inputValue) {
                                                        handleModuleSearch(idx, inputValue);
                                                    } else {
                                                        updateForm(idx, { moduleOptions: [], selectedModule: null, moduleId: "", lessionOptions: [], selectedLession: null });
                                                    }
                                                }
                                            }}
                                            onChange={(option) => {
                                                updateForm(idx, {
                                                    selectedModule: option,
                                                    moduleId: option ? option.value : "",
                                                    selectedLession: null,
                                                    lessionOptions: [],
                                                });
                                            }}
                                            options={form.moduleOptions}
                                            isLoading={loading}
                                            noOptionsMessage={() => form.moduleSearchTerm ? 'No modules found' : 'Type to search'}
                                        />
                                        {formErrors[idx]?.module && <p className="text-red-500 text-sm mt-1">{formErrors[idx].module}</p>}
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">Lession 1-1</label>
                                    <Select
                                        isClearable
                                        placeholder={form.moduleId ? "Search lession..." : "Select a module first"}
                                        value={form.selectedLession}
                                        onInputChange={(inputValue, { action }) => {
                                            if (action === 'input-change') {
                                                updateForm(idx, { lessionSearchTerm: inputValue });
                                                if (inputValue && form.moduleId) {
                                                    handleLessionSearch(idx, form.moduleId, inputValue);
                                                } else {
                                                    updateForm(idx, { lessionOptions: [], selectedLession: null });
                                                }
                                            }
                                        }}
                                        onChange={(option) => {
                                            updateForm(idx, { selectedLession: option });
                                        }}
                                        options={form.lessionOptions}
                                        isDisabled={!form.moduleId}
                                        isLoading={loading && !!form.moduleId}
                                        noOptionsMessage={() => form.lessionSearchTerm ? 'No lessions found' : (form.moduleId ? 'Type to search' : 'Select a module first')}
                                    />
                                    {formErrors[idx]?.lession && <p className="text-red-500 text-sm mt-1">{formErrors[idx].lession}</p>}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2">Homework File</label>
                                    <div className="flex flex-col md:flex-row gap-4 mb-1">
                                        <label className="w-full md:w-1/2 border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center bg-blue-50 cursor-pointer hover:border-blue-400">
                                            <input type="file" className="hidden" accept="application/pdf" multiple onChange={(e) => handleFileChange(idx, e)} />
                                            <FaRegImage size={36} className="text-blue-500 mb-2" />
                                            <span className="text-sm text-gray-600">
                                                Drag and Drop PDF files or <span className="text-blue-600 font-medium">Browse</span><br />
                                                <span className="text-xs text-gray-400">PDF only (max 30 MB each)</span>
                                            </span>
                                        </label>
                                        {form.files && form.files.length > 0 && (
                                            <div className="relative flex-1 border rounded-lg p-4">
                                                {form.files.map((file, fileIdx) => (
                                                    <div key={fileIdx} className="mb-4">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <div>
                                                                <p className="font-medium text-sm">{file.name}</p>
                                                                <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                                                            </div>
                                                            <button onClick={() => removeFile(idx, fileIdx)} className="text-gray-500 hover:text-red-600 text-lg" type="button">
                                                                ×
                                                            </button>
                                                        </div>
                                                        <div className="w-full bg-gray-200 h-2 rounded">
                                                            <div className="h-2 bg-blue-800 rounded" style={{ width: `100%` }}></div>
                                                        </div>
                                                        <p className="text-right text-xs text-gray-600 mt-1">100%</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {formErrors[idx]?.files && <p className="text-red-500 text-sm mt-1">{formErrors[idx].files}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Module Duration</label>
                                    <div className="flex justify-start items-center gap-4 mb-4">
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="Enter module duration"
                                                className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={form.module_duration_n}
                                                onChange={e => updateForm(idx, { module_duration_n: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <select
                                                className="w-full border rounded px-4 py-2"
                                                value={form.module_duration}
                                                onChange={e => updateForm(idx, { module_duration: e.target.value })}
                                            >
                                                <option value='week'>Week</option>
                                                <option value='month'>Month</option>
                                                <option value='year'>Year</option>
                                            </select>
                                        </div>
                                    </div>
                                    {formErrors[idx]?.duration && <p className="text-red-500 text-sm mt-1">{formErrors[idx].duration}</p>}
                                </div>
                            </div>
                        ))}
                        <div className="flex justify-end gap-4 mb-6">
                            <button onClick={onBack} className="border border-blue-800 text-blue-800 px-5 py-2 rounded hover:bg-gray-100">
                                Cancel
                            </button>
                            <button type="submit" className="bg-blue-800 text-white px-6 py-2 rounded hover:bg-blue-900">
                                {addCourseStep2loading ? "Publishing please wait..." : "Publish Course →"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
          
          
         
    </>
  );
};

export default AddCourseStep2;
