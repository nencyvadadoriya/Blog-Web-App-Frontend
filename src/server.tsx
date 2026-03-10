import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router";

export default function App() {
  return (
    <>
      <Outlet />
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
    </>
  );
}