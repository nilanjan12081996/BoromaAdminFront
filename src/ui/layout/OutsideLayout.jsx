import { Suspense, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { getSubdomain } from "../../Reducer/AuthSlice";
import { DomainReplace } from "../../utils/domainReplace";

const OutsideLayout = () => {
  const token = sessionStorage.getItem("boroma_admin_token");
  const parseToken = token ? JSON.parse(token)?.token : null;
  const nevigate = useNavigate();
  useEffect(() => {
    if (parseToken !== null || parseToken !== null) {
      nevigate("/dashboard");
    }
  }, []);

  return (
    <>
      <Suspense fallback={"loading ..."}>
        <Outlet />
      </Suspense>
    </>
  );
};

export default OutsideLayout;
