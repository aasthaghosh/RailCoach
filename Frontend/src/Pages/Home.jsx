import React from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,

} from "recharts";
import {
  FaTrain,
  FaTools,
  FaCheckCircle,
  FaExclamationTriangle,

  FaListUl,

} from "react-icons/fa";



const Home = ({

  TotalCoach,

  ActiveCoach,

  MaintenanceDueCoach,

  OutOfSericeCoach,



}) => {

  const CountCoach = [

    { name: "Active", value: ActiveCoach },

    { name: "Maintenance Due", value: MaintenanceDueCoach },

    { name: "Out of Service", value: OutOfSericeCoach },

  ];





  return (

    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] p-8 text-white">



      {/* HEADER */}

      <h1 className="text-4xl font-extrabold mb-10 tracking-wide animate-fadeIn">

        Railway Coach Management Dashboard

      </h1>



      {/* SIDE LAYOUT (CARDS LEFT + GRAPH RIGHT) */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">



        {/* LEFT SIDE — STATS CARDS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">



          <StatCard

            title="Total Fleet"

            value={TotalCoach}

            icon={<FaTrain className="text-blue-400 text-4xl" />}

            color="from-blue-600/40 to-blue-800/40"

          />



          <StatCard

            title="Active Coaches"

            value={ActiveCoach}

            icon={<FaCheckCircle className="text-green-400 text-4xl" />}

            color="from-green-600/40 to-green-800/40"

          />



          <StatCard

            title="Maintenance Due"

            value={MaintenanceDueCoach}

            icon={<FaTools className="text-yellow-400 text-4xl" />}

            color="from-yellow-600/40 to-yellow-800/40"

          />



          <StatCard

            title="Out of Service"

            value={OutOfSericeCoach}

            icon={<FaExclamationTriangle className="text-red-400 text-4xl" />}

            color="from-red-600/40 to-red-800/40"

          />



          <StatCard

            title="Critical Tasks"

            value={5}

            icon={<FaListUl className="text-purple-400 text-4xl" />}

            color="from-purple-600/40 to-purple-800/40"

          />



        </div>



        {/* RIGHT SIDE — GRAPH */}

        <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/10 animate-slideUp">



          <h2 className="text-2xl font-semibold mb-6">Fleet Status Overview</h2>



          <div className="h-[280px]">

            <ResponsiveContainer width="100%" height="100%">

              <BarChart data={CountCoach} barSize={45}>

                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#64748b50" />

                <XAxis dataKey="name" stroke="#ffffffb0" />

                <YAxis stroke="#ffffffb0" hide />

                <Tooltip

                  contentStyle={{

                    background: "rgba(15,23,42,0.9)",

                    borderRadius: "12px",

                    border: "1px solid #334155",

                    color: "#fff",

                  }}

                  cursor={{ fill: "rgba(255,255,255,0.1)" }}

                />



                <Bar

                  dataKey="value"

                  fill="url(#colorGradient)"

                  radius={[12, 12, 8, 8]}

                  animationDuration={1100}

                  animationBegin={200}

                />



                <defs>

                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">

                    <stop offset="0%" stopColor="#818cf8" stopOpacity={0.9} />

                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.6} />

                  </linearGradient>

                </defs>

              </BarChart>

            </ResponsiveContainer>

          </div>
        </div>



      </div>



    </div>

  );

};



export default Home;



/* STAT CARD COMPONENT */

const StatCard = ({ title, value, icon, color }) => {

  return (

    <div

      className={`p-6 rounded-2xl bg-gradient-to-br ${color} backdrop-blur-md shadow-xl

      border border-white/10 hover:shadow-2xl transform hover:-translate-y-1 transition-all`}

    >

      <div className="flex justify-between items-center mb-3">

        <p className="text-gray-200 text-sm tracking-wide">{title}</p>

        {icon}

      </div>



      <h2 className="text-4xl font-extrabold tracking-wide">{value}</h2>

    </div>

  );

};