import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.redirect("/auth/signin");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
    (req as any).user = decoded; // attach user info to request
    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return res.redirect("/auth/signin");
  }
};


// statefull
// export const restrictLoggedInUserOnly = (
//   req: AuthenticatedRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   const sessionId = req.cookies?.uid;
//   console.log(sessionId);

//   if (!sessionId) {
//     return res.redirect("/auth/signin");
//   }

//   const user = getUser(sessionId);
//   if(!user) {
//     res.redirect("/auth/signup"); 
//     return;
//   }

//   const obj:{_id:string} = {_id: user};
//   req.user = obj;
//   next();
// };