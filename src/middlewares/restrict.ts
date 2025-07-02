import { Request, Response, NextFunction } from "express";
import { getUser } from "../services/auth";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
  };
}

export const restrictLoggedInUserOnly = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const sessionId = req.cookies?.uid;

  if (!sessionId) {
    return res.redirect("/auth/signin");
  }

  const user = getUser(sessionId);
  if(!user) {
    res.redirect("/auth/signup"); 
    return;
  }

  const obj:{_id:string} = {_id: user};
  req.user = obj;
  next();
};
