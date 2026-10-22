import mongoose from "mongoose";

const pickupWindowSchema = new mongoose.Schema(
  {
    start: {
      type: Date,
      required: [true, "Pickup window start is required"],
    },
    end: {
      type: Date,
      required: [true, "Pickup window end is required"],
    },
  },
  { _id: false },
);

const claimSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: [true, "Listing is required"],
    },
    claimant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Claimant is required"],
    },
    pickupWindow: {
      type: pickupWindowSchema,
      required: [true, "Pickup window is required"],
      validate: {
        validator: (window) => window.start < window.end,
        message: "Pickup window end must be after its start",
      },
    },
    note: {
      type: String,
      trim: true,
      maxlength: [500, "Note cannot exceed 500 characters"],
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "cancelled", "completed"],
      default: "pending",
    },
    passCode: { type: String, required: true, select: false },
  },
  { timestamps: true },
);

claimSchema.index({ listing: 1, status: 1 });
claimSchema.index({ claimant: 1, listing: 1 }, { unique: true, partialFilterExpression: { status: { $in: ["pending", "accepted"] } } });
claimSchema.index({ passCode: 1 }, { unique: true, sparse: true });

const Claim = mongoose.model("Claim", claimSchema);

export default Claim;
