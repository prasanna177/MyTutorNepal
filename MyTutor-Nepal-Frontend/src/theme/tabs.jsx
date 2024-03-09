import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const tab1 = defineStyle({
  fontSize: "md",
  color: "gray.100",
});

const Tab = defineStyleConfig({
  variants: {
    tab1
  },
});

export default Tab;
