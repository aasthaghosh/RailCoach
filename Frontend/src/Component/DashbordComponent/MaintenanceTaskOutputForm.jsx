import React, { useEffect } from "react";

const MaintenanceTaskOutputForm = ({
  AddMaintenace = [],
  ContTask,
  deleteTask,
}) => {
  // Count tasks
  useEffect(() => {
    ContTask(AddMaintenace);
  }, [AddMaintenace, ContTask]);

  // Only approved tasks
  const approvedTasks = AddMaintenace.filter(
    (task) => task?.status === "APPROVED"
  );

  // Priority styles
  const priorityStyle = {
    low: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-red-100 text-red-700",
    critical: "bg-red-200 text-red-800 font-bold",
  };

  return (
    <div className="p-6">
      {/* PAGE TITLE */}
      <h1 className="text-3xl font-bold text-gray-900">
        Maintenance Tasks
      </h1>
      <p className="text-gray-500 mb-8">
        Approved maintenance tasks only
      </p>

      {/* EMPTY STATE */}
      {approvedTasks.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl font-semibold text-gray-400">
            No approved maintenance tasks
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Approved tasks will appear here automatically
          </p>
        </div>
      ) : (
        /* TASK GRID */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {approvedTasks.map((task, index) => (
            console.log("COACH:", task),
            <div
              key={task._id}
              style={{ animationDelay: `${index * 80}ms` }}
              className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 animate-fadeUp"
            >
              {/* TOP ROW */}
              <div className="flex justify-between items-start mb-4">
                {/* PRIORITY */}
                <span
                  className={`px-3 py-1 rounded-full text-xs uppercase tracking-wide ${
                    priorityStyle[task.priority] ??
                    "bg-gray-100 text-gray-600"
                  }`}
                >
                  {task.priority}
                </span>

                {/* DEPARTMENT */}
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {task.department?.toUpperCase()}
                </span>
              </div>

              {/* TASK TITLE */}
              <h3 className="text-xl font-bold text-blue-900 mb-1">
                <span className="text-black font-bold "> Title :  </span> {task.task}
              </h3>

              {/* COACH */}
              {
                <p className="text-blue-600 text-sm font-medium">
                  <span className="text-black font-bold "> Coach :  </span> {task.selectCoach.type}
                </p>
              }

              {/* assignedBy */}
              {
                <p className="text-blue-600 text-sm font-medium">
                  <span className="text-black font-bold ">Create_By : </span>  {task.assignedBy.first_name.toUpperCase()} {task.assignedBy.last_name.toUpperCase()}
                </p>
              }

              {/* approvedBy */} 
              {
                <p className="text-blue-600 text-sm font-medium">
                  <span className="text-black font-bold ">Approved_By : </span> {task.approvedBy.role?.toUpperCase()}
                </p>
              }

              {/* DESCRIPTION */}
              <p className="text-gray-700 mt-3 mb-6 line-clamp-3 text-lg">
                <span className="text-black font-bold text-lg">Problem : </span>{task.description}
              </p>

              {/* ACTION BUTTON */}
              <button
                onClick={() => deleteTask(task._id)}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-semibold transition-all duration-200 active:scale-95 shadow-md hover:shadow-lg"
              >
                ✔ Mark as Completed
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MaintenanceTaskOutputForm;
