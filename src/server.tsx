import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Outlet, useNavigate } from "react-router";
import { authService } from "./services/AuthService";
import { routepath } from "./Routes/route";
export default function App() {
  const navigate = useNavigate()
  useEffect( ()=>{
    if(authService.getAuthToken()){
        navigate(routepath.HomePage , {replace : true})
    }else{
      navigate(routepath.login , {replace : true})
    } 
  },[])
  return (
    <>
      <Outlet />
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
    </>
  )
}
