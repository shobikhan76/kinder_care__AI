import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

const signToken = (user) =>
  jwt.sign(
    { id: user._id.toString(), role: user.role, clinicId: user.clinicId || null },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, role, clinicId } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ success: false, message: "email, password, role are required" });
    }

    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) return res.status(409).json({ success: false, message: "Email already exists" });

    const passwordHash = await bcrypt.hash(String(password), 10);

    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      passwordHash,
      role, // ADMIN / CLINIC / PARENT
      clinicId: clinicId || null,
    });

    const token = signToken(user);

    return res.status(201).json({
      success: true,
      data: {
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, clinicId: user.clinicId },
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

    if (!user.isActive) return res.status(403).json({ success: false, message: "Account disabled" });

    const ok = await bcrypt.compare(String(password), user.passwordHash);
    if (!ok) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = signToken(user);

    return res.json({
      success: true,
      data: {
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, clinicId: user.clinicId },
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
