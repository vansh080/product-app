/**
 * Seed script: connect to DB and insert products from seed/products.json
 * Usage: npm run seed
 */
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Product from "../src/models/Product.js";
import fs from "fs";
const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/product-app";

async function seed() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to DB for seeding");
    const data = JSON.parse(
      fs.readFileSync(
        new URL("../seed/products.json", import.meta.url),
        "utf-8"
      )
    );
    const existing = await Product.countDocuments();
    if (existing > 0) {
      console.log("Products already exist in DB. Skipping seed.");
      process.exit(0);
    }
    await Product.insertMany(data);
    console.log("Inserted products:", data.length);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
