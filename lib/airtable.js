const Airtable = require("airtable");
const base = new Airtable({
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
}).base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_KEY);

export const table = base("coffee-stores");

const getRecord = (record) => ({ ...record.fields }); //default from 'airtable';

export const getRecords = (records) => records.map(getRecord);
