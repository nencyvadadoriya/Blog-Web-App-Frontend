import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { routepath } from "../../Routes/route";
import { authService } from "../../services/AuthService";
import type { ChangePasswordPayload } from "../../Types/Types";
import toast from "react-hot-toast";
import { Lock, Eye, EyeOff, Shield, CheckCircle } from "lucide-react";

export default function ChangePasswordPage() {
    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: ""
    });
    const [email, setEmail] = useState<string>("");
    const [error, setError] = useState("");
    const [loader, setLoader] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!location.state.email) {
            navigate(routepath.login, { replace: true });
            return;
        }
        setEmail(location.state.email);
    }, [location.state]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.newPassword || !formData.confirmPassword) {
            setError("All fields are required");
            return;
        }

        if (formData.newPassword.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError("New password and confirm password do not match");
            return;
        }

        try {
            setLoader(true);
            const payload: ChangePasswordPayload = {
                email: email,
                newPassword: formData.newPassword
            };

            const data = await authService.changePassword(payload);

            if (!data.error) {
                toast.success(data.message || "Password updated successfully!");
                setError("");
                navigate(routepath.login, { replace: true });
            } else {
                setError(data.message || "Failed to update password");
                toast.error(data.message || "Failed to update password");
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
            setError("Something went wrong. Please try again.");
        }

        setLoader(false);
    };

    // Password validation checks
    const hasMinLength = formData.newPassword.length >= 6;
    const passwordsMatch = formData.newPassword === formData.confirmPassword && formData.confirmPassword.length > 0;
    const isFormValid = hasMinLength && passwordsMatch;


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
                            <Lock className="w-8 h-8 text-white" />
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900 mb-3">
                            Create New Password
                        </h1>

                        <p className="text-gray-600">
                            Your new password must be different from previously used passwords
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Error Message */}
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <p className="text-red-800 font-medium text-sm">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* New Password Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                New Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                                </div>
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    placeholder="Enter your new password"
                                    className="w-full pl-10 pr-10 py-3.5 border border-gray-300 rounded-xl 
                                    focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 
                                    placeholder-gray-400 transition-all duration-200 bg-white/80 shadow-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showNewPassword ? (
                                        <Eye className="w-5 h-5 text-gray-400 hover:text-purple-600 transition-colors" />
                                    ) : (
                                        <EyeOff className="w-5 h-5 text-gray-400 hover:text-purple-600 transition-colors" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                                </div>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm your new password"
                                    className="w-full pl-10 pr-10 py-3.5 border border-gray-300 rounded-xl 
                                    focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 
                                    placeholder-gray-400 transition-all duration-200 bg-white/80 shadow-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="w-5 h-5 text-gray-400 hover:text-purple-600 transition-colors" />
                                    ) : (
                                        <Eye className="w-5 h-5 text-gray-400 hover:text-purple-600 transition-colors" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Password Requirements */}
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <h4 className="text-sm font-medium text-gray-700 mb-3">Password Requirements</h4>
                            <div className="space-y-2 text-sm">
                                <div className={`flex items-center gap-2 ${hasMinLength ? 'text-green-600' : 'text-gray-500'}`}>
                                    {hasMinLength ? (
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                    ) : (
                                        <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                                    )}
                                    At least 6 characters
                                </div>
                                <div className={`flex items-center gap-2 ${passwordsMatch ? 'text-green-600' : 'text-gray-500'}`}>
                                    {passwordsMatch ? (
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                    ) : (
                                        <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                                    )}
                                    Passwords match
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loader || !isFormValid}
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
                                    <span>Updating Password...</span>
                                </div>
                            ) : (
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    <Lock className="w-4 h-4" />
                                    Update Password
                                </span>
                            )}
                        </button>
                    </form>

                    {/* Security Note */}
                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                            <Shield className="w-3 h-3" />
                            Your password is encrypted and securely stored
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