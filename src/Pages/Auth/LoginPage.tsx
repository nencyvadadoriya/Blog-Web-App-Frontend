import { EyeOff, Mail, Lock, BookOpen, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import type { LoginBody } from "../../Types/Types";
import toast from "react-hot-toast";
import { authService } from "../../services/AuthService";
import { routepath } from "../../Routes/route";
import { getAuth, GoogleAuthProvider, signInWithPopup, GithubAuthProvider } from "firebase/auth";
import { app } from "../../firebase/firebase";

export default function LoginPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);
  const auth = getAuth(app);
  const googleAuthProvider = new GoogleAuthProvider();
  googleAuthProvider.setCustomParameters({ prompt: 'select_account' });
  const githubAuthProvider = new GithubAuthProvider();
  githubAuthProvider.setCustomParameters({ prompt: 'select_account' });
  const handleLoginWithGoogle = async (event: any) => {
    event.preventDefault();
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential!.accessToken;
      localStorage.setItem('token', token!);
      const googleUser = result.user;
      localStorage.setItem(
        'user',
        JSON.stringify({
          name: googleUser.displayName || '',
          email: googleUser.email || '',
          profile_image: googleUser.photoURL || ''
        })
      );
      navigate(routepath.HomePage, { replace: true });
    } catch (error: any) {
      if (error.code === "auth/account-exists-with-different-credential") {
        alert("This email is already used with GitHub login. Please login with GitHub instead.");
      } else if (error.code === "auth/popup-blocked") {
        alert("Popup was blocked. Please allow popups for this site.");
      } else {
        console.log("Google Error Code : ", error.code);
        toast.error(error.message);
      }
    }
  }
  const handleLoginWithGithub = async (event: any) => {
    event.preventDefault();
    try {
      const result = await signInWithPopup(auth, githubAuthProvider);
      const credential = GithubAuthProvider.credentialFromResult(result);
      const token = credential!.accessToken;
      localStorage.setItem('token', token!);
      const githubUser = result.user;
      localStorage.setItem(
        'user',
        JSON.stringify({
          name: githubUser.displayName || '',
          email: githubUser.email || '',
          profile_image: githubUser.photoURL || ''
        })
      );
      navigate(routepath.HomePage, { replace: true });
    } catch (error: any) {
      if (error.code === "auth/account-exists-with-different-credential") {
        alert("This email is already used with Google login. Please login with Google instead.");
      } else if (error.code === "auth/popup-blocked") {
        alert("Popup was blocked. Please allow popups for this site.");
      } else {
        console.log("GitHub Error Code : ", error.code);
        toast.error(error.message);
      }
    }
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
      const data: any = await authService.loginUser(loginData)
      if (!data) {
        const msg = "Something went wrong. Please try again later.";
        setLoginFailed(msg);
        toast.error(msg);
        setLoader(false)
        return;
      }

      if (!data.error) {
        toast.success(data.msg)
        localStorage.setItem('token', data.result.token)
        try {
          const payloadUser = (data as any)?.result?.user || (data as any)?.result?.result || (data as any)?.result;
          const _id = String(payloadUser?._id || payloadUser?.id || '');
          const email = String(payloadUser?.email || loginData.email || '');
          const name = String(payloadUser?.name || '');
          const profile_image = String(payloadUser?.profile_image || '');
          if (email) {
            localStorage.setItem(
              'user',
              JSON.stringify({
                _id,
                name,
                email,
                profile_image
              })
            );
          }
        } catch {
        }
        navigate(routepath.HomePage, { replace: true })
        setLoader(false)
        setLoginData({ email: "", password: "" })
        return;
      } else {
        setLoginFailed(data.msg)
        toast.error(data.msg)
      }
    }
    setLoader(false)

  };

  return (
    <div className="w-full h-screen flex font-sans overflow-hidden bg-gray-100">
      {/* Left Side (Login Form) */}
      <div className="w-full  h-full bg-white flex items-center justify-center p-6 lg:p-12">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 bg-[#0077b6] rounded-lg flex items-center justify-center shadow-md">
              <BookOpen className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="text-xl font-bold text-[#1e4b7a] tracking-tight">
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
            <button
              onClick={handleLoginWithGoogle}
              className="flex items-center justify-center gap-2 px-3 py-2 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:border-[#0077b6] hover:bg-[#f0f7ff] transition-all duration-200 text-xs"
            >
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

            <button
              onClick={handleLoginWithGithub}
              className="flex items-center justify-center gap-2 px-3 py-2 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:border-[#0077b6] hover:bg-[#f0f7ff] transition-all duration-200 text-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
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
                focus:border-[#0077b6] outline-none text-gray-700 text-sm
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
                focus:border-[#0077b6] outline-none text-gray-700 text-sm
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
                className="text-sm font-semibold text-[#0077b6] hover:text-[#005a8c] transition-all"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button with Custom Loader */}
            <button
              type="submit"
              disabled={loader}
              className="w-full bg-[#0077b6] hover:bg-[#005a8c] text-white font-semibold py-3.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              {loader ? (
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Login
                </span>
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
              className="text-[#0077b6] hover:text-[#005a8c] font-bold transition-colors"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>



      {/* Add animation styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}