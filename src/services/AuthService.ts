import axios from "axios";
import type { ChangePasswordPayload, LoginBody, OtpverifyPayload, RegisterUserBody } from "../Types/Types";
import toast from "react-hot-toast";
class AuthServices {
    authBaseUrl = "https://blog-web-app-iota.vercel.app/api/";
    authLoginUrl = "auth/login";
    authRegigsterUrl = "auth/register";
    authForgetPassword = "auth/forgetPassword";
    authVerifyOtp = "auth/verifyOtp";
    authChangePassword = "auth/changePassword";

    async loginUser(payload: LoginBody) {
        try {
            const res = await axios.post(this.authBaseUrl + this.authLoginUrl, payload)
            return res.data;
        } catch (error) {
            console.log("login error", error);
        }

    }

    async registerUser(payload: RegisterUserBody) {
        try {
            const formData = new FormData();

            formData.append('name', payload.name);
            formData.append('email', payload.email);
            formData.append('about', payload.about);
            formData.append('password', payload.password);
            formData.append('gender', payload.gender);
            if (payload.profile_image != null) {
                formData.append('profile_image', payload.profile_image);
            }
            const res = await axios.post(this.authBaseUrl + this.authRegigsterUrl, formData);
            console.log(res);
            return res.data;
        } catch (error) {
            console.log("register error", error);
        }
    }
    getAuthToken() {
        return localStorage.getItem('token')
    }
    async forgetPassword(payload: any) {
        try {
            const res = await axios.post(this.authBaseUrl + this.authForgetPassword, payload)
            return res.data;
        } catch (error) {
            toast.error("somthing went wrong")
            console.log("register error", error);
        }
    }
    async otpVerify(payload: OtpverifyPayload) {
        try {
            const res = await axios.post(this.authBaseUrl + this.authVerifyOtp, payload)
            return res.data;
        } catch (error) {
            console.log("somthing went wrong");
            
        }
    }

    async changePassword(payload : ChangePasswordPayload){
         try {
            const res = await axios.post(this.authBaseUrl + this.authChangePassword, payload)
            return res.data;
        } catch (error) {
            console.log("somthing went wrong");
            
        }
    }
}

export const authService = new AuthServices();