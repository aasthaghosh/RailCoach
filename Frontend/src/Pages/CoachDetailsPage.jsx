/** @format */

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const CoachDetailsPage = ({ AddCoach, UpdateCoachData }) => {
  const { id } = useParams();
  const nav = useNavigate();

  const coach = AddCoach[id];

  const [data, setData] = useState({
    coachNumber: coach.coachNumber,
    type: coach.type,
    depot: coach.depot,
    status: coach.status,
    lastMaintenance: coach.lastMaintenance
      ? new Date(coach.lastMaintenance).toISOString().slice(0, 10)
      : "",
    nextDue: coach.nextDue
      ? new Date(coach.nextDue).toISOString().slice(0, 10)
      : "",
  });

  const [maintenanceDue, setMaintenanceDue] = useState(false);

  useEffect(() => {
    const toISODate = (d) => {
      if (!d) return null;
      try {
        return new Date(d).toISOString().slice(0, 10);
      } catch (e) {
        return null;
      }
    };

    const lm = toISODate(data.lastMaintenance);
    const nd = toISODate(data.nextDue);
    if (lm && nd && lm === nd) {
      setMaintenanceDue(true);
      toast.info(
        "Maintenance is due for this coach — please send it for maintenance."
      );
    } else {
      setMaintenanceDue(false);
    }
  }, [data.lastMaintenance, data.nextDue]);

  function changeHandler(e) {
    const { name, value } = e.target;
    if (name === "nextDue" || name === "lastMaintenance") return;
    setData((prev) => ({ ...prev, [name]: value }));
  }

  async function updateHandler(e) {
    e.preventDefault();
    try {
      const payload = {
        coachNumber: data.coachNumber,
        type: data.type,
        depot: data.depot,
        status: data.status,
      };

      const res = await axios.patch(
        `http://localhost:4000/api/v1/coach/${coach._id}`,
        payload,
        { withCredentials: true }
      );

      if (res.status === 200 && res.data.coach) {
        UpdateCoachData(id, res.data.coach);
        alert("Coach Updated Successfully!");
        nav("/coachprofile");
      } else {
        alert(res.data.mess || "Update failed");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.mess || "Update failed");
    }
  }

  return (
    <div className="min-h-screen bg-[#f2f6ff] py-10">
      {/* GOVERNMENT HEADER STRIP */}
      <div className="bg-[#0b3d91] text-white py-4 shadow-md mb-10">
        <h1 className="text-center text-2xl font-semibold tracking-wide">
          Indian Railways • Coach Management System
        </h1>
      </div>

      <div className="max-w-3xl mx-auto bg-white border border-gray-300 rounded-lg shadow-lg">
        {/* FORM HEADER */}
        <div className="bg-[#dce6ff] border-b border-gray-300 px-6 py-4 rounded-t-lg">
          <h2 className="text-xl font-bold text-[#0b3d91]">
            Edit Coach Information
          </h2>
          <p className="text-gray-600 text-sm">
            Coach No: <span className="font-medium">{coach.coachNumber}</span>
          </p>
        </div>

        {/* FORM BODY */}
        <form onSubmit={updateHandler} className="px-6 py-6 space-y-5">
          {/* Coach Number */}
          <GovInput
            label="Coach Number"
            name="coachNumber"
            value={data.coachNumber}
            onChange={changeHandler}
          />

          {/* Type */}
          <GovInput
            label="Coach Type"
            name="type"
            value={data.type}
            onChange={changeHandler}
          />

          {/* Depot */}
          <GovInput
            label="Depot"
            name="depot"
            value={data.depot}
            onChange={changeHandler}
          />

          {/* Status */}
          <div>
            <label className="font-semibold text-gray-700">Status</label>
            <select
              name="status"
              value={data.status}
              onChange={changeHandler}
              className="w-full border border-gray-400 rounded-md p-2.5 mt-1 bg-white focus:ring-1 focus:ring-blue-600 focus:border-blue-700">
              <option value="active">Active</option>
              <option value="under maintenance">Under Maintenance</option>
              <option value="out of service">Out of Service</option>
            </select>
          </div>

          {/* Notice when maintenance is due */}
          {maintenanceDue && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-yellow-800">
              This coach's maintenance is due — please send it for maintenance.
            </div>
          )}

          {/* Last Maintenance (system-managed) */}
          <GovInput
            label="Last Maintenance Date"
            name="lastMaintenance"
            type="date"
            value={data.lastMaintenance}
            onChange={changeHandler}
            disabled={true}
          />

          {/* Next Due */}
          <div>
            <label className="font-semibold text-gray-700">
              Next Due (Not Editable)
            </label>
            <input
              type="date"
              name="nextDue"
              value={data.nextDue}
              disabled
              className="w-full border border-gray-300 bg-gray-200 text-gray-600 rounded-md p-2.5 mt-1 cursor-not-allowed"
            />
          </div>

          {/* BUTTONS */}
          <div className="flex justify-between pt-4 border-t mt-6">
            <button
              type="button"
              onClick={() => nav(-1)}
              className="px-5 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600">
              Back
            </button>
            <div className="flex gap-3">
              {/* Mark maintenance done button: show when coach is under maintenance or maintenanceDue */}
              {(coach.status === "under maintenance" || maintenanceDue) && (
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const res = await axios.patch(
                        `http://localhost:4000/api/v1/coach/${coach._id}/maintenance-done`,
                        {},
                        { withCredentials: true }
                      );
                      if (res.status === 200 && res.data.coach) {
                        const updatedCoach = res.data.coach;
                        UpdateCoachData(id, updatedCoach);
                        setData((prev) => ({
                          ...prev,
                          coachNumber: updatedCoach.coachNumber,
                          type: updatedCoach.type,
                          depot: updatedCoach.depot,
                          status: updatedCoach.status,
                          lastMaintenance: updatedCoach.lastMaintenance
                            ? new Date(updatedCoach.lastMaintenance)
                                .toISOString()
                                .slice(0, 10)
                            : "",
                          nextDue: updatedCoach.nextDue
                            ? new Date(updatedCoach.nextDue)
                                .toISOString()
                                .slice(0, 10)
                            : "",
                        }));
                        toast.success("Maintenance completed — dates updated");
                        nav("/coachprofile");
                      } else {
                        toast.error(
                          res.data.mess || "Could not complete maintenance"
                        );
                      }
                    } catch (err) {
                      console.error(err);
                      toast.error(
                        err.response?.data?.mess ||
                          "Could not complete maintenance"
                      );
                    }
                  }}
                  className="px-5 py-2 rounded-md bg-yellow-500 text-white hover:bg-yellow-600">
                  Mark Maintenance Done
                </button>
              )}

              <button
                type="submit"
                className="px-5 py-2 rounded-md bg-[#0b3d91] text-white hover:bg-[#0a347e]">
                Update Coach
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// GOVERNMENT STYLE INPUT COMPONENT
const GovInput = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  disabled = false,
}) => (
  <div>
    <label className="font-semibold text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full border border-gray-400 rounded-md p-2.5 mt-1 focus:ring-1 focus:ring-blue-600 focus:border-blue-700 ${
        disabled ? "bg-gray-200 text-gray-600 cursor-not-allowed" : "bg-white"
      }`}
      required={!disabled}
    />
  </div>
);

export default CoachDetailsPage;
