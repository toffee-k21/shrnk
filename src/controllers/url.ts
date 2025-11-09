import { Request, Response } from "express";
import shortid from "shortid";
import { getUser } from "../services/auth";
import {
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../config/dynamoClient";

const URLS_TABLE = process.env.URLS_TABLE || "shrink-urls";

// POST handler to create short URL
export const HandlePostUrl = async (req: Request, res: Response) => {
  const shortID = shortid.generate();
  const user = req.user; // assuming middleware attaches user
  const redirectUrl = req.body.redirectUrl;

  try {
    // 1️⃣ Insert new short URL record into DynamoDB
    await ddbDocClient.send(
      new PutCommand({
        TableName: URLS_TABLE,
        Item: {
          shortID,
          redirectUrl,
          userId: user._id,
          visitHistory: [],
          createdAt: new Date().toISOString(),
        },
      })
    );

    return res.redirect("/url");
  } catch (err) {
    console.error("Error creating short URL:", err);
    res.status(500).json({ error: "Failed to create short URL" });
  }
};

// GET handler to show all URLs created by the user
export const showAllurls = async (req: Request, res: Response) => {
  const user = req.user;

  try {
    // 2️⃣ Query URLs created by this user
    const result = await ddbDocClient.send(
      new QueryCommand({
        TableName: URLS_TABLE,
        IndexName: "userId-index", // ← secondary index required
        KeyConditionExpression: "userId = :uid",
        ExpressionAttributeValues: {
          ":uid": user._id,
        },
      })
    );

    const data = result.Items || [];
    res.render("home", { data });
  } catch (err) {
    console.error("Error fetching URLs:", err);
    res.status(500).json({ error: "Failed to fetch URLs" });
  }
};

// Optional future use — Handle redirects and update visit history
// export const HandleGetReq = async (req: Request, res: Response) => {
//   const shortID = req.params.shortId;

//   try {
//     // 3️⃣ Update visitHistory array
//     const result = await ddbDocClient.send(
//       new UpdateCommand({
//         TableName: URLS_TABLE,
//         Key: { shortID },
//         UpdateExpression:
//           "SET visitHistory = list_append(if_not_exists(visitHistory, :emptyList), :newVisit)",
//         ExpressionAttributeValues: {
//           ":newVisit": [new Date().toISOString()],
//           ":emptyList": [],
//         },
//         ReturnValues: "ALL_NEW",
//       })
//     );

//     const mainUrl = result.Attributes;
//     res.redirect(mainUrl?.redirectUrl || "/");
//   } catch (err) {
//     console.error("Error handling redirect:", err);
//     res.status(500).json({ error: "Failed to redirect" });
//   }
// };
