import { findRecordByFilter } from "../../lib/airtable";

//serverless fn (for swr hook):
const getCoffeeStoreById = async (req, res) => {
  const { id } = req.query;

  try {
    if (id) {
      const records = await findRecordByFilter(id);

      if (records.length !== 0) {
        res.json(records);
      } else {
        res.json("Id couldn't be found.");
      }
    } else {
      res.status(400).json("Id is required!");
    }
  } catch (e) {
    console.error(e);
    res.status(500).json("Something wrong!", e);
  }
};

export default getCoffeeStoreById;
