"use client";

import React, { useEffect, useState } from "react";
import genericGet from "@/hooks/genericGet";
import Bars from "@/components/chars/Bars"; 
//import DoughnutChars from "@/components/chars/Doughnut";
import {
  Box,
  Flex,
  Heading
} from "@chakra-ui/react";

interface Line {
  lineId: number;
  orderId: number;
  fatherId: number;
  quantity: number;
  recivedQuantity: number;
}

interface Order {
  totalOrder: number;
  code: string;
  lines: Line[];
}
interface FatherOrder {
  id: number;
  code: string;
  status_id: number;
  type_id: number;
  status: string;
  type: string;
  total_stock: number;
  pending_stock: number;
  total_picking_stock: number;
  total_recived_picking_quantity: number;
}



const Stadistics = ({ params }: { params: { orderCode: string } }) => {

  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL as string;
  const title = "Cantidades totales: "+decodeURIComponent(params.orderCode);
  const label = 'Cantidades totales del pedido';
  const progresLabels = ["Total", "Actual"];
  const backgroundColor = ['rgba(54, 162, 235, 1)'];
  const backgroundColorPicking = ['rgba(255, 99, 132, 1)'];
  const backgroundColorStaging = ['rgba(255, 206, 86, 1)'];
   const [labels, setLabels] = useState<string[]>([""]);
   const [data, setData] = useState<number[]>([0]);
   const [dataPicking, setDataPicking] = useState<number[]>([0]);
   const [dataSatging, setDataSatging] = useState<number[]>([0]);
  const handleHistoric = async () => {
    let result = await genericGet("/stadistics/olHisotricByFatherOrder?father_code="+params.orderCode)
    if(result.status == 202 || result.status == 201 || result.status == 200){
      let response = result.body.Results.data.results;
      let totalArray = [];
      let labelArray = [];

      response.forEach((element: Order) => {
        totalArray.push(element.totalOrder);
        labelArray.push(element.code);
        setData(totalArray);
        setLabels(labelArray);
        
      });
      

    }
  }

  const handleTotals = async () => {
    let result = await genericGet("/fatherOrder?father_order_code="+params.orderCode)
    if(result.status == 202 || result.status == 201 || result.status == 200){
      console.log(result.body.Results.data.results)
      let response = result.body.Results.data;
      let pickingArray = [];
      let staggingArray = [];
      let fatherData = response[0]
      
      pickingArray.push(fatherData.total_picking_stock);
      pickingArray.push(fatherData.total_recived_picking_quantity);
      staggingArray.push(fatherData.total_stock);
      staggingArray.push(fatherData.pending_stock);
      setDataPicking(pickingArray);
      setDataSatging(staggingArray);
      

    }
  }
  useEffect(() => {
    handleHistoric();
    handleTotals();
  }, []); 

  // const data = [12, 19, 3, 5, 2, 3];
  // const labels = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange']

    
    return (
        <Box maxW="1400px" mx="auto" p={4}>
           <Heading size="lg" mb={4} textAlign="center">Estadísticas del pedido padre: {decodeURIComponent(params.orderCode)} </Heading>{/*</Box>{order?.FatherOrder.code}</Heading> */}
    
          {/*Desktop view*/}
          <Flex flexDir={"row"} display={{ base: "none", md: "flex" }} overflowX="auto">
          <Box width={"70%"} display={{ base: "none", md: "block" }} overflowX="auto">
          <Bars tag={label} labels={labels} statData={data} title={title} backgroundColor={backgroundColor} borderColor={backgroundColor}/>


          </Box>
          <Flex width={"30%"} flexDir={"column"} display={{ base: "none", md: "block" }} overflowX="auto">
          <Bars tag={"Cantidad"} labels={progresLabels} statData={dataSatging} title={"Preparación"} backgroundColor={backgroundColorStaging} borderColor={backgroundColorStaging}/>
          <Bars tag={"Cantidad"} labels={progresLabels} statData={dataPicking} title={"Picking"} backgroundColor={backgroundColorPicking} borderColor={backgroundColorPicking}/>

          </Flex>

          </Flex>

    
          {/* Mobil view*/}
          <Box overflow={"none"} display={{ base: "block", md: "none" }} mt={4}>
           
          </Box>
        </Box>
      );
    };
    
    export default Stadistics;