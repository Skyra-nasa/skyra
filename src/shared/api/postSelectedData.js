import axios from "axios";

export const postSelectedData = async ({ setLoading, data }) => {
  setLoading(false);
  let url = `${import.meta.env.VITE_BASE_URL}/analyze`;
  try {
    const response = await axios.post(url, data);
    // console.log("", response.data);
    //return rsult
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(true);
  }
};
