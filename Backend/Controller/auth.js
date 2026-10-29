/** @format */

const User = require("../model/user");
const Task = require("../model/task");

// ================= AUTH CONTROLLER =================
exports.auth = async (req, res) => {
  try {
    // req.user must come from JWT middleware
    const userId = req.user.id;

    // fetch user without password
    const user = await User.findById(userId).select("-password").lean();

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // fetch tasks assigned by this user
    const tasks = await Task.find({ assignedBy: userId })
      .populate("selectCoach", "coachNumber type depot")
      .populate("approvedBy", "first_name last_name email role")
      .lean();

    // count completed tasks
    const tasksCompleted = tasks.filter(
      (task) => task.status === "APPROVED"
    ).length;

    return res.status(200).json({
      success: true,
      loggedIn: true,
      role: req.user.role,
      user,
      tasks,
      tasksCompleted,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= GET ALL USERS =================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

// ================= GET USER BY ID =================
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password").lean();

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // fetch tasks where the user is involved: created (assignedBy), approvedBy, or completedBy
    let tasks = await Task.find({ assignedBy: id })
      .populate("selectCoach", "coachNumber type depot")
      .populate("approvedBy", "first_name last_name email role")
      .populate("completedBy", "first_name last_name email role")
      .lean();

    // if the user didn't create any tasks, also show tasks where they approved or completed
    if (!tasks || tasks.length === 0) {
      tasks = await Task.find({
        $or: [{ assignedBy: id }, { approvedBy: id }, { completedBy: id }],
      })
        .populate("selectCoach", "coachNumber type depot")
        .populate("approvedBy", "first_name last_name email role")
        .populate("completedBy", "first_name last_name email role")
        .lean();
    }

    // counts for various task states where the user is the assigner
    const assignedApprovedCount = await Task.countDocuments({
      assignedBy: id,
      status: "APPROVED",
    });
    const assignedCompletedCount = await Task.countDocuments({
      assignedBy: id,
      status: "COMPLETED",
    });

    // counts for actions performed by this user
    const approvedByCount = await Task.countDocuments({
      approvedBy: id,
      status: "APPROVED",
    });
    const completedByCount = await Task.countDocuments({
      completedBy: id,
      status: "COMPLETED",
    });

    // debug log to help verify counts during testing
    // console.log(
    //   `getUserById: user=${id} tasks=${
    //     tasks ? tasks.length : 0
    //   } assignedApproved=${assignedApprovedCount} assignedCompleted=${assignedCompletedCount} approvedBy=${approvedByCount} completedBy=${completedByCount}`
    // );

    return res.status(200).json({
      success: true,
      user,
      tasks,
      assignedApprovedCount,
      assignedCompletedCount,
      tasksApprovedByUser: approvedByCount,
      tasksCompletedByUser: completedByCount,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= COUNT COMPLETED TASKS =================
exports.getUserTasksCount = async (req, res) => {
  try {
    const { id } = req.params;

    const count = await Task.countDocuments({
      assignedBy: id,
      status: "APPROVED",
    });

    return res.status(200).json({
      success: true,
      count,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= BACKFILL TASK COUNTS (ADMIN) =================
exports.backfillTaskCounts = async (req, res) => {
  try {
    // aggregate counts from Task collection
    const assignedAgg = await Task.aggregate([
      { $match: { assignedBy: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: "$assignedBy",
          assignedApproved: {
            $sum: { $cond: [{ $eq: ["$status", "APPROVED"] }, 1, 0] },
          },
          assignedCompleted: {
            $sum: { $cond: [{ $eq: ["$status", "COMPLETED"] }, 1, 0] },
          },
        },
      },
    ]);

    const approvedAgg = await Task.aggregate([
      {
        $match: {
          approvedBy: { $exists: true, $ne: null },
          status: "APPROVED",
        },
      },
      { $group: { _id: "$approvedBy", approvedCount: { $sum: 1 } } },
    ]);

    const completedAgg = await Task.aggregate([
      {
        $match: {
          completedBy: { $exists: true, $ne: null },
          status: "COMPLETED",
        },
      },
      { $group: { _id: "$completedBy", completedCount: { $sum: 1 } } },
    ]);

    const assignedMap = {};
    assignedAgg.forEach((a) => {
      assignedMap[a._id.toString()] = a;
    });
    const approvedMap = {};
    approvedAgg.forEach((a) => {
      approvedMap[a._id.toString()] = a.approvedCount;
    });
    const completedMap = {};
    completedAgg.forEach((a) => {
      completedMap[a._id.toString()] = a.completedCount;
    });

    const userIds = new Set([
      ...Object.keys(assignedMap),
      ...Object.keys(approvedMap),
      ...Object.keys(completedMap),
    ]);

    let updates = 0;
    for (const uid of userIds) {
      const assigned = assignedMap[uid] || {
        assignedApproved: 0,
        assignedCompleted: 0,
      };
      const approved = approvedMap[uid] || 0;
      const completed = completedMap[uid] || 0;

      await User.findByIdAndUpdate(uid, {
        $set: {
          tasksAssignedApprovedCount: assigned.assignedApproved || 0,
          tasksAssignedCompletedCount: assigned.assignedCompleted || 0,
          tasksApprovedCount: approved,
          tasksCompletedCount: completed,
        },
      });
      updates++;
    }

    return res.status(200).json({
      success: true,
      message: `Updated ${updates} user documents with task counts`,
      updated: updates,
    });
  } catch (err) {
    console.error("backfill error", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
