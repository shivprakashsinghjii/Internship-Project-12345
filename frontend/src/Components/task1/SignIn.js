import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import "bootstrap/dist/css/bootstrap.min.css";
import { sentOtpFunction } from "../../services/Apis";
import { auth, provider } from "./firebase.config";
import "react-toastify/dist/ReactToastify.css";

import Image from "../../Assets/Log_in.png";
import { ToastContainer, toast } from "react-toastify";

import Spinner from "react-bootstrap/Spinner";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [spinner, setSpinner] = useState(false);
  const navigate = useNavigate();

  const isMicrosoftBrowser = () => {
    const userAgent = window.navigator.userAgent;
    return /Edge|MSIE|Trident/.test(userAgent);
  };

  const sendOtp = async (e) => {
    e.preventDefault();

    if (email === "") {
      toast.error("Enter Your Email!");
      return;
    } else if (!email.includes("@")) {
      toast.error("Enter a Valid Email!");
      return;
    }

    setSpinner(true);
    const data = { email };
    try {
      const response = await sentOtpFunction(data);
      if (response.status === 200) {
        setSpinner(false);
        navigate("/otp", { state: email });
      } else {
        setSpinner(false);
        toast.error(response.response.data.error);
      }
    } catch (error) {
      setSpinner(false);
      console.error("Error sending OTP:", error);
      toast.error("Failed to send OTP. Please try again later.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      localStorage.setItem("email", result.user.email);
      navigate("/home");
    } catch (error) {
      console.error("Error signing in with Google:", error);
      toast.error("Failed to sign in with Google. Please try again later.");
    }
  };

  useEffect(() => {
    if (isMicrosoftBrowser()) {
      navigate("/home");
    } else {
      const storedEmail = localStorage.getItem("email");
      if (storedEmail) {
        navigate("/home");
      }
    }
  }, [navigate]);

  return (
    <div className=" items-center justify-center bg-gray-100 h-screen flex px-4">
      <div className=" flex-col flex md:flex-row w-full max-w-4xl h-auto shadow-lg rounded-lg overflow-hidden">
        <div className="hidden md:flex md:w-1/2 bg-gray-100 items-center justify-center p-4">
          <img src={Image} alt="Login" className="max-w-full h-auto" />
        </div>
        <div className=" justify-center flex flex-col items-center bg-white w-full md:w-1/2 p-6">
          <div className="w-full max-w-sm">
            <div className="mb-6 text-center">
              <h1 className=" font-bold text-2xl">Log In</h1>
            </div>
            <form>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className=" font-medium block text-sm text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Your Email Address"
                  className="py-2 border mt-1 block w-full px-3  border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <button
                className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 flex items-center justify-center"
                onClick={sendOtp}
              >
                Login
                {spinner && (
                  <span className="ml-2">
                    <Spinner animation="border" size="sm" />
                  </span>
                )}
              </button>
            </form>
            <div className="flex items-center my-4">
              <div className="border-t flex-grow  border-gray-300"></div>
              <span className="px-4 text-gray-500">OR</span>
              <div className=" border-gray-300 flex-grow border-t"></div>
            </div>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full py-2 px-4 flex items-center justify-center bg-red-500 space-x-2 text-white font-semibold rounded-md hover:bg-red-600  "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8.29 1.11h4.582c-.212 1.193-1.125 3.435-4.582 3.435-2.772 0-5.042-2.222-5.042-4.956s2.27-4.956 5.042-4.956c1.688 0 2.84.728 3.418 1.338l2.327-2.327C13.537 2.165 11.952 1 10 1 5.589 1 2 4.589 2 9s3.589 8 8 8c2.117 0 3.635-.879 4.516-2.112l-2.825-2.777z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Sign in with Google</span>
            </button>
            <p className="text-center mt-4">
              {" "}
              <NavLink to="/register" className="text-blue-500">
                Don't have an account? Sign up
              </NavLink>
            </p>
          </div>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
