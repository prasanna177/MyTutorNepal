import { extendTheme } from "@chakra-ui/react";
import colors from "./colors";
import { fontSizes, fontWeights, fonts } from "./fonts";
import Text from "./text";
import Tab from "./tabs";

const activeLabelStyles = {
  transform: "scale(0.70) translateY(-24px)",
  paddingY: "2px",
};

export const theme = extendTheme({
  styles: {
    global: {
      body: {
        fontSize: "2xl",
        fontWeight: 600,
        backgroundColor: "gray.0",
      },
    },
  },
  colors,
  fonts,
  fontWeights,
  fontSizes,
  components: {
    Form: {
      variants: {
        floating: {
          container: {
            _focusWithin: {
              label: {
                ...activeLabelStyles,
              },
            },
            "input:not(:placeholder-shown) + label, .chakra-select__wrapper + label, textarea:not(:placeholder-shown) ~ label":
              {
                ...activeLabelStyles,
              },
            label: {
              top: 0,
              left: 0,
              zIndex: 2,
              position: "absolute",
              backgroundColor: "white",
              pointerEvents: "none",
              mx: 3,
              px: 1,
              my: 2,
              transformOrigin: "left top",
            },
          },
        },
      },
    },
    Text,
    Tab,
  },
});
