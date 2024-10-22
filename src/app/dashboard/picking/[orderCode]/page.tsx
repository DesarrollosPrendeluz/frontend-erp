"use client";
import React, { useEffect, useState } from "react";
import { AddIcon, InfoIcon } from "@chakra-ui/icons";
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
} from "@chakra-ui/react";
import Increment from "@/components/picking/increment";

const Picking = ({ params }: { params: { orderCode: string } }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [receivedAmount, setReceivedAmount] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [labelData, setLabelData] = useState<OrderLineLabelProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL as string;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isLabelOpen, onOpen: onLabelOpen, onClose: onLabelClose } = useDisclosure();


  const fetchOrder = async () => {
    const token = document.cookie.split("=")[1];
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

  const handleLabelModal = async (id: number) => {
    onLabelOpen();
    try {
      const token = document.cookie.split("=")[1];
      const response = await axios.get(`${apiUrl}/order/orderLines/labels?line_id=${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.status === 200) {
        const { brand, brandAddress, brandEmail, ean, asin } = response.data.Results.data
        setLabelData({ label: { brand, brandAddress, brandEmail, ean, asin }, isOpen: isLabelOpen, onClose: onLabelClose })
      }

    } catch (error) {
      console.error("Error loading the label")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box maxW="1200px" mx={"auto"}>
      <h1>Detalles del pedido: {order?.OrderCode}</h1>
      <Text>Tipo: {order?.Type}</Text>
      <Text>Estado: {order?.Status}</Text>

      <Table variant="simple" mt={4}>
        <Thead>
          <Tr>
            <Th>SKU</Th>
            <Th>Cantidad</Th>
            <Th>ID</Th>
            <Th>Cantidad Recibida</Th>
            <Th>Acciones</Th>
            <Th>Etiqueta</Th>
          </Tr>
        </Thead>
        <Tbody>
          {order?.ItemsOrdered.map((item: OrderItem) => (
            <Tr key={item.Id}>
              <Td>{item.Sku}</Td>
              <Td>{item.Amount}</Td>
              <Td>{item.Id}</Td>
              <Td>{item.RecivedAmount}</Td>
              <Td>
                <IconButton
                  aria-label="Incrementar"
                  icon={<AddIcon />}
                  onClick={() => handleIncrementModal(item.Id, item.Amount, item.RecivedAmount)}
                />
              </Td>
              <Td>
                <IconButton
                  aria-label="Imprimir"
                  icon={<InfoIcon />}
                  onClick={() => handleLabelModal(item.Id)}
                />

              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

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

