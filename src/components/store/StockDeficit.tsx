"use client"

import useFetchData from "@/hooks/fetchData";
import StoreItems from "@/types/stores/StoreItem";
import SearchBar from "@/components/searchbar/SearchBar";

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
  Flex,
  useDisclosure,
  Stack,
  Divider,
  Button,
  Tooltip
} from "@chakra-ui/react";
import { useState } from "react";
import Pagination from "../Pagination";
import AddOrderModal from "../orders/AddOrderModal";
import ResponsiveView from "../ResponsiveLayout";
import Cookies from 'js-cookie'
import axios from "axios";


const StockDeficit = () => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL as string;
  const apiUrl = `${backendUrl}/stock_deficit?store_id=2`
  const [query, setQuery] = useState<string>("");

  const [currentPage, setCurrentPage] = useState(1);
  const TITLE = "Stock Déficit";
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: items, totalPages, isLoading, error } = useFetchData<StoreItems>({
    url: apiUrl+query,
    page: (currentPage - 1),
    limit: 20,

  })

  const downloadFile =  () => {
    const token = Cookies.get("erp_token");
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL as string;
    
    axios.get(apiUrl + `/stock_deficit/download`,{
      headers: {
        Authorization: `Bearer ${token}`
      }}).then((response2) => {

        const fileName = response2.data.Results.filename; // Nombre del archivo
        const fileContent = response2.data.Results.file; // Contenido del archivo (en base64 o texto)

        // Convertir el contenido si es base64
        const binaryContent = atob(fileContent); // Decodificar base64 a binario
        const byteNumbers = new Uint8Array(binaryContent.length);
        for (let i = 0; i < binaryContent.length; i++) {
          byteNumbers[i] = binaryContent.charCodeAt(i);
        }

        const blob = new Blob([byteNumbers], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);

        // Crear y simular clic en el enlace
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName; // Asignar el nombre del archivo
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Revocar la URL para liberar memoria
        window.URL.revokeObjectURL(url);
      
        });
      }
  const desktopView = (

    <Box maxW="1200px" mx="auto" mt={8} p={4}>
      
    <Flex marginBottom={"10px"} justifyContent={"space-between"}> 
      <Heading>{TITLE} </Heading>
      <Button backgroundColor={'#F2C12E'} onClick={onOpen}> Crear pedido </Button>
      <Button backgroundColor={"#FACC15"} onClick={() => downloadFile()}> Descargar StockDeficit</Button>
      </Flex>
      <SearchBar searchParams={["filter"]} searchValue={query} setSearchValue={setQuery}/>


      <Table>
        <Thead>
          <Tr>
            <Th>Artículo</Th>
            <Th>Sku</Th>
            <Th>Ean</Th>
            <Th>Proovedor</Th>
            <Th>Deficit</Th>
            <Th>Pendiente Recepción</Th>
            <Th>A pedir</Th>
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
                    maxWidth: "300px"
                  }}>
                    {item.Item.Name}
                  </span>
                </Tooltip>
              </Td>
              <Td>{item.SKU_Parent}</Td>
              <Td>{item.Item.EAN}</Td>
              <Td>{item.Item?.SupplierItems[0]?.Supplier?.Name || "No disponible"}</Td>
              <Td>{item.Amount}</Td>
              <Td>{item.PendingAmount}</Td>
              <Td>{Math.max(0, parseInt(item.Amount) - parseInt(item.PendingAmount))}</Td>

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
      <SearchBar searchParams={["search"]} searchValue={query} setSearchValue={setQuery}/>
      {items?.map((item) => (
        <Box
          key={item.SKU || item.SKU_Parent}
          borderWidth="1px"
          borderRadius="lg"
          p={4}
          boxShadow="sm"
          bg="white"
        >
          <Text mb={2}>
            <Text as="span" fontWeight="bold">Artículo: </Text>
            {item.Item.Name.substring(0, 40)}...
          </Text>

          <Divider my={2} />

          <Text mb={2}>
            <Text as="span" fontWeight="bold">SKU PADRE: </Text>
            {item.SKU_Parent}
          </Text>
          <Text mb={2}>
            <Text as="span" fontWeight="bold">Ean: </Text>
            {item.Item.EAN}
          </Text>
          <Divider my={2} />
          <Text mb={2}>
            <Text as="span" fontWeight="bold">Proveedor: </Text>

            {item.Item?.SupplierItems[0]?.Supplier?.Name || "No disponible"}
          </Text>

          <Divider my={2} />
          <Text mb={2}>
            <Text as="span" fontWeight="bold">Stock: </Text> {item.Amount}</Text>

          <Divider my={2} />
          <Text mb={2}>
            <Text as="span" fontWeight="bold">Pendiente: </Text>

            {item.PendingAmount}</Text>
            
          <Divider my={2} />
          <Text mb={2}>
            <Text as="span" fontWeight="bold">A pedir: </Text>
            {Math.max(0, parseInt(item.Amount) - parseInt(item.PendingAmount))}</Text>
        </Box>
      ))}
    </Stack>
  );
  return (<ResponsiveView mobileView={mobileView} desktopView={desktopView} />)

}

export default StockDeficit
