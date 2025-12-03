import { useState } from "react";
import { authService } from "../../services/AuthService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { routepath } from "../../Routes/route";

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loader, setLoader] = useState<boolean>(false);
  const navigate = useNavigate();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Required check
    if (!email) {
      setError("Email is required");
      return;
    }

    // Format check
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    try {
      setLoader(true);
      const data = await authService.forgetPassword({ email });
      if (!data.error) {
        toast.success(data.msg);
        setError("");
        navigate(routepath.verifyOtp, {
          replace: true,
          state: { email: email },
        });
      } else {
        setError(data.msg);
      }
      setLoader(false);
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-200 rounded-full opacity-30 blur-xl"></div>
      <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-indigo-300 rounded-full opacity-40 blur-lg"></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-white/50">
          {/* Header section with gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-7 h-7"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">
              Reset Your Password
            </h2>
            <p className="text-blue-100 text-center text-sm">
              Enter your email and we'll send you instructions to reset your password
            </p>
          </div>

          {/* Form section */}
          <div className="p-8">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl 
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                      placeholder-gray-400 transition-all duration-200 bg-white/50"
                  />
                </div>

                {/* Error show */}
                {error && (
                  <div className="flex items-center mt-2 text-red-600 text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {error}
                  </div>
                )}
              </div>

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
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Send Otp
                  </span>
                )}
              </button>
            </form>

            {/* Back to login link */}
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate(-1)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center gap-1 mx-auto transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Login
              </button>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Can't access your email? Contact our support team</p>
        </div>
      </div>
    </div>
  );
}