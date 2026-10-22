import "dotenv/config";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { INITIAL_ITEMS, MORE_ITEMS } from "../../src/data/mockData.ts";
import Listing from "../src/models/Listing.js";
import User from "../src/models/User.js";

dotenv.config({ path: fileURLToPath(new URL("../.env", import.meta.url)), quiet: true });

const demoOwnerEmail = "shareloop-demo-listings@seed.shareloop.invalid";
const demoOwnerName = "ShareLoop Demo Listings";
const items = [...INITIAL_ITEMS, ...MORE_ITEMS];

const getDatabaseName = (uri: string) => {
  const pathname = new URL(uri).pathname.slice(1);
  return pathname.split("?")[0] || "test";
};

const run = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI must be set in backend/.env.");
  if (getDatabaseName(uri) !== "shareloop") {
    throw new Error("Refusing to seed: the configured MongoDB database is not named shareloop.");
  }
  await mongoose.connect(uri);
  try {
    const databaseName = mongoose.connection.name;
    if (databaseName !== "shareloop") throw new Error("Connected database is not shareloop; no records were seeded.");

    await Listing.init();
    const collection = mongoose.connection.collection("listings");
    const beforeCount = await collection.countDocuments();

    const seedRows = items.map((item) => ({
      seedSourceId: item.id,
      title: item.title,
      description: item.description,
      category: item.category,
      condition: item.condition,
      subCategory: item.subCategory,
      conditionDescription: item.conditionDescription,
      images: item.image ? [item.image] : [],
      altText: item.altText,
      locality: item.neighborhood,
      distance: item.distance,
      timeAgo: item.timeAgo,
      dimensions: item.dimensions,
      weightEst: item.weightEst,
      donor: item.donor,
      mapCoords: item.mapCoords,
      pickupDetails: {
        handoverType: item.handoverProtocol,
        instructions: "Coordinate the handover with the listing owner after a claim is accepted.",
      },
      status: "available",
    }));

    for (const row of seedRows) {
      await new Listing({ ...row, owner: new mongoose.Types.ObjectId() }).validate();
    }

    let skipped = 0;
    const rowsToInsert = [];

    for (const row of seedRows) {
      const duplicate = await Listing.findOne({
        $or: [
          { seedSourceId: row.seedSourceId },
          { title: row.title, locality: row.locality, description: row.description },
        ],
      }).select("_id");
      if (duplicate) {
        skipped += 1;
        continue;
      }
      rowsToInsert.push(row);
    }

    const existingDemoOwner = await User.findOne({ email: demoOwnerEmail }).select("_id name");
    if (existingDemoOwner && existingDemoOwner.name !== demoOwnerName) {
      throw new Error("The reserved demo-owner email is already used by a different account; no listings were seeded.");
    }
    const owner = rowsToInsert.length === 0 ? existingDemoOwner : existingDemoOwner || await User.create({
      name: demoOwnerName,
      email: demoOwnerEmail,
      passwordHash: await bcrypt.hash(randomBytes(48).toString("base64url"), 12),
    });

    let inserted = 0;
    for (const row of rowsToInsert) {

      try {
        await Listing.create({
          ...row,
          owner: owner!._id,
        });
        inserted += 1;
      } catch (error: any) {
        if (error?.code === 11000) {
          skipped += 1;
          continue;
        }
        throw error;
      }
    }

    const afterCount = await collection.countDocuments();
    const availableCount = await collection.countDocuments({ status: "available" });
    console.log(JSON.stringify({ database: databaseName, collection: "listings", sourceRecords: items.length, inserted, skipped, existingBefore: beforeCount, totalAfter: afterCount, availableAfter: availableCount, demoOwnerCreated: !existingDemoOwner }));
  } finally {
    await mongoose.disconnect();
  }
};

run().catch((error) => {
  console.error(error instanceof Error ? error.message : "Seeding failed.");
  process.exitCode = 1;
});
