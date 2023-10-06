import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    fullName: { type: String },
    displayName: { type: String },
    email: { type: String, required: true, unique: true },
    birthDate: { type: Date },
    gender: { type: String, enum: ["Male", "Female", "Others"], index: true },
    contactNumber: { type: String },
    address: { type: String },
    image: { type: String },
    salary: { type: Number },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }],
    role: {
      type: String,
      enum: ["Owner", "Admin", "Member"],
      default: "Member",
    },
  },
  { versionKey: false },
  { timestamps: true }
);
const Member = mongoose.model("Member", memberSchema);

export default Member;
