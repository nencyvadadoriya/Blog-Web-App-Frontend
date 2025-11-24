import { createBrowserRouter } from "react-router";
import App from "../server";
import LoginPage from "../Pages/Auth/LoginPage";
import RegisterPage from "../Pages/Auth/RegisterPage";
import HomePage from "../Pages/home/HomePage";
import ForgotPassword from "../Pages/Auth/ForgetPasswordPage";
import OtpPage from "../Pages/Auth/OtpPage";
import ChangePasswordPage from "../Pages/Auth/ChangePasswordPage";
 export const routepath = {
    login : '/login',
    register : '/register',
    ForgotPassword : '/forgetpassword',
    verifyOtp : '/verifyOtp',
    changePassowrd : "/changePassword",
    HomePage : '/homepage'
}
export const route= createBrowserRouter([
    {
        path:'/',
        Component:App,
        children:[
            {
                index: true,
                path : routepath.login,
                Component:LoginPage
            }
            ,{
                path: routepath.register,
                Component:RegisterPage
            } ,
            {
                path : routepath.ForgotPassword,
                Component : ForgotPassword
            }
            ,
            {
                path : routepath.verifyOtp,
                Component : OtpPage
            }
            ,
            {
                path : routepath.changePassowrd,
                Component : ChangePasswordPage
            }
            ,
            {
                path:routepath.HomePage,
                Component:HomePage
            } 
        ]
    }
])