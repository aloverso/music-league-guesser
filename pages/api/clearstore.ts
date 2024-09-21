import type { NextApiRequest, NextApiResponse } from "next";
import { getStore } from "@netlify/blobs";
import { CURRENT_WEEK } from "../../src/domain/consts";

type ResponseData = {
  message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const store = getStore(`store-${CURRENT_WEEK}`);

  try {
    await store.setJSON("submissions", []);
    res.status(200).json({ message: "cleared the store" });
  } catch (e) {
    console.log(e);
  }
}
