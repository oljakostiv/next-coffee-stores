const Airtable = require("airtable");
const base = new Airtable({
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
}).base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_KEY);

const table = base("coffee-stores");

console.log(table);

const createCoffeeStore = async (req, res) => {
  if (req.method === "POST") {
    const { id, name, address, neighborhood, voting, imgUrl } = req.body;

    //find store:
    try {
      if (id) {
        const findCoffeeStoreRecords = await table
          .select({
            filterByFormula: `id=${id}`, //default from 'airtable';
          })
          .firstPage(); //default;

        if (findCoffeeStoreRecords.length !== 0) {
          const records = findCoffeeStoreRecords.map((record) => {
            return {
              ...record.fields, //default;
            };
          });

          res.json(records);
        }

        //create store:
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

          const records = createCoffeeStoreRecords.map((record) => {
            return {
              ...record.fields, //default;
            };
          });

          res.json(records);
        }
        res.status(400).json("Id and name are required!");
      }
      res.status(400).json("Id is required!");
    } catch (e) {
      console.error(e);
      res.status(500).json("Error creating or finding store!", e);
    }
  }
};

export default createCoffeeStore;
