import { createBrowserRouter } from "react-router";
import App from "../server";
import LoginPage from "../Pages/Auth/LoginPage.tsx";
import RegisterPage from "../Pages/Auth/RegisterPage.tsx";
import HomePage from "../Pages/home/HomePage.tsx";
import ForgotPassword from "../Pages/Auth/ForgetPasswordPage.tsx";
import OtpPage from "../Pages/Auth/OtpPage.tsx";
import ChangePasswordPage from "../Pages/Auth/ChangePasswordPage.tsx";
import EditBlog from "../Pages/EditBlog/EditBlog.tsx";
import LandingPage from "../Pages/Landing/LandingPage.tsx";
import AddBlog from "../Pages/AddBlog/AddBlog.tsx";
import MyBlogs from "../Pages/MyBlogs/MyBlogs.tsx";
import BlogDetails from "../Pages/BlogDetails/BlogDetails.tsx";
import Saved from "../Pages/Saved/Saved.tsx";
import People from "../Pages/People/People.tsx";
import ProfilePage from "../Pages/Profile/ProfilePage.tsx";
import UserProfileView from "../Pages/UserProfile/UserProfileView.tsx";
import InDetailsUserProfileView from "../Pages/UserProfile/InDetailsUserProfileView.tsx";

export const routepath = {
    landing: '/',
    login: '/login',
    register: '/register',
    ForgotPassword: '/forgetpassword',
    verifyOtp: '/verifyOtp',
    changePassowrd: "/changePassword",
    HomePage: '/homepage',
    addBlog: '/addblog',
    editBlog: '/editblog',
    myBlogs: '/myblogs',
    blogDetails: '/blog',
    saved: '/saved',
    people: '/people',
    profile: '/profile',
    userProfile: '/user'
}

export const route = createBrowserRouter([
    {
        path: '/',
        Component: App,

        children: [
            {
                index: true,
                Component: LandingPage
            },
            {
                path: routepath.login,
                Component: LoginPage
            }
            , {
                path: routepath.register,
                Component: RegisterPage
            },
            {
                path: routepath.ForgotPassword,
                Component: ForgotPassword
            }
            ,
            {
                path: routepath.verifyOtp,
                Component: OtpPage
            }
            ,
            {
                path: routepath.changePassowrd,
                Component: ChangePasswordPage
            }
            ,
            {
                path: routepath.addBlog,
                Component: AddBlog
            } 
            ,
            {
                path: routepath.HomePage,
                Component: HomePage
            },
            {
                path: routepath.editBlog + '/:blogId',
                Component: EditBlog
            },
            {
                path: routepath.myBlogs,
                Component: MyBlogs
            },
            {
                path: routepath.blogDetails + '/:blogId',
                Component: BlogDetails
            },
            {
                path: routepath.saved,
                Component: Saved
            },
            {
                path: routepath.people,
                Component: People
            },
            {
                path: routepath.userProfile + '/:userId/details',
                Component: InDetailsUserProfileView
            },
            {
                path: routepath.userProfile + '/:userId',
                Component: UserProfileView
            },
            {
                path: routepath.profile,
                Component: ProfilePage
            }
        ]
    }   
])