"use client"
import { Order, OrderItem } from "@/app/dashboard/order/page";
import { useRouter } from "next/navigation";
import {
  Box,
  Text,
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Progress,
  Button,
} from "@chakra-ui/react";
import React from "react";

interface ProgressBarProps {
  items: OrderItem[];
}

const ProgressBar: React.FC<ProgressBarProps> = ({ items }) => {
  var completed = 0, total = 0;
  items.map(
    (item) => {
      total += item.Amount;
      completed += item.RecivedAmount;

    }
  )
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
        {`${completed}/${total}`}
      </Text>

    </Box>
  )
}
const EntryOrder: React.FC<{ orders: Order[] }> = ({ orders }) => {
  const router = useRouter();

  const goToPickingPage = (orderCode: string) => {
    router.push(`/dashboard/picking/${orderCode}`)
  }

  return (
    <Box>
      
      <Table variant={"simple"}>
        <Thead>
          <Tr>
            <Th>Picking</Th>
            <Th>Orden de compra</Th>
            <Th>Estado</Th>
            <Th>Tipo</Th>
            <Th>Progreso</Th>
          </Tr>
        </Thead>
        <Tbody>
          {orders.map((order) => (

            <Tr key={order.OrderCode}>
              <Td>
                <Button onClick={() => goToPickingPage(order.OrderCode)}>
                  Picking
                </Button>
              </Td>
              <Td>
                {order.OrderCode}
              </Td>
              <Td>{order.Status}</Td>
              <Td>{order.Type}</Td>
              <Td> <ProgressBar items={order.ItemsOrdered} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box >
  );
};


export default EntryOrder;
