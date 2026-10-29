import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { toast } from 'react-toastify';

/* ===============================
   Browser-safe Railway ID Generator
================================ */
async function generateUserId(name, email) {
  const encoder = new TextEncoder();
  const data = encoder.encode(name + email);

  const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  return hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 8);
}

const SignupForm = ({ setIsloggin }) => {
  // const nav = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConPassword, setShowConPassword] = useState(false);


  const initialFormState = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "",
  Railway_Id: "",
};

//! --> pehle eese tha
  // const [formdata, setFormData] = useState({
  //   first_name: "",
  //   last_name: "",
  //   email: "",
  //   password: "",
  //   confirmPassword: "",
  //   role: "",
  //   Railway_Id: "",
  // });

//todo --> aab eesa kr diya kyu ki isse hum data ko clean kr sakte h;
  const [formdata, setFormData] = useState(initialFormState)

  // console.log(formdata)

  /* ===============================
     Handle Input Change
  ================================ */
  function changeHandler(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  /* ===============================
     Generate Railway ID
  ================================ */
  const handleGenerateRailwayId = async () => {
    if (!formdata.first_name || !formdata.email) {
      alert("Please enter First Name and Email first");
      return;
    }

    const id = await generateUserId(
      formdata.first_name,
      formdata.email
    );

    setFormData((prev) => ({
      ...prev,
      Railway_Id: id,
    }));
  };

  /* ===============================
     Submit Form
  ================================ */
  async function submitHandler(e) {
    e.preventDefault();

    if (formdata.password !== formdata.confirmPassword) {
      toast.warning("Passwords do not match");
      return;
    }

    if (!formdata.Railway_Id) {
      toast.warning("Please generate Railway ID");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/v1/singup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formdata),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Signup failed");
        return;
      }

      toast.success("Account created successfully!");
      // ✅ CLEAR ALL FIELDS
setFormData(initialFormState);
      setIsloggin(true);
      // nav("/singup");
    } catch (err) {
      console.error("Signup Error:", err);
    }
  }

  return (
    <div className="w-full flex flex-col gap-5 animate-fadeIn">

      {/* Role / Department */}
      <label className="flex flex-col gap-1">
        <p className="font-semibold">Department / Role *</p>
        <select
          name="role"
          required
          value={formdata.role}
          onChange={changeHandler}
          className="px-4 py-3 border rounded-lg"
        >

          <option value="" disabled>Select Role</option>
          <option value="mechanical">Mechanical</option>
          <option value="electrical">Electrical</option>
          <option value="signal_telecom">Signal Telecom</option>
          <option value="carriage_wagon">Carriage Wagon</option>
          <option value="operations">Operations</option>
          <option value="engineering">Engineering</option>
          <option value="railway_safety">Railway Safety</option>
          <option value="maintenance">Maintenance</option>
          <option value="traction">Traction</option>
        </select>
      </label>

      <form onSubmit={submitHandler} className="flex flex-col gap-5">

        {/* First & Last Name */}
        <div className="flex gap-4">
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            required
            value={formdata.first_name}
            onChange={changeHandler}
            className="w-1/2 px-4 py-3 border rounded-lg"
          />

          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            required
            value={formdata.last_name}
            onChange={changeHandler}
            className="w-1/2 px-4 py-3 border rounded-lg"
          />
        </div>

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={formdata.email}
          onChange={changeHandler}
          className="px-4 py-3 border rounded-lg"
        />

        {/* Railway ID with Generate Button */}
        <div>
          <p className="font-semibold mb-1">Railway ID *</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={formdata.Railway_Id}
              readOnly
              className="w-full px-4 py-3 border rounded-lg bg-gray-100 cursor-not-allowed"
            />
            <button
              type="button"
              onClick={handleGenerateRailwayId}
              className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold"
            >
              Generate
            </button>
          </div>
        </div>

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            required
            value={formdata.password}
            onChange={changeHandler}
            className="w-full px-4 py-3 border rounded-lg"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 cursor-pointer"
          >
            {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
          </span>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <input
            type={showConPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            required
            value={formdata.confirmPassword}
            onChange={changeHandler}
            className="w-full px-4 py-3 border rounded-lg"
          />
          <span
            onClick={() => setShowConPassword(!showConPassword)}
            className="absolute right-3 top-3 cursor-pointer"
          >
            {showConPassword ? <FaRegEye /> : <FaRegEyeSlash />}
          </span>
        </div>

        {/* Submit */}
        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold">
          Create Account
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
