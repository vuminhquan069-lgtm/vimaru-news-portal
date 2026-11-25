import db from "../services/jsonDatabase.js";

export async function getPages(req, res, next) {
  try {
    const data = await db.readJson("pages.json");
    res.json(data);
  } catch (err) {
    next(err);
  }
}
