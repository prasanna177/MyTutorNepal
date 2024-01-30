import axios from "axios";
import { useEffect } from "react";
import Layout from "../components/Layout/Layout";

const Home = () => {
  const getData = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/user/getUserById",
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"), //Authorization must start with capital when posting to backend
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return <Layout>Home</Layout>;
};

export default Home;