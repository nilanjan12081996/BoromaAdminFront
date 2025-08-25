import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { geneatePass } from "../../Reducer/CoachSlice";
import { toast, ToastContainer } from "react-toastify";
import { Base64 } from "js-base64";

const CoachGeneratePassword = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const token = useParams();
  console.log("token", token);

  // Fix: Parse the decoded token as JSON
  let user, time;
  try {
    const decodeToken = JSON.parse(Base64.decode(token?.token));
    console.log("decodeToken", decodeToken);
    user = decodeToken?.user;
    time = decodeToken?.time;

    // Debug logs
    console.log("user:", user);
    console.log("time:", time);
  } catch (error) {
    console.error("Error decoding token:", error);
    toast.error("Invalid token");
    return <div>Invalid token</div>;
  }

  const password = watch("password");

  const onSubmit = (data) => {
    const payload = { ...data, coach_id: user, timestamp: time };
    console.log("payload being sent:", payload);

    dispatch(geneatePass(payload)).then((res) => {
      console.log("res", res);
      if (res?.payload?.response?.data?.status_code === 400) {
        toast.error(res?.payload?.response?.data?.message);
      } else if (res?.payload?.status_code === 200) {
        toast.success(res?.payload?.message);
      }
    });
  };

  return (
    <>
      <ToastContainer />
      <div className="my-0 md:my-16 lg:my-0 mx-4 lg:mx-0 flex justify-center items-center h-screen">
        <div className="w-full max-w-lg my-0 mx-auto">
          <div className="text-center mb-4">
            {/* <img className="inline-block w-44" src={forgotPasswordIcon} /> */}
          </div>
          <h1 className="text-[40px] text-center leading-[40px] text-[#009BF2] pb-5">
            Generate Password
          </h1>
          {/* <p className="text-base md:text-lg text-blue-900 font-medium text-center pb-8">
            No worries, we got you covered.
          </p> */}
          <div className="login_area">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-6">
                <input
                  type="password"
                  id="password1"
                  className="bg-white border border-[#009BF2] text-[#888888] text-base rounded-xl focus:ring-[#009BF2] focus:border-[#009BF2] block w-full py-4 px-3"
                  placeholder="Enter New Password"
                  {...register("password", { required: true })}
                />
              </div>
              {errors.password && (
                <span className="text-red-500">New Password is Required</span>
              )}
              <div className="mb-6">
                <input
                  type="password"
                  id="password2"
                  className="bg-white border border-[#009BF2] text-[#888888] text-base rounded-xl focus:ring-[#009BF2] focus:border-[#009BF2] block w-full py-4 px-3"
                  placeholder="Confirm Password"
                  {...register("confirm_password", {
                    required: true,
                    validate: (value) =>
                      value === password || "Password do not Match",
                  })}
                />
                {errors?.confirm_password && (
                  <h6 className="text-red-600">
                    {errors.confirm_password.message}
                  </h6>
                )}
              </div>
              <button
                type="submit"
                className="text-white bg-[#009BF2] font-Manrope font-extrabold text-[23px] mb-2 hover:bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-xl text-xl w-full px-5 py-3.5 text-center"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CoachGeneratePassword;
