import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { userVerify } from "../../../src/services/Apis";
import LanguageSelector from "./LanguageSelector";
import { useLocation, useNavigate } from "react-router-dom";

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
        <div className=" p-6 rounded-lg bg-white shadow-md w-full max-w-md">
          <form>
            <div className="mb-4">
              <label
                htmlFor="otp"
                className="font-medium block text-sm  text-gray-700"
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
                className=" border-gray-300 rounded-md mt-1 block w-full px-3 py-2 border shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <button
              className=" bg-blue-500 w-full py-2 px-4 text-white font-semibold rounded-md hover:bg-blue-600 text-2xl"
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
