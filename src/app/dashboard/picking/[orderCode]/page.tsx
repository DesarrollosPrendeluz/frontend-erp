"use client";
import React, { useEffect, useState } from "react";
import { AddIcon, InfoIcon, LockIcon } from "@chakra-ui/icons";
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
  useDisclosure
} from "@chakra-ui/react";
import Increment from "@/components/picking/increment";
import Select from "@/components/select/select";
import Cookies from 'js-cookie'

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
    const token = Cookies.get("erp_token");
    const userId = Cookies.get("user");


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
      let tokenReq = Cookies.get("erp_token");
      let userIdReq = Cookies.get("user");
      let responseReq = await axios.post(`${apiUrl}/order/orderLines/asignation`, {
        Assignations: [
          {
            line_id: id,
            user_id: parseInt(userIdReq ?? "0", 10),
          }
        ],
      },
        {
          headers: {
            Authorization: `Bearer ${tokenReq}`
          },
        });

      if (responseReq.status === 202) {
        await fetchOrder();
      }


    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleLabelModal = async (id: number) => {
    onLabelOpen();
    try {
      const token = Cookies.get("erp_token");
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
      <Select orderId={order?.Id} status={order?.Status} statusId={order?.StatusID}></Select>
      <Table variant="simple" mt={4}>
        <Thead>
          <Tr>
            <Th>SKU</Th>
            <Th>Cantidad</Th>
            {/* <Th>ID</Th> */}
            <Th>Cantidad Recibida</Th>
            <Th>Usuario</Th>
            <Th>Acciones</Th>
            <Th>Etiqueta</Th>

          </Tr>
        </Thead>
        <Tbody>
          {order?.ItemsOrdered.map((item: OrderItem) => (
            <Tr key={item.Id}>
              <Td>{item.Sku}</Td>
              <Td>{item.Amount}</Td>
              {/* <Td>{item.Id}</Td> */}
              <Td>{item.RecivedAmount}</Td>
              <Td>{item.AssignedUser.user_name}</Td>
              <Td>
                <IconButton
                  aria-label="Incrementar"
                  icon={<AddIcon />}
                  onClick={() => handleIncrementModal(item.Id, item.Amount, item.RecivedAmount)}
                  marginRight={2}
                />
                <IconButton
                  aria-label="Asignar"
                  icon={<LockIcon />}
                  onClick={() => assignUser(item.Id)}
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

