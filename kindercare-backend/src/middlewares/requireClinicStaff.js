export default function requireClinicStaff(req, res, next) {
  if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });

  if (req.user.role !== "CLINIC_STAFF") {
    return res.status(403).json({ success: false, message: "Clinic staff only" });
  }
  if (!req.user.clinicId) {
    return res.status(403).json({ success: false, message: "ClinicId not set for this account" });
  }
  next();
}
