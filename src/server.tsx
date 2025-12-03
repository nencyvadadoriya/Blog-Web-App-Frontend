import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Outlet, useNavigate } from "react-router";
import { authService } from "./services/AuthService";
import { routepath } from "./Routes/route";
import TypingAnimtion from "./Pages/TypingAnimtion/TypingAnimtion";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Splash screen 2 second ke liye show karein
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
      
      // Splash ke bad navigation handle karein
      if (authService.getAuthToken()) {
        navigate(routepath.HomePage, { replace: true });
      } else {
        navigate(routepath.login, { replace: true });
      }
    }, 2000);

    return () => clearTimeout(splashTimer);
  }, [navigate]);

  // Agar splash screen show ho raha hai
  if (showSplash) {
    return <TypingAnimtion/>;
  }

  return (
    <>
      <Outlet />
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
    </>
  );
}