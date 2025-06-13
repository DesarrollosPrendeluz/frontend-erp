"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Flex,
  Input,
  Text,
  Select,
  Collapse,
  useDisclosure,
  Divider,
} from "@chakra-ui/react";
import useFetchData from "@/hooks/fetchData";
import { FatherOrder } from "@/types/fatherOrders/FatherOrders";
import Pagination from "../Pagination";
import EmployeeStats from "@/components/stadistics/Employee";

const getDefaultDateRange = () => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    from: firstDay.toISOString().split("T")[0],
    to: lastDay.toISOString().split("T")[0],
  };
};

const OrderStatistics: React.FC = () => {
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL as string;
  const { from, to } = getDefaultDateRange();

  const [currentPage, setCurrentPage] = useState(1);
  const [params, setParamsValue] = useState<Record<string, any>>({ from, to });
  const [fromDate, setFromDate] = useState(from);
  const [toDate, setToDate] = useState(to);
  const [type_id, setType] = useState("");

  const filterDisclosure = useDisclosure();
  const resultDisclosure = useDisclosure({ defaultIsOpen: true });

  const {
    data: fatherOrders,
    totalPages,
    isLoading,
    error,
  } = useFetchData<FatherOrder>({
    url: `${apiUrl}/fatherOrder`,
    page: currentPage - 1,
    limit: 20,
    params,
  });

  const [selectedOrderCode, setSelectedOrderCode] = useState<string | null>(null);

  const applyFilters = () => {
    const newParams: Record<string, any> = {};
    if (fromDate) newParams.from = fromDate;
    if (toDate) newParams.to = toDate;
    if (type_id) newParams.type_id = type_id;
    setParamsValue(newParams);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFromDate(from);
    setToDate(to);
    setType("");
    setParamsValue({ from, to });
    setCurrentPage(1);
    setSelectedOrderCode(null); // limpiar selección
  };

  return (
    <Box p={6} maxW="6xl" mx="auto">
      <Heading mb={6} textAlign="center">Estadísticas de Pedidos</Heading>

      <Flex justifyContent="center" mb={4}>
        <Button onClick={filterDisclosure.onToggle} variant="outline" size="sm">
          {filterDisclosure.isOpen ? "Ocultar filtros" : "Mostrar filtros"}
        </Button>
      </Flex>

      <Collapse in={filterDisclosure.isOpen} animateOpacity>
        <Flex gap={4} flexWrap="wrap" mb={6} justifyContent="center">
          <Input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            max={toDate || undefined}
          />
          <Input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            min={fromDate || undefined}
          />
          <Select
            placeholder="Tipo de pedido"
            value={type_id}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="1">Compra</option>
            <option value="2">Venta</option>
          </Select>
          <Button colorScheme="blue" onClick={applyFilters}>Aplicar filtros</Button>
          <Button variant="outline" onClick={clearFilters}>Limpiar filtros</Button>
        </Flex>
      </Collapse>

      <Flex justifyContent="center" mb={4}>
        <Button onClick={resultDisclosure.onToggle} size="sm">
          {resultDisclosure.isOpen ? "Ocultar resultados" : "Mostrar resultados"}
        </Button>
      </Flex>

      <Collapse in={resultDisclosure.isOpen} animateOpacity>
        {isLoading ? (
          <Text>Cargando...</Text>
        ) : error ? (
          <Text color="red.500">Error al cargar los datos.</Text>
        ) : (
          <>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>Código</Th>
                  <Th>Tipo</Th>
                  <Th>Estado</Th>
                  <Th isNumeric>Total</Th>
                  <Th isNumeric>Pendiente</Th>
                  <Th isNumeric>% Completado</Th>
                  <Th>Acciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {fatherOrders.map((order) => {
                  const total = order.total_stock + order.pending_stock;
                  const percent = total > 0 ? Math.round((order.total_stock / total) * 100) : 0;

                  return (
                    <Tr
                      key={order.id}
                      _hover={{ bg: order.type_id === 2 ? "gray.100" : undefined }}
                    >
                      <Td>{order.code}</Td>
                      <Td>{order.type_id === 1 ? "Compra" : "Venta"}</Td>
                      <Td>{order.status}</Td>
                      <Td isNumeric>{total}</Td>
                      <Td isNumeric>{order.pending_stock}</Td>
                      <Td isNumeric>{percent}%</Td>
                      <Td>
                        {order.type_id === 2 && (
                          <Button
                            size="xs"
                            colorScheme="teal"
                            onClick={() => setSelectedOrderCode(order.code)}
                          >
                            Ver trabajadores
                          </Button>
                        )}
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>

            <Flex mt={6} justifyContent="center" gap={4}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </Flex>
          </>
        )}
      </Collapse>

      {selectedOrderCode && (
        <>
          <Divider my={6} />
          <EmployeeStats selectedOrderCode={selectedOrderCode} />
        </>
      )}
    </Box>
  );
};

export default OrderStatistics;

