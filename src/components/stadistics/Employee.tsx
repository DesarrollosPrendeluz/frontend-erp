"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Text,
  Spinner,
  Flex,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import axios from "axios";
import Cookies from 'js-cookie';

interface LineStat {
  itemName: string;
  ean: string;
  worker: string;
  currentTime: string;
  quantity: number;
}

interface EmployeeStatsProps {
  selectedOrderCode: string;
}

const EmployeeStats: React.FC<EmployeeStatsProps> = ({ selectedOrderCode }) => {
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL as string;
  const [lines, setLines] = useState<LineStat[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const token = Cookies.get("erp_token");
  useEffect(() => {
    const fetchLines = async () => {
      console.log(selectedOrderCode);
      setIsLoading(true);

      try {
        console.log("Entro aqui")
        const res = await axios.get(`${apiUrl}/stadistics/lines?father_code=${selectedOrderCode}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (true) {
          const json = await res.data.Results.data;
          console.log(json)
          setLines(res.data.Results.data);
        } else {
          setLines([]);
        }
      } catch {
        setLines([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLines();
  }, [selectedOrderCode]);

  const groupedByWorker: Record<string, LineStat[]> = {};
  lines.forEach((line) => {
    if (!groupedByWorker[line.worker]) groupedByWorker[line.worker] = [];
    groupedByWorker[line.worker].push(line);
  });

  return (
    <Box p={4} border="1px solid #ccc" borderRadius="md">
      <Heading size="md" mb={4}>
        Estadísticas de trabajadores para pedido: {selectedOrderCode}
      </Heading>

      {isLoading ? (
        <Flex justify="center" my={4}>
          <Spinner />
        </Flex>
      ) : Object.keys(groupedByWorker).length === 0 ? (
        <Text>No hay datos para mostrar.</Text>
      ) : (
        <Accordion allowMultiple>
          {Object.entries(groupedByWorker).map(([worker, workerLines]) => (
            <AccordionItem key={worker}>
              <AccordionButton>
                <Box flex="1" textAlign="left" fontWeight="bold">
                  {worker} ({workerLines.length} registros)
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                {workerLines.map((line, idx) => (
                  <Box key={idx} borderBottom="1px solid #eee" py={1}>
                    <Text>
                      <b>Artículo:</b> {line.itemName} ({line.ean})
                    </Text>
                    <Text>
                      <b>Cantidad:</b> {line.quantity}
                    </Text>
                    <Text>
                      <b>Hora:</b> {dayjs(line.currentTime).format("YYYY-MM-DD HH:mm:ss")}
                    </Text>
                  </Box>
                ))}
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </Box>
  );
};

export default EmployeeStats;

