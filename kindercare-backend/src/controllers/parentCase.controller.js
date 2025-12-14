import Child from "../models/Child.model.js";
import Case from "../models/Case.model.js";

export const createCase = async (req, res) => {
  const parentId = req.user.id;
  const { childId, symptoms, severity, duration, inputType } = req.body;

  // Ownership check: child must belong to logged-in parent
  const child = await Child.findOne({ _id: childId, parentId });
  if (!child) return res.status(403).json({ success: false, message: "Invalid child access" });

  const c = await Case.create({
    parentId,
    childId,
    symptoms,
    severity,
    duration,
    inputType: inputType || "text",
    status: "SUBMITTED",
  });

  return res.status(201).json({ success: true, data: c });
};

export const listCases = async (req, res) => {
  const parentId = req.user.id;
  const { status, childId, page = 1, limit = 10 } = req.query;

  const query = { parentId };
  if (status) query.status = status;
  if (childId) query.childId = childId;

  const skip = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    Case.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Case.countDocuments(query),
  ]);

  return res.json({
    success: true,
    data: items,
    meta: { total, page: Number(page), limit: Number(limit) },
  });
};

export const getCase = async (req, res) => {
  const parentId = req.user.id;
  const { caseId } = req.params;

  const c = await Case.findOne({ _id: caseId, parentId }).populate("childId");
  if (!c) return res.status(404).json({ success: false, message: "Case not found" });

  return res.json({ success: true, data: c });
};

// Optional: allow parent to cancel their case if still not closed
export const cancelCase = async (req, res) => {
  const parentId = req.user.id;
  const { caseId } = req.params;

  const c = await Case.findOne({ _id: caseId, parentId });
  if (!c) return res.status(404).json({ success: false, message: "Case not found" });

  if (["CLOSED", "CANCELLED"].includes(c.status)) {
    return res.status(400).json({ success: false, message: "Case cannot be cancelled" });
  }

  c.status = "CANCELLED";
  await c.save();

  return res.json({ success: true, data: c });
};
