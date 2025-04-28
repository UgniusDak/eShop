import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";

export async function registerUser(req, res) {
  const body = req.body;

  try {
    const hashedPassword = await bcrypt.hash(body.password, 10);

    const newUser = new userModel({
      ...body,
      password: hashedPassword,
    });

    const existingUser = await userModel.findOne({ email: body.email });

    if (existingUser) {
      return res.status(400).json({ error: "User with email already exists" });
    }

    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
