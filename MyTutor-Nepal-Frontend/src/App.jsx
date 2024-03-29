import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "./theme";
import { Toaster } from "react-hot-toast";
import "react-tooltip/dist/react-tooltip.css";
import AppRoute from "../routes/AppRoute";

function App() {
  return (
    <>
      <ChakraProvider theme={theme}>
        <Toaster position="top-center" reverseOrder={false} />
        <AppRoute />
      </ChakraProvider>
    </>
  );
}

export default App;
