import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { UrlState } from "@/Context";
import { BarLoader } from "react-spinners";

function RequireAuth({ children }) {
  const navigate = useNavigate();
  const { loading, isAuthenticated } = UrlState();

  useEffect(() => {
    if (!isAuthenticated && loading === false) navigate("/auth");
  }, [isAuthenticated, loading]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <BarLoader width={"100%"} color="#36d7b7" />
      </div>
    );
  if (isAuthenticated) return children;
  return null; // explicit fallback to avoid rendering undefined
}

export default RequireAuth;
