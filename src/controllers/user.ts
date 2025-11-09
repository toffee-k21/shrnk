import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { setUser } from "../services/auth";
import { ddbDocClient } from "../config/dynamoClient"; // your DocumentClient setup file
import {
  GetCommand,
  PutCommand
} from "@aws-sdk/lib-dynamodb";

// Define table name once
const USERS_TABLE = process.env.USERS_TABLE || "shrink-users";

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
    // 1 Check if user already exists
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

    // 2 Create a new user
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

    // 3 Set session
    const sessionId = uuidv4();
    setUser(sessionId, email);
    res.cookie("uid", sessionId);
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
    // 1 Get user by email
    const user = await ddbDocClient.send(
      new GetCommand({
        TableName: USERS_TABLE,
        Key: { email },
      })
    );

    // 2 Check password
    if (!user.Item || user.Item.password !== password) {
      return res.render("signup", {
        mess: "User not found. Please create a new account by signing up.",
      });
    }

    // 3 Create session
    const sessionId = uuidv4();
    setUser(sessionId, user.Item.email);
    res.cookie("uid", sessionId);
    res.redirect("/url");

  } catch (err) {
    console.error("Error signing in:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
