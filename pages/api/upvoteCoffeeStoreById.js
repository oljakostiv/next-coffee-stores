import { table, findRecordByFilter, getRecords } from "../../lib/airtable";

const upvoteCoffeeStoreById = async (req, res) => {
  if (req.method === "PUT") {
    try {
      const { id } = req.body;

      if (id) {
        const records = await findRecordByFilter(id);

        if (records.length !== 0) {
          const record = records[0];

          const calculateVoting = parseInt(record.voting) + 1;

          const updateCoffeeStoreRecord = await table.update([
            {
              id: record.recordId, //important: must to add RECORD ID from airtable(not static);
              fields: {
                voting: calculateVoting,
              },
            },
          ]);

          if (updateCoffeeStoreRecord) {
            const minifiedRecords = getRecords(updateCoffeeStoreRecord); //зменшує вкладеність;
            res.json(minifiedRecords);
          }
        } else {
          res.status(400).json("Coffee store id doesn't exist", id);
        }
      } else {
        res.status(400).json("Id is required!");
      }
    } catch (e) {
      console.error(e);
      res.status(500).json("Error creating or finding store!", e);
    }
  }
};

export default upvoteCoffeeStoreById;
