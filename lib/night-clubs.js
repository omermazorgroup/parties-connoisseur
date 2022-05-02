//initialize unsplash

import { createApi } from "unsplash-js";

// on your node server
const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
  //...other fetch options
});

const getUrlForNightClubs = (latLong, query, limit) => {
  return `https://api.foursquare.com/v3/places/nearby?ll=${latLong}&query=${query}&limit=${limit}`;
};

const getListOfNightClubsPhotos = async () => {
  const photos = await unsplashApi.search.getPhotos({
    query: "night club",
    perPage: 40,
  });
  const unsplashResults = photos.response?.results || [];
  return unsplashResults.map((result) => result.urls["small"]);
};

export const fetchNightClubs = async (
  latLong = "32.07126835194162,34.78635645985408",
  limit = 8
) => {
  try {
    const photos = await getListOfNightClubsPhotos();
    const response = await fetch(
      getUrlForNightClubs(latLong, "night clubs", limit),
      {
        headers: {
          Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
        },
      }
    );
    const data = await response.json();

    return (
      data.results?.map((venue, idx) => {
        const neighbourhood = venue.location.neighborhood;
        return {
          // ...venue,
          id: venue.fsq_id,
          address: venue.location.address || "",
          name: venue.name,
          neighbourhood:
            (neighbourhood && neighbourhood.length > 0 && neighbourhood[0]) ||
            venue.location.cross_street ||
            "",
          imgUrl: photos[idx],
        };
      }) || []
    );
  } catch (error) {
    if (
      !process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY ||
      !process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
    ) {
      console.error(
        "🚨 Make sure to setup your API keys, checkout the docs on Github 🚨"
      );
    }
    console.log("Something went wrong fetching night clubs", error);
    return [];
  }
};
