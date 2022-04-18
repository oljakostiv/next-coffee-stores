const Airtable = require("airtable");
const base = new Airtable({
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
}).base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_KEY);

export const table = base("coffee-stores");

const getRecord = (record) => ({ ...record.fields }); //default from 'airtable';
const getRecords = (records) => records.map(getRecord);

export const findRecordByFilter = async (id) => {
  const findCoffeeStoreRecords = await table
    .select({
      filterByFormula: `id='${id}'`, //default;
    })
    .firstPage(); //default;

  return getRecords(findCoffeeStoreRecords);
};
