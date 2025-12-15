import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    childId: { type: mongoose.Schema.Types.ObjectId, ref: "Child", required: true, index: true },
    caseId: { type: mongoose.Schema.Types.ObjectId, ref: "Case" }, // optional link
    // Store clinic identifier as string to align with user IDs returned by public clinic listing
    clinicId: { type: String, required: true, index: true },

    preferredSlots: [{ type: Date, required: true }],
confirmedSlot: { type: Date }, // optional
clinicMessage: { type: String, trim: true }, // optional
    status: {
      type: String,
      enum: ["REQUESTED", "CONFIRMED", "RESCHEDULED", "CANCELLED", "COMPLETED"],
      default: "REQUESTED",
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);
