/** @format */

import React, { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";

const CoachInputForm = ({ AddCoachData }) => {
  const [showForm, setShowForm] = useState(false);

  let coachNumber = useRef();
  let type = useRef();
  let depot = useRef();
  let status = useRef();
  // dates are system-managed; no refs for them

  const submitHandler = async (e) => {
    e.preventDefault();

    const coachData = {
      coachNumber: coachNumber.current.value,
      type: type.current.value,
      depot: depot.current.value,
      status: status.current.value,
      // dates are system-managed: last maintenance = today, next due = +1 month
      // server will set lastMaintenance = now and nextDue = +1 month
    };

    // to join the backend
    try {
      const res = await fetch("http://localhost:4000/api/v1/coachdata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(coachData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.mess || data.message || "Coach is not created");
        return;
      }

      setShowForm(false);
      // use the coach object returned from server (contains _id)
      AddCoachData(data.coach || coachData);

      toast.success("Coach is created");
    } catch (err) {
      console.error("Coach Error:", err);
    }
  };

  return (
    <div>
      {/* Coach Number,	Type,	Depot,	Status,	Last Maintenance,	Next Due */}

      <div className=" bg-gray-100 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Coach Management</h1>

          {/* ADD COACH BUTTON */}
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition">
            + Add Coach
          </button>
        </div>

        {/* POPUP MODAL FORM */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white w-[450px] rounded-xl shadow-2xl p-8 animate-fadeIn">
              <h2 className="text-2xl font-bold mb-4 text-gray-700">
                Add Coach
              </h2>

              <form onSubmit={submitHandler} className="flex flex-col gap-4">
                <div>
                  <p className="font-medium text-gray-700">Coach Number</p>
                  <input
                    type="text"
                    name="coachNumber"
                    //   value={coachData.coachNumber}
                    ref={coachNumber}
                    // onChange={handleChange}
                    className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <p className="font-medium text-gray-700">Coach Type</p>
                  <input
                    type="text"
                    name="type"
                    //   value={coachData.type}
                    ref={type}
                    // onChange={handleChange}
                    className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <p className="font-medium text-gray-700">Depot</p>
                  <input
                    type="text"
                    name="depot"
                    //   value={coachData.depot}
                    ref={depot}
                    // onChange={handleChange}
                    className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <p className="font-medium text-gray-700">Status</p>
                  <select
                    name="status"
                    //   value={coachData.status}
                    ref={status}
                    // onChange={handleChange}
                    className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required>
                    <option value="">Select</option>
                    <option value="active">Active</option>
                    <option value="under maintenance">Under Maintenance</option>
                    <option value="out of service">Out of Service</option>
                  </select>
                </div>

                <div className="text-sm text-gray-600">
                  Dates are set automatically on creation: last maintenance =
                  today, next due = +1 month.
                </div>

                {/* Buttons */}
                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-5 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition">
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow transition">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoachInputForm;
