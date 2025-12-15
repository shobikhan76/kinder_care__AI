import User from "../models/User.model.js";

export const listClinics = async (req, res) => {
  try {
    
    const { q } = req.query; // optional search by name

    const filter = { role: "CLINIC" };
    if (q) filter.name = { $regex: q, $options: "i" };

    const clinics = await User.find(filter)
      .select("_id name email")
      .sort({ name: 1 });

    return res.json({
      success: true,
      data: clinics.map((u) => ({
        clinicId: u._id.toString(),   // use this in cases/appointments
        clinicName: u.name,           // show this in UI
        email: u.email,
      })),
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
