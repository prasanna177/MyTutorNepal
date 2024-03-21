import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const title1 = defineStyle({
  fontSize: "md",
  color: "gray.100",
});

const title2 = defineStyle({
  fontSize: "md",
  fontWeight: "normal",
  color: "gray.500",
});
const heading1 = defineStyle({
  fontSize: "4xl",
  fontWeight: "semibold",
  color: "primary.0",
});

const heading2 = defineStyle({
  fontSize: "2xl",
  fontWeight: "semibold",
  color: "primary.0",
});

const heading3 = defineStyle({
  fontSize: "lg",
  fontWeight: "semibold",
  color: "gray.500",
});

const heading4 = defineStyle({
  fontSize: "xl",
  fontWeight: "medium",
  color: "black",
});

const subtitle1 = defineStyle({
  fontSize: "md",
  fontWeight: "medium",
  color: "gray.700",
});

const subtitle2 = defineStyle({
  fontSize: "md",
  fontWeight: "medium",
  color: "gray.400",
});

const overline = defineStyle({
  fontSize: "sm",
  fontWeight: "bold",
  fontcolor: "gray.700",
  textTransform: "uppercase",
});

const tableBody = defineStyle({
  fontSize: "md",
  fontWeight: "normal",
  color: "gray.700",
});

const error = defineStyle({
  fontSize: "sm",
  fontWeight: "normal",
  color: "error.200",
});

const Text = defineStyleConfig({
  variants: {
    title1,
    title2,
    heading1,
    heading2,
    heading3,
    heading4,
    subtitle1,
    subtitle2,
    overline,
    tableBody,
    error,
  },
});

export default Text;
