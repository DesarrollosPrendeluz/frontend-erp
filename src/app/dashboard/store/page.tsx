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
} from "@chakra-ui/react";
import Pagination from "@/components/Pagination";
import useFetchData from "@/hooks/fetchData";
import React from "react";
import { useState } from "react";

interface StoreItems {
  Itemname: string;
  SKU: string;
  Amount: string;
}

const Store = () => {
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL as string;
  const [currentPage, setCurrentPage] = useState(1);
  const {
    data: items,
    totalPages,
    isLoading,
    error,
  } = useFetchData<StoreItems>({
    url: `${apiUrl}/store/default`,
    page: currentPage,
    limit: 2,
  });

  return (
    <Box maxW="1200px" mx="auto" mt={8} p={4}>
      <Heading>Stock Almacén</Heading>
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
            <Tr key={item.SKU}>
              <Td>{item.Itemname}</Td>
              <Td>{item.SKU}</Td>
              <Td>{item.Amount}</Td>
            </Tr>
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
