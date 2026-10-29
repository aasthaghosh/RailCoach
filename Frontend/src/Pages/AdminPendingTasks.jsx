import React, { useEffect, useState } from "react";
import { toast } from 'react-toastify';

const AdminPendingTasks = () => {
  const [pendingTasks, setPendingTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH PENDING TASKS
  useEffect(() => {
    async function fetchPendingTasks() {
      try {
        const res = await fetch(
          "http://localhost:4000/api/v1/admin/pending-tasks",
          {
            credentials: "include",
          }
        );

        const data = await res.json();
        if (res.ok) {
          setPendingTasks(data.tasks);
        }
      } catch (err) {
        console.error("Fetch Pending Tasks Error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPendingTasks();
  }, []);

  // APPROVE TASK
  const approveTask = async (taskId) => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/v1/admin/approve-task/${taskId}`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      if (res.ok) {
        setPendingTasks((prev) =>
          prev.filter((task) => task._id !== taskId)
        );
        toast.success("Task Approved Successfully");
      }
    } catch (err) {
      console.error("Approve Error:", err);
    }
  };

  // REJECT TASK
  const rejectTask = async (taskId) => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/v1/admin/reject-task/${taskId}`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      if (res.ok) {
        setPendingTasks((prev) =>
          prev.filter((task) => task._id !== taskId)
        );
        toast.warning("Task Rejected");
      }
    } catch (err) {
      console.error("Reject Error:", err);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-xl font-semibold">
        Loading Pending Tasks...
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-900">
        Pending Maintenance Tasks
      </h1>

      {pendingTasks.length === 0 ? (
        <div className="bg-white p-6 rounded-xl shadow text-center text-gray-600">
          No pending tasks for approval 🎉
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingTasks.map((task) => (
            <div
              key={task._id}
              className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-yellow-400"
            >
              {/* HEADER */}
              <div className="flex justify-between mb-2">
                <span className="text-sm font-bold text-yellow-600">
                  {task.priority.toUpperCase()}
                </span>
                <span className="text-xs text-gray-500">
                  {task.department.toUpperCase()}
                </span>
              </div>

              {/* TITLE */}
              <h2 className="text-xl font-bold text-blue-800 mb-2">
                Title: {task.task}
              </h2>

              {/* DESCRIPTION */}
              <p className="text-gray-700 mb-4 text-lg font-bold">
                Problem: {task.description}
              </p>

              {/* COACH INFO */}
              <div className="text-sm text-gray-700 mb-4">
                <p>
                  <strong>Coach:</strong>{" "}
                  {task.selectCoach.coachNumber}
                </p>
                <p>
                  <strong>Created_By:</strong>{" "}
                  {task.assignedBy.first_name.toUpperCase()} {task.assignedBy.last_name.toUpperCase()}
                </p>
                <p>
                  <strong>Type:</strong>{" "}
                  {task.selectCoach?.type}
                </p>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-3">
                <button
                  onClick={() => approveTask(task._id)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold"
                >
                  Approve
                </button>

                <button
                  onClick={() => rejectTask(task._id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPendingTasks;
