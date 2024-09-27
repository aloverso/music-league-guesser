import type { NextApiRequest, NextApiResponse } from "next";
import { CURRENT_WEEK } from "../../src/domain/consts";
import { getStore } from "@netlify/blobs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const store = getStore(`store-${CURRENT_WEEK}`);

  try {
    const submissions = await store.get("submissions", { type: "json" });
    res.status(200).json(submissions);
  } catch (e) {
    console.log(e);
    res.status(200).json({ message: "failed " + e });
  }
}
