import { extendTheme } from "@chakra-ui/react";
import colors from "./colors";
import { fontSizes, fontWeights, fonts } from "./fonts";
import Text from "./text";

export const theme = extendTheme({
  styles: {
    global: {
      body: {
        fontSize: "2xl",
        fontWeight: 600,
        color: "gray.600",
        backgroundColor: "gray.50",
      },
    },
  },
  colors,
  fonts,
  fontWeights,
  fontSizes,
  components: {
    Text,
  },
});
