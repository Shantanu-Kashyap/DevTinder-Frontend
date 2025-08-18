import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import "./Login.css";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/login`,
        { emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      navigate("/");
    } catch (err) {
      setError(err?.response?.data || "Login error:");
    }
  };

  const handleSignUp = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/signup`,
        { firstName, lastName, emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.data));
      navigate("/profile");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2 className="login-title">
            {isLoginForm ? "Login to DevTinder" : "Join DevTinder"}
          </h2>
          <p className="login-subtitle">
            {isLoginForm
              ? "Connect with fellow developers"
              : "Create your dev profile"}
          </p>
        </div>
        <div className="login-form">
          {!isLoginForm && (
            <>
              <div className="input-group">
                <label>First Name</label>
                <input
                  type="text"
                  value={firstName}
                  placeholder="Enter your first name"
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  placeholder="Enter your last name"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </>
          )}
          <div className="input-group">
            <label>Email ID</label>
            <input
              type="text"
              value={emailId}
              placeholder="Enter your email ID"
              onChange={(e) => setEmailId(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        {error && <p className="error-message">{error}</p>}
        <button
          className="login-button"
          onClick={isLoginForm ? handleLogin : handleSignUp}
        >
          {isLoginForm ? "Login" : "Sign Up"}
        </button>
        <p className="toggle-form" onClick={() => setIsLoginForm((value) => !value)}>
          {isLoginForm ? "New User? Create an account" : "Existing User? Log in"}
        </p>
      </div>
    </div>
  );
};

export default Login;