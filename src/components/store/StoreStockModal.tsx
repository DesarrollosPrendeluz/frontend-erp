"use client";
import { Button,Box, Divider, Input, Modal, Heading, Flex, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Table, Tbody, Td, Th, Thead, Tr, Text } from '@chakra-ui/react';
import { useState, useEffect } from "react";
import useFetchData from "@/hooks/fetchData";
import Locations from "@/types/stores/locations/Locations"
import CustomSelect from "@/components/store/LocationSelect";
import CustomLocationsSelect from "@/components/store/LocationsSelect";

import ItemLocationStockStoreItem from "@/types/stores/itemLocationStocks/ItemLocationStocks";
import axios from 'axios';
import Cookies from 'js-cookie';
import ResponsiveView from "@/components/ResponsiveLayout";


interface BasicModalProps {
  isOpen: boolean;
  onClose: () => void;
  query:string;
  sku:string;
  //deficits: any[];
}

const StoreStockModal: React.FC<BasicModalProps> = ({ isOpen, onClose, query, sku }) => {
const [data, setData] = useState<ItemLocationStockStoreItem[]>([]);
  const token = Cookies.get("erp_token");
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL as string;
  const [endpoint, setEndpointValue] = useState<string>(`${apiUrl}/item_stock_location`);
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [select1, setSelect1] = useState<string>("No Seleccionado");
  const [select2, setSelect2] = useState<string>("No Seleccionado");
  const [select3, setSelect3] = useState<string>("No Seleccionado");
  const [select4, setSelect4] = useState<string>("No Seleccionado");

  const [input1, setInput1] = useState<string>("0");
  const [input2, setInput2] = useState<string>("0");

  const buttonData = [
    { label: "Movimientos de stock", action: "stockMovements" },
    { label: "Entrada y salida de stock", action: "stockFlow" },
    { label: "Añadir ubicaciones", action: "addLocations" },
  ];

  let { data: locations, totalPages, isLoading, error } = useFetchData<Locations>(
    {
      url: `${apiUrl}/store_location?`,
      page: 0,
      limit: 1000,
    }
  );


  const handleButtonClick = (formName: string) => {
    let value = formName == activeForm ? null : formName;

    setActiveForm(value);
  };


  useEffect( () => {
    //Actualiza el endpoint cuando cambian los parámetros dinámicos
    axios.get(`${endpoint}${query}`, {
        headers: { Authorization: `Bearer ${token}` }
    }).then((response)=>{
        if (response.status === 200) {
            setData(response.data.Results.data);
        }
    });
  }, [query ]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput1(event.target.value); // Actualiza el estado con el valor del input
  };

  const handleInputChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput2(event.target.value); // Actualiza el estado con el valor del input
  };

  const updateStock = async (): Promise<void> => {
    try {
      let bfrLoc = parseInt(select1|| "0", 10)
      let aftLoc = parseInt(select2|| "0", 10)
      let stockMov= parseInt(input1|| "0", 10)
      let body =        {data:[{
        "productSku": sku,
        "beforeStoreLocationId":  bfrLoc,
        "aftherStoreLocationId":  aftLoc,
        "stock":  stockMov,

    }]}

      axios.patch(
        `${endpoint}/stockMovement`, 
        body, 
        {headers: { Authorization: `Bearer ${token}` }}
      ).then((response) => {
        if (response.status == 202) {
          const updatedLocations = data.map((location) => {

            if (location.StoreLocationID === bfrLoc) {
              return { ...location, Stock: location.Stock - stockMov };

            } else if (location.StoreLocationID === aftLoc) {
              return { ...location, Stock: location.Stock + stockMov };
            }
            return location;
          });
          setData(updatedLocations);
        }

      }).catch((error) => {
        console.error("Error en la solicitud PATCH de movimiento de stocks:", error);
        throw error;
      })
  

    } catch (error) {
      console.error("Error en el metodo de movimiento de stocks:", error);
      throw error;
    }
  };

  const changeStock = async (): Promise<void> => {
    try {
        const targetItem = data.find(line => line.ItemMainSku === sku);
        let modifyStock = parseInt(input2 || "0", 10)
        let baseStock = targetItem?.Stock ||0
        let stockPostClac =  baseStock + modifyStock;
        let bodyData = {data:[{
            "id": targetItem?.ID,
            "stock": stockPostClac,
        }]}
  
      axios.patch(
        `${endpoint}/stockChanges`, 
        bodyData,
        { headers: { Authorization: `Bearer ${token}` } }
      ).then((response) => {

        if (response.status == 202) {
          const updatedLocations = data.map((location) =>
            location.ID == targetItem?.ID ? { ...location, Stock: stockPostClac } : location
          );
          setData(updatedLocations);
        }
      }).catch((error) => {
        console.error("Error en la solicitud PATCH de actualización de stocks:", error);
        throw error;
      })
  

    } catch (error) {
      console.error("Error en el metodo de actualización de stocks:", error);
      throw error;
    }
  };

  const createLocation = async (): Promise<void> => {
    try {

        let bodyData = {data:[        {
          "itemMainSku":sku,
          "storeLocationId": parseInt(select4),
          "stock":0
      }]}

      axios.post(
        `${apiUrl}/item_stock_location`,
        bodyData,
        { headers: { Authorization: `Bearer ${token}` } }
      ).then((response) => {
        let locId = parseInt(select4);
        let newLocData = locations.find((loc) => loc.ID == locId)

        if (response.status == 202) {
          const newItem: ItemLocationStockStoreItem = {
            ID: response.data.Results.CreatedIds[0],
            ItemMainSku: sku,
            StoreLocationID: locId,
            Stock: 0,
            CreatedAt: new Date().toISOString(),
            UpdatedAt: new Date().toISOString(),
            StoreLocations: {
              ID: locId,
              StoreID: 1,
              Code: newLocData?.Code ?? "err",
              Name: newLocData?.Name ?? "err",
              CreatedAt: new Date().toISOString(),
              UpdatedAt: new Date().toISOString(),
            }

          };

          setData((prevData) => [...prevData, newItem]);
        }
      }).catch((error) => {
        console.error("Error en la solicitud PATCH de actualización de stocks:", error);
        throw error;
      })


    } catch (error) {
      console.error("Error en el metodo de actualización de stocks:", error);
      throw error;
    }
  };

  const desktopView = (
    <Table>
      <Thead>
        <Tr>
          <Th>Sku</Th>
          <Th>Ubicación</Th>
          <Th>Stock</Th>
        </Tr>
      </Thead>
      <Tbody>
        {
          data.map((item) => (
            <Tr key={item.ItemMainSku}>
              <Td>{item.ItemMainSku}</Td>
              <Td>{item.StoreLocations.Code}</Td>
              <Td>{item.Stock}</Td>

            </Tr>
          ))
        }

      </Tbody>
    </Table>
  )

  const mobileView = (
    <>
      {
        data.map((item, index) => (
          <Box
            key={"mv"+item.ID +index+ item.ItemMainSku}
            borderWidth="1px"
            borderRadius="lg"
            p={4}
            boxShadow="sm"
            bg="white"
            my={"10px"}
          >
            <Text fontSize="lg" mb={2} >
              Sku : {item.ItemMainSku}
            </Text>
          
            <Divider my={2} />
            <Text fontSize="lg" mb={2}>
              Ubicación: {item.StoreLocations.Code}
            </Text>

            <Divider my={2} />
            <Text fontSize="lg" mb={2}>
              Stock: {item.Stock}
            </Text>
          </Box>
        ))
      }
    </>
  )



  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered >
      <ModalOverlay />
      <ModalContent maxW={"1200"}>
        <ModalHeader>Ubicaciones Stock</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
        {buttonData.map((button, index) => (
        <Button key={index} colorScheme="yellow" mr={3} mb="10px" onClick={() => handleButtonClick(button.action)}>
          {button.label}
        </Button>
        ))}
      <Flex mt={4}>
        {activeForm === "stockMovements" && (
          <Flex direction="column" width={"100%"} border="1px solid #ccc" p={4} borderRadius="md">
                <Flex width={"100%"} justify="center"  marginBottom={"10px"}>
                    <Text textStyle="2xl" fontWeight="bold">Formulario de Movimientos de Stock</Text>
                </Flex>
                <Flex width={"100%"} justify="space-between" align="center" direction={["column","column","row"]} marginBottom={"10px"}>
                    <CustomSelect data={data}  label={"Ubicación inicial"} selectValue={select1} setSelectValue={setSelect1}/>
                    <CustomSelect data={data}  label={"Ubicación final"} selectValue={select2} setSelectValue={setSelect2}/>
                    <Input width={"33%"}  placeholder="Cantidad" mb={3} value={input1} onChange={handleInputChange} />
                </Flex>
                <Flex width={"100%"} >            
                    <Button  width={"100%"} colorScheme="blue" onClick={updateStock}>Enviar</Button>
                </Flex>
            </Flex>
        )}

        {activeForm === "stockFlow" && (
          <Flex width={"100%"} direction="column" border="1px solid #ccc" p={4} borderRadius="md">
            <Flex width={"100%"} justify="center"  marginBottom={"10px"}>
                <Text textStyle="2xl" fontWeight="bold">Formulario de Entrada y Salida de Stock</Text>
            </Flex>
            <Flex justify={["space-between", "space-between", "space-around" ]}  align="center" direction={["column","column","row"]} marginBottom={"10px"}>
                <CustomSelect data={data} label={"Ubicación:"} selectValue={select3} setSelectValue={setSelect3}/>
                <Input width={"50%"} placeholder="Cantidad" mb={3} value={input2} onChange={handleInputChange2} />
            </Flex>
            <Flex width={"100%"} >            
                <Button  width={"100%"} colorScheme="blue" onClick={changeStock} >Enviar</Button>
            </Flex>
          </Flex>
        )}

        {activeForm === "addLocations" && (
          <Flex width={"100%"} direction="column" border="1px solid #ccc" p={4} borderRadius="md">
            <Flex width={"100%"} justify="center"  marginBottom={"10px"}>
                <Text textStyle="2xl" fontWeight="bold">Añadir ubicaciones</Text>
            </Flex>
            <Flex justify={["space-between", "space-between", "space-around" ]}  align="center" direction={["column","column","row"]} marginBottom={"10px"}>
                <CustomLocationsSelect data={locations} label={"Ubicación:"} selectValue={select4} setSelectValue={setSelect4} />
                
            </Flex>
            <Flex width={"100%"} >            
                <Button  width={"100%"} colorScheme="blue" onClick={createLocation} >Enviar</Button>
            </Flex>
          </Flex>
        )}
      </Flex>
      <ResponsiveView mobileView={mobileView} desktopView={desktopView} />

        </ModalBody>
        <ModalFooter>

        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default StoreStockModal;
