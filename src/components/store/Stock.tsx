"use client"

import useFetchData from "@/hooks/fetchData";
import SearchBar from "@/components/searchbar/SearchBar";
import StoreStockModal from "@/components/store/StoreStockModal";

import StoreItems from "@/types/stores/StoreItem";
import Store from "@/types/stores/Stores";
import {
  Box,
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Button,
  Flex,
  Tr,
  Text,
  useDisclosure,
  Stack,
  Divider,
  Tooltip
} from "@chakra-ui/react";
import { useState } from "react";
import Pagination from "@/components/Pagination";
import AddOrderModal from "@/components/orders/AddOrderModal";
import ResponsiveView from "@/components/ResponsiveLayout";


const Stock = () => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL as string;
  const [query, setQuery] = useState<string>("");
  const [sku, setSku] = useState<string>("");
  const [modalQuery, setModalQuery] = useState<string>("?main_sku=B10&store_id=2");
  const [store, setStore] = useState<string>("Prendeluz");
  const [currentPage, setCurrentPage] = useState(1);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const apiUrl = `${backendUrl}/store`
  const TITLE = "Stock Almacén";

  const { data: items, totalPages, isLoading, error } = useFetchData<StoreItems>({
    url: apiUrl+"/"+store+"?"+query,
    page: (currentPage - 1),
    limit: 20,

  });

  const { data: stores, totalPages: totalPagesStores, isLoading:isLoadingStores, error: errorStores } = useFetchData<Store>({
    url: apiUrl,
    page: (currentPage - 1),
    limit: 20,

  });
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setStore(value)
  };
  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const sku = event.currentTarget.value; // Obtén el valor del botón
    const targetItem = stores.find(storeItem => storeItem.Name === store);
    console.log("SKU seleccionado:", sku);
    setModalQuery(`?main_sku=`+sku+`&store_id=${targetItem?.ID || 1}`)
    setSku(sku);
    onOpen();
    // Aquí puedes hacer lo que necesites con el SKU, como actualizar el estado o llamar a una API
  };
  const desktopView = (

    <Box maxW="1400px" mx="auto" mt={8} p={4}>
      <SearchBar searchParams={["search"]} searchValue={query} setSearchValue={setQuery}/>
      
      <Flex marginTop={"10px"} justifyContent={"space-between"}> 
        <Heading >{TITLE} </Heading> 
        <select name="" id=""        
        value={store}
        onChange={handleChange}
        defaultValue={store}
      >
        {stores.map((option) => (

          <option key={option.Name} value={option.Name}>
          {option.Name}
          </option>
            
        ))}
        </select> 
          </Flex>

      <Table>
        <Thead>
          <Tr>
            <Th>Artículo</Th>
            <Th>Sku</Th>
            <Th>Stock</Th>
            <Th>Almacén</Th>
            <Th>Ubicaciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {items?.map((item) => (
            <Tr key={item.SKU+item.Amount} >
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
              <Td>{store}</Td>
              <Td><Button onClick={handleButtonClick} value={item.SKU}>Ubicaciones</Button></Td>
            </Tr>

          ))}
        </Tbody>
      </Table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />

      <StoreStockModal isOpen={isOpen} onClose={onClose} query={modalQuery} sku={sku} />

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
          <Divider my={2} />
          <Button onClick={handleButtonClick} value={item.SKU}>Ubicaciones</Button>
        </Box>
      ))}
            <StoreStockModal isOpen={isOpen} onClose={onClose} query={modalQuery} sku={sku} />

    </Stack>
  );
  return (<ResponsiveView mobileView={mobileView} desktopView={desktopView} />)

}

export default Stock
