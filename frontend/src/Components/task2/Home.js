import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Language from "./Language";
import { useTranslation } from "react-i18next";
import Device from "../task3/Device";

const Home = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [isAllowed, setIsAllowed] = useState(true);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const userToken = localStorage.getItem("userdbtoken");

    const isMobileDevice = () => {
      return /Mobi|Android/i.test(navigator.userAgent);
    };

    const isAccessAllowedTime = () => {
      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      return currentHour >= 10 && currentHour < 13;
    };

    if (!storedEmail && !userToken) {
      navigate("/");
    } else if (isMobileDevice() && !isAccessAllowedTime()) {
      setIsAllowed(false);
    } else {
      setIsAllowed(true);
    }

    const intervalId = setInterval(() => {
      window.location.reload();
    }, 3000);

    return () => {
      clearInterval(intervalId);
    };
  }, [navigate]);

  useEffect(() => {
    switch (i18n.language) {
      case "hi":
        document.body.style.backgroundColor = "blue";
        break;
      case "zh":
        document.body.style.backgroundColor = "green";
        break;
      case "fr":
        document.body.style.backgroundColor = "yellow";
        break;
      default:
        document.body.style.backgroundColor = "white";
        break;
    }
  }, [i18n.language]);

  const handleLogout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("userdbtoken");
    navigate("/");
  };

  const navigateToHistory = () => {
    navigate("/history");
  };

  const isWhiteText = i18n.language === "hi" || i18n.language === "zh";

  if (!isAllowed) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">Access Restricted</h1>
        <p className="text-lg">
          Access to the website is only allowed from 10 AM to 1 PM on mobile
          devices.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1
                className={`text-2xl font-bold ${
                  isWhiteText ? "text-white" : "text-gray-900"
                }`}
              >
                {t("home")}
              </h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={navigateToHistory}
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out mr-4"
              >
                {t("history")}
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
              >
                {t("logout")}
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className="flex-grow flex flex-col items-center justify-start pt-8">
        <div className="max-w-md w-full text-center">
          <Language />
          <Device />
        </div>
      </div>
    </div>
  );
};

export default Home;
