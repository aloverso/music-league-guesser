import type { NextApiRequest, NextApiResponse } from 'next'
import { getStore } from "@netlify/blobs";
import { CURRENT_WEEK } from "../../src/domain/consts";
import dayjs from "dayjs";

type ResponseData = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  console.log(req.body)

  const store = getStore(`store-${CURRENT_WEEK}`);
  const submissionsBlob = await store.get("submissions", { type: "json"});

  const newSubmission = {
    submitterName: req.body.name,
    timestamp: dayjs().format(),
    guesses: req.body.guesses
  }

  const newBlob = [newSubmission, ...submissionsBlob]
  await store.setJSON("submissions", newBlob);
  res.status(200).json({ message: 'submitted' })
}
