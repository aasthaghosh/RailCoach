import React from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SIngupForm";


const Template = ({ title, desc1, desc2, formtype, setIsloggin }) => {
  return (
    <div
      className="items-center justify-center flex min-h-full bg-cover bg-center bg-no-repeat relative text-slate-900"
      style={{
        backgroundImage:
          "url('https://www.shutterstock.com/image-vector/vector-high-speed-electric-train-260nw-2321709117.jpg')",
      }}>
      {/*  Soft Glass White Overlay */}
      <div className=" absolute inset-0 bg-white/35 backdrop-blur-sm"></div>
      {/* Outer Glass Card */}
      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl px-8 py-10 animate-fadeIn">

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
          {title}
        </h1>

        <p className="text-center text-gray-600 mb-6 text-sm leading-tight">
          {desc1} <br /> {desc2}
        </p>

        {/* FORM — No design clash now */}
        {formtype === "singup" ? (
          <SignupForm setIsloggin={setIsloggin} />
        ) : (
          <LoginForm setIsloggin={setIsloggin} />
        )}

        {/* Divider */}
        <div className="w-full flex items-center gap-3 my-5">
          <div className="flex-1 h-[1px] bg-gray-300"></div>
          <p className="text-gray-500 font-medium text-sm">OR</p>
          <div className="flex-1 h-[1px] bg-gray-300"></div>
        </div>

      </div>
    </div>
  );
};

export default Template;
