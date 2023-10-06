import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    address1: { type: String, required: true },
    logo: { type: String },
    size: { type: String },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member",
      },
    ],
    teams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { versionKey: false },
  { timestamps: true }
);
export default mongoose.model("Organization", organizationSchema);