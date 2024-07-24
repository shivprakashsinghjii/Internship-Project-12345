import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { userVerify } from "../../../src/services/Apis";
import LanguageSelector from "./LanguageSelector"; // Import your LanguageSelector component

const Otp = () => {
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false); // State to track authentication status

  const handleSuccessfulLogin = async (response) => {
    localStorage.setItem("userdbtoken", response.data.userToken);
    toast.success(response.data.message);

    setTimeout(() => {
      setAuthenticated(true); // Set authentication status to true
      navigate("/home");
    }, 3000); // Redirect to home page after 3 seconds
  };

  const loginUser = async (e) => {
    e.preventDefault();

    if (otp === "") {
      toast.error("Enter Your OTP");
    } else if (!/^\d+$/.test(otp)) {
      toast.error("Enter Valid OTP");
    } else if (otp.length !== 6) {
      toast.error("OTP length should be 6 digits");
    } else {
      const data = {
        otp,
        email: location.state,
      };

      try {
        const response = await userVerify(data);
        if (response.status === 200) {
          handleSuccessfulLogin(response);
        } else {
          toast.error(response.data.error);
        }
      } catch (error) {
        toast.error("Failed to verify OTP. Please try again.");
      }
    }
  };

  return (
    <>
      <section className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <form>
            <div className="mb-4">
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700"
              >
                OTP
              </label>
              <input
                type="text"
                name="otp"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <button
              className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 text-2xl"
              onClick={loginUser}
            >
              &rarr; Verify OTP
            </button>
          </form>
        </div>
        <ToastContainer />
      </section>
      {authenticated && <LanguageSelector authenticated={authenticated} />}
    </>
  );
};

export default Otp;
