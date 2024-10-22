"use client";
import {
  Box,
  Heading,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import Pagination from "@/components/Pagination";
import useFetchData from "@/hooks/fetchData";
import React from "react";
import { useState } from "react";
import EntryOrder from "@/components/orders/EntryOrder";
import { useRouter } from "next/navigation";

export interface OrderItem {
  Sku: string;
  Amount: number;
  Id: number;
  RecivedAmount: number;
}

export interface Order {
  OrderCode: string;
  Type: string;
  Status: string;
  ItemsOrdered: OrderItem[];
  TypeID: number;
}
const divideOrders = (orders: Order[]) => {
  const entrada = orders.filter((order) => order.TypeID === 2);
  const salida = orders.filter((order) => order.TypeID === 1);

  return { entrada, salida };
};

const Orders = () => {
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL as string;
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const {
    data: orders,
    totalPages,
    isLoading,
    error,
  } = useFetchData<Order>({
    url: `${apiUrl}/order`,
    page: currentPage,
    limit: 10,
  });
  if (isLoading) {
    return <Spinner size="xl" />;
  }
  const { entrada, salida } = divideOrders(orders);

  return (
    <Box maxW="1200px" mx="auto" mt={8} p={4}>
      <Heading>Pedidos</Heading>
      <Tabs variant={"soft-rounded"}>
        <TabList>
          <Tab>Ventas</Tab>
          <Tab>Compras</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <EntryOrder orders={entrada} />
          </TabPanel>

          <TabPanel>
            <EntryOrder orders={salida} />
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </Box>
  );
};

export default Orders;
