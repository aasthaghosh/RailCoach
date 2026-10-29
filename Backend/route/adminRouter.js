/** @format */

const express = require("express");
const router = express.Router();
const { isadmin, AdminAuth } = require("../middleware/AdminAuth");
const { getAllUsers } = require("../Controller/auth");
const { backfillTaskCounts } = require("../Controller/auth");
const { getUserById, getUserTasksCount } = require("../Controller/auth");
const { createSuperAdmin } = require("../Controller/AuthUser");

router.get("/admin/users", AdminAuth, isadmin, getAllUsers);
router.get("/admin/users/:id", AdminAuth, isadmin, getUserById);
router.get(
  "/admin/users/:id/tasks/count",
  AdminAuth,
  isadmin,
  getUserTasksCount
);

router.post("/create-admin", createSuperAdmin);

// admin-only: run backfill aggregation to populate task counters
router.post(
  "/admin/backfill-task-counts",
  AdminAuth,
  isadmin,
  backfillTaskCounts
);

module.exports = router;
