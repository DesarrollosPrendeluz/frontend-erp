"use client";

import React, { useEffect, useState } from "react";
import { AddIcon, InfoIcon, LockIcon } from "@chakra-ui/icons";
import { SlPrinter } from "react-icons/sl";
import axios from "axios";
import Pagination from "@/components/Pagination";
import useFetchData from "@/hooks/fetchData";

import { FatherOrder } from "@/types/fatherOrders/FatherOrders";
import OrderLine from "@/types/orders/Lines";
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
  Button,
  IconButton,
  useDisclosure,
  Input,
  Heading,
  Flex,
  Stack,
  VStack,
  useToast,
} from "@chakra-ui/react";
import OrderModal from "@/components/picking/OrderModal";
import Increment from "@/components/picking/increment";
import Select from "@/components/select/select";
import Cookies from 'js-cookie'
import ZebraPrinterManager, { ZebraPrinter } from '@/components/printer/ZebraPrinter';
import SearchBar from "@/components/searchbar/SearchBar";

import ProgressBar from "@/components/progressbar/ProgressBar";

interface response {
  FatherOrder: FatherOrder; // ID de asignación
  Lines: OrderLine[];
  recount: number;        // ID del usuario
}

const Picking = ({ params }: { params: { orderCode: string } }) => {
  const [order, setOrder] = useState<response | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [receivedAmount, setReceivedAmount] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [labelData, setLabelData] = useState<OrderLineLabelProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [numCopies, setNumCopies] = useState<string>("");
  const [selectedPrinter, setSelectedPrinter] = useState<ZebraPrinter | null>(null);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isLabelOpen, onOpen: onLabelOpen, onClose: onLabelClose } = useDisclosure();
  const { isOpen: isOrderOpne, onOpen: onOrderOpen, onClose: onOrderClose } = useDisclosure();
  // const { isOpen2, onOpen2, onClose2 } = useDisclosure();
  //const { isOpen: isLabelOpen2, onOpen: onLabelOpen2, onClose: onLabelClose2 } = useDisclosure();


  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL as string;




  const toast = useToast(); // Inicializa useToast
  const fetchOrder = async () => {
    const token = Cookies.get("erp_token");


    try {

      const response = await axios.get<{
        Results:
        {
          recount: number;
          data: response
        }
      }>(`${apiUrl}/fatherOrder/orderLines?page=${currentPage - 1}&page_size=10&father_order_code=${params.orderCode}${query}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      let fatherOrderWithLines = response.data.Results.data;

      if (fatherOrderWithLines) {
        setOrder(fatherOrderWithLines);
        let pages = response.data.Results.recount / 10
        pages > 1 ? setTotalPages(Math.ceil(pages)) : setTotalPages(1)
      }
    } catch (error) {
      console.error("Error cargando pedido:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [params.orderCode, query, currentPage]);

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
        console.log(response.data.Results.data);
        const { brand, brand_address, brand_email, ean, asin, company } = response.data.Results.data;
        setLabelData({ label: { brand, brandAddress: brand_address, brandEmail: brand_email, ean, asin, company }, isOpen: isLabelOpen, onClose: onLabelClose });
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
      console.log(response.data.Results.data);
      const { brand, brand_address, brand_email, ean, asin, company } = response.data.Results.data;
      let zpl = '';
      const totalCopies = parseInt(numCopies);
      for (let i = 0; i < totalCopies; i++) {
        zpl += `
         ^XA
          ^CI28
          ^FO5,5^A0,20,20^FDEmpresa: ${company}^FS
          ^FO5,35^A0,20,20^FDMarca: ${brand}^FS
          ^FO5,65^A0,20,15^FDDirección: ${brand_address}^FS
          ^FO5,95^A0,20,20^FDE-Mail: ${brand_email}^FS
          ^FO5,125^BY2,2,30
          ^BCN,40,Y,N,N^FD${ean}^FS
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
    <Box maxW="1400px" mx="auto" p={4}>
      <Heading size="lg" mb={4} textAlign="center">Detalles del pedido padre: {order?.FatherOrder.code}</Heading>
      <Stack spacing={4} mb={4} direction={{ base: "column", md: "row" }} align="center" justify="space-between">
        <Text fontSize={{ base: "sm", md: "md" }}>Tipo: {order?.FatherOrder.type}</Text>
        <Flex flexDirection={"row"} >Status: <Select orderId={order?.FatherOrder.id} status={order?.FatherOrder.status} statusId={order?.FatherOrder.status_id} father={true} /> </Flex>
        <Button backgroundColor={"#FACC15"} onClick={onOrderOpen}>Órdenes de compra</Button>

      </Stack>


      <Stack spacing={4} mb={4} direction={{ base: "column", md: "row" }} align="center" justify="space-between">
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
        <Stack my={4} sx={{ position: 'sticky', top: '1px', zIndex: 1000, backgroundColor: 'white' }}>
          <SearchBar searchParams={["ean", "ref_prov"]} searchValue={query} setSearchValue={setQuery} />
        </Stack>
        <Table variant="simple" size="sm" mt={4}>
          <Thead bg="gray.100">
            <Tr>
              <Th>SKU</Th>
              <Th>Ean</Th>
              <Th>Nombre</Th>
              <Th>Proveedor</Th>
              <Th>Ref Prov</Th>
              <Th>Cantidad</Th>
              <Th>Responsable</Th>
              <Th>Ubicaciones</Th>
              <Th>Acciones</Th>
              <Th>Etiqueta</Th>
            </Tr>
          </Thead>
          <Tbody>
            {order?.Lines && order.Lines.length > 0 ?
              (order?.Lines.map((line: OrderLine) => (
                <Tr key={line.id}>
                  <Td>{line.main_sku}</Td>
                  <Td>{line.ean}</Td>
                  <Td>{line.name.substring(0, 25) + ' ...'}</Td>
                  <Td>{line.supplier}</Td>
                  <Td>{line.supplier_reference}</Td>
                  <Td><ProgressBar total={line.quantity} completed={line.recived_quantity} /></Td>
                  <Td>{line.AssignedUser.user_name}</Td>
                  <Td>{line.locations}</Td>
                  <Td>
                    <Flex gap={2}>
                      <IconButton aria-label="Incrementar" icon={<AddIcon />} onClick={() => handleIncrementModal(line.id, line.quantity, line.recived_quantity)} size="sm" />
                      <IconButton aria-label="Asignar" icon={<LockIcon />} onClick={() => assignUser(line.id)} size="sm" />
                    </Flex>
                  </Td>
                  <Td>
                    <Flex gap={2}>
                      <IconButton aria-label="Imprimir" icon={<SlPrinter />} onClick={() => handleZebra(line.id)} size="sm" />
                      <IconButton aria-label="Información" icon={<InfoIcon />} onClick={() => handleLabelModal(line.id)} size="sm" />
                    </Flex>
                  </Td>
                </Tr>
              ))) : (<Tr>
                <Td colSpan={10} textAlign="center">
                  No hay resultados.
                </Td>
              </Tr>)}
          </Tbody>
        </Table>
      </Box>

      {/* Mobil view*/}
      <Box
        overflow={"none"} display={{ base: "block", md: "none" }} mt={4}>
        <Stack my={1} sx={{ position: 'fixed', bottom: 0, zIndex: 1000, backgroundColor: 'white' }}>
          <SearchBar searchParams={["ean", "ref_prov"]} searchValue={query} setSearchValue={setQuery} />
        </Stack>

        {order?.Lines && order.Lines.length > 0 ?
          (order?.Lines.map((line) => (
            <VStack key={line.id + "-" + line.ean} borderWidth="1px" borderRadius="lg" p={4} mb={2}>
              <Flex width={"100%"} justify="space-between" align="center">
                <Text width={"40%"} align="left" fontSize="sm"><b>SKU</b><br /> {line.main_sku}</Text>
                <Text width={"55%"} align="left" fontSize="sm"><b>EAN</b><br /> {line.ean}</Text>
              </Flex>
              <Flex width={"100%"} justify="space-between">
                <Text width={"40%"} align="left" fontSize="sm"><b>Proveedor</b><br /> {line.supplier}</Text>
                <Text width={"55%"} align="left" fontSize="sm"><b>Codigo</b><br /> {line.supplier_reference}</Text>
              </Flex>
              <Flex width={"100%"} justify="space-between">
                <Text width={"40%"} align="left" fontSize="sm"><b>Usuario</b><br /> {line.AssignedUser.user_name}</Text>
                <Text width={"55%"} align="left" fontSize="sm"><b>Ubicación</b><br /> {line.locations}</Text>

              </Flex>


              <Flex width={"100%"} fontSize="sm"> <ProgressBar total={line.quantity} completed={line.recived_quantity} /></Flex>
              <Flex gap={2} justify="center">
                <IconButton aria-label="Incrementar" icon={<AddIcon />} onClick={() => handleIncrementModal(line.id, line.quantity, line.recived_quantity)} size="lg" />
                <IconButton aria-label="Asignar" icon={<LockIcon />} onClick={() => assignUser(line.id)} size="lg" />
              </Flex>
              <Flex gap={2} >
                <IconButton aria-label="Imprimir" icon={<SlPrinter />} onClick={() => handleZebra(line.id)} size="lg" />
                <IconButton aria-label="Información" icon={<InfoIcon />} onClick={() => handleLabelModal(line.id)} size="lg" />

              </Flex>
            </VStack>
          ))) : (
            <Text textAlign="center" fontSize="lg" mt={4}>
              No hay resultados.
            </Text>)}
      </Box>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />

      <OrderModal
        isOpen={isOrderOpne}
        onClose={onOrderClose}
        orders={order?.FatherOrder.Childs ?? []}
      />



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

