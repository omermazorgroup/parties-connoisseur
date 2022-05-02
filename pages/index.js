import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

import Banner from "../components/banner";
import Card from "../components/card";
import { fetchNightClubs } from "../lib/night-clubs";

import useTrackLocation from "../hooks/use-track-location";
import { useEffect, useState, useContext } from "react";
import { ACTION_TYPES, StoreContext } from "../store/store-context";

export async function getStaticProps(context) {
  const nightClubs = await fetchNightClubs();
  return {
    props: {
      nightClubs,
    }, // will be passed to the page component as props
  };
}

export default function Home(props) {
  const { handleTrackLocation, locationErrorMsg, isFindingLocation } =
    useTrackLocation();


  const [nightClubsError, setNightClubsError] = useState(null);

  const { dispatch, state } = useContext(StoreContext);

  const { nightClubs, latLong } = state;

  useEffect(() => {
    const setNightClubsByLocation = async () => {
      if (latLong) {
        try {
          const response = await fetch(
            `/api/getNightClubsByLocation?latLong=${latLong}&limit=30`
          );

          const nightClubs = await response.json();

          dispatch({
            type: ACTION_TYPES.SET_NIGHT_CLUBS,
            payload: {
              nightClubs,
            },
          });
          setNightClubsError("");
        } catch (error) {
          //set error
          setNightClubsError(error.message);
        }
      }
    };
    setNightClubsByLocation();
  }, [latLong, dispatch]);

  const handleOnBannerBtnClick = () => {
    handleTrackLocation();
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Parties Connoisseur</title>
        <link rel="icon" href="/favicon.ico" />

        <meta
          name="description"
          content="allows you to discover night clubs"
        ></meta>
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText={isFindingLocation ? "Locating..." : "View parties nearby"}
          handleOnClick={handleOnBannerBtnClick}
        />
        {locationErrorMsg && <p>Something went wrong: {locationErrorMsg}</p>}
        {nightClubsError && <p>Something went wrong: {nightClubsError}</p>}
        <div className={styles.heroImage}>
          <Image
            src="/static/hero-image.png"
            width={700}
            height={400}
            alt="hero image"
          />
        </div>

        {nightClubs.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Parties near me</h2>
            <div className={styles.cardLayout}>
              {nightClubs.map((nightClub) => {
                return (
                  <Card
                    key={nightClub.id}
                    name={nightClub.name}
                    imgUrl={
                      nightClub.imgUrl ||
                      "https://images.unsplash.com/photo-1545128485-c400e7702796?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
                    }
                    href={`/night-club/${nightClub.id}`}
                  />
                );
              })}
            </div>
          </div>
        )}

        {props.nightClubs.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Tel Aviv parties</h2>
            <div className={styles.cardLayout}>
              {props.nightClubs.map((nightClub) => {
                return (
                  <Card
                    key={nightClub.id}
                    name={nightClub.name}
                    imgUrl={
                      nightClub.imgUrl ||
                      "https://images.unsplash.com/photo-1545128485-c400e7702796?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
                    }
                    href={`/night-club/${nightClub.id}`}
                  />
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
