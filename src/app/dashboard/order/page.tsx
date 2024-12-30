"use client";
import {
  Box,
  Heading,
  Spinner,
  Tab,
  Flex,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import Pagination from "@/components/Pagination";
import useFetchData from "@/hooks/fetchData";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import EntryOrder from "@/components/orders/EntryOrder";
import ExitOrder from "@/components/orders/ExitOrder";
import {FatherOrder} from "@/types/fatherOrders/FatherOrders";
import FileUploadModel from "@/components/modals/file_upload_modal/file_upload_modal";
import  Field from "@/types/forms/fields";

interface AssignedUser {
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
  Id: number;
  OrderCode: string;
  Type: string;
  Status: string;
  StatusID: number;
  ItemsOrdered: OrderItem[];
  TypeID: number;
}


const Orders = () => {
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL as string;
  const router = useRouter();
  const [params, setParamsValue] = useState<Record<string, any>>({ "type_id": 1 });
  const [currentPage, setCurrentPage] = useState(1);
  const [field, setfield] = useState<Field[]>([]);
  const {
    data: fatherOrders,
    totalPages,
    isLoading,
    error,
  } = useFetchData<FatherOrder>({
    url: `${apiUrl}/fatherOrder`,
    page: (currentPage - 1),
    limit: 20,
    params: params
  });

  const changeType = (number: number) => {
    if (number == 1) {
      setParamsValue({ "type_id": 2 })
      setCurrentPage(1)
    } else {
      setParamsValue({ "type_id": 1 })
      setCurrentPage(1)
    }

  }

  return (
    <Box maxW="1400px" mx="auto" mt={8} p={4}>
      <Flex justify="space-between">
      <Heading size={"lg"}>Pedidos</Heading>
      <FileUploadModel buttonName="Modificar ordenes" actionName="Modificar ordenes" field={[]} />
      </Flex>
      
      <Tabs variant={"soft-rounded"}>
        <TabList>
          <Tab onClick={() => changeType(0)}>Entrada</Tab>
          <Tab onClick={() => changeType(1)}>Salida</Tab>
        </TabList>
        {isLoading ? (
          <Spinner marginTop={10} size="xl" />
        ) : (
          <TabPanels>
            <TabPanel>
              <EntryOrder fatherOrders={fatherOrders} />
            </TabPanel>
            <TabPanel>
              <ExitOrder fatherOrders={fatherOrders} />
            </TabPanel>
          </TabPanels>
        )}
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
