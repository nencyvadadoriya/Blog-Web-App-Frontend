import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { routepath } from "../../Routes/route";
import { authService } from "../../services/AuthService";
import type { OtpverifyPayload } from "../../Types/Types";
import toast from "react-hot-toast";
import { Mail, Clock } from "lucide-react";

export default function OtpPage() {
    const [email, setEmail] = useState<string>("");
    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
    const [timer, setTimer] = useState<number>(120);
    const [error, setError] = useState<string>("");
    const [loader, setLoader] = useState<boolean>(false);
    const [resetLoader, setresetLoader] = useState<boolean>(false);

    const inputRefs = useRef<HTMLInputElement[]>([]);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!location.state || !location.state.email) {
            navigate(routepath.login, { replace: true });
            return;
        }
        setEmail(location.state.email);
    }, [location.state]);

    useEffect(() => {
        if (timer <= 0) return;

        const t = setInterval(() => {
            setTimer(prev => prev - 1);
        }, 1000);

        return () => clearInterval(t);
    }, [timer]);

    const formatTimer = (sec: number) => {
        const mins = Math.floor(sec / 60);
        const secs = sec % 60;
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const copy = [...otp];
        copy[index] = value;
        setOtp(copy);
        setError("");

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").slice(0, 6);

        if (!/^\d+$/.test(pasted)) return;

        const digits = pasted.split("");
        setOtp(digits);
        inputRefs.current[Math.min(digits.length, 5)]?.focus();
    };

    const handleResend = async (e: any) => {
        e.preventDefault();
        try {
            setresetLoader(true);
            const data = await authService.forgetPassword({ email });
            if (!data.error) {
                toast.success(data.msg);
                setTimer(10);
                setError("");
            } else {
                setError(data.msg);
            }
        } catch (error) {
            console.log("Something went wrong");
        }
        setresetLoader(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const otpString = otp.join("");

        if (otpString.length !== 6) {
            setError("Please enter a valid 6-digit OTP");
            return;
        }

        const payload: OtpverifyPayload = {
            email: email,
            OTP: otpString
        };

        try {
            setLoader(true);
            const data = await authService.otpVerify(payload);

            if (!data.error) {
                toast.success(data.msg || "OTP verified successfully");
                navigate(routepath.changePassowrd, {
                    replace: true,
                    state: { email }
                });
            } else {
                setError(data.msg || "Invalid OTP");
                toast.error(data.msg || "Invalid OTP");
            }
        } catch (error) {
            toast.error("Something went wrong. Try again!");
        }
        setLoader(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-blue-50 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-10 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

            <div className="w-full max-w-md relative z-10">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/50">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <Mail className="w-8 h-8 text-white" />
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900 mb-3">
                            Verify Your Email
                        </h1>

                        <p className="text-gray-600 mb-2">
                            We sent a 6-digit code to your email
                        </p>

                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                            <Mail className="w-4 h-4" />
                            <span className="font-medium">{email}</span>
                        </div>
                    </div>

                    {/* OTP Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* OTP Inputs */}
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700 text-center">
                                Enter verification code
                            </label>

                            <div className="flex justify-center gap-3">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        value={digit}
                                        ref={(el) => {
                                            if (el) inputRefs.current[index] = el;
                                        }}
                                        type="text"
                                        maxLength={1}
                                        inputMode="numeric"
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onPaste={index === 0 ? handlePaste : undefined}
                                        className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-300 
                                        rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 
                                        focus:outline-none transition-all duration-200 bg-white shadow-sm
                                        hover:border-gray-400"
                                    />
                                ))}
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="text-center">
                                    <p className="text-red-600 text-sm flex items-center justify-center gap-2">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                        {error}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Timer and Resend */}
                        <div className="text-center space-y-4">
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                                <Clock className="w-4 h-4" />
                                <span>Code expires in 2 minitus</span>
                            </div>

                            <div className="text-sm">
                                {timer === 0 ? (
                                    <button
                                        type="button"
                                        onClick={handleResend}
                                        disabled={resetLoader}
                                        className="text-purple-600 hover:text-purple-700 font-semibold transition-colors duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {resetLoader ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                                                <span>Resending OTP...</span>
                                            </div>
                                        ) : (
                                            <span className="flex items-center gap-1">
                                                Resend OTP
                                                <span className="inline-block ml-1 group-hover:translate-x-0.5 transition-transform">→</span>
                                            </span>
                                        )}
                                    </button>
                                ) : (
                                    <p className="text-gray-500">
                                        Didn't receive the code?{" "}
                                        <span className="text-gray-400">Resend in {formatTimer(timer)}</span>
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loader}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 
                                text-white font-semibold py-3.5 rounded-xl transition-all duration-300 shadow-lg 
                                hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] 
                                disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none
                                disabled:hover:shadow-lg relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                            {loader ? (
                                <div className="flex items-center justify-center gap-2 relative z-10">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Verifying...</span>
                                </div>
                            ) : (
                                <span className="relative z-10">Verify & Continue</span>
                            )}
                        </button>
                    </form>

                    {/* Help Text */}
                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-500">
                            Can't find the email? Check your spam folder or{" "}
                            <button
                                type="button"
                                onClick={() => navigate(routepath.ForgotPassword)}
                                className="text-purple-600 hover:text-purple-700 font-medium"
                            >
                                try another email
                            </button>
                        </p>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
}