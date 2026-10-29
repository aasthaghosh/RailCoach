/** @format */

import React, { useEffect, useState } from "react";
import { toast } from 'react-toastify';

const statsInit = [
  { id: 1, label: "Coaches Managed", value: 124 },
  { id: 2, label: "Maintenance Logs", value: 842 },
  { id: 3, label: "Depots Connected", value: 12 },
];

export default function LandingPage() {
  const [stats, setStats] = useState(
    statsInit.map((s) => ({ ...s, current: 0 }))
  );

  useEffect(() => {
    const timers = statsInit.map((s, i) => {
      const duration = 900 + i * 200;
      const start = performance.now();
      return requestAnimationFrame(function step(now) {
        const t = Math.min(1, (now - start) / duration);
        const easing = 1 - Math.pow(1 - t, 3);
        setStats((prev) =>
          prev.map((p) =>
            p.id === s.id ? { ...p, current: Math.round(s.value * easing) } : p
          )
        );
        if (t < 1) requestAnimationFrame(step);
      });
    });

    return () => timers.forEach((t) => cancelAnimationFrame(t));
  }, []);

    //     useEffect(() => {
    //   toast.success("You are logged out", {
    //     position: "top-right",
    //     autoClose: 2000,
    //     theme: "dark",
    //   });
    // }, []);

  return (
    <div
      className="min-h-full bg-cover bg-center bg-no-repeat relative text-slate-900"
      style={{
        backgroundImage:
          "url('https://www.shutterstock.com/image-vector/vector-high-speed-electric-train-260nw-2321709117.jpg')",
      }}>
      {/* ⭐ Soft Glass White Overlay */}
      <div className="absolute inset-0 bg-white/35 backdrop-blur-sm"></div>

      {/* ⭐ All Content */}
      <div className="relative z-10">
        {/* HERO SECTION */}
        <header className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6 animate-fadeIn">
            {/* <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M12 2v20" stroke="#7c3aed" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              Enterprise-ready
            </div> */}

            <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
              Smart Railway Coach Management —{" "}
              <span className="text-indigo-600">
                Maintain. Track. Optimize.
              </span>
            </h2>

            <p className="text-slate-900 max-w-xl font-bold ">
              Manage your fleet's health with automated maintenance schedules,
              live status, and actionable alerts — all in one dashboard designed
              for railway operations teams.
            </p>

            <div className="flex flex-wrap gap-3 mt-4">
              <a
                href="/login"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-lg shadow transition">
                Get Started
                <svg
                  className="w-4 h-4 opacity-90"
                  viewBox="0 0 24 24"
                  fill="none">
                  <path
                    d="M5 12h14M13 5l6 7-6 7"
                    stroke="white"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>

              <a
                href="#features"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition">
                Learn more
              </a>
            </div>

            {/* COUNTERS */}
            <div className="flex gap-4 mt-6 items-center">
              {stats.map((s) => (
                <div key={s.id} className="p-4 bg-white rounded-xl shadow-sm">
                  <div className="text-2xl font-bold">{s.current}</div>
                  <div className="text-sm text-slate-500">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Illustration */}
          <div className="relative animate-slideUp">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              {/* <div className="bg-gradient-to-br from-indigo-600 to-pink-500 p-6 lg:p-10 flex items-center justify-center">
                <TrainSVG />
              </div> */}

              {/* Maintenance card */}
              {/* <div className="bg-white p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-500">Next Maintenance</div>
                    <div className="text-lg font-semibold">
                      Coach C001 — 12 Apr 2025
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Status</div>
                    <div className="text-sm text-green-600 font-semibold">OK</div>
                  </div>
                </div>
              </div> */}
            </div>

            {/* Floating Alert Box */}
            {/* <div className="absolute -bottom-6 right-6 bg-white rounded-xl p-3 shadow-lg w-56 transform hover:scale-[1.02] transition">
              <div className="text-xs text-slate-400">Live Alerts</div>
              <div className="text-sm font-semibold">
                2 coaches due in 7 days
              </div>
            </div> */}
          </div>
        </header>

        {/* FEATURES SECTION */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-12">
          <h3 className="text-2xl font-bold mb-6">Why RailCoach?</h3>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              title="Automated Maintenance"
              desc="Next-date and km-based scheduling with reminders."
            />
            <FeatureCard
              title="Real-time Status"
              desc="Track coach availability & health instantly."
            />
            <FeatureCard
              title="Maintenance History"
              desc="Full logs, attachments & reports."
            />
            <FeatureCard
              title="Reports & Exports"
              desc="CSV / PDF export, KPIs & analytics."
            />
          </div>
        </section>

        {/* CTA SECTION */}
        {/* <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-pink-500 p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h4 className="text-2xl font-bold">
                Ready to streamline fleet maintenance?
              </h4>
              <p className="text-slate-100 mt-1">
                Sign up and get a 14-day free trial for your depot.
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href="/singup"
                className="bg-white text-indigo-600 px-5 py-3 rounded-lg font-semibold"
              >
                Start Free Trial
              </a>
              <a
                href="/contact"
                className="border border-white/30 text-white px-5 py-3 rounded-lg"
              >
                Contact Sales
              </a>
            </div>
          </div>
        </section> */}

        {/* FOOTER */}
        {/* <footer className="max-w-7xl mx-auto px-6 py-10 text-sm text-slate-500">
          <div className="flex items-center justify-between">
            <div>© {new Date().getFullYear()} RailCoach — All rights reserved</div>
            <div className="flex gap-4">
              <a href="#" className="hover:underline">
                Docs
              </a>
              <a href="#" className="hover:underline">
                Privacy
              </a>
              <a href="#" className="hover:underline">
                Support
              </a>
            </div>
          </div>
        </footer> */}

        {/* Animations */}
        <style>{`
          @keyframes floatUp { 
            from { transform: translateY(8px); opacity: 0 } 
            to { transform: translateY(0); opacity: 1 } 
          }
          .animate-fadeIn { 
            animation: floatUp 600ms cubic-bezier(.2,.9,.3,1) both 
          }
          @keyframes slideUp { 
            from { transform: translateY(18px); opacity: 0 }
            to { transform: translateY(0); opacity: 1 } 
          }
          .animate-slideUp { 
            animation: slideUp 700ms cubic-bezier(.2,.9,.3,1) both 
          }
        `}</style>
      </div>
    </div>
  );
}

/* Train Illustration Component */
// function TrainSVG() {
//   return (
//     <svg viewBox="0 0 600 400" className="w-full h-64 sm:h-80">
//       <defs>
//         <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
//           <stop offset="0%" stopColor="#fff" stopOpacity="0.18" />
//           <stop offset="100%" stopColor="#fff" stopOpacity="0.08" />
//         </linearGradient>
//       </defs>

//       {/* <rect x="40" y="90" rx="14" ry="14" width="520" height="180" fill="rgba(255,255,255,0.06)" /> */}

//       {/* <g transform="translate(60,130)">
//         <rect width="420" height="80" rx="10" fill="#fff" opacity="0.06"></rect>
//         <rect x="8" y="8" width="120" height="64" rx="6" fill="rgba(255,255,255,0.12)"></rect>
//         <rect x="142" y="8" width="220" height="64" rx="6" fill="rgba(255,255,255,0.08)"></rect>
//         <circle cx="60" cy="88" r="14" fill="#fff" opacity="0.12"></circle>
//         <circle cx="360" cy="88" r="14" fill="#fff" opacity="0.12"></circle>
//       </g> */}
// {/*
//       <g transform="translate(30,28)">
//         <path d="M0 320 L600 320" stroke="rgba(0,0,0,0.08)" strokeWidth="10" strokeLinecap="round" />
//       </g> */}
//     </svg>
//   );
// }

/* Feature Cards */
function FeatureCard({ title, desc }) {
  return (
    <div className="p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition flex gap-4 items-start">
      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
        {/* Simple icon */}
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#4F46E5" strokeWidth="1.6" />
        </svg>
      </div>

      <div>
        <div className="font-semibold text-slate-800">{title}</div>
        <p className="text-sm text-slate-500 mt-1">{desc}</p>
      </div>
    </div>
  );
}
