/** @format */

import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";


import "../AllCSS/LoginForm.css";

const LoginForm = ({ setIsloggin }) => {
  const nva = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    Railway_Id: "",
    password: "",
  });

  function changeHandler(e) {
    setFormData((pre) => ({
      ...pre,
      [e.target.name]: e.target.value,
    }));
  }

  // function submitHandler(e) {
  //   e.preventDefault();
  //   setIsloggin(true);
  //   nva("/home");
  // }

  //!_________________________________________TO Connect the backend________________________________
  async function submitHandler(e) {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:4000/api/v1/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ye isliye jisse cookie browser pr dikhe
        body: JSON.stringify(formData)   // { email, password }
      });

      const data = await res.json();
      // console.log(data);

      if (!res.ok) {
        // show error to user
        alert(data.message || "Login failed");
        return;
      }

      // this is the inbuld the function to store the value in local
if (data.userobj && data.userobj._id) {
        localStorage.setItem("userId", data.userobj._id);
      }
      // console.log(data.userobj._id);

      // You can also use data.user if backend returned user object
      
      setIsloggin(true);
      nva("/home");

    

    } catch (err) {
      console.log("Login error:", err);
      alert("Something went wrong. Try again.");
    }
  }

  function handleBack() {
    nva(-1);
  }


  return (
    <form
      className="login-form w-full flex flex-col gap-5 animate-fadeIn h-94"
      onSubmit={submitHandler}
    >
     
      {/* EMAIL FIELD */}
      <label className="flex flex-col gap-1">
        <p className="text-gray-700 font-semibold">
          Railway Id <sup className="text-red-500">*</sup>
        </p>

        <input
          type="text"
          name="Railway_Id"
          required
          value={formData.Railway_Id}
          onChange={changeHandler}
          className="w-full px-4 py-3 border border-gray-300 bg-white/70 rounded-lg 
                     focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        />
      </label>

      {/* PASSWORD FIELD */}
      <label className="flex flex-col gap-1 relative">
        <p className="text-gray-700 font-semibold">
          Password <sup className="text-red-500">*</sup>
        </p>

        <input
          type={showPassword ? "text" : "password"}
          name="password"
          required
          value={formData.password}
          onChange={changeHandler}
          className="w-full px-4 py-3 border border-gray-300 bg-white/70 rounded-lg 
                     focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        />

        {/* Eye Icon */}
        <span
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-[43px] cursor-pointer text-gray-600 hover:text-black"
        >
          {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
        </span>

        {/* Forgot Password */}
        <Link to="#" className="text-sm text-indigo-600 hover:underline mt-1">
          Forgot Password?
        </Link>
      </label>

      {/* LOGIN BUTTON */}
      <button
        className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg 
                   font-semibold shadow-md transition"
      >
        Log In
        
      </button>

      {/* Back BUTTON */}
      <button
        onClick={handleBack}
        type="button"
        className="w-full mt-1 bg-gray-700 hover:bg-black text-white py-3 rounded-lg 
                   font-semibold shadow-md transition"
      >
        Back
      </button>
    </form>
  );
};

export default LoginForm;
