import axios from "axios";

export const postSelectedData = async (data, setWeatherData, setLoading) => {
  setLoading(true);
  let url = `${import.meta.env.VITE_BASE_URL}/analyze`;
  // this is lead to proxy axios.post(url, data);
  try {
    const response = await axios.post("/api/analyze", data);
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
