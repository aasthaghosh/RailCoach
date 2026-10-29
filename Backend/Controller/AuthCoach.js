/** @format */

// to import the Coach Schema from the models -> coach.js
const Coach = require("../model/coach");

// create the function and export also
exports.CoachData = async (req, res) => {
  try {
    // to take the data from the body;
    const { coachNumber, type, depot, status } = req.body;

    // normalize status to match schema enum (store lowercase)
    const normalizeStatus = (s) => {
      if (!s && s !== "") return s;
      try {
        return s.toString().trim().toLowerCase();
      } catch (e) {
        return s;
      }
    };
    const normStatus = normalizeStatus(status);

    // set system-managed maintenance dates: lastMaintenance = now, nextDue = +1 month
    const now = new Date();
    const next = new Date(now);
    next.setMonth(next.getMonth() + 1);
    const lastMaintenance = now.toISOString();
    const nextDue = next.toISOString();

    const EnterCoachNo = await Coach.findOne({ coachNumber });
    // to check the coach is present in the database or not
    if (EnterCoachNo)
      return res
        .status(400)
        .json({ succ: false, mess: "this coach is already exist" });

    const CoachCreate = await Coach.create({
      coachNumber,
      type,
      depot,
      status: normStatus,
      lastMaintenance,
      nextDue,
    });
    return res
      .status(200)
      .json({ succ: true, coach: CoachCreate, mess: "coach is created" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ mess: err, suss: false });
  }
};

// update coach by id
exports.updateCoach = async (req, res) => {
  try {
    const { id } = req.params;
    const { coachNumber, type, depot, status } = req.body;
    // Prevent clients from modifying maintenance dates directly — only allow via maintenance endpoint
    if (
      Object.prototype.hasOwnProperty.call(req.body, "lastMaintenance") ||
      Object.prototype.hasOwnProperty.call(req.body, "nextDue")
    ) {
      return res.status(400).json({
        succ: false,
        mess: "Cannot modify maintenance dates directly; use the maintenance-done endpoint.",
      });
    }
    const normalizeStatus = (s) => {
      if (!s && s !== "") return s;
      try {
        return s.toString().trim().toLowerCase();
      } catch (e) {
        return s;
      }
    };
    const normStatus = normalizeStatus(status);

    // basic validation for fields we allow is done by mongoose validators on update

    // load existing coach to check maintenance state and uniqueness
    const existing = await Coach.findById(id);
    if (!existing)
      return res.status(404).json({ succ: false, mess: "Coach not found" });

    // if maintenance is due (lastMaintenance date equals nextDue date), disallow updates to prevent tampering
    const toISO = (d) => {
      try {
        return new Date(d).toISOString().slice(0, 10);
      } catch (e) {
        return null;
      }
    };
    const existingLM = toISO(existing.lastMaintenance);
    const existingND = toISO(existing.nextDue);
    if (existingLM && existingND && existingLM === existingND) {
      return res.status(400).json({
        succ: false,
        mess: "Coach is due for maintenance; updates are not allowed until maintenance is completed.",
      });
    }

    // if coachNumber is being changed, ensure uniqueness
    if (coachNumber) {
      const conflict = await Coach.findOne({ coachNumber, _id: { $ne: id } });
      if (conflict)
        return res.status(400).json({
          succ: false,
          mess: "Another coach with this number already exists",
        });
    }

    const updated = await Coach.findByIdAndUpdate(
      id,
      {
        coachNumber,
        type,
        depot,
        status: normStatus,
      },
      { new: true, runValidators: true }
    );

    if (!updated)
      return res.status(404).json({ succ: false, mess: "Coach not found" });

    return res
      .status(200)
      .json({ succ: true, coach: updated, mess: "Coach updated" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mess: err.message, suss: false });
  }
};

// mark maintenance done: set lastMaintenance = today, nextDue = +1 month, set status to 'active'
exports.completeMaintenance = async (req, res) => {
  try {
    const { id } = req.params;

    const coach = await Coach.findById(id);
    if (!coach)
      return res.status(404).json({ succ: false, mess: "Coach not found" });

    // set lastMaintenance to the coach's current nextDue (the date maintenance was due)
    // and set nextDue to one month after that
    let dueDate = new Date(coach.nextDue);
    if (isNaN(dueDate)) {
      // fallback to now if nextDue invalid
      dueDate = new Date();
    }
    const newNext = new Date(dueDate);
    newNext.setMonth(newNext.getMonth() + 1);

    coach.lastMaintenance = dueDate.toISOString();
    coach.nextDue = newNext.toISOString();
    coach.status = "active";

    await coach.save();

    return res.status(200).json({
      succ: true,
      coach,
      mess: "Maintenance completed; dates updated",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ succ: false, mess: err.message });
  }
};

// request maintenance: mark coach with a request flag so admin can review
exports.requestMaintenance = async (req, res) => {
  try {
    const { id } = req.params;
    const { requestedBy } = req.body || {};
    const coach = await Coach.findById(id);
    if (!coach)
      return res.status(404).json({ succ: false, mess: "Coach not found" });

    // mark request
    coach.maintenanceRequested = true;
    coach.maintenanceRequestAt = new Date().toISOString();
    if (requestedBy) coach.maintenanceRequestedBy = requestedBy;

    await coach.save();
    return res
      .status(200)
      .json({ succ: true, mess: "Maintenance requested", coach });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ succ: false, mess: err.message });
  }
};

// approve maintenance (admin): only approve if a request exists
exports.approveMaintenance = async (req, res) => {
  try {
    const { id } = req.params;
    const coach = await Coach.findById(id);
    if (!coach)
      return res.status(404).json({ succ: false, mess: "Coach not found" });

    if (!coach.maintenanceRequested)
      return res
        .status(400)
        .json({ succ: false, mess: "No maintenance request to approve" });

    // perform maintenance completion: set lastMaintenance = previous nextDue, nextDue += 1 month
    let dueDate = new Date(coach.nextDue);
    if (isNaN(dueDate)) dueDate = new Date();
    const newNext = new Date(dueDate);
    newNext.setMonth(newNext.getMonth() + 1);

    coach.lastMaintenance = dueDate.toISOString();
    coach.nextDue = newNext.toISOString();
    coach.status = "active";
    coach.maintenanceRequested = false;
    coach.maintenanceRequestAt = undefined;
    coach.maintenanceRequestedBy = undefined;

    await coach.save();
    return res
      .status(200)
      .json({ succ: true, mess: "Maintenance approved and applied", coach });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ succ: false, mess: err.message });
  }
};

// to get all the coach data from the data base;
exports.allCoachData = async (req, res) => {
  try {
    const coaches = await Coach.find();
    res.status(200).json({ success: true, coaches });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
