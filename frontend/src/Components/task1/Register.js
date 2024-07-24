import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, NavLink } from "react-router-dom";
import { registerfunction } from "../../services/Apis";

const styles = {
  body: {
    backgroundColor: "#f7f7f7",
    fontFamily: "Arial, sans-serif",
    padding: "10px",
  },
  section: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  form_data: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px",
  },
  form_heading: {
    marginBottom: "20px",
    textAlign: "center",
  },
  form_input: {
    marginBottom: "15px",
  },
  form_input_label: {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold",
  },
  form_input_input: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  two: {
    display: "flex",
    alignItems: "center",
  },
  showpass: {
    marginLeft: "10px",
    cursor: "pointer",
    color: "#007bff",
  },
  btn: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "10px",
  },
  link: {
    textAlign: "center",
    marginTop: "15px",
  },
};

const Register = () => {
  const [passhow, setPassShow] = useState(false);

  const [inputdata, setInputdata] = useState({
    fname: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  // setinputvalue
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputdata({ ...inputdata, [name]: value });
  };

  // register data
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fname, email, password } = inputdata;

    if (fname === "") {
      toast.error("Enter Your Name");
    } else if (email === "") {
      toast.error("Enter Your Email");
    } else if (!email.includes("@")) {
      toast.error("Enter Valid Email");
    } else if (password === "") {
      toast.error("Enter Your Password");
    } else if (password.length < 6) {
      toast.error("Password length minimum 6 characters");
    } else {
      const response = await registerfunction(inputdata);

      if (response.status === 200) {
        setInputdata({ ...inputdata, fname: "", email: "", password: "" });
        navigate("/");
      } else {
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
              <h1>Sign Up</h1>
            </div>
            <form>
              <div style={styles.form_input}>
                <label htmlFor="fname" style={styles.form_input_label}>
                  Name
                </label>
                <input
                  type="text"
                  name="fname"
                  id="fname"
                  value={inputdata.fname}
                  onChange={handleChange}
                  placeholder="Enter Your Name"
                  style={styles.form_input_input}
                />
              </div>
              <div style={styles.form_input}>
                <label htmlFor="email" style={styles.form_input_label}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={inputdata.email}
                  onChange={handleChange}
                  placeholder="Enter Your Email Address"
                  style={styles.form_input_input}
                />
              </div>
              <div style={styles.form_input}>
                <label htmlFor="password" style={styles.form_input_label}>
                  Password
                </label>
                <div style={styles.two}>
                  <input
                    type={!passhow ? "password" : "text"}
                    name="password"
                    id="password"
                    value={inputdata.password}
                    onChange={handleChange}
                    placeholder="Enter Your password"
                    style={styles.form_input_input}
                  />
                  <div
                    className="showpass"
                    onClick={() => setPassShow(!passhow)}
                    style={styles.showpass}
                  >
                    {!passhow ? "Show" : "Hide"}
                  </div>
                </div>
              </div>
              <button className="btn" onClick={handleSubmit} style={styles.btn}>
                Sign Up
              </button>
              <p style={styles.link}>
                If you have an account, please{" "}
                <NavLink to="/" style={{ color: "#007bff" }}>
                  login
                </NavLink>
              </p>
            </form>
          </div>
          <ToastContainer />
        </section>
      </div>
    </>
  );
};

export default Register;
