import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";

import useSWR from "swr";

import cls from "classnames";

import styles from "../../styles/night-club.module.css";
import { fetchNightClubs } from "../../lib/night-clubs";

import { StoreContext } from "../../store/store-context";

import { fetcher, isEmpty } from "../../utils";

export async function getStaticProps(staticProps) {
  const params = staticProps.params;

  const nightClubs = await fetchNightClubs();
  const findNightClubById = nightClubs.find((nightClub) => {
    return nightClub.id.toString() === params.id; //dynamic id
  });
  return {
    props: {
      nightClub: findNightClubById ? findNightClubById : {},
    },
  };
}

export async function getStaticPaths() {
  const nightClubs = await fetchNightClubs();
  const paths = nightClubs.map((nightClub) => {
    return {
      params: {
        id: nightClub.id.toString(),
      },
    };
  });
  return {
    paths,
    fallback: true,
  };
}

const NightClub = (initialProps) => {
  const router = useRouter();

  const id = router.query.id;

  const [nightClub, setNightClub] = useState(
    initialProps.nightClub || {}
  );

  const {
    state: { nightClubs },
  } = useContext(StoreContext);

  const handleCreateNightClub = async (nightClub) => {
    try {
      const { id, name, voting, imgUrl, neighbourhood, address } = nightClub;
      const response = await fetch("/api/createNightClub", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          name,
          voting: 0,
          imgUrl,
          neighbourhood: neighbourhood || "",
          address: address || "",
        }),
      });

      const dbNightClub = await response.json();
    } catch (err) {
      console.error("Error creating night club", err);
    }
  };

  useEffect(() => {
    if (isEmpty(initialProps.nightClub)) {
      if (nightClubs.length > 0) {
        const nightClubFromContext = nightClubs.find((nightClub) => {
          return nightClub.id.toString() === id; //dynamic id
        });

        if (nightClubFromContext) {
          setNightClub(nightClubFromContext);
          handleCreateNightClub(nightClubFromContext);
        }
      }
    } else {
      // SSG
      handleCreateNightClub(initialProps.nightClub);
    }
  }, [id, initialProps, initialProps.nightClub, nightClubs]);

  const {
    address = "",
    name = "",
    neighbourhood = "",
    imgUrl = "",
  } = nightClub;
  const [votingCount, setVotingCount] = useState(0);

  const { data, error } = useSWR(`/api/getNightClubById?id=${id}`, fetcher);

  useEffect(() => {
    if (data && data.length > 0) {
      setNightClub(data[0]);

      setVotingCount(data[0].voting);
    }
  }, [data]);

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const handleUpvoteButton = async () => {
    try {
      const response = await fetch("/api/favouriteNightClubById", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });

      const dbNightClub = await response.json();

      if (dbNightClub && dbNightClub.length > 0) {
        let count = votingCount + 1;
        setVotingCount(count);
      }
    } catch (err) {
      console.error("Error upvoting the night club", err);
    }
  };

  if (error) {
    return <div>Something went wrong retrieving night club page</div>;
  }

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
        <meta name="description" content={`${name} night club`}></meta>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">
              <a>← Back to home</a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={
              imgUrl ||
              "https://images.unsplash.com/photo-1545128485-c400e7702796?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
            }
            width={600}
            height={360}
            className={styles.partyImg}
            alt={name}
          ></Image>
        </div>

        <div className={cls("glass", styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/places.svg"
              width="24"
              height="24"
              alt="places icon"
            />
            <p className={styles.text}>{address}</p>
          </div>
          {neighbourhood && (
            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/nearMe.svg"
                width="24"
                height="24"
                alt="near me icon"
              />
              <p className={styles.text}>{neighbourhood}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/star.svg"
              width="24"
              height="24"
              alt="star icon"
            />
            <p className={styles.text}>{votingCount}</p>
          </div>

          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up vote!
          </button>
        </div>
      </div>
    </div>
  );
};

export default NightClub;
