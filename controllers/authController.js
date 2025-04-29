import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const { JWT_SECRET } = process.env;

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

export async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User with email does not exist" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (isPasswordCorrect) {
      const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
        expiresIn: "1h",
      });

      return res.json({
        token,
        user,
      });
    } else {
      res.status(400).json({ message: "Invalid password" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
