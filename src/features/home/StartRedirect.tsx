import { Navigate } from "react-router-dom";
import { useHomeVisible } from "./steps";

/**
 * Where signing in lands: Home while there is setup left or no first task yet, the
 * dashboard after that.
 */
export function StartRedirect() {
  const { visible, loading } = useHomeVisible();
  if (loading) return <div className="skeleton h-40 w-full rounded-[20px]" aria-busy="true" />;
  return <Navigate to={visible ? "/home" : "/dashboard"} replace />;
}
