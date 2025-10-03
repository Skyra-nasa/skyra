import axios from "axios";

export const postSelectedData = async ({setLoading,data}) => {
  setLoading(false);
  let url = "";
  try {
    const response = await axios.post(url, {
      //data
      //   lat: 1.233,
      //   lng:1.33
    });

    // console.log("", response.data);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(true);
  }
};
