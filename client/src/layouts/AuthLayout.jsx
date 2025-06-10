import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div 
      className="
        w-full min-h-screen h-full 
        bg-linear-to-br from-(--primary-color) to-(--accent-color)
        flex items-center justify-center
        p-[20px]
      "
    >
      <Outlet />
    </div>
  );
}