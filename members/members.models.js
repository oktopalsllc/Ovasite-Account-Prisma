import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female", "Others"], index: true },
    phone: { type: String },
    address: { type: String },
    image: { type: String },
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
