import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignIn from "./Components/task1/SignIn";
import Home from "./Components/task2/Home";
import Language from "./Components/task2/Language";
import Phone from "./Components/task3/PhoneAuthentiction";
import Login from "./Components/task1/Login";
import Register from "./Components/task1/Register";
import Otp from "./Components/task1/otp";
import Otpforlanguage from "./Components/task2/otpAuthentication";
import Otps from "./Components/task2/otp";
import History from "./Components/task3/History";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/home" element={<Home />} />
        <Route path="/language" element={<Language />} />
        <Route path="/phone" element={<Phone />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/otplan" element={<Otpforlanguage />} />
        <Route path="/otps" element={<Otps />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  );
};

export default App;
