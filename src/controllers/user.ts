import { Request, Response } from "express";
import { ddbDocClient } from "../config/dynamoClient";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import jwt from "jsonwebtoken";

const USERS_TABLE = process.env.USERS_TABLE || "shrink-users";
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey"; // store in .env

// GET: /auth/signin
export const handleInputSignIn = (req: Request, res: Response): void => {
  res.render("signin");
};

// GET: /auth/signup
export const handleInputSignUp = (req: Request, res: Response): void => {
  res.render("signup");
};

// POST: /auth/signup
export const handleSignup = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  try {
    // 1️⃣ Check if user already exists
    const existingUser = await ddbDocClient.send(
      new GetCommand({
        TableName: USERS_TABLE,
        Key: { email },
      })
    );

    if (existingUser.Item) {
      res.status(400).json({ error: "Email already registered" });
      return;
    }

    // 2️⃣ Create a new user
    const user = {
      email,
      userName: name,
      password,
      createdAt: new Date().toISOString(),
    };

    await ddbDocClient.send(
      new PutCommand({
        TableName: USERS_TABLE,
        Item: user,
      })
    );

    // 3️⃣ Generate JWT token
    const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: "7d" });

    // 4️⃣ Store token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // secure in prod only
      sameSite: "lax",
    });

    res.redirect("/url");
  } catch (err) {
    console.error("Error signing up:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// POST: /auth/signin
export const handleSignIn = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // 1️⃣ Fetch user
    const user = await ddbDocClient.send(
      new GetCommand({
        TableName: USERS_TABLE,
        Key: { email },
      })
    );

    if (!user.Item || user.Item.password !== password) {
      return res.render("signup", {
        mess: "Invalid credentials. Please sign up first.",
      });
    }

    // 2️⃣ Generate JWT
    const token = jwt.sign({ email: user.Item.email }, JWT_SECRET, { expiresIn: "7d" });

    // 3️⃣ Set token cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.redirect("/url");
  } catch (err) {
    console.error("Error signing in:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
