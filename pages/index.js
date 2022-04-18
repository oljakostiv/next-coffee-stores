import Head from "next/head";
import Image from "next/image";
import { useEffect, useState, useContext } from "react";
import { ACTION_TYPES, Context } from "../store/store-context";
import Banner from "../components/banner.js";
import Card from "../components/card";
import Footer from "../components/footer";
import { fetchCoffeeStores } from "../lib/coffee-stores.js";
import { useTrackLocation } from "../hooks/use-track-location.js";
import styles from "../styles/Home.module.css";

//only server-side fn:
export async function getStaticProps(context) {
  const coffeeStoresData = await fetchCoffeeStores();
  return {
    props: {
      coffeeStoresData,
    },
  };
}

export default function Home({ coffeeStoresData }) {
  //custom hook for local::
  const { handleTrackLocation, locationErrorMess, isFindingLocation } =
    useTrackLocation();
  // const [localCoffeeStores, setLocalCoffeeStores] = useState("");
  const [coffeeStoresError, setCoffeeStoresError] = useState(null);

  const {
    dispatch,
    state: { coffeeStores, latLong },
  } = useContext(Context);

  useEffect(() => {
    async function coffeeStoresByLocation() {
      if (latLong) {
        try {
          const response = await fetch(
            `/api/getCoffeeStoresByLocation?latLong=${latLong}&limit=12`
          );
          const fetchLocalCoffeeStores = await response.json();

          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: { coffeeStores: fetchLocalCoffeeStores },
          });
          setCoffeeStoresError("");
        } catch (e) {
          setCoffeeStoresError(e.message);
        }
      }
    }
    coffeeStoresByLocation();
  }, [latLong, dispatch]);

  const handleOnBannerBtnClick = () => {
    handleTrackLocation();
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Stores</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="allows you to discover coffee stores"
        ></meta>
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText={isFindingLocation ? "Locating.." : "View stores nearby"}
          handleOnClick={handleOnBannerBtnClick}
        />
        {locationErrorMess && <p>Something went wrong: {locationErrorMess}</p>}
        {coffeeStoresError && <p>Something went wrong: {coffeeStoresError}</p>}
        <div className={styles.heroImage}>
          <Image
            src="/static/hero-image.png"
            alt="hero-image"
            width={700}
            height={300}
          />
        </div>
        {coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Stores near me</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map((store) => {
                return (
                  <Card
                    key={store.id}
                    className={styles.card}
                    name={store.name}
                    href={`/coffee-store/${store.id}`}
                    imgUrl={
                      store.imgUrl ||
                      "https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80"
                    }
                  />
                );
              })}
            </div>
          </div>
        )}
        {coffeeStoresData.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Calgary stores</h2>
            <div className={styles.cardLayout}>
              {coffeeStoresData.map((store) => {
                return (
                  <Card
                    key={store.id}
                    className={styles.card}
                    name={store.name}
                    href={`/coffee-store/${store.id}`}
                    imgUrl={
                      store.imgUrl ||
                      "https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80"
                    }
                  />
                );
              })}
            </div>
          </div>
        )}
        <Footer />
      </main>
    </div>
  );
}
