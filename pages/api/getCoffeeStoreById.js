import { findRecordByFilter } from "../../lib/airtable";

//serverless fn:
const getCoffeeStoreById = async (req, res) => {
  try {
    const { id } = req.query;
    if (id) {
      const records = await findRecordByFilter(id);

      if (records.length !== 0) {
        res.json(records);
      }

      res.json("Id couldn't be found.");
    } else {
      res.status(400).json("Id is required!");
    }
  } catch (e) {
    console.error(e);
    res.status(500).json("Something wrong!", e);
  }
};

export default getCoffeeStoreById;
