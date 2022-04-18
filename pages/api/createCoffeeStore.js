import { table, findRecordByFilter } from "../../lib/airtable";

const createCoffeeStore = async (req, res) => {
  if (req.method === "POST") {
    const { id, name, address, neighborhood, voting, imgUrl } = req.body;

    //find store:
    try {
      if (id) {
        const records = await findRecordByFilter(id);

        if (records.length !== 0) {
          res.json(records);
        } else {
          // create store:
          if (name) {
            const createCoffeeStoreRecords = await table.create([
              {
                fields: {
                  id,
                  name,
                  address,
                  neighborhood,
                  voting,
                  imgUrl,
                },
              },
            ]);

            const records = getRecords(createCoffeeStoreRecords);

            res.json(records);
          } else {
            res.status(400).json("Id and name are required!");
          }
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

export default createCoffeeStore;
