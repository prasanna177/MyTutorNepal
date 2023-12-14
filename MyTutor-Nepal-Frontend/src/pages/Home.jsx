import { Heading } from "@chakra-ui/react"
import axios from "axios"
import { useEffect } from "react"


const Home = () => {
  const getData = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/user/getUserById', {},  {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token') //Authorization must starat with capital when posting to backend
        }
      })
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getData()
  },[])

  return (
    <Heading>
      Home
    </Heading>
  )
}

export default Home
