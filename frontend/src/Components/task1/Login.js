import React, { useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { sentOtpFunction } from "../../services/Apis";

const styles = {
  body: {
    backgroundColor: "#f7f7f7",
  },
  section: {
    display: "flex",
    height: "100vh",

    alignItems: "center",
    justifyContent: "center",
  },
  form_data: {
    width: "300px",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",

    backgroundColor: "#fff",
  },
  form_heading: {
    textAlign: "center",
    marginBottom: "20px",
  },
  form_input: {
    marginBottom: "15px",
  },
  form_input_label: {
    display: "block",
    marginBottom: "5px",
  },
  form_input_input: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  btn: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    width: "100%",
    padding: "10px",
    fontSize: "16px",
  },
  spinner: {
    marginLeft: "10px",
  },
  link: {
    marginTop: "15px",
    textAlign: "center",
  },
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [spiner, setSpiner] = useState(false);
  const navigate = useNavigate();

  const sendOtp = async (e) => {
    e.preventDefault();

    if (email === "") {
      toast.error("Enter Your Email!");
    } else if (!email.includes("@")) {
      toast.error("Enter a Valid Email!");
    } else {
      setSpiner(true);
      const data = { email: email };
      const response = await sentOtpFunction(data);
      if (response.status === 200) {
        setSpiner(false);
        navigate("/otp", { state: email });
      } else {
        setSpiner(false);
        toast.error(response.response.data.error);
      }
    }
  };

  return (
    <>
      <div style={styles.body}>
        <section style={styles.section}>
          <div style={styles.form_data}>
            <div style={styles.form_heading}>
              <h1>Welcome Back, Log In</h1>
              <p>Hi, we are glad you are back. Please log in.</p>
            </div>
            <form>
              <div style={styles.form_input}>
                <label htmlFor="email" style={styles.form_input_label}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Your Email Address"
                  style={styles.form_input_input}
                />
              </div>
              <button className="btn" onClick={sendOtp} style={styles.btn}>
                Login
                {spiner && (
                  <span style={styles.spinner}>
                    <Spinner animation="border" />
                  </span>
                )}
              </button>
              <p style={styles.link}>
                Don't have an account? <NavLink to="/register">Sign up</NavLink>
              </p>
            </form>
          </div>
          <ToastContainer />
        </section>
      </div>
    </>
  );
};

export default Login;
