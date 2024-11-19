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
  useDisclosure,
  useBreakpointValue
} from "@chakra-ui/react";
import Pagination from "@/components/Pagination";
import AddOrderModal from "@/components/orders/AddOrderModal";
import useFetchData from "@/hooks/fetchData";
import React from "react";
import { useState, useEffect } from "react";
import StoreItems from "@/types/stores/StoreItem";



const Store = () => {
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL as string;
  const [endpoint, setEndpointValue] = useState<string>(`${apiUrl}/store/default`);
  const [title, setTitleValue] = useState<string>("Stock");
  const [currentPage, setCurrentPage] = useState(1);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isVisible = useBreakpointValue({ base: true, md: false });

  const { data: items, totalPages, isLoading, error } = useFetchData<StoreItems>(
    {
      url: endpoint,
      page: (currentPage - 1),
      limit: 20,
    }
  );

  const changeType = (number: number) => {
    if (number == 1) { /* TODO more descriptive if*/
      setEndpointValue(`${apiUrl}/stock_deficit?store_id=1`)
      setTitleValue('Stock Deficit')
      setCurrentPage(1)

    } else {
      setEndpointValue(`${apiUrl}/store/default`)
      setTitleValue('Stock')
      setCurrentPage(1)
    }

  }


  return (

    <>
      {endpoint !== `${apiUrl}/store/default` && window.innerWidth > 500 && (
        <Box maxW="1200px" mx="auto" mt={1} p={4}>
          <Tabs variant={"soft-rounded"}>
            <TabList>
              <Button backgroundColor={'#F2C12E'} onClick={onOpen}> Crear pedido </Button>
            </TabList>
          </Tabs>
        </Box>
      )}

      <Box maxW="1200px" mx="auto" mt={8} p={4}>
        <Tabs variant={"soft-rounded"}>
          <TabList>
            <Tab onClick={() => changeType(0)}>Stock</Tab>
            <Tab onClick={() => changeType(1)}>Stock Deficit</Tab>
          </TabList>
        </Tabs>

        <Heading>{title} </Heading>

        <Table>
          <Thead>
            <Tr>
              {endpoint === `${apiUrl}/store/default` ? (
                <>
                  <Th>Artículo</Th>
                  <Th>Sku</Th>
                  <Th>Stock</Th>
                </>
              ) : (
                <>
                  <Th>Artículo</Th>
                  <Th>Sku</Th>
                  <Th>Proveedor</Th>
                  <Th>Stock</Th>
                  <Th>Pendiente de recepeción</Th>
                </>
              )}

            </Tr>
          </Thead>
          <Tbody>
            {items.map((item) => (
              endpoint === `${apiUrl}/store/default` ? (
                <Tr key={item.SKU} >
                  {/* FIXME: revisar estos estilos */}
                  <td className="line-clamp-1" >{item.Itemname}</td>
                  <Td>{item.SKU}</Td>
                  <Td>{item.Amount}</Td>

                </Tr>
              ) : (

                <Tr key={item.SKU_Parent}>
                  {/* FIXME: revisar estos estilos */}
                  <td className="line-clamp-1" >{item.Item?.Name || ''}</td>
                  <Td>{item.SKU_Parent}</Td>
                  <Td>{item.Item?.SupplierItems[0].Supplier.Name || ''}</Td>
                  <Td>{item.Amount}</Td>
                  <Td>{item.PendingAmount}</Td>
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
      <AddOrderModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default Store;
