import { Request, Response } from "express";
import URL from "../models/url";
import shortid from "shortid";
import { getUser } from "../services/auth";

// interface AuthenticatedRequest extends Request {
//   user: {
//     _id: string;
//   };
// }

// POST handler to create short URL
export const HandlePostUrl = async (req: Request, res: Response) => {
  const shortID = shortid.generate(); // generate() instead of shortid(8)

  const user = req.user;

  console.log(user);

  const redirectUrl = req.body.redirectUrl;

  await URL.create({
    shortID,
    redirectUrl,
    userId: user._id,
  });

  return res.redirect("/url");
};

// GET handler to show all URLs created by the user
export const showAllurls = async (req: Request, res: Response) => {
  const user = req.user;

  const data = await URL.find({ userId: user._id });

  res.render("home", { data });
};

// Optional future use
// export const HandleGetReq = async (req: Request, res: Response) => {
//   const mainUrl = await URL.findOneAndUpdate(
//     { shortID: req.params.shortId },
//     { $push: { visitHistory: Date.now() } }
//   );
//   res.redirect(mainUrl?.redirectUrl || "/");
// };
