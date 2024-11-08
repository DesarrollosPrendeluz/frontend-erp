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
  Button,
} from "@chakra-ui/react";
import React from "react";
import ProgressBar from "@/components/progressbar/ProgressBar";

interface ProgressBarProps {
  items: OrderItem[];
}

const EntryOrder: React.FC<{ orders: Order[] }> = ({ orders }) => {
  const router = useRouter();

  const goToPickingPage = (orderCode: string) => {
    router.push(`/dashboard/picking/${orderCode}`)
  }

  return (
    <Box>
      <Heading>Ordenes de Entrada</Heading>
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
