import { Request, Response } from "express";
import { ddbDocClient } from "../config/dynamoClient";
import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const URLS_TABLE = process.env.URLS_TABLE || "shrnk-urls";

export const handleRedirect = async (req: Request, res: Response): Promise<void> => {
  const shortID = req.params.shortId;

  try {
    // 1️⃣ Fetch the record
    const result = await ddbDocClient.send(
      new GetCommand({
        TableName: URLS_TABLE,
        Key: { shortID },
      })
    );

    if (!result.Item || !result.Item.redirectUrl) {
      res.status(404).send("No URL registered for this token!");
      return;
    }

    const redirectUrl = result.Item.redirectUrl;

    // 2️⃣ Update visitHistory
    await ddbDocClient.send(
      new UpdateCommand({
        TableName: URLS_TABLE,
        Key: { shortID },
        UpdateExpression: "SET visitHistory = list_append(if_not_exists(visitHistory, :emptyList), :newVisit)",
        ExpressionAttributeValues: {
          ":newVisit": [Date.now()],
          ":emptyList": [],
        },
      })
    );

    // 3️⃣ Redirect safely
    if (redirectUrl.startsWith("http://") || redirectUrl.startsWith("https://")) {
      res.redirect(redirectUrl);
    } else {
      res.redirect("http://" + redirectUrl);
    }

  } catch (err) {
    console.error("Error handling redirect:", err);
    res.status(500).send("Internal Server Error");
  }
};
