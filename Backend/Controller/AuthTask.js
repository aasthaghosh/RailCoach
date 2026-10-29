/** @format */

// // to import the task Schema from the models -> task.js
// const Task = require('../model/task')

// exports.TaskData = async (req, res) => {
//     try {
//         // to take the data from the body;
//         const { selectCoach, task, priority, department, assignedBy, description } = req.body;

//         const CreateTask = await Task.create({ selectCoach, task, priority, department, assignedBy, description })
//         return res.status(200).json({ succ: true, coach: CreateTask, mess: 'coach is created' })

//     } catch (err) {
//         console.log(err)
//         return res.status(500).json({ mess: err, suss: false });
//     }
// }

// // to get all the task
// exports.AllTask = async (req, res) => {
//     try {
//         const tasks = await Task.find()
//             .populate("selectCoach")      // get full Coach info
//             .populate("assignedBy");      // get full User info

//         return res.status(200).json({
//             succ: true,
//             tasks
//         });

//     } catch (err) {
//         console.log(err);
//         return res.status(500).json({ mess: err.message, succ: false });
//     }
// }

// // to delete the Task;
// exports.DeleteTask = async (req, res) => {
//   try {
//     //! patams se isliye liya h kyuki hum isme axious use kr rhe h to vo data url se send krta h ;
//     const { id } = req.params;
//     console.log(req.params)

//     const deletedTask = await Task.findByIdAndDelete(id);

//     if (!deletedTask) {
//       return res.status(404).json({
//         success: false,
//         message: "Task not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Task deleted successfully",
//       data: deletedTask,
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       success: false,
//       message: "Task is not deleted",
//     });
//   }
// };

//!_____________________________________new code___________________________________
// import the task Schema
const Task = require("../model/task");
const User = require("../model/user");

/* ======================================
   USER → CREATE TASK (PENDING)
====================================== */
exports.TaskData = async (req, res) => {
  try {
    const { selectCoach, task, priority, department, assignedBy, description } =
      req.body;

    const CreateTask = await Task.create({
      selectCoach,
      task,
      priority,
      department,
      assignedBy,
      description,
      status: "PENDING", // IMPORTANT
    });

    return res.status(201).json({
      success: true,
      message: "Task sent to admin for approval",
      task: CreateTask,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ======================================
   USER → GET ONLY APPROVED TASKS
====================================== */
exports.AllTask = async (req, res) => {
  try {
    const tasks = await Task.find({ status: "APPROVED" })
      .populate("selectCoach")
      .populate("assignedBy")
      .populate("approvedBy");

    return res.status(200).json({
      success: true,
      tasks,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ======================================
   ADMIN → GET PENDING TASKS
====================================== */
exports.PendingTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ status: "PENDING" })
      .populate("selectCoach")
      .populate("assignedBy", "first_name last_name email");

    return res.status(200).json({
      success: true,
      tasks,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ======================================
   ADMIN → APPROVE TASK
====================================== */
exports.ApproveTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findByIdAndUpdate(
      id,
      {
        status: "APPROVED",
        approvedBy: req.user.id,
      },
      { new: true }
    )
      .populate("selectCoach", "name email")
      .populate("assignedBy", "first_name last_name email")
      .populate("approvedBy", "first_name last_name email");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // increment counters: user who approved and the user who assigned the task
    try {
      await User.findByIdAndUpdate(req.user.id, {
        $inc: { tasksApprovedCount: 1 },
      });
      if (task.assignedBy) {
        await User.findByIdAndUpdate(task.assignedBy, {
          $inc: { tasksAssignedApprovedCount: 1 },
        });
      }
    } catch (e) {
      console.error("warning: failed to update user counters on approve", e);
    }

    return res.status(200).json({
      success: true,
      message: "Task approved successfully",
      task,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ======================================
   ADMIN → REJECT TASK
====================================== */
exports.RejectTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findByIdAndUpdate(
      id,
      { status: "REJECTED" },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task rejected",
      task,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ======================================
   ADMIN → DELETE TASK (OPTIONAL)
====================================== */
exports.DeleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Task is not deleted",
    });
  }
};

/* ======================================
   USER → MARK TASK AS COMPLETED
====================================== */
exports.CompleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task)
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });

    task.status = "COMPLETED";
    task.completedBy = req.user.id;
    task.completedAt = new Date();

    await task.save();

    const populated = await Task.findById(task._id)
      .populate("selectCoach", "coachNumber type depot")
      .populate("assignedBy", "first_name last_name email")
      .populate("approvedBy", "first_name last_name email")
      .populate("completedBy", "first_name last_name email");

    // increment counters: user who completed and the user who assigned the task
    try {
      if (task.completedBy) {
        await User.findByIdAndUpdate(task.completedBy, {
          $inc: { tasksCompletedCount: 1 },
        });
      }
      if (task.assignedBy) {
        await User.findByIdAndUpdate(task.assignedBy, {
          $inc: { tasksAssignedCompletedCount: 1 },
        });
      }
    } catch (e) {
      console.error("warning: failed to update user counters on complete", e);
    }

    return res.status(200).json({
      success: true,
      message: "Task marked completed",
      task: populated,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
