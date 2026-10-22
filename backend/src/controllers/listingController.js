import Listing from "../models/Listing.js";
import Claim from "../models/Claim.js";

const createHttpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const editableFields = [
  "title",
  "description",
  "category",
  "condition",
  "images",
  "locality",
  "pickupDetails",
  "status",
];

const createFields = editableFields.filter((field) => field !== "status");

const normalizeLocation = (body) => {
  if (!body || typeof body !== "object" || Array.isArray(body)) return body;
  const normalized = { ...body };
  for (const alias of ["location", "neighborhood"]) {
    if (Object.hasOwn(normalized, alias)) {
      if (!Object.hasOwn(normalized, "locality")) normalized.locality = normalized[alias];
      delete normalized[alias];
    }
  }
  return normalized;
};

const validateBody = (body, allowedFields) => {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw createHttpError(400, "Request body must be a JSON object");
  }

  const invalidFields = Object.keys(body).filter(
    (field) => !allowedFields.includes(field),
  );
  if (invalidFields.length > 0) {
    throw createHttpError(400, `Unsupported listing field: ${invalidFields[0]}`);
  }
};

const handleValidationError = (error) => {
  if (error.name === "ValidationError" || error.name === "CastError") {
    const fields =
      error.name === "ValidationError"
        ? Object.keys(error.errors)
        : [error.path].filter(Boolean);
    const message = fields.length
      ? `Invalid listing details for: ${fields.join(", ")}`
      : "Invalid listing details";
    throw createHttpError(400, message);
  }
  throw error;
};

const validateListingId = (id) => {
  if (!/^[a-f\d]{24}$/i.test(id)) {
    throw createHttpError(400, "Invalid listing ID");
  }
};

const getListingOr404 = async (id) => {
  validateListingId(id);
  const listing = await Listing.findById(id);
  if (!listing) {
    throw createHttpError(404, "Listing not found");
  }
  return listing;
};

const getListings = async (req, res) => {
  const pageValue = req.query.page ?? "1";
  const limitValue = req.query.limit ?? "20";
  if (
    typeof pageValue !== "string" ||
    typeof limitValue !== "string" ||
    !/^[1-9]\d*$/.test(pageValue) ||
    !/^[1-9]\d*$/.test(limitValue)
  ) {
    throw createHttpError(400, "Page and limit must be positive integers");
  }

  const page = Number(pageValue);
  const limit = Number(limitValue);
  if (
    !Number.isSafeInteger(page) ||
    !Number.isSafeInteger(limit) ||
    !Number.isSafeInteger((page - 1) * limit) ||
    limit > 100
  ) {
    throw createHttpError(400, "Page must be valid and limit cannot exceed 100");
  }

  const filter = { status: "available" };
  if (typeof req.query.category === "string" && req.query.category !== "All Categories") filter.category = req.query.category;
  if (typeof req.query.condition === "string") filter.condition = req.query.condition;
  if (typeof req.query.search === "string" && req.query.search.trim()) {
    const term = req.query.search.trim().slice(0, 100).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.$or = [{ title: { $regex: term, $options: "i" } }, { description: { $regex: term, $options: "i" } }, { locality: { $regex: term, $options: "i" } }];
  }
  const [listings, totalItems] = await Promise.all([
    Listing.find(filter)
      .select("-pickupDetails.instructions")
      .populate("owner", "name")
      .sort({ createdAt: -1, _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Listing.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: {
      listings,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    },
  });
};

const getMyListings = async (req, res) => {
  const listings = await Listing.find({ owner: req.user._id })
    .sort({ createdAt: -1, _id: -1 });
  res.status(200).json({ success: true, data: { listings } });
};

const getListing = async (req, res) => {
  validateListingId(req.params.id);
  const listing = await Listing.findById(req.params.id).select("-pickupDetails.instructions").populate("owner", "name");
  if (!listing) {
    throw createHttpError(404, "Listing not found");
  }
  res.status(200).json({ success: true, data: { listing } });
};

const createListing = async (req, res) => {
  const body = normalizeLocation(req.body);
  validateBody(body, createFields);
  try {
    const listing = await Listing.create({
      ...body,
      owner: req.user._id,
    });
    res.status(201).json({
      success: true,
      message: "Listing created successfully",
      data: { listing },
    });
  } catch (error) {
    handleValidationError(error);
  }
};

const updateListing = async (req, res) => {
  const body = normalizeLocation(req.body);
  validateBody(body, editableFields);
  if (Object.keys(body).length === 0) {
    throw createHttpError(400, "At least one listing field is required");
  }
  if (body.status && !["available", "withdrawn"].includes(body.status)) {
    throw createHttpError(400, "Claimed and completed statuses are managed through claims");
  }

  const listing = await getListingOr404(req.params.id);
  if (String(listing.owner) !== String(req.user._id)) {
    throw createHttpError(403, "Only the listing owner can update this listing");
  }
  if (body.status && ["claimed", "completed"].includes(listing.status)) {
    throw createHttpError(409, "A listing with an active or completed claim cannot change availability");
  }

  try {
    for (const field of editableFields) {
      if (Object.hasOwn(body, field)) {
        listing.set(field, body[field]);
      }
    }
    await listing.save();
  } catch (error) {
    handleValidationError(error);
  }

  res.status(200).json({
    success: true,
    message: "Listing updated successfully",
    data: { listing },
  });
};

const deleteListing = async (req, res) => {
  const listing = await getListingOr404(req.params.id);
  if (String(listing.owner) !== String(req.user._id)) {
    throw createHttpError(403, "Only the listing owner can delete this listing");
  }

  if (await Claim.exists({ listing: listing._id, status: { $in: ["pending", "accepted"] } })) {
    throw createHttpError(409, "Cancel the active claim before deleting this listing");
  }

  await listing.deleteOne();
  res.status(200).json({
    success: true,
    message: "Listing deleted successfully",
  });
};

export { createListing, deleteListing, getListing, getListings, getMyListings, updateListing };
