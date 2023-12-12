import { ChakraProvider } from '@chakra-ui/react'
import Login from './pages/Login'
import { theme } from './theme'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from './pages/Signup';
import Home from './pages/Home';
import ForgotPassword from './pages/ForgotPassword';
import { Toaster } from 'react-hot-toast';

function App() {

  return (
    <>
      <ChakraProvider theme={theme}>
        <Toaster position = 'top-center' reverseOrder={false} />
        <Router>
          <Routes>
            <Route path = "/" element = {<Home />} />
            <Route path = "/login" element = {<Login />} />
            <Route path = "/signup" element = {<Signup />} />
            <Route path = "/forgot-password" element = {<ForgotPassword />} />
          </Routes>
        </Router>
      </ChakraProvider>
    </>
  )
}

export default App
