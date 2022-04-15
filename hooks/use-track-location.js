import { useState, useContext } from "react";
import { ACTION_TYPES, Context } from "../store/store-context";

export const useTrackLocation = () => {
  const [isFindingLocation, setIsFindingLocation] = useState(false);
  const [locationErrorMess, setLocationErrorMess] = useState("");
  // const [latLong, setLatLong] = useState("");

  const { dispatch } = useContext(Context);

  const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // setLatLong(`${latitude}, ${longitude}`);
    dispatch({
      type: ACTION_TYPES.SET_LAT_LONG,
      payload: { latLong: `${latitude}, ${longitude}` },
    });
    setLocationErrorMess("");
    setIsFindingLocation(false);
  };

  const error = () => {
    setIsFindingLocation(false);
    setLocationErrorMess("Unable to retrieve your location");
  };

  const handleTrackLocation = () => {
    setIsFindingLocation(true);

    if (!navigator.geolocation) {
      setIsFindingLocation(false);
      setLocationErrorMess("Geolocation is not supported by your browser");
    }

    navigator.geolocation.getCurrentPosition(success, error);
  };

  return {
    handleTrackLocation,
    isFindingLocation,
    locationErrorMess,
    // latLong,
  };
};
