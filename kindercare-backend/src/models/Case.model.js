import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["image", "audio"], required: true },
    url: { type: String, required: true },
  },
  { _id: false }
);

const caseSchema = new mongoose.Schema(
  {
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    childId: { type: mongoose.Schema.Types.ObjectId, ref: "Child", required: true, index: true },

    symptoms: [{ type: String, required: true }], // e.g. ["fever", "cough"]
    severity: { type: String, enum: ["mild", "moderate", "severe"], required: true },
    duration: { type: String, required: true, trim: true }, // e.g. "2 days"
    inputType: { type: String, enum: ["text", "voice", "image", "mixed"], default: "text" },

    status: {
      type: String,
      enum: ["SUBMITTED", "IN_REVIEW", "FOLLOWUP_NEEDED", "CLOSED", "CANCELLED"],
      default: "SUBMITTED",
      index: true,
    },

    attachments: [attachmentSchema],

    // clinic updates (web app only)
    clinicId: { type: mongoose.Schema.Types.ObjectId, ref: "Clinic", required: true, index: true },

clinicNotes: [{ 
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  note: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now }
}],
  },
  { timestamps: true }
);

export default mongoose.model("Case", caseSchema);
