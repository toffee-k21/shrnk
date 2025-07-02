import { Request, Response } from "express";
import userModel from "../models/user";
import { v4 as uuidv4 } from "uuid";
import { setUser } from "../services/auth";

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

  const user = await userModel.create({
    userName: name,
    email,
    password,
  });

  const sessionId = uuidv4();
  setUser(sessionId, user._id);
  res.cookie("uid", sessionId);
  res.redirect("/url");
};

// POST: /auth/signin
export const handleSignIn = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email, password });

  if (!user) {
    return res.render("signup", {
      mess: "User not found. Please create a new account by signing up.",
    });
  }

  const sessionId = uuidv4();
  setUser(sessionId, user._id);
  res.cookie("uid", sessionId);
  res.redirect("/url");
};
