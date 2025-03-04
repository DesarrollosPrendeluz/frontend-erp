import { Box, Progress, Text } from "@chakra-ui/react";

interface ProgressBarProps {
  total: number,
  completed : number
}

const ProgressBar: React.FC<ProgressBarProps> = ({ total, completed }) => {

  const percentage = (completed / total) * 100
  return (
    <Box position={"relative"} width={"100%"} textAlign={"center"}>
      <Progress value={percentage} size={"lg"} borderRadius={"md"} colorScheme="green" />
      <Text position="absolute"
        width="100%"
        fontWeight="Bold"
        colorScheme="black"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)">
        {`${completed} / ${total}`}
      </Text>

    </Box>
  )
}

export default ProgressBar
