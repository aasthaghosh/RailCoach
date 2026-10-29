/** @format */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminAllUser() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:4000/api/v1/admin/users", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setUsers(data.users || []);
      })
      .catch((err) => console.error(err));
  }, []);

  function formatWorkTime(ms) {
    if (!ms || ms <= 0) return "0s";
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h}h ${m}m ${s}s`;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-6">
      <div className="max-w-6xl mx-auto rounded-2xl bg-white/10 backdrop-blur-xl shadow-2xl p-6">
        <h1 className="text-2xl font-bold text-white mb-6">
           Admin – Users Dashboard
        </h1>

        {/* TABLE */}
        <div className="overflow-x-auto rounded-xl">
          <table className="w-full table-fixed border-collapse text-white">
            <thead>
              <tr className="bg-white/10">
                <th className="p-4 text-center w-[22%]">Name</th>
                <th className="p-4 text-center w-[30%]">Email</th>
                <th className="p-4 text-center w-[14%]">Role</th>
                <th className="p-4 text-center w-[16%]">Status</th>
                <th className="p-4 text-center w-[18%]">Total Work</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="p-6 text-center text-slate-300"
                  >
                    No users found
                  </td>
                </tr>
              )}

              {users.map((u) => {
                const status = (u.status || "offline").toLowerCase();
                return (
                  <tr
                    key={u._id}
                    onClick={() => navigate(`/admin/user/${u._id}`)}
                    className="cursor-pointer transition-all duration-200 hover:bg-indigo-500/20 hover:scale-[1.01]"
                  >
                    <td className="p-4 text-center">
                      {u.first_name} {u.last_name}
                    </td>

                    <td className="p-4 text-center truncate">
                      {u.email}
                    </td>

                    <td className="p-4 text-center">
                      {u.role}
                    </td>

                    <td className="p-4 text-center">
                      <span
                        className={`inline-block min-w-[90px] rounded-full px-3 py-1 text-xs font-bold ${
                          status === "online"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {status.toUpperCase()}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      {formatWorkTime(u.totalWorkTime)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Clicking a row navigates to the user details page */}
    </div>
  );
}
