/**
 * Script to create an Admin account in MongoDB
 * Usage: node createAdmin.js <first_name> <last_name> <email> <password> <Railway_Id>
 */
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
require("dotenv").config();

const User = require("./model/user");

async function main() {
  const first_name = process.argv[2];
  const last_name = process.argv[3];
  const email = process.argv[4];
  const password = process.argv[5];
  const Railway_Id = process.argv[6];

  if (!first_name || !last_name || !email || !password || !Railway_Id) {
    console.error("Error: Missing required arguments.");
    console.log("Usage: node createAdmin.js <first_name> <last_name> <email> <password> <Railway_Id>");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URL);

    const existing = await User.findOne({ $or: [{ email }, { Railway_Id }] });
    if (existing) {
      console.log(`User already exists with this email or Railway_Id: ${existing.email} / ${existing.Railway_Id}`);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role: "admin",
      Railway_Id,
    });

    console.log(`Admin account created successfully for Railway ID: ${Railway_Id}`);
    process.exit(0);
  } catch (err) {
    console.error("Error creating admin:", err.message);
    process.exit(1);
  }
}

main();
