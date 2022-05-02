import { fetchNightClubs } from "../../lib/night-clubs";

const getNightClubsByLocation = async (req, res) => {
  try {
    const { latLong, limit } = req.query;
    const response = await fetchNightClubs(latLong, limit);
    res.status(200);
    res.json(response);
  } catch (err) {
    console.error("There is an error", err);
    res.status(500);
    res.json({ message: "Oh no! Something went wrong", err });
  }

  //return
};

export default getNightClubsByLocation;
