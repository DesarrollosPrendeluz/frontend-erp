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
interface AssignedUser{
  assignation_id: number;
  user_id: number;
  user_name: string;

}

export interface OrderItem {
  Sku: string;
  Amount: number;
  Id: number;
  RecivedAmount: number;
  AssignedUser: AssignedUser;
}

export interface Order {
  Id:number;
  OrderCode: string;
  Type: string;
  Status: string;
  StatusID:number;
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
