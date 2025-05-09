"use client"


import { Order, OrderItem } from "@/app/dashboard/order/page";
import { useRouter, } from "next/navigation";
import {
  Box,
  Text,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Flex,
  Button,
  Stack,
} from "@chakra-ui/react";
import { useState } from "react";
import downloadFile from "@/hooks/downloadFile";



import React from "react";
import axios from "axios";
import Cookies from 'js-cookie'
import ProgressBar from "@/components/progressbar/ProgressBar";
import ResponsiveView from "../ResponsiveLayout";
import { FatherOrder } from "@/types/fatherOrders/FatherOrders";
import FileUploadModel from "@/components/modals/file_upload_modal/file_upload_modal";
import Field from "@/types/forms/fields";




const EntryOrder: React.FC<{ fatherOrders: FatherOrder[] }> = ({ fatherOrders: initialOrders }) => {
  const [orders, setOrders] = useState<FatherOrder[]>(initialOrders);
  const router = useRouter();

  const goToPickingPage = (orderCode: string) => {
    router.push(`/dashboard/picking/${orderCode}`)
  }
  const goToStaggingPage = (orderCode: string) => {
    router.push(`/dashboard/stagging/${orderCode}`)
  }
  const goToStadisticsPage = (orderCode: string) => {
    router.push(`/dashboard/stadistics/${orderCode}`)
  }

  const closeOrder = (fatherOrderId: number) => {
    const token = Cookies.get("erp_token");
    //const userId = Cookies.get("user");
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL as string;
    //const [field, setfield] = useState<Field[]>([]);

    const response = axios.patch(`${apiUrl}/order/closeOrders`, {
      "fatherOrderId": fatherOrderId,
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    }).then((response) => {
      if (response.status == 202 || response.status == 204) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === fatherOrderId
              ? { ...order, pending_stock: order.total_stock } // Simular el cierre del pedido
              : order
          )
        );
      }
    });

  }


  const openOrder = (fatherOrderId: number) => {
    const token = Cookies.get("erp_token");
    //const userId = Cookies.get("user");
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL as string;
    //const [field, setfield] = useState<Field[]>([]);

    const response = axios.patch(`${apiUrl}/order/openOrders`, {
      "fatherOrderId": fatherOrderId,
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    }).then((response) => {
      if (response.status == 202 || response.status == 204) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === fatherOrderId
              ? { ...order, pending_stock: 0 } // Simular el cierre del pedido
              : order
          )
        );
      }
    });

  }

  const downloadFileFunc = (fatherOrderId: number) => {
    const token = Cookies.get("erp_token");
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL as string;
    axios.get(apiUrl + "/order/supplierOrders/download?father_order_id=" + fatherOrderId, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response2) => {

      downloadFile(response2.data.Results.file, response2.data.Results.filename)

    });
  }


  const mobileView = (
    <Stack spacing={4} mt={4} px={4}>
      {orders.map((fatherOrder) => (
        <Box key={fatherOrder.code} p={4} borderWidth="1px" borderRadius="lg" shadow="sm">
          <Text textAlign={"center"}> <b>Orden de entrada:</b><br /> {fatherOrder.code}</Text>
          <Text textAlign={"center"} ><b>Estado:</b><br /> {fatherOrder.status}</Text>
          <Text textAlign={"center"}><b>Tipo:</b><br /> {fatherOrder.type}</Text>
          <Flex width={"100%"} justify="center" marginTop={3}>
            <ProgressBar total={fatherOrder.total_stock} completed={fatherOrder.pending_stock} />
          </Flex>
          <Flex justify="center" marginTop={3} flexDirection={"column"}>
            <Button size="sm" onClick={() => downloadFileFunc(fatherOrder.id)} marginY={"5px"}>
              Descargar orden
            </Button>
            <Button size="sm" onClick={() => goToStaggingPage(fatherOrder.code)} marginY={"5px"}>
              Detalles
            </Button>
          </Flex>

        </Box>
      ))
      }
    </Stack >
  );

  const desktopView = (<Box display={{ base: "none", md: "block" }} overflowX={"auto"}>
    <Table variant={"simple"}>
      <Thead>
        <Tr>

          <Th>Orden de entrada</Th>
          <Th>Estado</Th>
          <Th>Tipo</Th>
          <Th>Progreso</Th>
          <Th>Detalles</Th>
          <Th>Estadísticas</Th>
          <Th>Descargar orden</Th>
          <Th>Editar Orden</Th>
          <Th>Dar entrada</Th>
        </Tr>
      </Thead>
      <Tbody>
        {Array.isArray(orders) && orders.length > 0 ? (
          orders.map((fatherOrder) => (
            <Tr key={fatherOrder.code}>

              <Td>{fatherOrder.code}</Td>
              <Td>{fatherOrder.status}</Td>
              <Td>{fatherOrder.type}</Td>
              <Td>
                <ProgressBar total={fatherOrder.total_stock} completed={fatherOrder.pending_stock} />
              </Td>
              <Td>
                <Button onClick={() => goToStaggingPage(fatherOrder.code)}>
                  Detalles
                </Button>
              </Td>
              <Td>
                <Button onClick={() => goToStadisticsPage(fatherOrder.code)}>
                  Estadísticas
                </Button>
              </Td>
              <Td>
                <Button size="sm" onClick={() => downloadFileFunc(fatherOrder.id)}>
                  Descargar orden
                </Button>
              </Td>
              <Td>
                <FileUploadModel report={false} buttonName="Modificar" endpoint="/order/editSupplierOrders" color="" actionName={"Modificar orden : " + fatherOrder.code} field={[{ key: "father_order", value: fatherOrder.code }]} />
              </Td>
              <Td>
                <Button onClick={() => closeOrder(fatherOrder.id)}>
                  Dar entrada
                </Button>
                <Button marginTop={"5px"} onClick={() => openOrder(fatherOrder.id)}>
                  Deshacer entrada
                </Button>
              </Td>
            </Tr>
          ))
        ) : (
          <Tr>
            <Td colSpan={5}>No orders available</Td>
          </Tr>
        )}
      </Tbody>
    </Table>
  </Box >)

  return <ResponsiveView mobileView={mobileView} desktopView={desktopView} />
};
export default EntryOrder;
