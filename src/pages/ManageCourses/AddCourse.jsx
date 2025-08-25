import { ToastContainer } from "react-toastify";
import AddCourseStep1 from "./AddCourseStep1";
import AddCourseStep2 from "./AddCourseStep2";
import { useState } from "react";


const AddCourse = () => {
    const [step, setStep] = useState(1);
    const [levelId, setLevelId] = useState();
    const [courseId, setCourseId] = useState();

    return (
        <>
            <ToastContainer />

            {step === 1 && <AddCourseStep1 onNext={() => setStep(2)} setLevelId={setLevelId} level_id={levelId} setCourseId={setCourseId} course_id={courseId}/>}
            {step === 2 && <AddCourseStep2 onBack={() => setStep(1)} levelId={levelId} course_id={courseId}/>}

        </>
    )
};

export default AddCourse;