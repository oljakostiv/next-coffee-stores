import { fetchCoffeeStores } from "../../lib/coffee-stores.js";

const getCoffeeStoresByLocation = async (req, res) => {
  try {
    const { latLong, limit } = req.query;
    const result = await fetchCoffeeStores(latLong, limit);

    res.status(200).json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json("Something wrong!", e);
  }
};

export default getCoffeeStoresByLocation;
