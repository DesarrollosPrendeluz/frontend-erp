"use client"


import { Order, OrderItem } from "@/app/dashboard/order/page";
import { useRouter } from "next/navigation";
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
import React from "react";
import ProgressBar from "@/components/progressbar/ProgressBar";
import ResponsiveView from "../ResponsiveLayout";
import { FatherOrder } from "@/types/fatherOrders/FatherOrders";
import FileUploadModel from "@/components/modals/file_upload_modal/file_upload_modal";
import axios from "axios";
import Cookies from 'js-cookie'
import downloadFile from "@/hooks/downloadFile";




const ExitOrder: React.FC<{ fatherOrders: FatherOrder[] }> = ({ fatherOrders }) => {
  const router = useRouter();
  const downloadFileFunc =  (fatherOrderId: number) => {
    const token = Cookies.get("erp_token");
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL as string;
    axios.get(apiUrl + "/order/supplierOrders/download?father_order_id="+fatherOrderId,{
      headers: {
        Authorization: `Bearer ${token}`
      }}).then((response2) => {
       
        downloadFile(response2.data.Results.file, response2.data.Results.filename)
      
        });
      }


  const goToPickingPage = (orderCode: string) => {
    router.push(`/dashboard/picking/${orderCode}`)
  }

  const goToStaggingPage = (orderCode: string) => {
    router.push(`/dashboard/stagging/${orderCode}`)
  }
  const goToStadisticsPage = (orderCode: string) => {
    router.push(`/dashboard/stadistics/${orderCode}`)
  }
  const mobileView = (
    <Stack spacing={4} mt={4} px={4}>
      {fatherOrders.map((fatherOrder) => (
        <Box key={fatherOrder.code} p={4} borderWidth="1px" borderRadius="lg" shadow="sm">
          <Text textAlign={"center"}> <b>Orden:</b><br /> {fatherOrder.code}</Text>
          <Text textAlign={"center"} ><b>Estado:</b><br /> {fatherOrder.status}</Text>
          <Text textAlign={"center"}><b>Tipo:</b><br /> {fatherOrder.type}</Text>
          <Flex width={"100%"} direction="column" justify="center" marginTop={3}>
          <Text textAlign={"center"}><b>Preparación de pedido:</b></Text>
            <ProgressBar total={fatherOrder.total_stock} completed={fatherOrder.pending_stock} />
          </Flex>
          <Flex width={"100%"} direction="column" justify="center" marginTop={3}>
            <Text textAlign={"center"}><b>Progreso picking:</b></Text>
          <ProgressBar total={fatherOrder.total_picking_stock} completed={fatherOrder.total_recived_picking_quantity} />
          </Flex>
          <Flex justify="center" marginTop={3} flexDirection={"column"}>
            <Button size="sm" onClick={() => goToPickingPage(fatherOrder.code)} marginY={"5px"}>
              Picking
            </Button>
            <Button size="sm" onClick={() => goToStaggingPage(fatherOrder.code)} marginY={"5px"}>
              Preparación
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
          <Th>Detalles</Th>
          <Th>Orden de salida</Th>
          <Th>Estado</Th>
          <Th>Tipo</Th>
          <Th>Progreso</Th>
          <Th>Progreso picking</Th>

        </Tr>
      </Thead>
      <Tbody>
        {Array.isArray(fatherOrders) && fatherOrders.length > 0 ? (
          fatherOrders.map((fatherOrder) => (
            <Tr key={fatherOrder.code}>
              <Td>
                <Flex justify="space-evenly" marginTop={3}>
                  <Button  onClick={() => goToPickingPage(fatherOrder.code)}>
                    Picking
                  </Button>
                  <Button  onClick={() => goToStaggingPage(fatherOrder.code)}>
                  Preparación
                  </Button>

                <Button size="sm" onClick={() => downloadFileFunc(fatherOrder.id)} marginY={"5px"}>
                  Descargar orden
                  </Button>

                <FileUploadModel report={false} buttonName="Modificar" endpoint="/order/editOrders" color="" actionName={"Modificar orden : "+fatherOrder.code} field={[{key: "father_order", value: fatherOrder.code}]} />
                <Button  onClick={() => goToStadisticsPage(fatherOrder.code)}>
                  Estadísticas
                  </Button>
            
                </Flex>
              </Td>
              <Td>{fatherOrder.code}</Td>
              <Td>{fatherOrder.status}</Td>
              <Td>{fatherOrder.type}</Td>
              <Td>
                <ProgressBar total={fatherOrder.total_stock} completed={fatherOrder.pending_stock} />
              </Td>
              <Td>
                <ProgressBar total={fatherOrder.total_picking_stock} completed={fatherOrder.total_recived_picking_quantity} />
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
export default ExitOrder;
