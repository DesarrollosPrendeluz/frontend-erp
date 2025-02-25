
"use client";
import Cookies from 'js-cookie';
import { Button, Text, Box, Stack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalOverlay, Spinner, Table, Thead, Tbody, Tr, Th, Td, Badge, Select, AccordionPanel, AccordionItem, Accordion, AccordionButton, AccordionIcon, IconButton } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { ChildOrder } from '@/types/fatherOrders/FatherOrders';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';

interface ClosePalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  ordersId: ChildOrder[] | undefined;
}

interface Pallet {
  id: number;
  number: number;
  Boxes: Box[];
  IsClose: number;
}

interface Box {
  id: number;
  number: number;
  quantity: number;
  IsClose: number;
}
const CLOSE: number = 1;
const OPEN: number = 0;

const PalletAndBoxes: React.FC<ClosePalletModalProps> = ({ isOpen, onClose, ordersId }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [palletsByOrder, setPalletsByOrder] = useState<{ [key: string]: Pallet[] }>({});
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL as string;
  const [isAllowed, setIsAllowed] = useState<boolean>(false);

  useEffect(() => {
    const ROLE = Cookies.get("role")
    if (Number(ROLE) === 4 || Number(ROLE) === 5) {
      setIsAllowed(true)
    }
  })
  const createPallet = async (orderCode: string) => {
    try {
      const newPallet = palletsByOrder[orderCode].length === 1 ? 1 : palletsByOrder[orderCode].length + 1;
      const orderId = ordersId?.filter(order => order.code === orderCode)[0].id
      const token = Cookies.get("erp_token");
      const response = await axios.post(`${apiUrl}/pallet`, {
        data: [{
          orderId: orderId,
          number: newPallet,
        }]
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchPallets();
    } catch (err) {
      console.log(err)
    }

  }
  const fetchPallets = async () => {
    if (!ordersId) return;
    setLoading(true);
    try {
      const token = Cookies.get("erp_token");
      const groupedPallets: { [key: string]: Pallet[] } = {};
      for (const child of ordersId) {
        const response = await axios.get(`${apiUrl}/pallet/crossDataByOrderId?page=0&page_size=200&order_id=${child.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.Results.data.length > 0) {

          groupedPallets[child.code] = response.data.Results.data;
        }

      }
      setPalletsByOrder(groupedPallets);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchPallets();
    }
  }, [isOpen]);

  const closePallet = async (palletId: number, isClosed: boolean) => {
    try {
      const token = Cookies.get("erp_token");
      await axios.patch(`${apiUrl}/pallet`, { data: [{ id: palletId, is_close: !isClosed }] },
        {
          headers: { Authorization: `Bearer ${token}` },
        });
      fetchPallets();
    } catch (error) {
      console.error("Error cerrando el pallet:", error);
    }
  };

  const closeBox = async (boxId: number, pId: number, isClosed: boolean) => {
    try {
      const token = Cookies.get("erp_token");
      await axios.patch(`${apiUrl}/box`, { data: [{ id: boxId, palletId: pId, is_close: !isClosed }] },
        {
          headers: { Authorization: `Bearer ${token}` },
        });
      fetchPallets();
    } catch (error) {
      console.error("Error cerrando la caja:", error);
    }
  };

  const renumberBox = async (boxId: number) => {
    const newNumber = window.prompt("Ingresa el nuevo número de caja: ");
    if (!newNumber) return;
    try {
      const token = Cookies.get("erp_token");
      const response = await axios.patch(`${apiUrl}/box`, {
        data: [{
          id: boxId,
          number: parseInt(newNumber, 10)
        }]
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchPallets();
    } catch (err) {
      console.log(err)
    }
  }
  const deleteBox = async (box: Box, orderCode: string) => {

    try {
      const token = Cookies.get("erp_token");
      if (box.quantity != 0) {
        alert("No puedes eliminar una caja que no este vacía");
        return;

      }
      const confirm = window.confirm(`Estas seguro de que deseas eliminar la caja ${box.number} del pedido ${orderCode}`)
      if (confirm) {
        const response = axios.delete(`${apiUrl}/box`, { headers: { Authorization: `Bearer ${token}` }, data: { data: [{ id: box.id }] } })
        fetchPallets();
      }
    } catch (error) {
      console.error("Error cerrando la caja:", error);
    }
  };

  const moveBox = async (boxId: number, palletId: number) => {
    const confirmMove = window.confirm("¿Estás seguro de que quieres mover esta caja?");
    if (!confirmMove) return;
    try {
      const token = Cookies.get("erp_token");
      const response = await axios.patch(`${apiUrl}/box`, {
        data: [{
          id: boxId,
          palletId: palletId,
        }]
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchPallets();
    } catch (err) {
      console.log(err)
    }
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="2xl">
      <ModalOverlay />
      <ModalContent p={4} mt={6}>
        <ModalCloseButton />
        <ModalBody>
          {loading ? (
            <Box textAlign="center">
              <Spinner size="xl" />
            </Box>
          ) : Object.keys(palletsByOrder).length === 0 ? (
            <Box textAlign="center">
              <Text>No hay pallets ni cajas para los pedidos seleccionados.</Text>
            </Box>
          ) : (
            <Accordion allowToggle>
              {Object.keys(palletsByOrder).map((orderId) => (
                <AccordionItem key={orderId}>
                  <h2>
                    <AccordionButton>
                      <AccordionIcon />
                      <Box flex="1" textAlign="left">
                        <Text fontSize="xl" fontWeight="bold">Pedido {orderId}</Text>
                      </Box>
                      <Button
                        colorScheme="blue"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation(); // Evita que se cierre el acordeón al hacer clic
                          createPallet(orderId);
                        }}
                      >
                        Crear Nuevo Pallet
                      </Button>
                    </AccordionButton>
                  </h2>

                  <AccordionPanel pb={5}>
                    {palletsByOrder[orderId].map((pallet) => (
                      <Box key={pallet.id} mb={4} border="1px" borderColor="gray.200" p={4} borderRadius="md">
                        <Stack spacing={4}>
                          <Text fontWeight="semibold">
                            {pallet.number === 0 ? "CAJAS SIN PALLET" : `PALLET# ${pallet.number}`}
                            {!!pallet.IsClose && (
                              <Badge ml={2} colorScheme="red">CERRADO</Badge>
                            )}
                          </Text>

                          {/* Tabla de Cajas */}
                          {pallet.Boxes.length > 0 && (
                            <Table variant="striped" colorScheme="gray" size="sm" >
                              <Thead>
                                <Tr>
                                  {isAllowed && (
                                    <Th>Eliminar/Modificar</Th>)}
                                  <Th>Caja</Th>
                                  <Th>Cantidad</Th>
                                  <Th>Acciones</Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {pallet.Boxes.map((box) => (
                                  <Tr key={box.id} opacity={box.IsClose == 1 ? 0.5 : 1}>
                                    {isAllowed && (
                                      <Td textAlign={"center"}>
                                        <Stack direction={"row"}>
                                          <Button
                                            size="s"
                                            onClick={() => deleteBox(box, orderId)}>
                                            <IconButton
                                              aria-label='Borrar'
                                              icon={<DeleteIcon />}
                                              _hover={{ color: "red.500" }}
                                            />
                                          </Button>
                                          <Button
                                            size="s"
                                            onClick={() => renumberBox(box.id)}>
                                            <IconButton
                                              aria-label='Editar'
                                              icon={<EditIcon />}
                                              _hover={{ color: "yellow.500" }}
                                            />
                                          </Button>
                                        </Stack>
                                      </Td>)}
                                    <Td textAlign={"center"}>Caja {box.number}</Td>
                                    <Td textAlign={"center"} textShadow={"lg"}>{box.quantity}</Td>
                                    <Td>
                                      <Stack>
                                        <Button
                                          colorScheme={!!box.IsClose ? "green" : "red"}
                                          size="sm"
                                          onClick={() => closeBox(box.id, pallet.id, !!box.IsClose)}
                                        >
                                          {box.IsClose == 1 ? "Abrir" : "Cerrar"}
                                        </Button>
                                        <Select
                                          size="sm"
                                          placeholder="Mover caja"
                                          onChange={(e) => moveBox(box.id, Number(e.target.value))}
                                        >
                                          {palletsByOrder[orderId]
                                            .filter(p => p.id !== pallet.id)
                                            .map(p => (
                                              p.number != 0 ?
                                                <option key={p.id} value={p.id}>
                                                  Pallet: {p.number}
                                                </option> :
                                                <option key={p.id} value={p.id}>
                                                  SIN PALLET ASIGNADO
                                                </option>
                                            ))}
                                        </Select>
                                      </Stack>
                                    </Td>
                                  </Tr>
                                ))}
                              </Tbody>
                            </Table>
                          )}

                          {/* Botón para cerrar/reabrir pallet */}
                          <Button
                            colorScheme={!!pallet.IsClose ? "green" : "red"}
                            size="sm"
                            onClick={() => closePallet(pallet.id, !!pallet.IsClose)}
                          >
                            {!!pallet.IsClose ? "Reabrir Pallet" : "Cerrar Pallet"}
                          </Button>
                        </Stack>
                      </Box>
                    ))}
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>Cerrar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal >
  );
};
export default PalletAndBoxes;
