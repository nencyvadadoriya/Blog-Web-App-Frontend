import { EyeOff, Mail, Lock, BookOpen, Eye } from "lucide-react";
import img1 from "../../img1.jpg";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import type { LoginBody } from "../../Types/Types";
import toast from "react-hot-toast";
import { authService } from "../../services/AuthService";
import { routepath } from "../../Routes/route";

export default function LoginPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);
  const handleLoginWithGoogle={

  }
  const [loginData, setLoginData] = useState<LoginBody>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [loginFailed, setLoginFailed] = useState<string>("")
  const [loader, setLoader] = useState<boolean>(false)

  const validate = () => {
    let valid = true;
    let newErrors: any = { email: "", password: "" };

    // Email validation
    if (!loginData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      newErrors.email = "Invalid email address";
      valid = false;
    }

    // Password validation
    if (!loginData.password.trim()) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (loginData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    if (loginFailed) setLoginFailed("");
  };

  // Handle form submit
  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (!validate()) {
      toast.error("Please fill the all fields");
      return;
    }
    console.log("Login Data:", loginData);
    if (loginData.email && loginData.password) {
      setLoader(true)
      const data = await authService.loginUser(loginData)
      if (!data.error) {
        toast.success(data.msg)
        localStorage.setItem('token', data.result.token)
        navigate(routepath.HomePage, { replace: true })
      } else {
        setLoginFailed(data.msg)
      }
    }
    setLoader(false)
    setLoginData({ email: "", password: "" })

  };

  return (
    <div className="w-full h-screen flex font-sans overflow-hidden bg-gray-100">
      {/* Left Side (Login Form) */}
      <div className="w-full lg:w-1/2 h-full bg-white flex items-center justify-center p-6 lg:p-12">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <BookOpen className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="text-xl font-bold text-gray-800 tracking-tight">
              BlogSphere
            </span>
          </div>

          <h1 className="text-2xl font-extrabold text-gray-900 mb-4">
            Login in to your Account
          </h1>
          <p className="text-gray-500 mb-6 text-sm">
            Welcome back! Select method to log in
          </p>
          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button className="flex items-center justify-center gap-2 px-3 py-2 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-xs">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 px-3 py-2 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-xs">
              <svg className="w-4 h-4" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
              or continue with email
            </span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* FORM START */}
          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            {/* Login Failed Message */}
            {loginFailed && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-red-800 font-medium text-sm">Login failed {loginFailed}</p>
                  </div>
                </div>
              </div>
            )}
            <div className="mb-5 relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleChange}
                placeholder="Email"
                className={`w-full pl-10 pr-3 py-2 border-2 rounded-xl 
                focus:border-blue-600 outline-none text-gray-700 text-sm
                ${errors.email ? "border-red-500" : "border-gray-200"}`}
              />
            </div>

            {errors.email && (
              <p className="text-red-500 text-xs mb-3">{errors.email}</p>
            )}

            {/* Password Field */}
            <div className="mb-5 relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={loginData.password}
                onChange={handleChange}
                placeholder="Password"
                className={`w-full pl-10 pr-10 py-2 border-2 rounded-xl 
                focus:border-blue-600 outline-none text-gray-700 text-sm
                ${errors.password ? "border-red-500" : "border-gray-200"}`}
              />

              {showPassword ? (
                <Eye onClick={() => setShowPassword(false)} className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer" />
              ) : (
                <EyeOff onClick={() => setShowPassword(true)} className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer" />
              )}
            </div>

            {errors.password && (
              <p className="text-red-500 text-xs mb-4">{errors.password}</p>
            )}

            {/* Forgot Password */}
            <div className="flex justify-end -mt-2 mb-4">
              <Link
                to={routepath.ForgotPassword}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-all"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button with Custom Loader */}

            <button
              type="submit"
              disabled={loader}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 
                  text-white font-semibold py-3.5 rounded-xl transition-all duration-300 shadow-lg 
                  hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] 
                  disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none
                  disabled:hover:shadow-lg relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              {loader ? (
                <div className="flex items-center justify-center gap-2 relative z-10">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending Instructions...</span>
                </div>
              ) : (
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Login
                </span>
              )}
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center text-gray-600 text-xs mt-2">
            Don't have an account?{" "}
            <Link
              to={routepath.register}
              className="text-blue-600 hover:text-blue-700 font-bold transition-colors"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="hidden lg:flex w-1/2 h-full bg-[#1E6FFB] items-center justify-center relative overflow-hidden">
        <img
          src={img1}
          alt="Dashboard illustration"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

