import cls from "classnames";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState, useEffect } from "react";
import { fetchCoffeeStores } from "../../lib/coffee-stores.js";
import { isEmpty } from "../../utils";
import { Context } from "../../store/store-context";
import styles from "../../styles/coffee-store.module.css";

export async function getStaticPaths() {
  const coffeeStoresData = await fetchCoffeeStores();
  const paths = coffeeStoresData.map((store) => {
    return {
      params: {
        id: store.id.toString(),
      },
    };
  });
  return {
    paths,
    fallback: true,
  };
}

//only server-side fn:
export async function getStaticProps({ params }) {
  const coffeeStoresData = await fetchCoffeeStores();
  const findCoffeeStoreById = coffeeStoresData.find((store) => {
    return store.id.toString() == params.id; //dynamic id;
  });

  return {
    props: {
      coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {}, //if res [];
    },
  };
}

const CoffeeStore = (initialProps) => {
  const router = useRouter();
  const { id } = router.query;

  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);

  const {
    state: { coffeeStores },
  } = useContext(Context);

  //якщо не спрацьовує по локації:
  const handleCreateCoffeeStore = async (coffeeStore) => {
    try {
      const { id, name, address, neighborhood, voting, imgUrl } = coffeeStore;

      //uploading JSON data:
      const response = await fetch("/api/createCoffeeStore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          name,
          address: address || "",
          neighborhood: neighborhood || "",
          voting: 0,
          imgUrl,
        }),
      });

      const dbCoffeeStore = await response.json();
      console.log("table:", dbCoffeeStore);
    } catch (e) {
      console.error("Error creating or finding store!", e);
    }
  };

  useEffect(() => {
    //перевірка dynamic id:
    if (isEmpty(initialProps.coffeeStore)) {
      //used from context:
      if (coffeeStores.length > 0) {
        const coffeeStoreFromContext = coffeeStores.find((store) => {
          return store.id.toString() === id;
        });

        if (coffeeStoreFromContext) {
          setCoffeeStore(coffeeStoreFromContext);
          handleCreateCoffeeStore(coffeeStoreFromContext); //from airtable;
        }
      }
    } else {
      // SSG (запис у airtable з сервера):
      handleCreateCoffeeStore(initialProps.coffeeStore);
    }
  }, [id, initialProps, initialProps.coffeeStore, coffeeStores]);

  const { name, address, neighborhood, imgUrl } = coffeeStore;

  if (router.isFallback) {
    return <div>Loading..</div>;
  }

  const handleUpvoteButton = () => {
    console.log("Up vote!");
  };

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
        <meta name="description" content={`${name} coffee store`}></meta>
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
          <div className={styles.storeImgWrapper}>
            <Image
              className={styles.storeImg}
              src={
                imgUrl ||
                "https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80"
              }
              alt={name}
              width={560}
              height={360}
            />
          </div>
        </div>
        <div className={cls("glass", styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/places.svg"
              alt="address icon"
              width={24}
              height={24}
            />
            <p className={styles.text}>{address}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/nearMe.svg"
              alt="neighbourhood icon"
              width={24}
              height={24}
            />
            <p className={styles.text}>{neighborhood}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image
              alt="star icon"
              src="/static/icons/star.svg"
              width={24}
              height={24}
            />
            <p className={styles.text}>0</p>
          </div>
          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up vote!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStore;
