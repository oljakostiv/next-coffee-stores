export const isEmpty = (object) => {
  return object && Object.keys(object).length === 0;
};

export const fetcher = (url) => fetch(url).then((res) => res.json()); //for SWR hook;
