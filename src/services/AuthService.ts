import axios from "axios";
import type { ChangePasswordPayload, LoginBody, OtpverifyPayload, RegisterUserBody } from "../Types/Types";
import toast from "react-hot-toast";

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || "https://blog-web-app-iota.vercel.app/api/";

class AuthServices {
    authBaseUrl = API_BASE_URL;
    authLoginUrl = "auth/login";
    authRegigsterUrl = "auth/register";
    authForgetPassword = "auth/forgetPassword";
    authVerifyOtp = "auth/verifyOtp";
    authChangePassword = "auth/changePassword";
    authAddBlog = "blog/addBlog";

    async loginUser(payload: LoginBody) {
        try {
            const res = await axios.post(this.authBaseUrl + this.authLoginUrl, payload)
            return res.data;
        } catch (error) {
            console.log("login error", error);
            if (axios.isAxiosError(error)) {
                const msg = (error.response?.data as any)?.msg || (error.response?.data as any)?.message || error.message;
                return { error: true, msg: msg || "Something went wrong. Please try again later." };
            }
            return { error: true, msg: "Something went wrong. Please try again later." };
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
            if (axios.isAxiosError(error)) {
                const msg = (error.response?.data as any)?.msg || (error.response?.data as any)?.message || error.message;
                return { error: true, msg: msg || "Something went wrong. Please try again later." };
            }
            return { error: true, msg: "Something went wrong. Please try again later." };
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
    
    async addBlog(payload : any){
        try {
            const formData = new FormData();
            for (const key in payload) {
                formData.append(key, payload[key]);
            }
            const res = await axios.post(this.authBaseUrl + this.authAddBlog, formData);
            return res.data;
        } catch (error) {
            console.log("add blog error", error);
        }
    }

}

export const authService = new AuthServices();