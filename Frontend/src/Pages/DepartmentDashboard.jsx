import React from "react";
import { FaIndustry, FaTasks, FaCheckCircle } from "react-icons/fa";

const DepartmentDashboard = ({ AddMaintenance, countTask, completed }) => {

  const departmentCount = {
    mechanical: 0,
    electrical: 0,
    signal_telecom: 0,
    carriage_wagon: 0,
    traction: 0,
    operations: 0,
    engineering: 0,
    railway_safety: 0,
    maintenance: 0,
  };

  AddMaintenance.forEach((task) => {
    if (task.department && departmentCount[task.department] !== undefined) {
      departmentCount[task.department]++;
    }
  });

  const departments = Object.keys(departmentCount);

  const handleCardClick = (type, value) => {
    console.log("Clicked:", type, value);
  };

return (
  <div className="min-h-screen relative overflow-hidden 
  bg-[radial-gradient(circle_at_center,#0f172a_0%,#020617_70%)] 
  text-slate-100 px-10 py-14">
    

    {/* ================= DEPARTMENT SECTION ================= */}
    <h1 className="text-3xl font-semibold text-slate-100 mb-10 flex items-center gap-3">
      <FaIndustry className="text-blue-400" />
      Department Overview
    </h1>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
      {departments.map((dept, i) => (
        <div
          key={i}
          onClick={() => handleCardClick("department", dept)}
          className="
            relative group cursor-pointer
            bg-[#0f172a]
            border border-slate-800
            rounded-xl
            shadow-lg
            hover:shadow-2xl
            transition-all duration-300
          "
        >
          {/* Header */}
          <div className="px-5 py-3 border-b border-slate-800 bg-[#111827] rounded-t-xl">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
              {dept.replace("_", " ")}
            </h2>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-5xl font-bold text-blue-400">
              {departmentCount[dept]}
            </p>
            <p className="text-slate-400 text-sm mt-1">Total Tasks</p>
          </div>

          {/* Accent bar */}
          <div className="absolute left-0 top-0 h-full w-1 bg-blue-500 opacity-0 group-hover:opacity-100 transition rounded-l-xl" />
        </div>
      ))}
    </div>

    {/* ================= TASK STATUS ================= */}
    <h1 className="text-3xl font-semibold text-slate-100 mb-10 flex items-center gap-3">
      <FaTasks className="text-indigo-400" />
      Task Progress
    </h1>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">

      {/* Pending */}
      <div
        onClick={() => handleCardClick("status", "pending")}
        className="
          relative group cursor-pointer
          bg-[#0f172a]
          border border-slate-800
          rounded-xl
          shadow-lg
          hover:shadow-2xl
          transition-all duration-300
        "
      >
        <div className="px-5 py-3 border-b border-slate-800 bg-[#111827] rounded-t-xl">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
            Pending
          </h2>
        </div>

        <div className="p-6">
          <p className="text-5xl font-bold text-yellow-400">{countTask}</p>
          <p className="text-slate-400 text-sm mt-1">Awaiting Action</p>
        </div>

        <div className="absolute left-0 top-0 h-full w-1 bg-yellow-400 opacity-0 group-hover:opacity-100 transition rounded-l-xl" />
      </div>

      {/* Completed */}
      <div
        onClick={() => handleCardClick("status", "completed")}
        className="
          relative group cursor-pointer
          bg-[#0f172a]
          border border-slate-800
          rounded-xl
          shadow-lg
          hover:shadow-2xl
          transition-all duration-300
        "
      >
        <div className="px-5 py-3 border-b border-slate-800 bg-[#111827] rounded-t-xl flex items-center gap-2">
          <FaCheckCircle className="text-green-400" />
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
            Completed
          </h2>
        </div>

        <div className="p-6">
          <p className="text-5xl font-bold text-green-400">{completed}</p>
          <p className="text-slate-400 text-sm mt-1">Finished Tasks</p>
        </div>

        <div className="absolute left-0 top-0 h-full w-1 bg-green-400 opacity-0 group-hover:opacity-100 transition rounded-l-xl" />
      </div>

    </div>
  </div>
);

};

export default DepartmentDashboard;
