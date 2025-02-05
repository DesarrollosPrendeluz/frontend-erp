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
}

interface Box {
  id: number;
  pallet: number;
  quantity: number;
  number: number;
}
import { Button, Select, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalOverlay, Spinner } from "@chakra-ui/react";
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
  const [inputValue, setInputValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL as string;

  const [pallets, setPallets] = useState<Pallet[]>([]);
  const [boxes, setBoxes] = useState<Box[]>([]);

  const [selectedPallet, setSelectedPallet] = useState<string>("");
  const [selectedBox, setSelectedBox] = useState<string>("");

  const filterBoxes = (palletId: number) => {
    const results = pallets.find((pallet) => pallet.id == palletId)
    console.log(results)
    const boxList = results?.Boxes ?? []
    setBoxes(boxList)
  }
  useEffect(() => { if (selectedPallet) { filterBoxes } }, [selectedPallet])
  const fetchPallets = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("erp_token");
      console.log("Hola ?")
      const response = await axios.get(

        `${apiUrl}/pallet/crossDataByOrderId?page=0&page_size=200&order_id=${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data: Pallet[] = response.data.Results.data;

      const parsedPallets = data.map((pallet) => ({
        ...pallet,
        Boxes: pallet.Boxes.map((box) => ({
          ...box,
        })),
      }));

      setPallets(parsedPallets);
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
    }
  }, [isOpen])

  const incrementReceived = async () => {
    if (selectedId === null || inputValue === "") return;
    var pallet = 0;
    var box = 0;
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
    if (selectedPallet?.match("new")) {
      var size = pallets.length
      pallet = size > 0 ? pallets[size - 1].number : 1
      size = boxes.length
      box = size > 0 ? boxes[size - 1].number : 1
    } else if (selectedBox?.match("new")) {
      var size = boxes.length
      box = size > 0 ? boxes[size - 1].number : 1
    } else {
      box = parseInt(selectedBox);
      pallet = parseInt(selectedPallet);
    }
    try {
      const response = await axios.post(`${apiUrl}/order_line_boxes/withProcess`, {
        data: [{
          boxNumber: box,
          palletNumber: pallet,
          orderLineId: selectedId,
          quantity: newReceivedAmount,
          isClose: OPEN
        }]
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
    } catch (err) {
      console.log(err)
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

      if (response.status === 202) {
        await fetchOrder();
      }
    } catch (err) {
      console.error("Error incrementando la cantidad recibida:", err);
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
            placeholder="Selecciona pallet "
            onChange={(e) => handleChange("pallets", e.target.value)}
          >

            <option value="new">+</option> {/* Opción fija */}
            {pallets.length > 0 &&
              pallets.map((pallet) => (
                <option key={pallet.id} value={pallet.number}>
                  {pallet.number}
                </option>
              ))}


          </Select>
          <Select
            placeholder="Selecciona caja"
            isDisabled={!selectedPallet}
            onChange={(e) => handleChange("boxes", e.target.value)}
          >
            <option value="new">Nueva caja</option>
            {boxes.length > 0 &&
              boxes.map((box) => (
                <option key={box.id} value={box.number}>
                  {box.number}
                </option>
              ))}
          </Select>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={incrementReceived}>
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
