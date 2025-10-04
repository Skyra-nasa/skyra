import axios from "axios";

export const postSelectedData = async (data, setWeatherData, setLoading) => {
  setLoading(true);
  try {
    //https://nasa.almiraj.xyz
    const response = await axios.post("https://nasa.almiraj.xyz/analyze", data);
    console.log("response", response);
    setWeatherData(response.data);
    return response;
  } catch (error) {
    console.error("Error while posting data:", error);
    return;
  } finally {
    setLoading(false);
  }
};
