"use client";
import Cookies from 'js-cookie'

interface IncrementProps {
  isOpen: boolean;
  onClose: () => void;
  selectedId: number | null;
  receivedAmount: number;
  orderId: number | null;
  totalAmount: number;
  fetchOrder: () => Promise<void>;

}
interface Pallet {
  id: number;
  number: number;
  label: string;
  Boxes: Box[];
  IsClose: number;
}

interface Box {
  id: number;
  pallet: number;
  quantity: number;
  label: string;
  number: number;
  IsClose: number;
}
import { Button, Select, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalOverlay, Spinner, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";

const Increment: React.FC<IncrementProps> = ({
  isOpen,
  onClose,
  selectedId,
  receivedAmount,
  totalAmount,
  orderId,
  fetchOrder
}) => {
  const OPEN = 0;
  const CLOSE = 1;
  const NO_PALLET: number = 0;
  const [inputValue, setInputValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL as string;

  const [pallets, setPallets] = useState<Pallet[]>([]);
  const [boxes, setBoxes] = useState<Box[]>([]);

  const [selectedPallet, setSelectedPallet] = useState<string>("");
  const [selectedBox, setSelectedBox] = useState<string>("");

  const filterBoxes = () => {
    const boxList = pallets.flatMap(pallet => pallet.Boxes)
    setBoxes(boxList)
  }
  useEffect(() => { if (selectedPallet) { filterBoxes() } }, [selectedPallet])
  const fetchPallets = async () => {
    if (!orderId) return;

    setLoading(true);
    setPallets([]);
    setBoxes([]);
    try {
      const token = Cookies.get("erp_token");
      const response = await axios.get(

        `${apiUrl}/pallet/crossDataByOrderId?page=0&page_size=200&order_id=${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data: Pallet[] = response.data.Results.data;
      const parsedPallets = data.filter(pallet => pallet.number == NO_PALLET).map((pallet) => ({
        ...pallet,
        Boxes: pallet.Boxes.map((box) => ({
          ...box,
        })),
      }));

      setPallets(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    if (isOpen) {
      fetchPallets()
      setInputValue("")
      setSelectedPallet("")
      setSelectedBox("")
    }
  }, [isOpen])

  const toast = useToast();
  const incrementReceived = async () => {
    if (selectedId === null || inputValue === "") return;
    var pallet = 1;
    var box = 1;
    const token = Cookies.get("erp_token");
    const inputValueNumber = Number(inputValue)
    let newReceivedAmount = 0;
    let endpoint = ""

    if (inputValueNumber > 0) {
      newReceivedAmount = inputValueNumber
      endpoint = "/add"
    } else {
      newReceivedAmount = inputValueNumber * -1
      endpoint = "/remove"
    }
    if (selectedBox?.match("new")) {
      var size = boxes.length
      var lastNumber = Math.max(...boxes.flatMap(box => box.number));
      box = size > 0 ? lastNumber + 1 : 1
      if (inputValueNumber <= 0) {
        alert("Estas introduciendo un numero negativo en una caja nueva")
        return;

      }
    } else {
      box = parseInt(selectedBox);
    }

    try {
      const response = await axios.patch(`${apiUrl}/order/orderLines${endpoint}`, {
        data: [{
          id: selectedId,
          recived_quantity: newReceivedAmount,
        }],
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 202 && !response.data.Results.Errors) {
        //TODO: en el backend tendra que ser una unica llamada done se realicen las dos acciones
        const response_boxes = await axios.post(`${apiUrl}/order_line_boxes/withProcess`, {
          data: [{
            boxNumber: box,
            palletNumber: NO_PALLET,
            orderLineId: selectedId,
            quantity: inputValueNumber,
            isClose: OPEN
          }]
        }, {
          headers: { Authorization: `Bearer ${token}` }
        })
        await fetchOrder();
      } else {

        toast({
          title: 'Error',
          description: 'Ha ocurrido un error al agregar el artículo',
          status: 'error',
          duration: 5000,
          isClosable: true,

        })
      }
    } catch (error) {
      console.error("Error incrementando la cantidad recibida:", error);
    } finally {
      onClose();
    }
  };

  if (loading) {
    return <Spinner size="xl" />;
  }

  const handleChange = (type: "pallets" | "boxes", value: string) => {
    if (type === "pallets") {
      setSelectedPallet(value)
    } else if (type === "boxes") {
      setSelectedBox(value)
    }
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent p={4} mt={6}>
        <ModalCloseButton />
        <ModalBody>
          <Input
            type="number"
            min="1"
            value={inputValue}
            placeholder="Ingrese la cantidad"
            onChange={(e) => setInputValue(e.target.value)}
          />

          <Select
            placeholder="Selecciona caja"
            onChange={(e) => handleChange("boxes", e.target.value)}
            onClick={filterBoxes}
          >
            <option value="new">Nueva caja</option>
            {boxes.length > 0 &&
              boxes.sort().filter((box) => box.IsClose !== CLOSE).map((box) => (
                <option key={box.id} value={box.number}>
                  Caja # {box.number}
                </option>
              ))}
          </Select>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={incrementReceived} isDisabled={!selectedBox}>
            Confirmar
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
export default Increment
