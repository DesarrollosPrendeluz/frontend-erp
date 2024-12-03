"use client"


import { Order, OrderItem } from "@/app/dashboard/order/page";
import { useRouter } from "next/navigation";
import {
  Box,
  Text,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Flex,
  Button,
  Stack,
} from "@chakra-ui/react";
import React from "react";
import ProgressBar from "@/components/progressbar/ProgressBar";
import ResponsiveView from "../ResponsiveLayout";
import { FatherOrder } from "@/types/fatherOrders/FatherOrders";



const EntryOrder: React.FC<{ fatherOrders: FatherOrder[] }> = ({ fatherOrders }) => {
  const router = useRouter();

  const goToPickingPage = (orderCode: string) => {
    router.push(`/dashboard/picking/${orderCode}`)
  }

  const mobileView = (
    <Stack spacing={4} mt={4} px={4}>
      {fatherOrders.map((fatherOrder) => (
        <Box key={fatherOrder.code} p={4} borderWidth="1px" borderRadius="lg" shadow="sm">
          <Text textAlign={"center"}> <b>Orden de entrada:</b><br /> {fatherOrder.code}</Text>
          <Text textAlign={"center"} ><b>Estado:</b><br /> {fatherOrder.status}</Text>
          <Text textAlign={"center"}><b>Tipo:</b><br /> {fatherOrder.type}</Text>
          <Flex width={"100%"} justify="center" marginTop={3}>
            <ProgressBar total={fatherOrder.total_stock} completed={fatherOrder.pending_stock} />
          </Flex>
          <Flex justify="center" marginTop={3}>
            <Button size="sm" onClick={() => goToPickingPage(fatherOrder.code)}>
            Detalles
            </Button>
          </Flex>

        </Box>
      ))
      }
    </Stack >
  );

  const desktopView = (<Box display={{ base: "none", md: "block" }} overflowX={"auto"}>
    <Table variant={"simple"}>
      <Thead>
        <Tr>

          <Th>Orden de entrada</Th>
          <Th>Estado</Th>
          <Th>Tipo</Th>
          <Th>Progreso</Th>
          <Th>Detalles</Th>
          <Th>Dar entrada</Th>
        </Tr>
      </Thead>
      <Tbody>
        {Array.isArray(fatherOrders) && fatherOrders.length > 0 ? (
          fatherOrders.map((fatherOrder) => (
            <Tr key={fatherOrder.code}>

              <Td>{fatherOrder.code}</Td>
              <Td>{fatherOrder.status}</Td>
              <Td>{fatherOrder.type}</Td>
              <Td>
                <ProgressBar total={fatherOrder.total_stock} completed={fatherOrder.pending_stock} />
              </Td>
              <Td>
                <Button onClick={() => goToPickingPage(fatherOrder.code)}>
                Detalles
                </Button>
              </Td>
              <Td>
                <Button onClick={() => goToPickingPage(fatherOrder.code)}>
                Dar entrada
                </Button>
              </Td>
            </Tr>
          ))
        ) : (
          <Tr>
            <Td colSpan={5}>No orders available</Td>
          </Tr>
        )}
      </Tbody>
    </Table>
  </Box >)

  return <ResponsiveView mobileView={mobileView} desktopView={desktopView} />
};
export default EntryOrder;
