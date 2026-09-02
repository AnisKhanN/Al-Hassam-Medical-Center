// scripts/seedAdmin.js — run once: node scripts/seedAdmin.js
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../src/models/User");

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const exists = await User.findOne({ role: "Admin" });
  if (exists) return console.log("Admin already exists");
  await User.create({
    name: "Super Admin",
    email: "admin@clinic.com",
    password: "ChangeMe123!",
    role: "Admin",
  });
  console.log("Admin created");
  process.exit();
})();
/*
Why do we need a Seed Admin?

This is probably the smartest part.

Imagine your clinic is brand new.

Database:

Users

(empty)

No Admin.

No Doctor.

No Receptionist.

Nobody.

Now think...

Who will create the first Admin?

There isn't one.

That's why developers create one Admin manually.

This process is called Seeding.

*/
