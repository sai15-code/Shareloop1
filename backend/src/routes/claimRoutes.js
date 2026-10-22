import { Router } from "express";
import requireAuth from "../middleware/requireAuth.js";
import asyncHandler from "../utils/asyncHandler.js";
import { createClaim, getClaimsForMyListings, getMyClaims, updateClaimStatus } from "../controllers/claimController.js";

const router = Router();
router.use(requireAuth);
router.get("/mine", asyncHandler(getMyClaims));
router.get("/received", asyncHandler(getClaimsForMyListings));
router.post("/", asyncHandler(createClaim));
router.patch("/:id/status", asyncHandler(updateClaimStatus));
export default router;
