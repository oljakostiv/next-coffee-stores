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
        neighborhood:
          venue.location.neighborhood || venue.location.crossStreet || "",
        imgUrl: photos[idx],
      };
    }) || [];

  return transformedData;
};
