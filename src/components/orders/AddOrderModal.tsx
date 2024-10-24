"use client";
import { Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Table, Tbody, Td, Th, Thead, Tr, } from "@chakra-ui/react";
import { useState, useEffect } from "react";

interface BasicModalProps {
  isOpen: boolean;
  onClose: () => void;
  //deficits: any[];
}

const AddOrderModal: React.FC<BasicModalProps> = ({  isOpen, onClose }) => {
  const [input, setInputValue] = useState<string>("");
  //const [inputValue, setInputValue] = useState<string>("");

  const handleConfirm = () => {
    // Aquí puedes manejar la lógica de confirmación (ej. enviar datos)
    //console.log("Valor ingresado:", inputValue);
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
            <Table>
        <Thead>
          <Tr>
            <Th>Artículo</Th>
            <Th>Sku</Th>
            <Th>Proveedor</Th>
            <Th>Amount</Th>
          </Tr>
        </Thead>
        <Tbody>
            {
                // deficits.map((item) => (
                // <Tr key={item.SKU_Parent}> 
                //     <Td>{item.Item?.Name || ''}</Td>  
                //     <Td>{item.SKU_Parent}</Td> 
                //     <Td>{item.Item?.SupplierItems[0].Supplier.Name || ''}</Td>  
                //     <Td>{item.Amount}</Td>
                // </Tr>
                // ))
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
