/** @format */

import React, { useEffect, useRef, useState } from "react";
import AnimatedMenuButton from "../../Button/AnimatedMenuButton";
import { toast } from 'react-toastify';

const MaintenanceTaskInputForm = ({ coachList, setCoachList }) => {
  const [showForm, setShowForm] = useState(false);


  // for button;
  const [cancelSuccess, setCancelSuccess] = useState(false);

  const handleCancel = () => {
    setCancelSuccess(true);

    setTimeout(() => {
      setShowForm(false);     // close modal
      setCancelSuccess(false);
    }, 600);
  };

  // Fetch all coaches
  useEffect(() => {
    async function fetchCoaches() {
      try {
        const res = await fetch("http://localhost:4000/api/v1/allcoach", {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setCoachList(data.coaches);
        }
      } catch (err) {
        console.log("Fetch Coach Error:", err);
      }
    }
    fetchCoaches();
  }, []);

  // refs
  const coach = useRef();
  const title = useRef();
  const priority = useRef();
  const department = useRef();
  const description = useRef();

  async function submitHandler(e) {
    e.preventDefault();

    const userId = localStorage.getItem("userId");
    if (!userId) {
      // alert("User not logged in");
      toast.error("User not logged in");
      return;
    }

    const MaintenanceData = {
      selectCoach: coach.current.value,
      task: title.current.value,
      priority: priority.current.value,
      department: department.current.value,
      description: description.current.value,
      assignedBy: userId,
      status: "PENDING",
    };

    try {
      const res = await fetch("http://localhost:4000/api/v1/taskdata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(MaintenanceData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Task not created");
        return;
      }

      toast.info("Task sent to Admin for approval");
      setShowForm(false);
    } catch (err) {
      console.error("Task Error:", err);
    }
  }

  return (
    <>
      {/* 🔘 Open Button */}
      {/* <button
        onClick={() => setShowForm(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-md transition active:scale-95"
      >
        + Assign New Task
      </button> */}
      <button className="mt-4"
      onClick={() => setShowForm(true)}>
       <AnimatedMenuButton
         text="Assign New Task"
      />
      </button>

      {/* 🪟 MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-8 animate-scaleIn">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Maintenance Request
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-red-500 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={submitHandler} className="space-y-5">

              {/* Coach */}
              <div>
                <label className="form-label">Coach</label>
                <select ref={coach} required className="form-input">
                  <option value="">Select Coach</option>
                  {coachList.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.coachNumber} ({c.type})
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="form-label">Task Title</label>
                <input
                  ref={title}
                  required
                  placeholder="e.g. Brake inspection near bogie"
                  className="form-input"
                />
              </div>

              {/* Priority + Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Priority</label>
                  <select ref={priority} required className="form-input">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Department</label>
                  <select ref={department} required className="form-input">
                    <option value="">Select Department</option>
                    <option value="mechanical">Mechanical</option>
                    <option value="electrical">Electrical</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="form-label">Description</label>
                <textarea
                  ref={description}
                  required
                  rows={4}
                  placeholder="Describe the issue clearly"
                  className="form-input resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4 pt-4 border-t">

                {/* <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2 border rounded-lg text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancel
                </button> */}
<style>{`
.cancel-btn {
  position: relative;
  width: 150px;
  height: 44px;
  background: #c0392b;
  color: #fff;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease, transform 0.2s ease;
}

/* TEXT */
.cancel-btn > span {
  position: absolute;
  left: 0;
  width: 70%;
  text-align: center;
  font-weight: bold;
  transition: all 0.3s ease;
}

/* ICON AREA */
.cancel-btn .icon {
  position: absolute;
  right: 0;
  width: 30%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.cancel-btn .icon span {
  font-size: 18px;
}

/* CHECK ICON HIDDEN */
.cancel-btn .check {
  display: none;
}

/* HOVER */
.cancel-btn:hover > span {
  left: -70%;
  opacity: 0;
}

.cancel-btn:hover .icon {
  width: 100%;
}

/* SUCCESS STATE */
.cancel-btn.success {
  background: #27ae60;
}

.cancel-btn.success > span {
  display: none;
}

.cancel-btn.success .x {
  display: none;
}

.cancel-btn.success .check {
  display: inline;
}

/* CLICK FEEDBACK */
.cancel-btn:active {
  transform: scale(0.95);
}
`}</style>


                <button
                  type="button"
                  onClick={handleCancel}
                  className={`cancel-btn ${cancelSuccess ? "success" : ""}`}
                >
                  <span>Cancel</span>
                  <div className="icon">
                    <span className="x">✖</span>
                    <span className="check">✔</span>
                  </div>
                </button>

                <style>{`
        .btn-style906 {
          background: #61a5c2;
          border: 2px solid #61a5c2;
          cursor: pointer;
        }

        /* Bottom line */
        .btn-style906::before {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 4.5px;
          background-color: #474448;
          transition: all 0.35s ease;
          z-index: 2;
        }

        /* Hover slide overlay */
        .btn-style906::after {
          content: attr(data-hover);
          position: absolute;
          inset: 0;
          background-color: #3c153b;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          transform: translateY(-100%);
          transition: all 0.35s ease;
          z-index: 1;
        }
          

        /* Hover effects */
        .btn-style906:hover::before {
          width: 100%;
        }

        .btn-style906:hover::after {
          transform: translateY(0);
        }

        /* Click feedback */
        .btn-style906:active {
          transform: scale(0.96);
        }
      `}</style>
                <button
                  type="submit"
                  className="relative overflow-hidden px-6 py-2 rounded-lg font-semibold text-white shadow-md btn-style906" data-hover="Click me">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default MaintenanceTaskInputForm;
