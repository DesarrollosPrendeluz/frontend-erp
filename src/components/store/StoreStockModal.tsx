"use client";
import { Button,Box, Divider, Input, Modal, Heading, Flex, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Table, Tbody, Td, Th, Thead, Tr, Text } from '@chakra-ui/react';
import { useState, useEffect } from "react";
import useFetchData from "@/hooks/fetchData";
import CustomSelect from "@/components/store/LocationSelect";
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
  const [input1, setInput1] = useState<string>("0");
  const [input2, setInput2] = useState<string>("0");


  const handleButtonClick = (formName: string) => {
    let value = formName == activeForm ? null : formName;

    setActiveForm(value);
  };


useEffect( () => {
    //Actualiza el endpoint cuando cambian los parámetros dinámicos

    console.log(`${endpoint}${query}`);
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
      const response = await axios.patch(`${endpoint}/stockMovement`, 
        {data:[{
            productSku: sku,
            beforeStoreLocationId:  parseInt(select1|| "0", 10),
            aftherStoreLocationId:  parseInt(select2|| "0", 10),
            stock:  parseInt(input1|| "0", 10),

        }]}, 
        {headers: { Authorization: `Bearer ${token}` }}
    );
  
      console.log("Respuesta exitosa:", response.data);
    } catch (error) {
      console.error("Error en la solicitud PATCH:", error);
      throw error;
    }
  };

  const changeStock = async (): Promise<void> => {
    try {
        const targetItem = data.find(line => line.ItemMainSku === sku);
        let stock =  targetItem?.Stock ||0 + parseInt(input2 || "0", 10);
        let bodyData = {data:[{
            id: targetItem?.ID,
            stock: stock,
        }]}
        console.log(bodyData)
      const response = await axios.patch(`${endpoint}/stockChanges`, bodyData
        , 
        {headers: { Authorization: `Bearer ${token}` }}
    );
  
      console.log("Respuesta exitosa:", response.data);
    } catch (error) {
      console.error("Error en la solicitud PATCH:", error);
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
      <Button colorScheme="yellow" mr={3} mb={"10px"} onClick={() => handleButtonClick("stockMovements")}>
        Movimientos de stock
      </Button>
      <Button colorScheme="yellow" mb={"10px"} onClick={() => handleButtonClick("stockFlow")}>
        Entrada y salida de stock
      </Button>
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
