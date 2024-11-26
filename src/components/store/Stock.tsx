"use client"

import useFetchData from "@/hooks/fetchData";
import StoreItems from "@/types/stores/StoreItem";
import {
  Box,
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  useDisclosure,
  Stack,
  Divider,
  Tooltip
} from "@chakra-ui/react";
import { useState } from "react";
import Pagination from "../Pagination";
import AddOrderModal from "../orders/AddOrderModal";
import ResponsiveView from "../ResponsiveLayout";


const Stock = () => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL as string;
  const apiUrl = `${backendUrl}/store/default`
  const [currentPage, setCurrentPage] = useState(1);
  const TITLE = "Stock";
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: items, totalPages, isLoading, error } = useFetchData<StoreItems>({
    url: apiUrl,
    page: (currentPage - 1),
    limit: 20,

  })
  const desktopView = (

    <Box maxW="1200px" mx="auto" mt={8} p={4}>

      <Heading>{TITLE} </Heading>

      <Table>
        <Thead>
          <Tr>
            <Th>Artículo</Th>
            <Th>Sku</Th>
            <Th>Stock</Th>
          </Tr>
        </Thead>
        <Tbody>
          {items?.map((item) => (
            <Tr key={item.SKU} >
              <Td>
                <Tooltip label={item.Itemname} hasArrow>
                  <span style={{
                    display: "block",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    maxWidth: "300px" /* Ajusta el ancho según sea necesario */
                  }}>
                    {item.Itemname}
                  </span>
                </Tooltip>
              </Td>
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

      <AddOrderModal isOpen={isOpen} onClose={onClose} />
    </Box>
  )
  const mobileView = (
    <Stack spacing={4} mt={4}>
      {items?.map((item) => (
        <Box
          key={item.SKU || item.SKU_Parent}
          borderWidth="1px"
          borderRadius="lg"
          p={4}
          boxShadow="sm"
          bg="white"
        >
          <Text fontWeight="bold" fontSize="lg" mb={2}>
            Artículo:
          </Text>
          <Text>
            {item.Itemname}
          </Text>

          <Divider my={2} />

          <Text fontWeight="bold" fontSize="lg" mb={2}>
            SKU:
          </Text>
          <Text>
            {item.SKU}
          </Text>

          <Divider my={2} />

          <Text fontWeight="bold" fontSize="lg" mb={2}>
            Stock:
          </Text>
          <Text>{item.Amount}</Text>
        </Box>
      ))}
    </Stack>
  );
  return (<ResponsiveView mobileView={mobileView} desktopView={desktopView} />)

}

export default Stock
