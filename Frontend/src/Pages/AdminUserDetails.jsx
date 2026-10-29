/** @format */

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function AdminUserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tasksCompleted, setTasksCompleted] = useState(null);
  const [assignedApprovedCount, setAssignedApprovedCount] = useState(null);
  const [assignedCompletedCount, setAssignedCompletedCount] = useState(null);
  const [tasksApprovedByUser, setTasksApprovedByUser] = useState(null);
  const [tasksCompletedByUser, setTasksCompletedByUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    // fetch user details + populated tasks and completed count
    fetch(`http://localhost:4000/api/v1/admin/users/${id}`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          setUser(data.user || null);
          setTasks(data.tasks || []);
          setAssignedApprovedCount(
            typeof data.assignedApprovedCount === "number"
              ? data.assignedApprovedCount
              : null
          );
          setAssignedCompletedCount(
            typeof data.assignedCompletedCount === "number"
              ? data.assignedCompletedCount
              : null
          );
          setTasksApprovedByUser(
            typeof data.tasksApprovedByUser === "number"
              ? data.tasksApprovedByUser
              : null
          );
          setTasksCompletedByUser(
            typeof data.tasksCompletedByUser === "number"
              ? data.tasksCompletedByUser
              : null
          );
        }
      })
      .catch((e) => console.error("fetch user error", e))
      .finally(() => setLoading(false));
  }, [id]);

  function formatWorkTime(ms) {
    if (!ms || ms <= 0) return "0s";
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h}h ${m}m ${s}s`;
  }

  if (loading) return <div className="p-6">Loading...</div>;
  if (!user)
    return (
      <div className="p-6">
        <p>User not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded">
          Back
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-6 text-white">
      <div className="max-w-3xl mx-auto bg-white/5 rounded-2xl p-6 shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {user.first_name} {user.last_name}
            </h1>
            <p className="text-sm text-slate-300">{user.email}</p>
            <p className="mt-2 text-sm">
              <strong>Role:</strong> {user.role}
            </p>
            <p className="mt-2 text-sm">
              <strong>Railway Id:</strong> {user.Railway_Id}
            </p>
          </div>

          <div className="text-right">
            <button
              onClick={() => navigate(-1)}
              className="px-3 py-1 rounded bg-slate-700/60">
              Back
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-sm text-slate-200">
          <div className="bg-white/3 rounded p-4">
            <div className="mb-2 text-slate-300">Login Time</div>
            <div className="font-medium">
              {user.lastLoginAt
                ? new Date(user.lastLoginAt).toLocaleString()
                : "-"}
            </div>
          </div>

          <div className="bg-white/3 rounded p-4">
            <div className="mb-2 text-slate-300">Logout Time</div>
            <div className="font-medium">
              {user.lastLogoutAt
                ? new Date(user.lastLogoutAt).toLocaleString()
                : user.status === "online"
                ? "Online"
                : "-"}
            </div>
          </div>

          <div className="bg-white/3 rounded p-4">
            <div className="mb-2 text-slate-300">Total Work</div>
            <div className="font-medium">
              {formatWorkTime(user.totalWorkTime)}
            </div>
          </div>

          <div className="bg-white/3 rounded p-4">
            <div className="mb-2 text-slate-300">Tasks Created</div>
            <div className="font-medium">
              {assignedApprovedCount === null ? "N/A" : assignedApprovedCount}
            </div>
          </div>

          <div className="bg-white/3 rounded p-4">
            <div className="mb-2 text-slate-300">
              Tasks Assigned - Completed
            </div>
            <div className="font-medium">
              {assignedCompletedCount === null ? "N/A" : assignedCompletedCount}
            </div>
          </div>
                    <div className="bg-white/3 rounded p-4">
            <div className="mb-2 text-slate-300">
              Stored: Tasks Completed (user)
            </div>
            <div className="font-medium">
              {typeof user.tasksCompletedCount === "number"
                ? user.tasksCompletedCount
                : "N/A"}
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-200">

          {/* <div className="bg-white/3 rounded p-4">
            <div className="mb-2 text-slate-300">
              Stored: Tasks Approved (user)
            </div>
            <div className="font-medium">
              {typeof user.tasksApprovedCount === "number"
                ? user.tasksApprovedCount
                : "N/A"}
            </div>
          </div> */}
          {/* <div className="bg-white/3 rounded p-4">
            <div className="mb-2 text-slate-300">
              Stored: Assigned - Completed
            </div>
            <div className="font-medium">
              {typeof user.tasksAssignedCompletedCount === "number"
                ? user.tasksAssignedCompletedCount
                : "N/A"}
            </div>
          </div> */}
          <div className="bg-white/3 rounded p-4">
            <div className="mb-2 text-slate-300">
              Stored: Assigned - Approved
            </div>
            <div className="font-medium">
              {typeof user.tasksAssignedApprovedCount === "number"
                ? user.tasksAssignedApprovedCount
                : "N/A"}
            </div>
          </div>
        </div>

        <div className="mt-6 text-slate-300">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold mb-2">Tasks</h3>
            <div className="text-xs text-slate-400">
              Approved By User:{" "}
              {tasksApprovedByUser === null ? "N/A" : tasksApprovedByUser} •
              Completed By User:{" "}
              {tasksCompletedByUser === null ? "N/A" : tasksCompletedByUser}
            </div>
          </div>
          {tasks.length === 0 ? (
            <div className="text-sm text-slate-400">
              No tasks found for this user.
            </div>
          ) : (
            <div className="mt-2 space-y-2">
              {tasks.map((t) => (
                <div key={t._id} className="bg-white/3 p-3 rounded">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{t.task}</div>
                    <div className="text-xs px-2 py-1 rounded-full bg-slate-700/40">
                      {t.status}
                    </div>
                  </div>
                  <div className="text-xs text-slate-300 mt-1">
                    Priority: {t.priority} • Department: {t.department}
                  </div>
                  <div className="text-xs text-slate-300 mt-1">
                    Coach:{" "}
                    {t.selectCoach
                      ? `${t.selectCoach.coachNumber} (${t.selectCoach.type})`
                      : "—"}
                  </div>
                  <div className="text-xs text-slate-300 mt-1">
                    Approved By:{" "}
                    {t.approvedBy
                      ? `${t.approvedBy.first_name} ${t.approvedBy.last_name}`
                      : "—"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
