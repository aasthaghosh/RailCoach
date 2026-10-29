/** @format */

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const CoachOutputForm = ({ AddCoach, CountCoachData, role, user }) => {
  // Count coach summary every render
  // keep a local copy so we can update request state optimistically
  const [coaches, setCoaches] = useState(AddCoach || []);

  useEffect(() => {
    setCoaches(AddCoach || []);
  }, [AddCoach]);

  CountCoachData(coaches);

  const toISODate = (d) => {
    if (!d) return null;
    try {
      return new Date(d).toISOString().slice(0, 10);
    } catch (e) {
      return null;
    }
  };

  const formatLastMaintenance = (d) => {
    const iso = toISODate(d);
    if (!iso) return "-";
    const today = new Date().toISOString().slice(0, 10);
    if (iso === today) return "Today";
    return iso;
  };

  const parseDate = (d) => {
    if (!d) return null;
    const dt = new Date(d);
    return isNaN(dt) ? null : dt;
  };

  // return number of days from today until `date` (date-only), using UTC to avoid timezone shifts.
  // If date is invalid, return null.
  const getDaysLeft = (dateObj) => {
    if (!dateObj) return null;
    const d = dateObj instanceof Date ? dateObj : new Date(dateObj);
    if (isNaN(d)) return null;
    const utcTarget = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
    const now = new Date();
    const utcToday = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    const msPerDay = 1000 * 60 * 60 * 24;
    // Use rounded integer days difference
    return Math.round((utcTarget - utcToday) / msPerDay);
  };

  const pendingCount = coaches.reduce((acc, c) => {
    const nd = parseDate(c.nextDue);
    const daysLeft = getDaysLeft(nd);
    // count as pending if it's due (daysLeft <= 0) or a maintenance request exists
    return (
      acc +
      ((daysLeft !== null && daysLeft <= 0) || c.maintenanceRequested ? 1 : 0)
    );
  }, 0);

  return (
    <div className="bg-gray-100 p-8 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Coaches List</h1>

        {pendingCount > 0 && (
          <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800">
            {pendingCount} coach{pendingCount > 1 ? "es" : ""} pending
            maintenance. Please review.
          </div>
        )}

        <table className="w-full border-collapse rounded-lg overflow-hidden shadow-sm">
          <thead>
            <tr className="bg-blue-600 text-white text-left">
              <th className="p-4">Coach Number</th>
              <th className="p-4">Type</th>
              <th className="p-4">Depot</th>
              <th className="p-4">Status</th>
              <th className="p-4">Last Maintenance</th>
              <th className="p-4">Next Due</th>
              <th className="p-4">Maintenance</th>
            </tr>
          </thead>

          <tbody>
            {AddCoach.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="p-5 text-center text-gray-500 border-t">
                  No coaches added yet.
                </td>
              </tr>
            ) : (
              coaches.map((coach, index) => {
                const lmDate = parseDate(coach.lastMaintenance);
                const ndDate = parseDate(coach.nextDue);
                const daysLeft = getDaysLeft(ndDate);
                const isDue = daysLeft !== null && daysLeft <= 0;
                const requestMaintenance = async () => {
                  try {
                    const res = await axios.post(
                      `http://localhost:4000/api/v1/coach/${coach._id}/request-maintenance`,
                      { requestedBy: "user" },
                      { withCredentials: true }
                    );
                    if (res.status === 200) {
                      // optimistic update
                      const copy = [...coaches];
                      copy[index] = {
                        ...copy[index],
                        maintenanceRequested: true,
                        maintenanceRequestAt: new Date().toISOString(),
                      };
                      setCoaches(copy);
                      // optional: notify user
                      alert("Maintenance requested — admin will review");
                    }
                  } catch (err) {
                    console.error(err);
                    alert(err.response?.data?.mess || "Request failed");
                  }
                };

                const approveMaintenance = async () => {
                  try {
                    const res = await axios.patch(
                      `http://localhost:4000/api/v1/coach/${coach._id}/approve-maintenance`,
                      {},
                      { withCredentials: true }
                    );
                    if (res.status === 200 && res.data.coach) {
                      const copy = [...coaches];
                      copy[index] = { ...res.data.coach };
                      setCoaches(copy);
                      alert("Maintenance approved and dates updated");
                    }
                  } catch (err) {
                    console.error(err);
                    alert(err.response?.data?.mess || "Approve failed");
                  }
                };

                return (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50 transition">
                    {/* CLICKABLE NUMBER */}
                    <td className="p-4">
                      <Link
                        to={`/coach/${index}`}
                        className="text-blue-600 font-semibold hover:underline">
                        {coach.coachNumber}
                      </Link>
                    </td>

                    <td className="p-4">{coach.type}</td>
                    <td className="p-4">{coach.depot}</td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm text-white ${
                          coach.status === "active"
                            ? "bg-green-500"
                            : coach.status === "under maintenance"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}>
                        {coach.status}
                      </span>
                    </td>

                    <td className="p-4">
                      {formatLastMaintenance(coach.lastMaintenance)}
                    </td>
                    <td className="p-4">{toISODate(coach.nextDue) || "-"}</td>
                    <td className="p-4">
                      {isDue ? (
                        coach.maintenanceRequested ? (
                          <div className="flex gap-2 items-center">
                            {role === "admin" ? (
                              <button
                                onClick={approveMaintenance}
                                className="px-3 py-1 rounded-md bg-green-600 text-white text-sm hover:bg-green-700">
                                Approve Maintenance
                              </button>
                            ) : null}
                            <span className="px-3 py-1 rounded-full text-sm bg-orange-500 text-white">
                              Requested
                            </span>
                          </div>
                        ) : (
                          <button
                            onClick={requestMaintenance}
                            className="px-3 py-1 rounded-md bg-yellow-500 text-white text-sm hover:bg-yellow-600">
                            Request Maintenance
                          </button>
                        )
                      ) : ndDate && daysLeft !== null ? (
                        daysLeft > 0 ? (
                          <span className="text-sm text-gray-700">
                            {daysLeft} day{daysLeft > 1 ? "s" : ""} left
                          </span>
                        ) : (
                          <span className="text-sm text-red-600 font-semibold">
                            Due
                          </span>
                        )
                      ) : (
                        <span className="text-gray-500 text-sm">—</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CoachOutputForm;
