import { Box, Progress, Text } from "@chakra-ui/react";

interface ProgressBarProps {
  items: any[]
}

const ProgressBar: React.FC<ProgressBarProps> = ({ items }) => {
  var completed = 0, total = 0;
  if (items && Array.isArray(items)  && items.length > 0) {

  items.map(
    (item) => {
      total += item?.Amount ?? 0;
      completed += item?.RecivedAmount ?? 0;

    }
  )
}
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
