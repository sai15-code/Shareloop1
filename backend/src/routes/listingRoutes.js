import { Router } from "express";
import {
  createListing,
  deleteListing,
  getListing,
  getListings,
  getMyListings,
  updateListing,
} from "../controllers/listingController.js";
import requireAuth from "../middleware/requireAuth.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(getListings));
router.get("/mine", requireAuth, asyncHandler(getMyListings));
router.get("/:id", asyncHandler(getListing));
router.post("/", requireAuth, asyncHandler(createListing));
router.patch("/:id", requireAuth, asyncHandler(updateListing));
router.delete("/:id", requireAuth, asyncHandler(deleteListing));

export default router;
