import { createApi } from "unsplash-js";

const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

const getUrlForCoffeeStores = (latLong, query, limit) => {
  return `https://api.foursquare.com/v2/venues/search?ll=${latLong}&query=${query}&client_id=${process.env.NEXT_PUBLIC_FOURSQUARE_CLIENT_ID}&client_secret=${process.env.NEXT_PUBLIC_FOURSQUARE_CLIENT_SECRET}&v=20220415&limit=${limit}`;
};

const getListOfCoffeeStorePhotos = async () => {
  const coffeeStorePhotos = await unsplashApi.search.getPhotos({
    query: "coffee store",
    perPage: 30,
  });

  const unsplashResults = coffeeStorePhotos.response.results;

  return unsplashResults.map((result) => result.urls["small"]);
};

//як аргументи, щоб на локальному можна змінити;
export const fetchCoffeeStores = async (
  latLong = "51.04502782628881, -114.02389238391433",
  limit = 9
) => {
  const photos = await getListOfCoffeeStorePhotos();
  const url = getUrlForCoffeeStores(latLong, "coffee stores", limit);
  const response = await fetch(url);
  const data = await response.json();

  const transformedData =
    data.response.venues?.map((venue, idx) => {
      return {
        id: venue.id,
        address: venue.location.address || "",
        name: venue.name,
        neighbourhood:
          venue.location.neighborhood || venue.location.crossStreet || "",
        imgUrl: photos[idx],
      };
    }) || [];

  return transformedData;
};

// fetch(
//   "https://api.foursquare.com/v2/venues/search?ll=51.04502782628881,%20-114.02389238391433&query=coffee%20stores&client_id=4WKEKC34G3MDMOKWRFSKHNEDTO0SLBNHNPKQTP00PH4LIOGB&client_secret=1XONTZ1RBNE4ABEQ5H4MKWPJIXEEYG3HRSVYJEWV0SJ4VWAP&v=20190429&limit=9",
//   {
//     headers: {
//       accept:
//         "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
//       "accept-language": "ru,en-US;q=0.9,en;q=0.8,uk;q=0.7",
//       "cache-control": "max-age=0",
//       "sec-ch-ua":
//         '" Not A;Brand";v="99", "Chromium";v="100", "Google Chrome";v="100"',
//       "sec-ch-ua-mobile": "?0",
//       "sec-ch-ua-platform": '"Windows"',
//       "sec-fetch-dest": "document",
//       "sec-fetch-mode": "navigate",
//       "sec-fetch-site": "none",
//       "sec-fetch-user": "?1",
//       "upgrade-insecure-requests": "1",
//     },
//     referrerPolicy: "strict-origin-when-cross-origin",
//     body: null,
//     method: "GET",
//     mode: "cors",
//     credentials: "include",
//   }
// );
