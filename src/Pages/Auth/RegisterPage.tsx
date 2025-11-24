import { useState } from 'react';
import { User, Mail, Lock, BookOpen, Camera } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import type { RegisterUserBody } from '../../Types/Types';
import toast from 'react-hot-toast';
import { authService } from '../../services/AuthService';
import { routepath } from '../../Routes/route';

const RegisterPage = () => {
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loader, setLoader] = useState<boolean>(false)
  const [formData, setFormData] = useState<RegisterUserBody>({ name: "", email: "", password: "", gender: "", about: "", profile_image: null })
  const navigat = useNavigate();


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, profile_image: file }));
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmitFormData = async (e: any) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.gender || !formData.about || !profileImage) {
      toast.error("Please fill all details");
      return;
    }

    setLoader(true);

    const data = await authService.registerUser(formData);
    if (data && !data.error) {
      toast.success(data.msg);
      navigat(routepath.login);
    } else {
      toast.error(data?.msg || "Registration failed");
    }

    setLoader(false);
  };
  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gray-100 font-sans">
      <div className="w-full min-h-screen flex flex-col md:flex-row shadow-2xl rounded-2xl">

        {/* LEFT PANEL */}
        <div
          className="relative w-full md:w-1/2 min-h-screen flex flex-col justify-center text-white px-10 py-12"
          style={{
            backgroundImage: `
          linear-gradient(rgba(6, 70, 247, 0.85), rgba(6, 70, 247, 0.85)),
          url('https://cdn.dribbble.com/users/1162077/screenshots/4649464/media/7ed33c54e8f17c4e05f9d5dbf7e5c8a5.png?compress=1&resize=1200x900')
        `,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-16 left-10 w-48 h-48 bg-blue-300/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-16 right-10 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 text-center md:text-left space-y-6">
            <div className="flex items-center justify-center md:justify-start mb-4">
              <BookOpen className="w-10 h-10 text-white mr-3" />
              <span className="text-3xl font-extrabold tracking-widest">BlogSphere</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight drop-shadow-lg">
              Where Ideas Take Flight
            </h1>

            <p className="text-blue-100 text-lg font-light max-w-md">
              Transform your thoughts into stories. Connect, inspire, and be part of a vibrant community of writers.
            </p>

            <p className="text-sm text-blue-200 italic pt-2">
              "Every great story begins with a single word."
            </p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="p-8 bg-white w-full md:w-1/2 min-h-screen flex flex-col justify-center overflow-y-auto">
          <form className="space-y-6 max-w-md w-full mx-auto" onSubmit={handleSubmitFormData}>

            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
              Create Your Account
            </h2>

            {/* Profile Image Upload */}
            <div className="flex flex-col items-center mb-4">
              <label className="relative w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors overflow-hidden">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Profile Preview"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <Camera className="w-8 h-8 text-gray-400 mb-1" />
                    <span className="text-xs text-gray-500">Add Photo</span>
                  </div>
                )}

                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>

              <p className="text-xs text-gray-500 mt-2 text-center">
                Upload a profile picture
              </p>
            </div>

            {/* Name */}
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">FULL NAME</label>
              <div className="flex items-center border border-gray-300 rounded-lg p-2 shadow-sm">
                <User className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full outline-none text-sm"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* About */}
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">ABOUT</label>
              <textarea
                name="about"
                rows={3}
                value={formData.about}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm resize-none shadow-sm"
                placeholder="Tell us something about yourself..."
              ></textarea>
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">EMAIL ADDRESS</label>
              <div className="flex items-center border border-gray-300 rounded-lg p-2 shadow-sm">
                <Mail className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full outline-none text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">PASSWORD</label>
              <div className="flex items-center border border-gray-300 rounded-lg p-2 shadow-sm">
                <Lock className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full outline-none text-sm"
                  placeholder="Min. 8 characters"
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">GENDER</label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="gender" value="male"
                    checked={formData.gender === "male"} onChange={handleChange} />
                  <span className="text-sm">Male</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="gender" value="female"
                    checked={formData.gender === "female"} onChange={handleChange} />
                  <span className="text-sm">Female</span>
                </label>
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loader}
              className="w-full p-3 text-white font-bold rounded-lg bg-blue-600 shadow-md hover:bg-blue-700 transition"
            >
              Sign Up
            </button>

            {loader && (
              <div className="flex justify-center items-center gap-2">
                <div className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Creating account...</span>
              </div>
            )}

            <div className="text-center">
              <p className="text-xs text-gray-600">
                Already have an account?{' '}
                <Link to={routepath.login} className="text-blue-600 font-bold">
                  Login
                </Link>
              </p>
            </div>

          </form>
        </div>
      </div>
    </div>

  );
};

export default RegisterPage;
