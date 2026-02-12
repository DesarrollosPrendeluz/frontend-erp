"use client"

import useFetchData from "@/hooks/fetchData";
import downloadFile from "@/hooks/downloadFile";
import SearchBar from "@/components/searchbar/SearchBar";
import StoreStockModal from "@/components/store/StoreStockModal";
import FileUpload from "@/components/UploadExcel";
import StoreItems from "@/types/stores/StoreItem";
import GenerateLocation from "@/components/store/GenerateLocation";
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
import FileUploadModel from "@/components/modals/file_upload_modal/file_upload_modal";
import ResponsiveView from "@/components/ResponsiveLayout";
import Cookies from 'js-cookie'
import axios from "axios";


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
    setModalQuery(`?main_sku=`+sku)//+`&store_id=${targetItem?.ID || 1}`)
    setSku(sku);
    onOpen();
    // Aquí puedes hacer lo que necesites con el SKU, como actualizar el estado o llamar a una API
  };
  const downloadFileFunc =  () => {
    const token = Cookies.get("erp_token");
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL as string;
    const targetItem = stores.find(storeItem => storeItem.Name === store);
    axios.get(apiUrl + `/stock/getExcel?store_id=${targetItem?.ID || 1}`,{
      headers: {
        Authorization: `Bearer ${token}`
      }}).then((response2) => {
        downloadFile(response2.data.Results.file, response2.data.Results.name)

        });
      }

  const cleanZeroStock = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar el stock en cero?')) {
      const token = Cookies.get("erp_token");
      axios.delete(`${backendUrl}/item_stock_location/cleanZeroStock`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(() => {
        alert('Stock en cero eliminado exitosamente');
        window.location.reload();
      }).catch((error) => {
        alert('Error al eliminar el stock en cero');
        console.error(error);
      });
    }
  }

  const desktopView = (

    <Box maxW="1400px" mx="auto" mt={8} p={4}>
      
      
      <Flex marginBottom={"10px"} justifyContent={"space-between"}> 
        <Heading >{TITLE} </Heading> 
        
        <select name="" id=""        
        value={store}
        onChange={handleChange}
        defaultValue={store}
      >
        {stores.map((option) => (

          <option key={option.Name+Math.random()} value={option.Name}>
          {option.Name}
          </option>
            
        ))}
        </select> 
        <Button backgroundColor={"#FACC15"} onClick={() => downloadFileFunc()}> Descargar Stock</Button>
        <FileUploadModel buttonName="Modificar Stock" endpoint="/store/excel" color="#FACC15" actionName={"Modificar orden stock ubicaciones : "} report={true} field={[]} />
        <GenerateLocation/>
        <Button backgroundColor={"#EF4444"} color="white" onClick={cleanZeroStock}> Limpiar Ubic. Stock Cero</Button>
          </Flex>
          <SearchBar searchParams={["search"]} searchValue={query} setSearchValue={setQuery}/>

      <Table>
        <Thead>
          <Tr>
            <Th>Artículo</Th>
            <Th>Sku</Th>
            <Th>Ean</Th>
            <Th>Stock</Th>
            <Th>Almacén</Th>
            <Th>Ubicaciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {items?.map((item) => (
            <Tr key={item.SKU+item.Amount+Math.random()} >
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
              <Td>{item.Ean}</Td>
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
      <SearchBar searchParams={["search"]} searchValue={query} setSearchValue={setQuery}/>
      {items?.map((item) => (
        <Box
          key={item.SKU || item.SKU_Parent+Math.random()}
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
            {item.Itemname ? item.Itemname.substring(0, 40) : ""}...
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
            EAN:
          </Text>
          <Text>
            {item.Ean}
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
