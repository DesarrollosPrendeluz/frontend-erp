"use client";
import {
  Box,
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Button,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import Pagination from "@/components/Pagination";
import useFetchData from "@/hooks/fetchData";
import React from "react";
import { useState, useEffect } from "react";
interface ItemData{
  Name:string;
}

interface StoreItems {
  Itemname: string;
  SKU: string;
  Amount: string;
  Item: ItemData;
  SKU_Parent:string;
}

const Store = () => {
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL as string;
  const [endpoint, setEndpointValue] = useState<string>(`${apiUrl}/store/default`);
  const [title, setTitleValue] = useState<string>("Stock");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: items,
    totalPages,
    isLoading,
    error,
  } = useFetchData<StoreItems>({
    url: endpoint,
    page: currentPage,
    limit: 2,
  });
  const changeType = () =>{
    if(endpoint === `${apiUrl}/store/default`){
      setEndpointValue(`${apiUrl}/stock_deficit?store_id=1`)
      setTitleValue('Stock Deficit')

    }else{
      setEndpointValue(`${apiUrl}/store/default`)
      setTitleValue('Stock')
    }

  }
  useEffect(() => {
    console.log(items);
    //setCurrentPage(0)
    
  }, [endpoint]); // El hook se activa cuando `endpoint` cambia

  return (

    <Box maxW="1200px" mx="auto" mt={8} p={4}>
      <Tabs variant={"soft-rounded"}>
        <TabList>
          <Tab onClick={changeType}>Stock</Tab>
          <Tab onClick={changeType}>Stock Deficit</Tab>
        </TabList>
      </Tabs>

      <Heading>{title} </Heading>

      <Table>
        <Thead>
          <Tr>
            <Th> Artículo</Th>
            <Th> Sku</Th>
            <Th> Amount</Th>
          </Tr>
        </Thead>
        <Tbody>
          {items.map((item) => (
            endpoint === `${apiUrl}/store/default` ?(
            <Tr key={item.SKU}>
              <Td>{item.Itemname}</Td> 
              <Td>{item.SKU}</Td>
              <Td>{item.Amount}</Td>
            </Tr>
            ):(
              <Tr key={item.SKU_Parent}> 
                <Td>{item.Item?.Name || ''}</Td>  
                <Td>{item.SKU_Parent}</Td> 
                <Td>{item.Amount}</Td>
              </Tr>

            )
          ))}
        </Tbody>
      </Table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </Box>
  );
};

export default Store;
