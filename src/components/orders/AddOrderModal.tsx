"use client";
import { Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Table, Tbody, Td, Th, Thead, Tr, } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import useFetchData from "@/hooks/fetchData";
import StoreItems from "@/types/stores/StoreItem";
import Suppliers from "@/types/suppliers/Supplier";
import axios from 'axios';
import Cookies from 'js-cookie';

interface BasicModalProps {
  isOpen: boolean;
  onClose: () => void;
  //deficits: any[];
}

const AddOrderModal: React.FC<BasicModalProps> = ({  isOpen, onClose }) => {
  const [input, setInputValue] = useState<string>("");
  const [suppliersItems, setSuppliersValue] = useState<Suppliers>();
  const token =     Cookies.get("erp_token");
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL as string;
  const [endpoint, setEndpointValue] = useState<string>(`${apiUrl}/stock_deficit?store_id=1`);
  const [selectedValue, setSelectedValue] = useState<number>(0)// Estado de error

  const {data: items, totalPages, isLoading, error} = useFetchData< StoreItems>(
    {
    url: endpoint,
    page: 0,
    limit: 2,
    }
  );

  useEffect(() => {
    if (isOpen) {
      axios
        .get(`${apiUrl}/supplier`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            const res = response.data.Results.data;
            const datum: Suppliers = res.map((supplier: any) => ({
              Id: supplier.ID,
              Name: supplier.Name,
            }));
            setSuppliersValue(datum);
            console.log(datum);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [isOpen]); // Depend on `isOpen` so it runs only when the modal opens

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value,10);
    setEndpointValue(`${apiUrl}/stock_deficit?store_id=1&supplier=${value}`)
    setSelectedValue(value); 
  };





  const handleConfirm = () => {
    // Aquí puedes manejar la lógica de confirmación (ej. enviar datos)
    //console.log("Valor ingresado:", inputValue);
    const datum: object = items.map((item: any) => ({
        item_id: item.Item.ID,
        quantity: item.Amount,
        recived_quantity: 0,
        client_id: 1,
        store_id: 1
    }));
    let body = {
      data: [
        {
          order: {
            status: 1,
            type: 1
          },
          lines: datum // Asigna 'datum' directamente a 'lines'
        }
      ]
    };

    let responseReq =  axios.post(`${apiUrl}/order/addByRequest`, body,
    {
      headers: { 
        Authorization: `Bearer ${token}` 
      },
    });

    onClose(); // Cierra el modal después de confirmar
  };

  useEffect(() => {
    console.log("El valor del input ha cambiado:", input);
  }, [input]); // Dependencia: se ejecuta cuando `input` cambia

  return (
    <Modal  isOpen={isOpen} onClose={onClose} isCentered >
      <ModalOverlay />
      <ModalContent maxW={"1200"}>
        <ModalHeader>Generar Pedidos</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
            <div className="w-full">
            <Button backgroundColor={'#F2C12E'} marginRight={4} onClick={()=>{setInputValue("all")}}> Completo </Button>
            {/* <Button backgroundColor={'#F2C12E'} marginRight={2} marginLeft={2} > Parcial </Button> */}
            <Button backgroundColor={'#F2C12E'}  onClick={()=>{setInputValue("suppliers")}}> Por proveedores </Button>
            </div>
            <div  className="w-full my-2">
            {input === "suppliers" && (
                <select        id="framework-select" value={selectedValue} onChange={handleChange}>
                {
                  //FIXME: funciona pero da error semántico
                  suppliersItems && suppliersItems.map((supplier) => (
                    <option value={supplier.Id}>{supplier.Name}</option>
                  ))
                }

                </select>
                )}
            </div>
            <Table>
        <Thead>
          <Tr>
            <Th>Sku</Th>
            <Th>Proveedor</Th>
            <Th>Stock</Th>
            <Th>Stock pendiente</Th>
          </Tr>
        </Thead>
        <Tbody>
            {
                items.map((item) => (
                <Tr key={item.SKU_Parent}> 
                    <Td>{item.SKU_Parent}</Td> 
                    <Td>{item.Item?.SupplierItems[0].Supplier.Name || ''}</Td>  
                    <Td>{item.Amount}</Td>
                    <Td>{item.PendingAmount}</Td>
                </Tr>
                ))
            }
        </Tbody>
      </Table>

        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleConfirm}>
            Confirmar
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddOrderModal;
