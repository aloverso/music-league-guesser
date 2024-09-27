import type { NextApiRequest, NextApiResponse } from "next";
import { getStore } from "@netlify/blobs";
import { CURRENT_WEEK } from "../../src/domain/consts";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // const store = getStore(`store-${CURRENT_WEEK}`);

  const submissions = [{"submitterName":"Matt Luedke","timestamp":"2024-09-26T19:50:00+00:00","guesses":{"Leaving":"Matt Luedke","'Til It's Over":"sanni","Earth":"Walker Gosrich","Sledgehammer - 2012 Remaster":"Noah Marcus","Thriller":"anjupoe","This Is America":"Amani Farooque","Chandelier":"John Chan","Genghis Khan":"Hames","Weapon of Choice":"Tristan Vanech","Lone Digger":"aelv13","Love Me Or Leave Me":"case451","Fight Dirty":"jasnoodle","Musician":"Naman Agrawal"}},{"submitterName":"Hames","timestamp":"2024-09-26T00:48:40+00:00","guesses":{"This Is America":"Naman Agrawal","Leaving":"sanni","'Til It's Over":"Noah Marcus","Thriller":"jasnoodle","Sledgehammer - 2012 Remaster":"Hames","Fight Dirty":"Matt Luedke","Genghis Khan":"Tristan Vanech","Lone Digger":"Walker Gosrich","Earth":"John Chan","Musician":"anjupoe","Love Me Or Leave Me":"case451","Chandelier":"Amani Farooque","Weapon of Choice":"aelv13"}}]

  try {
    // const submissions = await store.get("submissions", { type: "json" });
    res.status(200).json(submissions);
  } catch (e) {
    console.log(e);
    res.status(200).json({ message: "failed " + e });
  }
}
