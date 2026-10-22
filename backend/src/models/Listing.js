import mongoose from "mongoose";

const donorSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, maxlength: 80 },
    avatar: { type: String, trim: true, maxlength: 2048 },
    rehomedCount: { type: Number, min: 0 },
    badge: { type: String, enum: ["verified", "verified_user", "eco"] },
    responseRate: { type: String, trim: true, maxlength: 80 },
    joinedYear: { type: String, trim: true, maxlength: 4 },
  },
  { _id: false },
);

const mapCoordsSchema = new mongoose.Schema(
  {
    x: { type: Number, min: 0, max: 100, required: true },
    y: { type: Number, min: 0, max: 100, required: true },
  },
  { _id: false },
);

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [120, "Title cannot exceed 120 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
      maxlength: [3000, "Description cannot exceed 3000 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Books & Media",
        "Electronics",
        "Furniture",
        "Clothing & Shoes",
        "Kitchen & Dining",
        "Tools & Hardware",
      ],
    },
    condition: {
      type: String,
      required: [true, "Condition is required"],
      enum: [
        "Brand New (In Box)",
        "Like New (Flawless)",
        "Gently Used",
        "Functional / Needs TLC",
      ],
    },
    subCategory: { type: String, trim: true, maxlength: 120 },
    conditionDescription: { type: String, trim: true, maxlength: 1000 },
    altText: { type: String, trim: true, maxlength: 500 },
    distance: { type: Number, min: 0 },
    timeAgo: { type: String, trim: true, maxlength: 80 },
    dimensions: { type: String, trim: true, maxlength: 300 },
    weightEst: { type: String, trim: true, maxlength: 80 },
    donor: { type: donorSchema, default: undefined },
    mapCoords: { type: mapCoordsSchema, default: undefined },
    seedSourceId: { type: String, trim: true, maxlength: 80, select: false },
    images: {
      type: [
        {
          type: String,
          trim: true,
          maxlength: [2048, "Image URL cannot exceed 2048 characters"],
        },
      ],
      default: [],
      validate: [
        { validator: (images) => images.length <= 10, message: "A listing cannot have more than 10 images" },
        { validator: (images) => images.every((image) => /^https?:\/\//i.test(image)), message: "Images must use a public HTTP or HTTPS URL" },
      ],
    },
    locality: {
      type: String,
      required: [true, "Locality is required"],
      trim: true,
      minlength: [2, "Locality must be at least 2 characters"],
      maxlength: [120, "Locality cannot exceed 120 characters"],
    },
    pickupDetails: {
      handoverType: {
        type: String,
        required: [true, "Handover type is required"],
        enum: ["Porch Pickup", "Public Meetup", "Curbside Alert"],
      },
      instructions: {
        type: String,
        required: [true, "Pickup instructions are required"],
        trim: true,
        minlength: [5, "Pickup instructions must be at least 5 characters"],
        maxlength: [1000, "Pickup instructions cannot exceed 1000 characters"],
      },
    },
    status: {
      type: String,
      enum: ["available", "claimed", "completed", "withdrawn"],
      default: "available",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Listing owner is required"],
    },
  },
  { timestamps: true },
);

listingSchema.index({ seedSourceId: 1 }, { unique: true, sparse: true });

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
