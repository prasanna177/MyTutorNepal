import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const title1 = defineStyle({
  fontSize: "md",
  color: 'gray.100'
});

const Text = defineStyleConfig({
  variants: {
    title1
  }
});

export default Text;
