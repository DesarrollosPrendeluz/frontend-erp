"use client";

import React, { useEffect, useState } from "react";
import { AddIcon, InfoIcon, LockIcon } from "@chakra-ui/icons";
import { SlPrinter } from "react-icons/sl";
import axios from "axios";
import { Order, OrderItem } from "../../order/page";
import OrderLineLabel, { OrderLineLabelProps } from "@/components/barcode/barcode";
import {
  Box,
  Text,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  IconButton,
  useDisclosure,
  Input,
  Heading,
  Flex,
  Stack,
  VStack,
  useToast,
} from "@chakra-ui/react";
import Increment from "@/components/picking/increment";
import Select from "@/components/select/select";
import Cookies from 'js-cookie'
import ZebraPrinterManager, { ZebraPrinter } from '@/components/printer/ZebraPrinter';
import ProgressBar from "@/components/progressbar/ProgressBar";

const Picking = ({ params }: { params: { orderCode: string } }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [receivedAmount, setReceivedAmount] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [labelData, setLabelData] = useState<OrderLineLabelProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [numCopies, setNumCopies] = useState<string>("");

  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL as string;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isLabelOpen, onOpen: onLabelOpen, onClose: onLabelClose } = useDisclosure();

  const [selectedPrinter, setSelectedPrinter] = useState<ZebraPrinter | null>(null);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const toast = useToast(); // Inicializa useToast
  const fetchOrder = async () => {
    const token = Cookies.get("erp_token");

    try {
      const response = await axios.get<{ Results: { data: Order[] } }>(`${apiUrl}/order?order_code=${params.orderCode}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const order = response.data.Results.data[0];
      if (order) {
        setOrder(order);
      }
    } catch (error) {
      console.error("Error cargando pedido:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [params.orderCode]);

  const handleIncrementModal = (id: number, total: number, received: number) => {
    setReceivedAmount(received);
    setTotalAmount(total);
    setSelectedId(id);
    onOpen();
  };

  const assignUser = async (id: number) => {
    try {
      const token = Cookies.get("erp_token");
      const userId = Cookies.get("user");
      const response = await axios.post(`${apiUrl}/order/orderLines/asignation`, {
        Assignations: [
          {
            line_id: id,
            user_id: parseInt(userId ?? "0", 10),
          }
        ],
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      if (response.status === 202) {
        await fetchOrder();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLabelModal = async (id: number) => {
    onLabelOpen();
    try {
      const token = Cookies.get("erp_token");
      const response = await axios.get(`${apiUrl}/order/orderLines/labels?line_id=${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        const { brand, brandAddress, brandEmail, ean, asin } = response.data.Results.data;
        setLabelData({ label: { brand, brandAddress, brandEmail, ean, asin }, isOpen: isLabelOpen, onClose: onLabelClose });
      }
    } catch (error) {
      console.error("Error loading the label");
    } finally {
      setLoading(false);
    }
  };

  const handleZebra = async (id: number) => {
    const token = Cookies.get("erp_token");
    const response = await axios.get(`${apiUrl}/order/orderLines/labels?line_id=${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (response.status === 200) {
      const { brand, brandAddress, brandEmail, ean, asin } = response.data.Results.data;
      let zpl = '';
      const totalCopies = parseInt(numCopies);
      for (let i = 0; i < totalCopies; i++) {
        zpl += `
        ^XA
        ^CI28
        ^FO20,12^A0,20,20^FDMarca: ${brand}^FS
        ^FO20,42^A0,20,20^FDDirección: ${brandAddress}^FS
        ^FO20,72^A0,20,20^FDE-Mail: ${brandEmail}^FS
        ^FO20,95^BY2^BCN,90,Y,N,N^FD${ean}^FS
        ^XZ
      `;
      }
      if (selectedPrinter && typeof selectedPrinter.send === 'function') {
        selectedPrinter.send(zpl,
          () => {
            setIsPrinting(false); // Desbloquea el botón al finalizar la impresión
            toast({ title: "Impresión exitosa", status: "success", duration: 3000, isClosable: true });
          },
          (error: any) => console.error("Error de impresión", error));
      }
    }
  };


  return (
    <Box maxW="1200px" mx="auto" p={4}>
      <Heading size="lg" mb={4} textAlign="center">Detalles del pedido: {order?.OrderCode}</Heading>
      <Stack spacing={4} mb={4} direction={{ base: "column", md: "row" }}
        align="center" justify="space-between">
        <Text fontSize={{ base: "sm", md: "md" }}>Tipo: {order?.Type}</Text>
        <Select orderId={order?.Id} status={order?.Status} statusId={order?.StatusID} />
        <ZebraPrinterManager onPrinterReady={(printer: ZebraPrinter) => setSelectedPrinter(printer)} />
        <Input
          type="number"
          value={numCopies}
          onChange={(e) => setNumCopies(e.target.value === "" ? "" : Math.max(1, parseInt(e.target.value, 10)).toString())}
          onBlur={() => { if (numCopies === "") setNumCopies("1"); }}
          min={1}
          width={{ base: "70px", md: "100px" }}
          placeholder="Copias"
          textAlign="center"
        />
      </Stack>

      {/*Desktop view*/}
      <Box display={{ base: "none", md: "block" }} overflowX="auto">
        <Table variant="simple" size="sm" mt={4}>
          <Thead bg="gray.100">
            <Tr>
              <Th>SKU</Th>
              <Th>Cantidad</Th>
              <Th>Usuario</Th>
              <Th>Acciones</Th>
              <Th>Etiqueta</Th>
            </Tr>
          </Thead>
          <Tbody>
            {order?.ItemsOrdered.map((item: OrderItem) => (
              <Tr key={item.Id}>
                <Td>{item.Sku}</Td>
                <Td><ProgressBar items={[item]} /></Td>
                <Td>{item.AssignedUser.user_name}</Td>
                <Td>
                  <Flex gap={2}>
                    <IconButton aria-label="Incrementar" icon={<AddIcon />} onClick={() => handleIncrementModal(item.Id, item.Amount, item.RecivedAmount)} size="sm" />
                    <IconButton aria-label="Asignar" icon={<LockIcon />} onClick={() => assignUser(item.Id)} size="sm" />
                  </Flex>
                </Td>
                <Td>
                  <Flex gap={2}>
                    <IconButton aria-label="Imprimir" icon={<SlPrinter />} onClick={() => handleZebra(item.Id)} size="sm" />
                    <IconButton aria-label="Información" icon={<InfoIcon />} onClick={() => handleLabelModal(item.Id)} size="sm" />
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Mobil view*/}
      <Box display={{ base: "block", md: "none" }} mt={4}>
        {order?.ItemsOrdered.map((item: OrderItem) => (
          <VStack key={item.Id} borderWidth="1px" borderRadius="lg" p={4} mb={2}>
            <Text fontSize="sm">SKU: {item.Sku}</Text>
            <Text fontSize="sm">Cantidad: <ProgressBar items={[item]} /></Text>
            <Text fontSize="sm">Usuario: {item.AssignedUser.user_name}</Text>
            <Flex gap={2} justify="center">
              <IconButton aria-label="Incrementar" icon={<AddIcon />} onClick={() => handleIncrementModal(item.Id, item.Amount, item.RecivedAmount)} size="lg" />
              <IconButton aria-label="Asignar" icon={<LockIcon />} onClick={() => assignUser(item.Id)} size="lg" />
            </Flex>
            <Flex gap={2} >
              <IconButton aria-label="Imprimir" icon={<SlPrinter />} onClick={() => handleZebra(item.Id)} size="lg" />
              <IconButton aria-label="Información" icon={<InfoIcon />} onClick={() => handleLabelModal(item.Id)} size="lg" />

            </Flex>
          </VStack>
        ))}
      </Box>

      <Increment
        isOpen={isOpen}
        onClose={onClose}
        selectedId={selectedId}
        receivedAmount={receivedAmount}
        totalAmount={totalAmount}
        fetchOrder={fetchOrder}
      />
      {labelData && <OrderLineLabel label={labelData.label} isOpen={isLabelOpen} onClose={onLabelClose} />}
    </Box>
  );
};

export default Picking;

