import { Button } from '@chakra-ui/react'

const NormalButton = ({text,color,bgColor,onClick,mt,type}) => {
  return (
    <Button
    mt={mt}
    type={type}
    _hover={{ opacity: 0.8 }}
    _active={{}}
    color={color}
    bgColor={bgColor}
    p={"20px"}
    onClick={onClick}
  >
    {text}
  </Button>
  )
}

export default NormalButton;
