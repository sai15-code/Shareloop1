import { randomInt } from "node:crypto";
import mongoose from "mongoose";
import Claim from "../models/Claim.js";
import Listing from "../models/Listing.js";

const fail = (status, message) => Object.assign(new Error(message), { status });
const validId = (id) => { if (!mongoose.isValidObjectId(id)) throw fail(400, "Invalid ID"); };
const populateClaim = (query) => query.populate({ path: "listing", populate: { path: "owner", select: "name" } });

export const createClaim = async (req, res) => {
  const { listingId, pickupWindow, note = "" } = req.body || {};
  if (!mongoose.isValidObjectId(listingId)) throw fail(400, "A valid listingId is required");
  if (!pickupWindow || !Number.isFinite(Date.parse(pickupWindow.start)) || !Number.isFinite(Date.parse(pickupWindow.end)) || Date.parse(pickupWindow.start) >= Date.parse(pickupWindow.end)) throw fail(400, "A valid pickup window is required");
  if (typeof note !== "string" || note.length > 500) throw fail(400, "Note cannot exceed 500 characters");
  const listing = await Listing.findById(listingId);
  if (!listing) throw fail(404, "Listing not found");
  if (String(listing.owner) === String(req.user._id)) throw fail(409, "You cannot claim your own listing");
  if (listing.status !== "available") throw fail(409, "Listing is no longer available");
  let claim;
  let passCode;
  for (let attempt = 0; attempt < 5 && !claim; attempt += 1) {
    passCode = `PIN-PASS #${randomInt(100000, 1000000)}`;
    try {
      claim = await Claim.create({ listing: listing._id, claimant: req.user._id, pickupWindow, note: note.trim(), passCode });
    } catch (error) {
      if (error.code === 11000 && error.keyPattern?.passCode) continue;
      if (error.code === 11000) throw fail(409, "You already have an active claim for this listing");
      throw error;
    }
  }
  if (!claim) throw fail(503, "Unable to generate a pickup pass. Please try again.");
  const reserved = await Listing.findOneAndUpdate({ _id: listing._id, status: "available" }, { $set: { status: "claimed" } }, { new: true });
  if (!reserved) { await claim.deleteOne(); throw fail(409, "Listing is no longer available"); }
  res.status(201).json({ success: true, data: { claim: { ...claim.toObject(), passCode } } });
};

export const getMyClaims = async (req, res) => {
  const claims = await populateClaim(Claim.find({ claimant: req.user._id }).select("+passCode").sort({ createdAt: -1 }));
  for (const claim of claims) {
    if (claim.status !== "accepted" && claim.status !== "completed" && claim.listing?.pickupDetails) {
      claim.listing.pickupDetails.instructions = undefined;
    }
  }
  res.json({ success: true, data: { claims } });
};

export const getClaimsForMyListings = async (req, res) => {
  const ownedListings = await Listing.find({ owner: req.user._id }).distinct("_id");
  const claims = await Claim.find({ listing: { $in: ownedListings } })
    .populate("claimant", "name")
    .populate("listing")
    .sort({ createdAt: -1 });
  res.json({ success: true, data: { claims } });
};

export const updateClaimStatus = async (req, res) => {
  validId(req.params.id);
  const { status } = req.body || {};
  if (!["accepted", "rejected", "cancelled", "completed"].includes(status)) throw fail(400, "Invalid claim status");
  const claim = await Claim.findById(req.params.id);
  if (!claim) throw fail(404, "Claim not found");
  const listing = await Listing.findById(claim.listing);
  if (!listing) throw fail(404, "Listing not found");
  const isClaimant = String(claim.claimant) === String(req.user._id);
  const isOwner = String(listing.owner) === String(req.user._id);
  if ((status === "cancelled" || status === "completed") ? !isClaimant : !isOwner) throw fail(403, "Not allowed to update this claim");
  if (claim.status !== "pending" && !(claim.status === "accepted" && ["cancelled", "completed"].includes(status))) throw fail(409, "Claim can no longer be changed");
  claim.status = status;
  await claim.save();
  if (["cancelled", "rejected"].includes(status)) await Listing.findOneAndUpdate({ _id: listing._id, status: "claimed" }, { $set: { status: "available" } });
  else if (status === "completed") { listing.status = "completed"; await listing.save(); }
  const populated = await populateClaim(Claim.findById(claim._id).select("+passCode"));
  res.json({ success: true, data: { claim: populated } });
};
